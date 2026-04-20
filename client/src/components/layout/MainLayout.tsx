import { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { AdminSidebar } from './AdminSidebar';
import { StaffSidebar } from './StaffSidebar';
import { UserRole } from '@/types';
import { Loader2 } from 'lucide-react';

interface MainLayoutProps {
  children: ReactNode;
  requireAuth?: boolean;
  allowedRoles?: UserRole[];
}

export function MainLayout({ children, requireAuth = false, allowedRoles }: MainLayoutProps) {
  const { user, isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (requireAuth && !isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    // Redirect based on role
    const redirectPath = user.role === 'admin' 
  ? '/admin/issues'
  : user.role === 'staff' 
    ? '/staff/assigned' 
    : '/issues';
    return <Navigate to={redirectPath} replace />;
  }

  // Check if we need sidebars for admin/staff
  const showAdminSidebar = user?.role === 'admin' && location.pathname.startsWith('/admin');
  const showStaffSidebar = user?.role === 'staff' && location.pathname.startsWith('/staff');
  const showSidebar = showAdminSidebar || showStaffSidebar;

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      
      {showSidebar ? (
        <div className="flex flex-1">
          {showAdminSidebar && <AdminSidebar />}
          {showStaffSidebar && <StaffSidebar />}
          <main className="flex-1 overflow-auto">
            {children}
          </main>
        </div>
      ) : (
        <main className="flex-1">{children}</main>
      )}
      
      {!showSidebar && <Footer />}
    </div>
  );
}

// Layout without navbar/footer for auth pages
export function AuthLayout({ children }: { children: ReactNode }) {
  const { isAuthenticated, user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (isAuthenticated && user) {
    // Redirect based on role
   const redirectPath = user.role === 'admin' 
  ? '/admin/issues'
  : user.role === 'staff' 
    ? '/staff/assigned' 
    : '/issues';
    return <Navigate to={redirectPath} replace />;
  }

  return (
    <div className="flex min-h-screen">
      {children}
    </div>
  );
}
