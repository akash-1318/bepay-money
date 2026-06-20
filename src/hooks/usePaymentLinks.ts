import { useState, useEffect } from 'react';
import { api } from '@/services/api';
import type { PaymentLink } from '@/types/api';
import { DEFAULT_PAGE_SIZE } from '@/constants/options';

interface UsePaymentLinksResult {
    loading: boolean;
    links: PaymentLink[];
    totalCount: number;
    currentPage: number;
    searchQuery: string;
    statusFilter: string;
    setCurrentPage: (page: number) => void;
    setSearchQuery: (search: string) => void;
    setStatusFilter: (status: any) => void;
    refresh: () => Promise<void>;
}

export const usePaymentLinks = (pageSize = DEFAULT_PAGE_SIZE): UsePaymentLinksResult => {
    const [loading, setLoading] = useState(true);
    const [links, setLinks] = useState<PaymentLink[]>([]);
    const [totalCount, setTotalCount] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('ALL');

    const loadPaymentLinks = async () => {
        setLoading(true);
        try {
            const data = await api.getPaymentLinks({
                status: statusFilter,
                search: searchQuery,
                page: currentPage,
                limit: pageSize
            });
            setLinks(data.items);
            setTotalCount(data.total);
        } catch (err) {
            console.error('Failed to fetch payment links', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadPaymentLinks();
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
        links,
        totalCount,
        currentPage,
        searchQuery,
        statusFilter,
        setCurrentPage,
        setSearchQuery: handleSearchChange,
        setStatusFilter: handleStatusFilterChange,
        refresh: loadPaymentLinks
    };
};
