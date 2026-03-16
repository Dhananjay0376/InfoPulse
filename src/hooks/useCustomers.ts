import { useState, useEffect, useCallback } from 'react';
import type { Customer } from '../types/customer';
import {
  bulkDeleteCustomers,
  createCustomer as createCustomerRequest,
  deleteCustomer as deleteCustomerRequest,
  listCustomers as listCustomersRequest,
  updateCustomer as updateCustomerRequest,
  type CustomerInput,
  type CustomerPayload,
} from '../lib/api';

function mapCustomer(payload: CustomerPayload): Customer {
  return {
    id: payload.id,
    name: payload.name,
    dob: payload.dob ?? '',
    gender: payload.gender ?? 'Other',
    phone: payload.phone ?? '',
    email: payload.email,
    createdAt: payload.createdAt,
  };
}

export function useCustomers(token: string | null) {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(Boolean(token));
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [genderFilter, setGenderFilter] = useState<string>('All');
  const [sortField, setSortField] = useState<keyof Customer>('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const refreshCustomers = useCallback(async () => {
    if (!token) {
      setCustomers([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await listCustomersRequest(token);
      setCustomers(response.customers.map(mapCustomer));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load customers');
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    void refreshCustomers();
  }, [refreshCustomers]);

  const addCustomer = useCallback(async (customer: Omit<Customer, 'id' | 'createdAt'>) => {
    if (!token) return;

    const response = await createCustomerRequest(token, customer as CustomerInput);
    setCustomers(prev => [mapCustomer(response.customer), ...prev]);
  }, [token]);

  const updateCustomer = useCallback(async (id: string, data: Omit<Customer, 'id' | 'createdAt'>) => {
    if (!token) return;

    const response = await updateCustomerRequest(token, id, data as CustomerInput);
    setCustomers(prev => prev.map(customer => (customer.id === id ? mapCustomer(response.customer) : customer)));
  }, [token]);

  const deleteCustomer = useCallback(async (id: string) => {
    if (!token) return;

    await deleteCustomerRequest(token, id);
    setCustomers(prev => prev.filter(customer => customer.id !== id));
  }, [token]);

  const deleteMultiple = useCallback(async (ids: string[]) => {
    if (!token || ids.length === 0) return;

    await bulkDeleteCustomers(token, ids);
    setCustomers(prev => prev.filter(customer => !ids.includes(customer.id)));
  }, [token]);

  const filteredCustomers = customers
    .filter(c => {
      const matchesSearch =
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.phone.includes(searchQuery);
      const matchesGender = genderFilter === 'All' || c.gender === genderFilter;
      return matchesSearch && matchesGender;
    })
    .sort((a, b) => {
      const aVal = a[sortField];
      const bVal = b[sortField];
      const cmp = aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
      return sortOrder === 'asc' ? cmp : -cmp;
    });

  return {
    customers: filteredCustomers,
    allCustomers: customers,
    totalCount: customers.length,
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
  };
}
