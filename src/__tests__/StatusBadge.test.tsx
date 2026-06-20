import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/preact';
import { StatusBadge } from '../components/shared/StatusBadge';

describe('StatusBadge Component', () => {
    it('renders "Confirmed" state badge with correct text', () => {
        render(<StatusBadge status="CONFIRMED" />);
        const badge = screen.getByText('Confirmed');
        expect(badge).not.toBeNull();
    });

    it('renders "Pending" state badge with correct text', () => {
        render(<StatusBadge status="PENDING" />);
        const badge = screen.getByText('Pending');
        expect(badge).not.toBeNull();
    });

    it('renders "Failed" state badge with correct text', () => {
        render(<StatusBadge status="FAILED" />);
        const badge = screen.getByText('Failed');
        expect(badge).not.toBeNull();
    });

    it('renders "Expired" state badge with correct text', () => {
        render(<StatusBadge status="EXPIRED" />);
        const badge = screen.getByText('Expired');
        expect(badge).not.toBeNull();
    });

    it('renders "Active" state badge for payment links', () => {
        render(<StatusBadge status="active" />);
        const badge = screen.getByText('Active');
        expect(badge).not.toBeNull();
    });

    it('renders "Paid" state badge for payment links', () => {
        render(<StatusBadge status="paid" />);
        const badge = screen.getByText('Paid');
        expect(badge).not.toBeNull();
    });
});
