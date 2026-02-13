import React from 'react';
import { useSchool } from '../../context/SchoolContext';
import { FEATURE_MATRIX } from '../../types/subscription';

interface FeatureGateProps {
  feature: string;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export const FeatureGate: React.FC<FeatureGateProps> = ({
  feature,
  children,
  fallback,
}) => {
  const { school } = useSchool();

  if (!school) return null;

  const allowedFeatures = FEATURE_MATRIX[school.subscriptionPlan] || [];
  const hasAccess = allowedFeatures.includes('*') || allowedFeatures.includes(feature);

  if (!hasAccess) {
    if (fallback) {
      return <>{fallback}</>;
    }
    
    return (
      <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <p className="text-sm text-yellow-800 font-medium">
          🔒 This feature is not available in your current plan
        </p>
        <p className="text-xs text-yellow-700 mt-2">
          Please upgrade your subscription to access this feature.
        </p>
      </div>
    );
  }

  return <>{children}</>;
};

export default FeatureGate;
