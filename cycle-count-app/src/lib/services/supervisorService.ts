// ============================================================================
// SUPERVISOR SERVICE - Backend operations for Warehouse Supervisor role
// ============================================================================

import { createClient } from '@/lib/supabase/client';

export interface QueueStatus {
  dispatch_pool_count: number;
  pending_approvals_count: number;
  active_journals_count: number;
  operators_available: number;
  operators_on_break: number;
  urgent_tasks: number;
}

export interface LimitedApproval {
  id: string;
  journal_line_id: string;
  location_code: string;
  part_number: string;
  expected_qty: number;
  actual_qty: number;
  variance_qty: number;
  is_high_impact: boolean;
  can_approve: boolean; // Supervisors can only approve non-high-impact
  status: 'pending' | 'approved' | 'rejected';
  requested_at: string;
  item: {
    id: string;
    part_no: string;
    name: string;
    standard_cost?: number;
  };
}

export interface TeamPerformance {
  operator_id: string;
  operator_name: string;
  journals_completed: number;
  locations_counted: number;
  average_accuracy: number;
  on_time_completion_rate: number;
  status: 'available' | 'on_break' | 'on_lunch' | 'working';
}

export class SupervisorService {
  private static supabase = createClient();

  // Get operational queue status
  static async getQueueStatus(): Promise<QueueStatus> {
    // Get dispatch pool count
    const { count: dispatchCount } = await this.supabase
      .from('dispatch_pool')
      .select('*', { count: 'exact', head: true })
      .is('assigned_to', null);

    // Get pending approvals (non-high-impact only for supervisors)
    const { count: approvalCount } = await this.supabase
      .from('approvals')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'pending')
      .eq('is_high_impact', false);

    // Get active journals
    const { count: journalCount } = await this.supabase
      .from('journals')
      .select('*', { count: 'exact', head: true })
      .in('status', ['Assigned', 'In Progress']);

    // Get operator statuses
    const { data: operators } = await this.supabase
      .from('users')
      .select('id, role')
      .eq('role', 'Operator')
      .eq('is_active', true);

    const operatorsAvailable = operators?.filter(() => true).length || 0; // Simplified
    const operatorsOnBreak = 0; // Would come from operator status table

    // Get urgent tasks (journals with high priority or overdue)
    const { count: urgentCount } = await this.supabase
      .from('journals')
      .select('*', { count: 'exact', head: true })
      .eq('priority', 'high')
      .in('status', ['Assigned', 'In Progress']);

    return {
      dispatch_pool_count: dispatchCount || 0,
      pending_approvals_count: approvalCount || 0,
      active_journals_count: journalCount || 0,
      operators_available: operatorsAvailable,
      operators_on_break: operatorsOnBreak,
      urgent_tasks: urgentCount || 0
    };
  }

  // Get limited approvals (non-high-impact only)
  static async getLimitedApprovals(filter?: 'all' | 'pending' | 'approved'): Promise<LimitedApproval[]> {
    const { data: approvals, error } = await this.supabase
      .from('approvals')
      .select(`
        *,
        journal_line:journal_lines(
          id,
          expected_qty,
          location:locations(location_code),
          item:items(part_no, name, standard_cost)
        )
      `)
      .eq('is_high_impact', false) // Supervisors can only approve non-high-impact
      .order('requested_at', { ascending: false });

    if (error) {
      console.error('Error fetching limited approvals:', error);
      return [];
    }

    if (!approvals) return [];

    return approvals.map((approval: any) => {
      const line = approval.journal_line;
      const varianceQty = (approval.adjustment_qty || 0) - (line?.expected_qty || 0);

      return {
        id: approval.id,
        journal_line_id: approval.journal_line_id,
        location_code: line?.location?.location_code || '',
        part_number: line?.item?.part_no || '',
        expected_qty: line?.expected_qty || 0,
        actual_qty: approval.adjustment_qty || 0,
        variance_qty: varianceQty,
        is_high_impact: false,
        can_approve: approval.status === 'pending',
        status: approval.status as 'pending' | 'approved' | 'rejected',
        requested_at: approval.requested_at || approval.created_at,
        item: {
          id: line?.item?.id || '',
          part_no: line?.item?.part_no || '',
          name: line?.item?.name || '',
          standard_cost: line?.item?.standard_cost
        }
      };
    }).filter((approval: LimitedApproval) => {
      if (filter === 'pending') return approval.status === 'pending';
      if (filter === 'approved') return approval.status === 'approved';
      return true;
    });
  }

  // Approve limited variance (non-high-impact only)
  static async approveLimitedVariance(
    approvalId: string,
    supervisorId: string,
    notes?: string
  ): Promise<void> {
    const { data: approval } = await this.supabase
      .from('approvals')
      .select('*')
      .eq('id', approvalId)
      .single();

    if (!approval) {
      throw new Error('Approval not found');
    }

    if (approval.is_high_impact) {
      throw new Error('Supervisors cannot approve high-impact items');
    }

    // Update approval
    const { error } = await this.supabase
      .from('approvals')
      .update({
        status: 'approved',
        comments: notes,
        updated_at: new Date().toISOString()
      })
      .eq('id', approvalId);

    if (error) {
      throw new Error('Failed to approve variance');
    }

    // Update journal line status
    await this.supabase
      .from('journal_lines')
      .update({
        status: 'Completed',
        updated_at: new Date().toISOString()
      })
      .eq('id', approval.journal_line_id);
  }

  // Reject limited variance
  static async rejectLimitedVariance(
    approvalId: string,
    supervisorId: string,
    reason: string
  ): Promise<void> {
    const { error } = await this.supabase
      .from('approvals')
      .update({
        status: 'rejected',
        comments: reason,
        updated_at: new Date().toISOString()
      })
      .eq('id', approvalId);

    if (error) {
      throw new Error('Failed to reject variance');
    }

    // Mark journal line as needs recount
    const { data: approval } = await this.supabase
      .from('approvals')
      .select('journal_line_id')
      .eq('id', approvalId)
      .single();

    if (approval) {
      await this.supabase
        .from('journal_lines')
        .update({
          status: 'Needs Recount',
          updated_at: new Date().toISOString()
        })
        .eq('id', approval.journal_line_id);
    }
  }

  // Get team performance metrics
  static async getTeamPerformance(): Promise<TeamPerformance[]> {
    // Get all operators
    const { data: operators } = await this.supabase
      .from('users')
      .select('id, name, email, role')
      .eq('role', 'Operator')
      .eq('is_active', true);

    if (!operators) return [];

    // Get journal completion stats for each operator
    const performance: TeamPerformance[] = [];

    for (const operator of operators) {
      const { count: journalsCompleted } = await this.supabase
        .from('journals')
        .select('*', { count: 'exact', head: true })
        .eq('assigned_to', operator.id)
        .eq('status', 'Completed');

      const { count: locationsCounted } = await this.supabase
        .from('journal_lines')
        .select('*', { count: 'exact', head: true })
        .in('status', ['Completed']);

      // Simplified metrics - in production, calculate from actual data
      performance.push({
        operator_id: operator.id,
        operator_name: operator.name || operator.email,
        journals_completed: journalsCompleted || 0,
        locations_counted: locationsCounted || 0,
        average_accuracy: 95.5, // Would calculate from variance data
        on_time_completion_rate: 88.0, // Would calculate from SLA data
        status: 'available' // Would come from operator status
      });
    }

    return performance;
  }

  // Get active work queues
  static async getActiveQueues() {
    // Dispatch pool
    const { data: dispatchPool } = await this.supabase
      .from('dispatch_pool')
      .select('*')
      .is('assigned_to', null)
      .order('time_in_pool', { ascending: true })
      .limit(10);

    // Active journals
    const { data: activeJournals } = await this.supabase
      .from('journals')
      .select('*')
      .in('status', ['Assigned', 'In Progress'])
      .order('created_at', { ascending: false })
      .limit(10);

    return {
      dispatch_pool: dispatchPool || [],
      active_journals: activeJournals || []
    };
  }
}
