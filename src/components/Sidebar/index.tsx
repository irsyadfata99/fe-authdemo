// components/Sidebar/index.tsx - Role-Based Sidebar Navigation
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { authUtils } from "../../lib/api";

interface SidebarProps {
  currentUser: {
    id: number;
    username: string;
    email: string;
    roles: string[];
  };
}

interface MenuItem {
  id: string;
  label: string;
  icon: string;
  path: string;
  roles: string[];
  children?: MenuItem[];
}

export default function Sidebar({ currentUser }: SidebarProps) {
  const [activeItem, setActiveItem] = useState("dashboard");
  const [openMenus, setOpenMenus] = useState<string[]>([]);
  const router = useRouter();

  const handleLogout = () => {
    authUtils.removeUser();
    router.push("/");
  };

  const toggleMenu = (menuId: string) => {
    setOpenMenus((prev) => (prev.includes(menuId) ? prev.filter((id) => id !== menuId) : [...prev, menuId]));
  };

  const hasPermission = (requiredRoles: string[]) => {
    return requiredRoles.some((role) => currentUser.roles.includes(role));
  };

  const menuItems: MenuItem[] = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: "📊",
      path: "/dashboard",
      roles: ["ADMIN", "MANAGER", "STAFF", "VIEWER"],
    },
    {
      id: "inventory",
      label: "Inventory Management",
      icon: "📦",
      path: "/inventory",
      roles: ["ADMIN", "MANAGER", "STAFF"],
      children: [
        {
          id: "add-item",
          label: "Add Item",
          icon: "➕",
          path: "/inventory/add",
          roles: ["ADMIN", "MANAGER"],
        },
        {
          id: "view-items",
          label: "View Items",
          icon: "👁️",
          path: "/inventory/view",
          roles: ["ADMIN", "MANAGER", "STAFF", "VIEWER"],
        },
        {
          id: "update-stock",
          label: "Update Stock",
          icon: "📝",
          path: "/inventory/update",
          roles: ["ADMIN", "MANAGER", "STAFF"],
        },
        {
          id: "stock-alerts",
          label: "Stock Alerts",
          icon: "⚠️",
          path: "/inventory/alerts",
          roles: ["ADMIN", "MANAGER"],
        },
      ],
    },
    {
      id: "suppliers",
      label: "Supplier Management",
      icon: "🏢",
      path: "/suppliers",
      roles: ["ADMIN", "MANAGER"],
      children: [
        {
          id: "add-supplier",
          label: "Add Supplier",
          icon: "➕",
          path: "/suppliers/add",
          roles: ["ADMIN", "MANAGER"],
        },
        {
          id: "view-suppliers",
          label: "View Suppliers",
          icon: "👁️",
          path: "/suppliers/view",
          roles: ["ADMIN", "MANAGER", "STAFF"],
        },
        {
          id: "supplier-orders",
          label: "Orders",
          icon: "📋",
          path: "/suppliers/orders",
          roles: ["ADMIN", "MANAGER"],
        },
      ],
    },
    {
      id: "reports",
      label: "Reports & Analytics",
      icon: "📈",
      path: "/reports",
      roles: ["ADMIN", "MANAGER"],
      children: [
        {
          id: "inventory-report",
          label: "Inventory Report",
          icon: "📊",
          path: "/reports/inventory",
          roles: ["ADMIN", "MANAGER"],
        },
        {
          id: "sales-report",
          label: "Sales Report",
          icon: "💰",
          path: "/reports/sales",
          roles: ["ADMIN", "MANAGER"],
        },
        {
          id: "supplier-report",
          label: "Supplier Report",
          icon: "🏢",
          path: "/reports/suppliers",
          roles: ["ADMIN"],
        },
      ],
    },
    {
      id: "user-management",
      label: "User Management",
      icon: "👥",
      path: "/users",
      roles: ["ADMIN"],
      children: [
        {
          id: "view-users",
          label: "View Users",
          icon: "👁️",
          path: "/users/view",
          roles: ["ADMIN"],
        },
        {
          id: "add-user",
          label: "Add User",
          icon: "➕",
          path: "/users/add",
          roles: ["ADMIN"],
        },
        {
          id: "manage-roles",
          label: "Manage Roles",
          icon: "🔐",
          path: "/users/roles",
          roles: ["ADMIN"],
        },
      ],
    },
    {
      id: "settings",
      label: "Settings",
      icon: "⚙️",
      path: "/settings",
      roles: ["ADMIN", "MANAGER"],
      children: [
        {
          id: "system-settings",
          label: "System Settings",
          icon: "🔧",
          path: "/settings/system",
          roles: ["ADMIN"],
        },
        {
          id: "profile-settings",
          label: "Profile Settings",
          icon: "👤",
          path: "/settings/profile",
          roles: ["ADMIN", "MANAGER", "STAFF", "VIEWER"],
        },
      ],
    },
  ];

  const renderMenuItem = (item: MenuItem, level: number = 0) => {
    if (!hasPermission(item.roles)) return null;

    const hasChildren = item.children && item.children.length > 0;
    const isOpen = openMenus.includes(item.id);
    const isActive = activeItem === item.id;

    return (
      <div key={item.id} className="mb-1">
        <div
          className={`
            flex items-center justify-between px-4 py-3 rounded-lg cursor-pointer transition-all duration-200
            ${level > 0 ? "ml-4 py-2" : ""}
            ${isActive ? "bg-blue-500 text-white shadow-md" : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"}
          `}
          onClick={() => {
            if (hasChildren) {
              toggleMenu(item.id);
            } else {
              setActiveItem(item.id);
              // Navigate to path (implement routing here)
              console.log("Navigate to:", item.path);
            }
          }}
        >
          <div className="flex items-center space-x-3">
            <span className="text-lg">{item.icon}</span>
            <span className={`font-medium ${level > 0 ? "text-sm" : ""}`}>{item.label}</span>
          </div>
          {hasChildren && <span className={`transform transition-transform ${isOpen ? "rotate-90" : ""}`}>▶️</span>}
        </div>

        {hasChildren && isOpen && <div className="mt-1 space-y-1">{item.children?.map((child) => renderMenuItem(child, level + 1))}</div>}
      </div>
    );
  };

  return (
    <div className="w-64 bg-white shadow-lg h-screen flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <h1 className="text-xl font-bold text-gray-800">Inventory System</h1>
        <div className="mt-2">
          <p className="text-sm text-gray-600">Welcome back,</p>
          <p className="font-semibold text-gray-800">{currentUser.username}</p>
          <div className="flex flex-wrap gap-1 mt-2">
            {currentUser.roles.map((role) => (
              <span key={role} className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                {role}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <div className="flex-1 overflow-y-auto p-4">
        <nav className="space-y-2">{menuItems.map((item) => renderMenuItem(item))}</nav>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200">
        <button onClick={handleLogout} className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors">
          <span>🚪</span>
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
}
