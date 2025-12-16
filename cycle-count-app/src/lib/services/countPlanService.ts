// ============================================================================
// COUNT PLAN SERVICE - Backend operations for count plans
// ============================================================================

import { createClient } from '@/lib/supabase/client';

export interface CountPlan {
  id: string;
  review_cycle_id: string;
  location_id: string;
  item_id: string;
  expected_qty: number;
  expected_qty_at_count: number;
  standard_cost_at_count?: number;
  created_at: string;
  // Related data
  location: {
    id: string;
    location_code: string;
    building: string;
    bay: string;
    row: string;
    tier: string;
  };
  item: {
    id: string;
    part_no: string;
    name: string;
    description: string;
    warehouse_type?: string;
    standard_cost?: number;
  };
  review_cycle: {
    id: string;
    cycle_date: string;
    status: string;
  };
}

export interface ReviewCycle {
  id: string;
  cycle_date: string;
  status: 'open' | 'closed';
  closed_at?: string;
  created_at: string;
}

export class CountPlanService {
  private static supabase = createClient();

  // Get all review cycles
  static async getReviewCycles(): Promise<ReviewCycle[]> {
    const { data, error } = await this.supabase
      .from('review_cycles')
      .select('*')
      .order('cycle_date', { ascending: false });

    if (error) {
      console.error('Error fetching review cycles:', error);
      throw new Error('Failed to fetch review cycles');
    }

    return data || [];
  }

  // Get count plans for a review cycle
  static async getCountPlans(reviewCycleId?: string, filter?: 'all' | 'pending' | 'completed'): Promise<CountPlan[]> {
    let query = this.supabase
      .from('count_plans')
      .select(`
        *,
        location:locations(id, location_code, building, bay, row, tier),
        item:items(id, part_no, name, description, warehouse_type, standard_cost),
        review_cycle:review_cycles(id, cycle_date, status)
      `);

    if (reviewCycleId) {
      query = query.eq('review_cycle_id', reviewCycleId);
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching count plans:', error);
      throw new Error('Failed to fetch count plans');
    }

    if (!data) return [];

    // Check if plans have been counted (have journal lines)
    const plansWithStatus = await Promise.all(
      data.map(async (plan) => {
        const { data: journalLines } = await this.supabase
          .from('journal_lines')
          .select('status')
          .eq('plan_id', plan.id)
          .limit(1);

        const hasJournalLine = journalLines && journalLines.length > 0;
        const isCompleted = journalLines?.[0]?.status === 'Completed';

        return {
          ...plan,
          status: hasJournalLine ? (isCompleted ? 'completed' : 'in_progress') : 'pending'
        };
      })
    );

    // Apply filter
    if (filter === 'pending') {
      return plansWithStatus.filter(p => p.status === 'pending');
    }
    if (filter === 'completed') {
      return plansWithStatus.filter(p => p.status === 'completed');
    }

    return plansWithStatus;
  }

  // Get count plan by ID
  static async getCountPlanById(planId: string): Promise<CountPlan | null> {
    const { data, error } = await this.supabase
      .from('count_plans')
      .select(`
        *,
        location:locations(id, location_code, building, bay, row, tier),
        item:items(id, part_no, name, description, warehouse_type, standard_cost),
        review_cycle:review_cycles(id, cycle_date, status)
      `)
      .eq('id', planId)
      .single();

    if (error) {
      console.error('Error fetching count plan:', error);
      return null;
    }

    return data;
  }

  // Create review cycle
  static async createReviewCycle(cycleDate: string): Promise<ReviewCycle> {
    const { data, error } = await this.supabase
      .from('review_cycles')
      .insert({
        cycle_date: cycleDate,
        status: 'open'
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating review cycle:', error);
      throw new Error('Failed to create review cycle');
    }

    return data;
  }

  // Create count plans from OnHand data
  static async createCountPlansFromOnHand(
    reviewCycleId: string,
    locationIds: string[],
    itemIds: string[]
  ): Promise<CountPlan[]> {
    // Get OnHand data for these locations/items
    const { data: onhandData } = await this.supabase
      .from('onhand')
      .select('location_id, item_id, quantity')
      .in('location_id', locationIds)
      .in('item_id', itemIds);

    if (!onhandData) return [];

    const plans = onhandData.map(oh => ({
      review_cycle_id: reviewCycleId,
      location_id: oh.location_id,
      item_id: oh.item_id,
      expected_qty: oh.quantity,
      expected_qty_at_count: oh.quantity
    }));

    const { data, error } = await this.supabase
      .from('count_plans')
      .insert(plans)
      .select();

    if (error) {
      console.error('Error creating count plans:', error);
      throw new Error('Failed to create count plans');
    }

    return data || [];
  }
}
