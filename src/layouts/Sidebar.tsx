import React from 'react';
import { NavLink } from 'react-router-dom';
import { Logo, User } from "../assets";
import { NAVIGATION_ITEMS, MOCK_USER } from './constants';

interface SidebarProps {
    isOpen: boolean;
    isCollapsed: boolean;
    onClose: () => void;
    currentPath: string;
}

export const Sidebar: React.FC<SidebarProps> = ({
    isOpen,
    isCollapsed,
    onClose,
    currentPath,
}) => {
    return (
        <aside
            className={`fixed h-full left-0 z-40 flex flex-col transition-all duration-300 bg-primary 
        ${isCollapsed ? 'w-26.5' : 'w-63.25'} 
        ${isOpen ? 'translate-x-0' : '-translate-x-full'} 
        md:translate-x-0 md:static md:z-auto`}
            aria-label="Main Navigation"
        >
            <div className="flex items-center mt-4.25 ml-5.75">
                <img src={Logo} alt="Company Logo" className="size-18" />
            </div>

            {/* Navigation Links */}
            <nav className="flex-1 mt-28.25 pl-1.5 pr-4.5 overflow-y-auto">
                <ul className="list-none p-0 m-0">
                    {NAVIGATION_ITEMS.map(({ to, iconPath, activeIconPath, label }) => {
                        const isActive = currentPath === to;
                        return (
                            <li key={to} className="mb-2.5 py-2.5 px-5">
                                <NavLink
                                    to={to}
                                    end={to === '/'}
                                    onClick={onClose}
                                    className={`flex items-center gap-3 rounded-lg text-lg transition-all duration-150 outline-none focus-visible:ring-2 focus-visible:ring-white
                    ${isActive ? 'text-secondary' : 'text-inactive hover:text-secondary'}
                    ${isCollapsed ? 'justify-center' : 'justify-start'}
                  `}
                                    aria-current={isActive ? "page" : undefined}
                                >
                                    <img
                                        src={isActive ? activeIconPath : iconPath}
                                        alt=""
                                        aria-hidden="true"
                                        className="h-6 w-6"
                                    />
                                    {!isCollapsed && <span className="truncate">{label === "Dashboard" ? "Home" : label}</span>}
                                </NavLink>
                            </li>
                        );
                    })}
                </ul>
            </nav>

            {/* User Profile */}
            <div className="mb-10">
                <button
                    className={`flex items-center gap-3.5 w-full pl-7 rounded-lg transition-colors outline-none focus-visible:ring-2 focus-visible:ring-white cursor-pointer
            ${isCollapsed ? 'justify-center' : 'justify-start'}`}
                    aria-label="User profile settings"
                >
                    <img src={User} alt="user" className="size-11.5" />

                    <div className={`flex-1 text-left min-w-0 ${isCollapsed ? 'opacity-0' : ''}`}>
                        <p className="text-xl font-semibold text-secondary truncate">{MOCK_USER.name}</p>
                        <p className="text-sm text-gray-400 truncate">{MOCK_USER.location}</p>
                    </div>
                </button>
            </div>
        </aside>
    );
};
