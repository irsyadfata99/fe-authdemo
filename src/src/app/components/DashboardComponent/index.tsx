"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { authAPI, authUtils } from "../../../../lib/api";

// Define types for better TypeScript support
interface User {
  id: number;
  username: string;
  email: string;
  createdAt?: string;
}

export default function DashboardComponent() {
  const [user, setUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    const userData = authUtils.getUser();
    if (!userData) {
      router.push("/login");
      return;
    }

    setUser(userData);
    loadUsers();
  }, [router]);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const result = await authAPI.getUsers();
      if (result.success) {
        setUsers(result.data);
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

  if (loading && !user) {
    return (
      <div className="loading">
        <div className="loading-spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect to login
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Dashboard</h1>
        <p>Welcome back, {user.username}!</p>
      </div>

      {/* User Profile Card */}
      <div className="dashboard-section">
        <div className="card user-profile">
          <div className="card-header">
            <h2>Your Profile</h2>
          </div>
          <div className="card-content">
            <div className="profile-info">
              <div className="info-item">
                <label>Username:</label>
                <span>{user.username}</span>
              </div>
              <div className="info-item">
                <label>Email:</label>
                <span>{user.email}</span>
              </div>
              <div className="info-item">
                <label>User ID:</label>
                <span>{user.id}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Users List Section */}
      <div className="dashboard-section">
        <div className="card users-section">
          <div className="card-header">
            <h2>All Users</h2>
            <button onClick={refreshUsers} className="btn btn-small">
              Refresh
            </button>
          </div>
          <div className="card-content">
            {error && <div className="error">{error}</div>}

            {loading ? (
              <div className="loading-users">
                <p>Loading users...</p>
              </div>
            ) : users.length > 0 ? (
              <div className="users-grid">
                {users.map((userItem) => (
                  <div key={userItem.id} className="user-card">
                    <div className="user-info">
                      <h4>{userItem.username}</h4>
                      <p>{userItem.email}</p>
                      <small>ID: {userItem.id}</small>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="no-users">No users found</p>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="dashboard-section">
        <div className="card quick-actions">
          <div className="card-header">
            <h2>Quick Actions</h2>
          </div>
          <div className="card-content">
            <div className="actions-grid">
              <button onClick={refreshUsers} className="action-btn">
                <span>🔄</span>
                Refresh Data
              </button>
              <button onClick={() => router.push("/")} className="action-btn">
                <span>🏠</span>
                Go Home
              </button>
              <button onClick={handleLogout} className="action-btn danger">
                <span>🚪</span>
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
