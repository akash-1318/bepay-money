import React from 'react';

interface StatusBadgeProps {
    status: 'CONFIRMED' | 'PENDING' | 'FAILED' | 'EXPIRED' | 'active' | 'paid' | 'expired';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
    const norm = status.toUpperCase();

    if (norm === 'CONFIRMED' || norm === 'PAID') {
        return (
            <span className="inline-block px-3 text-center bg-badge-confirmed text-white text-xs font-semibold py-1 rounded-full uppercase select-none font-sans">
                {norm === 'CONFIRMED' ? 'Confirmed' : 'Paid'}
            </span>
        );
    }
    
    if (norm === 'PENDING' || norm === 'ACTIVE') {
        return (
            <span className="inline-block px-3 text-center bg-badge-pending text-white text-xs font-semibold py-1 rounded-full uppercase select-none font-sans">
                {norm === 'PENDING' ? 'Pending' : 'Active'}
            </span>
        );
    }
    
    if (norm === 'FAILED') {
        return (
            <span className="inline-block px-3 text-center bg-badge-failed text-white text-xs font-semibold py-1 rounded-full uppercase select-none font-sans">
                Failed
            </span>
        );
    }
    
    if (norm === 'EXPIRED') {
        return (
            <span className="inline-block px-3 text-center bg-badge-expired text-white text-xs font-semibold py-1 rounded-full uppercase select-none font-sans">
                Expired
            </span>
        );
    }

    return (
        <span className="inline-block px-3 text-center bg-gray-500 text-white text-xs font-semibold py-1 rounded-full uppercase select-none font-sans">
            {status}
        </span>
    );
};
