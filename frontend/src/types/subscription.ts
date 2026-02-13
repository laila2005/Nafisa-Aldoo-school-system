export type SubscriptionPlan = 'FREE' | 'BASIC' | 'PREMIUM' | 'ENTERPRISE';
export type SubscriptionStatus = 'ACTIVE' | 'TRIAL' | 'SUSPENDED' | 'EXPIRED';

export interface BillingInfo {
  currentPlan: SubscriptionPlan;
  status: SubscriptionStatus;
  nextBillingDate: string;
  amount: number;
  currency: string;
  paymentMethod: string;
  cardLast4?: string;
}

export interface PlanFeatures {
  name: SubscriptionPlan;
  price: number | string;
  students: number | string;
  teachers: number | string;
  storage: number | string;
  features: string[];
  popular?: boolean;
}

export const FEATURE_MATRIX: Record<SubscriptionPlan, string[]> = {
  FREE: ['dashboard', 'attendance', 'basic_courses'],
  BASIC: ['dashboard', 'attendance', 'courses', 'grades', 'messaging'],
  PREMIUM: [
    'dashboard',
    'attendance',
    'courses',
    'grades',
    'messaging',
    'assignments',
    'reports',
    'analytics',
  ],
  ENTERPRISE: ['*'], // All features
};
