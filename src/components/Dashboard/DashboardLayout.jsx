import React, { useState, useEffect } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { Lock } from 'lucide-react';

export default function DashboardLayout() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loginLoading, setLoginLoading] = useState(false);

    useEffect(() => {
        // Check session on mount
        const verifySession = async () => {
            try {
                const res = await fetch('/api/dashboard/verify');
                if (res.ok) {
                    setIsAuthenticated(true);
                }
            } catch (err) {
                console.error("Verification error", err);
            } finally {
                setLoading(false);
            }
        };
        verifySession();
    }, []);

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoginLoading(true);
        setError('');

        try {
            const res = await fetch('/api/dashboard/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ password })
            });

            if (res.ok) {
                setIsAuthenticated(true);
            } else {
                const data = await res.json();
                setError(data.error || 'Login failed');
            }
        } catch (err) {
            setError('An error occurred. Please try again.');
        } finally {
            setLoginLoading(false);
        }
    };

    const handleLogout = async () => {
        try {
            await fetch('/api/dashboard/logout', { method: 'POST' });
            setIsAuthenticated(false);
        } catch (err) {
            console.error("Logout error", err);
        }
    };

    if (loading) {
        return <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center text-gold font-display animate-pulse">Verifying Access...</div>;
    }

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4 selection:bg-gold selection:text-black">
                <div className="bg-[#111] border border-white/10 p-8 rounded-2xl w-full max-w-md shadow-2xl">
                    <div className="flex justify-center mb-6">
                        <div className="w-16 h-16 bg-gold/10 text-gold rounded-full flex items-center justify-center border border-gold/20">
                            <Lock size={28} />
                        </div>
                    </div>
                    <h2 className="text-2xl font-bold text-white text-center mb-2 font-display">Admin Access</h2>
                    <p className="text-gray-400 text-center text-sm mb-8">Enter the dashboard password to continue</p>
                    
                    <form onSubmit={handleLogin} className="space-y-4">
                        <div>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-gold transition-colors text-center tracking-[0.2em]"
                                placeholder="••••••••"
                                required
                            />
                        </div>
                        
                        {error && (
                            <p className="text-red-400 text-xs text-center">{error}</p>
                        )}
                        
                        <button
                            type="submit"
                            disabled={loginLoading}
                            className="w-full px-6 py-4 bg-gold text-black font-bold uppercase tracking-widest text-xs hover:bg-white transition-all rounded-xl disabled:opacity-50"
                        >
                            {loginLoading ? 'Verifying...' : 'Unlock Dashboard'}
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white selection:bg-gold selection:text-black">
            <header className="border-b border-white/10 bg-[#111] py-4 px-6 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <h1 className="text-xl font-bold font-display text-gold tracking-widest">PORTFOLIO ADMIN</h1>
                    <button 
                        onClick={handleLogout}
                        className="text-xs text-gray-400 hover:text-white uppercase tracking-widest"
                    >
                        Lock
                    </button>
                </div>
            </header>
            <main className="max-w-7xl mx-auto py-8 px-6">
                <Outlet />
            </main>
        </div>
    );
}
