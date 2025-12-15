// ============================================================================
// USER MANAGEMENT - Admin User and Role Management
// ============================================================================
// Admin screen for managing users, roles, and Verified Counter certifications

'use client';

import { useState } from 'react';

export default function UserManagementPage() {
  const [activeTab, setActiveTab] = useState<'manage' | 'roles' | 'verified'>('manage');
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  // Mock users data
  const [users, setUsers] = useState<User[]>([
    {
      id: '1',
      name: 'Raed Jah',
      email: 'raed.jah@reconext.com',
      role: 'Admin',
      isVerifiedCounter: true,
      isActive: true,
      shift: 'Day',
      zones: ['All'],
      lastLogin: '2024-12-15T10:30:00Z',
      createdAt: '2024-01-15T08:00:00Z'
    },
    {
      id: '2',
      name: 'John Smith',
      email: 'john.smith@reconext.com',
      role: 'Warehouse_Manager',
      isVerifiedCounter: true,
      isActive: true,
      shift: 'Day',
      zones: ['ZONE-A1', 'ZONE-A2'],
      lastLogin: '2024-12-15T09:15:00Z',
      createdAt: '2024-02-01T08:00:00Z'
    },
    {
      id: '3',
      name: 'Maria Garcia',
      email: 'maria.garcia@reconext.com',
      role: 'Lead',
      isVerifiedCounter: false,
      isActive: true,
      shift: 'Day',
      zones: ['ZONE-B1'],
      lastLogin: '2024-12-15T08:45:00Z',
      createdAt: '2024-03-10T08:00:00Z'
    },
    {
      id: '4',
      name: 'Mike Johnson',
      email: 'mike.johnson@reconext.com',
      role: 'Operator',
      isVerifiedCounter: false,
      isActive: true,
      shift: 'Night',
      zones: ['ZONE-C1', 'ZONE-C2'],
      lastLogin: '2024-12-14T22:30:00Z',
      createdAt: '2024-04-05T08:00:00Z'
    },
    {
      id: '5',
      name: 'Sarah Wilson',
      email: 'sarah.wilson@reconext.com',
      role: 'Viewer',
      isVerifiedCounter: false,
      isActive: false,
      shift: 'Day',
      zones: [],
      lastLogin: '2024-12-10T14:20:00Z',
      createdAt: '2024-05-20T08:00:00Z'
    }
  ]);

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
              <UserManagementTab 
                users={users} 
                onAddUser={() => setShowAddUserModal(true)}
                onEditUser={setSelectedUser}
              />
            )}
            {activeTab === 'roles' && (
              <RolePermissionsTab />
            )}
            {activeTab === 'verified' && (
              <VerifiedCounterTab 
                users={users}
                requests={verifiedCounterRequests}
              />
            )}
          </div>
        </div>

        {/* Add User Modal */}
        {showAddUserModal && (
          <AddUserModal 
            onClose={() => setShowAddUserModal(false)}
            onSave={(userData) => {
              // TODO: Add user logic
              console.log('Add user:', userData);
              setShowAddUserModal(false);
            }}
          />
        )}

        {/* Edit User Modal */}
        {selectedUser && (
          <EditUserModal
            user={selectedUser}
            onClose={() => setSelectedUser(null)}
            onSave={(userData) => {
              // TODO: Update user logic
              console.log('Update user:', userData);
              setSelectedUser(null);
            }}
          />
        )}
      </div>
    </div>
  );
}

// ============================================================================
// USER MANAGEMENT TAB
// ============================================================================

interface UserManagementTabProps {
  users: User[];
  onAddUser: () => void;
  onEditUser: (user: User) => void;
}

function UserManagementTab({ users, onAddUser, onEditUser }: UserManagementTabProps) {
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
                    <button className={`${
                      user.isActive ? 'text-red-600 hover:text-red-900' : 'text-green-600 hover:text-green-900'
                    }`}>
                      {user.isActive ? 'Deactivate' : 'Activate'}
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
  users: User[];
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
// MODALS
// ============================================================================

interface AddUserModalProps {
  onClose: () => void;
  onSave: (userData: any) => void;
}

function AddUserModal({ onClose, onSave }: AddUserModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'Operator',
    shift: 'Day',
    zones: [] as string[]
  });

  const roles = ['Admin', 'IC_Manager', 'Warehouse_Manager', 'Warehouse_Supervisor', 'Lead', 'Operator', 'Viewer'];
  const shifts = ['Day', 'Night', 'Swing'];
  const availableZones = ['ZONE-A1', 'ZONE-A2', 'ZONE-B1', 'ZONE-B2', 'ZONE-C1', 'ZONE-C2'];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Add New User</h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
            <select
              value={formData.role}
              onChange={(e) => setFormData({...formData, role: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {roles.map(role => (
                <option key={role} value={role}>{formatRole(role)}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Shift</label>
            <select
              value={formData.shift}
              onChange={(e) => setFormData({...formData, shift: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {shifts.map(shift => (
                <option key={shift} value={shift}>{shift}</option>
              ))}
            </select>
          </div>
        </div>
        
        <div className="flex justify-end space-x-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-gray-200 rounded hover:bg-gray-300 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => onSave(formData)}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            Add User
          </button>
        </div>
      </div>
    </div>
  );
}

interface EditUserModalProps {
  user: User;
  onClose: () => void;
  onSave: (userData: any) => void;
}

function EditUserModal({ user, onClose, onSave }: EditUserModalProps) {
  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
    role: user.role,
    shift: user.shift,
    zones: user.zones,
    isActive: user.isActive
  });

  const roles = ['Admin', 'IC_Manager', 'Warehouse_Manager', 'Warehouse_Supervisor', 'Lead', 'Operator', 'Viewer'];
  const shifts = ['Day', 'Night', 'Swing'];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Edit User</h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
            <select
              value={formData.role}
              onChange={(e) => setFormData({...formData, role: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {roles.map(role => (
                <option key={role} value={role}>{formatRole(role)}</option>
              ))}
            </select>
          </div>
          
          <div className="flex items-center">
            <input
              type="checkbox"
              id="isActive"
              checked={formData.isActive}
              onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
              className="mr-2"
            />
            <label htmlFor="isActive" className="text-sm font-medium text-gray-700">Active User</label>
          </div>
        </div>
        
        <div className="flex justify-end space-x-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-gray-200 rounded hover:bg-gray-300 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => onSave(formData)}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// TYPES AND UTILITY FUNCTIONS
// ============================================================================

interface User {
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
