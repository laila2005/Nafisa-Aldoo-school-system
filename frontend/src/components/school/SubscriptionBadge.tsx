import React from 'react';
import { useSchool } from '../../context/SchoolContext';
import { Crown, AlertCircle, CheckCircle } from 'lucide-react';

export const SubscriptionBadge: React.FC = () => {
  const { school } = useSchool();

  if (!school) return null;

  const statusConfig = {
    ACTIVE: { color: 'bg-green-100', textColor: 'text-green-800', icon: CheckCircle },
    TRIAL: { color: 'bg-blue-100', textColor: 'text-blue-800', icon: Crown },
    SUSPENDED: { color: 'bg-red-100', textColor: 'text-red-800', icon: AlertCircle },
    EXPIRED: { color: 'bg-yellow-100', textColor: 'text-yellow-800', icon: AlertCircle },
  };

  const config = statusConfig[school.subscriptionStatus];
  const Icon = config.icon;

  return (
    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full ${config.color} ${config.textColor}`}>
      <Icon className="w-4 h-4" />
      <span className="text-xs font-medium">
        {school.subscriptionPlan} - {school.subscriptionStatus}
      </span>
    </div>
  );
};

export default SubscriptionBadge;
