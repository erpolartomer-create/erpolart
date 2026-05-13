import { useState } from 'react';
import { Outlet, NavLink, useNavigate, Link } from 'react-router-dom';
import { LayoutDashboard, Layers, MessageSquare, Settings, LogOut, Menu, X, ChevronRight, ShoppingCart, Bot } from 'lucide-react';
import useAdminAuthStore from '../../store/adminAuthStore';

const navItems = [
  { to: '/admin', icon: LayoutDashboard, label: 'Dashboard', end: true },
  { to: '/admin/orders', icon: ShoppingCart, label: 'Orders' },
  { to: '/admin/templates', icon: Layers, label: 'Templates' },
  { to: '/admin/messages', icon: MessageSquare, label: 'Messages' },
  { to: '/admin/chat', icon: Bot, label: 'Live Support' },
  { to: '/admin/settings', icon: Settings, label: 'Settings' },
];

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const { adminUser, logout } = useAdminAuthStore();

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex dark">
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-72 bg-[#0f0f18] border-r border-white/5 flex flex-col transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>

        {/* Logo */}
        <div className="p-6 border-b border-white/5">
          <div className="flex items-center justify-between">
            <Link to="/admin" className="flex flex-col">
              <img src="/logo-beyaz.png" alt="ErpolArt Yönetim Paneli Logo" className="h-7 w-auto object-contain" />
              <p className="text-[8px] font-black text-indigo uppercase tracking-[0.4em] mt-2 ml-0.5">Admin Terminal</p>
            </Link>
            <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-gray-500 hover:text-white">
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3.5 rounded-xl text-[11px] font-bold uppercase tracking-[0.15em] transition-all group ${isActive
                  ? 'bg-indigo/10 text-indigo border border-indigo/20'
                  : 'text-gray-500 hover:text-white hover:bg-white/5 border border-transparent'
                }`
              }
            >
              <item.icon size={18} />
              <span>{item.label}</span>
              <ChevronRight size={12} className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
            </NavLink>
          ))}
        </nav>

        {/* Bottom */}
        <div className="p-4 border-t border-white/5">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-[11px] font-bold uppercase tracking-[0.15em] text-gray-500 hover:text-red-400 hover:bg-red-500/5 transition-all w-full border border-transparent hover:border-red-500/20"
          >
            <LogOut size={18} />
            <span>Exit Admin</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Top Bar */}
        <header className="h-16 border-b border-white/5 bg-[#0a0a0f]/80 backdrop-blur-xl flex items-center justify-between px-6 sticky top-0 z-30">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-gray-400 hover:text-white">
            <Menu size={22} />
          </button>
          <div className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] hidden sm:block">
            ErpolArt Admin Panel
          </div>
          <div className="flex items-center gap-3">
            <span className="text-[10px] font-bold text-gray-500 hidden sm:block">{adminUser?.email || 'Administrator'}</span>
            <div className="w-8 h-8 rounded-full bg-indigo/20 border border-indigo/30 flex items-center justify-center text-indigo font-black text-xs">
              {adminUser?.email?.charAt(0)?.toUpperCase() || 'A'}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6 lg:p-10 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
