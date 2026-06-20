import React from 'react';

interface MetricCardProps {
    title: string;
    value: string | number;
    icon: React.ReactNode;
    color: string;
    subtitle?: string;
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value, icon, color, subtitle }) => {
    return (
        <div className="flex flex-col bg-bg-card rounded-lg p-6 pb-6.5 transition-all duration-200">
            <div className="flex items-start justify-between mb-4">
                <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: color }}
                >
                    {icon}
                </div>
            </div>
            <p className="text-[11px] text-[#525252] font-semibold mb-1 uppercase tracking-widest">{title}</p>
            <p className="text-2xl md:text-[28px] font-extrabold text-black leading-tight tracking-tight">
                {value}
            </p>
            {subtitle && (
                <p className="text-xs text-grey-light mt-2 font-medium">{subtitle}</p>
            )}
        </div>
    );
};

export default MetricCard;