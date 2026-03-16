import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, Phone, Mail, Users, Clock } from 'lucide-react';
import type { Customer } from '../types/customer';

interface Props {
  customer: Customer | null;
  isOpen: boolean;
  onClose: () => void;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

function getAge(dob: string) {
  const today = new Date();
  const birth = new Date(dob);
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
  return age;
}

function getInitials(name: string) {
  return name
    .split(' ')
    .map(w => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

export default function CustomerDetailModal({ customer, isOpen, onClose }: Props) {
  if (!customer) return null;

  const fields = [
    { icon: Calendar, label: 'Date of Birth', value: `${formatDate(customer.dob)} (Age ${getAge(customer.dob)})` },
    { icon: Users, label: 'Gender', value: customer.gender },
    { icon: Phone, label: 'Phone Number', value: customer.phone },
    { icon: Mail, label: 'Email Address', value: customer.email },
    { icon: Clock, label: 'Added On', value: formatDate(customer.createdAt) },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
          <motion.div
            className="relative w-full max-w-md rounded-3xl bg-white shadow-2xl overflow-hidden"
            initial={{ scale: 0.92, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.92, opacity: 0, y: 20 }}
          >
            {/* Hero header */}
            <div className="relative h-32 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500">
              <div className="absolute inset-0 opacity-20">
                <svg width="100%" height="100%"><defs><pattern id="dots" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r="1" fill="white"/></pattern></defs><rect width="100%" height="100%" fill="url(#dots)"/></svg>
              </div>
              <button
                onClick={onClose}
                className="absolute top-4 right-4 rounded-xl p-2 text-white/70 hover:bg-white/20 transition"
              >
                <X size={18} />
              </button>
            </div>

            {/* Avatar */}
            <div className="relative -mt-12 flex justify-center">
              <div className="flex h-24 w-24 items-center justify-center rounded-3xl bg-gradient-to-br from-indigo-500 to-purple-600 text-2xl font-bold text-white ring-4 ring-white shadow-lg">
                {getInitials(customer.name)}
              </div>
            </div>

            <div className="px-8 pb-8 pt-4 text-center">
              <h2 className="text-2xl font-bold text-gray-900">{customer.name}</h2>
              <p className="text-sm text-gray-400 mt-1">{customer.email}</p>

              <div className="mt-6 space-y-3 text-left">
                {fields.map(f => (
                  <div key={f.label} className="flex items-center gap-4 rounded-xl bg-gray-50 p-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white shadow-sm flex-shrink-0">
                      <f.icon size={16} className="text-indigo-500" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{f.label}</p>
                      <p className="text-sm font-semibold text-gray-800">{f.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
