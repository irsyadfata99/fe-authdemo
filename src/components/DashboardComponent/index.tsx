// components/DashboardComponent/index.tsx - Dashboard with Sidebar Layout
"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { authAPI, authUtils } from "../../lib/api";
import Sidebar from "../Sidebar";

interface User {
  id: number;
  username: string;
  email: string;
  createdAt?: string;
  roles: string[];
}

export default function DashboardComponent() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    const userData = authUtils.getUser();
    if (!userData) {
      router.push("/");
      return;
    }

    setCurrentUser(userData);
    loadUsers(userData);
  }, [router]);

  // Fixed loadUsers function - removed username parameter
  const loadUsers = async (user?: User) => {
    const userToCheck = user || currentUser;
    if (!userToCheck) return;

    // Check if user has permission to view all users
    if (!userToCheck.roles?.includes("ADMIN") && !userToCheck.roles?.includes("MANAGER")) {
      setAllUsers([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      console.log("Calling getUsers API...");
      // Fixed: Remove username parameter since your API doesn't need it
      const result = await authAPI.getUsers();
      console.log("API response:", result);

      if (result.success) {
        setAllUsers(result.data);
        console.log("Users set:", result.data);
      } else {
        setError("Failed to load users");
      }
    } catch (err: unknown) {
      console.error("Load users error:", err);
      const errorMessage = err instanceof Error ? err.message : (err as { response?: { data?: { message?: string } } })?.response?.data?.message || "Failed to load users";
      setError("Failed to load users: " + errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const refreshUsers = () => {
    loadUsers();
  };

  if (loading && !currentUser) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="loading-spinner mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return null;
  }

  const getWelcomeMessage = () => {
    const roleMessages = {
      ADMIN: "You have full system access and can manage all aspects of the inventory system.",
      MANAGER: "You can manage inventory, suppliers, and view reports.",
      STAFF: "You can update stock levels and view inventory items.",
      VIEWER: "You have read-only access to view inventory information.",
    };

    // Handle case where user might not have roles or roles array is empty
    if (!currentUser.roles || currentUser.roles.length === 0) {
      return "Welcome to the inventory management system.";
    }

    const primaryRole = currentUser.roles[0];
    return roleMessages[primaryRole as keyof typeof roleMessages] || "Welcome to the inventory management system.";
  };

  const getQuickActions = () => {
    const actions = [];

    // Check if user has roles before checking specific roles
    if (!currentUser.roles || currentUser.roles.length === 0) {
      actions.push({
        label: "View Inventory",
        icon: "👁️",
        color: "indigo",
        description: "Browse all items",
      });
      return actions;
    }

    if (currentUser.roles.includes("ADMIN") || currentUser.roles.includes("MANAGER")) {
      actions.push({ label: "Add New Item", icon: "📦", color: "blue", description: "Add new inventory item" }, { label: "View Reports", icon: "📊", color: "green", description: "View analytics and reports" });
    }

    if (currentUser.roles.includes("ADMIN")) {
      actions.push({ label: "Manage Users", icon: "👥", color: "purple", description: "Add or modify users" }, { label: "System Settings", icon: "⚙️", color: "gray", description: "Configure system settings" });
    }

    if (currentUser.roles.includes("STAFF") || currentUser.roles.includes("MANAGER")) {
      actions.push({
        label: "Update Stock",
        icon: "📝",
        color: "orange",
        description: "Update inventory levels",
      });
    }

    actions.push({
      label: "View Inventory",
      icon: "👁️",
      color: "indigo",
      description: "Browse all items",
    });

    return actions;
  };

  const getRoleStats = () => {
    // Handle case where allUsers might be empty or users might not have roles
    const roleMap = allUsers.reduce((acc, user) => {
      if (user.roles && user.roles.length > 0) {
        user.roles.forEach((role) => {
          acc[role] = (acc[role] || 0) + 1;
        });
      }
      return acc;
    }, {} as Record<string, number>);

    return [
      { role: "ADMIN", count: roleMap.ADMIN || 0, color: "red" },
      { role: "MANAGER", count: roleMap.MANAGER || 0, color: "blue" },
      { role: "STAFF", count: roleMap.STAFF || 0, color: "green" },
      { role: "VIEWER", count: roleMap.VIEWER || 0, color: "yellow" },
    ];
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar currentUser={currentUser} />

      {/* Main Content */}
      <div className="flex-1 p-8">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Inventory Dashboard</h1>
          <p className="text-lg text-gray-600 mb-4">
            Welcome back, <span className="font-semibold text-blue-600">{currentUser.username}</span>
          </p>
          <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-r-lg">
            <p className="text-blue-800">{getWelcomeMessage()}</p>
          </div>
        </div>

        {/* User Role Display */}
        <div className="mb-6">
          <div className="bg-white rounded-lg shadow-md p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Your Role(s)</h3>
            <div className="flex flex-wrap gap-2">
              {currentUser.roles && currentUser.roles.length > 0 ? (
                currentUser.roles.map((role, index) => (
                  <span
                    key={index}
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      role === "ADMIN" ? "bg-red-100 text-red-700" : role === "MANAGER" ? "bg-blue-100 text-blue-700" : role === "STAFF" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {role}
                  </span>
                ))
              ) : (
                <span className="px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-700">No roles assigned</span>
              )}
            </div>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="text-3xl text-blue-500 mr-4">📦</div>
              <div>
                <p className="text-sm font-medium text-gray-600">Total Items</p>
                <p className="text-2xl font-bold text-gray-900">124</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="text-3xl text-green-500 mr-4">📈</div>
              <div>
                <p className="text-sm font-medium text-gray-600">In Stock</p>
                <p className="text-2xl font-bold text-gray-900">98</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="text-3xl text-red-500 mr-4">⚠️</div>
              <div>
                <p className="text-sm font-medium text-gray-600">Low Stock</p>
                <p className="text-2xl font-bold text-gray-900">12</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="text-3xl text-purple-500 mr-4">👥</div>
              <div>
                <p className="text-sm font-medium text-gray-600">Total Users</p>
                <p className="text-2xl font-bold text-gray-900">{allUsers.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {getQuickActions().map((action, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer">
                <div className="flex items-start space-x-4">
                  <div className="text-2xl">{action.icon}</div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{action.label}</h3>
                    <p className="text-sm text-gray-600 mt-1">{action.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Role Distribution (Admin/Manager only) */}
        {(currentUser.roles?.includes("ADMIN") || currentUser.roles?.includes("MANAGER")) && (
          <div className="mb-8">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-900">User Role Distribution</h2>
                <button onClick={refreshUsers} className="text-blue-500 hover:text-blue-600 font-medium">
                  Refresh
                </button>
              </div>

              {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}

              {loading ? (
                <div className="text-center py-4">
                  <div className="loading-spinner mx-auto mb-2"></div>
                  <p className="text-gray-600">Loading users...</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {getRoleStats().map((stat) => (
                    <div key={stat.role} className="text-center">
                      <div
                        className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-2 ${
                          stat.color === "red" ? "bg-red-100" : stat.color === "blue" ? "bg-blue-100" : stat.color === "green" ? "bg-green-100" : "bg-yellow-100"
                        }`}
                      >
                        <span className="text-2xl font-bold text-gray-700">{stat.count}</span>
                      </div>
                      <p className="text-sm font-medium text-gray-600">{stat.role}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* User List (Admin/Manager only) */}
        {(currentUser.roles?.includes("ADMIN") || currentUser.roles?.includes("MANAGER")) && allUsers.length > 0 && (
          <div className="mb-8">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">All Users ({allUsers.length})</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {allUsers.map((user) => (
                  <div key={user.id} className={`p-4 rounded-lg border-2 transition-all ${user.id === currentUser.id ? "bg-blue-50 border-blue-300" : "bg-gray-50 border-gray-200 hover:border-gray-300"}`}>
                    <div className="space-y-2">
                      <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                        {user.username}
                        {user.id === currentUser.id && <span className="text-xs bg-blue-500 text-white px-2 py-1 rounded-full">You</span>}
                      </h4>
                      <p className="text-gray-600">{user.email}</p>
                      <div className="flex flex-wrap gap-1">
                        {user.roles && user.roles.length > 0 ? (
                          user.roles.map((role, index) => (
                            <span
                              key={index}
                              className={`px-2 py-1 rounded text-xs font-medium ${
                                role === "ADMIN" ? "bg-red-100 text-red-700" : role === "MANAGER" ? "bg-blue-100 text-blue-700" : role === "STAFF" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                              }`}
                            >
                              {role}
                            </span>
                          ))
                        ) : (
                          <span className="px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-700">No roles</span>
                        )}
                      </div>
                      <div className="text-sm text-gray-500 space-y-1">
                        <div>ID: {user.id}</div>
                        {user.createdAt && <div>Joined: {new Date(user.createdAt).toLocaleDateString()}</div>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Activity</h2>
          <div className="space-y-4">
            <div className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
              <div className="text-blue-500">📦</div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">New item added: Laptop Computer</p>
                <p className="text-xs text-gray-500">2 hours ago</p>
              </div>
            </div>
            <div className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
              <div className="text-green-500">📈</div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">Stock updated: Office Chairs (+50)</p>
                <p className="text-xs text-gray-500">4 hours ago</p>
              </div>
            </div>
            <div className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
              <div className="text-orange-500">⚠️</div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">Low stock alert: Printer Paper</p>
                <p className="text-xs text-gray-500">6 hours ago</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
