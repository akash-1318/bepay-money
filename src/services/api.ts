import type { PaymentLink, Transaction, DashboardSummary } from '@/types/api';
import { db } from '@/mocks/db';

const delay = (ms = 300) => new Promise(resolve => setTimeout(resolve, ms));

export const api = {
    // 1. GET /api/dashboard/summary
    getDashboardSummary: async (timeframe: 'all' | '24h' | '7d' | '30d' = 'all'): Promise<DashboardSummary> => {
        await delay();
        const transactions = db.getTransactions();
        
        const now = new Date();
        const filtered = transactions.filter(tx => {
            if (timeframe === 'all') return true;
            const txDate = new Date(tx.createdAt);
            const diffTime = Math.abs(now.getTime() - txDate.getTime());
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            
            if (timeframe === '24h') return diffTime <= 1000 * 60 * 60 * 24;
            if (timeframe === '7d') return diffDays <= 7;
            if (timeframe === '30d') return diffDays <= 30;
            return true;
        });

        let totalReceived = 0;
        let successfulCount = 0;
        let pendingCount = 0;
        let failedExpiredCount = 0;

        filtered.forEach(tx => {
            const price = parseFloat(tx.originalPrice.split(' ')[0]) || 0;
            if (tx.status === 'CONFIRMED') {
                totalReceived += price;
                successfulCount++;
            } else if (tx.status === 'PENDING') {
                pendingCount++;
            } else if (tx.status === 'FAILED' || tx.status === 'EXPIRED') {
                failedExpiredCount++;
            }
        });

        return {
            totalReceived: Math.round(totalReceived * 100) / 100,
            successfulCount,
            pendingCount,
            failedExpiredCount
        };
    },

    // 2. GET /api/transactions
    getTransactions: async (params: {
        status?: string;
        search?: string;
        page?: number;
        limit?: number;
    } = {}): Promise<{ items: Transaction[]; total: number; page: number; limit: number }> => {
        await delay();
        const { status = 'ALL', search = '', page = 1, limit = 10 } = params;
        let transactions = db.getTransactions();

        if (status !== 'ALL') {
            transactions = transactions.filter(tx => tx.status === status.toUpperCase());
        }

        if (search.trim() !== '') {
            const query = search.toLowerCase().trim();
            transactions = transactions.filter(tx => 
                tx.id.toLowerCase().includes(query) ||
                (tx.externalReference && tx.externalReference.toLowerCase().includes(query)) ||
                tx.originalPrice.toLowerCase().includes(query) ||
                tx.amountReceivedVal.toLowerCase().includes(query) ||
                tx.amountReceivedUnit.toLowerCase().includes(query)
            );
        }

        transactions.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

        const total = transactions.length;
        const startIndex = (page - 1) * limit;
        const items = transactions.slice(startIndex, startIndex + limit);

        return {
            items,
            total,
            page,
            limit
        };
    },

    // 3. GET /api/transactions/:id
    getTransactionById: async (id: string): Promise<Transaction | null> => {
        await delay();
        const transactions = db.getTransactions();
        return transactions.find(tx => tx.id === id) || null;
    },

    // 4. GET /api/payment-links
    getPaymentLinks: async (params: {
        status?: string;
        search?: string;
        page?: number;
        limit?: number;
    } = {}): Promise<{ items: PaymentLink[]; total: number; page: number; limit: number }> => {
        await delay();
        const { status = 'ALL', search = '', page = 1, limit = 10 } = params;
        let links = db.getPaymentLinks();

        const now = new Date();
        let changed = false;
        links = links.map(link => {
            if (link.status === 'active' && new Date(link.expiresAt) < now) {
                changed = true;
                return { ...link, status: 'expired' };
            }
            return link;
        });
        if (changed) {
            db.savePaymentLinks(links);
        }

        if (status !== 'ALL') {
            links = links.filter(link => link.status === status.toLowerCase());
        }

        if (search.trim() !== '') {
            const query = search.toLowerCase().trim();
            links = links.filter(link => 
                link.id.toLowerCase().includes(query) ||
                link.title.toLowerCase().includes(query) ||
                (link.externalReference && link.externalReference.toLowerCase().includes(query)) ||
                link.amount.toLowerCase().includes(query)
            );
        }

        links.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

        const total = links.length;
        const startIndex = (page - 1) * limit;
        const items = links.slice(startIndex, startIndex + limit);

        return {
            items,
            total,
            page,
            limit
        };
    },

    // 5. POST /api/payment-links
    createPaymentLink: async (data: Omit<PaymentLink, 'id' | 'status' | 'paymentUrl' | 'createdAt'>): Promise<PaymentLink> => {
        await delay();
        const links = db.getPaymentLinks();
        
        const newId = `pl_${1024 + links.length}`;
        const newLink: PaymentLink = {
            ...data,
            id: newId,
            status: 'active',
            paymentUrl: `https://pay.bepay.money/${newId}`,
            createdAt: new Date().toISOString()
        };

        links.unshift(newLink);
        db.savePaymentLinks(links);
        return newLink;
    },

    // 6. GET /api/payment-links/:id
    getPaymentLinkById: async (id: string): Promise<PaymentLink | null> => {
        await delay();
        const links = db.getPaymentLinks();
        
        const now = new Date();
        const link = links.find(l => l.id === id);
        if (link && link.status === 'active' && new Date(link.expiresAt) < now) {
            link.status = 'expired';
            db.savePaymentLinks(links);
        }
        
        return link || null;
    },

    // 7. GET /api/payment-links/:id/transactions
    getTransactionForPaymentLink: async (paymentLinkId: string): Promise<Transaction | null> => {
        await delay();
        const transactions = db.getTransactions();
        return transactions.find(tx => tx.paymentLinkId === paymentLinkId) || null;
    },

    // Simulator: simulate a payment on an active payment link
    simulatePayment: async (linkId: string): Promise<Transaction | null> => {
        await delay(500);
        const links = db.getPaymentLinks();
        const linkIndex = links.findIndex(l => l.id === linkId);
        
        if (linkIndex === -1 || links[linkIndex].status !== 'active') {
            return null;
        }

        links[linkIndex].status = 'paid';
        db.savePaymentLinks(links);

        const transactions = db.getTransactions();
        const txId = (5193732672 + transactions.length).toString();
        
        let coinAmount = '0.00';
        let coinUnit = links[linkIndex].currency;
        const usdAmount = parseFloat(links[linkIndex].amount) || 0;
        
        if (coinUnit === 'USDC' || coinUnit === 'USDT') {
            coinAmount = (usdAmount * 0.997292).toFixed(6);
        } else if (coinUnit === 'ETH') {
            coinAmount = (usdAmount / 3000).toFixed(9);
        } else {
            coinAmount = usdAmount.toFixed(6);
        }

        const newTx: Transaction = {
            id: txId,
            paymentLinkId: linkId,
            originalPrice: `${usdAmount.toFixed(2)} USD`,
            amountReceivedVal: coinAmount,
            amountReceivedUnit: coinUnit,
            amountSentVal: (parseFloat(coinAmount) * 0.05).toFixed(9),
            amountSentUnit: 'ETH',
            status: 'CONFIRMED',
            network: links[linkIndex].network,
            externalReference: links[linkIndex].externalReference,
            createdAt: new Date().toISOString()
        };

        transactions.unshift(newTx);
        db.saveTransactions(transactions);

        return newTx;
    }
};
