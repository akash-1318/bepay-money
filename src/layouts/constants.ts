import {
    HomeIcon,
    HomeIconFilled,
    WalletIcon,
    WalletIconFilled,
    DollarWalletIcon,
    DollarWalletIconFilled,
} from "../assets";

export interface NavItem {
    to: string;
    iconPath: string;
    activeIconPath: string;
    label: string;
}

export interface UserProfile {
    name: string;
    location: string;
}

export const NAVIGATION_ITEMS: NavItem[] = [
    { to: '/', iconPath: HomeIcon, activeIconPath: HomeIconFilled, label: 'Dashboard' },
    { to: '/payments', iconPath: WalletIcon, activeIconPath: WalletIconFilled, label: 'Payment History' },
    { to: '/payment-links', iconPath: DollarWalletIcon, activeIconPath: DollarWalletIconFilled, label: 'Payment Links' },
];

export const MOCK_USER: UserProfile = {
    name: 'Nehal Sharma',
    location: 'New Delhi, India',
};
