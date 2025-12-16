// ============================================================================
// MANAGER SERVICE - Backend operations for Manager role (variances, approvals)
// ============================================================================

import { createClient } from '@/lib/supabase/client';

export interface Variance {
  id: string;
  journal_line_id: string;
  location_code: string;
  part_number: string;
  expected_qty: number;
  count1_qty?: number;
  count2_qty?: number;
  count3_qty?: number;
  final_count: number;
  variance_qty: number;
  variance_percent: number;
  warehouse_type: string;
  standard_cost?: number;
  is_high_impact: boolean;
  status: 'pending_review' | 'explained_by_transactions' | 'needs_approval' | 'approved' | 'rejected';
  photo_url?: string;
  notes?: string;
  created_at: string;
  // Related data
  location: {
    id: string;
    location_code: string;
  };
  item: {
    id: string;
    part_no: string;
    name: string;
    description: string;
    warehouse_type: string;
    standard_cost?: number;
  };
  journal: {
    id: string;
    journal_number: string;
  };
}

export interface ApprovalRequest {
  id: string;
  journal_line_id: string;
  location_code: string;
  part_number: string;
  expected_qty: number;
  actual_qty: number;
  variance_qty: number;
  warehouse_type: string;
  is_high_impact: boolean;
  photo_url?: string;
  requested_by: string;
  requested_at: string;
  ic_manager_approval?: 'pending' | 'approved' | 'rejected';
  ic_manager_approved_by?: string;
  ic_manager_approved_at?: string;
  warehouse_manager_approval?: 'pending' | 'approved' | 'rejected';
  warehouse_manager_approved_by?: string;
  warehouse_manager_approved_at?: string;
  status: 'pending' | 'partially_approved' | 'approved' | 'rejected';
  // Related data
  item: {
    id: string;
    part_no: string;
    name: string;
    standard_cost?: number;
  };
  requester: {
    id: string;
    name: string;
    email: string;
  };
}

export interface VerifiedCounterRequest {
  id: string;
  user_id: string;
  requested_by: string;
  requested_at: string;
  ic_manager_approval?: 'pending' | 'approved' | 'rejected';
  ic_manager_approved_by?: string;
  ic_manager_approved_at?: string;
  warehouse_manager_approval?: 'pending' | 'approved' | 'rejected';
  warehouse_manager_approved_by?: string;
  warehouse_manager_approved_at?: string;
  status: 'pending' | 'partially_approved' | 'approved' | 'rejected';
  // Related data
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
  requester: {
    id: string;
    name: string;
  };
}

export interface Transaction {
  id: string;
  location_code: string;
  part_number: string;
  transaction_type: string;
  quantity: number;
  transaction_date: string;
  reference_number?: string;
}

export class ManagerService {
  private static supabase = createClient();

  // Get variances needing review
  static async getVariances(filter?: 'all' | 'pending' | 'high_impact' | 'finished_goods'): Promise<Variance[]> {
    let query = this.supabase
      .from('journal_lines')
      .select(`
        id,
        expected_qty,
        status,
        location:locations(location_code),
        item:items(part_no, name, description, warehouse_type, standard_cost),
        journal:journals(journal_number)
      `)
      .in('status', ['Completed', 'Needs Recount']);

    const { data: lines, error } = await query;

    if (error) {
      console.error('Error fetching variances:', error);
      throw new Error('Failed to fetch variances');
    }

    if (!lines) return [];

    // Get count submissions for each line
    const variances: Variance[] = await Promise.all(
      lines.map(async (line) => {
        const { data: submissions } = await this.supabase
          .from('count_submissions')
          .select('*')
          .eq('journal_line_id', line.id)
          .order('submitted_at', { ascending: true });

        const count1 = submissions?.find(s => s.count_type === 'Count 1');
        const count2 = submissions?.find(s => s.count_type === 'Count 2');
        const count3 = submissions?.find(s => s.count_type === 'Count 3');

        const finalCount = count3?.count_value || count2?.count_value || count1?.count_value || 0;
        const varianceQty = finalCount - line.expected_qty;
        const variancePercent = line.expected_qty > 0 
          ? (varianceQty / line.expected_qty) * 100 
          : 0;

        const standardCost = line.item.standard_cost || 0;
        const isHighImpact = standardCost * Math.abs(varianceQty) > 1000; // $1000 threshold

        const photoUrl = submissions?.find(s => s.photo_url)?.photo_url;

        // Determine status
        let status: Variance['status'] = 'pending_review';
        if (Math.abs(varianceQty) === 0) {
          status = 'approved';
        } else if (line.item.warehouse_type === 'Finishedgoods' && !photoUrl) {
          status = 'needs_approval';
        }

        // Get approval status if exists
        const { data: approval } = await this.supabase
          .from('approvals')
          .select('ic_manager_approval, ic_manager_approved_by, ic_manager_approved_at, warehouse_manager_approval, warehouse_manager_approved_by, warehouse_manager_approved_at')
          .eq('journal_line_id', line.id)
          .single();

        return {
          id: line.id,
          journal_line_id: line.id,
          location_code: line.location.location_code,
          part_number: line.item.part_no,
          expected_qty: line.expected_qty,
          count1_qty: count1?.count_value,
          count2_qty: count2?.count_value,
          count3_qty: count3?.count_value,
          final_count: finalCount,
          variance_qty: varianceQty,
          variance_percent: variancePercent,
          warehouse_type: line.item.warehouse_type || '',
          standard_cost: standardCost,
          is_high_impact: isHighImpact,
          status,
          photo_url: photoUrl,
          created_at: line.created_at || new Date().toISOString(),
          ic_manager_approval: approval?.ic_manager_approval,
          ic_manager_approved_by: approval?.ic_manager_approved_by,
          ic_manager_approved_at: approval?.ic_manager_approved_at,
          warehouse_manager_approval: approval?.warehouse_manager_approval,
          warehouse_manager_approved_by: approval?.warehouse_manager_approved_by,
          warehouse_manager_approved_at: approval?.warehouse_manager_approved_at,
          location: {
            id: line.location.id || '',
            location_code: line.location.location_code
          },
          item: {
            id: line.item.id || '',
            part_no: line.item.part_no,
            name: line.item.name || '',
            description: line.item.description || '',
            warehouse_type: line.item.warehouse_type || '',
            standard_cost: standardCost
          },
          journal: {
            id: line.journal.id || '',
            journal_number: line.journal.journal_number
          }
        };
      })
    );

    // Apply filters
    if (filter === 'pending') {
      return variances.filter(v => v.status === 'pending_review' || v.status === 'needs_approval');
    }
    if (filter === 'high_impact') {
      return variances.filter(v => v.is_high_impact);
    }
    if (filter === 'finished_goods') {
      return variances.filter(v => v.warehouse_type === 'Finishedgoods');
    }

    return variances.filter(v => Math.abs(v.variance_qty) > 0);
  }

  // Get transactions for a location/part to reconcile variance
  static async getTransactionsForVariance(
    locationCode: string,
    partNumber: string,
    startDate: string,
    endDate: string
  ): Promise<Transaction[]> {
    // This would query your transactions table
    // For now, return mock structure - you'll need to implement based on your transaction schema
    const { data, error } = await this.supabase
      .from('transactions')
      .select('*')
      .eq('location_code', locationCode)
      .eq('part_number', partNumber)
      .gte('transaction_date', startDate)
      .lte('transaction_date', endDate)
      .order('transaction_date', { ascending: false });

    if (error) {
      console.error('Error fetching transactions:', error);
      // Return empty array if table doesn't exist yet
      return [];
    }

    return (data || []).map(t => ({
      id: t.id,
      location_code: t.location_code,
      part_number: t.part_number,
      transaction_type: t.transaction_type,
      quantity: t.quantity,
      transaction_date: t.transaction_date,
      reference_number: t.reference_number
    }));
  }

  // Get approval requests (especially Finished Goods)
  static async getApprovalRequests(filter?: 'all' | 'pending' | 'high_impact' | 'needs_warehouse_manager' | 'needs_ic_manager'): Promise<ApprovalRequest[]> {
    const variances = await this.getVariances('all');
    
    const approvalRequests: ApprovalRequest[] = variances
      .filter(v => 
        v.status === 'needs_approval' || 
        (v.is_high_impact && v.status === 'pending_review') ||
        (v.warehouse_type === 'Finishedgoods' && Math.abs(v.variance_qty) > 0)
      )
      .map(v => {
        // Check if IC Manager has approved (for high-impact items)
        const needsWarehouseManagerApproval = v.is_high_impact && 
          v.warehouse_manager_approval !== 'approved';

        return {
          id: v.id,
          journal_line_id: v.journal_line_id,
          location_code: v.location_code,
          part_number: v.part_number,
          expected_qty: v.expected_qty,
          actual_qty: v.final_count,
          variance_qty: v.variance_qty,
          warehouse_type: v.warehouse_type,
          is_high_impact: v.is_high_impact,
          photo_url: v.photo_url,
          requested_by: '', // Would come from count submission
          requested_at: v.created_at,
          warehouse_manager_approval: needsWarehouseManagerApproval ? 'pending' : undefined,
          status: needsWarehouseManagerApproval ? 'partially_approved' : 'pending',
          item: {
            id: v.item.id,
            part_no: v.item.part_no,
            name: v.item.name,
            standard_cost: v.item.standard_cost
          },
          requester: {
            id: '',
            name: '',
            email: ''
          }
        };
      });

    // Apply filters
    if (filter === 'pending') {
      return approvalRequests.filter(a => a.status === 'pending');
    }
    if (filter === 'high_impact') {
      return approvalRequests.filter(a => a.is_high_impact);
    }
    if (filter === 'needs_warehouse_manager') {
      return approvalRequests.filter(a => a.warehouse_manager_approval === 'pending');
    }
    if (filter === 'needs_ic_manager') {
      return approvalRequests.filter(a => a.is_high_impact && a.ic_manager_approval === 'pending');
    }

    return approvalRequests;
  }

  // Approve variance/adjustment
  static async approveVariance(
    varianceId: string,
    managerId: string,
    managerRole: 'IC_Manager' | 'Warehouse_Manager',
    notes?: string
  ): Promise<void> {
    const variance = await this.getVarianceById(varianceId);
    if (!variance) throw new Error('Variance not found');

    // Check if approval record exists
    const { data: existingApproval } = await this.supabase
      .from('approvals')
      .select('*')
      .eq('journal_line_id', varianceId)
      .single();

    const updateData: any = {
      journal_line_id: varianceId,
      is_high_impact: variance.is_high_impact,
      adjustment_qty: variance.variance_qty,
      comments: notes,
      updated_at: new Date().toISOString()
    };

    if (managerRole === 'IC_Manager') {
      updateData.ic_manager_approval = 'approved';
      updateData.ic_manager_approved_by = managerId;
      updateData.ic_manager_approved_at = new Date().toISOString();
    }

    if (managerRole === 'Warehouse_Manager') {
      updateData.warehouse_manager_approval = 'approved';
      updateData.warehouse_manager_approved_by = managerId;
      updateData.warehouse_manager_approved_at = new Date().toISOString();
    }

    // Create or update approval record
    if (existingApproval) {
      const { error } = await this.supabase
        .from('approvals')
        .update(updateData)
        .eq('id', existingApproval.id);

      if (error) {
        console.error('Error updating approval:', error);
        throw new Error('Failed to update approval');
      }
    } else {
      updateData.requested_by = managerId;
      updateData.requested_at = new Date().toISOString();
      const { error } = await this.supabase
        .from('approvals')
        .insert(updateData);

      if (error) {
        console.error('Error creating approval:', error);
        throw new Error('Failed to create approval');
      }
    }

    // Check if both approvals received for high-impact items
    if (variance.is_high_impact) {
      const { data: approval } = await this.supabase
        .from('approvals')
        .select('ic_manager_approval, warehouse_manager_approval')
        .eq('journal_line_id', varianceId)
        .single();

      if (approval?.ic_manager_approval === 'approved' && 
          approval?.warehouse_manager_approval === 'approved') {
        // Both approvals complete - update status
        await this.supabase
          .from('approvals')
          .update({ status: 'approved' })
          .eq('journal_line_id', varianceId);

        // Update journal line status
        await this.supabase
          .from('journal_lines')
          .update({
            status: 'Completed',
            updated_at: new Date().toISOString()
          })
          .eq('id', varianceId);
      } else if (managerRole === 'IC_Manager') {
        // IC Manager approved - update status to partially approved
        await this.supabase
          .from('approvals')
          .update({ status: 'pending' }) // Still pending warehouse manager approval
          .eq('journal_line_id', varianceId);
      }
    } else {
      // Non-high-impact: single approval completes it
      await this.supabase
        .from('approvals')
        .update({ status: 'approved' })
        .eq('journal_line_id', varianceId);

      await this.supabase
        .from('journal_lines')
        .update({
          status: 'Completed',
          updated_at: new Date().toISOString()
        })
        .eq('id', varianceId);
    }
  }

  // Reject variance/adjustment
  static async rejectVariance(
    varianceId: string,
    managerId: string,
    managerRole: 'IC_Manager' | 'Warehouse_Manager',
    reason: string
  ): Promise<void> {
    const variance = await this.getVarianceById(varianceId);
    if (!variance) throw new Error('Variance not found');

    // Check if approval record exists
    const { data: existingApproval } = await this.supabase
      .from('approvals')
      .select('*')
      .eq('journal_line_id', varianceId)
      .single();

    const updateData: any = {
      journal_line_id: varianceId,
      is_high_impact: variance.is_high_impact,
      adjustment_qty: variance.variance_qty,
      comments: reason,
      updated_at: new Date().toISOString()
    };

    if (managerRole === 'IC_Manager') {
      updateData.ic_manager_approval = 'rejected';
      updateData.ic_manager_approved_by = managerId;
      updateData.ic_manager_approved_at = new Date().toISOString();
    }

    if (managerRole === 'Warehouse_Manager') {
      updateData.warehouse_manager_approval = 'rejected';
      updateData.warehouse_manager_approved_by = managerId;
      updateData.warehouse_manager_approved_at = new Date().toISOString();
    }

    // Create or update approval record
    if (existingApproval) {
      await this.supabase
        .from('approvals')
        .update(updateData)
        .eq('id', existingApproval.id);
    } else {
      updateData.requested_by = managerId;
      updateData.requested_at = new Date().toISOString();
      await this.supabase
        .from('approvals')
        .insert(updateData);
    }

    // Rejection marks as rejected
    await this.supabase
      .from('approvals')
      .update({ status: 'rejected' })
      .eq('journal_line_id', varianceId);

    // Mark journal line as needs recount
    await this.supabase
      .from('journal_lines')
      .update({
        status: 'Needs Recount',
        updated_at: new Date().toISOString()
      })
      .eq('id', varianceId);
  }

  // Get Verified Counter requests
  static async getVerifiedCounterRequests(filter?: 'all' | 'pending' | 'needs_warehouse_manager' | 'needs_ic_manager'): Promise<VerifiedCounterRequest[]> {
    // Get certification records from verified_counter_certifications table
    const { data: certs, error: certsError } = await this.supabase
      .from('verified_counter_certifications')
      .select(`
        *,
        user:users!verified_counter_certifications_user_id_fkey(id, name, email, role)
      `)
      .order('requested_at', { ascending: false });

    if (certsError) {
      console.error('Error fetching verified counter certifications:', certsError);
      // Fallback: return empty array if table doesn't exist yet
      return [];
    }

    if (!certs) return [];

    // Also get users who could be certified but don't have a request yet
    const { data: eligibleUsers } = await this.supabase
      .from('users')
      .select('id, name, email, role, is_verified_counter, created_at')
      .in('role', ['Lead', 'Warehouse_Supervisor'])
      .eq('is_verified_counter', false);

    const requests: VerifiedCounterRequest[] = [];

    // Add existing certification requests
    certs.forEach((cert: any) => {
      requests.push({
        id: cert.id,
        user_id: cert.user_id,
        requested_by: cert.requested_by || cert.user_id,
        requested_at: cert.requested_at || cert.created_at,
        ic_manager_approval: cert.ic_manager_approval,
        ic_manager_approved_by: cert.ic_manager_approved_by,
        ic_manager_approved_at: cert.ic_manager_approved_at,
        warehouse_manager_approval: cert.warehouse_manager_approval,
        warehouse_manager_approved_by: cert.warehouse_manager_approved_by,
        warehouse_manager_approved_at: cert.warehouse_manager_approved_at,
        status: cert.status || 'pending',
        user: {
          id: cert.user.id,
          name: cert.user.name,
          email: cert.user.email,
          role: cert.user.role
        },
        requester: {
          id: cert.requested_by || cert.user_id,
          name: cert.user.name
        }
      });
    });

    // Add eligible users without requests (for creating new requests)
    if (eligibleUsers) {
      eligibleUsers.forEach((user) => {
        const hasRequest = certs.some((c: any) => c.user_id === user.id);
        if (!hasRequest) {
          requests.push({
            id: `vc-request-${user.id}`,
            user_id: user.id,
            requested_by: user.id,
            requested_at: user.created_at,
            ic_manager_approval: 'pending',
            warehouse_manager_approval: 'pending',
            status: 'pending',
            user: {
              id: user.id,
              name: user.name,
              email: user.email,
              role: user.role
            },
            requester: {
              id: user.id,
              name: user.name
            }
          });
        }
      });
    }

    // Apply filters
    if (filter === 'pending') {
      return requests.filter(r => r.status === 'pending');
    }
    if (filter === 'needs_warehouse_manager') {
      return requests.filter(r => r.ic_manager_approval === 'approved' && r.warehouse_manager_approval === 'pending');
    }
    if (filter === 'needs_ic_manager') {
      return requests.filter(r => r.ic_manager_approval === 'pending');
    }

    return requests;
  }

  // Approve Verified Counter request
  static async approveVerifiedCounter(
    requestId: string,
    managerId: string,
    managerRole: 'IC_Manager' | 'Warehouse_Manager'
  ): Promise<void> {
    // Extract user_id from requestId (format: vc-request-{userId})
    const userId = requestId.replace('vc-request-', '');

    // Check if certification record exists
    const { data: existingCert } = await this.supabase
      .from('verified_counter_certifications')
      .select('*')
      .eq('user_id', userId)
      .single();

    const updateData: any = {
      user_id: userId,
      updated_at: new Date().toISOString()
    };

    if (managerRole === 'IC_Manager') {
      updateData.ic_manager_approval = 'approved';
      updateData.ic_manager_approved_by = managerId;
      updateData.ic_manager_approved_at = new Date().toISOString();
    }

    if (managerRole === 'Warehouse_Manager') {
      updateData.warehouse_manager_approval = 'approved';
      updateData.warehouse_manager_approved_by = managerId;
      updateData.warehouse_manager_approved_at = new Date().toISOString();
    }

    // Create or update certification record
    if (existingCert) {
      const { error } = await this.supabase
        .from('verified_counter_certifications')
        .update(updateData)
        .eq('id', existingCert.id);

      if (error) {
        console.error('Error updating verified counter certification:', error);
        throw new Error('Failed to update certification');
      }
    } else {
      updateData.requested_by = managerId;
      updateData.requested_at = new Date().toISOString();
      const { error } = await this.supabase
        .from('verified_counter_certifications')
        .insert(updateData);

      if (error) {
        console.error('Error creating verified counter certification:', error);
        throw new Error('Failed to create certification');
      }
    }

    // Check if both approvals received
    const { data: cert } = await this.supabase
      .from('verified_counter_certifications')
      .select('ic_manager_approval, warehouse_manager_approval')
      .eq('user_id', userId)
      .single();

    if (cert?.ic_manager_approval === 'approved' && 
        cert?.warehouse_manager_approval === 'approved') {
      // Both approvals complete - grant certification
      await this.supabase
        .from('users')
        .update({
          is_verified_counter: true,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId);

      // Update certification status
      await this.supabase
        .from('verified_counter_certifications')
        .update({ status: 'approved' })
        .eq('user_id', userId);
    }
  }

  // Helper: Get variance by ID
  private static async getVarianceById(varianceId: string): Promise<Variance | null> {
    const variances = await this.getVariances('all');
    return variances.find(v => v.id === varianceId) || null;
  }
}
