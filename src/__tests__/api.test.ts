import { describe, it, expect, beforeEach } from 'vitest';
import { api } from '../services/api';
import { db } from '../mocks/db';

describe('api (Asynchronous Services)', () => {
    beforeEach(() => {
        localStorage.clear();
    });

    it('should retrieve dashboard metrics', async () => {
        const summary = await api.getDashboardSummary('all');
        expect(summary).toHaveProperty('totalReceived');
        expect(summary).toHaveProperty('successfulCount');
        expect(summary.successfulCount).toBeGreaterThan(0);
    });

    it('should retrieve paginated transactions', async () => {
        const result = await api.getTransactions({ page: 1, limit: 5 });
        expect(result.items.length).toBe(5);
        expect(result.total).toBeGreaterThanOrEqual(5);
    });

    it('should filter transactions by status', async () => {
        const result = await api.getTransactions({ status: 'PENDING' });
        result.items.forEach(tx => {
            expect(tx.status).toBe('PENDING');
        });
    });

    it('should search transactions by query string', async () => {
        const result = await api.getTransactions({ search: '5193732681' });
        expect(result.items.length).toBe(1);
        expect(result.items[0].id).toBe('5193732681');
    });

    it('should create a payment link successfully', async () => {
        const initialLinks = db.getPaymentLinks().length;
        const newLink = await api.createPaymentLink({
            title: 'Audit Retainer',
            amount: '1000.00',
            currency: 'USDC',
            network: 'polygon',
            description: 'Retainer fee',
            expiresAt: new Date().toISOString()
        });

        expect(newLink.id).toBe(`pl_${1024 + initialLinks}`);
        expect(newLink.status).toBe('active');
        expect(db.getPaymentLinks().length).toBe(initialLinks + 1);
    });

    it('should simulate wallet payments correctly', async () => {
        const activeLink = await api.createPaymentLink({
            title: 'Simulator Test',
            amount: '100.00',
            currency: 'USDC',
            network: 'base',
            expiresAt: new Date(Date.now() + 100000).toISOString()
        });

        const tx = await api.simulatePayment(activeLink.id);
        expect(tx).not.toBeNull();
        expect(tx!.paymentLinkId).toBe(activeLink.id);
        expect(tx!.status).toBe('CONFIRMED');

        const updatedLink = await api.getPaymentLinkById(activeLink.id);
        expect(updatedLink!.status).toBe('paid');
    });
});
