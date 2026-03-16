import { motion } from 'framer-motion';
import { Users, UserCheck, UserX, TrendingUp } from 'lucide-react';
import type { Customer } from '../types/customer';

interface Props {
  customers: Customer[];
}

export default function StatsCards({ customers }: Props) {
  const total = customers.length;
  const males = customers.filter(c => c.gender === 'Male').length;
  const females = customers.filter(c => c.gender === 'Female').length;
  const thisMonth = customers.filter(c => {
    const d = new Date(c.createdAt);
    const now = new Date();
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  }).length;

  const stats = [
    {
      label: 'Total Customers',
      value: total,
      icon: Users,
      gradient: 'from-indigo-500 to-indigo-600',
      bgLight: 'bg-indigo-50',
      textColor: 'text-indigo-600',
      shadowColor: 'shadow-indigo-200',
    },
    {
      label: 'Male Customers',
      value: males,
      icon: UserCheck,
      gradient: 'from-blue-500 to-blue-600',
      bgLight: 'bg-blue-50',
      textColor: 'text-blue-600',
      shadowColor: 'shadow-blue-200',
    },
    {
      label: 'Female Customers',
      value: females,
      icon: UserX,
      gradient: 'from-pink-500 to-pink-600',
      bgLight: 'bg-pink-50',
      textColor: 'text-pink-600',
      shadowColor: 'shadow-pink-200',
    },
    {
      label: 'Added This Month',
      value: thisMonth,
      icon: TrendingUp,
      gradient: 'from-emerald-500 to-emerald-600',
      bgLight: 'bg-emerald-50',
      textColor: 'text-emerald-600',
      shadowColor: 'shadow-emerald-200',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      {stats.map((s, i) => (
        <motion.div
          key={s.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          className={`relative overflow-hidden rounded-2xl bg-white p-6 shadow-lg ${s.shadowColor} ring-1 ring-gray-100 hover:shadow-xl transition-shadow duration-300`}
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">{s.label}</p>
              <p className={`mt-2 text-3xl font-extrabold ${s.textColor}`}>{s.value}</p>
            </div>
            <div className={`rounded-xl bg-gradient-to-br ${s.gradient} p-3 shadow-md ${s.shadowColor}`}>
              <s.icon size={20} className="text-white" />
            </div>
          </div>
          {/* Decorative circle */}
          <div className={`absolute -bottom-4 -right-4 h-24 w-24 rounded-full ${s.bgLight} opacity-50`} />
        </motion.div>
      ))}
    </div>
  );
}
