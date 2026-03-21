import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Edit3, Trash2, ChevronUp, ChevronDown, MoreHorizontal, Eye } from 'lucide-react';
import type { Customer } from '../types/customer';

interface Props {
  customers: Customer[];
  sortField: keyof Customer;
  sortOrder: 'asc' | 'desc';
  onSort: (field: keyof Customer) => void;
  onEdit: (customer: Customer) => void;
  onDelete: (id: string) => void;
  selectedIds: string[];
  onToggleSelect: (id: string) => void;
  onToggleSelectAll: () => void;
  onView: (customer: Customer) => void;
  canManage: boolean;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

function getInitials(name: string) {
  return name
    .split(' ')
    .map(w => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

const avatarColors = [
  'from-indigo-400 to-indigo-600',
  'from-pink-400 to-pink-600',
  'from-emerald-400 to-emerald-600',
  'from-amber-400 to-amber-600',
  'from-cyan-400 to-cyan-600',
  'from-purple-400 to-purple-600',
  'from-rose-400 to-rose-600',
  'from-teal-400 to-teal-600',
];

function getColorIndex(name: string) {
  let sum = 0;
  for (let i = 0; i < name.length; i++) sum += name.charCodeAt(i);
  return sum % avatarColors.length;
}

const columns: { key: keyof Customer; label: string }[] = [
  { key: 'name', label: 'Customer' },
  { key: 'dob', label: 'Date of Birth' },
  { key: 'gender', label: 'Gender' },
  { key: 'phone', label: 'Phone' },
  { key: 'email', label: 'Email' },
  { key: 'createdAt', label: 'Added' },
];

export default function CustomerTable({
  customers,
  sortField,
  sortOrder,
  onSort,
  onEdit,
  onDelete,
  selectedIds,
  onToggleSelect,
  onToggleSelectAll,
  onView,
  canManage,
}: Props) {
  const [hoveredRow, setHoveredRow] = useState<string | null>(null);
  const allSelected = customers.length > 0 && selectedIds.length === customers.length;

  function SortIcon({ field }: { field: keyof Customer }) {
    if (sortField !== field) return <ChevronDown size={14} className="text-gray-300" />;
    return sortOrder === 'asc' ? (
      <ChevronUp size={14} className="text-indigo-500" />
    ) : (
      <ChevronDown size={14} className="text-indigo-500" />
    );
  }

  const genderBadge = (g: string) => {
    const styles: Record<string, string> = {
      Male: 'bg-blue-50 text-blue-700 ring-blue-200',
      Female: 'bg-pink-50 text-pink-700 ring-pink-200',
      Other: 'bg-amber-50 text-amber-700 ring-amber-200',
    };
    return styles[g] || styles.Other;
  };

  return (
    <div className="overflow-hidden rounded-2xl bg-white shadow-xl shadow-gray-200/50 ring-1 ring-gray-100">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gradient-to-r from-gray-50 to-gray-100/50">
              {canManage ? (
                <th className="w-12 py-4 pl-6">
                  <input
                    type="checkbox"
                    checked={allSelected}
                    onChange={onToggleSelectAll}
                    className="h-4 w-4 rounded-md border-gray-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer accent-indigo-600"
                  />
                </th>
              ) : null}
              {columns.map(col => (
                <th
                  key={col.key}
                  onClick={() => onSort(col.key)}
                  className="cursor-pointer select-none whitespace-nowrap px-4 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-500 hover:text-gray-700 transition-colors"
                >
                  <span className="inline-flex items-center gap-1.5">
                    {col.label}
                    <SortIcon field={col.key} />
                  </span>
                </th>
              ))}
              <th className="px-4 py-4 text-right text-xs font-bold uppercase tracking-wider text-gray-500">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            <AnimatePresence>
              {customers.map(c => (
                <motion.tr
                  key={c.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                  onMouseEnter={() => setHoveredRow(c.id)}
                  onMouseLeave={() => setHoveredRow(null)}
                  className={`group transition-colors duration-150 ${
                    selectedIds.includes(c.id) ? 'bg-indigo-50/60' : hoveredRow === c.id ? 'bg-gray-50/80' : ''
                  }`}
                >
                  {canManage ? (
                    <td className="py-3.5 pl-6">
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(c.id)}
                        onChange={() => onToggleSelect(c.id)}
                        className="h-4 w-4 rounded-md border-gray-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer accent-indigo-600"
                      />
                    </td>
                  ) : null}
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-3">
                      <div
                        className={`flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br ${
                          avatarColors[getColorIndex(c.name)]
                        } text-xs font-bold text-white shadow-sm flex-shrink-0`}
                      >
                        {getInitials(c.name)}
                      </div>
                      <span className="font-semibold text-gray-900 text-sm">{c.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3.5 text-sm text-gray-600">{formatDate(c.dob)}</td>
                  <td className="px-4 py-3.5">
                    <span
                      className={`inline-flex rounded-lg px-2.5 py-1 text-xs font-semibold ring-1 ${genderBadge(c.gender)}`}
                    >
                      {c.gender}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-sm text-gray-600 font-mono">{c.phone}</td>
                  <td className="px-4 py-3.5 text-sm text-gray-600">{c.email}</td>
                  <td className="px-4 py-3.5 text-sm text-gray-400">{formatDate(c.createdAt)}</td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <button
                        onClick={() => onView(c)}
                        className="rounded-lg p-2 text-gray-400 hover:bg-indigo-50 hover:text-indigo-600 transition-all"
                        title="View"
                      >
                        <Eye size={15} />
                      </button>
                      {canManage ? (
                        <>
                          <button
                            onClick={() => onEdit(c)}
                            className="rounded-lg p-2 text-gray-400 hover:bg-blue-50 hover:text-blue-600 transition-all"
                            title="Edit"
                          >
                            <Edit3 size={15} />
                          </button>
                          <button
                            onClick={() => onDelete(c.id)}
                            className="rounded-lg p-2 text-gray-400 hover:bg-red-50 hover:text-red-600 transition-all"
                            title="Delete"
                          >
                            <Trash2 size={15} />
                          </button>
                        </>
                      ) : null}
                    </div>
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
      </div>

      {customers.length === 0 && (
        <div className="py-20 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-100">
            <MoreHorizontal size={24} className="text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-700">No customers found</h3>
          <p className="text-sm text-gray-400 mt-1">Add your first customer or adjust filters</p>
        </div>
      )}
    </div>
  );
}
