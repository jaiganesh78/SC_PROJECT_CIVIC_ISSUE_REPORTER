import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { AuthLayout } from "./components/layout/MainLayout";

// Auth pages
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";

// Citizen pages
import ReportIssuePage from "./pages/citizen/ReportIssuePage";
import IssueFeedPage from "./pages/citizen/IssueFeedPage";
import MapViewPage from "./pages/citizen/MapViewPage";
import MyIssuesPage from "./pages/citizen/MyIssuesPage";

// Staff pages
import StaffAssignedIssuesPage from "./pages/staff/StaffAssignedIssuesPage";
import StaffMapViewPage from "./pages/staff/StaffMapViewPage";
import ResolveIssuePage from "./pages/staff/ResolveIssuePage";

// Admin pages
import AdminPendingVerificationPage from "./pages/admin/AdminPendingVerificationPage";
import AdminFakeReportsPage from "./pages/admin/AdminFakeReportsPage";
import AdminGlobalMapPage from "./pages/admin/AdminGlobalMapPage";
import AdminAnalyticsPage from "./pages/admin/AdminAnalyticsPage";

// Common pages
import ProfilePage from "./pages/ProfilePage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Auth routes */}
            <Route path="/login" element={<AuthLayout><LoginPage /></AuthLayout>} />
            <Route path="/register" element={<AuthLayout><RegisterPage /></AuthLayout>} />

            {/* Citizen routes */}
            <Route path="/report" element={<ReportIssuePage />} />
            <Route path="/issues" element={<IssueFeedPage />} />
            <Route path="/map" element={<MapViewPage />} />
            <Route path="/my-issues" element={<MyIssuesPage />} />

            {/* Staff routes */}
            <Route path="/staff/assigned" element={<StaffAssignedIssuesPage />} />
            <Route path="/staff/map" element={<StaffMapViewPage />} />
            <Route path="/staff/resolve/:id" element={<ResolveIssuePage />} />

            {/* Admin routes */}
            <Route path="/admin/pending" element={<AdminPendingVerificationPage />} />
            <Route path="/admin/fake-reports" element={<AdminFakeReportsPage />} />
            <Route path="/admin/map" element={<AdminGlobalMapPage />} />
            <Route path="/admin/analytics" element={<AdminAnalyticsPage />} />

            {/* Common routes */}
            <Route path="/profile" element={<ProfilePage />} />
            
            {/* Home redirect */}
            <Route path="/" element={<Navigate to="/login" replace />} />
            
            {/* 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
