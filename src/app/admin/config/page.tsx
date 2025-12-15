// ============================================================================
// SYSTEM CONFIGURATION - Admin System Settings
// ============================================================================
// Admin screen for configuring system parameters per requirements Section 15

'use client';

import { useState } from 'react';

export default function SystemConfigPage() {
  const [activeSection, setActiveSection] = useState<'variance' | 'approval' | 'shifts' | 'journals' | 'risk'>('variance');
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Mock configuration data
  const [config, setConfig] = useState<SystemConfig>({
    varianceThresholds: {
      expectedVsCountTolerance: 5.0,
      count1VsCount2Disagreement: 10.0,
      autoRecountThreshold: 2.0
    },
    highImpactDefinitions: {
      abcClasses: ['A'],
      costThreshold: 1000.00,
      requireDualApproval: true
    },
    shifts: [
      {
        id: 'A',
        name: 'Day Shift',
        startTime: '07:00',
        endTime: '15:00',
        breakWindows: [
          { start: '09:30', end: '09:45', type: 'break' },
          { start: '13:00', end: '13:45', type: 'lunch' }
        ]
      },
      {
        id: 'B',
        name: 'Swing Shift',
        startTime: '15:00',
        endTime: '23:00',
        breakWindows: [
          { start: '17:30', end: '17:45', type: 'break' },
          { start: '19:00', end: '19:30', type: 'lunch' }
        ]
      },
      {
        id: 'C',
        name: 'Night Shift',
        startTime: '23:00',
        endTime: '07:00',
        breakWindows: [
          { start: '01:30', end: '01:45', type: 'break' },
          { start: '03:00', end: '03:30', type: 'lunch' }
        ]
      }
    ],
    journalSettings: {
      defaultSize: 30,
      claimTimeoutMinutes: 15,
      autoAssignmentEnabled: true,
      routeOptimization: true
    },
    riskLocationPolicy: {
      reasons: [
        'High-value components stored',
        'Frequent counting discrepancies',
        'Security-sensitive area',
        'Temperature-controlled zone',
        'Hazardous materials storage'
      ],
      maxFrequencyDays: 7,
      overrideSLA: true
    }
  });

  const updateConfig = <T extends keyof SystemConfig>(section: T, updates: Partial<SystemConfig[T]>) => {
    setConfig(prev => ({
      ...prev,
      [section]: { ...prev[section], ...updates }
    }));
    setHasUnsavedChanges(true);
  };

  const handleSave = () => {
    // TODO: Save configuration to backend
    console.log('Saving configuration:', config);
    setHasUnsavedChanges(false);
  };

  const handleReset = () => {
    // TODO: Reset to last saved configuration
    setHasUnsavedChanges(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Unsaved Changes Alert */}
        {hasUnsavedChanges && (
          <div className="mb-6 flex items-center justify-end">
            <div className="flex items-center space-x-3">
              <div className="flex items-center text-amber-600">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.864-.833-2.634 0L4.18 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                Unsaved Changes
              </div>
              <button
                onClick={handleReset}
                className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Reset
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Save Changes
              </button>
            </div>
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:w-64 flex-shrink-0">
            <nav className="bg-white rounded-lg border border-gray-200 p-4">
              <h3 className="text-sm font-semibold text-gray-900 mb-4">Configuration Sections</h3>
              <ul className="space-y-2">
                {[
                  { key: 'variance', label: 'Variance Thresholds', icon: '📊' },
                  { key: 'approval', label: 'Approval Rules', icon: '✅' },
                  { key: 'shifts', label: 'Shift Definitions', icon: '🕐' },
                  { key: 'journals', label: 'Journal Settings', icon: '📝' },
                  { key: 'risk', label: 'Risk Locations', icon: '⚠️' }
                ].map(item => (
                  <li key={item.key}>
                    <button
                      onClick={() => setActiveSection(item.key as any)}
                      className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                        activeSection === item.key
                          ? 'bg-blue-100 text-blue-700 border border-blue-200'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <span className="mr-3">{item.icon}</span>
                      {item.label}
                    </button>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <div className="bg-white rounded-lg border border-gray-200 p-8">
              {activeSection === 'variance' && (
                <VarianceThresholdsSection 
                  config={config.varianceThresholds}
                  onChange={(updates) => updateConfig('varianceThresholds', updates)}
                />
              )}
              {activeSection === 'approval' && (
                <ApprovalRulesSection 
                  config={config.highImpactDefinitions}
                  onChange={(updates) => updateConfig('highImpactDefinitions', updates)}
                />
              )}
              {activeSection === 'shifts' && (
                <ShiftDefinitionsSection 
                  config={config.shifts}
                  onChange={(shifts) => updateConfig('shifts', shifts)}
                />
              )}
              {activeSection === 'journals' && (
                <JournalSettingsSection 
                  config={config.journalSettings}
                  onChange={(updates) => updateConfig('journalSettings', updates)}
                />
              )}
              {activeSection === 'risk' && (
                <RiskLocationPolicySection 
                  config={config.riskLocationPolicy}
                  onChange={(updates) => updateConfig('riskLocationPolicy', updates)}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// VARIANCE THRESHOLDS SECTION
// ============================================================================

interface VarianceThresholdsSectionProps {
  config: SystemConfig['varianceThresholds'];
  onChange: (updates: Partial<SystemConfig['varianceThresholds']>) => void;
}

function VarianceThresholdsSection({ config, onChange }: VarianceThresholdsSectionProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900">Variance Thresholds</h2>
        <p className="text-sm text-gray-600 mt-1">Configure tolerance levels for count discrepancies</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Expected vs Count Tolerance (%)
          </label>
          <input
            type="number"
            step="0.1"
            value={config.expectedVsCountTolerance}
            onChange={(e) => onChange({ expectedVsCountTolerance: parseFloat(e.target.value) })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <p className="text-xs text-gray-500 mt-1">
            Count within this percentage of expected will be accepted automatically
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Count 1 vs Count 2 Disagreement (%)
          </label>
          <input
            type="number"
            step="0.1"
            value={config.count1VsCount2Disagreement}
            onChange={(e) => onChange({ count1VsCount2Disagreement: parseFloat(e.target.value) })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <p className="text-xs text-gray-500 mt-1">
            Trigger Verified Counter (Count 3) when counts disagree by this percentage
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Auto-Recount Threshold (%)
          </label>
          <input
            type="number"
            step="0.1"
            value={config.autoRecountThreshold}
            onChange={(e) => onChange({ autoRecountThreshold: parseFloat(e.target.value) })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <p className="text-xs text-gray-500 mt-1">
            Automatically create Count 2 when variance exceeds this threshold
          </p>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// APPROVAL RULES SECTION
// ============================================================================

interface ApprovalRulesSectionProps {
  config: SystemConfig['highImpactDefinitions'];
  onChange: (updates: Partial<SystemConfig['highImpactDefinitions']>) => void;
}

function ApprovalRulesSection({ config, onChange }: ApprovalRulesSectionProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900">High-Impact Approval Rules</h2>
        <p className="text-sm text-gray-600 mt-1">Define criteria requiring dual management approval</p>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            ABC Classes Requiring Dual Approval
          </label>
          <div className="flex space-x-4">
            {['A', 'B', 'C'].map(abcClass => (
              <label key={abcClass} className="flex items-center">
                <input
                  type="checkbox"
                  checked={config.abcClasses.includes(abcClass)}
                  onChange={(e) => {
                    const newClasses = e.target.checked
                      ? [...config.abcClasses, abcClass]
                      : config.abcClasses.filter(c => c !== abcClass);
                    onChange({ abcClasses: newClasses });
                  }}
                  className="mr-2"
                />
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                  abcClass === 'A' ? 'bg-red-100 text-red-800' :
                  abcClass === 'B' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-green-100 text-green-800'
                }`}>
                  Class {abcClass}
                </span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Cost Threshold for Dual Approval ($)
          </label>
          <input
            type="number"
            step="0.01"
            value={config.costThreshold}
            onChange={(e) => onChange({ costThreshold: parseFloat(e.target.value) })}
            className="w-full max-w-xs px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <p className="text-xs text-gray-500 mt-1">
            Items with standard cost above this amount require dual approval
          </p>
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="requireDualApproval"
            checked={config.requireDualApproval}
            onChange={(e) => onChange({ requireDualApproval: e.target.checked })}
            className="mr-3"
          />
          <label htmlFor="requireDualApproval" className="text-sm font-medium text-gray-700">
            Enforce dual approval for high-impact items
          </label>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// SHIFT DEFINITIONS SECTION
// ============================================================================

interface ShiftDefinitionsSectionProps {
  config: SystemConfig['shifts'];
  onChange: (shifts: SystemConfig['shifts']) => void;
}

function ShiftDefinitionsSection({ config, onChange }: ShiftDefinitionsSectionProps) {
  const updateShift = (shiftId: string, updates: Partial<ShiftDefinition>) => {
    const updatedShifts = config.map(shift => 
      shift.id === shiftId ? { ...shift, ...updates } : shift
    );
    onChange(updatedShifts);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900">Shift Definitions</h2>
        <p className="text-sm text-gray-600 mt-1">Configure shift schedules and break windows</p>
      </div>

      <div className="space-y-6">
        {config.map(shift => (
          <div key={shift.id} className="border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Shift {shift.id}: {shift.name}
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Start Time
                </label>
                <input
                  type="time"
                  value={shift.startTime}
                  onChange={(e) => updateShift(shift.id, { startTime: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  End Time
                </label>
                <input
                  type="time"
                  value={shift.endTime}
                  onChange={(e) => updateShift(shift.id, { endTime: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">Break Windows</h4>
              <div className="space-y-2">
                {shift.breakWindows.map((breakWindow, index) => (
                  <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      breakWindow.type === 'lunch' 
                        ? 'bg-orange-100 text-orange-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {breakWindow.type}
                    </span>
                    <input
                      type="time"
                      value={breakWindow.start}
                      onChange={(e) => {
                        const newBreaks = [...shift.breakWindows];
                        newBreaks[index] = { ...newBreaks[index], start: e.target.value };
                        updateShift(shift.id, { breakWindows: newBreaks });
                      }}
                      className="px-2 py-1 border border-gray-300 rounded text-sm"
                    />
                    <span>to</span>
                    <input
                      type="time"
                      value={breakWindow.end}
                      onChange={(e) => {
                        const newBreaks = [...shift.breakWindows];
                        newBreaks[index] = { ...newBreaks[index], end: e.target.value };
                        updateShift(shift.id, { breakWindows: newBreaks });
                      }}
                      className="px-2 py-1 border border-gray-300 rounded text-sm"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================================================
// JOURNAL SETTINGS SECTION
// ============================================================================

interface JournalSettingsSectionProps {
  config: SystemConfig['journalSettings'];
  onChange: (updates: Partial<SystemConfig['journalSettings']>) => void;
}

function JournalSettingsSection({ config, onChange }: JournalSettingsSectionProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900">Journal Settings</h2>
        <p className="text-sm text-gray-600 mt-1">Configure journal creation and assignment behavior</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Default Journal Size (lines)
          </label>
          <input
            type="number"
            min="1"
            max="100"
            value={config.defaultSize}
            onChange={(e) => onChange({ defaultSize: parseInt(e.target.value) })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <p className="text-xs text-gray-500 mt-1">
            Number of location lines per journal packet
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Claim Timeout (minutes)
          </label>
          <input
            type="number"
            min="5"
            max="60"
            value={config.claimTimeoutMinutes}
            onChange={(e) => onChange({ claimTimeoutMinutes: parseInt(e.target.value) })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <p className="text-xs text-gray-500 mt-1">
            Time before uncompleted journal line claims expire
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center">
          <input
            type="checkbox"
            id="autoAssignment"
            checked={config.autoAssignmentEnabled}
            onChange={(e) => onChange({ autoAssignmentEnabled: e.target.checked })}
            className="mr-3"
          />
          <label htmlFor="autoAssignment" className="text-sm font-medium text-gray-700">
            Enable automatic journal assignment
          </label>
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="routeOptimization"
            checked={config.routeOptimization}
            onChange={(e) => onChange({ routeOptimization: e.target.checked })}
            className="mr-3"
          />
          <label htmlFor="routeOptimization" className="text-sm font-medium text-gray-700">
            Optimize journal routes by location proximity
          </label>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// RISK LOCATION POLICY SECTION
// ============================================================================

interface RiskLocationPolicySectionProps {
  config: SystemConfig['riskLocationPolicy'];
  onChange: (updates: Partial<SystemConfig['riskLocationPolicy']>) => void;
}

function RiskLocationPolicySection({ config, onChange }: RiskLocationPolicySectionProps) {
  const [newReason, setNewReason] = useState('');

  const addReason = () => {
    if (newReason.trim() && !config.reasons.includes(newReason.trim())) {
      onChange({ reasons: [...config.reasons, newReason.trim()] });
      setNewReason('');
    }
  };

  const removeReason = (reason: string) => {
    onChange({ reasons: config.reasons.filter(r => r !== reason) });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900">Risk Location Policy</h2>
        <p className="text-sm text-gray-600 mt-1">Configure risk location classification and frequency overrides</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Risk Reasons List
        </label>
        <div className="space-y-2 mb-3">
          {config.reasons.map((reason, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-sm text-gray-700">{reason}</span>
              <button
                onClick={() => removeReason(reason)}
                className="text-red-600 hover:text-red-800 text-sm"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
        
        <div className="flex space-x-2">
          <input
            type="text"
            value={newReason}
            onChange={(e) => setNewReason(e.target.value)}
            placeholder="Add new risk reason..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            onKeyPress={(e) => e.key === 'Enter' && addReason()}
          />
          <button
            onClick={addReason}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Add
          </button>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Maximum Frequency Override (days)
        </label>
        <input
          type="number"
          min="1"
          max="30"
          value={config.maxFrequencyDays}
          onChange={(e) => onChange({ maxFrequencyDays: parseInt(e.target.value) })}
          className="w-full max-w-xs px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <p className="text-xs text-gray-500 mt-1">
          Risk locations will be counted at least this frequently, regardless of SLA
        </p>
      </div>

      <div className="flex items-center">
        <input
          type="checkbox"
          id="overrideSLA"
          checked={config.overrideSLA}
          onChange={(e) => onChange({ overrideSLA: e.target.checked })}
          className="mr-3"
        />
        <label htmlFor="overrideSLA" className="text-sm font-medium text-gray-700">
          Allow risk policy to override standard SLA frequency
        </label>
      </div>
    </div>
  );
}

// ============================================================================
// TYPES
// ============================================================================

interface SystemConfig {
  varianceThresholds: {
    expectedVsCountTolerance: number;
    count1VsCount2Disagreement: number;
    autoRecountThreshold: number;
  };
  highImpactDefinitions: {
    abcClasses: string[];
    costThreshold: number;
    requireDualApproval: boolean;
  };
  shifts: ShiftDefinition[];
  journalSettings: {
    defaultSize: number;
    claimTimeoutMinutes: number;
    autoAssignmentEnabled: boolean;
    routeOptimization: boolean;
  };
  riskLocationPolicy: {
    reasons: string[];
    maxFrequencyDays: number;
    overrideSLA: boolean;
  };
}

interface ShiftDefinition {
  id: string;
  name: string;
  startTime: string;
  endTime: string;
  breakWindows: Array<{
    start: string;
    end: string;
    type: 'break' | 'lunch';
  }>;
}
