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
  LocationCode: string;
  Warehouse: string;
  Business: string;
  Aisle: string;
  Bay: string;
  PositionLevel: string;
  Zone: string;
  RiskLocation: string; // 'Yes'/'No' or boolean
  RiskReason?: string;
}

export interface ItemRow {
  PartNumber: string;
  Description: string;
  ProductType: string;
  WarehouseType: string; // 'Rawgoods'/'Production'/'Finishedgoods'
  ABCClass: string; // 'A'/'B'/'C'
  StandardCost: number;
  RawGoodsSerialRequired: string; // 'Yes'/'No' or boolean
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

    // Required field validation
    if (!row.LocationCode) {
      errors.push(`Row ${rowNum}: LocationCode is required.`);
      hasError = true;
    }
    if (!row.Warehouse) {
      errors.push(`Row ${rowNum}: Warehouse is required.`);
      hasError = true;
    }
    if (!row.Zone) {
      errors.push(`Row ${rowNum}: Zone is required.`);
      hasError = true;
    }

    // Location code format validation
    if (row.LocationCode && !isValidLocationCode(row.LocationCode)) {
      errors.push(`Row ${rowNum}: Invalid LocationCode format '${row.LocationCode}'. Expected: Warehouse.Business.Aisle.Bay.PositionLevel`);
      hasError = true;
    }

    // Location code consistency check
    if (row.LocationCode && isValidLocationCode(row.LocationCode)) {
      const parsed = parseLocationCode(row.LocationCode);
      if (parsed) {
        if (row.Warehouse && parsed.warehouse !== row.Warehouse) {
          warnings.push(`Row ${rowNum}: LocationCode warehouse '${parsed.warehouse}' doesn't match Warehouse field '${row.Warehouse}'.`);
        }
        if (row.Business && parsed.business !== row.Business) {
          warnings.push(`Row ${rowNum}: LocationCode business '${parsed.business}' doesn't match Business field '${row.Business}'.`);
        }
        if (row.Aisle && parsed.aisle !== row.Aisle) {
          warnings.push(`Row ${rowNum}: LocationCode aisle '${parsed.aisle}' doesn't match Aisle field '${row.Aisle}'.`);
        }
      }
    }

    // Duplicate location check
    if (row.LocationCode) {
      if (seenLocations.has(row.LocationCode)) {
        errors.push(`Row ${rowNum}: Duplicate LocationCode '${row.LocationCode}' found in this batch.`);
        hasError = true;
      } else {
        seenLocations.add(row.LocationCode);
      }
    }

    // Risk location validation
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

    // Validate warehouse type (if provided)
    const validWarehouses = ['Rawgoods', 'Production', 'Finishedgoods'];
    if (row.Warehouse && !validWarehouses.includes(row.Warehouse)) {
      warnings.push(`Row ${rowNum}: Unknown Warehouse type '${row.Warehouse}'. Expected: ${validWarehouses.join(', ')}.`);
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

    // Required field validation
    if (!row.PartNumber) {
      errors.push(`Row ${rowNum}: PartNumber is required.`);
      hasError = true;
    }
    if (!row.Description) {
      errors.push(`Row ${rowNum}: Description is required.`);
      hasError = true;
    }
    if (!row.ProductType) {
      errors.push(`Row ${rowNum}: ProductType is required.`);
      hasError = true;
    }
    if (!row.WarehouseType) {
      errors.push(`Row ${rowNum}: WarehouseType is required.`);
      hasError = true;
    }

    // Duplicate part number check
    if (row.PartNumber) {
      if (seenPartNumbers.has(row.PartNumber)) {
        errors.push(`Row ${rowNum}: Duplicate PartNumber '${row.PartNumber}' found in this batch.`);
        hasError = true;
      } else {
        seenPartNumbers.add(row.PartNumber);
      }
    }

    // Warehouse type validation
    const validWarehouseTypes = ['Rawgoods', 'Production', 'Finishedgoods'];
    if (row.WarehouseType && !validWarehouseTypes.includes(row.WarehouseType)) {
      errors.push(`Row ${rowNum}: Invalid WarehouseType '${row.WarehouseType}'. Expected: ${validWarehouseTypes.join(', ')}.`);
      hasError = true;
    }

    // ABC class validation
    if (row.ABCClass && !['A', 'B', 'C'].includes(row.ABCClass.toUpperCase())) {
      warnings.push(`Row ${rowNum}: Invalid ABCClass '${row.ABCClass}'. Expected: A, B, or C.`);
    }

    // Standard cost validation
    if (typeof row.StandardCost !== 'number' || isNaN(row.StandardCost) || row.StandardCost < 0) {
      warnings.push(`Row ${rowNum}: StandardCost should be a non-negative number. Current value: '${row.StandardCost}'.`);
    }

    // ProductType validation (common types)
    const commonProductTypes = ['Laptop', 'Server', 'Switches', 'Desktop', 'AIO'];
    if (row.ProductType && !commonProductTypes.includes(row.ProductType)) {
      warnings.push(`Row ${rowNum}: ProductType '${row.ProductType}' is not in common types list. This may be intentional.`);
    }

    // Serial required validation (for Raw Goods)
    if (row.WarehouseType === 'Rawgoods' && row.RawGoodsSerialRequired) {
      const serialValue = row.RawGoodsSerialRequired.toString().toLowerCase();
      if (!['yes', 'no', 'true', 'false', '1', '0'].includes(serialValue)) {
        warnings.push(`Row ${rowNum}: RawGoodsSerialRequired value '${row.RawGoodsSerialRequired}' should be Yes/No or True/False.`);
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
