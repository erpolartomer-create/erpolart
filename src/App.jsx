import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import useAdminAuthStore from './store/adminAuthStore';
import { supabaseAdmin } from './lib/supabaseAdmin';
import { useTranslation } from 'react-i18next';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import ProjectsPage from './pages/ProjectsPage';
import TemplatesPage from './pages/TemplatesPage';
import AboutPage from './pages/AboutPage';
import TemplateDetailPage from './pages/TemplateDetailPage';
import ContactPage from './pages/ContactPage';
import SaaSPage from './pages/SaaSPage';
import OrderSuccessPage from './pages/OrderSuccessPage';
import WorkspacePage from './pages/WorkspacePage';
import OrderCancelPage from './pages/OrderCancelPage';
import ProjectDetailPage from './pages/ProjectDetailPage';
import CaseStudyPage from './pages/CaseStudyPage';
import AutomationsPage from './pages/AutomationsPage';
import ProposalPage from './pages/ProposalPage';
import OrderPage from './pages/OrderPage';
import PaymentResultPage from './pages/PaymentResultPage';
import NotFoundPage from './pages/NotFoundPage';

// Legal Pages
import DistanceSellingPage from './pages/legal/DistanceSellingPage';
import RefundPolicyPage from './pages/legal/RefundPolicyPage';
import PrivacyPolicyPage from './pages/legal/PrivacyPolicyPage';
import KvkkPage from './pages/legal/KvkkPage';

import useUIStore from './store/uiStore';
import useAuthStore from './store/authStore';
import { supabase } from './lib/supabase';
import ScrollToTop from './components/ScrollToTop';
import GlobalSignalReceiver from './components/GlobalSignalReceiver';
import ChatBot from './components/ChatBot';
import ErrorBoundary from './components/ErrorBoundary';
import { ToastContainer } from './components/Toast';

// Auth & Security
import AuthPage from './pages/AuthPage';
import AdminLoginPage from './pages/admin/AdminLoginPage';
import ProtectedRoute from './components/ProtectedRoute';

// Customer Pages
import CustomerDashboard from './pages/CustomerDashboard';
import MyPurchases from './pages/MyPurchases';
import AccountSettings from './pages/AccountSettings';

// Admin Pages
import AdminLayout from './pages/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminOrders from './pages/admin/AdminOrders';
import AdminTemplates from './pages/admin/AdminTemplates';
import AdminMessages from './pages/admin/AdminMessages';
import AdminSettings from './pages/admin/AdminSettings';
import AdminChatDashboard from './pages/admin/AdminChatDashboard';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import UpdatePasswordPage from './pages/UpdatePasswordPage';



function App() {
  const theme = useUIStore((state) => state.theme);
  const { i18n } = useTranslation();

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  useEffect(() => {
    document.documentElement.lang = i18n.language || localStorage.getItem('i18nextLng') || 'en';
  }, [i18n.language]);

  useEffect(() => {
    const recoverSession = async () => {
      // 1. Müşteri Oturumu Kurtar
      const { data: { session } } = await supabase.auth.getSession();
      useAuthStore.getState().setUser(session?.user ?? null);

      // 2. Admin Oturumu Kurtar
      const { data: { session: adminSession } } = await supabaseAdmin.auth.getSession();
      useAdminAuthStore.getState().setAdmin(adminSession?.user ?? null);
    };
    recoverSession();

    // Müşteri Oturum Dinleyicisi
    const { data: { subscription: authSub } } = supabase.auth.onAuthStateChange((_event, session) => {
      useAuthStore.getState().setUser(session?.user ?? null);
    });

    // Admin Oturum Dinleyicisi
    const { data: { subscription: adminSub } } = supabaseAdmin.auth.onAuthStateChange((_event, session) => {
      useAdminAuthStore.getState().setAdmin(session?.user ?? null);
    });

    return () => {
      authSub.unsubscribe();
      adminSub.unsubscribe();
    };
  }, []);

  return (
    <ErrorBoundary>
      <Router>
        <ScrollToTop />
        <GlobalSignalReceiver />
        <ChatBot />
        <ToastContainer />
        <Routes>
        {/* Web Sitesi Akışı (Public & Customer) */}
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="projects" element={<ProjectsPage />} />
          <Route path="projects/:id" element={<ProjectDetailPage />} />
          <Route path="saas" element={<SaaSPage />} />
          <Route path="saas/case-study/:id" element={<CaseStudyPage />} />
          <Route path="ai-automations" element={<AutomationsPage />} />
          <Route path="templates" element={<TemplatesPage />} />
          <Route path="templates/:id" element={<TemplateDetailPage />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="contact" element={<ContactPage />} />
          <Route path="order-success/:id" element={<ProtectedRoute><OrderSuccessPage /></ProtectedRoute>} />
          <Route path="workspace/:id" element={<ProtectedRoute><WorkspacePage /></ProtectedRoute>} />
          <Route path="order-cancel" element={<OrderCancelPage />} />
          <Route path="proposal/:id" element={<ProposalPage />} />
          <Route path="order" element={<OrderPage />} />
          <Route path="checkout/:id" element={<OrderPage />} />
          <Route path="checkout/proposal/:id" element={<OrderPage />} />
          <Route path="payment-result" element={<PaymentResultPage />} />
          
          {/* Legal Pages */}
          <Route path="mesafeli-satis-sozlesmesi" element={<DistanceSellingPage />} />
          <Route path="iptal-ve-iade-kosullari" element={<RefundPolicyPage />} />
          <Route path="gizlilik-politikasi" element={<PrivacyPolicyPage />} />
          <Route path="kvkk-metni" element={<KvkkPage />} />

          {/* Müşteri Dash (Opsiyonel/Gizlenebilir) */}
          <Route path="dashboard" element={<ProtectedRoute><CustomerDashboard /></ProtectedRoute>} />
          <Route path="my-purchases" element={<ProtectedRoute><MyPurchases /></ProtectedRoute>} />
          <Route path="account" element={<ProtectedRoute><AccountSettings /></ProtectedRoute>} />
        </Route>

        {/* Müşteri Giriş/Kayıt */}
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/login" element={<AuthPage />} />
        <Route path="/register" element={<AuthPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/update-password" element={<UpdatePasswordPage />} />



        {/* Admin Giriş (Tamamen Ayrıştırılmış) */}
        <Route path="/admin/login" element={<AdminLoginPage />} />

        {/* Admin Dashboard (Protected - Admin Only Session) */}
        <Route path="/admin" element={<ProtectedRoute adminOnly><AdminLayout /></ProtectedRoute>}>
          <Route index element={<AdminDashboard />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="templates" element={<AdminTemplates />} />
          <Route path="messages" element={<AdminMessages />} />
          <Route path="chat" element={<AdminChatDashboard />} />
          <Route path="settings" element={<AdminSettings />} />
        </Route>

        <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Router>
    </ErrorBoundary>
  );
}

export default App;
