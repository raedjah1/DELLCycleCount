// ============================================================================
// SUPABASE DATABASE TYPES - Auto-generated from Supabase
// ============================================================================

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          name: string
          role: 'admin' | 'ic_owner' | 'ic_manager' | 'warehouse_manager' | 'warehouse_supervisor' | 'lead' | 'operator' | 'viewer'
          is_verified_counter: boolean
          shift_type: 'A' | 'B' | 'C'
          availability_status: 'present_available' | 'on_break' | 'on_lunch' | 'not_available'
          zone_access: string[] | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          name: string
          role: 'admin' | 'ic_owner' | 'ic_manager' | 'warehouse_manager' | 'warehouse_supervisor' | 'lead' | 'operator' | 'viewer'
          is_verified_counter?: boolean
          shift_type: 'A' | 'B' | 'C'
          availability_status?: 'present_available' | 'on_break' | 'on_lunch' | 'not_available'
          zone_access?: string[] | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string
          role?: 'admin' | 'ic_owner' | 'ic_manager' | 'warehouse_manager' | 'warehouse_supervisor' | 'lead' | 'operator' | 'viewer'
          is_verified_counter?: boolean
          shift_type?: 'A' | 'B' | 'C'
          availability_status?: 'present_available' | 'on_break' | 'on_lunch' | 'not_available'
          zone_access?: string[] | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      locations: {
        Row: {
          id: string
          location_code: string
          warehouse: string
          business: string
          aisle: string
          bay: string
          position_level: string
          zone_id: string
          is_risk_location: boolean
          risk_reason: string | null
          risk_notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          location_code: string
          warehouse: string
          business: string
          aisle: string
          bay: string
          position_level: string
          zone_id: string
          is_risk_location?: boolean
          risk_reason?: string | null
          risk_notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          location_code?: string
          warehouse?: string
          business?: string
          aisle?: string
          bay?: string
          position_level?: string
          zone_id?: string
          is_risk_location?: boolean
          risk_reason?: string | null
          risk_notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "locations_zone_id_fkey"
            columns: ["zone_id"]
            isOneToOne: false
            referencedRelation: "zones"
            referencedColumns: ["id"]
          }
        ]
      }
      zones: {
        Row: {
          id: string
          zone_code: string
          name: string
          description: string | null
          warehouse: string
          default_journal_size: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          zone_code: string
          name: string
          description?: string | null
          warehouse: string
          default_journal_size?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          zone_code?: string
          name?: string
          description?: string | null
          warehouse?: string
          default_journal_size?: number
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      items: {
        Row: {
          id: string
          part_number: string
          description: string
          product_type: 'laptop' | 'server' | 'switches' | 'desktop' | 'aio'
          warehouse_type: 'rawgoods' | 'production' | 'finishedgoods'
          abc_class: 'A' | 'B' | 'C'
          standard_cost: number
          rawgoods_serial_required: boolean
          is_high_impact: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          part_number: string
          description: string
          product_type: 'laptop' | 'server' | 'switches' | 'desktop' | 'aio'
          warehouse_type: 'rawgoods' | 'production' | 'finishedgoods'
          abc_class: 'A' | 'B' | 'C'
          standard_cost: number
          rawgoods_serial_required?: boolean
          is_high_impact?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          part_number?: string
          description?: string
          product_type?: 'laptop' | 'server' | 'switches' | 'desktop' | 'aio'
          warehouse_type?: 'rawgoods' | 'production' | 'finishedgoods'
          abc_class?: 'A' | 'B' | 'C'
          standard_cost?: number
          rawgoods_serial_required?: boolean
          is_high_impact?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      role_type: 'admin' | 'ic_owner' | 'ic_manager' | 'warehouse_manager' | 'warehouse_supervisor' | 'lead' | 'operator' | 'viewer'
      warehouse_type: 'rawgoods' | 'production' | 'finishedgoods'
      product_type: 'laptop' | 'server' | 'switches' | 'desktop' | 'aio'
      abc_class: 'A' | 'B' | 'C'
      shift_type: 'A' | 'B' | 'C'
      availability_status: 'present_available' | 'on_break' | 'on_lunch' | 'not_available'
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
      PublicSchema["Views"])
  ? (PublicSchema["Tables"] &
      PublicSchema["Views"])[PublicTableNameOrOptions] extends {
      Row: infer R
    }
    ? R
    : never
  : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
  ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
      Insert: infer I
    }
    ? I
    : never
  : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
  ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
      Update: infer U
    }
    ? U
    : never
  : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
  ? PublicSchema["Enums"][PublicEnumNameOrOptions]
  : never
