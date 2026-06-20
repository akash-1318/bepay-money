import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MetricCard from "@/components/dashboard/MetricCard";
import { Button } from "@/components/ui/button";
import { CheckCircle, Clock, RefreshCw, TrendingUp, XCircle, ArrowRight, ArrowDown } from "lucide-react";
import { api } from '@/services/api';
import type { DashboardSummary, Transaction } from '@/types/api';
import { TIMEFRAME_OPTIONS } from '@/constants/options';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { TransactionDetailModal } from '@/components/shared/TransactionDetailModal';
import {
    Table,
    TableHeader,
    TableBody,
    TableRow,
    TableHead,
    TableCell,
} from '@/components/ui/table';

const Dashboard: React.FC = () => {
    const navigate = useNavigate();
    
    // API states
    const [loading, setLoading] = useState(true);
    const [summary, setSummary] = useState<DashboardSummary>({
        totalReceived: 0,
        successfulCount: 0,
        pendingCount: 0,
        failedExpiredCount: 0
    });
    const [recentTx, setRecentTx] = useState<Transaction[]>([]);
    const [timeframe, setTimeframe] = useState<'all' | '24h' | '7d' | '30d'>('all');
    const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);

    const loadDashboardData = async () => {
        setLoading(true);
        try {
            const sumData = await api.getDashboardSummary(timeframe);
            setSummary(sumData);
            
            const txData = await api.getTransactions({
                page: 1,
                limit: 5
            });
            setRecentTx(txData.items);
        } catch (err) {
            console.error('Failed to load dashboard data', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadDashboardData();
    }, [timeframe]);

    const formatDate = (isoString: string) => {
        const d = new Date(isoString);
        return d.toLocaleDateString(undefined, {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });
    };

    return (
        <div className="flex flex-col gap-6 w-full">
            {/* Header / Topbar */}
            <div className="flex flex-col gap-5 md:gap-3 md:flex-row items-center justify-between mb-2">
                <div>
                    <h2 className="text-[22px] text-black font-semibold font-sans">Welcome, Nehal</h2>
                    <p className="text-xs text-text-secondary mt-0.5 font-sans">Here's what's happening with your business today.</p>
                </div>
                
                {/* Controls */}
                <div className="flex items-center gap-3">
                    <select
                        value={timeframe}
                        onChange={(e) => setTimeframe(e.currentTarget.value as any)}
                        className="h-10 px-3.5 border border-gray-200 rounded-lg text-sm bg-white text-black outline-none focus:ring-1 focus:ring-gray-300 cursor-pointer font-sans font-medium"
                    >
                        {TIMEFRAME_OPTIONS.map(opt => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                    </select>

                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={loadDashboardData}
                        className="p-5 border border-gray-200 bg-white hover:bg-gray-50 rounded-lg cursor-pointer"
                        aria-label="Refresh metrics"
                    >
                        <RefreshCw className={`w-4 h-4 text-gray-500 ${loading ? 'animate-spin' : ''}`} />
                    </Button>
                    
                    <Button
                        size="lg"
                        className="text-base p-5 hover:bg-neutral-800 cursor-pointer"
                        onClick={() => navigate('/payment-links/create')}
                    >
                        <span className="text-sm">+ Create Payment Link</span>
                    </Button>
                </div>
            </div>

            {/* Statistics Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5 mb-2 relative">
                <MetricCard
                    title="Total Received"
                    value={`$${summary.totalReceived.toLocaleString(undefined, { minimumFractionDigits: 2 })}`}
                    icon={<TrendingUp className="w-5 h-5 text-white font-bold" />}
                    color="#2D2D2D"
                    subtitle="All confirmed payments"
                />
                <MetricCard
                    title="Successful"
                    value={summary.successfulCount}
                    icon={<CheckCircle className="w-5 h-5 text-white" />}
                    color="#27C263"
                    subtitle="Confirmed transactions"
                />
                <MetricCard
                    title="Pending"
                    value={summary.pendingCount}
                    icon={<Clock className="w-5 h-5 text-white" />}
                    color="#F59E0B"
                    subtitle="Awaiting payment"
                />
                <MetricCard
                    title="Failed / Expired"
                    value={summary.failedExpiredCount}
                    icon={<XCircle className="w-5 h-5 text-white" />}
                    color="#EF4444"
                    subtitle="Unsuccessful transactions"
                />
            </div>

            {/* Recent Activity Section */}
            <div className="flex flex-col gap-4 mt-2">
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="text-base font-bold text-black font-sans">Recent Activity</h3>
                        <p className="text-xs text-text-secondary mt-0.5 font-sans">Your latest payment activities</p>
                    </div>
                    <Button
                        variant="ghost"
                        onClick={() => navigate('/payment-history')}
                        className="text-sm font-semibold text-black hover:bg-gray-100 px-4 py-2 rounded-lg cursor-pointer flex items-center gap-1 font-sans"
                    >
                        View All Payments
                        <ArrowRight className="w-4 h-4" />
                    </Button>
                </div>

                {/* Table */}
                <div className="w-full bg-white border border-inactive rounded-[20px] overflow-hidden shadow-sm relative">
                    <Table>
                        <TableHeader className="bg-white">
                            <TableRow className="border-b border-gray-100 hover:bg-transparent">
                                <TableHead className="text-text-muted font-medium text-sm font-sans py-4 px-6">Payment ID</TableHead>
                                <TableHead className="text-text-muted font-medium text-sm font-sans py-4 px-6">Order ID / Ref</TableHead>
                                <TableHead className="text-text-muted font-medium text-sm font-sans py-4 px-6">Original Price</TableHead>
                                <TableHead className="text-text-muted font-medium text-sm font-sans py-4 px-6">Amount Received</TableHead>
                                <TableHead className="text-text-muted font-medium text-sm font-sans py-4 px-6">Status</TableHead>
                                <TableHead className="text-text-muted font-medium text-sm font-sans py-4 px-6">Date</TableHead>
                                <TableHead className="text-text-muted font-medium text-sm font-sans py-4 px-6 text-right">Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {recentTx.length > 0 ? (
                                recentTx.map((payment) => (
                                    <TableRow
                                        key={payment.id}
                                        onClick={() => setSelectedTx(payment)}
                                        className="even:bg-bg-zebra border-b border-gray-100 hover:bg-gray-50/50 transition-colors cursor-pointer"
                                    >
                                        <TableCell className="py-4 px-6 text-sm font-medium font-sans text-black">{payment.id}</TableCell>
                                        <TableCell className="py-4 px-6 text-sm font-medium font-sans text-gray-500">{payment.externalReference || '—'}</TableCell>
                                        <TableCell className="py-4 px-6 text-sm font-medium font-sans text-black font-semibold">{payment.originalPrice}</TableCell>
                                        <TableCell className="py-4 px-6 text-sm font-medium font-sans text-black">
                                            <div className="inline-flex items-center gap-2">
                                                <div className="inline-flex items-center justify-center w-[22px] h-[22px] bg-success-bg border border-success-border rounded-md text-success-icon">
                                                    <ArrowDown className="w-3.5 h-3.5 stroke-[3.5]" />
                                                </div>
                                                <span>{payment.amountReceivedVal} {payment.amountReceivedUnit}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="py-4 px-6 text-sm font-medium font-sans">
                                            <StatusBadge status={payment.status} />
                                        </TableCell>
                                        <TableCell className="py-4 px-6 text-sm font-medium font-sans text-black whitespace-nowrap">{formatDate(payment.createdAt)}</TableCell>
                                        <TableCell className="py-4 px-6 text-sm font-medium font-sans text-right">
                                            <Button
                                                variant="ghost"
                                                onClick={() => setSelectedTx(payment)}
                                                className="p-1 hover:bg-gray-100 rounded-lg cursor-pointer border border-gray-200 text-xs font-bold text-gray-700 h-8 px-3"
                                            >
                                                Details
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={7} className="py-12 text-center text-gray-400 text-sm font-medium font-sans">
                                        No recent transactions found.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>

            {/* Transaction Detail Overlay Modal */}
            <TransactionDetailModal
                transaction={selectedTx}
                onClose={() => setSelectedTx(null)}
            />
        </div>
    );
};

export default Dashboard;