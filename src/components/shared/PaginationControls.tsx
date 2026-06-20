import React from 'react';
import { Button } from '@/components/ui/button';

interface PaginationControlsProps {
    currentPage: number;
    totalCount: number;
    pageSize: number;
    totalPages: number;
    loading: boolean;
    onPageChange: (page: number) => void;
    typeLabel?: string;
}

export const PaginationControls: React.FC<PaginationControlsProps> = ({
    currentPage,
    totalCount,
    pageSize,
    totalPages,
    loading,
    onPageChange,
    typeLabel = 'entries',
}) => {
    if (totalPages <= 1) return null;

    const startRange = totalCount === 0 ? 0 : (currentPage - 1) * pageSize + 1;
    const endRange = Math.min(currentPage * pageSize, totalCount);

    return (
        <div className="flex items-center justify-between w-full mt-2 animate-in fade-in duration-200">
            <span className="text-sm font-medium text-text-secondary font-sans">
                Showing {startRange} to {endRange} of {totalCount} {typeLabel}
            </span>
            <div className="flex items-center gap-1.5">
                {/* Previous Button */}
                <Button
                    variant="outline"
                    onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
                    disabled={currentPage === 1 || loading}
                    className="h-9 px-3 border border-gray-200 hover:bg-gray-50 text-xs font-semibold rounded-lg cursor-pointer disabled:opacity-50"
                >
                    Previous
                </Button>

                {/* Numbered Page Buttons */}
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                    <Button
                        key={pageNum}
                        variant={currentPage === pageNum ? "default" : "outline"}
                        onClick={() => onPageChange(pageNum)}
                        className={`h-9 w-9 p-0 text-xs font-semibold rounded-lg cursor-pointer ${
                            currentPage === pageNum
                                ? 'bg-black text-white hover:bg-neutral-800'
                                : 'border-gray-200 hover:bg-gray-50 text-gray-700'
                        }`}
                        disabled={loading}
                    >
                        {pageNum}
                    </Button>
                ))}

                {/* Next Button */}
                <Button
                    variant="outline"
                    onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
                    disabled={currentPage === totalPages || loading}
                    className="h-9 px-3 border border-gray-200 hover:bg-gray-50 text-xs font-semibold rounded-lg cursor-pointer disabled:opacity-50"
                >
                    Next
                </Button>
            </div>
        </div>
    );
};
