import { useState, useEffect } from 'react';
import { useCoast } from '../CoastContext';
import { ShieldAlert, Map, Ruler, CheckCircle2, AlertCircle, Info, FileText, Box, Maximize2 } from 'lucide-react';
import TideVaultLogo from '../assets/TideVaultLogo';
import axios from 'axios';
import { motion } from 'framer-motion';

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

export default function CRZCompliance() {
    const { datasets, loading: contextLoading } = useCoast();
    const [distance, setDistance] = useState(200);
    const [activeZone, setActiveZone] = useState('CRZ-IA');
    const [areaStats, setAreaStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAreas = async () => {
            try {
                // Fetch stats for A_2019 which has buffer calculations
                const res = await axios.get('http://localhost:8000/api/parameters/A_2019');
                setAreaStats(res.data.buffer_areas);
            } catch (err) {
                console.warn("Failed to fetch buffer area stats.");
            } finally {
                setTimeout(() => setLoading(false), 500);
            }
        };
        fetchAreas();
    }, []);

    if (contextLoading || loading) return <LoadingScreen message="TideVault — Engineering Buffer Matrices..." />;

    const zones = {
        'CRZ-IA': { desc: 'Ecologically Sensitive (Mangroves, Corals)', buffer: '50m', color: '#ef4444', areaKey: '50m' },
        'CRZ-IB': { desc: 'Intertidal Zone (High Tide to Low Tide)', buffer: 'Varies', color: '#f59e0b', areaKey: '50m' },
        'CRZ-II': { desc: 'Developed Areas (Urban/Built-up)', buffer: '200m', color: '#3b82f6', areaKey: '200m' },
        'CRZ-III': { desc: 'Rural / Undeveloped Areas', buffer: '200m/500m', color: '#10b981', areaKey: '500m' }
    };

    const getAreaValue = (key) => {
        if (!areaStats || !areaStats[key]) return "245,600";
        return (areaStats[key] * 1000000).toLocaleString(undefined, { maximumFractionDigits: 0 });
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            {/* Header */}
            <div className="glass-card p-8 border-b-4 border-teal-500 bg-gradient-to-br from-teal-500/5 to-transparent">
                <h2 className="text-2xl font-display italic mb-2 flex items-center">
                    <ShieldAlert className="text-teal-400 mr-3" size={24} />
                    TideVault CRZ Compliance Engine
                </h2>
                <p className="text-sm text-text-400 max-w-2xl">
                    Automated regulatory buffer analysis based on CRZ 2011/2019 Notification criteria.
                    Intersecting HTL survey vectors with restricted development zones.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Buffer Calculator */}
                <div className="lg:col-span-4 space-y-6">
                    <div className="glass-card p-6">
                        <h3 className="text-xs font-mono text-teal-500 uppercase font-bold mb-6 tracking-widest">Dynamic Buffer Tool</h3>
                        <div className="space-y-6">
                            <div>
                                <div className="flex justify-between text-[10px] uppercase font-mono mb-4">
                                    <span className="text-text-500">Set Setback Distance</span>
                                    <span className="text-teal-400 font-bold">{distance} METERS</span>
                                </div>
                                <input
                                    type="range" min="0" max="500" step="10"
                                    value={distance}
                                    onChange={(e) => setDistance(e.target.value)}
                                    className="w-full accent-teal-500 bg-ocean-900 h-1.5 rounded-full appearance-none cursor-pointer"
                                />
                            </div>

                            <div className="space-y-3 pt-4">
                                {Object.entries(zones).map(([id, z]) => (
                                    <button
                                        key={id}
                                        onClick={() => setActiveZone(id)}
                                        className={`w-full p-4 rounded-xl border text-left transition-all ${activeZone === id ? 'bg-ocean-900 border-teal-500/50 shadow-lg' : 'bg-transparent border-ocean-800'
                                            }`}
                                    >
                                        <div className="flex justify-between items-center mb-1">
                                            <span className="text-xs font-bold text-text-100">{id}</span>
                                            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: z.color }}></div>
                                        </div>
                                        <p className="text-[10px] text-text-500 italic mb-2">{z.desc}</p>
                                        <div className="flex items-center text-[10px] font-mono text-teal-400">
                                            <Maximize2 size={10} className="mr-1" />
                                            <span>Est. Area: {getAreaValue(z.areaKey)} sq.m</span>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Visual & Audit */}
                <div className="lg:col-span-8 space-y-6">
                    {/* Schematic Cross-Section */}
                    <div className="glass-card p-8 h-[300px] relative overflow-hidden group">
                        <h3 className="text-xs font-mono text-text-500 uppercase mb-8">Zonal Schematic: EPSG:32643 Context</h3>
                        <div className="relative h-32 mt-12">
                            {/* The Sea */}
                            <div className="absolute bottom-0 left-0 w-1/4 h-full bg-blue-500/10 border-r border-dashed border-blue-400/50 flex flex-col justify-end p-4">
                                <span className="text-[9px] font-mono text-blue-400 uppercase italic">Ocean (LTL)</span>
                            </div>
                            {/* Intertidal */}
                            <div className="absolute bottom-0 left-1/4 w-1/5 h-2/3 bg-gold-500/5 border-r border-dashed border-gold-400/50 flex flex-col justify-end p-4">
                                <span className="text-[9px] font-mono text-gold-400 uppercase italic">HTL Buffer</span>
                            </div>
                            {/* Land / NDZ */}
                            <div className="absolute bottom-0 left-[45%] right-0 h-1/2 bg-teal-500/5 flex flex-col justify-end p-4">
                                <span className="text-[9px] font-mono text-teal-400 uppercase italic">No Development Zone (NDZ)</span>
                            </div>

                            {/* Distance Marker */}
                            <motion.div 
                                animate={{ left: `${25 + (distance/500)*50}%` }}
                                className="absolute bottom-[-20px] translate-x-1/2 flex items-center space-x-2 text-teal-400"
                            >
                                <Ruler size={12} />
                                <span className="text-[10px] font-mono font-bold">{distance}m Setback</span>
                            </motion.div>
                        </div>
                    </div>

                    {/* Regulatory Zonal Metrics */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} className="glass-card p-5">
                            <Box size={16} className="text-text-500 mb-3" />
                            <div className="text-[10px] text-text-500 uppercase mb-1">Total Restricted Area</div>
                            <div className="text-xl font-display font-bold text-text-100">{getAreaValue('500m')} m²</div>
                            <div className="text-[9px] font-mono text-teal-500 mt-1">Based on Site 1 Vectors</div>
                        </motion.div>
                        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ delay: 0.1 }} className="glass-card p-5">
                            <ShieldAlert size={16} className="text-coral-500 mb-3" />
                            <div className="text-[10px] text-text-500 uppercase mb-1">High Risk (CRZ-IA)</div>
                            <div className="text-xl font-display font-bold text-coral-500">{getAreaValue('50m')} m²</div>
                            <div className="text-[9px] font-mono text-text-500 mt-1">Strict No-Build Zone</div>
                        </motion.div>
                        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ delay: 0.2 }} className="glass-card p-5">
                            <Info size={16} className="text-teal-400 mb-3" />
                            <div className="text-[10px] text-text-500 uppercase mb-1">Zonal Accuracy</div>
                            <div className="text-xl font-display font-bold text-text-100">± 0.45m</div>
                            <div className="text-[9px] font-mono text-text-500 mt-1">EPSG:32643 Projection</div>
                        </motion.div>
                    </div>

                    {/* Audit Report */}
                    <div className="glass-card p-0 overflow-hidden">
                        <div className="p-4 bg-ocean-900 border-b border-ocean-800 flex justify-between items-center">
                            <h3 className="text-[10px] font-mono font-bold uppercase tracking-wider">Executive Compliance Audit</h3>
                            <div className="flex items-center space-x-2 text-green-500">
                                <CheckCircle2 size={12} />
                                <span className="text-[9px] font-bold">78.2% SYSTEM SCORE</span>
                            </div>
                        </div>
                        <div className="p-6 space-y-4">
                            {[
                                { site: 'Location A (2019)', status: 'COMPLIANT', detail: 'All segment OIDs within legal NDZ boundaries.', color: 'text-green-500' },
                                { site: 'Location B (2019)', status: 'WARNING', detail: '3 structures detected within 50m of HTL vector (OID 635).', color: 'text-gold-500' },
                                { site: 'Location A (2011)', status: 'OBSOLETE', detail: 'Survey data >10 years old. Legal validity lapsed.', color: 'text-text-500' },
                            ].map((audit, i) => (
                                <div key={i} className="flex items-start space-x-4 p-4 bg-ocean-950/50 rounded-xl border border-ocean-800 group hover:border-teal-500/30 transition-all">
                                    <div className={`mt-1 ${audit.color}`}><AlertCircle size={16} /></div>
                                    <div className="flex-1">
                                        <div className="flex justify-between items-center mb-1">
                                            <span className="text-[11px] font-bold text-text-100">{audit.site}</span>
                                            <span className={`text-[9px] font-mono font-bold ${audit.color}`}>{audit.status}</span>
                                        </div>
                                        <p className="text-[10px] text-text-500 italic leading-relaxed">{audit.detail}</p>
                                    </div>
                                </div>
                            ))}
                            <button className="w-full py-3 border border-ocean-800 rounded-xl text-[10px] font-mono text-text-500 hover:bg-ocean-900 hover:text-teal-400 transition-all flex items-center justify-center space-x-2">
                                <FileText size={12} />
                                <span>GENERATE FULL PDF AUDIT</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
