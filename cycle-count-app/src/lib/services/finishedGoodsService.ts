// ============================================================================
// FINISHED GOODS SERVICE - Backend operations for finished goods
// ============================================================================

import { createClient } from '@/lib/supabase/client';
import { FinishedGoodsRow } from '@/lib/utils/excelImport';

export interface FinishedGoods {
  id: string;
  part_number: string;
  serial_no: string;
  part_location: string;
  warehouse: string;
  pallet_box_no?: string;
  created_at: string;
  updated_at: string;
}

export class FinishedGoodsService {
  private static supabase = createClient();

  // Insert finished goods from import
  static async insertFinishedGoods(rows: FinishedGoodsRow[]): Promise<{ inserted: number; errors: string[] }> {
    const errors: string[] = [];
    const itemsToInsert: any[] = [];

    for (const row of rows) {
      try {
        const itemToInsert: any = {
          part_number: row.PartNumber,
          serial_no: row.SerialNo,
          part_location: row.PartLocation,
          warehouse: row.Warehouse,
          pallet_box_no: row.PalletBoxNo || null
        };

        // Validate required fields
        if (!itemToInsert.part_number || !itemToInsert.serial_no || !itemToInsert.part_location || !itemToInsert.warehouse) {
          errors.push(`Row with Part Number "${row.PartNumber}" and Serial No "${row.SerialNo}": Missing required fields`);
          continue;
        }

        itemsToInsert.push(itemToInsert);
      } catch (error: any) {
        errors.push(`Row with Part Number "${row.PartNumber}" and Serial No "${row.SerialNo}": ${error.message}`);
      }
    }

    if (itemsToInsert.length === 0) {
      return { inserted: 0, errors };
    }

    // Insert in batches of 1000
    const batchSize = 1000;
    let totalInserted = 0;

    for (let i = 0; i < itemsToInsert.length; i += batchSize) {
      const batch = itemsToInsert.slice(i, i + batchSize);
      
      const { data, error } = await this.supabase
        .from('finished_goods')
        .insert(batch)
        .select();

      if (error) {
        // Handle duplicate key errors gracefully
        if (error.code === '23505') { // Unique constraint violation
          errors.push(`Batch ${Math.floor(i / batchSize) + 1}: Some records already exist (duplicates skipped)`);
        } else {
          errors.push(`Batch ${Math.floor(i / batchSize) + 1}: ${error.message}`);
        }
      } else {
        totalInserted += data?.length || 0;
      }
    }

    return { inserted: totalInserted, errors };
  }

  // Get paginated finished goods
  static async getPaginatedFinishedGoods(
    page: number = 1,
    pageSize: number = 50,
    search?: string
  ): Promise<{ data: FinishedGoods[]; total: number; totalPages: number }> {
    let query = this.supabase
      .from('finished_goods')
      .select('*', { count: 'exact' });

    // Apply search filter
    if (search && search.trim()) {
      const searchTerm = `%${search.trim()}%`;
      query = query.or(`part_number.ilike.${searchTerm},serial_no.ilike.${searchTerm},part_location.ilike.${searchTerm},warehouse.ilike.${searchTerm}`);
    }

    // Apply pagination
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;
    query = query.range(from, to).order('created_at', { ascending: false });

    const { data, error, count } = await query;

    if (error) {
      console.error('Error fetching finished goods:', error);
      throw new Error(`Failed to fetch finished goods: ${error.message}`);
    }

    const total = count || 0;
    const totalPages = Math.ceil(total / pageSize);

    return {
      data: (data || []) as FinishedGoods[],
      total,
      totalPages
    };
  }

  // Get total count of finished goods
  static async getFinishedGoodsCount(): Promise<number> {
    const { count, error } = await this.supabase
      .from('finished_goods')
      .select('*', { count: 'exact', head: true });

    if (error) {
      console.error('Error counting finished goods:', error);
      throw new Error(`Failed to count finished goods: ${error.message}`);
    }

    return count || 0;
  }

  // Delete finished goods
  static async deleteFinishedGoods(id: string): Promise<void> {
    const { error } = await this.supabase
      .from('finished_goods')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting finished goods:', error);
      throw new Error(`Failed to delete finished goods: ${error.message}`);
    }
  }
}

