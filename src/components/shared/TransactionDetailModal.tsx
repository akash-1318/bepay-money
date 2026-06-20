import React, { useState, useEffect, useRef } from 'react';
import { X, Copy, Check, Calendar, Landmark, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/shared/StatusBadge';
import type { Transaction } from '@/types/api';

interface TransactionDetailModalProps {
    transaction: Transaction | null;
    onClose: () => void;
}

export const TransactionDetailModal: React.FC<TransactionDetailModalProps> = ({
    transaction,
    onClose,
}) => {
    if (!transaction) return null;

    const [copiedId, setCopiedId] = useState<string | null>(null);
    const timerRef = useRef<any>(null);

    const handleCopyId = (e: React.MouseEvent<any>, text: string) => {
        e.stopPropagation();
        navigator.clipboard.writeText(text);
        setCopiedId(text);
        if (timerRef.current) clearTimeout(timerRef.current);
        timerRef.current = setTimeout(() => setCopiedId(null), 2000);
    };

    useEffect(() => {
        return () => {
            if (timerRef.current) clearTimeout(timerRef.current);
        };
    }, []);

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

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            {/* Click outside to close */}
            <div className="absolute inset-0" onClick={onClose} />
            
            {/* Modal Box */}
            <div className="relative w-full max-w-[550px] bg-white border border-inactive rounded-[20px] shadow-2xl p-6 md:p-8 flex flex-col gap-6 z-10 animate-in zoom-in-95 duration-200 font-sans">
                {/* Close button */}
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={onClose}
                    className="absolute right-4 top-4 p-1 hover:bg-gray-100 rounded-full cursor-pointer size-8 flex items-center justify-center border border-gray-100"
                >
                    <X className="w-4 h-4 text-gray-500" />
                </Button>

                {/* Modal Header */}
                <div>
                    <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest block mb-1">
                        Transaction Receipt
                    </span>
                    <div className="flex items-center gap-3.5">
                        <h3 className="text-lg font-bold text-black select-all font-sans">TX #{transaction.id}</h3>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={(e) => handleCopyId(e, transaction.id)}
                            className="p-1 hover:bg-gray-100 rounded cursor-pointer size-6 shrink-0 flex items-center justify-center"
                        >
                            {copiedId === transaction.id ? (
                                <Check className="w-3.5 h-3.5 text-emerald-600" />
                            ) : (
                                <Copy className="w-3.5 h-3.5 text-gray-500" />
                            )}
                        </Button>
                    </div>
                </div>

                {/* Status Display Area */}
                <div className="flex items-center justify-between border-y border-gray-100 py-4">
                    <div>
                        <span className="text-xs text-text-secondary block font-sans">Settled Amount</span>
                        <span className="text-xl font-extrabold text-black font-sans">
                            {transaction.amountReceivedVal} {transaction.amountReceivedUnit}
                        </span>
                    </div>
                    <div>
                        <StatusBadge status={transaction.status} />
                    </div>
                </div>

                {/* Property Details */}
                <div className="flex flex-col gap-4">
                    {/* Original Price */}
                    <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2 text-text-secondary">
                            <Landmark className="w-4 h-4 text-gray-400" />
                            <span>Original Price</span>
                        </div>
                        <span className="font-semibold text-black">{transaction.originalPrice}</span>
                    </div>

                    {/* Network */}
                    <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2 text-text-secondary">
                            <Landmark className="w-4 h-4 text-gray-400" />
                            <span>Network</span>
                        </div>
                        <span className="font-semibold text-black uppercase">{transaction.network}</span>
                    </div>

                    {/* Date & Time */}
                    <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2 text-text-secondary">
                            <Calendar className="w-4 h-4 text-gray-400" />
                            <span>Timestamp</span>
                        </div>
                        <span className="font-semibold text-black">
                            {formatDate(transaction.createdAt)} • {formatTime(transaction.createdAt)}
                        </span>
                    </div>

                    {/* Fees */}
                    <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2 text-text-secondary">
                            <Landmark className="w-4 h-4 text-gray-400" />
                            <span>Wallet Fee Paid</span>
                        </div>
                        <span className="font-semibold text-red-600 font-mono">
                            {transaction.amountSentVal} {transaction.amountSentUnit}
                        </span>
                    </div>

                    {/* Order Reference */}
                    {transaction.externalReference && (
                        <div className="flex items-center justify-between text-sm border-t border-gray-100 pt-4 mt-2">
                            <div className="flex items-center gap-2 text-text-secondary">
                                <Tag className="w-4 h-4 text-gray-400" />
                                <span>Order Reference</span>
                            </div>
                            <span className="font-mono font-bold text-black select-all">
                                {transaction.externalReference}
                            </span>
                        </div>
                    )}
                </div>

                {/* Action buttons */}
                <div className="mt-4 flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                    <Button
                        onClick={onClose}
                        className="h-10 px-5 bg-black hover:bg-neutral-800 text-white cursor-pointer rounded-lg text-sm font-semibold"
                    >
                        Close Receipt
                    </Button>
                </div>
            </div>
        </div>
    );
};
