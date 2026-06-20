import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import { ArrowLeft, Copy, Check, Clock, CheckCircle2, AlertTriangle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { api } from '@/services/api';
import type { PaymentLink, Transaction } from '@/types/api';
import { StatusBadge } from '@/components/shared/StatusBadge';

const PaymentLinkDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    
    const [loading, setLoading] = useState(true);
    const [linkData, setLinkData] = useState<PaymentLink | null>(null);
    const [transaction, setTransaction] = useState<Transaction | null>(null);
    
    const [copied, setCopied] = useState(false);
    const [simulating, setSimulating] = useState(false);
    const timerRef = useRef<any>(null);

    const loadData = async () => {
        if (!id) return;
        setLoading(true);
        try {
            const link = await api.getPaymentLinkById(id);
            if (link) {
                setLinkData(link);
                const tx = await api.getTransactionForPaymentLink(id);
                setTransaction(tx);
            } else {
                setLinkData(null);
            }
        } catch (err) {
            console.error('Failed to load payment link detail', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
        return () => {
            if (timerRef.current) clearTimeout(timerRef.current);
        };
    }, [id]);

    const handleCopy = () => {
        if (!linkData) return;
        navigator.clipboard.writeText(linkData.paymentUrl);
        setCopied(true);
        if (timerRef.current) clearTimeout(timerRef.current);
        timerRef.current = setTimeout(() => setCopied(false), 2000);
    };

    const handleSimulatePayment = async () => {
        if (!id || !linkData || linkData.status !== 'active') return;
        setSimulating(true);
        try {
            const tx = await api.simulatePayment(id);
            if (tx) {
                const updatedLink = await api.getPaymentLinkById(id);
                setLinkData(updatedLink);
                setTransaction(tx);
            }
        } catch (err) {
            console.error('Simulation failed', err);
        } finally {
            setSimulating(false);
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[50vh] gap-3">
                <Loader2 className="w-8 h-8 animate-spin text-black" />
                <p className="text-sm font-medium text-text-secondary font-sans">Loading link details...</p>
            </div>
        );
    }

    if (!linkData) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
                <AlertTriangle className="w-12 h-12 text-amber-500" />
                <h2 className="text-xl font-bold text-black font-sans">Link Not Found</h2>
                <p className="text-sm text-text-secondary max-w-md text-center font-sans">
                    The payment link you are trying to view does not exist or has been deleted.
                </p>
                <Button onClick={() => navigate('/payment-links')} className="bg-black hover:bg-neutral-800 text-white rounded-lg">
                    Back to Payment Links
                </Button>
            </div>
        );
    }

    const isExpired = linkData.status === 'expired' || new Date(linkData.expiresAt) < new Date();
    const isPaid = linkData.status === 'paid';
    const isActive = linkData.status === 'active' && !isExpired;

    return (
        <div className="flex flex-col gap-6 w-full max-w-[1000px] mx-auto">
            {/* Page Header */}
            <div className="flex items-center gap-3">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => navigate('/payment-links')}
                    className="p-2 bg-bg-card hover:bg-border rounded-full size-9 cursor-pointer"
                >
                    <ArrowLeft className="w-4 h-4 text-black" />
                </Button>
                <h1 className="text-[22px] font-bold text-black font-sans">Payment Link Details</h1>
            </div>

            {/* Split Details Container */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Main Details */}
                <div className="lg:col-span-2 flex flex-col gap-6">
                    {isPaid && (
                        <div className="flex items-center gap-3 p-4 bg-success-bg border border-success-border rounded-[15px] text-success-icon">
                            <CheckCircle2 className="w-5 h-5 shrink-0" />
                            <div className="text-sm font-semibold font-sans">
                                This payment link has been successfully paid and completed.
                            </div>
                        </div>
                    )}
                    {isExpired && (
                        <div className="flex items-center gap-3 p-4 bg-danger-bg border border-danger-border rounded-[15px] text-danger-icon">
                            <AlertTriangle className="w-5 h-5 shrink-0" />
                            <div className="text-sm font-semibold font-sans">
                                This payment link has expired and is no longer accepting payments.
                            </div>
                        </div>
                    )}
                    {isActive && (
                        <div className="flex items-center gap-3 p-4 bg-blue-50 border border-blue-100 rounded-[15px] text-[#1486ff]">
                            <Clock className="w-5 h-5 shrink-0 animate-pulse" />
                            <div className="text-sm font-semibold font-sans">
                                Active and awaiting payment. Expiring on {new Date(linkData.expiresAt).toLocaleDateString()} at {new Date(linkData.expiresAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}.
                            </div>
                        </div>
                    )}

                    <div className="bg-white border border-inactive rounded-[20px] p-6 md:p-8 flex flex-col gap-6">
                        <div className="border-b border-gray-100 pb-5">
                            <span className="text-xs font-semibold text-text-muted uppercase tracking-wider block mb-1">
                                PAYMENT LINK FOR
                            </span>
                            <h2 className="text-2xl font-bold text-black mb-3 font-sans">{linkData.title}</h2>
                            <div className="text-[32px] font-extrabold text-black tracking-tight font-sans">
                                {parseFloat(linkData.amount).toLocaleString(undefined, { minimumFractionDigits: 2 })} <span className="text-xl text-text-secondary font-semibold">{linkData.currency}</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-5 gap-x-10">
                            <div>
                                <span className="text-xs font-semibold text-text-muted uppercase tracking-wider block mb-1">
                                    Status
                                </span>
                                <div>
                                    <StatusBadge status={linkData.status} />
                                </div>
                            </div>

                            <div>
                                <span className="text-xs font-semibold text-text-muted uppercase tracking-wider block mb-1">
                                    Blockchain Network
                                </span>
                                <div className="text-sm font-semibold text-black uppercase font-sans">
                                    {linkData.network}
                                </div>
                            </div>

                            <div>
                                <span className="text-xs font-semibold text-text-muted uppercase tracking-wider block mb-1">
                                    Created Date
                                </span>
                                <div className="text-sm font-medium text-black font-sans">
                                    {new Date(linkData.createdAt).toLocaleDateString(undefined, {
                                        year: 'numeric',
                                        month: 'short',
                                        day: 'numeric'
                                    })} at {new Date(linkData.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </div>
                            </div>

                            <div>
                                <span className="text-xs font-semibold text-text-muted uppercase tracking-wider block mb-1">
                                    Expiry Date
                                </span>
                                <div className="text-sm font-medium text-black font-sans">
                                    {new Date(linkData.expiresAt).toLocaleDateString(undefined, {
                                        year: 'numeric',
                                        month: 'short',
                                        day: 'numeric'
                                    })} at {new Date(linkData.expiresAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </div>
                            </div>

                            {linkData.externalReference && (
                                <div className="md:col-span-2">
                                    <span className="text-xs font-semibold text-text-muted uppercase tracking-wider block mb-1">
                                        External Reference / Order ID
                                    </span>
                                    <div className="text-sm font-mono font-medium text-black">
                                        {linkData.externalReference}
                                    </div>
                                </div>
                            )}

                            {linkData.description && (
                                <div className="md:col-span-2">
                                    <span className="text-xs font-semibold text-text-muted uppercase tracking-wider block mb-1">
                                        Description
                                    </span>
                                    <p className="text-sm text-text-secondary leading-relaxed font-sans">
                                        {linkData.description}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Sidebar */}
                <div className="flex flex-col gap-6">
                    <div className="bg-white border border-inactive rounded-[20px] p-6 flex flex-col items-center justify-center text-center shadow-sm">
                        <span className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-4 block">
                            SCAN QR TO PAY
                        </span>
                        
                        <div className="p-3 bg-gray-50 border border-gray-100 rounded-xl mb-4">
                            <QRCodeSVG value={linkData.paymentUrl} size={150} />
                        </div>

                        <div className="w-full mt-2">
                            <span className="text-xs font-semibold text-text-muted uppercase tracking-wider block mb-1.5 text-left">
                                Payment Link URL
                            </span>
                            <div className="flex items-center gap-1.5 w-full">
                                <div className="flex-1 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-xs text-text-secondary truncate font-mono text-left select-all">
                                    {linkData.paymentUrl}
                                </div>
                                <Button
                                    onClick={handleCopy}
                                    size="icon"
                                    className="p-2 border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 rounded-lg cursor-pointer shrink-0 size-9 flex items-center justify-center"
                                >
                                    {copied ? (
                                        <Check className="w-4 h-4 text-emerald-600" />
                                    ) : (
                                        <Copy className="w-4 h-4" />
                                    )}
                                </Button>
                            </div>
                        </div>
                    </div>

                    {isActive && (
                        <div className="bg-neutral-50 border border-neutral-200 rounded-[20px] p-6 flex flex-col gap-3 shadow-sm">
                            <div className="flex items-center gap-2">
                                <span className="size-2 rounded-full bg-blue-500 animate-ping" />
                                <span className="text-xs font-bold text-neutral-500 uppercase tracking-widest font-sans">
                                    Developer Tool
                                </span>
                            </div>
                            <h3 className="text-sm font-bold text-black font-sans">Simulate Customer Payment</h3>
                            <p className="text-xs text-neutral-500 leading-normal mb-1 font-sans">
                                Simulate the customer scanning this QR code, signing with their crypto wallet, and confirming the payment on-chain.
                            </p>
                            <Button
                                onClick={handleSimulatePayment}
                                className="w-full h-11 bg-[#1486ff] hover:bg-[#0077ef] text-white cursor-pointer rounded-lg text-sm font-semibold flex items-center justify-center"
                                disabled={simulating}
                            >
                                {simulating ? (
                                    <>
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                        Processing Payment...
                                    </>
                                ) : (
                                    <>
                                        <CheckCircle2 className="w-4 h-4 mr-2" />
                                        Simulate Confirm Payment
                                    </>
                                )}
                            </Button>
                        </div>
                    )}
                </div>
            </div>

            {/* Receipt once paid */}
            {isPaid && transaction && (
                <div className="bg-white border border-inactive rounded-[20px] p-6 md:p-8 flex flex-col gap-5 mt-2 shadow-sm animate-in fade-in slide-in-from-bottom-2 duration-300 font-sans">
                    <div className="border-b border-gray-100 pb-3 flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                        <div>
                            <h3 className="text-base font-bold text-black font-sans">Associated Payment Transaction</h3>
                            <p className="text-xs text-text-secondary mt-0.5 font-sans">Receipt details recorded in the ledger</p>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-semibold bg-emerald-50 border border-emerald-100 px-2.5 py-1 rounded-full uppercase">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Confirmed On-Chain
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                        <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                            <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider block mb-1">
                                Transaction ID / Ref
                            </span>
                            <div className="text-xs font-mono font-bold text-black select-all flex items-center justify-between">
                                <span>{transaction.id}</span>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="p-1 rounded hover:bg-gray-200 cursor-pointer size-6 min-h-0"
                                    onClick={() => {
                                        navigator.clipboard.writeText(transaction.id);
                                    }}
                                >
                                    <Copy className="w-3 h-3 text-gray-500" />
                                </Button>
                            </div>
                        </div>

                        <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                            <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider block mb-1">
                                Amount Settled
                            </span>
                            <div className="text-sm font-bold text-black font-sans">
                                {transaction.amountReceivedVal} {transaction.amountReceivedUnit}
                            </div>
                        </div>

                        <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                            <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider block mb-1">
                                Network Gas Fees Paid
                            </span>
                            <div className="text-sm font-semibold text-black font-sans">
                                {transaction.amountSentVal} {transaction.amountSentUnit}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PaymentLinkDetail;
