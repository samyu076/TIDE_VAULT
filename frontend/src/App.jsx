import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import { CoastProvider } from './CoastContext';
import TideVaultLogo from './assets/TideVaultLogo';
import Dashboard from './pages/Dashboard';
import Catalogue from './pages/Catalogue';
import TRIEngine from './pages/TRIEngine';
import ShorelineIntelligence from './pages/ShorelineIntelligence';
import CRZCompliance from './pages/CRZCompliance';
import MetadataVault from './pages/MetadataVault';
import Governance from './pages/Governance';
import Login from './pages/Login';
import {
    LayoutDashboard,
    Database,
    Zap,
    Waves,
    ShieldAlert,
    FileBox,
    Gavel,
    LogOut
} from 'lucide-react';

const SidebarItem = ({ to, icon: Icon, label, badge }) => {
    const location = useLocation();
    const active = location.pathname === to;
    return (
        <Link
            to={to}
            className={`sidebar-item flex items-center space-x-3 p-3 rounded-xl transition-all duration-300 ${active
                ? 'bg-teal-500 text-ocean-950 font-bold shadow-lg shadow-teal-500/20'
                : 'text-text-400 hover:bg-ocean-900 hover:text-text-100'
                }`}
        >
            <Icon size={20} />
            <span className="text-xs uppercase tracking-widest">{label}</span>
            {badge && (
                <div className={`ml-auto px-2 py-0.5 rounded-full text-[9px] font-bold ${
                    active ? 'bg-ocean-950 text-coral-500' : 'bg-coral-500/10 text-coral-500 border border-coral-500/30'
                }`}>
                    {badge}
                </div>
            )}
            {!badge && active && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-ocean-950"></div>}
        </Link>
    );
};

export default function App() {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const savedUser = sessionStorage.getItem('tv_user');
        if (savedUser) {
            setUser(JSON.parse(savedUser));
        }
    }, []);

    const handleLogout = () => {
        sessionStorage.removeItem('tv_user');
        window.location.reload();
    };

    if (!user) {
        return <Login />;
    }

    return (
        <CoastProvider>
            <BrowserRouter basename={import.meta.env.DEV ? '/' : '/TIDE_VAULT'}>
                <div className="flex min-h-screen bg-ocean-950 text-text-200">

                    {/* Sidebar */}
                    <aside className="w-64 border-r border-ocean-800 bg-ocean-950 flex flex-col fixed h-screen z-50">
                        <div style={{
                            padding: '20px 16px 20px',
                            borderBottom: '1px solid rgba(26,158,143,0.2)',
                            marginBottom: '12px'
                        }}>
                            <TideVaultLogo size={34} showText={true} />
                            <div style={{
                                fontFamily: "'IBM Plex Mono', monospace",
                                fontSize: '8px',
                                color: '#1a9e8f',
                                letterSpacing: '2px',
                                marginTop: '8px',
                                marginLeft: '50px'
                            }}>

                            </div>
                        </div>

                        <nav className="flex-1 px-4 space-y-2 overflow-y-auto custom-scrollbar">
                            <SidebarItem to="/" icon={LayoutDashboard} label="Dashboard" badge="18" />
                            <SidebarItem to="/catalogue" icon={Database} label="Catalogue" />
                            <SidebarItem to="/tri" icon={Zap} label="TRI Engine" />
                            <SidebarItem to="/shoreline" icon={Waves} label="Shoreline" />
                            <SidebarItem to="/crz" icon={ShieldAlert} label="CRZ Engine" />
                            <SidebarItem to="/metadata" icon={FileBox} label="Metadata Vault" />
                            <SidebarItem to="/governance" icon={Gavel} label="Governance" />
                        </nav>

                        <div className="p-4 border-t border-ocean-800">
                            <button
                                onClick={handleLogout}
                                className="w-full flex items-center space-x-3 p-3 text-text-500 hover:text-teal-400 hover:bg-ocean-900 rounded-xl transition-all"
                            >
                                <LogOut size={20} />
                                <span className="text-xs uppercase tracking-widest font-mono">End Session</span>
                            </button>
                        </div>
                    </aside>

                    {/* Main Content */}
                    <main className="flex-1 ml-64 min-h-screen flex flex-col">
                        <header className="h-20 border-b border-ocean-800 glass backdrop-blur-md sticky top-0 z-40 px-8 flex items-center justify-between">
                            <div className="flex flex-col">
                                <div style={{
                                    fontFamily: "'IBM Plex Mono', monospace",
                                    fontSize: '10px',
                                    fontWeight: 'bold',
                                    color: '#1a9e8f',
                                    letterSpacing: '2px',
                                    textTransform: 'uppercase'
                                }}>
                                    Coastal Intelligence Framework
                                </div>
                                <div style={{
                                    fontFamily: "'IBM Plex Mono', monospace",
                                    fontSize: '9px',
                                    color: '#7aa3b8',
                                    letterSpacing: '1px',
                                    marginTop: '2px'
                                }}>
                                    Maharashtra Coast Geospatial Intelligence Network
                                </div>
                            </div>

                            <div className="flex items-center space-x-6">
                                <div style={{
                                    display: 'flex', alignItems: 'center', gap: '8px',
                                    padding: '4px 12px',
                                    background: 'rgba(26,158,143,0.1)',
                                    border: '1px solid rgba(26,158,143,0.2)',
                                    borderRadius: '20px'
                                }}>
                                    <div style={{
                                        width: '8px', height: '8px',
                                        borderRadius: '50%', background: '#22c55e'
                                    }} />
                                    <span style={{
                                        fontFamily: "'IBM Plex Mono'",
                                        fontSize: '11px', color: '#7aa3b8',
                                        letterSpacing: '1px'
                                    }}>
                                        SYSTEM STATUS: ACTIVE
                                    </span>
                                </div>
                            </div>
                        </header>

                        <div className="p-10 flex-1">
                            <Routes>
                                <Route path="/" element={<Dashboard />} />
                                <Route path="/catalogue" element={<Catalogue />} />
                                <Route path="/tri" element={<TRIEngine />} />
                                <Route path="/shoreline" element={<ShorelineIntelligence />} />
                                <Route path="/crz" element={<CRZCompliance />} />
                                <Route path="/metadata" element={<MetadataVault />} />
                                <Route path="/governance" element={<Governance />} />
                            </Routes>
                        </div>

                        <footer className="p-10 border-t border-ocean-800 mt-20 bg-ocean-950/50">
                            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                                <TideVaultLogo size={24} showText={true} />
                                <div className="text-[10px] font-mono text-text-600 uppercase tracking-widest text-center">
                                    TideVault | Coastal Intelligence | Maharashtra, India
                                </div>
                            </div>
                        </footer>
                    </main>
                </div>
            </BrowserRouter>
        </CoastProvider>
    );
}
