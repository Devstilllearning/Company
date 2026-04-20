import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  TrendingUp, 
  Plus, 
  Trash2, 
  PieChart as PieChartIcon, 
  DollarSign, 
  Home, 
  Briefcase, 
  Bitcoin, 
  Wallet,
  X,
  ChevronRight,
  ArrowUpRight,
  ArrowDownRight,
  BarChart3
} from 'lucide-react';
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  Tooltip, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid 
} from 'recharts';
import { useAuth } from '../components/FirebaseProvider';
import { 
  collection, 
  query, 
  where, 
  onSnapshot, 
  addDoc, 
  deleteDoc, 
  doc, 
  serverTimestamp,
  orderBy
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase';

  const ASSET_CATEGORIES = [
  { name: 'Real Estate', icon: Home, color: '#fb7185' },
  { name: 'Stocks', icon: Briefcase, color: '#f43f5e' },
  { name: 'Crypto', icon: Bitcoin, color: '#e11d48' },
  { name: 'Cash', icon: Wallet, color: '#be123c' },
  { name: 'Other', icon: DollarSign, color: '#9f1239' }
];

export default function Portfolio() {
  const { user } = useAuth();
  const [assets, setAssets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newAsset, setNewAsset] = useState({ name: '', value: '', category: 'Cash' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, 'assets'),
      where('ownerUid', '==', user.uid),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      setAssets(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    }, (err) => handleFirestoreError(err, OperationType.LIST, 'assets'));

    return () => unsubscribe();
  }, [user]);

  const totalNetWorth = assets.reduce((sum, asset) => sum + (Number(asset.value) || 0), 0);

  const chartData = ASSET_CATEGORIES.map(cat => ({
    name: cat.name,
    value: assets
      .filter(a => a.category === cat.name)
      .reduce((sum, a) => sum + (Number(a.value) || 0), 0),
    color: cat.color
  })).filter(d => d.value > 0);

  // Projection data (simulated)
  const projectionData = Array.from({ length: 7 }, (_, i) => {
    const year = new Date().getFullYear() + i;
    const growthRate = 0.12; // 12% annual growth
    return {
      year: year.toString(),
      value: Math.round(totalNetWorth * Math.pow(1 + growthRate, i))
    };
  });

  const handleAddAsset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newAsset.name || !newAsset.value) return;

    setIsSubmitting(true);
    try {
      await addDoc(collection(db, 'assets'), {
        ownerUid: user.uid,
        name: newAsset.name,
        value: Number(newAsset.value),
        category: newAsset.category,
        createdAt: serverTimestamp()
      });
      setShowAddModal(false);
      setNewAsset({ name: '', value: '', category: 'Cash' });
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, 'assets');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteAsset = async (id: string) => {
    if (!window.confirm('Are you sure you want to remove this asset?')) return;
    try {
      await deleteDoc(doc(db, 'assets', id));
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, `assets/${id}`);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    },
    exit: {
      opacity: 0,
      y: -20,
      transition: { duration: 0.5 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.16, 1, 0.3, 1]
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-brand-soft">
        <div className="w-12 h-12 border-4 border-brand-strawberry/20 border-t-brand-strawberry rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="py-12 px-4 max-w-7xl mx-auto min-h-screen"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="flex flex-col md:flex-row items-center justify-between mb-12 gap-6">
        <div>
          <h1 className="text-4xl font-black mb-2 flex items-center gap-3 text-brand-deep">
            <TrendingUp className="w-10 h-10 text-brand-strawberry" />
            Wealth Portfolio
          </h1>
          <p className="text-brand-dark/50 font-medium">Track your journey to the BERRIONARE status</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block">
            <p className="text-[10px] font-bold uppercase tracking-widest text-brand-dark/30">Total Net Worth</p>
            <p className="text-2xl font-black text-brand-strawberry">${totalNetWorth.toLocaleString()}</p>
          </div>
          <button 
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-brand-strawberry text-white font-bold hover:opacity-90 transition-all shadow-lg shadow-brand-strawberry/20"
          >
            <Plus className="w-5 h-5" /> Add Asset
          </button>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Main Stats & Charts */}
        <div className="lg:col-span-2 space-y-12">
          {/* Charts Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Distribution Chart */}
            <motion.div variants={itemVariants} className="bento-card p-10 bg-white/40 border-brand-strawberry/10">
              <h3 className="text-xl font-black mb-10 flex items-center gap-3 tracking-tight uppercase tracking-[0.2em] text-brand-dark/30">
                <PieChartIcon className="w-5 h-5 text-brand-strawberry" /> Asset Distribution
              </h3>
              <div className="h-[280px] w-full">
                {chartData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={chartData}
                        cx="50%"
                        cy="50%"
                        innerRadius={70}
                        outerRadius={90}
                        paddingAngle={8}
                        dataKey="value"
                        stroke="none"
                      >
                        {chartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#fff', border: '1px solid rgba(251,113,133,0.1)', borderRadius: '16px', fontSize: '12px', fontWeight: 'bold' }}
                        itemStyle={{ color: '#000' }}
                        cursor={{ fill: 'transparent' }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-white/10 italic text-sm gap-4">
                    <div className="w-16 h-16 rounded-full border-2 border-dashed border-brand-strawberry/5 flex items-center justify-center">
                      <PieChartIcon className="w-6 h-6" />
                    </div>
                    No data to display
                  </div>
                )}
              </div>
              <div className="grid grid-cols-2 gap-4 mt-8">
                {ASSET_CATEGORIES.map(cat => {
                  const val = assets.filter(a => a.category === cat.name).reduce((sum, a) => sum + Number(a.value), 0);
                  if (val === 0) return null;
                  return (
                    <div key={cat.name} className="flex items-center gap-3 p-2 rounded-xl bg-brand-soft/50 border border-brand-strawberry/5">
                      <div className="w-3 h-3 rounded-full shadow-lg" style={{ backgroundColor: cat.color }} />
                      <span className="text-[10px] font-black uppercase tracking-widest text-brand-dark/40">{cat.name}</span>
                    </div>
                  );
                })}
              </div>
            </motion.div>

            {/* Growth Projection */}
            <motion.div variants={itemVariants} className="bento-card p-10 bg-white/40 border-brand-strawberry/10">
              <h3 className="text-xl font-black mb-10 flex items-center gap-3 tracking-tight uppercase tracking-[0.2em] text-brand-dark/30">
                <BarChart3 className="w-5 h-5 text-brand-deep" /> 7-Year Projection
              </h3>
              <div className="h-[280px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={projectionData}>
                    <defs>
                      <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#fb7185" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="#fb7185" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#fb718520" vertical={false} />
                    <XAxis 
                      dataKey="year" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: '#fb7185', fontSize: 10, fontWeight: 'bold' }} 
                    />
                    <YAxis hide />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#fff', border: '1px solid rgba(251,113,133,0.1)', borderRadius: '16px', fontSize: '12px', fontWeight: 'bold' }}
                      itemStyle={{ color: '#000' }}
                      formatter={(value: number) => [`$${value.toLocaleString()}`, 'Projected Value']}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="value" 
                      stroke="#fb7185" 
                      fillOpacity={1} 
                      fill="url(#colorValue)" 
                      strokeWidth={4}
                      animationDuration={2000}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-dark/20 text-center mt-8 italic">
                *Conservative 12% Annual BERRIONARE Strategy
              </p>
            </motion.div>
          </div>

          {/* Asset List */}
          <motion.div variants={itemVariants} className="bento-card p-10 bg-white/40 border-brand-strawberry/10">
            <div className="flex items-center justify-between mb-10">
              <h3 className="text-2xl font-black tracking-tighter text-brand-deep">Asset Inventory</h3>
              <span className="px-4 py-1.5 rounded-full bg-brand-strawberry/5 text-[10px] font-black uppercase tracking-widest text-brand-strawberry border border-brand-strawberry/5">
                {assets.length} Assets Total
              </span>
            </div>
            <div className="space-y-4">
              {assets.length > 0 ? (
                assets.map(asset => {
                  const categoryInfo = ASSET_CATEGORIES.find(c => c.name === asset.category) || ASSET_CATEGORIES[4];
                  const Icon = categoryInfo.icon;
                  return (
                    <div 
                      key={asset.id}
                      className="flex items-center justify-between p-6 rounded-3xl bg-brand-soft border border-brand-strawberry/5 hover:border-brand-strawberry/30 transition-all duration-500 group"
                    >
                      <div className="flex items-center gap-6">
                        <div className="p-4 rounded-2xl bg-brand-strawberry/10 group-hover:bg-brand-strawberry/20 transition-all duration-500">
                          <Icon className="w-6 h-6" style={{ color: categoryInfo.color }} />
                        </div>
                        <div>
                          <p className="font-black text-lg tracking-tight text-brand-deep">{asset.name}</p>
                          <p className="text-[10px] text-brand-dark/30 font-black uppercase tracking-widest">{asset.category}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-8">
                        <div className="text-right">
                          <p className="font-black text-xl tracking-tighter text-brand-deep">${Number(asset.value).toLocaleString()}</p>
                          <p className="text-[10px] text-green-500 font-black flex items-center justify-end gap-1 uppercase tracking-widest">
                            <ArrowUpRight className="w-3 h-3" /> +2.4%
                          </p>
                        </div>
                        <button 
                          onClick={() => handleDeleteAsset(asset.id)}
                          className="p-3 rounded-xl hover:bg-red-500/10 text-brand-dark/10 hover:text-red-500 transition-all duration-500 opacity-0 group-hover:opacity-100"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="py-20 text-center">
                  <div className="w-20 h-20 rounded-full bg-brand-strawberry/5 border border-dashed border-brand-strawberry/10 flex items-center justify-center mx-auto mb-6">
                    <DollarSign className="w-10 h-10 text-brand-strawberry/20" />
                  </div>
                  <p className="text-brand-dark/20 text-sm font-medium italic">No assets added yet. Start building your legacy.</p>
                </div>
              )}
            </div>
          </motion.div>
        </div>

        {/* Sidebar: Insights & Tips */}
        <div className="space-y-12">
          <motion.div variants={itemVariants} className="bento-card p-10 bg-brand-strawberry/5 border-brand-strawberry/20">
            <h3 className="text-xl font-black mb-10 tracking-tight uppercase tracking-[0.2em] text-brand-strawberry">Wealth Insights</h3>
            <div className="space-y-8">
              <div className="p-6 rounded-3xl bg-brand-soft border border-brand-strawberry/5 hover:border-green-500/30 transition-all duration-500">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 rounded-lg bg-green-500/10">
                    <TrendingUp className="w-4 h-4 text-green-500" />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-brand-dark/40">Top Performer</span>
                </div>
                <p className="text-lg font-black tracking-tight mb-1 text-brand-deep">Crypto Portfolio</p>
                <p className="text-[10px] text-green-500 font-black uppercase tracking-widest">Up 14.2% this month</p>
              </div>
              <div className="p-6 rounded-3xl bg-brand-soft border border-brand-strawberry/5 hover:border-red-500/30 transition-all duration-500">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 rounded-lg bg-red-500/10">
                    <ArrowDownRight className="w-4 h-4 text-red-500" />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-brand-dark/40">Action Required</span>
                </div>
                <p className="text-lg font-black tracking-tight mb-1 text-brand-deep">Cash Reserves</p>
                <p className="text-[10px] text-red-500 font-black uppercase tracking-widest">Inflation is eroding your 8% cash</p>
              </div>
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="bento-card p-10 bg-white/40 border-brand-strawberry/10">
            <h3 className="text-lg font-black mb-6 tracking-tight uppercase tracking-[0.2em] text-brand-dark/30 text-brand-deep">BERRIONARE Tip</h3>
            <p className="text-sm text-brand-dark/50 leading-relaxed italic font-medium">
              "True wealth is not just about the numbers in your bank account, but the freedom to pursue your purpose without constraint."
            </p>
            <div className="mt-10 pt-10 border-t border-brand-strawberry/5">
              <button className="w-full py-5 rounded-2xl bg-brand-soft hover:bg-brand-strawberry/10 transition-all duration-500 text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-3 border border-brand-strawberry/10 text-brand-deep">
                Download Annual Report <ChevronRight className="w-5 h-5 text-brand-strawberry" />
              </button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Add Asset Modal */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              onClick={() => setShowAddModal(false)}
              className="absolute inset-0 bg-brand-deep/20 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ 
                type: "spring",
                damping: 25,
                stiffness: 300,
                duration: 0.5
              }}
              className="relative w-full max-w-md bg-white p-8 rounded-[2.5rem] shadow-2xl border border-brand-strawberry/10"
            >
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-2xl font-black text-brand-deep">Add New Asset</h3>
                <button onClick={() => setShowAddModal(false)} className="p-2 hover:bg-brand-strawberry/10 rounded-full text-brand-strawberry">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleAddAsset} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-brand-strawberry">Asset Name</label>
                  <input 
                    type="text"
                    required
                    value={newAsset.name}
                    onChange={(e) => setNewAsset({ ...newAsset, name: e.target.value })}
                    placeholder="e.g., Bitcoin, Penthouse"
                    className="w-full bg-brand-soft border border-brand-strawberry/10 rounded-xl px-4 py-3 focus:outline-none focus:border-brand-strawberry transition-colors text-brand-deep"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-brand-strawberry">Value (USD)</label>
                  <input 
                    type="number"
                    required
                    value={newAsset.value}
                    onChange={(e) => setNewAsset({ ...newAsset, value: e.target.value })}
                    placeholder="0.00"
                    className="w-full bg-brand-soft border border-brand-strawberry/10 rounded-xl px-4 py-3 focus:outline-none focus:border-brand-strawberry transition-colors text-brand-deep"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-brand-strawberry">Category</label>
                  <select 
                    value={newAsset.category}
                    onChange={(e) => setNewAsset({ ...newAsset, category: e.target.value })}
                    className="w-full bg-brand-soft border border-brand-strawberry/10 rounded-xl px-4 py-3 focus:outline-none focus:border-brand-strawberry transition-colors appearance-none text-brand-deep"
                  >
                    {ASSET_CATEGORIES.map(cat => (
                      <option key={cat.name} value={cat.name} className="bg-white">{cat.name}</option>
                    ))}
                  </select>
                </div>
                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 rounded-xl bg-brand-strawberry text-white font-bold hover:opacity-90 transition-all flex items-center justify-center gap-2 disabled:opacity-50 shadow-lg shadow-brand-strawberry/30"
                >
                  {isSubmitting ? 'Adding...' : 'Add to Portfolio'}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
