import { Shield } from 'lucide-react';

const AdminSettings = () => {
  return (
    <div>
      <div className="mb-10">
        <h1 className="text-3xl font-black text-pure-white tracking-tight mb-2">Settings</h1>
        <p className="text-gray-500 text-sm font-medium">Sistem ayarlarını buradan yönetebilirsiniz.</p>
      </div>

      <div className="bg-[#0f0f18] border border-white/5 rounded-2xl p-8">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 rounded-xl bg-indigo/10 border border-indigo/20 flex items-center justify-center text-indigo">
            <Shield size={24} />
          </div>
          <div>
            <h2 className="text-lg font-black text-pure-white">System Info</h2>
            <p className="text-xs text-gray-500">ErpolArt Backend v1.0</p>
          </div>
        </div>

        <div className="space-y-4">
          {[
            { label: 'API Endpoint', value: '/api' },
            { label: 'Database', value: 'Supabase (PostgreSQL)' },
            { label: 'Auth', value: 'Supabase Auth' },
            { label: 'Environment', value: 'Development' },
          ].map((item, i) => (
            <div key={i} className="flex items-center justify-between py-3 border-b border-white/5 last:border-0">
              <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">{item.label}</span>
              <span className="text-sm font-bold text-pure-white bg-[#0a0a0f] px-4 py-1.5 rounded-lg border border-white/5">{item.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;
