import { Button } from "@/components/ui/button";
import { useInternetIdentity } from "@/hooks/useInternetIdentity";
import { useIsCallerAdmin } from "@/hooks/useQueries";
import { useQueryClient } from "@tanstack/react-query";
import { Outlet, useNavigate, useRouterState } from "@tanstack/react-router";
import {
  BookOpen,
  LayoutDashboard,
  Loader2,
  LogOut,
  Mic2,
  QrCode,
} from "lucide-react";
import { useEffect } from "react";

export default function AdminLayout() {
  const navigate = useNavigate();
  const routerState = useRouterState();
  const { identity, login, clear, loginStatus, isInitializing } =
    useInternetIdentity();
  const queryClient = useQueryClient();

  const isAuthenticated = !!identity;
  const { data: isAdmin, isLoading: adminLoading } = useIsCallerAdmin();

  const currentPath = routerState.location.pathname;

  const navItems = [
    { path: "/admin", label: "Dashboard", icon: LayoutDashboard },
    { path: "/admin/bookings", label: "Bookings", icon: BookOpen },
    { path: "/admin/checkin", label: "Check-In", icon: QrCode },
  ];

  useEffect(() => {
    if (!adminLoading && isAuthenticated && isAdmin === false) {
      navigate({ to: "/" });
    }
  }, [adminLoading, isAuthenticated, isAdmin, navigate]);

  const handleLogout = async () => {
    await clear();
    queryClient.clear();
  };

  if (isInitializing) {
    return (
      <div
        className="min-h-screen bg-background flex items-center justify-center"
        data-ocid="admin.loading_state"
      >
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background spotlight-bg flex items-center justify-center px-4">
        <div className="text-center max-w-sm w-full">
          <div className="w-16 h-16 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-6">
            <Mic2 className="w-8 h-8 text-primary" />
          </div>
          <h1 className="font-display font-black text-3xl text-foreground mb-2">
            Admin Access
          </h1>
          <p className="text-muted-foreground mb-8 text-sm">
            Sign in with Internet Identity to access the admin dashboard.
          </p>
          <Button
            onClick={login}
            disabled={loginStatus === "logging-in"}
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-display font-bold py-5"
            data-ocid="admin.primary_button"
          >
            {loginStatus === "logging-in" ? (
              <>
                <Loader2 className="mr-2 w-4 h-4 animate-spin" /> Signing in...
              </>
            ) : (
              "Sign In with Internet Identity"
            )}
          </Button>
          <button
            type="button"
            onClick={() => navigate({ to: "/" })}
            className="mt-4 text-muted-foreground text-sm hover:text-foreground transition-colors"
            data-ocid="admin.link"
          >
            ← Back to site
          </button>
        </div>
      </div>
    );
  }

  if (adminLoading) {
    return (
      <div
        className="min-h-screen bg-background flex items-center justify-center"
        data-ocid="admin.loading_state"
      >
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground text-sm">
            Verifying admin access...
          </p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div
        className="min-h-screen bg-background flex items-center justify-center px-4"
        data-ocid="admin.error_state"
      >
        <div className="text-center">
          <h2 className="font-display font-bold text-2xl text-foreground mb-3">
            Access Denied
          </h2>
          <p className="text-muted-foreground mb-6">
            You do not have admin privileges.
          </p>
          <Button
            onClick={() => navigate({ to: "/" })}
            data-ocid="admin.primary_button"
          >
            Return to Site
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className="w-60 bg-sidebar border-r border-border flex-col hidden md:flex">
        <div className="h-16 flex items-center px-6 border-b border-border gap-2">
          <Mic2 className="text-primary w-5 h-5" />
          <span className="font-display font-bold text-sm text-foreground">
            Toto Admin
          </span>
        </div>
        <nav className="flex-1 py-4 px-3 space-y-1">
          {navItems.map((item) => (
            <button
              type="button"
              key={item.path}
              onClick={() => navigate({ to: item.path as "/admin" })}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                currentPath === item.path
                  ? "bg-primary/15 text-primary"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground"
              }`}
              data-ocid="admin.link"
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-border">
          <Button
            variant="ghost"
            onClick={handleLogout}
            className="w-full justify-start gap-2 text-muted-foreground hover:text-foreground text-sm"
            data-ocid="admin.secondary_button"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </Button>
        </div>
      </aside>

      {/* Mobile nav */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-sidebar border-t border-border z-50 flex">
        {navItems.map((item) => (
          <button
            type="button"
            key={item.path}
            onClick={() => navigate({ to: item.path as "/admin" })}
            className={`flex-1 flex flex-col items-center gap-1 py-3 text-xs font-medium transition-colors ${
              currentPath === item.path
                ? "text-primary"
                : "text-muted-foreground"
            }`}
            data-ocid="admin.tab"
          >
            <item.icon className="w-5 h-5" />
            {item.label}
          </button>
        ))}
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-h-screen">
        <header className="h-16 border-b border-border flex items-center justify-between px-6">
          <h1 className="font-display font-bold text-foreground text-base">
            {navItems.find((n) => n.path === currentPath)?.label ?? "Admin"}
          </h1>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            className="text-muted-foreground hover:text-foreground gap-2 hidden md:flex"
            data-ocid="admin.secondary_button"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </Button>
        </header>
        <main className="flex-1 p-6 pb-20 md:pb-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
