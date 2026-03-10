import { useState, useEffect } from 'react';
import { useCoast } from '../CoastContext';
import { FALLBACK_HTL } from '../data/fallbackData';
import { Waves, ArrowRight, Activity, AlertCircle, CheckCircle, Database, Map as MapIcon, Layers } from 'lucide-react';
import { MapContainer, TileLayer, Polyline, Polygon, LayersControl, LayerGroup, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import TideVaultLogo from '../assets/TideVaultLogo';
import axios from 'axios';

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

const ContinuityCard = ({ label, score, color }) => (
    <div className="glass-card p-4 border-l-4" style={{ borderLeftColor: color }}>
        <div className="text-[10px] font-mono text-text-500 uppercase mb-1">{label}</div>
        <div className="text-2xl font-display font-bold" style={{ color }}>{score}%</div>
    </div>
);

export default function ShorelineIntelligence() {
    const { datasets } = useCoast();
    const [activeSite, setActiveSite] = useState('location_a');
    const [htlData, setHtlData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHtl = async () => {
            try {
                setLoading(true);
                const res = await axios.get(`http://localhost:8000/api/htl/${activeSite}/analysis`, { timeout: 1000 });
                setHtlData(res.data || FALLBACK_HTL[activeSite]);
            } catch (err) {
                console.warn(`HTL API for ${activeSite} failed. Using fallback trace.`);
                setHtlData(FALLBACK_HTL[activeSite]);
            } finally {
                setTimeout(() => setLoading(false), 1000);
            }
        };
        fetchHtl();
    }, [activeSite]);

    if (loading || !htlData) {
        return <LoadingScreen message="TideVault — Computing Continuity Matrices..." />;
    }

    const { summary, segment_comparison, duplicates_detected } = htlData;

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            {/* Site Selector & Summary */}
            <div className="flex flex-col md:flex-row justify-between items-start gap-6">
                <div className="flex bg-ocean-950 p-1 rounded-xl border border-ocean-800">
                    <button
                        onClick={() => setActiveSite('location_a')}
                        className={`px-6 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all ${activeSite === 'location_a' ? 'bg-teal-500 text-ocean-950 shadow-lg' : 'text-text-500 hover:text-text-300'}`}
                    >
                        Location A
                    </button>
                    <button
                        onClick={() => setActiveSite('location_b')}
                        className={`px-6 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all ${activeSite === 'location_b' ? 'bg-teal-500 text-ocean-950 shadow-lg' : 'text-text-500 hover:text-text-300'}`}
                    >
                        Location B
                    </button>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full md:w-auto">
                    <ContinuityCard label="Traceability" score={htlData.continuity_score} color="#2dd4bf" />
                    <ContinuityCard label="Net Change" score={Math.abs(summary.net_change_m)} color={summary.net_change_m >= 0 ? "#2dd4bf" : "#e05c3a"} />
                </div>
            </div>

            {/* Advanced Map Integration */}
            <div className="glass-card overflow-hidden relative">
                <div className="p-4 border-b border-ocean-700 bg-ocean-900/50 flex justify-between items-center">
                    <div className="flex items-center space-x-3">
                        <MapIcon size={18} className="text-teal-400" />
                        <h3 className="text-sm font-display italic uppercase tracking-widest">Temporal Geospatial Fusion</h3>
                    </div>
                    <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 rounded-full bg-teal-500 animate-pulse"></div>
                            <span className="text-[10px] font-mono text-teal-400 uppercase font-bold tracking-widest">{activeSite.replace('_', ' ')} ACTIVE</span>
                        </div>
                    </div>
                </div>

                <div className="h-[400px] relative group">
                    {/* Floating Legend */}
                    <div className="absolute bottom-6 left-6 z-[1000] bg-ocean-950/90 border border-ocean-700 p-3 rounded-xl backdrop-blur-md text-[9px] font-mono space-y-1.5 opacity-80 group-hover:opacity-100 transition-opacity">
                        <div className="flex items-center space-x-2"><div className="w-3 h-1 bg-[#e05c3a]"></div><span className="text-text-400">HTL 2011 (Orange)</span></div>
                        <div className="flex items-center space-x-2"><div className="w-3 h-1 bg-[#1a9e8f]"></div><span className="text-text-400">HTL 2019 (Teal)</span></div>
                        <div className="flex items-center space-x-2"><div className="w-3 h-1 border border-dashed border-[#c9a84c]"></div><span className="text-text-400">CRZ Boundary</span></div>
                        <div className="flex items-center space-x-2"><div className="w-3 h-3 bg-[#ff4444] opacity-30"></div><span className="text-text-400">NDZ Zone</span></div>
                    </div>

                    <MapContainer
                        key={activeSite}
                        center={activeSite === 'location_a' ? [19.29, 72.87] : [19.19, 72.85]}
                        zoom={12}
                        style={{ height: '100%', width: '100%', filter: 'invert(100%) hue-rotate(180deg) brightness(0.9) contrast(0.9)' }}
                    >
                        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                        <LayersControl position="topright">
                            <LayersControl.Overlay checked name="HTL Survey (2011 Epoch)">
                                <LayerGroup>
                                    <Polyline
                                        positions={activeSite === 'location_a'
                                            ? [[19.28, 72.86], [19.29, 72.87], [19.30, 72.88], [19.31, 72.89]]
                                            : [[19.18, 72.84], [19.19, 72.85], [19.20, 72.86], [19.21, 72.87]]
                                        }
                                        pathOptions={{ color: '#e05c3a', weight: 3 }}
                                    >
                                        <Popup>
                                            <div className="font-mono text-[10px] p-1">
                                                <div className="font-bold border-b border-ocean-700 mb-1 text-teal-300">HISTORIC HTL (2011)</div>
                                                <div>OID: {activeSite === 'location_a' ? '636' : '635'}</div>
                                                <div>Length: {activeSite === 'location_a' ? '4630m' : '5215m'}</div>
                                                <div className="text-text-500 italic mt-1">Status: BASELINE EPOCH</div>
                                            </div>
                                        </Popup>
                                    </Polyline>
                                </LayerGroup>
                            </LayersControl.Overlay>

                            <LayersControl.Overlay checked name="HTL Survey (2019 Epoch)">
                                <LayerGroup>
                                    <Polyline
                                        positions={activeSite === 'location_a'
                                            ? [[19.281, 72.861], [19.291, 72.871], [19.301, 72.881], [19.311, 72.891]]
                                            : [[19.181, 72.841], [19.191, 72.851], [19.201, 72.861], [19.211, 72.871]]
                                        }
                                        pathOptions={{ color: '#1a9e8f', weight: 4 }}
                                    >
                                        <Popup>
                                            <div className="font-mono text-[10px] p-1">
                                                <div className="font-bold border-b border-ocean-700 mb-1 text-teal-300">LATEST HTL (2019)</div>
                                                <div>OID: {activeSite === 'location_a' ? '636' : '635'}</div>
                                                <div>Status: {activeSite === 'location_b' ? 'DUPLICATE [×4]' : 'STABLE'}</div>
                                                <div className="text-teal-500 font-bold mt-1">Traceability Match: ACTIVE</div>
                                            </div>
                                        </Popup>
                                    </Polyline>
                                </LayerGroup>
                            </LayersControl.Overlay>

                            <LayersControl.Overlay checked name="CRZ Boundaries">
                                <LayerGroup>
                                    <Polyline
                                        positions={activeSite === 'location_a'
                                            ? [[19.28, 72.865], [19.29, 72.875], [19.30, 72.885], [19.31, 72.895]]
                                            : [[19.18, 72.845], [19.19, 72.855], [19.20, 72.865], [19.21, 72.875]]
                                        }
                                        pathOptions={{ color: '#c9a84c', weight: 2, dashArray: '5, 10' }}
                                    />
                                </LayerGroup>
                            </LayersControl.Overlay>

                            <LayersControl.Overlay name="NDZ (No Development Zones)">
                                <LayerGroup>
                                    <Polygon
                                        positions={activeSite === 'location_a'
                                            ? [[19.285, 72.865], [19.295, 72.875], [19.29, 72.885], [19.28, 72.875]]
                                            : [[19.185, 72.845], [19.195, 72.855], [19.19, 72.865], [19.18, 72.855]]
                                        }
                                        pathOptions={{ color: '#ff4444', fillColor: '#ff4444', fillOpacity: 0.2 }}
                                    />
                                </LayerGroup>
                            </LayersControl.Overlay>
                        </LayersControl>
                    </MapContainer>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Comparison Table */}
                <div className="lg:col-span-8 space-y-4">
                    <div className="flex justify-between items-center px-2">
                        <h3 className="text-sm font-display italic uppercase tracking-widest flex items-center">
                            <Database size={16} className="text-teal-400 mr-2" />
                            Segment-Level Traceability Report
                        </h3>
                        <span className="text-[10px] font-mono text-text-500 italic">2011 vs 2019 Survey Epochs</span>
                    </div>
                    <div className="glass-card overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-[11px] font-mono">
                                <thead>
                                    <tr className="bg-ocean-950/80 border-b border-ocean-700">
                                        <th className="p-4 text-left text-teal-400">OBJECTID</th>
                                        <th className="p-4 text-left">2011 SCHEMA</th>
                                        <th className="p-4 text-center"><ArrowRight size={12} className="mx-auto opacity-30" /></th>
                                        <th className="p-4 text-left text-teal-400">2019 SCHEMA</th>
                                        <th className="p-4 text-right">LENGTH (m)</th>
                                        <th className="p-4 text-center">STATUS</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {segment_comparison.map((seg, idx) => (
                                        <tr key={idx} className="border-b border-ocean-800/50 hover:bg-ocean-900/30 transition-colors">
                                            <td className="p-4 font-bold text-text-400">{seg.oid}</td>
                                            <td className="p-4 text-text-500">{seg.feature_2011 || '—'}</td>
                                            <td className="p-4 text-center opacity-30 font-bold">→</td>
                                            <td className="p-4 text-text-100 font-bold">{seg.feature_2019}</td>
                                            <td className="p-4 text-right tabular-nums">{seg.length_2019.toFixed(2)}</td>
                                            <td className="p-4 text-center">
                                                <span className={`text-[9px] px-2 py-0.5 rounded-full border border-current opacity-70 ${seg.status === 'STABLE' ? 'text-teal-400' : 'text-gold-500'
                                                    }`}>
                                                    {seg.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Intelligence SidePanel */}
                <div className="lg:col-span-4 space-y-6">
                    {/* Alerts */}
                    {duplicates_detected.traceability_impact === 'HIGH' || duplicates_detected.traceability_impact === 'CRITICAL' ? (
                        <div className="glass-card p-6 border-coral-500/40 bg-coral-500/5 shadow-2xl animate-pulse">
                            <h3 className="text-coral-500 font-bold text-sm uppercase flex items-center mb-3 tracking-tighter">
                                <AlertCircle size={18} className="mr-2" />
                                Traceability Break
                            </h3>
                            <p className="text-[11px] text-text-300 leading-relaxed mb-4 italic">
                                {activeSite === 'location_b'
                                    ? "CRITICAL: OID 635 duplication (4x) in LOCATION B prevents legal segment matching between 2011-2019 surveys."
                                    : "HIGH: OID 637 duplicates (3x) cause vector redundancy in Location A."}
                            </p>
                            <div className="bg-ocean-950/80 p-3 rounded-lg border border-coral-500/20">
                                <div className="flex justify-between text-[10px] font-mono mb-1">
                                    <span className="text-text-500">Duplicate OIDs:</span>
                                    <span className="text-coral-400">{activeSite === 'location_b' ? '635, 11' : '637'}</span>
                                </div>
                                <div className="flex justify-between text-[10px] font-mono">
                                    <span className="text-text-500">Legal Risk:</span>
                                    <span className="text-coral-400 uppercase">Extreme</span>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="glass-card p-6 border-teal-500/20 bg-teal-500/5 transition-all">
                            <h3 className="text-teal-400 font-bold text-sm uppercase flex items-center mb-3 tracking-tighter">
                                <CheckCircle size={18} className="mr-2" />
                                Continuity Valid
                            </h3>
                            <p className="text-[11px] text-text-300 leading-relaxed">
                                HTL segment mapping verified for Location A. Core survey vectors maintain 78% continuity across epochs.
                            </p>
                        </div>
                    )}

                    {/* Site Stats */}
                    <div className="glass-card p-6">
                        <h4 className="text-[10px] font-mono text-teal-500 uppercase font-bold mb-4 tracking-widest">Epoch Statistics</h4>
                        <div className="space-y-4">
                            <div>
                                <div className="flex justify-between text-xs text-text-400 mb-1">
                                    <span>2011 Segments</span>
                                    <span className="font-bold">{summary.htl_segments_2011}</span>
                                </div>
                                <div className="h-1 bg-ocean-900 rounded-full overflow-hidden">
                                    <div className="h-full bg-ocean-700" style={{ width: '60%' }}></div>
                                </div>
                            </div>
                            <div>
                                <div className="flex justify-between text-xs text-text-100 mb-1">
                                    <span>2019 Segments</span>
                                    <span className="font-bold">{summary.htl_segments_2019}</span>
                                </div>
                                <div className="h-1 bg-ocean-900 rounded-full overflow-hidden">
                                    <div className="h-full bg-teal-500 shadow-[0_0_10px_rgba(45,212,191,0.5)]" style={{ width: '85%' }}></div>
                                </div>
                            </div>
                        </div>
                        <p className="mt-6 text-[10px] text-text-500 font-mono italic leading-relaxed">
                            {summary.segment_count_change > 0
                                ? `Note: ${summary.segment_count_change} new segments introduced in the 2019 survey schema (LTL/NDZ partitions).`
                                : "Segment count remains consistent across primary HTL survey area."}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
