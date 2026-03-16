import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  Plus,
  Search,
  Filter,
  Trash2,
  Sparkles,
  Database,
} from 'lucide-react';
import { useCustomers } from './hooks/useCustomers';
import type { Customer } from './types/customer';
import CustomerModal from './components/CustomerModal';
import CustomerTable from './components/CustomerTable';
import CustomerDetailModal from './components/CustomerDetailModal';
import DeleteConfirmModal from './components/DeleteConfirmModal';
import ExportMenu from './components/ExportMenu';
import StatsCards from './components/StatsCards';

export function App() {
  const {
    customers,
    allCustomers,
    totalCount,
    addCustomer,
    updateCustomer,
    deleteCustomer,
    deleteMultiple,
    searchQuery,
    setSearchQuery,
    genderFilter,
    setGenderFilter,
    sortField,
    setSortField,
    sortOrder,
    setSortOrder,
  } = useCustomers();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [viewingCustomer, setViewingCustomer] = useState<Customer | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [bulkDelete, setBulkDelete] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const handleAdd = () => {
    setEditingCustomer(null);
    setModalOpen(true);
  };

  const handleEdit = (c: Customer) => {
    setEditingCustomer(c);
    setModalOpen(true);
  };

  const handleSubmit = (data: Omit<Customer, 'id' | 'createdAt'>) => {
    if (editingCustomer) {
      updateCustomer(editingCustomer.id, data);
    } else {
      addCustomer(data);
    }
  };

  const handleSort = useCallback(
    (field: keyof Customer) => {
      if (sortField === field) {
        setSortOrder(o => (o === 'asc' ? 'desc' : 'asc'));
      } else {
        setSortField(field);
        setSortOrder('asc');
      }
    },
    [sortField, setSortField, setSortOrder]
  );

  const handleToggleSelect = useCallback((id: string) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  }, []);

  const handleToggleSelectAll = useCallback(() => {
    setSelectedIds(prev =>
      prev.length === customers.length ? [] : customers.map(c => c.id)
    );
  }, [customers]);

  const handleDeleteSingle = (id: string) => {
    setDeleteTarget(id);
    setBulkDelete(false);
  };

  const handleBulkDelete = () => {
    setBulkDelete(true);
    setDeleteTarget('bulk');
  };

  const confirmDelete = () => {
    if (bulkDelete) {
      deleteMultiple(selectedIds);
      setSelectedIds([]);
    } else if (deleteTarget) {
      deleteCustomer(deleteTarget);
      setSelectedIds(prev => prev.filter(x => x !== deleteTarget));
    }
    setDeleteTarget(null);
    setBulkDelete(false);
  };

  const genderOptions = ['All', 'Male', 'Female', 'Other'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-indigo-50/30">
      {/* Background decorations */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 h-96 w-96 rounded-full bg-indigo-200/20 blur-3xl" />
        <div className="absolute top-1/2 -left-40 h-96 w-96 rounded-full bg-purple-200/20 blur-3xl" />
        <div className="absolute -bottom-40 right-1/3 h-96 w-96 rounded-full bg-pink-200/15 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-xl shadow-indigo-200">
                <Database size={24} className="text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
                  Info<span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-600">Pulse</span>
                </h1>
                <p className="text-sm text-gray-500 flex items-center gap-1.5">
                  <Sparkles size={12} className="text-indigo-400" />
                  Advanced Customer Data Management
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <ExportMenu customers={allCustomers} />
              <button
                onClick={handleAdd}
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-200 hover:shadow-xl hover:shadow-indigo-300 transition-all duration-200 hover:-translate-y-0.5"
              >
                <Plus size={16} />
                Add Customer
              </button>
            </div>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <StatsCards customers={allCustomers} />
        </motion.div>

        {/* Toolbar */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-6 flex flex-col sm:flex-row items-stretch sm:items-center gap-4"
        >
          {/* Search */}
          <div className="relative flex-1">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search customers by name, email, or phone..."
              className="w-full rounded-xl border-2 border-gray-200 bg-white py-2.5 pl-11 pr-4 text-sm outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 transition-all duration-200"
            />
          </div>

          {/* Gender filter */}
          <div className="flex items-center gap-2">
            <Filter size={14} className="text-gray-400" />
            <div className="flex rounded-xl bg-white border-2 border-gray-200 p-1">
              {genderOptions.map(g => (
                <button
                  key={g}
                  onClick={() => setGenderFilter(g)}
                  className={`rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-all duration-200 ${
                    genderFilter === g
                      ? 'bg-indigo-500 text-white shadow-md shadow-indigo-200'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>

          {/* Bulk actions */}
          {selectedIds.length > 0 && (
            <motion.button
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              onClick={handleBulkDelete}
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-red-500 to-rose-600 px-4 py-2.5 text-xs font-semibold text-white shadow-lg shadow-red-200 hover:shadow-xl transition-all"
            >
              <Trash2 size={14} />
              Delete {selectedIds.length} Selected
            </motion.button>
          )}
        </motion.div>

        {/* Results count */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.25 }}
          className="mb-4 flex items-center justify-between"
        >
          <p className="text-sm text-gray-500">
            Showing <span className="font-semibold text-gray-700">{customers.length}</span> of{' '}
            <span className="font-semibold text-gray-700">{totalCount}</span> customers
          </p>
        </motion.div>

        {/* Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <CustomerTable
            customers={customers}
            sortField={sortField}
            sortOrder={sortOrder}
            onSort={handleSort}
            onEdit={handleEdit}
            onDelete={handleDeleteSingle}
            selectedIds={selectedIds}
            onToggleSelect={handleToggleSelect}
            onToggleSelectAll={handleToggleSelectAll}
            onView={c => setViewingCustomer(c)}
          />
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-8 text-center"
        >
          <p className="text-xs text-gray-400">
            InfoPulse • Data stored securely in your browser's local storage
          </p>
        </motion.div>
      </div>

      {/* Modals */}
      <CustomerModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmit}
        initialData={editingCustomer}
      />

      <CustomerDetailModal
        customer={viewingCustomer}
        isOpen={!!viewingCustomer}
        onClose={() => setViewingCustomer(null)}
      />

      <DeleteConfirmModal
        isOpen={!!deleteTarget}
        count={bulkDelete ? selectedIds.length : 1}
        onConfirm={confirmDelete}
        onCancel={() => {
          setDeleteTarget(null);
          setBulkDelete(false);
        }}
      />
    </div>
  );
}
