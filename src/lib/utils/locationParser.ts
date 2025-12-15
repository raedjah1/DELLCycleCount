// ============================================================================
// LOCATION CODE PARSING AND VALIDATION
// ============================================================================
// Implements canonical location parsing per requirements Section 4.2

export interface ParsedLocation {
  isValid: boolean;
  warehouse: string;
  business: string;
  aisle: string;
  bayText: string;
  bayNum: number;
  positionLevel: string;
  positionNum: number;
  levelLetter: string;
  errorMessage?: string;
}

/**
 * Parse canonical location code: Warehouse.Business.Aisle.Bay.PositionLevel
 * 
 * Examples:
 * - "Reimage.ARB.AB.01.01A" ✅
 * - "Production.Main.CD.12.03B" ✅
 * - "Rawgoods.Receiving.EF.05.02C" ✅
 * 
 * Rules (Section 4.2):
 * - Exactly 5 dot-delimited segments
 * - Bay is numeric (e.g., 01, 12)
 * - PositionLevel is digits followed by single letter (e.g., 01A)
 * - Level letter normalized to uppercase
 */
export function parseLocationCode(locationCode: string): ParsedLocation {
  // Trim and basic validation
  const trimmed = locationCode?.trim();
  if (!trimmed) {
    return {
      isValid: false,
      warehouse: '',
      business: '',
      aisle: '',
      bayText: '',
      bayNum: 0,
      positionLevel: '',
      positionNum: 0,
      levelLetter: '',
      errorMessage: 'Location code is empty or null'
    };
  }

  // Split by dots
  const segments = trimmed.split('.');
  if (segments.length !== 5) {
    return {
      isValid: false,
      warehouse: '',
      business: '',
      aisle: '',
      bayText: '',
      bayNum: 0,
      positionLevel: '',
      positionNum: 0,
      levelLetter: '',
      errorMessage: `Expected 5 segments separated by dots, got ${segments.length}. Format: Warehouse.Business.Aisle.Bay.PositionLevel`
    };
  }

  const [warehouse, business, aisle, bayText, positionLevel] = segments;

  // Validate Bay is numeric
  const bayNum = parseInt(bayText, 10);
  if (isNaN(bayNum) || bayText !== bayNum.toString().padStart(bayText.length, '0')) {
    return {
      isValid: false,
      warehouse,
      business,
      aisle,
      bayText,
      bayNum: 0,
      positionLevel,
      positionNum: 0,
      levelLetter: '',
      errorMessage: `Bay must be numeric. Got: "${bayText}"`
    };
  }

  // Validate PositionLevel format: digits + single letter
  const positionLevelRegex = /^(\d+)([A-Za-z])$/;
  const positionMatch = positionLevel.match(positionLevelRegex);
  if (!positionMatch) {
    return {
      isValid: false,
      warehouse,
      business,
      aisle,
      bayText,
      bayNum,
      positionLevel,
      positionNum: 0,
      levelLetter: '',
      errorMessage: `PositionLevel must be digits followed by single letter. Got: "${positionLevel}"`
    };
  }

  const positionNum = parseInt(positionMatch[1], 10);
  const levelLetter = positionMatch[2].toUpperCase(); // Normalize to uppercase

  return {
    isValid: true,
    warehouse,
    business,
    aisle,
    bayText,
    bayNum,
    positionLevel,
    positionNum,
    levelLetter
  };
}

/**
 * Generate canonical route sort key for deterministic ordering
 * Sort order (Section 4.3):
 * 1. Warehouse
 * 2. Business  
 * 3. Aisle
 * 4. BayNum (numeric)
 * 5. PositionNum (numeric)
 * 6. Level (letter)
 */
export function generateRouteSortKey(parsed: ParsedLocation): string {
  if (!parsed.isValid) {
    return 'ZZZZZ_INVALID'; // Sort invalid locations to end
  }

  // Pad numbers for consistent sorting
  const bayPadded = parsed.bayNum.toString().padStart(3, '0');
  const positionPadded = parsed.positionNum.toString().padStart(3, '0');

  return `${parsed.warehouse}_${parsed.business}_${parsed.aisle}_${bayPadded}_${positionPadded}_${parsed.levelLetter}`;
}

/**
 * Simple validation check - returns true/false for a single location code
 */
export function isValidLocationCode(locationCode: string): boolean {
  const parsed = parseLocationCode(locationCode);
  return parsed.isValid;
}

/**
 * Validate multiple location codes for bulk operations
 */
export interface LocationValidationResult {
  valid: ParsedLocation[];
  invalid: Array<{
    locationCode: string;
    error: string;
  }>;
  summary: {
    total: number;
    validCount: number;
    invalidCount: number;
  };
}

export function validateLocationCodes(locationCodes: string[]): LocationValidationResult {
  const valid: ParsedLocation[] = [];
  const invalid: Array<{ locationCode: string; error: string }> = [];

  for (const locationCode of locationCodes) {
    const parsed = parseLocationCode(locationCode);
    if (parsed.isValid) {
      valid.push(parsed);
    } else {
      invalid.push({
        locationCode,
        error: parsed.errorMessage || 'Unknown parsing error'
      });
    }
  }

  return {
    valid,
    invalid,
    summary: {
      total: locationCodes.length,
      validCount: valid.length,
      invalidCount: invalid.length
    }
  };
}

/**
 * Format location for display (with route sort order)
 */
export function formatLocationForDisplay(locationCode: string): {
  formatted: string;
  sortKey: string;
  isValid: boolean;
} {
  const parsed = parseLocationCode(locationCode);
  
  if (!parsed.isValid) {
    return {
      formatted: `❌ ${locationCode}`,
      sortKey: 'ZZZZZ_INVALID',
      isValid: false
    };
  }

  return {
    formatted: `${parsed.warehouse}.${parsed.business}.${parsed.aisle}.${parsed.bayText}.${parsed.positionLevel}`,
    sortKey: generateRouteSortKey(parsed),
    isValid: true
  };
}
