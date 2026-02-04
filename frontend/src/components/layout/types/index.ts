import { LucideIcon } from "lucide-react";
import { LeaveRequest } from "@/components/admin";
import { Notification } from "@/components/common/hooks/useNotifications";
import { User } from "@/lib/types";
import { DocumentData } from "firebase/firestore";

export interface NavigationItemProps {
  id: string;
  label: string;
  icon: LucideIcon;
  badge?: number;
  isActive: boolean;
  onClick: (id: string) => void;
}

export interface NotificationBellProps {
  pendingCount: number;
  showNotifications: boolean;
  onToggleNotifications: () => void;
  pendingRequests: LeaveRequest[];
  onViewRequest: (request: LeaveRequest) => void;
}


export interface AdminSidebarProps {
    activeTab: string;
    onTabChange: (tab: string) => void;
    pendingCount: number;
    isOpen: boolean;
    onClose: () => void;
  }
  export interface AdminTopBarProps {
    user: User;
    onLogout: () => void;
    showNotifications: boolean;
    onToggleNotifications: () => void;
    pendingRequests: LeaveRequest[];
    onViewRequest: (request: LeaveRequest) => void;
    searchQuery: string;
    onSearchChange: (query: string) => void;
    onMenuClick: () => void;
  }
 

export interface NotificationDropdownProps {
  notifications: Notification[];
  unreadCount: number;
  isOpen: boolean;
  onToggle: () => void;
  onMarkAsRead: (id: string) => void;
}


export interface NavigationItem {
  label: string;
  href: string;
  onClick?: () => void;
}

export interface NavigationMenuProps {
  navigationItems: NavigationItem[];
  isMenuOpen: boolean;
  onToggleMenu: () => void;
}

export interface AdminNavigationMenuProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  pendingCount: number;
}

export interface NavbarProps {
  user?: DocumentData | null;
  title?: string;
  onUserClick?: () => void;
  showNavigation?: boolean;
  navigationItems?: Array<{
    label: string;
    href: string;
    onClick?: () => void;
  }>;
}

