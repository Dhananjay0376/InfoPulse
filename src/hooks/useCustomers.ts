import { useState, useEffect, useCallback } from 'react';
import type { Customer } from '../types/customer';

const STORAGE_KEY = 'crm_customers';

function loadCustomers(): Customer[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

function saveCustomers(customers: Customer[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(customers));
}

export function useCustomers() {
  const [customers, setCustomers] = useState<Customer[]>(loadCustomers);
  const [searchQuery, setSearchQuery] = useState('');
  const [genderFilter, setGenderFilter] = useState<string>('All');
  const [sortField, setSortField] = useState<keyof Customer>('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  useEffect(() => {
    saveCustomers(customers);
  }, [customers]);

  const addCustomer = useCallback((customer: Omit<Customer, 'id' | 'createdAt'>) => {
    const newCustomer: Customer = {
      ...customer,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };
    setCustomers(prev => [newCustomer, ...prev]);
  }, []);

  const updateCustomer = useCallback((id: string, data: Omit<Customer, 'id' | 'createdAt'>) => {
    setCustomers(prev =>
      prev.map(c => (c.id === id ? { ...c, ...data } : c))
    );
  }, []);

  const deleteCustomer = useCallback((id: string) => {
    setCustomers(prev => prev.filter(c => c.id !== id));
  }, []);

  const deleteMultiple = useCallback((ids: string[]) => {
    setCustomers(prev => prev.filter(c => !ids.includes(c.id)));
  }, []);

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
