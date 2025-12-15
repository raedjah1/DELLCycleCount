// ============================================================================
// APPLICATION CONSTANTS - Configuration Layer
// ============================================================================
// All constants centralized for easy maintenance

export const APP_CONFIG = {
  NAME: 'Warehouse Cycle Count',
  VERSION: '1.0.0',
  DESCRIPTION: 'DELL Warehouse Cycle Count Management System',
} as const;

export const ROUTES = {
  AUTH: {
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
  },
  OPERATOR: {
    DASHBOARD: '/operator/dashboard',
    JOURNAL: '/operator/journal',
    COUNT: '/operator/count',
  },
  MANAGER: {
    DASHBOARD: '/manager/dashboard',
    VARIANCE_REVIEW: '/manager/variance-review',
    APPROVAL_QUEUE: '/manager/approval-queue',
  },
  ADMIN: {
    DASHBOARD: '/admin/dashboard',
    USERS: '/admin/users',
    SETTINGS: '/admin/settings',
    IMPORTS: '/admin/imports',
  },
  VIEWER: {
    DASHBOARD: '/viewer/dashboard',
    REPORTS: '/viewer/reports',
  },
} as const;

export const ROLES = {
  ADMIN: 'admin',
  IC_OWNER: 'ic_owner',
  IC_MANAGER: 'ic_manager',
  WAREHOUSE_MANAGER: 'warehouse_manager',
  WAREHOUSE_SUPERVISOR: 'warehouse_supervisor',
  LEAD: 'lead',
  OPERATOR: 'operator',
  VIEWER: 'viewer',
} as const;

export const WAREHOUSE_TYPES = {
  RAWGOODS: 'rawgoods',
  PRODUCTION: 'production',
  FINISHEDGOODS: 'finishedgoods',
} as const;

export const PRODUCT_TYPES = {
  LAPTOP: 'laptop',
  SERVER: 'server',
  SWITCHES: 'switches',
  DESKTOP: 'desktop',
  AIO: 'aio',
} as const;

export const COUNT_TYPES = {
  COUNT_1: 'count_1',
  COUNT_2: 'count_2',
  COUNT_3: 'count_3',
} as const;

export const LINE_STATUSES = {
  UNSTARTED: 'unstarted',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  NEEDS_RECOUNT: 'needs_recount',
} as const;

export const AVAILABILITY_STATUSES = {
  PRESENT_AVAILABLE: 'present_available',
  ON_BREAK: 'on_break',
  ON_LUNCH: 'on_lunch',
  NOT_AVAILABLE: 'not_available',
} as const;

export const UI_CONSTANTS = {
  DEBOUNCE_DELAY: 300,
  DEFAULT_PAGE_SIZE: 30,
  MAX_SERIAL_NUMBERS: 1000,
  PHOTO_MAX_SIZE_MB: 10,
  CLAIM_TIMEOUT_MINUTES: 15,
  INACTIVITY_TIMEOUT_MINUTES: 30,
} as const;

export const VALIDATION_RULES = {
  MIN_PASSWORD_LENGTH: 6,
  MAX_NAME_LENGTH: 100,
  MAX_DESCRIPTION_LENGTH: 500,
  LOCATION_CODE_PATTERN: /^[A-Z0-9]+\.[A-Z0-9]+\.[A-Z0-9]+\.\d+\.\d+[A-Z]$/,
  BAY_PATTERN: /^\d+$/,
  POSITION_LEVEL_PATTERN: /^\d+[A-Z]$/,
} as const;
