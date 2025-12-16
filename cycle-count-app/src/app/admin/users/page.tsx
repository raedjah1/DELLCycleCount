// ============================================================================
// USER MANAGEMENT - Admin User and Role Management
// ============================================================================
// Admin screen for managing users, roles, and Verified Counter certifications

'use client';

import { useState, useEffect } from 'react';
import { AddUserForm, EditUserForm, UserFormData } from '@/components/forms';
import { UserService, User } from '@/lib/services/userService';

export default function UserManagementPage() {
  const [activeTab, setActiveTab] = useState<'manage' | 'roles' | 'verified'>('manage');
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [togglingUserId, setTogglingUserId] = useState<string | null>(null);

  // Users from Supabase
  const [users, setUsers] = useState<User[]>([]);

  // Fetch users from Supabase
  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setIsLoading(true);
      setError('');
      const fetchedUsers = await UserService.getAllUsers();
      setUsers(fetchedUsers);
    } catch (err: any) {
      setError(err.message || 'Failed to load users');
      console.error('Error loading users:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Mock pending verified counter requests
  const [verifiedCounterRequests] = useState<VerifiedCounterRequest[]>([
    {
      id: '1',
      userId: '3',
      userName: 'Maria Garcia',
      userRole: 'Lead',
      requestedBy: 'John Smith (Warehouse Manager)',
      requestedAt: '2024-12-14T16:30:00Z',
      icManagerApproval: 'approved',
      warehouseManagerApproval: 'pending',
      status: 'pending'
    }
  ]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Tab Navigation */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab('manage')}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'manage'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                  </svg>
                  Manage Users
                </div>
              </button>
              <button
                onClick={() => setActiveTab('roles')}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'roles'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  Role Permissions
                </div>
              </button>
              <button
                onClick={() => setActiveTab('verified')}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors relative ${
                  activeTab === 'verified'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Verified Counter
                  {verifiedCounterRequests.length > 0 && (
                    <span className="ml-2 inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-500 rounded-full">
                      {verifiedCounterRequests.length}
                    </span>
                  )}
                </div>
              </button>
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'manage' && (
              <>
                {/* Add User Form - Inline */}
                {showAddUserModal && (
                  <div className="mb-8">
                    <AddUserForm 
                      onClose={() => {
                        setShowAddUserModal(false);
                        loadUsers(); // Refresh users list
                      }}
                      onSave={async (userData: UserFormData) => {
                        try {
                          await UserService.createUser({
                            email: userData.email,
                            name: userData.name,
                            role: userData.role as User['role'],
                            shift: userData.shift as User['shift'],
                            zones: userData.zones,
                            is_active: userData.isActive,
                            is_verified_counter: userData.isVerifiedCounter,
                            password: userData.password
                          });
                          setShowAddUserModal(false);
                          await loadUsers(); // Refresh users list
                        } catch (err: any) {
                          throw new Error(err.message || 'Failed to create user');
                        }
                      }}
                    />
                  </div>
                )}

                {/* Edit User Form - Inline */}
                {selectedUser && (
                  <div className="mb-8">
                    <EditUserForm
                      user={{
                        id: selectedUser.id,
                        name: selectedUser.name,
                        email: selectedUser.email,
                        role: selectedUser.role,
                        shift: selectedUser.shift,
                        zones: selectedUser.zones,
                        isActive: selectedUser.is_active,
                        isVerifiedCounter: selectedUser.is_verified_counter
                      }}
                      onClose={() => {
                        setSelectedUser(null);
                        loadUsers(); // Refresh users list
                      }}
                      onSave={async (userData) => {
                        try {
                          await UserService.updateUser(selectedUser.id, {
                            name: userData.name,
                            role: userData.role as User['role'],
                            shift: userData.shift as User['shift'],
                            zones: userData.zones,
                            is_active: userData.isActive,
                            is_verified_counter: userData.isVerifiedCounter
                          });
                          setSelectedUser(null);
                          await loadUsers(); // Refresh users list
                        } catch (err: any) {
                          throw new Error(err.message || 'Failed to update user');
                        }
                      }}
                    />
                  </div>
                )}

                {/* User Management Tab - Always visible */}
                {isLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="text-center">
                      <svg className="animate-spin h-8 w-8 text-blue-600 mx-auto mb-4" fill="none" viewBox="0 0 24 24">
                        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25"></circle>
                        <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" className="opacity-75"></path>
                      </svg>
                      <p className="text-gray-600">Loading users...</p>
                    </div>
                  </div>
                ) : error ? (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm text-red-800">{error}</p>
                    <button
                      onClick={loadUsers}
                      className="mt-2 text-sm text-red-600 hover:text-red-800 underline"
                    >
                      Try again
                    </button>
                  </div>
                ) : (
                  <UserManagementTab 
                    users={users.map(u => ({
                      id: u.id,
                      name: u.name,
                      email: u.email,
                      role: u.role,
                      isVerifiedCounter: u.is_verified_counter,
                      isActive: u.is_active,
                      shift: u.shift,
                      zones: u.zones,
                      lastLogin: '', // TODO: Add last login tracking
                      createdAt: u.created_at || ''
                    }))} 
                    onAddUser={() => {
                      setSelectedUser(null); // Close edit form if open
                      setShowAddUserModal(true);
                    }}
                    onEditUser={(user) => {
                      setShowAddUserModal(false); // Close add form if open
                      // Find the full user object from Supabase
                      const fullUser = users.find(u => u.id === user.id);
                      if (fullUser) {
                        setSelectedUser(fullUser);
                      }
                    }}
                    onToggleActive={async (user) => {
                      // Confirm action
                      const action = user.isActive ? 'deactivate' : 'activate';
                      const confirmed = window.confirm(
                        `Are you sure you want to ${action} ${user.name} (${user.email})?`
                      );
                      
                      if (!confirmed) return;

                      try {
                        setError(''); // Clear any previous errors
                        setTogglingUserId(user.id); // Show loading state
                        
                        if (user.isActive) {
                          await UserService.deactivateUser(user.id);
                          console.log('✅ User deactivated:', user.email);
                        } else {
                          await UserService.activateUser(user.id);
                          console.log('✅ User activated:', user.email);
                        }
                        
                        // Reload users to show updated status
                        await loadUsers();
                      } catch (err: any) {
                        console.error('❌ Error toggling user status:', err);
                        setError(err.message || `Failed to ${action} user`);
                      } finally {
                        setTogglingUserId(null); // Clear loading state
                      }
                    }}
                    togglingUserId={togglingUserId}
                  />
                )}
              </>
            )}
            {activeTab === 'roles' && (
              <RolePermissionsTab />
            )}
            {activeTab === 'verified' && (
              <VerifiedCounterTab 
                users={users.map(u => ({
                  id: u.id,
                  name: u.name,
                  email: u.email,
                  role: u.role,
                  isVerifiedCounter: u.is_verified_counter,
                  isActive: u.is_active,
                  shift: u.shift,
                  zones: u.zones,
                  lastLogin: '', // TODO: Add last login tracking
                  createdAt: u.created_at || ''
                }))}
                requests={verifiedCounterRequests}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// USER MANAGEMENT TAB
// ============================================================================

interface UserManagementTabProps {
  users: UserDisplay[];
  onAddUser: () => void;
  onEditUser: (user: UserDisplay) => void;
  onToggleActive?: (user: UserDisplay) => void;
  togglingUserId?: string | null;
}

interface UserDisplay {
  id: string;
  name: string;
  email: string;
  role: string;
  isVerifiedCounter: boolean;
  isActive: boolean;
  shift: string;
  zones: string[];
  lastLogin: string;
  createdAt: string;
}

function UserManagementTab({ users, onAddUser, onEditUser, onToggleActive, togglingUserId }: UserManagementTabProps) {
  return (
    <div className="space-y-6">
      {/* Actions Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">System Users</h3>
          <p className="text-sm text-gray-500 mt-1">{users.length} total users, {users.filter(u => u.isActive).length} active</p>
        </div>
        <div className="flex space-x-3">
          <button className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
            Export Users
          </button>
          <button 
            onClick={onAddUser}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            Add User
          </button>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Shift & Zones
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Login
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-medium text-sm mr-4 ${
                        user.role === 'Admin' ? 'bg-blue-500' : 
                        user.role.includes('Manager') ? 'bg-purple-500' :
                        user.role === 'Lead' ? 'bg-orange-500' :
                        user.role === 'Operator' ? 'bg-green-500' : 'bg-gray-500'
                      }`}>
                        {user.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">{user.name}</div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-col space-y-1">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getRoleColor(user.role)}`}>
                        {formatRole(user.role)}
                      </span>
                      {user.isVerifiedCounter && (
                        <span className="inline-flex px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">
                          Verified Counter
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                      user.isActive 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {user.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{user.shift} Shift</div>
                    <div className="text-xs text-gray-500">
                      {user.zones.length > 0 ? user.zones.join(', ') : 'No zones assigned'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDateTime(user.lastLogin)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button 
                      onClick={() => onEditUser(user)}
                      className="text-blue-600 hover:text-blue-900 mr-4"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => onToggleActive?.(user)}
                      disabled={togglingUserId === user.id}
                      className={`${
                        user.isActive ? 'text-red-600 hover:text-red-900' : 'text-green-600 hover:text-green-900'
                      } disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                      {togglingUserId === user.id ? (
                        <span className="flex items-center">
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
                            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25"></circle>
                            <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" className="opacity-75"></path>
                          </svg>
                          {user.isActive ? 'Deactivating...' : 'Activating...'}
                        </span>
                      ) : (
                        user.isActive ? 'Deactivate' : 'Activate'
                      )}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// ROLE PERMISSIONS TAB
// ============================================================================

function RolePermissionsTab() {
  const rolePermissions = [
    {
      role: 'Admin',
      description: 'System configuration, user provisioning, master data maintenance',
      permissions: ['All system access', 'User management', 'Configuration', 'Master data', 'Import/Export'],
      color: 'bg-blue-100 text-blue-800'
    },
    {
      role: 'IC Manager',
      description: 'Inventory control ownership, variance review, approvals',
      permissions: ['Variance review', 'High-impact approvals', 'Verified counter governance', 'Reports'],
      color: 'bg-purple-100 text-purple-800'
    },
    {
      role: 'Warehouse Manager',
      description: 'Same as IC Manager plus additional sign-off for high-impact items',
      permissions: ['Variance review', 'High-impact approvals', 'Verified counter governance', 'Operational oversight'],
      color: 'bg-purple-100 text-purple-800'
    },
    {
      role: 'Warehouse Supervisor',
      description: 'Operational oversight, assignment and queue management',
      permissions: ['Assignment management', 'Queue oversight', 'Limited approvals', 'Team monitoring'],
      color: 'bg-indigo-100 text-indigo-800'
    },
    {
      role: 'Lead',
      description: 'Assign/reassign work, manage dispatch pool',
      permissions: ['Work assignment', 'Dispatch pool management', 'Team coordination', 'Task monitoring'],
      color: 'bg-orange-100 text-orange-800'
    },
    {
      role: 'Operator',
      description: 'Execute guided journals, submit counts, capture serials',
      permissions: ['Count execution', 'Journal access', 'Serial capture', 'Photo capture'],
      color: 'bg-green-100 text-green-800'
    },
    {
      role: 'Viewer',
      description: 'Read-only access to dashboards and metrics',
      permissions: ['Read-only dashboards', 'Reports viewing', 'Analytics access', 'Data export'],
      color: 'bg-gray-100 text-gray-800'
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900">Role-Based Access Control</h3>
        <p className="text-sm text-gray-500 mt-1">System roles and their associated permissions</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {rolePermissions.map((role, index) => (
          <div key={index} className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <span className={`inline-flex px-3 py-1 text-sm font-medium rounded-full ${role.color}`}>
                {formatRole(role.role)}
              </span>
            </div>
            
            <p className="text-sm text-gray-600 mb-4">{role.description}</p>
            
            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-2">Permissions:</h4>
              <ul className="space-y-1">
                {role.permissions.map((permission, idx) => (
                  <li key={idx} className="flex items-center text-xs text-gray-600">
                    <svg className="w-3 h-3 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {permission}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================================================
// VERIFIED COUNTER TAB
// ============================================================================

interface VerifiedCounterTabProps {
  users: UserDisplay[];
  requests: VerifiedCounterRequest[];
}

function VerifiedCounterTab({ users, requests }: VerifiedCounterTabProps) {
  const verifiedCounters = users.filter(u => u.isVerifiedCounter);
  const eligibleUsers = users.filter(u => 
    u.isActive && 
    !u.isVerifiedCounter && 
    ['Lead', 'Warehouse_Supervisor', 'IC_Manager', 'Warehouse_Manager'].includes(u.role)
  );

  return (
    <div className="space-y-8">
      {/* Pending Requests */}
      {requests.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Pending Verification Requests</h3>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg">
            {requests.map((request, index) => (
              <div key={request.id} className={`p-6 ${index > 0 ? 'border-t border-yellow-200' : ''}`}>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900">{request.userName}</h4>
                    <p className="text-sm text-gray-600">Role: {formatRole(request.userRole)}</p>
                    <p className="text-xs text-gray-500 mt-1">Requested by: {request.requestedBy}</p>
                    <p className="text-xs text-gray-500">Date: {formatDateTime(request.requestedAt)}</p>
                  </div>
                  
                  <div className="flex flex-col items-end space-y-2">
                    <div className="flex items-center space-x-4 text-sm">
                      <div className="flex items-center">
                        <span className="text-gray-600 mr-2">IC Manager:</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          request.icManagerApproval === 'approved' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-100 text-gray-600'
                        }`}>
                          {request.icManagerApproval === 'approved' ? 'Approved' : 'Pending'}
                        </span>
                      </div>
                      
                      <div className="flex items-center">
                        <span className="text-gray-600 mr-2">WH Manager:</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          request.warehouseManagerApproval === 'approved' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-100 text-gray-600'
                        }`}>
                          {request.warehouseManagerApproval === 'approved' ? 'Approved' : 'Pending'}
                        </span>
                      </div>
                    </div>
                    
                    {request.warehouseManagerApproval === 'pending' && (
                      <div className="flex space-x-2">
                        <button className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700 transition-colors">
                          Approve
                        </button>
                        <button className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition-colors">
                          Reject
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Current Verified Counters */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Current Verified Counters</h3>
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Primary Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Certified Since
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {verifiedCounters.map((user) => (
                <tr key={user.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center text-white font-medium text-xs mr-3">
                        ✓
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">{user.name}</div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getRoleColor(user.role)}`}>
                      {formatRole(user.role)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDateTime(user.createdAt)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button className="text-red-600 hover:text-red-900">
                      Revoke Certification
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Eligible Users for Certification */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Eligible for Verification</h3>
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {eligibleUsers.map((user) => (
                <tr key={user.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-medium text-xs mr-3 ${
                        user.role === 'Lead' ? 'bg-orange-500' : 'bg-purple-500'
                      }`}>
                        {user.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">{user.name}</div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getRoleColor(user.role)}`}>
                      {formatRole(user.role)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button className="text-blue-600 hover:text-blue-900">
                      Request Certification
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}


// ============================================================================
// TYPES AND UTILITY FUNCTIONS
// ============================================================================


interface VerifiedCounterRequest {
  id: string;
  userId: string;
  userName: string;
  userRole: string;
  requestedBy: string;
  requestedAt: string;
  icManagerApproval: 'pending' | 'approved' | 'rejected';
  warehouseManagerApproval: 'pending' | 'approved' | 'rejected';
  status: 'pending' | 'approved' | 'rejected';
}

function formatRole(role: string): string {
  return role.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
}

function getRoleColor(role: string): string {
  switch (role) {
    case 'Admin': return 'bg-blue-100 text-blue-800';
    case 'IC_Manager':
    case 'Warehouse_Manager': return 'bg-purple-100 text-purple-800';
    case 'Warehouse_Supervisor': return 'bg-indigo-100 text-indigo-800';
    case 'Lead': return 'bg-orange-100 text-orange-800';
    case 'Operator': return 'bg-green-100 text-green-800';
    case 'Viewer': return 'bg-gray-100 text-gray-800';
    default: return 'bg-gray-100 text-gray-800';
  }
}

function formatDateTime(isoString: string): string {
  const date = new Date(isoString);
  return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}
