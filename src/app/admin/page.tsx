"use client";

import { useState, useEffect } from "react";
import { BarChart3, Activity, CheckCircle, XCircle, RefreshCw, Lock, ShieldCheck } from "lucide-react";

interface UsageLog {
    id: string;
    timestamp: Date;
    scenario: string;
    aspectRatio: string;
    imageCount: number;
    status: "success" | "error";
    errorMessage?: string;
}

interface Stats {
    total: number;
    successCount: number;
    recentLogs: UsageLog[];
}

export default function AdminPage() {
    const [password, setPassword] = useState("");
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [stats, setStats] = useState<Stats | null>(null);
    const [error, setError] = useState<string | null>(null);

    const fetchStats = async (pwd: string) => {
        setIsLoading(true);
        setError(null);

        try {
            const res = await fetch("/api/admin/stats", {
                headers: { "x-admin-password": pwd }
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || "Failed to fetch stats");
            }

            setStats(data);
            setIsAuthenticated(true);
        } catch (err: any) {
            setError(err.message);
            setIsAuthenticated(false);
        } finally {
            setIsLoading(false);
        }
    };

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        fetchStats(password);
    };

    const handleRefresh = () => {
        fetchStats(password);
    };

    if (!isAuthenticated) {
        return (
            <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4">
                <div className="glass-panel p-8 w-full max-w-md">
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 bg-blue-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                            <Lock className="w-8 h-8 text-blue-400" />
                        </div>
                        <h1 className="text-2xl font-bold text-white mb-2">Admin Panel</h1>
                        <p className="text-slate-400 text-sm">API kullanım istatistiklerini görüntüle</p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-4">
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Admin Şifresi"
                            className="w-full p-4 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />

                        {error && (
                            <div className="p-3 bg-red-500/20 border border-red-500/30 rounded-lg text-red-300 text-sm">
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={isLoading || !password}
                            className="w-full py-4 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-600 text-white font-bold rounded-xl transition-colors flex items-center justify-center gap-2"
                        >
                            {isLoading ? (
                                <RefreshCw className="animate-spin" size={20} />
                            ) : (
                                <ShieldCheck size={20} />
                            )}
                            Giriş Yap
                        </button>
                    </form>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4 md:p-8">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
                        <p className="text-slate-400">API Kullanım İstatistikleri</p>
                    </div>
                    <button
                        onClick={handleRefresh}
                        disabled={isLoading}
                        className="p-3 bg-white/10 hover:bg-white/20 rounded-xl text-white transition-colors"
                    >
                        <RefreshCw className={isLoading ? "animate-spin" : ""} size={20} />
                    </button>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    <div className="glass-panel p-6">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
                                <BarChart3 className="text-blue-400" size={24} />
                            </div>
                            <div>
                                <p className="text-slate-400 text-sm">Toplam Üretim</p>
                                <p className="text-3xl font-bold text-white">{stats?.total || 0}</p>
                            </div>
                        </div>
                    </div>

                    <div className="glass-panel p-6">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
                                <CheckCircle className="text-green-400" size={24} />
                            </div>
                            <div>
                                <p className="text-slate-400 text-sm">Başarılı</p>
                                <p className="text-3xl font-bold text-white">{stats?.successCount || 0}</p>
                            </div>
                        </div>
                    </div>

                    <div className="glass-panel p-6">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-red-500/20 rounded-xl flex items-center justify-center">
                                <XCircle className="text-red-400" size={24} />
                            </div>
                            <div>
                                <p className="text-slate-400 text-sm">Başarısız</p>
                                <p className="text-3xl font-bold text-white">{(stats?.total || 0) - (stats?.successCount || 0)}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Recent Activity */}
                <div className="glass-panel p-6">
                    <div className="flex items-center gap-3 mb-6">
                        <Activity className="text-blue-400" size={20} />
                        <h2 className="text-xl font-bold text-white">Son Aktiviteler</h2>
                    </div>

                    {stats?.recentLogs && stats.recentLogs.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="text-left text-slate-400 text-sm border-b border-white/10">
                                        <th className="pb-3 font-medium">Tarih</th>
                                        <th className="pb-3 font-medium">Senaryo</th>
                                        <th className="pb-3 font-medium">Boyut</th>
                                        <th className="pb-3 font-medium">Görsel</th>
                                        <th className="pb-3 font-medium">Durum</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {stats.recentLogs.map((log: any) => (
                                        <tr key={log.id} className="border-b border-white/5 text-slate-300">
                                            <td className="py-3 text-sm">
                                                {new Date(log.timestamp).toLocaleString("tr-TR")}
                                            </td>
                                            <td className="py-3">{log.scenario}</td>
                                            <td className="py-3 text-sm text-slate-400">{log.aspectRatio}</td>
                                            <td className="py-3">{log.imageCount}</td>
                                            <td className="py-3">
                                                {log.status === "success" ? (
                                                    <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded-full">
                                                        Başarılı
                                                    </span>
                                                ) : (
                                                    <span className="px-2 py-1 bg-red-500/20 text-red-400 text-xs rounded-full">
                                                        Hata
                                                    </span>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="text-center py-12 text-slate-500">
                            <Activity size={48} className="mx-auto mb-4 opacity-30" />
                            <p>Henüz aktivite yok</p>
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
}
