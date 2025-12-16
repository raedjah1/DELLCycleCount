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
  // Skips invalid records silently and continues inserting valid ones
  static async insertTransactions(rows: TransactionRow[]): Promise<{ inserted: number; errors: string[] }> {
    const errors: string[] = [];
    const itemsToInsert: any[] = [];

    // First pass: validate and prepare all rows (skip invalid ones silently)
    for (const row of rows) {
      try {
        // Skip if any required field is missing or empty
        if (!row.PartNo || !row.SerialNo || !row.Source || !row.PartTransactionType) {
          continue; // Skip silently
        }

        // Validate Qty is a valid number
        if (row.Qty === undefined || row.Qty === null || isNaN(Number(row.Qty)) || Number(row.Qty) < 0) {
          continue; // Skip silently
        }

        const itemToInsert: any = {
          part_no: String(row.PartNo).trim(),
          serial_no: String(row.SerialNo).trim(),
          qty: Number(row.Qty),
          source: String(row.Source).trim(),
          part_transaction_type: String(row.PartTransactionType).trim()
        };

        // Final validation - skip if any field is empty after trimming
        if (!itemToInsert.part_no || !itemToInsert.serial_no || !itemToInsert.source || !itemToInsert.part_transaction_type) {
          continue; // Skip silently
        }

        itemsToInsert.push(itemToInsert);
      } catch (error: any) {
        // Skip records that cause errors during preparation
        continue;
      }
    }

    if (itemsToInsert.length === 0) {
      return { inserted: 0, errors: ['No valid records to import'] };
    }

    // Insert in batches of 1000, with fallback to smaller batches for duplicates
    const batchSize = 1000;
    let totalInserted = 0;
    let duplicateCount = 0;

    for (let i = 0; i < itemsToInsert.length; i += batchSize) {
      const batch = itemsToInsert.slice(i, i + batchSize);
      const batchNumber = Math.floor(i / batchSize) + 1;
      
      const { data, error } = await this.supabase
        .from('transactions')
        .insert(batch)
        .select();

      if (error) {
        // Handle duplicate key errors by trying smaller batches
        if (error.code === '23505') { // Unique constraint violation
          // Try inserting in smaller batches of 100 to skip duplicates
          const subBatchSize = 100;
          let batchInserted = 0;
          
          for (let j = 0; j < batch.length; j += subBatchSize) {
            const subBatch = batch.slice(j, j + subBatchSize);
            const { data: subData, error: subError } = await this.supabase
              .from('transactions')
              .insert(subBatch)
              .select();
            
            if (!subError) {
              batchInserted += subData?.length || 0;
            } else if (subError.code === '23505') {
              // If sub-batch has duplicates, try individual inserts
              for (const item of subBatch) {
                const { data: singleData, error: singleError } = await this.supabase
                  .from('transactions')
                  .insert(item)
                  .select();
                
                if (!singleError) {
                  batchInserted += singleData?.length || 0;
                } else {
                  duplicateCount++; // Skip duplicates silently
                }
              }
            } else {
              // Other error - log it
              errors.push(`Batch ${batchNumber}, sub-batch ${Math.floor(j / subBatchSize) + 1}: ${subError.message}`);
              duplicateCount += subBatch.length;
            }
          }
          
          totalInserted += batchInserted;
          if (batchInserted < batch.length) {
            duplicateCount += (batch.length - batchInserted);
          }
        } else {
          // Other errors - log the actual error
          errors.push(`Batch ${batchNumber}: ${error.message}`);
        }
      } else {
        // Batch succeeded
        totalInserted += data?.length || 0;
      }
    }

    // Add summary message if many duplicates
    if (duplicateCount > 0) {
      errors.push(`${duplicateCount} records were skipped (duplicates)`);
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

  // Delete all transactions (wipe database)
  static async deleteAllTransactions(): Promise<number> {
    // Get count before deletion
    const { count: countBefore } = await this.supabase
      .from('transactions')
      .select('*', { count: 'exact', head: true });

    // Delete all transactions
    const { error } = await this.supabase
      .from('transactions')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all (using a condition that matches all rows)

    if (error) {
      console.error('Error deleting all transactions:', error);
      throw new Error(`Failed to delete all transactions: ${error.message}`);
    }

    return countBefore || 0;
  }
}

