// ============================================================================
// USER SERVICE - Supabase User Management
// ============================================================================
// Location: /lib/services/userService.ts
// Purpose: Service for managing users in Supabase

import { createClient } from '@/lib/supabase/client';

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'Admin' | 'IC_Manager' | 'Warehouse_Manager' | 'Warehouse_Supervisor' | 'Lead' | 'Operator' | 'Viewer';
  shift: 'Day' | 'Night' | 'Swing';
  zones: string[];
  is_active: boolean;
  is_verified_counter: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface CreateUserData {
  email: string;
  name: string;
  role: User['role'];
  shift: User['shift'];
  zones: string[];
  is_active: boolean;
  is_verified_counter: boolean;
  password: string; // For creating auth user
}

export interface UpdateUserData {
  name?: string;
  role?: User['role'];
  shift?: User['shift'];
  zones?: string[];
  is_active?: boolean;
  is_verified_counter?: boolean;
}

export class UserService {
  /**
   * Get all users from Supabase
   */
  static async getAllUsers(): Promise<User[]> {
    const supabase = createClient();
    
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching users:', error);
      throw new Error(`Failed to fetch users: ${error.message}`);
    }

    return (data || []).map(user => ({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      shift: user.shift,
      zones: user.zones || [],
      is_active: user.is_active ?? true,
      is_verified_counter: user.is_verified_counter ?? false,
      created_at: user.created_at,
      updated_at: user.updated_at
    }));
  }

  /**
   * Get a single user by ID
   */
  static async getUserById(userId: string): Promise<User | null> {
    const supabase = createClient();
    
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('Error fetching user:', error);
      throw new Error(`Failed to fetch user: ${error.message}`);
    }

    if (!data) return null;

    return {
      id: data.id,
      email: data.email,
      name: data.name,
      role: data.role,
      shift: data.shift,
      zones: data.zones || [],
      is_active: data.is_active ?? true,
      is_verified_counter: data.is_verified_counter ?? false,
      created_at: data.created_at,
      updated_at: data.updated_at
    };
  }

  /**
   * Create a new user in Supabase Auth and users table
   * Uses API route for server-side admin operations
   */
  static async createUser(userData: CreateUserData): Promise<User> {
    const response = await fetch('/api/users/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: userData.email,
        name: userData.name,
        role: userData.role,
        shift: userData.shift,
        zones: userData.zones,
        is_active: userData.is_active,
        is_verified_counter: userData.is_verified_counter,
        password: userData.password
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to create user');
    }

    const { user: profileData } = await response.json();

    return {
      id: profileData.id,
      email: profileData.email,
      name: profileData.name,
      role: profileData.role,
      shift: profileData.shift,
      zones: profileData.zones || [],
      is_active: profileData.is_active ?? true,
      is_verified_counter: profileData.is_verified_counter ?? false,
      created_at: profileData.created_at,
      updated_at: profileData.updated_at
    };
  }

  /**
   * Update an existing user
   */
  static async updateUser(userId: string, userData: UpdateUserData): Promise<User> {
    const supabase = createClient();

    const { data, error } = await supabase
      .from('users')
      .update({
        ...userData,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId)
      .select()
      .single();

    if (error) {
      console.error('Error updating user:', error);
      throw new Error(`Failed to update user: ${error.message}`);
    }

    return {
      id: data.id,
      email: data.email,
      name: data.name,
      role: data.role,
      shift: data.shift,
      zones: data.zones || [],
      is_active: data.is_active ?? true,
      is_verified_counter: data.is_verified_counter ?? false,
      created_at: data.created_at,
      updated_at: data.updated_at
    };
  }

  /**
   * Delete a user (deactivates instead of hard delete)
   */
  static async deactivateUser(userId: string): Promise<void> {
    const supabase = createClient();

    const { error } = await supabase
      .from('users')
      .update({
        is_active: false,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId);

    if (error) {
      console.error('Error deactivating user:', error);
      throw new Error(`Failed to deactivate user: ${error.message}`);
    }
  }

  /**
   * Activate a user
   */
  static async activateUser(userId: string): Promise<void> {
    const supabase = createClient();

    const { error } = await supabase
      .from('users')
      .update({
        is_active: true,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId);

    if (error) {
      console.error('Error activating user:', error);
      throw new Error(`Failed to activate user: ${error.message}`);
    }
  }
}

