// ============================================================================
// JOURNAL SERVICE - Backend operations for journals and count submissions
// ============================================================================

import { createClient } from '@/lib/supabase/client';

export interface Journal {
  id: string;
  journal_number: string;
  zone: string;
  warehouse: string;
  assigned_to: string;
  total_lines: number;
  completed_lines: number;
  status: 'assigned' | 'in_progress' | 'completed';
  assigned_date: string;
  created_at: string;
  updated_at: string;
}

export interface JournalLine {
  id: string;
  journal_id: string;
  sequence_number: number;
  status: 'Unstarted' | 'In Progress' | 'Completed' | 'Needs Recount';
  expected_qty: number;
  line_created_timestamp: string;
  line_submit_timestamp?: string;
  claimed_at?: string;
  claimed_by?: string;
  created_at: string;
  updated_at: string;
  // Related data
  location: {
    id: string;
    location_code: string;
    building: string;
    bay: string;
    row: string;
    tier: string;
    bin?: string;
  };
  item: {
    id: string;
    part_no: string;
    name: string;
    description: string;
    serial_flag: string;
    warehouse_type?: string;
  };
}

export interface CountSubmission {
  id: string;
  journal_line_id: string;
  count_type: 'Count 1' | 'Count 2' | 'Count 3';
  count_value: number;
  submitted_by: string;
  submitted_at: string;
  photo_url?: string;
  notes?: string;
}

export interface SerialCapture {
  id: string;
  journal_line_id: string;
  serial_number: string;
  captured_by: string;
  captured_at: string;
}

export class JournalService {
  private static supabase = createClient();

  // Get journals assigned to current user
  static async getAssignedJournals(userId: string): Promise<Journal[]> {
    const { data, error } = await this.supabase
      .from('journals')
      .select('*')
      .eq('assigned_to', userId)
      .order('assigned_date', { ascending: true });

    if (error) {
      console.error('Error fetching assigned journals:', error);
      throw new Error('Failed to fetch journals');
    }

    return data || [];
  }

  // Get all journals (for managers)
  static async getAllJournals(): Promise<Journal[]> {
    const { data, error } = await this.supabase
      .from('journals')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching all journals:', error);
      throw new Error('Failed to fetch journals');
    }

    return data || [];
  }

  // Get journal by ID with lines
  static async getJournalWithLines(journalId: string): Promise<Journal & { lines: JournalLine[] }> {
    const { data: journal, error: journalError } = await this.supabase
      .from('journals')
      .select('*')
      .eq('id', journalId)
      .single();

    if (journalError) {
      console.error('Error fetching journal:', journalError);
      throw new Error('Failed to fetch journal');
    }

    const { data: lines, error: linesError } = await this.supabase
      .from('journal_lines')
      .select(`
        *,
        location:locations(*),
        item:items(*)
      `)
      .eq('journal_id', journalId)
      .order('sequence_number', { ascending: true });

    if (linesError) {
      console.error('Error fetching journal lines:', linesError);
      throw new Error('Failed to fetch journal lines');
    }

    return {
      ...journal,
      lines: lines || []
    };
  }

  // Get specific journal line with details
  static async getJournalLine(lineId: string): Promise<JournalLine> {
    const { data, error } = await this.supabase
      .from('journal_lines')
      .select(`
        *,
        location:locations(*),
        item:items(*),
        journal:journals(*)
      `)
      .eq('id', lineId)
      .single();

    if (error) {
      console.error('Error fetching journal line:', error);
      throw new Error('Failed to fetch journal line');
    }

    return data;
  }

  // Claim a journal line (operator starts working on it)
  static async claimJournalLine(lineId: string, userId: string): Promise<void> {
    const { error } = await this.supabase
      .from('journal_lines')
      .update({
        status: 'In Progress',
        claimed_at: new Date().toISOString(),
        claimed_by: userId,
        updated_at: new Date().toISOString()
      })
      .eq('id', lineId);

    if (error) {
      console.error('Error claiming journal line:', error);
      throw new Error('Failed to claim journal line');
    }
  }

  // Submit count for a journal line
  static async submitCount(
    lineId: string,
    countValue: number,
    countType: 'Count 1' | 'Count 2' | 'Count 3',
    userId: string,
    notes?: string,
    photoUrl?: string
  ): Promise<CountSubmission> {
    const { data, error } = await this.supabase
      .from('count_submissions')
      .insert({
        journal_line_id: lineId,
        count_type: countType,
        count_value: countValue,
        submitted_by: userId,
        notes,
        photo_url: photoUrl,
        submitted_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) {
      console.error('Error submitting count:', error);
      throw new Error('Failed to submit count');
    }

    // Update journal line status
    await this.updateJournalLineStatus(lineId, countValue);

    return data;
  }

  // Update journal line status based on count
  private static async updateJournalLineStatus(lineId: string, countValue: number): Promise<void> {
    // Get the journal line to compare expected vs actual
    const line = await this.getJournalLine(lineId);
    const variance = countValue - line.expected_qty;
    const isMatch = Math.abs(variance) <= 0; // No variance tolerance for now

    let newStatus: JournalLine['status'] = 'Completed';
    
    // If there's a variance, it might need a recount
    if (!isMatch) {
      // Check if this is Count 1 - if so, needs Count 2
      const { data: submissions } = await this.supabase
        .from('count_submissions')
        .select('count_type')
        .eq('journal_line_id', lineId);

      const hasCount1 = submissions?.some(s => s.count_type === 'Count 1');
      const hasCount2 = submissions?.some(s => s.count_type === 'Count 2');

      if (hasCount1 && !hasCount2) {
        newStatus = 'Needs Recount';
      } else if (hasCount1 && hasCount2) {
        // Both counts done - mark as completed even with variance (for manager review)
        newStatus = 'Completed';
      }
    }

    const { error } = await this.supabase
      .from('journal_lines')
      .update({
        status: newStatus,
        line_submit_timestamp: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('id', lineId);

    if (error) {
      console.error('Error updating journal line status:', error);
      throw new Error('Failed to update journal line status');
    }

    // Update journal completion progress
    await this.updateJournalProgress(line.journal_id);
  }

  // Update journal completion progress
  private static async updateJournalProgress(journalId: string): Promise<void> {
    const { data: lines } = await this.supabase
      .from('journal_lines')
      .select('status')
      .eq('journal_id', journalId);

    if (!lines) return;

    const completedLines = lines.filter(line => line.status === 'Completed').length;
    const totalLines = lines.length;
    const journalStatus = completedLines === totalLines ? 'completed' : 'in_progress';

    const { error } = await this.supabase
      .from('journals')
      .update({
        completed_lines: completedLines,
        status: journalStatus,
        updated_at: new Date().toISOString()
      })
      .eq('id', journalId);

    if (error) {
      console.error('Error updating journal progress:', error);
    }
  }

  // Capture serial numbers
  static async captureSerialNumbers(
    lineId: string,
    serialNumbers: string[],
    userId: string
  ): Promise<SerialCapture[]> {
    const captures = serialNumbers.map(serial => ({
      journal_line_id: lineId,
      serial_number: serial,
      captured_by: userId,
      captured_at: new Date().toISOString()
    }));

    const { data, error } = await this.supabase
      .from('serial_captures')
      .insert(captures)
      .select();

    if (error) {
      console.error('Error capturing serial numbers:', error);
      throw new Error('Failed to capture serial numbers');
    }

    return data || [];
  }

  // Get serial captures for a line
  static async getSerialCaptures(lineId: string): Promise<SerialCapture[]> {
    const { data, error } = await this.supabase
      .from('serial_captures')
      .select('*')
      .eq('journal_line_id', lineId)
      .order('captured_at', { ascending: true });

    if (error) {
      console.error('Error fetching serial captures:', error);
      throw new Error('Failed to fetch serial captures');
    }

    return data || [];
  }

  // Get count submissions for a line
  static async getCountSubmissions(lineId: string): Promise<CountSubmission[]> {
    const { data, error } = await this.supabase
      .from('count_submissions')
      .select('*')
      .eq('journal_line_id', lineId)
      .order('submitted_at', { ascending: true });

    if (error) {
      console.error('Error fetching count submissions:', error);
      throw new Error('Failed to fetch count submissions');
    }

    return data || [];
  }

  // Upload photo for variance evidence
  static async uploadVariancePhoto(file: File, lineId: string): Promise<string> {
    const fileName = `variance-photos/${lineId}/${Date.now()}-${file.name}`;
    
    const { data, error } = await this.supabase.storage
      .from('count-evidence')
      .upload(fileName, file);

    if (error) {
      console.error('Error uploading photo:', error);
      throw new Error('Failed to upload photo');
    }

    // Get public URL
    const { data: { publicUrl } } = this.supabase.storage
      .from('count-evidence')
      .getPublicUrl(fileName);

    return publicUrl;
  }
}
