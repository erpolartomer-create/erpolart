import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingBag, Settings, Layers, ArrowRight, Clock, User, Hexagon } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import useAuthStore from '../store/authStore';
import { supabase } from '../lib/supabase';
import ScrollReveal from '../components/ScrollReveal';

const CustomerDashboard = () => {
  const { t, i18n } = useTranslation();
  const { user } = useAuthStore();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    const fetchData = async () => {
      if (!user?.email) return;
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('orders')
          .select(`
            id, template_id, amount, status, created_at,
            templates:template_id (name, preview_image)
          `)
          .or(`email.eq.${user.email},user_id.eq.${user.id}`)
          .eq('project_code', 'erpolart')
          .order('created_at', { ascending: false });

        if (error) throw error;
        setOrders(data || []);
      } catch (err) {
        console.error('Dashboard fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user?.email]);

  const activeSites = orders.filter(o => o.status === 'active').length;
  const displayName = user?.user_metadata?.full_name || user?.name || user?.email?.split('@')[0] || 'User';
  const avatarUrl = user?.user_metadata?.avatar_url;
  const memberSinceStr = user?.created_at || user?.createdAt;
  const memberSinceFormatted = memberSinceStr
    ? new Date(memberSinceStr).toLocaleDateString(i18n.language, { year: 'numeric', month: 'long' })
    : 'Member';

  const getStatusConfig = (status) => {
    switch (status) {
      case 'active':
        return { label: t('customerDashboard.status.active'), color: 'text-emerald-500', bg: 'bg-emerald-500/10', glow: 'bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.8)]' };
      case 'paid':
        // Ödeme alındı — PayTR callback'i 'paid' yapar
        return { label: t('customerDashboard.status.paid'), color: 'text-emerald-400', bg: 'bg-emerald-500/10', glow: 'bg-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.8)]' };
      case 'revision':
        return { label: t('customerDashboard.status.revision'), color: 'text-rose-500', bg: 'bg-rose-500/10', glow: 'bg-rose-500 shadow-[0_0_12px_rgba(244,63,94,0.8)]' };
      case 'development':
        return { label: t('customerDashboard.status.development'), color: 'text-indigo', bg: 'bg-indigo/10', glow: 'bg-indigo shadow-[0_0_12px_rgba(92,115,255,0.8)]' };
      case 'awaiting_transfer':
      case 'pending':
        // Ödeme öncesi / bekleniyor
        return { label: t('customerDashboard.status.pending') || 'ÖDEME BEKLENİYOR', color: 'text-amber-500', bg: 'bg-amber-500/10', glow: 'bg-amber-500 shadow-[0_0_12px_rgba(245,158,11,0.8)]' };
      default:
        return { label: t('customerDashboard.status.processing'), color: 'text-gray-500', bg: 'bg-white/5', glow: 'bg-gray-500' };
    }
  };

  return (
    <div className="min-h-screen bg-deep-black pt-32 pb-20 relative overflow-hidden font-outfit dark">
      <Helmet>
        <title>Dashboard - ErpolArt</title>
        <meta name="robots" content="noindex, follow" />
      </Helmet>


      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo/10 blur-[120px] rounded-full animate-pulse" style={{ animationDuration: '8s' }} />
        <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-cyan/10 blur-[120px] rounded-full animate-pulse" style={{ animationDuration: '12s' }} />
      </div>

      <div className="container mx-auto px-6 md:px-12 max-w-7xl relative z-10">
        <ScrollReveal direction="up">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-16">
            <div className="flex items-center gap-5">
              <div className="w-20 h-20 rounded-2xl bg-indigo/10 border border-indigo/20 flex items-center justify-center text-indigo font-black text-2xl overflow-hidden shadow-2xl relative">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo/20 to-transparent opacity-50" />
                {avatarUrl ? (
                  <img 
                    src={avatarUrl} 
                    alt={displayName} 
                    className="w-full h-full object-cover relative z-10" 
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                ) : null}
                <span className={`relative z-10 ${avatarUrl ? 'hidden' : 'flex'}`}>{displayName.charAt(0).toUpperCase()}</span>
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight italic uppercase">
                  {t('dashboard.welcome') || 'WELCOME'}, {displayName.split(' ')[0]}
                </h1>
                <p className="text-muted-text text-[10px] font-black uppercase tracking-[0.3em] mt-2 flex items-center gap-2">
                  <Clock size={12} className="text-indigo" />
                  {t('customerDashboard.nodeIdentityActive')} • {memberSinceFormatted}
                </p>
              </div>
            </div>
            <Link to="/templates" className="flex items-center gap-2 px-8 py-4 rounded-2xl bg-indigo text-pure-white font-black text-[10px] uppercase tracking-[0.3em] hover:shadow-2xl hover:shadow-indigo/40 transition-all group self-start">
              {t('dashboard.browseTemplates') || 'New Acquisition'}
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </ScrollReveal>

        <ScrollReveal direction="up">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-16">
            {[
              { icon: ShoppingBag, label: t('customerDashboard.stats.purchasedAssets'), value: orders.length, color: 'text-indigo', bg: 'bg-indigo/10' },
              { icon: Layers, label: t('customerDashboard.stats.activeSystems'), value: activeSites, color: 'text-cyan', bg: 'bg-cyan/10' },
              { icon: User, label: t('customerDashboard.stats.protocolStatus'), value: t('customerDashboard.stats.verified'), color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
            ].map((stat, i) => (
              <div key={i} className="bg-surface border border-border-adaptive rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden group hover:border-indigo/40 transition-all">
                <div className={`w-12 h-12 rounded-xl ${stat.bg} flex items-center justify-center ${stat.color} mb-6`}><stat.icon size={22} /></div>
                <div className="text-4xl font-black text-white mb-1 tracking-tighter leading-none">{stat.value}</div>
                <div className="text-[9px] font-black text-muted-text uppercase tracking-[0.2em]">{stat.label}</div>
              </div>
            ))}
          </div>
        </ScrollReveal>

        <ScrollReveal direction="up">
          <div className="mb-20">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <div className="w-1.5 h-6 bg-indigo rounded-full" />
                <h2 className="text-[11px] font-black text-muted-text uppercase tracking-[0.3em]">{t('customerDashboard.sections.assets')}</h2>
              </div>
              <div className="h-px flex-1 bg-border-adaptive ml-8 hidden md:block" />
            </div>

            {loading ? (
              <div className="grid grid-cols-1 gap-4">
                {[...Array(2)].map((_, i) => <div key={i} className="h-32 bg-surface border border-border-adaptive rounded-3xl animate-pulse" />)}
              </div>
            ) : orders.length === 0 ? (
              <div className="py-20 text-center bg-surface border border-dashed border-border-adaptive rounded-[3rem]">
                <ShoppingBag size={48} className="text-muted-text mx-auto mb-6 opacity-20" />
                <p className="text-muted-text font-medium mb-6">{t('customerDashboard.noAssets')}</p>
                <Link to="/templates" className="text-indigo font-black uppercase tracking-[0.2em] text-[10px] hover:underline">{t('customerDashboard.exploreArchitecture')}</Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {orders.map((order) => {
                  const status = getStatusConfig(order.status);
                  return (
                    <div key={order.id} className="p-6 md:p-8 rounded-[2.5rem] bg-surface border border-border-adaptive hover:border-indigo/40 transition-all group flex flex-col md:flex-row items-center gap-8 shadow-2xl relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-64 h-64 bg-indigo/5 blur-[80px] rounded-full translate-x-1/2 -translate-y-1/2" />

                      <div className="w-24 h-16 md:w-32 md:h-20 rounded-2xl overflow-hidden bg-surface-adaptive border border-border-adaptive shrink-0 relative z-10 flex items-center justify-center">
                        {order.templates?.preview_image ? (
                          <img src={order.templates.preview_image} alt="Project" className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity" />
                        ) : (
                          <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-br from-indigo/10 to-cyan/10 opacity-50" />
                            <div className="relative z-10 flex flex-col items-center gap-1">
                              <Hexagon size={28} className="text-indigo-400 opacity-60 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500" />
                              <div className="text-[6px] font-black text-muted-text uppercase tracking-widest group-hover:text-indigo-400 transition-colors">SAAS_ARCH</div>
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="flex-1 min-w-0 relative z-10 text-center md:text-left">
                        <div className="flex flex-col md:flex-row md:items-center gap-3 mb-2">
                          <h3 className="text-xl font-black text-white italic uppercase tracking-tighter truncate pr-2">
                            {order.templates?.name || order.project_name || order.subscription_plan || t('customerDashboard.premiumDigitalAsset')}
                          </h3>
                          <span className={`px-2 py-1 rounded-md ${status.bg} ${status.color} text-[8px] font-black uppercase tracking-widest flex items-center gap-2 w-fit mx-auto md:mx-0`}>
                            <div className={`w-1.5 h-1.5 rounded-full ${status.glow}`} /> {status.label}
                          </span>
                        </div>
                        <div className="flex flex-wrap justify-center md:justify-start gap-4 text-[9px] font-bold text-muted-text uppercase tracking-widest">
                          <div className="flex items-center gap-2">
                            <Clock size={12} className="text-indigo" />
                            {order.created_at ? new Date(order.created_at).toLocaleDateString(i18n.language) : '---'}
                          </div>
                          <div className="flex items-center gap-2">
                            <ShoppingBag size={12} className="text-cyan" />
                            ORDER_ID: {order.id.split('-')[0].toUpperCase()}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-10 relative z-10 shrink-0">
                        <div className="text-right">
                          <div className="text-2xl font-black text-white leading-none mb-1">
                            {order.amount ? `$${order.amount.toLocaleString()}` : t('customerDashboard.paid')}
                          </div>
                          <div className="text-[8px] font-black text-muted-text uppercase tracking-widest">{t('customerDashboard.investmentValue')}</div>
                        </div>
                        <Link to={`/order-success/${order.id}`} className="w-12 h-12 rounded-2xl bg-surface-adaptive border border-border-adaptive flex items-center justify-center text-white hover:bg-indigo hover:border-indigo transition-all group/btn">
                          <ArrowRight size={20} className="group-hover/btn:translate-x-1 transition-transform" />
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </ScrollReveal>

        <ScrollReveal direction="up">
          <div className="mb-20">
            <h2 className="text-[11px] font-black text-muted-text uppercase tracking-[0.2em] mb-8">{t('customerDashboard.sections.shortcuts')}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {[
                { icon: Layers, title: t('customerDashboard.actions.explore.title'), desc: t('customerDashboard.actions.explore.desc'), link: '/templates', color: 'indigo' },
                { icon: User, title: t('customerDashboard.actions.identity.title'), desc: t('customerDashboard.actions.identity.desc'), link: '/account', color: 'cyan' },
                { icon: Settings, title: t('customerDashboard.actions.support.title'), desc: t('customerDashboard.actions.support.desc'), link: '/contact', color: 'violet' },
              ].map((action, i) => (
                <Link key={i} to={action.link} className="group bg-surface border border-border-adaptive rounded-[2rem] p-8 hover:border-indigo/40 transition-all relative overflow-hidden shadow-sm">
                  <div className="w-12 h-12 rounded-xl bg-surface-adaptive flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform"><action.icon size={22} /></div>
                  <h3 className="text-white font-black text-sm mb-2 uppercase italic">{action.title}</h3>
                  <p className="text-muted-text text-[10px] italic font-medium leading-relaxed">{action.desc}</p>
                </Link>
              ))}
            </div>
          </div>
        </ScrollReveal>
      </div>
    </div>
  );
};

export default CustomerDashboard;