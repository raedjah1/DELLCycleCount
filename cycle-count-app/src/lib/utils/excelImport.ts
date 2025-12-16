// ============================================================================
// EXCEL IMPORT UTILITIES
// ============================================================================
// Handles Excel file parsing for OnHand and Transaction imports

import * as XLSX from 'xlsx';
import { parseLocationCode } from './locationParser';

// ============================================================================
// ONHAND IMPORT CONTRACT (Section 10.1)
// ============================================================================

export interface OnHandRow {
  AsOfTimestamp: string;
  LocationCode: string;
  PartNumber: string;
  ExpectedQty: number;
}

export interface OnHandImportResult {
  validRows: OnHandRow[];
  invalidRows: Array<{
    row: any;
    rowNumber: number;
    errors: string[];
  }>;
  summary: {
    totalRows: number;
    validRows: number;
    invalidRows: number;
    dataQualityIssues: number;
  };
}

/**
 * Parse OnHand Excel file
 * Required headers (exact): AsOfTimestamp, LocationCode, PartNumber, ExpectedQty
 */
export async function parseOnHandExcel(file: File): Promise<OnHandImportResult> {
  try {
    const buffer = await file.arrayBuffer();
    const workbook = XLSX.read(buffer, { type: 'array' });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    
    // Convert to JSON with header row
    const rawData = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as any[][];
    
    if (rawData.length === 0) {
      throw new Error('Excel file is empty');
    }

    // Validate headers
    const headers = rawData[0] as string[];
    const requiredHeaders = ['AsOfTimestamp', 'LocationCode', 'PartNumber', 'ExpectedQty'];
    const missingHeaders = requiredHeaders.filter(h => !headers.includes(h));
    
    if (missingHeaders.length > 0) {
      throw new Error(`Missing required headers: ${missingHeaders.join(', ')}`);
    }

    // Get header indices
    const headerMap = headers.reduce((map, header, index) => {
      map[header] = index;
      return map;
    }, {} as Record<string, number>);

    const validRows: OnHandRow[] = [];
    const invalidRows: Array<{ row: any; rowNumber: number; errors: string[] }> = [];

    // Process data rows (skip header)
    for (let i = 1; i < rawData.length; i++) {
      const rowData = rawData[i];
      const rowNumber = i + 1; // Excel row number
      const errors: string[] = [];

      // Extract required fields
      const asOfTimestamp = rowData[headerMap.AsOfTimestamp];
      const locationCode = rowData[headerMap.LocationCode];
      const partNumber = rowData[headerMap.PartNumber];
      const expectedQty = rowData[headerMap.ExpectedQty];

      // Validate required fields
      if (!asOfTimestamp) {
        errors.push('AsOfTimestamp is required');
      }
      if (!locationCode) {
        errors.push('LocationCode is required');
      }
      if (!partNumber) {
        errors.push('PartNumber is required');
      }
      if (expectedQty === undefined || expectedQty === null) {
        errors.push('ExpectedQty is required');
      }

      // Validate data types
      if (expectedQty !== undefined && (isNaN(Number(expectedQty)) || Number(expectedQty) < 0)) {
        errors.push('ExpectedQty must be a non-negative number');
      }

      // Validate location format
      if (locationCode) {
        const parsedLocation = parseLocationCode(locationCode);
        if (!parsedLocation.isValid) {
          errors.push(`Invalid location format: ${parsedLocation.errorMessage}`);
        }
      }

      // Validate timestamp format
      if (asOfTimestamp) {
        const date = new Date(asOfTimestamp);
        if (isNaN(date.getTime())) {
          errors.push('AsOfTimestamp must be a valid date');
        }
      }

      if (errors.length > 0) {
        invalidRows.push({
          row: rowData,
          rowNumber,
          errors
        });
      } else {
        validRows.push({
          AsOfTimestamp: asOfTimestamp,
          LocationCode: locationCode,
          PartNumber: partNumber,
          ExpectedQty: Number(expectedQty)
        });
      }
    }

    return {
      validRows,
      invalidRows,
      summary: {
        totalRows: rawData.length - 1, // Exclude header
        validRows: validRows.length,
        invalidRows: invalidRows.length,
        dataQualityIssues: invalidRows.filter(r => 
          r.errors.some(e => e.includes('Invalid location format'))
        ).length
      }
    };

  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`Excel parsing failed: ${message}`);
  }
}

// ============================================================================
// TRANSACTION IMPORT CONTRACT
// ============================================================================

export interface TransactionRow {
  PartNo: string;
  SerialNo: string;
  Qty: number;
  Source: string;
  PartTransactionType: string;
}

export interface TransactionImportResult {
  validRows: TransactionRow[];
  invalidRows: Array<{
    row: any;
    rowNumber: number;
    errors: string[];
  }>;
  summary: {
    totalRows: number;
    validRows: number;
    invalidRows: number;
  };
}

/**
 * Parse Transaction Excel file
 * Required headers: PartNo, SerialNo, Qty, Source, PartTransactionType
 * Only extracts: PartNo, SerialNo, Qty, Source, PartTransactionType
 */
export async function parseTransactionExcel(file: File): Promise<TransactionImportResult> {
  try {
    const buffer = await file.arrayBuffer();
    const workbook = XLSX.read(buffer, { type: 'array' });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    
    const rawData = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as any[][];
    
    if (rawData.length === 0) {
      throw new Error('Excel file is empty');
    }

    // Validate headers
    const headers = rawData[0] as string[];
    const requiredHeaders = ['PartNo', 'SerialNo', 'Qty', 'Source', 'PartTransactionType'];
    const missingHeaders = requiredHeaders.filter(h => !headers.includes(h));
    
    if (missingHeaders.length > 0) {
      throw new Error(`Missing required headers: ${missingHeaders.join(', ')}`);
    }

    // Get header indices
    const headerMap = headers.reduce((map, header, index) => {
      map[header] = index;
      return map;
    }, {} as Record<string, number>);

    const validRows: TransactionRow[] = [];
    const invalidRows: Array<{ row: any; rowNumber: number; errors: string[] }> = [];

    // Process data rows
    for (let i = 1; i < rawData.length; i++) {
      const rowData = rawData[i];
      const rowNumber = i + 1;
      const errors: string[] = [];

      // Extract required fields
      const partNo = rowData[headerMap['PartNo']];
      const serialNo = rowData[headerMap['SerialNo']];
      const qty = rowData[headerMap['Qty']];
      const source = rowData[headerMap['Source']];
      const partTransactionType = rowData[headerMap['PartTransactionType']];

      // Validate required fields
      if (!partNo || (typeof partNo === 'string' && !partNo.trim())) {
        errors.push('PartNo is required');
      }
      if (!serialNo || (typeof serialNo === 'string' && !serialNo.trim())) {
        errors.push('SerialNo is required');
      }
      if (qty === undefined || qty === null) {
        errors.push('Qty is required');
      }
      if (!source || (typeof source === 'string' && !source.trim())) {
        errors.push('Source is required');
      }
      if (!partTransactionType || (typeof partTransactionType === 'string' && !partTransactionType.trim())) {
        errors.push('PartTransactionType is required');
      }

      // Validate data types
      if (qty !== undefined && (isNaN(Number(qty)) || Number(qty) < 0)) {
        errors.push('Qty must be a non-negative number');
      }

      if (errors.length > 0) {
        invalidRows.push({
          row: rowData,
          rowNumber,
          errors
        });
      } else {
        validRows.push({
          PartNo: String(partNo).trim(),
          SerialNo: String(serialNo).trim(),
          Qty: Number(qty),
          Source: String(source).trim(),
          PartTransactionType: String(partTransactionType).trim()
        });
      }
    }

    return {
      validRows,
      invalidRows,
      summary: {
        totalRows: rawData.length - 1,
        validRows: validRows.length,
        invalidRows: invalidRows.length
      }
    };

  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`Excel parsing failed: ${message}`);
  }
}

// ============================================================================
// RAW GOODS IMPORT CONTRACT
// ============================================================================

export interface RawGoodsRow {
  PartNo: string;
  AvailableQty: number;
  Bin: string; // Location after first dot
  PalletBoxNo: string;
  Warehouse: string;
}

export interface RawGoodsImportResult {
  validRows: RawGoodsRow[];
  invalidRows: Array<{
    row: any;
    rowNumber: number;
    errors: string[];
  }>;
  summary: {
    totalRows: number;
    validRows: number;
    invalidRows: number;
  };
}

/**
 * Parse Raw Goods Excel file
 * Required headers: PartNo, AvailableQty, Bin, PalletBoxNo, Warehouse
 * Only extracts: PartNo, AvailableQty, Bin (after first dot), PalletBoxNo, Warehouse
 */
export async function parseRawGoodsExcel(file: File): Promise<RawGoodsImportResult> {
  try {
    const buffer = await file.arrayBuffer();
    const workbook = XLSX.read(buffer, { type: 'array' });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    
    // Convert to JSON with header row
    const rawData = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as any[][];
    
    if (rawData.length === 0) {
      throw new Error('Excel file is empty');
    }

    // Validate headers
    const headers = rawData[0] as string[];
    const requiredHeaders = ['PartNo', 'AvailableQty', 'Bin', 'PalletBoxNo', 'Warehouse'];
    const missingHeaders = requiredHeaders.filter(h => !headers.includes(h));
    
    if (missingHeaders.length > 0) {
      throw new Error(`Missing required headers: ${missingHeaders.join(', ')}`);
    }

    // Get header indices
    const headerMap = headers.reduce((map, header, index) => {
      map[header] = index;
      return map;
    }, {} as Record<string, number>);

    const validRows: RawGoodsRow[] = [];
    const invalidRows: Array<{ row: any; rowNumber: number; errors: string[] }> = [];

    // Process data rows (skip header)
    for (let i = 1; i < rawData.length; i++) {
      const rowData = rawData[i];
      const rowNumber = i + 1; // Excel row number
      const errors: string[] = [];

      // Extract required fields
      const partNo = rowData[headerMap['PartNo']];
      const availableQty = rowData[headerMap['AvailableQty']];
      const bin = rowData[headerMap['Bin']];
      const palletBoxNo = rowData[headerMap['PalletBoxNo']];
      const warehouse = rowData[headerMap['Warehouse']];

      // Validate required fields
      if (!partNo || (typeof partNo === 'string' && !partNo.trim())) {
        errors.push('PartNo is required');
      }
      if (availableQty === undefined || availableQty === null) {
        errors.push('AvailableQty is required');
      }
      if (!bin || (typeof bin === 'string' && !bin.trim())) {
        errors.push('Bin is required');
      }
      if (!warehouse || (typeof warehouse === 'string' && !warehouse.trim())) {
        errors.push('Warehouse is required');
      }

      // Validate data types
      if (availableQty !== undefined && (isNaN(Number(availableQty)) || Number(availableQty) < 0)) {
        errors.push('AvailableQty must be a non-negative number');
      }

      if (errors.length > 0) {
        invalidRows.push({
          row: rowData,
          rowNumber,
          errors
        });
      } else {
        validRows.push({
          PartNo: String(partNo).trim(),
          AvailableQty: Number(availableQty),
          Bin: String(bin).trim(), // Use Bin as-is, no extraction needed
          PalletBoxNo: palletBoxNo ? String(palletBoxNo).trim() : '',
          Warehouse: String(warehouse).trim()
        });
      }
    }

    return {
      validRows,
      invalidRows,
      summary: {
        totalRows: rawData.length - 1,
        validRows: validRows.length,
        invalidRows: invalidRows.length
      }
    };

  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`Excel parsing failed: ${message}`);
  }
}

// ============================================================================
// EXCEL FILE VALIDATION
// ============================================================================

// ============================================================================
// FINISHED GOODS IMPORT CONTRACT
// ============================================================================

export interface FinishedGoodsRow {
  PartNumber: string;
  SerialNo: string;
  PartLocation: string; // Location from ARB onwards
  Warehouse: string;
  PalletBoxNo: string;
}

export interface FinishedGoodsImportResult {
  validRows: FinishedGoodsRow[];
  invalidRows: Array<{
    row: any;
    rowNumber: number;
    errors: string[];
  }>;
  summary: {
    totalRows: number;
    validRows: number;
    invalidRows: number;
  };
}

/**
 * Parse Finished Goods Excel file
 * Required headers: Part Number, Serial No, Part Location No, Warehouse, Pallet Box No
 * Only extracts: Part Number, Serial No, Part Location (from ARB onwards), Warehouse, Pallet Box No
 */
export async function parseFinishedGoodsExcel(file: File): Promise<FinishedGoodsImportResult> {
  try {
    const buffer = await file.arrayBuffer();
    const workbook = XLSX.read(buffer, { type: 'array' });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    
    // Convert to JSON with header row
    const rawData = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as any[][];
    
    if (rawData.length === 0) {
      throw new Error('Excel file is empty');
    }

    // Validate headers
    const headers = rawData[0] as string[];
    const requiredHeaders = ['Part Number', 'Serial No', 'Part Location No', 'Warehouse', 'Pallet Box No'];
    const missingHeaders = requiredHeaders.filter(h => !headers.includes(h));
    
    if (missingHeaders.length > 0) {
      throw new Error(`Missing required headers: ${missingHeaders.join(', ')}`);
    }

    // Get header indices
    const headerMap = headers.reduce((map, header, index) => {
      map[header] = index;
      return map;
    }, {} as Record<string, number>);

    const validRows: FinishedGoodsRow[] = [];
    const invalidRows: Array<{ row: any; rowNumber: number; errors: string[] }> = [];

    // Process data rows (skip header)
    for (let i = 1; i < rawData.length; i++) {
      const rowData = rawData[i];
      const rowNumber = i + 1; // Excel row number
      const errors: string[] = [];

      // Extract required fields
      const partNumber = rowData[headerMap['Part Number']];
      const serialNo = rowData[headerMap['Serial No']];
      const partLocationNo = rowData[headerMap['Part Location No']];
      const warehouse = rowData[headerMap['Warehouse']];
      const palletBoxNo = rowData[headerMap['Pallet Box No']];

      // Validate required fields
      if (!partNumber || (typeof partNumber === 'string' && !partNumber.trim())) {
        errors.push('Part Number is required');
      }
      if (!serialNo || (typeof serialNo === 'string' && !serialNo.trim())) {
        errors.push('Serial No is required');
      }
      if (!partLocationNo || (typeof partLocationNo === 'string' && !partLocationNo.trim())) {
        errors.push('Part Location No is required');
      }
      if (!warehouse || (typeof warehouse === 'string' && !warehouse.trim())) {
        errors.push('Warehouse is required');
      }

      // Extract location - everything after the first dot
      let partLocation = '';
      if (partLocationNo) {
        const locationStr = String(partLocationNo).trim();
        const firstDotIndex = locationStr.indexOf('.');
        
        if (firstDotIndex === -1) {
          errors.push(`Part Location must contain at least one dot (found: ${locationStr})`);
        } else {
          // Extract everything after the first dot
          partLocation = locationStr.substring(firstDotIndex + 1);
        }
      }

      if (errors.length > 0) {
        invalidRows.push({
          row: rowData,
          rowNumber,
          errors
        });
      } else {
        validRows.push({
          PartNumber: String(partNumber).trim(),
          SerialNo: String(serialNo).trim(),
          PartLocation: partLocation,
          Warehouse: String(warehouse).trim(),
          PalletBoxNo: palletBoxNo ? String(palletBoxNo).trim() : ''
        });
      }
    }

    return {
      validRows,
      invalidRows,
      summary: {
        totalRows: rawData.length - 1,
        validRows: validRows.length,
        invalidRows: invalidRows.length
      }
    };

  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`Excel parsing failed: ${message}`);
  }
}

export function validateExcelFile(file: File): { isValid: boolean; error?: string } {
  // Check file type
  const validTypes = [
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'text/csv'
  ];
  
  if (!validTypes.includes(file.type) && !file.name.match(/\.(xls|xlsx|csv)$/i)) {
    return {
      isValid: false,
      error: 'File must be an Excel file (.xls, .xlsx) or CSV (.csv)'
    };
  }

  // Check file size (max 20MB)
  const maxSize = 20 * 1024 * 1024;
  if (file.size > maxSize) {
    return {
      isValid: false,
      error: 'File size must be less than 20MB'
    };
  }

  return { isValid: true };
}
