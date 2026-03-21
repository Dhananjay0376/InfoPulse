import { useEffect, useMemo, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  Plus,
  Search,
  Filter,
  Trash2,
  Sparkles,
  Database,
  LogOut,
  RefreshCcw,
} from 'lucide-react';
import { useCustomers } from './hooks/useCustomers';
import { useDeliveries } from './hooks/useDeliveries';
import { useCampaigns } from './hooks/useCampaigns';
import { useCampaignInsights } from './hooks/useCampaignInsights';
import { useSession } from './hooks/useSession';
import { useTemplates } from './hooks/useTemplates';
import { useManagedUsers } from './hooks/useManagedUsers';
import type { Customer } from './types/customer';
import LoginPanel from './components/LoginPanel';
import CampaignInsights from './components/CampaignInsights';
import CampaignLaunchpad from './components/CampaignLaunchpad';
import CustomerModal from './components/CustomerModal';
import CustomerTable from './components/CustomerTable';
import CustomerDetailModal from './components/CustomerDetailModal';
import DeleteConfirmModal from './components/DeleteConfirmModal';
import DeliveryHistory from './components/DeliveryHistory';
import ExportMenu from './components/ExportMenu';
import StatsCards from './components/StatsCards';
import TemplateStudio from './components/TemplateStudio';
import UserManagement from './components/UserManagement';

export function App() {
  const {
    token,
    user,
    loading: sessionLoading,
    error: sessionError,
    signIn,
    signOut,
    isAuthenticated,
  } = useSession();
  const {
    customers,
    allCustomers,
    totalCount,
    loading,
    error,
    refreshCustomers,
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
  } = useCustomers(token);
  const {
    deliveries,
    loading: deliveriesLoading,
    error: deliveriesError,
    refreshDeliveries,
  } = useDeliveries(token);
  const {
    templates,
    loading: templatesLoading,
    error: templatesError,
    refreshTemplates,
    addTemplate,
  } = useTemplates(token);
  const {
    users,
    loading: usersLoading,
    error: usersError,
    refreshUsers,
    addUser,
  } = useManagedUsers(token, user?.role === 'admin');
  const {
    campaigns,
    loading: campaignsLoading,
    error: campaignsError,
    refreshCampaigns,
    addCampaign,
    launchCampaign,
  } = useCampaigns(token);

  const [selectedCampaignId, setSelectedCampaignId] = useState<string | null>(null);
  const selectedCampaign = useMemo(
    () => campaigns.find((campaign) => campaign.id === selectedCampaignId) ?? campaigns[0] ?? null,
    [campaigns, selectedCampaignId]
  );
  const {
    summary: campaignSummary,
    deliveries: campaignDeliveries,
    loading: campaignInsightsLoading,
    error: campaignInsightsError,
    refreshInsights,
  } = useCampaignInsights(token, selectedCampaign?.id ?? null);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [viewingCustomer, setViewingCustomer] = useState<Customer | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [bulkDelete, setBulkDelete] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [actionError, setActionError] = useState<string | null>(null);

  useEffect(() => {
    if (!selectedCampaignId && campaigns.length > 0) {
      setSelectedCampaignId(campaigns[0].id);
    }
  }, [campaigns, selectedCampaignId]);

  const handleAdd = () => {
    setEditingCustomer(null);
    setModalOpen(true);
  };

  const handleEdit = (c: Customer) => {
    setEditingCustomer(c);
    setModalOpen(true);
  };

  const handleSignIn = async (email: string, password: string) => {
    try {
      await signIn(email, password);
    } catch {
      // Error state is managed by the session hook.
    }
  };

  const handleSubmit = async (data: Omit<Customer, 'id' | 'createdAt'>) => {
    setActionError(null);

    try {
      if (editingCustomer) {
        await updateCustomer(editingCustomer.id, data);
      } else {
        await addCustomer(data);
      }
      setModalOpen(false);
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Customer action failed');
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

  const confirmDelete = async () => {
    setActionError(null);

    try {
      if (bulkDelete) {
        await deleteMultiple(selectedIds);
        setSelectedIds([]);
      } else if (deleteTarget) {
        await deleteCustomer(deleteTarget);
        setSelectedIds(prev => prev.filter(x => x !== deleteTarget));
      }
      setDeleteTarget(null);
      setBulkDelete(false);
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Delete failed');
    }
  };

  const genderOptions = ['All', 'Male', 'Female', 'Other'];
  const hasProcessingCampaign = useMemo(
    () => campaigns.some((campaign) => campaign.status === 'processing'),
    [campaigns]
  );

  useEffect(() => {
    if (!hasProcessingCampaign) return;

    const interval = window.setInterval(() => {
      void refreshCampaigns();
      void refreshDeliveries();
      void refreshInsights();
    }, 5000);

    return () => {
      window.clearInterval(interval);
    };
  }, [hasProcessingCampaign, refreshCampaigns, refreshDeliveries, refreshInsights]);

  if (!isAuthenticated) {
    return <LoginPanel isLoading={sessionLoading} error={sessionError} onSubmit={handleSignIn} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-indigo-50/30">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 h-96 w-96 rounded-full bg-indigo-200/20 blur-3xl" />
        <div className="absolute top-1/2 -left-40 h-96 w-96 rounded-full bg-purple-200/20 blur-3xl" />
        <div className="absolute -bottom-40 right-1/3 h-96 w-96 rounded-full bg-pink-200/15 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-xl shadow-indigo-200">
                <Database size={24} className="text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">
                  Info<span className="bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent">Pulse</span>
                </h1>
                <p className="flex items-center gap-1.5 text-sm text-gray-500">
                  <Sparkles size={12} className="text-indigo-400" />
                  Authenticated customer management for {user?.fullName}
                </p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => {
                  void refreshCustomers();
                  void refreshDeliveries();
                  void refreshTemplates();
                  void refreshCampaigns();
                  void refreshInsights();
                  void refreshUsers();
                }}
                className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-600 transition hover:bg-gray-50"
              >
                <RefreshCcw size={16} />
                Refresh
              </button>
              <ExportMenu customers={allCustomers} />
              <button
                onClick={handleAdd}
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-200 transition hover:-translate-y-0.5 hover:shadow-xl hover:shadow-indigo-300"
              >
                <Plus size={16} />
                Add Customer
              </button>
              <button
                onClick={signOut}
                className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-600 transition hover:bg-gray-50"
              >
                <LogOut size={16} />
                Sign Out
              </button>
            </div>
          </div>
        </motion.div>

        {loading ? <p className="mb-6 text-sm text-gray-500">Loading customers...</p> : null}
        {error || actionError || deliveriesError || templatesError || campaignsError || campaignInsightsError || usersError ? (
          <p className="mb-6 rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-600">{error ?? actionError ?? deliveriesError ?? templatesError ?? campaignsError ?? campaignInsightsError ?? usersError}</p>
        ) : null}

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="mb-8">
          <StatsCards customers={allCustomers} />
        </motion.div>

        {user?.role === 'admin' ? (
          <UserManagement users={users} loading={usersLoading} onCreate={async (input) => {
            await addUser(input);
          }} />
        ) : null}

        <TemplateStudio templates={templates} loading={templatesLoading} onCreate={async (input) => {
          await addTemplate(input);
        }} />

        <CampaignLaunchpad
          templates={templates}
          campaigns={campaigns}
          loading={campaignsLoading}
          selectedCampaignId={selectedCampaign?.id ?? null}
          onCreate={async (input) => {
            const campaign = await addCampaign(input);
            if (campaign) setSelectedCampaignId(campaign.id);
          }}
          onLaunch={async (campaignId) => {
            await launchCampaign(campaignId);
            void refreshDeliveries();
            void refreshInsights();
          }}
          onSelectCampaign={setSelectedCampaignId}
        />

        <CampaignInsights
          campaign={selectedCampaign}
          summary={campaignSummary}
          deliveries={campaignDeliveries}
          loading={campaignInsightsLoading}
        />

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-6 mt-10 flex flex-col items-stretch gap-4 sm:flex-row sm:items-center"
        >
          <div className="relative flex-1">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search customers by name, email, or phone..."
              className="w-full rounded-xl border-2 border-gray-200 bg-white py-2.5 pl-11 pr-4 text-sm outline-none transition-all duration-200 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
            />
          </div>

          <div className="flex items-center gap-2">
            <Filter size={14} className="text-gray-400" />
            <div className="flex rounded-xl border-2 border-gray-200 bg-white p-1">
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

          {selectedIds.length > 0 && (
            <motion.button
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              onClick={handleBulkDelete}
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-red-500 to-rose-600 px-4 py-2.5 text-xs font-semibold text-white shadow-lg shadow-red-200 transition-all hover:shadow-xl"
            >
              <Trash2 size={14} />
              Delete {selectedIds.length} Selected
            </motion.button>
          )}
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.25 }} className="mb-4 flex items-center justify-between">
          <p className="text-sm text-gray-500">
            Showing <span className="font-semibold text-gray-700">{customers.length}</span> of{' '}
            <span className="font-semibold text-gray-700">{totalCount}</span> customers
          </p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
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

        <DeliveryHistory deliveries={deliveries} loading={deliveriesLoading} />

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="mt-8 text-center">
          <p className="text-xs text-gray-400">InfoPulse • Connected to the backend API</p>
        </motion.div>
      </div>

      <CustomerModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={(data) => void handleSubmit(data)}
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
        onConfirm={() => void confirmDelete()}
        onCancel={() => {
          setDeleteTarget(null);
          setBulkDelete(false);
        }}
      />
    </div>
  );
}
