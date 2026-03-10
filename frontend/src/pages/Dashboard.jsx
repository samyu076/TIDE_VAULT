import React, { useState, useEffect } from 'react';
import { useCoast } from '../CoastContext';
import { FALLBACK_ALL_ISSUES } from '../data/fallbackData';
import { AlertTriangle, Database, ShieldCheck, Clock, Activity } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup, Circle, Polyline, Polygon, LayersControl, LayerGroup } from 'react-leaflet';
import TideVaultLogo from '../assets/TideVaultLogo';
import 'leaflet/dist/leaflet.css';

const StatCard = ({ icon: Icon, label, value, subValue, color }) => (
    <div className="glass-card p-5 group hover:scale-[1.02] transition-all duration-300 border-t-2" style={{ borderTopColor: color }}>
        <div className="flex justify-between items-start mb-4">
            <div className={`p-2 rounded-lg bg-ocean-900 border border-ocean-700`}>
                <Icon size={20} style={{ color }} />
            </div>
            <div className="text-[10px] font-mono text-text-500 uppercase tracking-widest">{label}</div>
        </div>
        <div className="text-3xl font-display font-bold text-text-100 mb-1">{value}</div>
        <div className="text-[10px] font-mono text-text-500 uppercase italic">{subValue}</div>
    </div>
);

const LoadingScreen = ({ message }) => (
    <div style={{
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        height: '60vh', gap: '20px',
    }}>
        <TideVaultLogo size={52} showText={false} />
        <p style={{
            fontFamily: "'IBM Plex Mono'",
            color: '#7aa3b8', fontSize: '12px',
            letterSpacing: '3px'
        }}>
            {message}
        </p>
        <div style={{
            width: '100px', height: '2px',
            background: 'rgba(26,158,143,0.15)',
            borderRadius: '1px', overflow: 'hidden'
        }}>
            <div style={{
                height: '100%',
                background: 'linear-gradient(90deg,#1a9e8f,#22c4b3)',
                animation: 'scanProgress 1.8s ease-in-out infinite'
            }} />
        </div>
    </div>
);

export default function Dashboard() {
    const { datasets, loading: contextLoading } = useCoast();
    const [issues, setIssues] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchIssues = async () => {
            try {
                const response = await fetch('http://localhost:8000/api/datasets/all/issues');
                if (!response.ok) throw new Error();
                const data = await response.json();
                setIssues(data.length > 0 ? data : FALLBACK_ALL_ISSUES);
            } catch (err) {
                console.warn("Issue API failed, using fallback feed.");
                setIssues(FALLBACK_ALL_ISSUES);
            } finally {
                setTimeout(() => setLoading(false), 1000);
            }
        };
        fetchIssues();
    }, []);

    const criticalCount = issues.filter(i => i.severity === 'CRITICAL').length;
    const highCount = issues.filter(i => i.severity === 'HIGH').length;

    if (contextLoading && loading) {
        return <LoadingScreen message="TideVault — Initialising..." />;
    }

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            {/* Hero Header via Logo */}
            <div className="flex justify-center py-4">
                <TideVaultLogo size={50} showText={true} />
            </div>

            {/* Top Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard icon={Database} label="Total Assets" value={datasets.length} subValue="Maharashtra Coast · EPSG:32643 · 2026" color="#2dd4bf" />
                <StatCard icon={AlertTriangle} label="Critical Breaches" value={criticalCount} subValue={`${highCount} High Risk Alerts`} color="#e05c3a" />
                <StatCard icon={ShieldCheck} label="Compliance Avg" value="68%" subValue="ISO 19115 Standard" color="#fbbf24" />
                <StatCard icon={Clock} label="Data Freshness" value="7.2y" subValue="Avg Survey Age" color="#3b82f6" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Critical Issues Feed */}
                <div className="lg:col-span-5 flex flex-col space-y-4">
                    <div className="flex justify-between items-center px-2">
                        <h3 className="text-sm font-display italic uppercase tracking-widest flex items-center">
                            <AlertTriangle size={16} className="text-coral-500 mr-2" />
                            Critical Issues Feed
                        </h3>
                        <span className="badge border-coral-500 text-coral-500 animate-pulse">{criticalCount} URGENT</span>
                    </div>
                    <div className="glass-card flex-1 overflow-y-auto max-h-[500px] custom-scrollbar">
                        {issues.map((issue, idx) => (
                            <div
                                key={idx}
                                className="p-4 border-b border-ocean-800 last:border-0 hover:bg-ocean-900/30 transition-colors group relative overflow-hidden"
                            >
                                <div className={`absolute left-0 top-0 bottom-0 w-1 ${issue.severity === 'CRITICAL' ? 'bg-coral-500' :
                                    issue.severity === 'HIGH' ? 'bg-gold-500' : 'bg-blue-500'
                                    }`}></div>
                                <div className="flex justify-between items-start mb-1">
                                    <span className={`text-[10px] font-bold font-mono tracking-tighter ${issue.severity === 'CRITICAL' ? 'text-coral-500' : 'text-text-500'
                                        }`}>{issue.type}</span>
                                    <span className="text-[9px] font-mono text-text-500 uppercase">{issue.dataset}</span>
                                </div>
                                <p className="text-xs text-text-200 leading-snug">{issue.detail}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Live Map Preview with Overlay */}
                <div className="lg:col-span-7 h-[552px] glass-card overflow-hidden relative">
                    <div className="absolute top-4 left-4 z-[1000] space-y-2">
                        <div className="bg-ocean-950/90 border border-ocean-700 px-3 py-1.5 rounded-full flex items-center space-x-2 backdrop-blur-md">
                            <div className="w-2 h-2 rounded-full bg-teal-500 animate-ping"></div>
                            <span className="text-[10px] font-mono text-teal-400 font-bold uppercase italic tracking-widest">Multi-Layer Intelligence Active</span>
                        </div>
                    </div>

                    {/* Map Legend */}
                    <div className="absolute bottom-6 left-4 z-[1000] bg-ocean-950/90 border border-ocean-700 p-3 rounded-xl backdrop-blur-md text-[9px] font-mono space-y-2">
                        <div className="flex items-center space-x-2"><div className="w-3 h-1 bg-[#e05c3a]"></div><span className="text-text-400">HTL 2011</span></div>
                        <div className="flex items-center space-x-2"><div className="w-3 h-1 bg-[#1a9e8f]"></div><span className="text-text-400">HTL 2019</span></div>
                        <div className="flex items-center space-x-2"><div className="w-3 h-1 border border-dashed border-[#c9a84c]"></div><span className="text-text-400">CRZ Boundary</span></div>
                        <div className="flex items-center space-x-2"><div className="w-3 h-3 bg-[#ff4444] opacity-30"></div><span className="text-text-400">NDZ Zone</span></div>
                        <div className="flex items-center space-x-2"><div className="w-3 h-1 bg-[#4a9eff]"></div><span className="text-text-400">LTL 2019</span></div>
                    </div>

                    <MapContainer center={[19.29, 72.87]} zoom={11} style={{ height: '100%', width: '100%', filter: 'invert(100%) hue-rotate(180deg) brightness(0.9) contrast(0.9)' }}>
                        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

                        <LayersControl position="topright">
                            <LayersControl.Overlay checked name="HTL 2011 (Orange)">
                                <LayerGroup>
                                    <Polyline
                                        positions={[[19.28, 72.86], [19.29, 72.87], [19.30, 72.88], [19.31, 72.89]]}
                                        pathOptions={{ color: '#e05c3a', weight: 3 }}
                                    >
                                        <Popup className="custom-popup">
                                            <div className="font-mono text-[10px] p-1">
                                                <div className="font-bold border-b border-ocean-700 mb-1 text-teal-300">HTL SEGMENT (2011)</div>
                                                <div>OID: 636</div>
                                                <div>Length: 4630m</div>
                                                <div className="text-gold-500 italic mt-1">Found in: Location A</div>
                                            </div>
                                        </Popup>
                                    </Polyline>
                                </LayerGroup>
                            </LayersControl.Overlay>

                            <LayersControl.Overlay checked name="HTL 2019 (Teal)">
                                <LayerGroup>
                                    <Polyline
                                        positions={[[19.281, 72.861], [19.291, 72.871], [19.301, 72.881], [19.311, 72.891]]}
                                        pathOptions={{ color: '#1a9e8f', weight: 4 }}
                                    >
                                        <Popup>
                                            <div className="font-mono text-[10px] p-1">
                                                <div className="font-bold border-b border-ocean-700 mb-1 text-teal-300">HTL SEGMENT (2019)</div>
                                                <div>OID: 636</div>
                                                <div>Length: 4630m</div>
                                                <div className="text-green-500 italic mt-1">Status: STABLE TRACE</div>
                                            </div>
                                        </Popup>
                                    </Polyline>
                                </LayerGroup>
                            </LayersControl.Overlay>

                            <LayersControl.Overlay checked name="CRZ Boundary (Gold)">
                                <LayerGroup>
                                    <Polyline
                                        positions={[[19.28, 72.865], [19.29, 72.875], [19.30, 72.885], [19.31, 72.895]]}
                                        pathOptions={{ color: '#c9a84c', weight: 2, dashArray: '5, 10' }}
                                    />
                                </LayerGroup>
                            </LayersControl.Overlay>

                            <LayersControl.Overlay checked name="NDZ Zone (Red)">
                                <LayerGroup>
                                    <Polygon
                                        positions={[[19.285, 72.865], [19.295, 72.875], [19.29, 72.885], [19.28, 72.875]]}
                                        pathOptions={{ color: '#ff4444', fillColor: '#ff4444', fillOpacity: 0.2, weight: 1 }}
                                    >
                                        <Popup>
                                            <div className="font-mono text-[10px] p-1">
                                                <div className="font-bold text-coral-500 underline mb-1">NDZ VIOLATION CHECK</div>
                                                <div>Type: No Development Zone</div>
                                                <div>Status: AUDIT PENDING</div>
                                            </div>
                                        </Popup>
                                    </Polygon>
                                </LayerGroup>
                            </LayersControl.Overlay>

                            <LayersControl.Overlay name="LTL 2019 (Blue)">
                                <LayerGroup>
                                    <Polyline
                                        positions={[[19.27, 72.85], [19.28, 72.86], [19.29, 72.87], [19.30, 72.88]]}
                                        pathOptions={{ color: '#4a9eff', weight: 2 }}
                                    />
                                </LayerGroup>
                            </LayersControl.Overlay>
                        </LayersControl>

                        {datasets.map(d => (
                            <Marker key={d.id} position={[19.07 + (Math.random() * 0.1), 72.87 + (Math.random() * 0.1)]}>
                                <Popup>
                                    <div className="font-mono text-xs p-1">
                                        <div className="font-bold border-b border-gray-200 mb-1">{d.site}</div>
                                        <div className="text-teal-600 italic uppercase tracking-tighter">{d.id}</div>
                                    </div>
                                </Popup>
                            </Marker>
                        ))}
                    </MapContainer>
                </div>
            </div>
        </div>
    );
}
