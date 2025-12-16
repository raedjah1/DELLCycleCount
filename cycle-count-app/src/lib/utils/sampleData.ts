// ============================================================================
// SAMPLE DATA GENERATOR - Create test data for operator workflows
// ============================================================================

import { createClient } from '@/lib/supabase/client';

export class SampleDataGenerator {
  private static supabase = createClient();

  // Generate sample locations
  static async generateSampleLocations() {
    const locations = [
      {
        location_code: 'Reimage.ARB.AB.01.01A',
        building: 'ARB',
        bay: 'AB',
        row: '01',
        tier: '01',
        bin: 'A',
        location_group: 'Reimage',
        warehouse: 'Reimage'
      },
      {
        location_code: 'Reimage.ARB.AB.01.02B',
        building: 'ARB',
        bay: 'AB',
        row: '01',
        tier: '02',
        bin: 'B',
        location_group: 'Reimage',
        warehouse: 'Reimage'
      },
      {
        location_code: 'Reimage.ARB.AC.02.01A',
        building: 'ARB',
        bay: 'AC',
        row: '02',
        tier: '01',
        bin: 'A',
        location_group: 'Reimage',
        warehouse: 'Reimage'
      },
      {
        location_code: 'Production.PRD.PD.01.01A',
        building: 'PRD',
        bay: 'PD',
        row: '01',
        tier: '01',
        bin: 'A',
        location_group: 'Production',
        warehouse: 'Production'
      },
      {
        location_code: 'Finishedgoods.FGD.FG.01.01A',
        building: 'FGD',
        bay: 'FG',
        row: '01',
        tier: '01',
        bin: 'A',
        location_group: 'Finishedgoods',
        warehouse: 'Finishedgoods'
      }
    ];

    const { data, error } = await this.supabase
      .from('locations')
      .insert(locations)
      .select();

    if (error) {
      console.error('Error creating sample locations:', error);
      throw error;
    }

    return data;
  }

  // Generate sample items
  static async generateSampleItems() {
    const items = [
      {
        part_no: 'PART-001',
        name: 'Laptop Battery',
        description: 'Dell Latitude 5520 Battery 4-Cell 54Wh',
        serial_flag: 'Y',
        warehouse_type: 'Rawgoods',
        part_type: 'Component'
      },
      {
        part_no: 'PART-002',
        name: 'Memory Module',
        description: '16GB DDR4 3200MHz SO-DIMM',
        serial_flag: 'N',
        warehouse_type: 'Rawgoods',
        part_type: 'Component'
      },
      {
        part_no: 'LAPTOP-001',
        name: 'Dell Latitude 5520',
        description: 'Dell Latitude 5520 Complete System',
        serial_flag: 'Y',
        warehouse_type: 'Finishedgoods',
        part_type: 'System',
        standard_cost: 1299.99
      },
      {
        part_no: 'SWITCH-001',
        name: 'Network Switch',
        description: 'Dell PowerSwitch N1148T-ON 48-Port',
        serial_flag: 'Y',
        warehouse_type: 'Finishedgoods',
        part_type: 'System',
        standard_cost: 899.99
      },
      {
        part_no: 'CABLE-001',
        name: 'Ethernet Cable',
        description: 'Cat6 Ethernet Cable 3ft Blue',
        serial_flag: 'N',
        warehouse_type: 'Rawgoods',
        part_type: 'Component'
      }
    ];

    const { data, error } = await this.supabase
      .from('items')
      .insert(items)
      .select();

    if (error) {
      console.error('Error creating sample items:', error);
      throw error;
    }

    return data;
  }

  // Generate a sample review cycle
  static async generateSampleReviewCycle() {
    const { data: cycle, error: cycleError } = await this.supabase
      .from('review_cycles')
      .insert({
        cycle_date: new Date().toISOString().split('T')[0],
        status: 'open'
      })
      .select()
      .single();

    if (cycleError) {
      console.error('Error creating review cycle:', cycleError);
      throw cycleError;
    }

    return cycle;
  }

  // Generate sample count plans
  static async generateSampleCountPlans(reviewCycleId: string, locationIds: string[], itemIds: string[]) {
    const plans = [];
    
    for (let i = 0; i < Math.min(locationIds.length, itemIds.length); i++) {
      plans.push({
        review_cycle_id: reviewCycleId,
        location_id: locationIds[i],
        item_id: itemIds[i],
        expected_qty: Math.floor(Math.random() * 20) + 1,
        expected_qty_at_count: Math.floor(Math.random() * 20) + 1
      });
    }

    const { data, error } = await this.supabase
      .from('count_plans')
      .insert(plans)
      .select();

    if (error) {
      console.error('Error creating count plans:', error);
      throw error;
    }

    return data;
  }

  // Generate a sample journal
  static async generateSampleJournal(userId: string, planIds: string[]) {
    const journalNumber = `JNL-${Date.now()}`;
    
    const { data: journal, error: journalError } = await this.supabase
      .from('journals')
      .insert({
        journal_number: journalNumber,
        zone: 'Reimage',
        warehouse: 'Reimage',
        assigned_to: userId,
        total_lines: planIds.length,
        completed_lines: 0,
        status: 'assigned'
      })
      .select()
      .single();

    if (journalError) {
      console.error('Error creating journal:', journalError);
      throw journalError;
    }

    // Create journal lines
    const { data: plans } = await this.supabase
      .from('count_plans')
      .select(`
        *,
        location:locations(*),
        item:items(*)
      `)
      .in('id', planIds);

    if (!plans) throw new Error('No plans found');

    const journalLines = plans.map((plan, index) => ({
      journal_id: journal.id,
      plan_id: plan.id,
      location_id: plan.location_id,
      item_id: plan.item_id,
      sequence_number: index + 1,
      expected_qty: plan.expected_qty,
      status: 'Unstarted' as const
    }));

    const { data: lines, error: linesError } = await this.supabase
      .from('journal_lines')
      .insert(journalLines)
      .select();

    if (linesError) {
      console.error('Error creating journal lines:', linesError);
      throw linesError;
    }

    return { journal, lines };
  }

  // Generate complete sample data for testing
  static async generateCompleteTestData(userId: string) {
    try {
      console.log('Generating sample locations...');
      const locations = await this.generateSampleLocations();
      
      console.log('Generating sample items...');
      const items = await this.generateSampleItems();
      
      console.log('Generating review cycle...');
      const cycle = await this.generateSampleReviewCycle();
      
      console.log('Generating count plans...');
      const plans = await this.generateSampleCountPlans(
        cycle.id,
        locations.map(l => l.id),
        items.map(i => i.id)
      );
      
      console.log('Generating sample journal...');
      const { journal, lines } = await this.generateSampleJournal(
        userId,
        plans.map(p => p.id)
      );
      
      console.log('Sample data generation complete!');
      return { locations, items, cycle, plans, journal, lines };
      
    } catch (error) {
      console.error('Error generating sample data:', error);
      throw error;
    }
  }

  // Clean up all sample data
  static async cleanupSampleData() {
    const tables = [
      'serial_captures',
      'count_submissions', 
      'journal_lines',
      'journals',
      'count_plans',
      'review_cycles',
      'items',
      'locations'
    ];

    for (const table of tables) {
      const { error } = await this.supabase
        .from(table)
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all

      if (error) {
        console.error(`Error cleaning up ${table}:`, error);
      } else {
        console.log(`Cleaned up ${table}`);
      }
    }
  }
}
