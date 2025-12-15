// ============================================================================
// DESIGN SYSTEM - Professional Warehouse Management UI
// ============================================================================
// Consistent colors, spacing, typography, and component patterns

export const designSystem = {
  // ============================================================================
  // COLOR PALETTE - Professional, accessible, warehouse-focused
  // ============================================================================
  colors: {
    // Primary Brand Colors
    primary: {
      50: '#eff6ff',   // Very light blue
      100: '#dbeafe',  // Light blue
      200: '#bfdbfe',  // Lighter blue
      300: '#93c5fd',  // Medium light blue
      400: '#60a5fa',  // Medium blue
      500: '#3b82f6',  // Primary blue
      600: '#2563eb',  // Dark blue
      700: '#1d4ed8',  // Darker blue
      800: '#1e40af',  // Very dark blue
      900: '#1e3a8a',  // Darkest blue
    },

    // Semantic Colors
    success: {
      50: '#f0fdf4',
      100: '#dcfce7',
      500: '#22c55e',
      600: '#16a34a',
      700: '#15803d',
    },

    warning: {
      50: '#fffbeb',
      100: '#fef3c7',
      500: '#f59e0b',
      600: '#d97706',
      700: '#b45309',
    },

    error: {
      50: '#fef2f2',
      100: '#fee2e2',
      500: '#ef4444',
      600: '#dc2626',
      700: '#b91c1c',
    },

    // Neutral Grays
    gray: {
      50: '#f9fafb',   // Background
      100: '#f3f4f6',  // Light background
      200: '#e5e7eb',  // Borders
      300: '#d1d5db',  // Light text
      400: '#9ca3af',  // Medium text
      500: '#6b7280',  // Text
      600: '#4b5563',  // Dark text
      700: '#374151',  // Darker text
      800: '#1f2937',  // Very dark text
      900: '#111827',  // Darkest text
    },

    // Role-Based Colors
    roles: {
      admin: {
        primary: '#3b82f6',    // Blue
        light: '#eff6ff',
        dark: '#1e40af'
      },
      manager: {
        primary: '#7c3aed',    // Purple
        light: '#f3e8ff',
        dark: '#5b21b6'
      },
      lead: {
        primary: '#ea580c',    // Orange
        light: '#fff7ed',
        dark: '#c2410c'
      },
      operator: {
        primary: '#059669',    // Green
        light: '#ecfdf5',
        dark: '#047857'
      },
      viewer: {
        primary: '#6b7280',    // Gray
        light: '#f9fafb',
        dark: '#374151'
      }
    }
  },

  // ============================================================================
  // SPACING SYSTEM - Consistent spacing throughout
  // ============================================================================
  spacing: {
    xs: '0.5rem',   // 8px
    sm: '0.75rem',  // 12px
    md: '1rem',     // 16px
    lg: '1.5rem',   // 24px
    xl: '2rem',     // 32px
    '2xl': '3rem',  // 48px
    '3xl': '4rem',  // 64px
  },

  // ============================================================================
  // TYPOGRAPHY - Professional hierarchy
  // ============================================================================
  typography: {
    fontFamily: {
      sans: ['Inter', 'system-ui', 'sans-serif'],
      mono: ['JetBrains Mono', 'Consolas', 'monospace']
    },
    fontSize: {
      xs: '0.75rem',   // 12px
      sm: '0.875rem',  // 14px
      base: '1rem',    // 16px
      lg: '1.125rem',  // 18px
      xl: '1.25rem',   // 20px
      '2xl': '1.5rem', // 24px
      '3xl': '1.875rem', // 30px
    }
  },

  // ============================================================================
  // SHADOWS - Subtle depth
  // ============================================================================
  shadows: {
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
    xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
  },

  // ============================================================================
  // BORDER RADIUS - Modern rounded corners
  // ============================================================================
  borderRadius: {
    sm: '0.375rem',  // 6px
    md: '0.5rem',    // 8px
    lg: '0.75rem',   // 12px
    xl: '1rem',      // 16px
  },

  // ============================================================================
  // COMPONENT PATTERNS - Reusable UI patterns
  // ============================================================================
  components: {
    card: {
      background: '#ffffff',
      border: '1px solid #e5e7eb',
      borderRadius: '0.75rem',
      shadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
      padding: '1.5rem'
    },
    
    button: {
      primary: {
        background: '#3b82f6',
        hoverBackground: '#2563eb',
        text: '#ffffff',
        borderRadius: '0.5rem',
        padding: '0.75rem 1.5rem'
      },
      secondary: {
        background: '#f3f4f6',
        hoverBackground: '#e5e7eb',
        text: '#374151',
        borderRadius: '0.5rem',
        padding: '0.75rem 1.5rem'
      }
    },

    input: {
      background: '#ffffff',
      border: '1px solid #d1d5db',
      focusBorder: '#3b82f6',
      borderRadius: '0.5rem',
      padding: '0.75rem 1rem'
    }
  },

  // ============================================================================
  // ANIMATION - Smooth interactions
  // ============================================================================
  animation: {
    duration: {
      fast: '150ms',
      normal: '200ms',
      slow: '300ms'
    },
    easing: 'cubic-bezier(0.4, 0, 0.2, 1)'
  }
};

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

export function getColorPalette(role: keyof typeof designSystem.colors.roles) {
  return designSystem.colors.roles[role];
}

export function getRoleClasses(role: keyof typeof designSystem.colors.roles) {
  const palette = getColorPalette(role);
  return {
    primary: `bg-[${palette.primary}] text-white`,
    light: `bg-[${palette.light}] text-[${palette.dark}]`,
    text: `text-[${palette.primary}]`,
    border: `border-[${palette.primary}]`,
    hover: `hover:bg-[${palette.primary}] hover:text-white`
  };
}
