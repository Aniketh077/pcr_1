import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { ToastProvider } from "./contexts/ToastContext";
import ProtectedAdminRoute from "./pages/admin/ProtectedAdminRoute";
import EcoHeader from "./components/layout/EcoHeader";
import EcoFooter from "./components/layout/EcoFooter";
import EcoHomePage from "./pages/EcoHomePage";
import MaterialsPage from "./pages/MaterialsPage";
import MaterialDetailPage from "./pages/MaterialDetailPage";
import RequestConfirmationPage from "./pages/RequestConfirmationPage";
import AdminLoginPage from "./pages/AdminLoginPage";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminEcoHome from "./pages/admin/AdminEcoHome";
import AdminEcoIndustries from "./pages/admin/AdminEcoIndustries";
import AdminEcoMaterials from "./pages/admin/AdminEcoMaterials";
import AdminEcoRequests from "./pages/admin/AdminEcoRequests";
import ToastContainer from "./components/ui/ToastContainer";
import ScrollToTop from "./components/ScrollToTop";

const Layout = ({ children }) => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");

  if (isAdminRoute) {
    return (
      <div className="min-h-screen bg-gray-50">
        <main className="min-h-screen">{children}</main>
        <ToastContainer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <EcoHeader />
      <main className="flex-1">{children}</main>
      <EcoFooter />
      <ToastContainer />
    </div>
  );
};

function EcoApp() {
  return (
    <AuthProvider>
      <ToastProvider>
        <Router>
          <ScrollToTop />
          <Layout>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<EcoHomePage />} />
              <Route path="/eco-home" element={<EcoHomePage />} />
              <Route path="/eco-industries" element={<EcoHomePage />} />
              <Route path="/eco-materials" element={<MaterialsPage />} />
              <Route path="/eco-materials/:id" element={<MaterialDetailPage />} />
              <Route path="/request-confirmation/:requestId" element={<RequestConfirmationPage />} />

              {/* Admin Login Route */}
              <Route path="/admin/login" element={<AdminLoginPage />} />

              {/* Admin Routes */}
              <Route
                path="/admin"
                element={
                  <ProtectedAdminRoute>
                    <AdminDashboard />
                  </ProtectedAdminRoute>
                }
              />
              <Route
                path="/admin/eco-home"
                element={
                  <ProtectedAdminRoute>
                    <AdminEcoHome />
                  </ProtectedAdminRoute>
                }
              />
              <Route
                path="/admin/eco-industries"
                element={
                  <ProtectedAdminRoute>
                    <AdminEcoIndustries />
                  </ProtectedAdminRoute>
                }
              />
              <Route
                path="/admin/eco-materials"
                element={
                  <ProtectedAdminRoute>
                    <AdminEcoMaterials />
                  </ProtectedAdminRoute>
                }
              />
              <Route
                path="/admin/eco-requests"
                element={
                  <ProtectedAdminRoute>
                    <AdminEcoRequests />
                  </ProtectedAdminRoute>
                }
              />
            </Routes>
          </Layout>
        </Router>
      </ToastProvider>
    </AuthProvider>
  );
}

export default EcoApp;
