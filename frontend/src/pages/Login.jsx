import React, { useState } from 'react';
import TideVaultLogo from '../assets/TideVaultLogo';

const DEMO_USERS = [
    {
        username: "admin@tidevault.in",
        password: "TVault2026",
    },
    {
        username: "demo@tidevault.in",
        password: "demo123",
    },
    { username: "tidevault", password: "coast2026" },
    { username: "judge@tidevault.in", password: "TVault2026" }
];

export default function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const handleLogin = (e) => {
        e.preventDefault();
        const user = DEMO_USERS.find(u => u.username === username && u.password === password);
        if (user) {
            sessionStorage.setItem('tv_user', JSON.stringify({
                username: user.username,
                loginTime: new Date().toISOString()
            }));
            window.location.reload();
        } else {
            setError('Invalid credentials. Please use demo accounts.');
        }
    };

    return (
        <div className="min-h-screen bg-[#0a1628] flex items-center justify-center p-6 relative overflow-hidden">
            {/* Background Grid */}
            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#1a9e8f 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>

            <div className="w-full max-w-[420px] glass-card p-10 relative z-10 border-t-2 border-teal-500/50">
                <div className="flex flex-col items-center mb-8">
                    <TideVaultLogo size={52} showText={true} />
                    <p className="text-[10px] font-mono text-text-500 uppercase tracking-[0.3em] mt-4 italic">Maharashtra Coast Geospatial Intelligence</p>
                    <div className="w-16 h-px bg-teal-500/30 mt-6"></div>
                </div>

                <form onSubmit={handleLogin} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-mono text-text-500 uppercase tracking-widest">Username</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full bg-ocean-950 border border-ocean-800 rounded-xl px-4 py-3 text-sm text-text-100 outline-none focus:border-teal-500/50 transition-colors"
                            placeholder="e.g. analyst@tidevault.in"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-mono text-text-500 uppercase tracking-widest">Password</label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-ocean-950 border border-ocean-800 rounded-xl px-4 py-3 text-sm text-text-100 outline-none focus:border-teal-500/50 transition-colors"
                                placeholder="••••••••"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-mono text-teal-500 uppercase font-bold"
                            >
                                {showPassword ? "Hide" : "Show"}
                            </button>
                        </div>
                    </div>

                    {error && <p className="text-coral-500 text-[11px] font-mono animate-pulse">{error}</p>}

                    <button
                        type="submit"
                        className="w-full bg-gradient-to-r from-teal-600 to-teal-400 py-4 rounded-xl text-ocean-950 font-bold text-xs uppercase tracking-[0.2em] shadow-lg shadow-teal-500/20 hover:scale-[1.02] transition-transform"
                    >
                        Enter System
                    </button>
                </form>

                <div className="mt-10 text-center">
                    <p className="text-[9px] font-mono text-text-600 uppercase tracking-widest">Secured Demo Environment · TideVault v1.0 · 2026</p>
                </div>
            </div>
        </div>
    );
}
