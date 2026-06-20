import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Header } from './Header';
import { Sidebar } from './Sidebar';

interface RootLayoutProps {
    children: React.ReactNode;
}

const CollapseIcon = ({ isCollapsed }: { isCollapsed: boolean }) => (
    <svg className={`transition-transform duration-300 ${isCollapsed ? "rotate-180" : ""}`} width="7" height="12" viewBox="0 0 7 12" fill="none" aria-hidden="true">
        <path d="M6.29252 1.7125L2.41252 5.59253L6.29252 9.47253C6.68252 9.86253 6.68252 10.4925 6.29252 10.8825C5.90252 11.2725 5.27252 11.2725 4.88252 10.8825L0.2925 6.29253C-0.0975 5.90253 -0.0975 5.27253 0.2925 4.88253L4.88252 0.2925C5.27252 -0.0975 5.90252 -0.0975 6.29252 0.2925C6.67252 0.6825 6.68252 1.3225 6.29252 1.7125Z" fill="#525252" />
    </svg>
);

const RootLayout: React.FC<RootLayoutProps> = ({ children }) => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
    const location = useLocation();

    useEffect(() => {
        setSidebarOpen(false);
    }, [location.pathname]);

    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setSidebarOpen(false);
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, []);

    return (
        <div className="flex h-screen overflow-hidden bg-primary relative font-sans">
            {/* Desktop Sidebar Collapse Toggle */}
            <button
                className={`hidden md:flex absolute top-24 size-9 bg-bg-card z-50 rounded-full justify-center items-center cursor-pointer transition-all duration-300 hover:scale-105 shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-bg-primary focus:ring-white
          ${isSidebarCollapsed ? 'left-24' : 'left-59'}`}
                onClick={() => setIsSidebarCollapsed((prev) => !prev)}
                aria-label={isSidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
                <CollapseIcon isCollapsed={isSidebarCollapsed} />
            </button>

            <Sidebar
                isOpen={sidebarOpen}
                isCollapsed={isSidebarCollapsed}
                onClose={() => setSidebarOpen(false)}
                currentPath={location.pathname}
            />

            {/* Mobile Overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm md:hidden transition-opacity"
                    onClick={() => setSidebarOpen(false)}
                    aria-hidden="true"
                />
            )}

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                <Header
                    onMenuToggle={() => setSidebarOpen((prev) => !prev)}
                    isSidebarOpen={sidebarOpen}
                    currentPath={location.pathname}
                />

                <main className="flex-1 overflow-y-auto pr-0 md:pr-8 pb-8 focus:outline-none" tabIndex={-1}>
                    <div className="w-full bg-primary rounded-lg shadow-sm">
                        <div className="px-7.25 py-12.5 max-w-[1650px] min-h-[88dvh] mx-auto bg-secondary rounded-lg">
                            {children}
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default RootLayout;