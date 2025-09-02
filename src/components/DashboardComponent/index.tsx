// components/DashboardComponent/index.tsx - Dashboard with Tailwind CSS
"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { authAPI, authUtils } from "../../lib/api";

interface User {
  id: number;
  username: string;
  email: string;
  createdAt?: string;
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
    loadUsers();
  }, [router]);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const result = await authAPI.getUsers();
      if (result.success) {
        setAllUsers(result.data);
      } else {
        setError("Failed to load users");
      }
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : (err as { response?: { data?: { message?: string } } })?.response
              ?.data?.message || "Failed to load users";
      setError("Failed to load users: " + errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const refreshUsers = () => {
    loadUsers();
  };

  const handleLogout = () => {
    authUtils.removeUser();
    router.push("/");
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

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Dashboard Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Dashboard</h1>
          <p className="text-xl text-gray-600">
            Welcome back,{" "}
            <span className="text-blue-500 font-semibold">
              {currentUser.username}
            </span>
            !
          </p>
          <p className="text-gray-500 mt-1">
            You are logged in as:{" "}
            <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-sm">
              {currentUser.email}
            </span>
          </p>
        </div>

        {/* Current User Profile Card */}
        <div className="mb-8">
          <div className="card">
            <div className="card-header">
              <h2 className="text-xl font-bold">Your Profile</h2>
              <button onClick={handleLogout} className="btn-danger btn-small">
                Logout
              </button>
            </div>
            <div className="card-content">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-gray-700">
                      Username:
                    </span>
                    <span className="text-gray-900">
                      {currentUser.username}
                    </span>
                  </div>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-gray-700">Email:</span>
                    <span className="text-gray-900">{currentUser.email}</span>
                  </div>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-gray-700">
                      User ID:
                    </span>
                    <span className="text-gray-900">{currentUser.id}</span>
                  </div>
                </div>
                {currentUser.createdAt && (
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-gray-700">
                        Member Since:
                      </span>
                      <span className="text-gray-900">
                        {new Date(currentUser.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* All Users List Section */}
        <div className="mb-8">
          <div className="card">
            <div className="card-header">
              <h2 className="text-xl font-bold">
                All Registered Users ({allUsers.length})
              </h2>
              <button
                onClick={refreshUsers}
                className="btn-secondary btn-small"
              >
                Refresh
              </button>
            </div>
            <div className="card-content">
              {error && <div className="alert-error">{error}</div>}

              {loading ? (
                <div className="text-center py-8">
                  <div className="loading-spinner mx-auto mb-4"></div>
                  <p className="text-gray-600">Loading users...</p>
                </div>
              ) : allUsers.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {allUsers.map((user) => (
                    <div
                      key={user.id}
                      className={`user-card ${
                        user.id === currentUser.id ? "current-user" : ""
                      }`}
                    >
                      <div className="space-y-2">
                        <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                          {user.username}
                          {user.id === currentUser.id && (
                            <span className="text-xs bg-blue-500 text-white px-2 py-1 rounded-full">
                              You
                            </span>
                          )}
                        </h4>
                        <p className="text-gray-600">{user.email}</p>
                        <div className="text-sm text-gray-500 space-y-1">
                          <div>ID: {user.id}</div>
                          {user.createdAt && (
                            <div>
                              Joined:{" "}
                              {new Date(user.createdAt).toLocaleDateString()}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">No users found</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="card">
          <div className="card-header">
            <h2 className="text-xl font-bold">Quick Stats</h2>
          </div>
          <div className="card-content">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="stat-item">
                <div className="text-3xl font-bold text-blue-500 mb-2">
                  {allUsers.length}
                </div>
                <div className="text-gray-600 font-medium">Total Users</div>
              </div>
              <div className="stat-item">
                <div className="text-3xl font-bold text-blue-500 mb-2">
                  {currentUser.id}
                </div>
                <div className="text-gray-600 font-medium">Your User ID</div>
              </div>
              <div className="stat-item">
                <div className="text-3xl font-bold text-blue-500 mb-2">
                  {currentUser.createdAt
                    ? Math.floor(
                        (Date.now() -
                          new Date(currentUser.createdAt).getTime()) /
                          (1000 * 60 * 60 * 24)
                      )
                    : "N/A"}
                </div>
                <div className="text-gray-600 font-medium">Days as Member</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
