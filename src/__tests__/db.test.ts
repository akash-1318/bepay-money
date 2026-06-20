import { describe, it, expect, beforeEach } from 'vitest';
import { db } from '../mocks/db';

describe('db (LocalStorage Database)', () => {
    beforeEach(() => {
        localStorage.clear();
    });

    it('should initialize and fetch transactions', () => {
        const txs = db.getTransactions();
        expect(txs.length).toBeGreaterThan(0);
        expect(txs[0].id).toBe('5193732681');
    });

    it('should save and retrieve transactions', () => {
        const initialTxs = db.getTransactions();
        const customTx = {
            id: 'test_tx_123',
            originalPrice: '10.00 USD',
            amountReceivedVal: '10.00',
            amountReceivedUnit: 'USDC',
            amountSentVal: '0.001',
            amountSentUnit: 'ETH',
            status: 'CONFIRMED' as const,
            network: 'base',
            createdAt: new Date().toISOString()
        };

        db.saveTransactions([...initialTxs, customTx]);
        const retrieved = db.getTransactions();
        expect(retrieved.length).toBe(initialTxs.length + 1);
        expect(retrieved.some(t => t.id === 'test_tx_123')).toBe(true);
    });

    it('should initialize and fetch payment links', () => {
        const links = db.getPaymentLinks();
        expect(links.length).toBeGreaterThan(0);
        expect(links[0].id).toBe('pl_1028');
    });

    it('should save and retrieve payment links', () => {
        const initialLinks = db.getPaymentLinks();
        const customLink = {
            id: 'pl_test',
            title: 'Test Link',
            amount: '50.00',
            currency: 'USDC',
            network: 'polygon',
            status: 'active' as const,
            paymentUrl: 'https://pay.bepay.money/pl_test',
            expiresAt: new Date().toISOString(),
            createdAt: new Date().toISOString()
        };

        db.savePaymentLinks([...initialLinks, customLink]);
        const retrieved = db.getPaymentLinks();
        expect(retrieved.length).toBe(initialLinks.length + 1);
        expect(retrieved.some(l => l.id === 'pl_test')).toBe(true);
    });
});
