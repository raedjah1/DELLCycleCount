// ============================================================================
// MASTER DATA IMPORT UTILITIES - Location & Item Excel Imports
// ============================================================================
// Utilities for handling Location and Item master data Excel file imports

import * as XLSX from 'xlsx';
import { isValidLocationCode, parseLocationCode } from './locationParser';

// ============================================================================
// LOCATION IMPORT TYPES & INTERFACES
// ============================================================================

export interface LocationRow {
  ProgramID: number;
  Warehouse?: string; // Can be empty
  LocationNo: string; // May start with dot, missing warehouse
  Building: string; // Maps to Business
  Bay: string; // Maps to Aisle
  Row: string; // Maps to Bay number
  Tier: string; // Maps to PositionLevel
  Bin?: string; // Full location code (e.g., ARB.AF.01.01B)
  LocationGroup?: string; // Maps to Zone
  Volume?: number;
  Height?: number;
  Width?: number;
  Length?: number;
  // Optional cycle count fields
  RiskLocation?: string; // 'Yes'/'No' or boolean
  RiskReason?: string;
}

export interface ItemRow {
  ID: number;
  Name: string;
  PartNo: string;
  Description: string;
  ManufacturePartNo?: string;
  ModelNo?: string;
  SerialFlag: string; // 'Y' or 'N'
  PrimaryCommodity?: string; // Can be 'NA'
  SecondaryCommodity?: string; // Can be 'NA'
  PartType: string; // 'Part', 'Component', etc.
  Status: string; // 'ACTIVE', etc.
  Username?: string; // Email of creator
  CreateDate?: string; // Date string
  LastActivityDate?: string; // Date string
  // Optional cycle count fields (can be added manually)
  WarehouseType?: string; // 'Rawgoods'/'Production'/'Finishedgoods'
  ABCClass?: string; // 'A'/'B'/'C'
  StandardCost?: number;
}

export interface ImportResult<T> {
  data: T[];
  errors: string[];
  warnings: string[];
  summary: {
    totalRows: number;
    validRows: number;
    errorRows: number;
    warningRows: number;
  };
}

// ============================================================================
// EXCEL FILE READING UTILITY
// ============================================================================

export async function readExcelFile<T>(file: File, expectedHeaders: string[]): Promise<ImportResult<T>> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const json: T[] = XLSX.utils.sheet_to_json<T>(worksheet);

        const errors: string[] = [];
        const warnings: string[] = [];

        if (json.length === 0) {
          errors.push('Excel file is empty or could not be parsed.');
          resolve({
            data: [],
            errors,
            warnings,
            summary: { totalRows: 0, validRows: 0, errorRows: 1, warningRows: 0 }
          });
          return;
        }

        // Validate headers
        const actualHeaders = Object.keys(json[0] || {});
        const missingHeaders = expectedHeaders.filter(header => !actualHeaders.includes(header));
        if (missingHeaders.length > 0) {
          errors.push(`Missing required headers: ${missingHeaders.join(', ')}`);
        }

        const summary = {
          totalRows: json.length,
          validRows: 0,
          errorRows: errors.length > 0 ? json.length : 0,
          warningRows: 0
        };

        resolve({ data: json, errors, warnings, summary });

      } catch (error: any) {
        reject(`Error reading Excel file: ${error.message}`);
      }
    };
    reader.onerror = (error) => {
      reject(`File reading error: ${error}`);
    };
    reader.readAsArrayBuffer(file);
  });
}

// ============================================================================
// LOCATION DATA VALIDATION
// ============================================================================

export function validateLocationData(data: LocationRow[]): ImportResult<LocationRow> {
  const validatedData: LocationRow[] = [];
  const errors: string[] = [];
  const warnings: string[] = [];
  const seenLocations = new Set<string>();

  data.forEach((row, index) => {
    const rowNum = index + 2; // Account for 0-indexed array and header row
    let hasError = false;

    // Required field validation (matching Location table structure)
    if (!row.Building) {
      errors.push(`Row ${rowNum}: Building is required.`);
      hasError = true;
    }
    if (!row.Bay) {
      errors.push(`Row ${rowNum}: Bay is required.`);
      hasError = true;
    }
    if (!row.Row) {
      errors.push(`Row ${rowNum}: Row is required.`);
      hasError = true;
    }
    if (!row.Tier) {
      errors.push(`Row ${rowNum}: Tier is required.`);
      hasError = true;
    }

    // Build canonical location code from parts
    // Format: Warehouse.Business.Aisle.Bay.PositionLevel
    // From your data: Building=ARB (Business), Bay=AF (Aisle), Row=01 (Bay), Tier=01B (PositionLevel)
    let warehouse = row.Warehouse || ''; // Can be empty
    const business = row.Building; // Building → Business
    const aisle = row.Bay; // Bay → Aisle
    const bay = row.Row; // Row → Bay number
    const positionLevel = row.Tier; // Tier → PositionLevel

    // If warehouse is empty, try to derive from Bin or LocationNo
    if (!warehouse && row.Bin) {
      // Bin format: ARB.AF.01.01B (missing warehouse)
      // Try to extract or use default
      warnings.push(`Row ${rowNum}: Warehouse is empty. Using default or derived value.`);
      warehouse = 'Reimage'; // Default warehouse, or derive from context
    }

    // Construct canonical location code
    const locationCode = warehouse 
      ? `${warehouse}.${business}.${aisle}.${bay}.${positionLevel}`
      : `${business}.${aisle}.${bay}.${positionLevel}`; // Fallback if no warehouse

    // Validate location code format (if warehouse provided)
    if (warehouse && !isValidLocationCode(locationCode)) {
      errors.push(`Row ${rowNum}: Invalid location code format. Expected: Warehouse.Business.Aisle.Bay.PositionLevel`);
      hasError = true;
    }

    // Check if Bin matches constructed code
    if (row.Bin) {
      const binParts = row.Bin.split('.');
      const constructedParts = locationCode.split('.');
      if (binParts.length >= 4 && constructedParts.length >= 4) {
        // Compare Business.Aisle.Bay.PositionLevel parts (skip warehouse)
        const binCore = binParts.slice(-4).join('.');
        const constructedCore = warehouse 
          ? constructedParts.slice(1).join('.') 
          : constructedParts.join('.');
        if (binCore !== constructedCore) {
          warnings.push(`Row ${rowNum}: Bin '${row.Bin}' doesn't match constructed location code '${locationCode}'.`);
        }
      }
    }

    // Duplicate location check (using canonical location code)
    if (locationCode) {
      if (seenLocations.has(locationCode)) {
        errors.push(`Row ${rowNum}: Duplicate location code '${locationCode}' found in this batch.`);
        hasError = true;
      } else {
        seenLocations.add(locationCode);
      }
    }

    // LocationGroup (Zone) validation
    if (!row.LocationGroup) {
      warnings.push(`Row ${rowNum}: LocationGroup (Zone) is not provided. This may affect journal assignment.`);
    }

    // Risk location validation (if provided)
    if (row.RiskLocation) {
      const riskValue = row.RiskLocation.toString().toLowerCase();
      if (!['yes', 'no', 'true', 'false', '1', '0'].includes(riskValue)) {
        warnings.push(`Row ${rowNum}: RiskLocation value '${row.RiskLocation}' should be Yes/No or True/False.`);
      }
      
      // If risk location is Yes/True, risk reason should be provided
      if (['yes', 'true', '1'].includes(riskValue) && !row.RiskReason) {
        warnings.push(`Row ${rowNum}: RiskReason should be provided when RiskLocation is '${row.RiskLocation}'.`);
      }
    }

    if (!hasError) {
      validatedData.push(row);
    }
  });

  return {
    data: validatedData,
    errors,
    warnings,
    summary: {
      totalRows: data.length,
      validRows: validatedData.length,
      errorRows: data.length - validatedData.length,
      warningRows: warnings.length
    }
  };
}

// ============================================================================
// ITEM DATA VALIDATION
// ============================================================================

export function validateItemData(data: ItemRow[]): ImportResult<ItemRow> {
  const validatedData: ItemRow[] = [];
  const errors: string[] = [];
  const warnings: string[] = [];
  const seenPartNumbers = new Set<string>();

  data.forEach((row, index) => {
    const rowNum = index + 2;
    let hasError = false;

    // Required field validation (matching Part table structure)
    if (!row.PartNo) {
      errors.push(`Row ${rowNum}: PartNo is required.`);
      hasError = true;
    }
    if (!row.Name) {
      errors.push(`Row ${rowNum}: Name is required.`);
      hasError = true;
    }
    if (!row.Description) {
      errors.push(`Row ${rowNum}: Description is required.`);
      hasError = true;
    }
    if (!row.PartType) {
      errors.push(`Row ${rowNum}: PartType is required.`);
      hasError = true;
    }
    if (!row.Status) {
      errors.push(`Row ${rowNum}: Status is required.`);
      hasError = true;
    }
    if (!row.SerialFlag) {
      errors.push(`Row ${rowNum}: SerialFlag is required (Y or N).`);
      hasError = true;
    }

    // Duplicate part number check
    if (row.PartNo) {
      if (seenPartNumbers.has(row.PartNo)) {
        errors.push(`Row ${rowNum}: Duplicate PartNo '${row.PartNo}' found in this batch.`);
        hasError = true;
      } else {
        seenPartNumbers.add(row.PartNo);
      }
    }

    // SerialFlag validation
    if (row.SerialFlag && !['Y', 'N', 'y', 'n'].includes(row.SerialFlag)) {
      errors.push(`Row ${rowNum}: SerialFlag must be 'Y' or 'N'. Found: '${row.SerialFlag}'.`);
      hasError = true;
    }

    // Status validation
    if (row.Status && !['ACTIVE', 'INACTIVE', 'active', 'inactive'].includes(row.Status)) {
      warnings.push(`Row ${rowNum}: Status '${row.Status}' is not a standard value. Expected: ACTIVE or INACTIVE.`);
    }

    // PartType validation (common types: Part, Component, etc.)
    const commonPartTypes = ['Part', 'Component'];
    if (row.PartType && !commonPartTypes.includes(row.PartType)) {
      warnings.push(`Row ${rowNum}: PartType '${row.PartType}' is not in common types. This may be intentional.`);
    }

    // Date validation (if provided)
    if (row.CreateDate) {
      const createDate = new Date(row.CreateDate);
      if (isNaN(createDate.getTime())) {
        warnings.push(`Row ${rowNum}: CreateDate '${row.CreateDate}' could not be parsed as a valid date.`);
      }
    }

    if (row.LastActivityDate) {
      const lastActivityDate = new Date(row.LastActivityDate);
      if (isNaN(lastActivityDate.getTime())) {
        warnings.push(`Row ${rowNum}: LastActivityDate '${row.LastActivityDate}' could not be parsed as a valid date.`);
      }
    }

    // Optional cycle count fields validation (if provided)
    if (row.WarehouseType) {
      const validWarehouseTypes = ['Rawgoods', 'Production', 'Finishedgoods'];
      if (!validWarehouseTypes.includes(row.WarehouseType)) {
        warnings.push(`Row ${rowNum}: WarehouseType '${row.WarehouseType}' is not standard. Expected: ${validWarehouseTypes.join(', ')}.`);
      }
    }

    if (row.ABCClass && !['A', 'B', 'C'].includes(row.ABCClass.toUpperCase())) {
      warnings.push(`Row ${rowNum}: ABCClass '${row.ABCClass}'. Expected: A, B, or C.`);
    }

    if (row.StandardCost !== undefined) {
      if (typeof row.StandardCost !== 'number' || isNaN(row.StandardCost) || row.StandardCost < 0) {
        warnings.push(`Row ${rowNum}: StandardCost should be a non-negative number. Current value: '${row.StandardCost}'.`);
      }
    }

    if (!hasError) {
      validatedData.push(row);
    }
  });

  return {
    data: validatedData,
    errors,
    warnings,
    summary: {
      totalRows: data.length,
      validRows: validatedData.length,
      errorRows: data.length - validatedData.length,
      warningRows: warnings.length
    }
  };
}

// ============================================================================
// FILE VALIDATION UTILITY
// ============================================================================

export function validateExcelFile(file: File): { isValid: boolean; error?: string } {
  if (!file) {
    return { isValid: false, error: 'No file selected' };
  }

  // Check file type
  const allowedTypes = [
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  ];
  
  if (!allowedTypes.includes(file.type)) {
    return { isValid: false, error: 'Please select an Excel file (.xls or .xlsx)' };
  }

  // Check file size (max 10MB)
  const maxSize = 10 * 1024 * 1024; // 10MB
  if (file.size > maxSize) {
    return { isValid: false, error: 'File size must be less than 10MB' };
  }

  return { isValid: true };
}

// ============================================================================
// EXPORT FUNCTIONS FOR LOCATION IMPORT
// ============================================================================

export async function parseLocationExcel(file: File): Promise<ImportResult<LocationRow>> {
  const requiredHeaders = [
    'LocationCode',
    'Warehouse', 
    'Business',
    'Aisle',
    'Bay',
    'PositionLevel',
    'Zone',
    'RiskLocation'
  ];

  try {
    const result = await readExcelFile<LocationRow>(file, requiredHeaders);
    
    if (result.errors.length > 0) {
      return result;
    }

    return validateLocationData(result.data);
  } catch (error: any) {
    return {
      data: [],
      errors: [error.message],
      warnings: [],
      summary: { totalRows: 0, validRows: 0, errorRows: 1, warningRows: 0 }
    };
  }
}

// ============================================================================
// EXPORT FUNCTIONS FOR ITEM IMPORT
// ============================================================================

export async function parseItemExcel(file: File): Promise<ImportResult<ItemRow>> {
  const requiredHeaders = [
    'PartNumber',
    'Description',
    'ProductType',
    'WarehouseType',
    'ABCClass',
    'StandardCost',
    'RawGoodsSerialRequired'
  ];

  try {
    const result = await readExcelFile<ItemRow>(file, requiredHeaders);
    
    if (result.errors.length > 0) {
      return result;
    }

    return validateItemData(result.data);
  } catch (error: any) {
    return {
      data: [],
      errors: [error.message],
      warnings: [],
      summary: { totalRows: 0, validRows: 0, errorRows: 1, warningRows: 0 }
    };
  }
}

