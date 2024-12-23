export type UserRole = 'free' | 'pro' | 'enterprise' | 'tester';

export interface RolePermissions {
  maxEmailAccounts: number;
  monthlyExtractionsLimit: number;
  canAccessAdvancedFeatures: boolean;
  canCustomizeModel: boolean;
  supportLevel: 'basic' | 'priority' | 'dedicated';
}

export const ROLE_PERMISSIONS: Record<UserRole, RolePermissions> = {
  free: {
    maxEmailAccounts: 1,
    monthlyExtractionsLimit: 50,
    canAccessAdvancedFeatures: false,
    canCustomizeModel: false,
    supportLevel: 'basic'
  },
  tester: {
    maxEmailAccounts: 5,
    monthlyExtractionsLimit: 1000,
    canAccessAdvancedFeatures: true,
    canCustomizeModel: true,
    supportLevel: 'dedicated'
  },
  pro: {
    maxEmailAccounts: 3,
    monthlyExtractionsLimit: 1000,
    canAccessAdvancedFeatures: true,
    canCustomizeModel: false,
    supportLevel: 'priority'
  },
  enterprise: {
    maxEmailAccounts: -1, // unlimited
    monthlyExtractionsLimit: -1, // unlimited
    canAccessAdvancedFeatures: true,
    canCustomizeModel: true,
    supportLevel: 'dedicated'
  }
};