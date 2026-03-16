import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, Calendar, Phone, Mail, Users } from 'lucide-react';
import type { Customer } from '../types/customer';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<Customer, 'id' | 'createdAt'>) => void;
  initialData?: Customer | null;
}

const backdrop = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const modal = {
  hidden: { opacity: 0, scale: 0.92, y: 30 },
  visible: { opacity: 1, scale: 1, y: 0, transition: { type: 'spring' as const, damping: 25, stiffness: 350 } },
  exit: { opacity: 0, scale: 0.92, y: 30 },
};

export default function CustomerModal({ isOpen, onClose, onSubmit, initialData }: Props) {
  const [form, setForm] = useState({
    name: '',
    dob: '',
    gender: 'Male' as 'Male' | 'Female' | 'Other',
    phone: '',
    email: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (initialData) {
      setForm({
        name: initialData.name,
        dob: initialData.dob,
        gender: initialData.gender,
        phone: initialData.phone,
        email: initialData.email,
      });
    } else {
      setForm({ name: '', dob: '', gender: 'Male', phone: '', email: '' });
    }
    setErrors({});
  }, [initialData, isOpen]);

  function validate() {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = 'Name is required';
    if (!form.dob) e.dob = 'Date of birth is required';
    if (!form.phone.trim()) e.phone = 'Phone is required';
    else if (!/^[\d\s\-+()]{7,20}$/.test(form.phone)) e.phone = 'Invalid phone number';
    if (!form.email.trim()) e.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Invalid email address';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (validate()) {
      onSubmit(form);
      onClose();
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          variants={backdrop}
          initial="hidden"
          animate="visible"
          exit="hidden"
        >
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
          <motion.div
            className="relative w-full max-w-lg rounded-3xl bg-white shadow-2xl ring-1 ring-black/5"
            variants={modal}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            {/* Header gradient bar */}
            <div className="h-2 rounded-t-3xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />

            <div className="p-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    {initialData ? 'Edit Customer' : 'Add New Customer'}
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">
                    {initialData ? 'Update customer information' : 'Fill in the details below'}
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="rounded-xl p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-all duration-200"
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Name */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                    <User size={14} className="text-indigo-500" /> Full Name
                  </label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                    className={`w-full rounded-xl border-2 px-4 py-3 text-sm outline-none transition-all duration-200 bg-gray-50 focus:bg-white focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 ${errors.name ? 'border-red-300 bg-red-50' : 'border-gray-200'}`}
                    placeholder="John Doe"
                  />
                  {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
                </div>

                {/* DOB + Gender row */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                      <Calendar size={14} className="text-indigo-500" /> Date of Birth
                    </label>
                    <input
                      type="date"
                      value={form.dob}
                      onChange={e => setForm(f => ({ ...f, dob: e.target.value }))}
                      className={`w-full rounded-xl border-2 px-4 py-3 text-sm outline-none transition-all duration-200 bg-gray-50 focus:bg-white focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 ${errors.dob ? 'border-red-300 bg-red-50' : 'border-gray-200'}`}
                    />
                    {errors.dob && <p className="mt-1 text-xs text-red-500">{errors.dob}</p>}
                  </div>
                  <div>
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                      <Users size={14} className="text-indigo-500" /> Gender
                    </label>
                    <div className="flex gap-2">
                      {(['Male', 'Female', 'Other'] as const).map(g => (
                        <button
                          key={g}
                          type="button"
                          onClick={() => setForm(f => ({ ...f, gender: g }))}
                          className={`flex-1 rounded-xl py-3 text-xs font-semibold transition-all duration-200 ${
                            form.gender === g
                              ? 'bg-indigo-500 text-white shadow-md shadow-indigo-200'
                              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          }`}
                        >
                          {g}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Phone */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                    <Phone size={14} className="text-indigo-500" /> Phone Number
                  </label>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                    className={`w-full rounded-xl border-2 px-4 py-3 text-sm outline-none transition-all duration-200 bg-gray-50 focus:bg-white focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 ${errors.phone ? 'border-red-300 bg-red-50' : 'border-gray-200'}`}
                    placeholder="+1 (555) 123-4567"
                  />
                  {errors.phone && <p className="mt-1 text-xs text-red-500">{errors.phone}</p>}
                </div>

                {/* Email */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                    <Mail size={14} className="text-indigo-500" /> Email Address
                  </label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                    className={`w-full rounded-xl border-2 px-4 py-3 text-sm outline-none transition-all duration-200 bg-gray-50 focus:bg-white focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 ${errors.email ? 'border-red-300 bg-red-50' : 'border-gray-200'}`}
                    placeholder="john@example.com"
                  />
                  {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 rounded-xl border-2 border-gray-200 py-3 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-all duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-200 hover:shadow-xl hover:shadow-indigo-300 transition-all duration-200 hover:-translate-y-0.5"
                  >
                    {initialData ? 'Update Customer' : 'Add Customer'}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
