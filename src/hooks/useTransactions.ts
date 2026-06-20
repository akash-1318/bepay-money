import { useState, useEffect } from 'react';
import { api } from '@/services/api';
import type { Transaction } from '@/types/api';
import { DEFAULT_PAGE_SIZE } from '@/constants/options';

interface UseTransactionsResult {
    loading: boolean;
    transactions: Transaction[];
    totalCount: number;
    currentPage: number;
    searchQuery: string;
    statusFilter: string;
    setCurrentPage: (page: number) => void;
    setSearchQuery: (search: string) => void;
    setStatusFilter: (status: any) => void;
    refresh: () => Promise<void>;
}

export const useTransactions = (pageSize = DEFAULT_PAGE_SIZE): UseTransactionsResult => {
    const [loading, setLoading] = useState(true);
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [totalCount, setTotalCount] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('ALL');

    const loadTransactions = async () => {
        setLoading(true);
        try {
            const data = await api.getTransactions({
                status: statusFilter,
                search: searchQuery,
                page: currentPage,
                limit: pageSize
            });
            setTransactions(data.items);
            setTotalCount(data.total);
        } catch (err) {
            console.error('Failed to fetch transactions', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadTransactions();
    }, [searchQuery, statusFilter, currentPage, pageSize]);

    const handleSearchChange = (val: string) => {
        setSearchQuery(val);
        setCurrentPage(1);
    };

    const handleStatusFilterChange = (status: string) => {
        setStatusFilter(status);
        setCurrentPage(1);
    };

    return {
        loading,
        transactions,
        totalCount,
        currentPage,
        searchQuery,
        statusFilter,
        setCurrentPage,
        setSearchQuery: handleSearchChange,
        setStatusFilter: handleStatusFilterChange,
        refresh: loadTransactions
    };
};
