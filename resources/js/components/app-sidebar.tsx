import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import { usePage } from '@inertiajs/react';
import { DollarSignIcon, LayoutGrid, ReceiptIcon, Settings2Icon, UserCogIcon, Users } from 'lucide-react';
import AppLogo from './app-logo';

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
        icon: UserCogIcon,
    },
    {
        title: 'Leads',
        href: '/leads',
        icon: DollarSignIcon,
    },
];

const adminNavItems: NavItem[] = [
    {
        title: 'Manage Users',
        href: '/users',
        icon: LayoutGrid,
    },
    {
        title: 'Clients',
        href: '/clients',
        icon: Users,
    },
    {
        title: 'Tasks',
        href: '/tasks',
        icon: ReceiptIcon,
    },
];

const superadminNavItems: NavItem[] = [
    {
        title: 'Manage Application',
        href: '/system',
        icon: Settings2Icon,
    },
];

const footerNavItems: NavItem[] = [
    // {
    //     title: 'Repository',
    //     href: 'https://github.com/laravel/react-starter-kit',
    //     icon: Folder,
    // },
    // {
    //     title: 'Documentation',
    //     href: 'https://laravel.com/docs/starter-kits#react',
    //     icon: BookOpen,
    // },
];

export function AppSidebar() {
    const { auth } = usePage().props;
    const userRole = auth?.user?.role || 'user';

    let roleBasedNavItems = [...mainNavItems];
    switch (userRole) {
        case 'admin':
            roleBasedNavItems = [...mainNavItems, ...adminNavItems];
            break;
        case 'superadmin':
            roleBasedNavItems = [...mainNavItems, ...adminNavItems, ...superadminNavItems];
            break;
        default:
            break;
    }

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/dashboard" prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={roleBasedNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
