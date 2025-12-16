// ============================================================================
// TRANSACTION SERVICE - Backend operations for transactions
// ============================================================================

import { createClient } from '@/lib/supabase/client';
import { TransactionRow } from '@/lib/utils/excelImport';

export interface Transaction {
  id: string;
  part_no: string;
  serial_no: string;
  qty: number;
  source: string;
  part_transaction_type: string;
  created_at: string;
  updated_at: string;
}

export class TransactionService {
  private static supabase = createClient();

  // Insert transactions from import
  static async insertTransactions(rows: TransactionRow[]): Promise<{ inserted: number; errors: string[] }> {
    const errors: string[] = [];
    const itemsToInsert: any[] = [];

    for (const row of rows) {
      try {
        const itemToInsert: any = {
          part_no: row.PartNo,
          serial_no: row.SerialNo,
          qty: row.Qty,
          source: row.Source,
          part_transaction_type: row.PartTransactionType
        };

        // Validate required fields
        if (!itemToInsert.part_no || !itemToInsert.serial_no || !itemToInsert.source || !itemToInsert.part_transaction_type) {
          errors.push(`Row with Part No "${row.PartNo}" and Serial No "${row.SerialNo}": Missing required fields`);
          continue;
        }

        itemsToInsert.push(itemToInsert);
      } catch (error: any) {
        errors.push(`Row with Part No "${row.PartNo}" and Serial No "${row.SerialNo}": ${error.message}`);
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
        .from('transactions')
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

  // Get paginated transactions
  static async getPaginatedTransactions(
    page: number = 1,
    pageSize: number = 50,
    search?: string
  ): Promise<{ data: Transaction[]; total: number; totalPages: number }> {
    let query = this.supabase
      .from('transactions')
      .select('*', { count: 'exact' });

    // Apply search filter
    if (search && search.trim()) {
      const searchTerm = `%${search.trim()}%`;
      query = query.or(`part_no.ilike.${searchTerm},serial_no.ilike.${searchTerm},source.ilike.${searchTerm},part_transaction_type.ilike.${searchTerm}`);
    }

    // Apply pagination
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;
    query = query.range(from, to).order('created_at', { ascending: false });

    const { data, error, count } = await query;

    if (error) {
      console.error('Error fetching transactions:', error);
      throw new Error(`Failed to fetch transactions: ${error.message}`);
    }

    const total = count || 0;
    const totalPages = Math.ceil(total / pageSize);

    return {
      data: (data || []) as Transaction[],
      total,
      totalPages
    };
  }

  // Get total count of transactions
  static async getTransactionCount(): Promise<number> {
    const { count, error } = await this.supabase
      .from('transactions')
      .select('*', { count: 'exact', head: true });

    if (error) {
      console.error('Error counting transactions:', error);
      throw new Error(`Failed to count transactions: ${error.message}`);
    }

    return count || 0;
  }

  // Delete transaction
  static async deleteTransaction(id: string): Promise<void> {
    const { error } = await this.supabase
      .from('transactions')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting transaction:', error);
      throw new Error(`Failed to delete transaction: ${error.message}`);
    }
  }
}

