import { Search, SlidersHorizontal, ArrowDown, ArrowUp, RefreshCw, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
    Table,
    TableHeader,
    TableBody,
    TableRow,
    TableHead,
    TableCell,
} from '@/components/ui/table';
import { api } from '@/services/api';
import type { Transaction } from '@/types/api';
import { useTransactions } from '@/hooks/useTransactions';
import { PaginationControls } from '@/components/shared/PaginationControls';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { TransactionDetailModal } from '@/components/shared/TransactionDetailModal';
import { useState } from 'preact/hooks';

const PaymentHistory: React.FC = () => {
    const {
        loading,
        transactions,
        totalCount,
        currentPage,
        searchQuery,
        statusFilter,
        setCurrentPage,
        setSearchQuery,
        setStatusFilter,
        refresh
    } = useTransactions();

    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);

    // Format helpers
    const formatDate = (isoString: string) => {
        const d = new Date(isoString);
        return d.toLocaleDateString(undefined, {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });
    };

    const formatTime = (isoString: string) => {
        const d = new Date(isoString);
        return d.toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });
    };

    // CSV Export Handler
    const handleExport = async () => {
        try {
            const data = await api.getTransactions({
                status: statusFilter,
                search: searchQuery,
                page: 1,
                limit: 1000
            });

            const headers = [
                'Payment ID',
                'Order ID/Ref',
                'Original Price',
                'Amount Received',
                'Amount Sent',
                'Status',
                'Created Date',
                'Created Time',
            ];

            const rows = data.items.map((t) => [
                t.id,
                t.externalReference || '',
                t.originalPrice,
                `${t.amountReceivedVal} ${t.amountReceivedUnit}`,
                `${t.amountSentVal} ${t.amountSentUnit}`,
                t.status,
                formatDate(t.createdAt),
                formatTime(t.createdAt),
            ]);

            const csvContent = [
                headers.join(','),
                ...rows.map((r) => r.map((val) => `"${val.replace(/"/g, '""')}"`).join(',')),
            ].join('\n');

            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.setAttribute('href', url);
            link.setAttribute('download', `payments_export_${new Date().toISOString().slice(0, 10)}.csv`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (err) {
            console.error('Failed to export CSV', err);
        }
    };

    return (
        <div className="flex flex-col gap-6 w-full relative font-sans">
            {/* Top Toolbar */}
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between w-full">
                <h1 className="page-title">Payments</h1>

                <div className="flex flex-wrap items-center gap-3">
                    {/* Search */}
                    <div className="relative min-w-60">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <Input
                            type="text"
                            placeholder="Search"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery((e.target as HTMLInputElement).value)}
                            className="form-input pl-9 pr-3 h-10 w-full"
                        />
                    </div>

                    {/* Filters */}
                    <div className="relative">
                        <Button
                            variant="outline"
                            size="lg"
                            className="h-10 px-4 border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 gap-2 cursor-pointer rounded-lg text-sm font-medium"
                            onClick={() => setIsDropdownOpen((prev) => !prev)}
                        >
                            <SlidersHorizontal className="w-4 h-4" />
                            <span>Filters</span>
                            {statusFilter !== 'ALL' && (
                                <span className="ml-1 px-1.5 py-px text-[10px] font-semibold bg-gray-100 text-gray-800 rounded-full">
                                    {statusFilter}
                                </span>
                            )}
                        </Button>

                        {isDropdownOpen && (
                            <>
                                <div className="fixed inset-0 z-40" onClick={() => setIsDropdownOpen(false)} />
                                <div className="absolute right-0 mt-2 w-44 bg-white border border-gray-200 rounded-lg shadow-md p-1 z-50 animate-in fade-in-0 zoom-in-95 duration-100 font-sans">
                                    <div className="px-2 py-1.5 text-xs font-semibold text-gray-500">
                                        Filter by Status
                                    </div>
                                    <div className="my-1 bg-gray-100 h-px" />
                                    {['ALL', 'CONFIRMED', 'PENDING', 'FAILED', 'EXPIRED'].map((status) => (
                                        <button
                                            key={status}
                                            onClick={() => {
                                                setStatusFilter(status);
                                                setIsDropdownOpen(false);
                                            }}
                                            className={`w-full text-left px-2 py-1.5 text-sm rounded-md cursor-pointer hover:bg-gray-100 block ${statusFilter === status ? 'bg-gray-50 font-semibold' : ''
                                                }`}
                                        >
                                            {status === 'ALL' ? 'All Payments' : status.charAt(0) + status.slice(1).toLowerCase()}
                                        </button>
                                    ))}
                                </div>
                            </>
                        )}
                    </div>

                    {/* Refresh */}
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={refresh}
                        className="h-10 w-10 border border-gray-200 bg-white hover:bg-gray-50 rounded-lg cursor-pointer flex items-center justify-center"
                        aria-label="Refresh list"
                    >
                        <RefreshCw className={`w-4 h-4 text-gray-500 ${loading ? 'animate-spin' : ''}`} />
                    </Button>

                    {/* Export */}
                    <Button
                        onClick={handleExport}
                        className="btn-primary h-10 px-5"
                    >
                        <span className="text-sm">Export</span>
                    </Button>
                </div>
            </div>

            {/* Table */}
            <div className="card-container w-full overflow-hidden relative">
                <Table>
                    <TableHeader className="bg-white">
                        <TableRow className="border-b border-gray-100 hover:bg-transparent">
                            <TableHead className="text-text-muted font-medium text-sm font-sans py-4 px-6">Payment ID</TableHead>
                            <TableHead className="text-text-muted font-medium text-sm font-sans py-4 px-6">Order ID / Ref</TableHead>
                            <TableHead className="text-text-muted font-medium text-sm font-sans py-4 px-6">Original Price</TableHead>
                            <TableHead className="text-text-muted font-medium text-sm font-sans py-4 px-6">Amount Received</TableHead>
                            <TableHead className="text-text-muted font-medium text-sm font-sans py-4 px-6">Amount Sent</TableHead>
                            <TableHead className="text-text-muted font-medium text-sm font-sans py-4 px-6">Status</TableHead>
                            <TableHead className="text-text-muted font-medium text-sm font-sans py-4 px-6">Created/ Last Date</TableHead>
                            <TableHead className="text-text-muted font-medium text-sm font-sans py-4 px-6">Created/ Last Time</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={8} className="py-12 text-center text-gray-400 text-sm font-medium font-sans">
                                    <div className="flex flex-col items-center justify-center gap-3">
                                        <Loader2 className="w-8 h-8 animate-spin text-black" />
                                        <p className="text-sm font-medium text-text-secondary font-sans">Loading payments...</p>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : transactions.length > 0 ? (
                            transactions.map((payment) => (
                                <TableRow
                                    key={payment.id}
                                    onClick={() => setSelectedTx(payment)}
                                    className="even:bg-bg-zebra border-b border-gray-100 hover:bg-gray-50/50 transition-colors cursor-pointer"
                                >
                                    <TableCell className="py-4 px-6 text-sm font-medium font-sans text-black">{payment.id}</TableCell>
                                    <TableCell className="py-4 px-6 text-sm font-medium font-sans text-gray-500">{payment.externalReference || '—'}</TableCell>
                                    <TableCell className="py-4 px-6 text-sm font-medium font-sans text-black">{payment.originalPrice}</TableCell>
                                    <TableCell className="py-4 px-6 text-sm font-medium font-sans text-black">
                                        <div className="inline-flex items-center gap-2">
                                            <div className="inline-flex items-center justify-center w-5.5 h-5.5 bg-success-bg border border-success-border rounded-md text-success-icon">
                                                <ArrowDown className="w-3.5 h-3.5 stroke-[3.5]" />
                                            </div>
                                            <span>{payment.amountReceivedVal} {payment.amountReceivedUnit}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="py-4 px-6 text-sm font-medium font-sans text-black">
                                        <div className="inline-flex items-center gap-2">
                                            <div className="inline-flex items-center justify-center w-5.5 h-5.5 bg-danger-bg border border-danger-border rounded-md text-danger-icon">
                                                <ArrowUp className="w-3.5 h-3.5 stroke-[3.5]" />
                                            </div>
                                            <span>{payment.amountSentVal} {payment.amountSentUnit}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="py-4 px-6 text-sm font-medium font-sans">
                                        <StatusBadge status={payment.status} />
                                    </TableCell>
                                    <TableCell className="py-4 px-6 text-sm font-medium font-sans text-black whitespace-nowrap">{formatDate(payment.createdAt)}</TableCell>
                                    <TableCell className="py-4 px-6 text-sm font-medium font-sans text-black whitespace-nowrap">{formatTime(payment.createdAt)}</TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={8} className="py-12 text-center text-gray-400 text-sm font-medium font-sans">
                                    No payments match the search criteria.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Pagination Controls */}
            <PaginationControls
                currentPage={currentPage}
                totalCount={totalCount}
                pageSize={10}
                totalPages={Math.ceil(totalCount / 10)}
                loading={loading}
                onPageChange={setCurrentPage}
                typeLabel="entries"
            />

            {/* Transaction Detail Overlay Modal */}
            <TransactionDetailModal
                transaction={selectedTx}
                onClose={() => setSelectedTx(null)}
            />
        </div>
    );
};

export default PaymentHistory;