import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, SlidersHorizontal, ArrowRight, Copy, Check, RefreshCw, Loader2 } from 'lucide-react';
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
import { usePaymentLinks } from '@/hooks/usePaymentLinks';
import { PaginationControls } from '@/components/shared/PaginationControls';
import { StatusBadge } from '@/components/shared/StatusBadge';
import type { PaymentLink as PaymentLinkType } from '@/types/api';

const PaymentLink: React.FC = () => {
    const navigate = useNavigate();

    const {
        loading,
        links,
        totalCount,
        currentPage,
        searchQuery,
        statusFilter,
        setCurrentPage,
        setSearchQuery,
        setStatusFilter,
        refresh
    } = usePaymentLinks();

    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [copiedId, setCopiedId] = useState<string | null>(null);
    const timerRef = useRef<any>(null);

    const handleCopy = (e: React.MouseEvent<any>, link: PaymentLinkType) => {
        e.stopPropagation();
        navigator.clipboard.writeText(link.paymentUrl);
        setCopiedId(link.id);
        if (timerRef.current) clearTimeout(timerRef.current);
        timerRef.current = setTimeout(() => setCopiedId(null), 2000);
    };

    useEffect(() => {
        return () => {
            if (timerRef.current) clearTimeout(timerRef.current);
        };
    }, []);

    return (
        <div className="flex flex-col gap-6 w-full">
            {/* Top Toolbar */}
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between w-full">
                <h1 className="page-title">Payment Links</h1>

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
                                <div className="absolute right-0 mt-2 w-44 bg-white border border-gray-200 rounded-lg shadow-md p-1 z-50 animate-in fade-in-0 zoom-in-95 duration-100">
                                    <div className="px-2 py-1.5 text-xs font-semibold text-gray-500">
                                        Filter by Status
                                    </div>
                                    <div className="my-1 bg-gray-100 h-px" />
                                    {['ALL', 'ACTIVE', 'PAID', 'EXPIRED'].map((status) => (
                                        <button
                                            key={status}
                                            onClick={() => {
                                                setStatusFilter(status);
                                                setIsDropdownOpen(false);
                                            }}
                                            className={`w-full text-left px-2 py-1.5 text-sm rounded-md cursor-pointer hover:bg-gray-100 block ${statusFilter === status ? 'bg-gray-50 font-semibold' : ''
                                                }`}
                                        >
                                            {status === 'ALL' ? 'All Links' : status.charAt(0) + status.slice(1).toLowerCase()}
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

                    {/* Create Link */}
                    <Button
                        onClick={() => navigate('/payment-links/create')}
                        className="btn-primary h-10 px-5"
                    >
                        <span className="text-sm">+ Create Payment Link</span>
                    </Button>
                </div>
            </div>

            {/* Table */}
            <div className="card-container w-full overflow-hidden relative">
                <Table>
                    <TableHeader className="bg-white">
                        <TableRow className="border-b border-gray-100 hover:bg-transparent">
                            <TableHead className="text-text-muted font-medium text-sm font-sans py-4 px-6">Link ID</TableHead>
                            <TableHead className="text-text-muted font-medium text-sm font-sans py-4 px-6">Title / Purpose</TableHead>
                            <TableHead className="text-text-muted font-medium text-sm font-sans py-4 px-6">Amount</TableHead>
                            <TableHead className="text-text-muted font-medium text-sm font-sans py-4 px-6">Network</TableHead>
                            <TableHead className="text-text-muted font-medium text-sm font-sans py-4 px-6">Status</TableHead>
                            <TableHead className="text-text-muted font-medium text-sm font-sans py-4 px-6">Expiry Date</TableHead>
                            <TableHead className="text-text-muted font-medium text-sm font-sans py-4 px-6 text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={7} className="py-12 text-center text-gray-400 text-sm font-medium font-sans">
                                    <div className="flex flex-col items-center justify-center gap-3">
                                        <Loader2 className="w-8 h-8 animate-spin text-black" />
                                        <p className="text-sm font-medium text-text-secondary font-sans">Loading payment links...</p>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : links.length > 0 ? (
                            links.map((link) => (
                                <TableRow
                                    key={link.id}
                                    onClick={() => navigate(`/payment-links/${link.id}`)}
                                    className="even:bg-bg-zebra border-b border-gray-100 hover:bg-gray-50/50 transition-colors cursor-pointer"
                                >
                                    <TableCell className="py-4 px-6 text-sm font-medium font-sans text-black">{link.id}</TableCell>
                                    <TableCell className="py-4 px-6 text-sm font-medium font-sans text-black">
                                        <div>
                                            <p className="font-semibold text-black">{link.title}</p>
                                            {link.externalReference && (
                                                <p className="text-xs text-text-secondary mt-0.5 font-mono">Ref: {link.externalReference}</p>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell className="py-4 px-6 text-sm font-medium font-sans text-black">
                                        {parseFloat(link.amount).toLocaleString(undefined, { minimumFractionDigits: 2 })} {link.currency}
                                    </TableCell>
                                    <TableCell className="py-4 px-6 text-sm font-medium font-sans text-gray-500 uppercase">{link.network}</TableCell>
                                    <TableCell className="py-4 px-6 text-sm font-medium font-sans">
                                        <StatusBadge status={link.status} />
                                    </TableCell>
                                    <TableCell className="py-4 px-6 text-sm font-medium font-sans text-black">
                                        {new Date(link.expiresAt).toLocaleDateString(undefined, {
                                            month: 'short',
                                            day: 'numeric',
                                            year: 'numeric'
                                        })}
                                    </TableCell>
                                    <TableCell className="py-4 px-6 text-sm font-medium font-sans text-right" onClick={(e) => e.stopPropagation()}>
                                        <div className="inline-flex items-center gap-2">
                                            <Button
                                                onClick={(e) => handleCopy(e, link)}
                                                variant="ghost"
                                                size="icon"
                                                className="p-2 bg-gray-50 hover:bg-gray-100 rounded-lg cursor-pointer size-8 flex items-center justify-center border border-gray-200"
                                                title="Copy Payment URL"
                                            >
                                                {copiedId === link.id ? (
                                                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                                                ) : (
                                                    <Copy className="w-3.5 h-3.5 text-gray-600" />
                                                )}
                                            </Button>
                                            <Button
                                                onClick={() => navigate(`/payment-links/${link.id}`)}
                                                variant="ghost"
                                                size="icon"
                                                className="p-2 bg-gray-50 hover:bg-gray-100 rounded-lg cursor-pointer size-8 flex items-center justify-center border border-gray-200"
                                                title="View Details"
                                            >
                                                <ArrowRight className="w-3.5 h-3.5 text-gray-600" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={7} className="py-12 text-center text-gray-400 text-sm font-medium font-sans">
                                    No payment links found.
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
                typeLabel="links"
            />
        </div>
    );
};

export default PaymentLink;