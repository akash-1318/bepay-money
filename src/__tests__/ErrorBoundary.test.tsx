import { describe, it, expect, vi } from 'vitest';
import { render, screen, act } from '@testing-library/preact';
import { ErrorBoundary } from '../components/shared/ErrorBoundary';
import React from 'react';

// Mock lucide-react to prevent Preact-compat rendering SVGs as raw objects in tests
vi.mock('lucide-react', () => ({
    AlertTriangle: () => React.createElement('div', null, 'AlertTriangle'),
    RotateCcw: () => React.createElement('div', null, 'RotateCcw')
}));

describe('ErrorBoundary Component', () => {
    it('renders children normally when no error occurs', () => {
        render(
            <ErrorBoundary>
                <div>Safe Child Component</div>
            </ErrorBoundary>
        );
        expect(screen.getByText('Safe Child Component')).not.toBeNull();
    });

    it('renders fallback view with proper warning details when error state is set', () => {
        const ref = React.createRef<ErrorBoundary>();

        render(
            <ErrorBoundary ref={ref} fallbackMessage="Custom error fallback message">
                <div>Safe Child Component</div>
            </ErrorBoundary>
        );

        // Rerender within act() block to trigger state update and DOM repaint
        act(() => {
            ref.current?.setState({
                hasError: true,
                error: new Error('Test rendering exception')
            });
        });

        expect(screen.getByText('Something went wrong')).not.toBeNull();
        expect(screen.getByText('Custom error fallback message')).not.toBeNull();
        expect(screen.getAllByText(/Test rendering exception/).length).toBeGreaterThan(0);
        expect(screen.getByText('Reload Page')).not.toBeNull();
        expect(screen.getByText('Go to Home')).not.toBeNull();
    });
});
