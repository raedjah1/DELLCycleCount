// ============================================================================
// LEAD SERVICE - Backend operations for Lead role (work assignment)
// ============================================================================

import { createClient } from '@/lib/supabase/client';
import { Journal, JournalLine } from './journalService';

export interface OperatorStatus {
  id: string;
  name: string;
  email: string;
  role: string;
  status: 'Available' | 'On Break' | 'On Lunch' | 'Working';
  activeJournals: number;
  completedToday: number;
  inProgress: number;
  lastActivity?: string;
}

export interface UnassignedJournal {
  id: string;
  journal_number: string;
  zone: string;
  warehouse: string;
  total_lines: number;
  created_at: string;
  priority: 'normal' | 'urgent' | 'critical';
}

export interface TeamProgress {
  totalOperators: number;
  availableOperators: number;
  workingOperators: number;
  totalJournals: number;
  completedJournals: number;
  inProgressJournals: number;
  unassignedJournals: number;
  totalLocations: number;
  completedLocations: number;
  completionRate: number;
}

export class LeadService {
  private static supabase = createClient();

  // Get all operators with their status
  static async getOperatorStatuses(): Promise<OperatorStatus[]> {
    const { data: users, error: usersError } = await this.supabase
      .from('users')
      .select('id, name, email, role')
      .eq('role', 'Operator')
      .eq('is_active', true);

    if (usersError) {
      console.error('Error fetching operators:', usersError);
      throw new Error('Failed to fetch operators');
    }

    if (!users || users.length === 0) {
      return [];
    }

    // Get journal assignments for each operator
    const operatorStatuses: OperatorStatus[] = await Promise.all(
      users.map(async (user) => {
        const { data: journals } = await this.supabase
          .from('journals')
          .select('id, status, completed_lines, total_lines, updated_at')
          .eq('assigned_to', user.id)
          .in('status', ['assigned', 'in_progress']);

        const activeJournals = journals?.length || 0;
        const inProgress = journals?.filter(j => j.status === 'in_progress').length || 0;
        
        // Get completed today
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const { count: completedToday } = await this.supabase
          .from('journals')
          .select('*', { count: 'exact', head: true })
          .eq('assigned_to', user.id)
          .eq('status', 'completed')
          .gte('updated_at', today.toISOString());

        const lastJournal = journals?.[0];
        const lastActivity = lastJournal?.updated_at;

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          status: activeJournals > 0 ? 'Working' : 'Available',
          activeJournals,
          completedToday: completedToday || 0,
          inProgress,
          lastActivity
        };
      })
    );

    return operatorStatuses;
  }

  // Get unassigned journals (dispatch pool)
  static async getUnassignedJournals(): Promise<UnassignedJournal[]> {
    const { data: journals, error } = await this.supabase
      .from('journals')
      .select('id, journal_number, zone, warehouse, total_lines, created_at, status')
      .is('assigned_to', null)
      .eq('status', 'assigned')
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error fetching unassigned journals:', error);
      throw new Error('Failed to fetch unassigned journals');
    }

    if (!journals) return [];

    // Calculate priority based on age and size
    const now = new Date();
    return journals.map(journal => {
      const ageHours = (now.getTime() - new Date(journal.created_at).getTime()) / (1000 * 60 * 60);
      let priority: 'normal' | 'urgent' | 'critical' = 'normal';
      
      if (ageHours > 24 || journal.total_lines > 50) {
        priority = 'critical';
      } else if (ageHours > 12 || journal.total_lines > 30) {
        priority = 'urgent';
      }

      return {
        id: journal.id,
        journal_number: journal.journal_number,
        zone: journal.zone,
        warehouse: journal.warehouse,
        total_lines: journal.total_lines,
        created_at: journal.created_at,
        priority
      };
    });
  }

  // Assign journal to operator
  static async assignJournal(journalId: string, operatorId: string): Promise<void> {
    const { error } = await this.supabase
      .from('journals')
      .update({
        assigned_to: operatorId,
        assigned_date: new Date().toISOString(),
        status: 'assigned',
        updated_at: new Date().toISOString()
      })
      .eq('id', journalId);

    if (error) {
      console.error('Error assigning journal:', error);
      throw new Error('Failed to assign journal');
    }
  }

  // Reassign journal to different operator
  static async reassignJournal(journalId: string, newOperatorId: string): Promise<void> {
    const { error } = await this.supabase
      .from('journals')
      .update({
        assigned_to: newOperatorId,
        assigned_date: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('id', journalId);

    if (error) {
      console.error('Error reassigning journal:', error);
      throw new Error('Failed to reassign journal');
    }
  }

  // Get team progress metrics
  static async getTeamProgress(): Promise<TeamProgress> {
    // Get all operators
    const { count: totalOperators } = await this.supabase
      .from('users')
      .select('*', { count: 'exact', head: true })
      .eq('role', 'Operator')
      .eq('is_active', true);

    // Get operator statuses
    const operatorStatuses = await this.getOperatorStatuses();
    const availableOperators = operatorStatuses.filter(op => op.status === 'Available').length;
    const workingOperators = operatorStatuses.filter(op => op.status === 'Working').length;

    // Get all journals
    const { data: allJournals } = await this.supabase
      .from('journals')
      .select('id, status, total_lines, completed_lines');

    const totalJournals = allJournals?.length || 0;
    const completedJournals = allJournals?.filter(j => j.status === 'completed').length || 0;
    const inProgressJournals = allJournals?.filter(j => j.status === 'in_progress').length || 0;
    
    const { count: unassignedJournals } = await this.supabase
      .from('journals')
      .select('*', { count: 'exact', head: true })
      .is('assigned_to', null)
      .eq('status', 'assigned');

    const totalLocations = allJournals?.reduce((sum, j) => sum + j.total_lines, 0) || 0;
    const completedLocations = allJournals?.reduce((sum, j) => sum + j.completed_lines, 0) || 0;
    const completionRate = totalLocations > 0 ? (completedLocations / totalLocations) * 100 : 0;

    return {
      totalOperators: totalOperators || 0,
      availableOperators,
      workingOperators,
      totalJournals,
      completedJournals,
      inProgressJournals,
      unassignedJournals: unassignedJournals || 0,
      totalLocations,
      completedLocations,
      completionRate: Math.round(completionRate)
    };
  }

  // Get journals needing recount (urgent)
  static async getUrgentRecounts(): Promise<JournalLine[]> {
    const { data: lines, error } = await this.supabase
      .from('journal_lines')
      .select(`
        *,
        journal:journals(*),
        location:locations(*),
        item:items(*)
      `)
      .eq('status', 'Needs Recount')
      .order('line_created_timestamp', { ascending: true })
      .limit(20);

    if (error) {
      console.error('Error fetching urgent recounts:', error);
      throw new Error('Failed to fetch urgent recounts');
    }

    return lines || [];
  }

  // Get operator's current workload
  static async getOperatorWorkload(operatorId: string): Promise<{
    activeJournals: Journal[];
    totalLocations: number;
    completedLocations: number;
  }> {
    const { data: journals } = await this.supabase
      .from('journals')
      .select('*')
      .eq('assigned_to', operatorId)
      .in('status', ['assigned', 'in_progress']);

    const activeJournals = journals || [];
    const totalLocations = activeJournals.reduce((sum, j) => sum + j.total_lines, 0);
    const completedLocations = activeJournals.reduce((sum, j) => sum + j.completed_lines, 0);

    return {
      activeJournals,
      totalLocations,
      completedLocations
    };
  }
}
