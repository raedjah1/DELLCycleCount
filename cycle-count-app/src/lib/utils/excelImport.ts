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
    throw new Error(`Excel parsing failed: ${error.message}`);
  }
}

// ============================================================================
// TRANSACTION IMPORT CONTRACT (Section 10.2)
// ============================================================================

export interface TransactionRow {
  TxnId: string;
  TxnTime: string;
  TxnType: string;
  PartNumber: string;
  Qty: number;
  FromLocation: string;
  ToLocation: string;
  RefDoc: string;
}

export interface TransactionImportResult {
  validRows: TransactionRow[];
  invalidRows: Array<{
    row: any;
    rowNumber: number;
    errors: string[];
  }>;
  duplicateTransactions: Array<{
    txnId: string;
    rowNumbers: number[];
  }>;
  summary: {
    totalRows: number;
    validRows: number;
    invalidRows: number;
    duplicateCount: number;
  };
}

/**
 * Parse Transaction Excel file
 * Required headers (exact): TxnId, TxnTime, TxnType, PartNumber, Qty, FromLocation, ToLocation, RefDoc
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
    const requiredHeaders = ['TxnId', 'TxnTime', 'TxnType', 'PartNumber', 'Qty', 'FromLocation', 'ToLocation', 'RefDoc'];
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
    const txnIdTracker = new Map<string, number[]>(); // Track duplicate TxnIds

    // Process data rows
    for (let i = 1; i < rawData.length; i++) {
      const rowData = rawData[i];
      const rowNumber = i + 1;
      const errors: string[] = [];

      // Extract required fields
      const txnId = rowData[headerMap.TxnId];
      const txnTime = rowData[headerMap.TxnTime];
      const txnType = rowData[headerMap.TxnType];
      const partNumber = rowData[headerMap.PartNumber];
      const qty = rowData[headerMap.Qty];
      const fromLocation = rowData[headerMap.FromLocation] || '';
      const toLocation = rowData[headerMap.ToLocation] || '';
      const refDoc = rowData[headerMap.RefDoc] || '';

      // Validate required fields
      if (!txnId) {
        errors.push('TxnId is required');
      }
      if (!txnTime) {
        errors.push('TxnTime is required');
      }
      if (!txnType) {
        errors.push('TxnType is required');
      }
      if (!partNumber) {
        errors.push('PartNumber is required');
      }
      if (qty === undefined || qty === null) {
        errors.push('Qty is required');
      }

      // Validate data types
      if (qty !== undefined && isNaN(Number(qty))) {
        errors.push('Qty must be a number');
      }

      // Validate timestamp
      if (txnTime) {
        const date = new Date(txnTime);
        if (isNaN(date.getTime())) {
          errors.push('TxnTime must be a valid date');
        }
      }

      // Track duplicate TxnIds
      if (txnId) {
        if (!txnIdTracker.has(txnId)) {
          txnIdTracker.set(txnId, []);
        }
        txnIdTracker.get(txnId)!.push(rowNumber);
      }

      if (errors.length > 0) {
        invalidRows.push({
          row: rowData,
          rowNumber,
          errors
        });
      } else {
        validRows.push({
          TxnId: txnId,
          TxnTime: txnTime,
          TxnType: txnType,
          PartNumber: partNumber,
          Qty: Number(qty),
          FromLocation: fromLocation,
          ToLocation: toLocation,
          RefDoc: refDoc
        });
      }
    }

    // Find duplicates
    const duplicateTransactions = Array.from(txnIdTracker.entries())
      .filter(([_, rowNumbers]) => rowNumbers.length > 1)
      .map(([txnId, rowNumbers]) => ({ txnId, rowNumbers }));

    return {
      validRows,
      invalidRows,
      duplicateTransactions,
      summary: {
        totalRows: rawData.length - 1,
        validRows: validRows.length,
        invalidRows: invalidRows.length,
        duplicateCount: duplicateTransactions.length
      }
    };

  } catch (error) {
    throw new Error(`Excel parsing failed: ${error.message}`);
  }
}

// ============================================================================
// EXCEL FILE VALIDATION
// ============================================================================

export function validateExcelFile(file: File): { isValid: boolean; error?: string } {
  // Check file type
  const validTypes = [
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  ];
  
  if (!validTypes.includes(file.type) && !file.name.match(/\.(xls|xlsx)$/i)) {
    return {
      isValid: false,
      error: 'File must be an Excel file (.xls or .xlsx)'
    };
  }

  // Check file size (max 10MB)
  const maxSize = 10 * 1024 * 1024;
  if (file.size > maxSize) {
    return {
      isValid: false,
      error: 'File size must be less than 10MB'
    };
  }

  return { isValid: true };
}
