import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { ShoppingBag, Edit3, Settings, AlertCircle, CheckCircle2, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import useAuthStore from '../store/authStore';
import ScrollReveal from '../components/ScrollReveal';
import { supabase } from '../lib/supabase';

const MyPurchases = () => {
  const { t } = useTranslation();
  const { user } = useAuthStore();
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPurchases = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        // Fetch orders and join with template details
        const { data, error } = await supabase
          .from('orders')
          .select(`
            id,
            template_id,
            status,
            edit_count,
            created_at,
            updated_at,
            amount,
            templates:template_id (
              name,
              category,
              preview_image,
              image_url
            )
          `)
          .or(`email.eq.${user.email},user_id.eq.${user.id}`)
          .eq('project_code', 'erpolart')
          .order('created_at', { ascending: false });

        if (error) throw error;

        // Map data to local state structure
        const mappedData = (data || []).map(p => ({
          _id: p.id,
          templateId: p.template_id,
          name: p.templates?.name || 'Unknown Template',
          category: p.templates?.category || 'Template',
          previewImage: p.templates?.image_url || p.templates?.preview_image,
          purchaseDate: new Date(p.created_at).toLocaleDateString(),
          editCount: p.edit_count || 0,
          lastUpdated: p.updated_at,
          status: p.status
        }));

        setPurchases(mappedData);
      } catch (err) {
        console.error('Error fetching purchases:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPurchases();
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen bg-deep-black flex items-center justify-center">
        <div className="w-12 h-12 border-2 border-indigo/20 border-t-indigo rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-deep-black pt-32 pb-20">
      <Helmet>
        <title>Satın Almalarım - ErpolArt</title>
        <meta name="robots" content="noindex, follow" />
      </Helmet>
      <div className="container mx-auto px-6 md:px-12 max-w-6xl">
        <ScrollReveal direction="up">
          <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter mb-4 italic uppercase">
                {t('dashboard.myPurchases')}
              </h1>
              <p className="text-muted-text text-sm font-medium italic tracking-tight">
                {t('purchases.subtitle')}
              </p>
            </div>
            <div className="flex items-center gap-4 bg-surface border border-border-adaptive px-6 py-4 rounded-2xl shadow-sm">
              <ShoppingBag className="text-indigo" size={20} />
              <div className="text-left">
                <span className="block text-[10px] font-black text-muted-text uppercase tracking-widest">{t('purchases.totalAssets') || 'Total Assets'}</span>
                <span className="block text-xl font-black text-white">{purchases.length}</span>
              </div>
            </div>
          </div>
        </ScrollReveal>

        {purchases.length === 0 ? (
          <ScrollReveal direction="up">
            <div className="bg-surface border border-border-adaptive rounded-[3rem] p-20 text-center relative overflow-hidden shadow-sm">
              <div className="absolute top-0 right-0 w-64 h-64 bg-indigo/5 blur-[100px] rounded-full" />
              <ShoppingBag size={64} className="text-muted-text/20 mx-auto mb-8" />
              <h2 className="text-2xl font-black text-white mb-4 italic uppercase">{t('purchases.emptyTitle')}</h2>
              <p className="text-muted-text text-sm max-w-sm mx-auto mb-10 leading-relaxed font-light">
                {t('purchases.emptyDesc')}
              </p>
              <Link
                to="/templates"
                className="inline-flex items-center gap-3 px-10 py-5 rounded-2xl bg-indigo text-pure-white font-black text-[11px] uppercase tracking-[0.2em] hover:shadow-2xl hover:shadow-indigo/40 transition-all group"
              >
                {t('purchases.browseCTA')}
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </ScrollReveal>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {purchases.map((purchase) => {
              const remainingEdits = 3 - purchase.editCount;

              return (
                <ScrollReveal key={purchase._id} direction="up">
                  <div className="bg-surface border border-border-adaptive rounded-[2.5rem] p-8 md:p-10 flex flex-col lg:flex-row items-center gap-10 hover:border-indigo/40 transition-all group shadow-2xl shadow-indigo-500/0 hover:shadow-indigo-500/5">
                    {/* Template Preview */}
                    <div className="w-full lg:w-48 h-32 rounded-3xl overflow-hidden border border-border-adaptive shrink-0 relative">
                      <img src={purchase.previewImage} alt={purchase.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                      <div className="absolute inset-0 bg-black/40" />
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0 text-center lg:text-left">
                      <div className="flex flex-col lg:flex-row lg:items-center gap-2 mb-3">
                        <h3 className="text-2xl font-black text-white italic tracking-tighter uppercase">{purchase.name}</h3>
                        <span className="hidden lg:block text-muted-text/30">•</span>
                        <span className="text-xs font-bold text-muted-text uppercase tracking-widest">{purchase.category}</span>
                      </div>
                      <div className="flex flex-wrap justify-center lg:justify-start gap-4 text-[10px] font-black uppercase tracking-widest">
                        <div className="flex items-center gap-2 text-indigo">
                          <ShoppingBag size={12} />
                          <span>Purchased: {purchase.purchaseDate}</span>
                        </div>
                        <div className="flex items-center gap-2 text-cyan">
                          <CheckCircle2 size={12} />
                          <span>{t('common.proceedToWorkspace')}</span>
                        </div>
                      </div>
                    </div>

                    {/* Edit Control */}
                    <div className="flex flex-col items-center lg:items-end gap-4 w-full lg:w-auto">
                      <div className="flex flex-col items-center lg:items-end">
                        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg mb-2 ${remainingEdits > 0 ? 'bg-indigo/10 text-indigo' : 'bg-red-500/10 text-red-500'}`}>
                          {remainingEdits > 0 ? <Edit3 size={12} /> : <AlertCircle size={12} />}
                          <span className="text-[9px] font-black uppercase tracking-widest">
                            {remainingEdits > 0 ? t('orderSuccess.form.editLimit', { count: remainingEdits }) : t('orderSuccess.form.editLimitReached')}
                          </span>
                        </div>
                        {purchase.lastUpdated && (
                          <span className="text-[8px] text-muted-text uppercase font-bold tracking-tighter">Last update: {new Date(purchase.lastUpdated).toLocaleDateString()}</span>
                        )}
                      </div>

                      <Link
                        to={`/order-success/${purchase._id}`}
                        className={`flex items-center gap-3 px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] transition-all
                          ${remainingEdits > 0
                            ? 'bg-indigo text-pure-white hover:bg-white hover:text-deep-black shadow-xl'
                            : 'bg-white/5 text-muted-text border border-border-adaptive cursor-not-allowed'}`}
                      >
                        <Settings size={16} className={remainingEdits > 0 ? "animate-spin-slow" : ""} />
                        {remainingEdits > 0 ? t('common.edit') : t('orderSuccess.form.editLimitReached')}
                      </Link>
                    </div>
                  </div>
                </ScrollReveal>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyPurchases;
