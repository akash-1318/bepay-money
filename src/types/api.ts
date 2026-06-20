export interface PaymentLink {
    id: string;
    title: string;
    amount: string;
    currency: string;
    network: string;
    description?: string;
    status: 'active' | 'paid' | 'expired';
    paymentUrl: string;
    externalReference?: string;
    expiresAt: string;
    createdAt: string;
}

export interface Transaction {
    id: string;
    paymentLinkId?: string;
    originalPrice: string;
    amountReceivedVal: string;
    amountReceivedUnit: string;
    amountSentVal: string;
    amountSentUnit: string;
    status: 'CONFIRMED' | 'PENDING' | 'FAILED' | 'EXPIRED';
    network: string;
    externalReference?: string;
    createdAt: string;
}

export interface DashboardSummary {
    totalReceived: number;
    successfulCount: number;
    pendingCount: number;
    failedExpiredCount: number;
}
