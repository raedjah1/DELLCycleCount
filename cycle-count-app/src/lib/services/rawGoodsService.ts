// ============================================================================
// RAW GOODS SERVICE - Backend operations for raw goods
// ============================================================================

import { createClient } from '@/lib/supabase/client';
import { RawGoodsRow } from '@/lib/utils/excelImport';

export interface RawGoods {
  id: string;
  part_no: string;
  available_qty: number;
  bin: string;
  pallet_box_no?: string;
  warehouse: string;
  created_at: string;
  updated_at: string;
}

export class RawGoodsService {
  private static supabase = createClient();

  // Insert raw goods from import
  static async insertRawGoods(rows: RawGoodsRow[]): Promise<{ inserted: number; errors: string[] }> {
    const errors: string[] = [];
    const itemsToInsert: any[] = [];

    for (const row of rows) {
      try {
        const itemToInsert: any = {
          part_no: row.PartNo,
          available_qty: row.AvailableQty,
          bin: row.Bin,
          pallet_box_no: row.PalletBoxNo || null,
          warehouse: row.Warehouse
        };

        // Validate required fields
        if (!itemToInsert.part_no || !itemToInsert.bin || !itemToInsert.warehouse) {
          errors.push(`Row with Part No "${row.PartNo}" and Bin "${row.Bin}": Missing required fields`);
          continue;
        }

        itemsToInsert.push(itemToInsert);
      } catch (error: any) {
        errors.push(`Row with Part No "${row.PartNo}" and Bin "${row.Bin}": ${error.message}`);
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
        .from('raw_goods')
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

  // Get paginated raw goods
  static async getPaginatedRawGoods(
    page: number = 1,
    pageSize: number = 50,
    search?: string
  ): Promise<{ data: RawGoods[]; total: number; totalPages: number }> {
    let query = this.supabase
      .from('raw_goods')
      .select('*', { count: 'exact' });

    // Apply search filter
    if (search && search.trim()) {
      const searchTerm = `%${search.trim()}%`;
      query = query.or(`part_no.ilike.${searchTerm},bin.ilike.${searchTerm},warehouse.ilike.${searchTerm},pallet_box_no.ilike.${searchTerm}`);
    }

    // Apply pagination
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;
    query = query.range(from, to).order('created_at', { ascending: false });

    const { data, error, count } = await query;

    if (error) {
      console.error('Error fetching raw goods:', error);
      throw new Error(`Failed to fetch raw goods: ${error.message}`);
    }

    const total = count || 0;
    const totalPages = Math.ceil(total / pageSize);

    return {
      data: (data || []) as RawGoods[],
      total,
      totalPages
    };
  }

  // Get total count of raw goods
  static async getRawGoodsCount(): Promise<number> {
    const { count, error } = await this.supabase
      .from('raw_goods')
      .select('*', { count: 'exact', head: true });

    if (error) {
      console.error('Error counting raw goods:', error);
      throw new Error(`Failed to count raw goods: ${error.message}`);
    }

    return count || 0;
  }

  // Delete raw goods
  static async deleteRawGoods(id: string): Promise<void> {
    const { error } = await this.supabase
      .from('raw_goods')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting raw goods:', error);
      throw new Error(`Failed to delete raw goods: ${error.message}`);
    }
  }
}

