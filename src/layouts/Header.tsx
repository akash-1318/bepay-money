import React, { useMemo } from 'react';
import { Menu, X } from 'lucide-react';
import { NAVIGATION_ITEMS } from './constants';

const NotificationIcon = () => (
    <svg width="30" height="33" viewBox="0 0 30 33" fill="none" aria-hidden="true">
        <path d="M24.5194 17.858C23.5301 17.2044 23.2176 15.1803 23.2176 12.5008C23.2176 7.57048 19.2203 3.57227 14.2891 3.57227C9.35781 3.57227 5.36049 7.57048 5.36049 12.5008C5.36049 15.1803 5.04888 17.2044 4.05871 17.858C2.3096 19.0124 1.78906 20.3142 1.78906 21.4294C1.78906 23.216 3.09085 26.7866 14.2891 26.7866C25.4864 26.7866 26.7891 23.216 26.7891 21.4294C26.7891 20.3142 26.2676 19.0124 24.5194 17.858ZM9.14174 28.2589C9.78192 30.5008 11.8417 32.1437 14.2891 32.1437C16.7364 32.1437 18.7962 30.5008 19.4373 28.2589C17.9623 28.4589 16.2596 28.5723 14.2891 28.5723C12.3185 28.5723 10.6158 28.4589 9.14174 28.2589Z" fill="white" />
        <circle cx="22.8604" cy="6.42829" r="5.35714" fill="#FFCD38" stroke="#212121" strokeWidth="2.14286" />
    </svg>
);

const WithdrawIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <ellipse cx="12" cy="15.5" rx="2" ry="3.5" fill="#CECECE" />
        <path d="M22.4351 20.2596V11.3182C22.4351 10.083 21.4302 9.07812 20.1949 9.07812H3.80261C2.56738 9.07812 1.5625 10.083 1.5625 11.3182V20.2596C1.5625 21.4949 2.56738 22.4998 3.80261 22.4998H20.1949C21.4302 22.4998 22.4351 21.4949 22.4351 20.2596ZM20.9351 20.2596C20.9351 20.6676 20.6029 20.9998 20.1949 20.9998H3.80261C3.39465 20.9998 3.0625 20.6676 3.0625 20.2596V11.3182C3.0625 10.9103 3.39465 10.5781 3.80261 10.5781H20.1949C20.6029 10.5781 20.9351 10.9103 20.9351 11.3182V20.2596Z" fill="#3A3A3A" />
        <path d="M11.9987 11.7969C10.2756 11.7969 8.92578 13.551 8.92578 15.79C8.92578 18.0294 10.2756 19.7836 11.9987 19.7836C13.7217 19.7836 15.0715 18.0294 15.0715 15.79C15.0715 13.551 13.7217 11.7969 11.9987 11.7969ZM11.9987 18.2836C11.1461 18.2836 10.4258 17.1417 10.4258 15.79C10.4258 14.4387 11.1461 13.2969 11.9987 13.2969C12.8512 13.2969 13.5715 14.4387 13.5715 15.79C13.5715 17.1417 12.8512 18.2836 11.9987 18.2836Z" fill="#3A3A3A" />
        <path d="M11.9994 8.34302C12.4136 8.34302 12.7494 8.0072 12.7494 7.59302V4.0806L13.5664 4.90869C13.7133 5.05774 13.9066 5.13208 14.1004 5.13208C14.2908 5.13208 14.4809 5.0603 14.627 4.91602C14.9221 4.62524 14.9251 4.15027 14.6343 3.85547L12.5353 1.72792C12.399 1.58807 12.2101 1.5 11.9994 1.5C11.7887 1.5 11.5998 1.58807 11.4635 1.72792L9.36452 3.85547C9.07375 4.15027 9.07668 4.62524 9.37184 4.91602C9.66628 5.20715 10.1413 5.20349 10.4324 4.90869L11.2494 4.0806V7.59302C11.2494 8.0072 11.5852 8.34302 11.9994 8.34302Z" fill="#3A3A3A" />
    </svg>
);

interface HeaderProps {
    onMenuToggle: () => void;
    isSidebarOpen: boolean;
    currentPath: string;
}

export const Header: React.FC<HeaderProps> = ({
    onMenuToggle,
    isSidebarOpen,
    currentPath,
}) => {
    const currentTitle = useMemo(() => {
        return NAVIGATION_ITEMS.find((item) => item.to === currentPath)?.label || 'Dashboard';
    }, [currentPath]);

    return (
        <header className="flex items-center justify-between px-4 md:pl-0 md:pr-8 h-20 shrink-0">
            <div className="flex items-center gap-7">
                <button
                    className="md:hidden text-secondary hover:text-primary focus:outline-none focus:ring-2 focus:ring-white rounded-md cursor-pointer"
                    onClick={onMenuToggle}
                    aria-label={isSidebarOpen ? "Close menu" : "Open menu"}
                    aria-expanded={isSidebarOpen}
                >
                    {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-6 h-6" color="grey" />}
                </button>
                <h1 className="text-secondary md:ml-4.75 font-semibold text-xl m-0">{currentTitle}</h1>

                <form onSubmit={(e) => e.preventDefault()} className="hidden md:block">
                    <label htmlFor="global-search" className="sr-only">Search for anything</label>
                    <input
                        id="global-search"
                        type="search"
                        placeholder="Search for anything"
                        className="outline-none w-fit xl:w-102 rounded-lg bg-transparent border border-grey-light py-2 px-5 text-sm text-neutral-200 placeholder:text-neutral-200 focus:border-white transition-colors"
                    />
                </form>
            </div>

            <div className="hidden lg:flex items-center gap-7">
                <button
                    className="w-fit cursor-pointer hover:opacity-80 transition-opacity"
                    aria-label="View notifications"
                >
                    <NotificationIcon />
                </button>
                <button
                    className="cursor-pointer flex items-center gap-1.5 px-5 py-2.5 bg-secondary text-neutral-800 text-base font-semibold rounded-2xl hover:bg-neutral-200 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white"
                >
                    <WithdrawIcon />
                    <span>Withdraw</span>
                </button>
            </div>
        </header>
    );
};
