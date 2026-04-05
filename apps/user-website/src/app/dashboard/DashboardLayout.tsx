import React from 'react';
import { NavLink, Outlet, useNavigate, Link, useLocation } from 'react-router-dom';
import {
    Calendar,
    Heart,
    CreditCard,
    Users,
    Mail,
    HelpCircle,
    LayoutDashboard,
    Settings,
} from 'lucide-react';
import { DashboardLayout, NavItem } from '@airion/ui';
import { useAuth } from '@airion/shared/auth';

const UserDashboardLayout: React.FC = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const navItems: NavItem[] = [
        { icon: LayoutDashboard, label: 'Overview', path: '/dashboard' },
        { icon: Calendar, label: 'My Bookings', path: '/dashboard/bookings' },
        { icon: Heart, label: 'Saved Vendors', path: '/dashboard/saved' },
        { icon: Mail, label: 'Inbox', path: '/dashboard/inbox' },
        { icon: CreditCard, label: 'Budget Planner', path: '/dashboard/budget' },
        { icon: Users, label: 'Guest List', path: '/dashboard/guests' },
        { icon: Settings, label: 'Settings', path: '/dashboard/settings' },
        { icon: HelpCircle, label: 'Support', path: '/dashboard/support' },
    ];

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    return (
        <DashboardLayout
            navItems={navItems}
            user={{
                name: user?.name || 'User',
                role: 'Client',
                avatar: user?.avatar
            }}
            currentPath={location.pathname}
            LinkComponent={Link}
            onLogout={handleLogout}
        >
            <Outlet />
        </DashboardLayout>
    );
};

export default UserDashboardLayout;
