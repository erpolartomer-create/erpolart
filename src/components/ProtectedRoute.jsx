import { Navigate, useLocation } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import useAdminAuthStore from '../store/adminAuthStore';

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const location = useLocation();
  const { user, isInitialized } = useAuthStore();
  const { adminUser, isAdminInitialized } = useAdminAuthStore();

  if (adminOnly) {
    if (!isAdminInitialized) return null; // F5 sorununu çözer
    return adminUser?.email === 'hello@erpolart.com' ? children : <Navigate to="/admin/login" replace />;
  }
  
  if (!isInitialized) return null;
  if (!user) {
    // OAuth tam-sayfa redirect'i router state'ini kaybeder; hedefi sessionStorage'a yaz
    try { sessionStorage.setItem('erpolart_post_login_redirect', location.pathname + location.search); } catch { /* yut */ }
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return children;
};

export default ProtectedRoute;
