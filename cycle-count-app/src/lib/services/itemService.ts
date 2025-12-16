// ============================================================================
// ITEM SERVICE - Backend operations for items
// ============================================================================

import { createClient } from '@/lib/supabase/client';

export interface Item {
  id: string;
  source_id?: number;
  name: string;
  part_no: string;
  description: string;
  manufacture_part_no?: string;
  model_no?: string;
  serial_flag: string; // 'Y' or 'N'
  primary_commodity?: string;
  secondary_commodity?: string;
  part_type: string;
  status: string;
  username?: string;
  create_date?: string;
  last_activity_date?: string;
  warehouse_type?: string;
  abc_class?: string;
  standard_cost?: number;
  created_at: string;
  updated_at: string;
}

export interface ItemRow {
  ID: number;
  PartNo: string;
  Description: string;
  SerialFlag: string; // 'Y' or 'N'
}

export class ItemService {
  private static supabase = createClient();

  // Get all items (fetches all rows, not limited to 1000)
  static async getItems(): Promise<Item[]> {
    const allItems: Item[] = [];
    const pageSize = 1000; // Supabase default limit
    let from = 0;
    let hasMore = true;

    while (hasMore) {
      const { data, error } = await this.supabase
        .from('items')
        .select('*')
        .order('part_no', { ascending: true })
        .range(from, from + pageSize - 1);

      if (error) {
        console.error('Error fetching items:', error);
        throw new Error('Failed to fetch items');
      }

      if (data && data.length > 0) {
        allItems.push(...data);
        from += pageSize;
        hasMore = data.length === pageSize; // If we got exactly pageSize, there might be more
      } else {
        hasMore = false;
      }
    }

    return allItems;
  }

  // Get item by part number
  static async getItemByPartNo(partNo: string): Promise<Item | null> {
    const { data, error } = await this.supabase
      .from('items')
      .select('*')
      .eq('part_no', partNo)
      .single();

    if (error) {
      if (error.code === 'PGRST116') { // Not found
        return null;
      }
      console.error('Error fetching item:', error);
      throw new Error('Failed to fetch item');
    }

    return data;
  }

  // Insert items from import
  static async insertItems(itemRows: ItemRow[]): Promise<{ inserted: number; errors: string[] }> {
    const errors: string[] = [];
    const itemsToInsert: any[] = [];

    for (const row of itemRows) {
      try {
        // Map Excel columns to database columns
        const itemToInsert: any = {
          source_id: row.ID || null,
          part_no: (row.PartNo || '').toString().trim(),
          description: (row.Description || '').toString().trim(),
          serial_flag: (row.SerialFlag || 'N').toString().trim().toUpperCase() === 'Y' ? 'Y' : 'N',
          // Set defaults for required fields
          name: (row.PartNo || '').toString().trim(), // Use PartNo as name if not provided
          part_type: 'Part', // Default
          status: 'ACTIVE' // Default
        };

        // Validate required fields
        if (!itemToInsert.part_no) {
          errors.push(`Row with ID ${row.ID}: PartNo is required`);
          continue;
        }

        if (!itemToInsert.description) {
          errors.push(`Row with ID ${row.ID}: Description is required`);
          continue;
        }

        itemsToInsert.push(itemToInsert);
      } catch (err: any) {
        errors.push(`Row with ID ${row.ID}: ${err.message}`);
      }
    }

    if (itemsToInsert.length === 0) {
      return { inserted: 0, errors };
    }

    // Insert in batches
    const batchSize = 100;
    let inserted = 0;

    for (let i = 0; i < itemsToInsert.length; i += batchSize) {
      const batch = itemsToInsert.slice(i, i + batchSize);
      
      const { data, error } = await this.supabase
        .from('items')
        .insert(batch)
        .select();

      if (error) {
        // Handle duplicate part_no errors gracefully
        if (error.code === '23505') { // Unique violation
          errors.push(`Batch ${Math.floor(i / batchSize) + 1}: Some items already exist (duplicate part_no)`);
        } else {
          errors.push(`Batch ${Math.floor(i / batchSize) + 1}: ${error.message}`);
        }
      } else {
        inserted += data?.length || 0;
      }
    }

    return { inserted, errors };
  }

  // Update item
  static async updateItem(id: string, updates: Partial<Item>): Promise<Item> {
    const { data, error } = await this.supabase
      .from('items')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating item:', error);
      throw new Error('Failed to update item');
    }

    return data;
  }

  // Delete item
  static async deleteItem(id: string): Promise<void> {
    const { error } = await this.supabase
      .from('items')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting item:', error);
      throw new Error('Failed to delete item');
    }
  }

  // Create a single item
  static async createItem(itemData: {
    source_id?: number;
    part_no: string;
    description: string;
    serial_flag: string;
    name?: string;
    part_type?: string;
    status?: string;
  }): Promise<Item> {
    const itemToInsert: any = {
      source_id: itemData.source_id || null,
      part_no: itemData.part_no,
      description: itemData.description,
      serial_flag: itemData.serial_flag.toUpperCase() === 'Y' ? 'Y' : 'N',
      name: itemData.name || itemData.part_no,
      part_type: itemData.part_type || 'Part',
      status: itemData.status || 'ACTIVE'
    };

    const { data, error } = await this.supabase
      .from('items')
      .insert(itemToInsert)
      .select()
      .single();

    if (error) {
      console.error('Error creating item:', error);
      throw new Error(`Failed to create item: ${error.message}`);
    }

    return data;
  }
}

