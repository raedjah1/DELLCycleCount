// ============================================================================
// LOCATION SERVICE - Backend operations for locations
// ============================================================================

import { createClient } from '@/lib/supabase/client';
import { LocationRow } from '@/lib/utils/masterDataImport';
import { parseLocationCode } from '@/lib/utils/locationParser';

export interface Location {
  id: string;
  program_id?: number;
  warehouse?: string;
  location_no?: string;
  building: string;
  bay: string;
  row: string;
  tier: string;
  bin?: string;
  location_group?: string;
  location_code: string;
  is_risk_location: boolean;
  risk_reason?: string;
  created_at: string;
  updated_at: string;
}

export class LocationService {
  private static supabase = createClient();

  // Insert locations from import
  static async insertLocations(locationRows: LocationRow[]): Promise<{ inserted: number; errors: string[] }> {
    const errors: string[] = [];
    const locationsToInsert: any[] = [];

    for (const row of locationRows) {
      try {
        // Build canonical location code - prioritize LocationNo if available
        // LocationNo can be:
        // 1. Code starting with dot: ".ARB.AF.01.01B" → remove dot, use as-is: "ARB.AF.01.01B"
        // 2. Full code: "3RJRAWG.ARB.A.03.A02" → use "ARB.A.03.A02" (everything after first dot)
        // Use Warehouse column value if available, otherwise use LocationNo as-is (no warehouse prefix)
        let warehouse = (row.Warehouse || '').toString().trim();
        let locationCode = '';
        const locationNo = (row.LocationNo || '').toString().trim();
        
        if (locationNo) {
          // If LocationNo starts with a dot, remove it and use as-is (no warehouse prefix)
          if (locationNo.startsWith('.')) {
            locationCode = locationNo.substring(1); // Remove leading dot, use as-is: "ARB.AF.01.01B"
          } else {
            // LocationNo is a full code (e.g., "3RJRAWG.ARB.A.03.A02")
            // Use everything after the first dot (e.g., "ARB.A.03.A02")
            const parts = locationNo.split('.');
            if (parts.length > 1) {
              locationCode = parts.slice(1).join('.'); // Everything after first segment
            } else {
              // LocationNo doesn't have dots, use as-is
              locationCode = locationNo;
            }
          }
          
          // If Warehouse column has a value, prepend it to make 5 segments
          if (warehouse) {
            locationCode = `${warehouse}.${locationCode}`;
          }
        } else {
          // Fallback: construct from individual fields
          const business = row.Building; // Building → Business
          const aisle = row.Bay; // Bay → Aisle
          const bay = row.Row; // Row → Bay number
          const positionLevel = row.Tier; // Tier → PositionLevel

          // If warehouse is empty, construct without warehouse (4 segments)
          if (warehouse) {
            locationCode = `${warehouse}.${business}.${aisle}.${bay}.${positionLevel}`;
          } else {
            locationCode = `${business}.${aisle}.${bay}.${positionLevel}`;
          }
        }

        // Convert RiskLocation to boolean
        let isRiskLocation = false;
        if (row.RiskLocation) {
          const riskValue = row.RiskLocation.toString().toLowerCase();
          isRiskLocation = ['yes', 'true', '1'].includes(riskValue);
        }

        // Validate location code has correct number of segments before inserting
        const segments = locationCode.split('.');
        const segmentCount = segments.length;
        if (segmentCount !== 4 && segmentCount !== 5) {
          errors.push(`Location ${row.LocationNo || row.Bin}: Invalid segment count (${segmentCount}). Expected 4 or 5 segments. Code: "${locationCode}"`);
          continue;
        }
        
        // Check for empty segments
        if (segments.some(seg => seg === '')) {
          errors.push(`Location ${row.LocationNo || row.Bin}: Location code has empty segments. Code: "${locationCode}"`);
          continue;
        }

        // Prepare location data (EXCLUDING Volume, Height, Width, Length)
        const locationData = {
          program_id: row.ProgramID || null,
          warehouse: warehouse || null,
          location_no: row.LocationNo || null,
          building: row.Building,
          bay: row.Bay,
          row: row.Row,
          tier: row.Tier,
          bin: row.Bin || null,
          location_group: row.LocationGroup || null,
          location_code: locationCode,
          is_risk_location: isRiskLocation,
          risk_reason: row.RiskReason || null
          // Volume, Height, Width, Length are NOT included - will default to 0
        };

        locationsToInsert.push(locationData);
      } catch (error: any) {
        errors.push(`Failed to process location ${row.LocationNo || row.Bin}: ${error.message}`);
      }
    }

    if (locationsToInsert.length === 0) {
      return { inserted: 0, errors };
    }

    // Insert in batches to avoid timeout
    const batchSize = 100;
    let inserted = 0;

    for (let i = 0; i < locationsToInsert.length; i += batchSize) {
      const batch = locationsToInsert.slice(i, i + batchSize);
      
      const { data, error } = await this.supabase
        .from('locations')
        .insert(batch)
        .select();

      if (error) {
        // Handle duplicate location_code errors gracefully
        if (error.code === '23505') { // Unique violation
          errors.push(`Batch ${Math.floor(i / batchSize) + 1}: Some locations already exist (duplicate location_code)`);
        } else if (error.code === '23514') { // Check constraint violation
          // Log first few invalid location codes for debugging
          const invalidCodes = batch.slice(0, 3).map((loc: any) => loc.location_code).join(', ');
          const segmentCounts = batch.slice(0, 3).map((loc: any) => {
            const segs = loc.location_code.split('.');
            return `${loc.location_code} (${segs.length} segments)`;
          }).join(', ');
          errors.push(`Batch ${Math.floor(i / batchSize) + 1}: Constraint violation. Sample codes: ${segmentCounts}. Make sure constraint allows 4 or 5 segments.`);
        } else {
          errors.push(`Batch ${Math.floor(i / batchSize) + 1}: ${error.message}`);
        }
      } else {
        inserted += data?.length || 0;
      }
    }

    return { inserted, errors };
  }

  // Get all locations (fetches all rows, not limited to 1000)
  static async getLocations(): Promise<Location[]> {
    const allLocations: Location[] = [];
    const pageSize = 1000; // Supabase default limit
    let from = 0;
    let hasMore = true;

    while (hasMore) {
      const { data, error } = await this.supabase
        .from('locations')
        .select('*')
        .order('location_code', { ascending: true })
        .range(from, from + pageSize - 1);

      if (error) {
        console.error('Error fetching locations:', error);
        throw new Error('Failed to fetch locations');
      }

      if (data && data.length > 0) {
        allLocations.push(...data);
        from += pageSize;
        hasMore = data.length === pageSize; // If we got exactly pageSize, there might be more
      } else {
        hasMore = false;
      }
    }

    return allLocations;
  }

  // Get location by code
  static async getLocationByCode(locationCode: string): Promise<Location | null> {
    const { data, error } = await this.supabase
      .from('locations')
      .select('*')
      .eq('location_code', locationCode)
      .single();

    if (error) {
      if (error.code === 'PGRST116') { // Not found
        return null;
      }
      console.error('Error fetching location:', error);
      throw new Error('Failed to fetch location');
    }

    return data;
  }

  // Update location
  static async updateLocation(id: string, updates: Partial<Location>): Promise<Location> {
    const { data, error } = await this.supabase
      .from('locations')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating location:', error);
      throw new Error('Failed to update location');
    }

    return data;
  }

  // Delete location
  static async deleteLocation(id: string): Promise<void> {
    const { error } = await this.supabase
      .from('locations')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting location:', error);
      throw new Error('Failed to delete location');
    }
  }

  // Get total count of locations
  static async getLocationCount(): Promise<number> {
    const { count, error } = await this.supabase
      .from('locations')
      .select('*', { count: 'exact', head: true });

    if (error) {
      console.error('Error counting locations:', error);
      throw new Error(`Failed to count locations: ${error.message}`);
    }

    return count || 0;
  }

  // Create a single location
  static async createLocation(locationData: {
    program_id?: number;
    warehouse?: string;
    building: string;
    bay: string;
    row: string;
    tier: string;
    bin?: string;
    location_group?: string;
    is_risk_location: boolean;
    risk_reason?: string;
  }): Promise<Location> {
    // Construct location code from building, bay, row, tier
    let locationCode = `${locationData.building}.${locationData.bay}.${locationData.row}.${locationData.tier}`;
    
    // Prepend warehouse if provided
    if (locationData.warehouse) {
      locationCode = `${locationData.warehouse}.${locationCode}`;
    }

    const locationToInsert: any = {
      program_id: locationData.program_id || 10053,
      warehouse: locationData.warehouse || null,
      building: locationData.building,
      bay: locationData.bay,
      row: locationData.row,
      tier: locationData.tier,
      bin: locationData.bin || null,
      location_group: locationData.location_group || null,
      location_code: locationCode,
      is_risk_location: locationData.is_risk_location,
      risk_reason: locationData.risk_reason || null
    };

    const { data, error } = await this.supabase
      .from('locations')
      .insert(locationToInsert)
      .select()
      .single();

    if (error) {
      console.error('Error creating location:', error);
      throw new Error(`Failed to create location: ${error.message}`);
    }

    return data;
  }
}

