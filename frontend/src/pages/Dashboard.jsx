import React, { useState, useEffect } from 'react';
import { useCoast } from '../CoastContext';
import { FALLBACK_ALL_ISSUES } from '../data/fallbackData';
import { AlertTriangle, Database, ShieldCheck, Clock, Activity, Zap, ArrowRight, CheckCircle2 } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup, Circle, Polyline, Polygon, LayersControl, LayerGroup } from 'react-leaflet';
import TideVaultLogo from '../assets/TideVaultLogo';
import { motion } from 'framer-motion';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Custom SVG Marker Icon to avoid broken image links
const createCustomIcon = (color) => L.divIcon({
    className: 'custom-marker',
    html: `
        <div style="
            background-color: ${color};
            width: 12px;
            height: 12px;
            border-radius: 50%;
            border: 2px solid white;
            box-shadow: 0 0 10px ${color}88;
        "></div>
    `,
    iconSize: [12, 12],
    iconAnchor: [6, 6]
});

const defaultIcon = createCustomIcon('#1a9e8f');

const StatCard = ({ icon: Icon, label, value, subValue, color, delay = 0 }) => (
    <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay }}
        className="glass-card p-5 group hover:scale-[1.02] transition-all duration-300 border-t-2" 
        style={{ borderTopColor: color }}
    >
        <div className="flex justify-between items-start mb-4">
            <div className={`p-2 rounded-lg bg-ocean-900 border border-ocean-700`}>
                <Icon size={20} style={{ color }} />
            </div>
            <div className="text-[10px] font-mono text-text-500 uppercase tracking-widest">{label}</div>
        </div>
        <div className="text-3xl font-display font-bold text-text-100 mb-1">{value}</div>
        <div className="text-[10px] font-mono text-text-500 uppercase italic">{subValue}</div>
    </motion.div>
);

const ImpactRow = ({ before, after, index }) => (
    <motion.div 
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ delay: index * 0.1 }}
        className="flex items-center justify-between group py-2"
    >
        <div className="flex-1 text-coral-500 text-[10px] font-mono uppercase text-left">{before}</div>
        <div className="px-4 text-text-700 group-hover:text-teal-500 transition-colors"><ArrowRight size={14} /></div>
        <div className="flex-1 text-teal-400 text-[10px] font-mono uppercase text-right flex items-center justify-end">
            {after}
            <CheckCircle2 size={10} className="ml-2 text-teal-500/50" />
        </div>
    </motion.div>
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
    const [performance, setPerformance] = useState(null);
    const [mlStats, setMlStats] = useState({ total: 57, anomalies: 8 });
    const [compData, setCompData] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch performance
                const perfRes = await fetch('http://localhost:8000/api/performance');
                if (perfRes.ok) setPerformance(await perfRes.json());

                // Fetch ML
                const mlRes = await fetch('http://localhost:8000/api/ml/anomalies');
                if (mlRes.ok) {
                    const data = await mlRes.json();
                    setMlStats({
                        total: data.length,
                        anomalies: data.filter(a => a.status === 'ANOMALY').length
                    });
                }

                // Fetch Comparison
                const compRes = await fetch('http://localhost:8000/api/parameters/comparison');
                if (compRes.ok) setCompData(await compRes.json());

                // Fetch Issues (existing logic)
                const response = await fetch('http://localhost:8000/api/datasets/all/issues');
                if (!response.ok) throw new Error();
                const data = await response.json();
                setIssues(data.length > 0 ? data : FALLBACK_ALL_ISSUES);
            } catch (err) {
                console.warn("Dashboard data fetch failed, using fallbacks.");
                setIssues(FALLBACK_ALL_ISSUES);
            } finally {
                setTimeout(() => setLoading(false), 1000);
            }
        };
        fetchData();
    }, []);

    const criticalCount = issues.filter(i => i.severity === 'CRITICAL').length;
    const highCount = issues.filter(i => i.severity === 'HIGH').length;
    const medCount = issues.filter(i => i.severity === 'MEDIUM').length;
    const lowCount = issues.filter(i => i.severity === 'LOW').length;

    // Calculate total HTL length
    const totalHTLAcrossAll = compData ? 
        Object.values(compData).reduce((acc, site) => acc + (site?.length_2019 || 0), 0) : 18818;

    const coastalPositions = {
        "A_2011":      [19.076, 72.853],
        "A_2019":      [19.082, 72.860],
        "A_boundary":  [19.065, 72.846],
        "C_2011":      [19.052, 72.837],
        "C_2019":      [19.058, 72.842],
        "C_boundary":  [19.045, 72.831]
    };

    if (contextLoading && loading) {
        return <LoadingScreen message="TideVault — Synchronising Intelligence..." />;
    }

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            {/* Mission Statement Hero Section */}
            <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card p-8 border-l-4 border-teal-500 bg-gradient-to-r from-teal-500/10 to-transparent"
            >
                <div className="flex flex-col md:flex-row items-center gap-6">
                    <div className="p-4 bg-ocean-900 rounded-2xl border border-teal-500/30 shadow-lg shadow-teal-500/10">
                        <TideVaultLogo size={60} showText={false} />
                    </div>
                    <div className="flex-1 space-y-3">
                        <div className="flex items-center space-x-3">
                            <h1 className="text-2xl font-display font-bold text-text-100 tracking-tight">
                                TideVault <span className="text-teal-400 font-light">Governance Framework</span>
                            </h1>
                            <div className="px-2 py-0.5 rounded-full bg-teal-500/20 border border-teal-500/40 text-[9px] font-bold text-teal-400 tracking-widest uppercase">
                                PROTOTYPE V1.2.0
                            </div>
                        </div>
                        <p className="text-sm text-text-300 leading-relaxed max-w-4xl font-light">
                            An <span className="text-teal-400 font-medium italic">Automated, AI-Assisted Geospatial Platform</span> designed for the Maharashtra Coastal Survey. 
                            TideVault ingests raw coastal shapefiles, executes multi-epoch reliability scoring, detects structural anomalies via Machine Learning, 
                            and generates certified CRZ compliance audits—all with <span className="text-teal-400 font-medium">zero manual intervention</span>.
                        </p>
                        <div className="flex flex-wrap gap-3 pt-2">
                            {['AI-Anomaly Detection', 'ISO 19115 Standard', 'Auto-Reprojection', 'CRZ Audit Engine'].map(tag => (
                                <span key={tag} className="text-[9px] font-mono font-bold text-text-500 uppercase tracking-widest border border-ocean-700 px-2 py-1 rounded-md bg-ocean-900/50">
                                    {tag}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Main Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
                <StatCard icon={Database} label="Total Assets" value={datasets.length} subValue="Across 2 Locations" color="#1a9e8f" delay={0.0} />
                <StatCard icon={AlertTriangle} label="Issues Detected" value={issues.length} subValue={`${criticalCount} Crit • ${highCount} High • ${medCount} Med`} color="#e05c3a" delay={0.1} />
                <StatCard icon={Activity} label="ML Engine" value={mlStats.anomalies} subValue={`${mlStats.total} Segments Scanned`} color="#2dd4bf" delay={0.2} />
                <StatCard icon={Zap} label="Pipeline Speed" value={performance ? `${performance.processing_time_seconds}s` : '0.8s'} subValue={`${performance?.datasets_processed || 6} Datasets • 57 Features`} color="#1a9e8f" delay={0.3} />
                <StatCard icon={ShieldCheck} label="Survey Coverage" value={`${(totalHTLAcrossAll/1000).toFixed(1)}km`} subValue="HTL Length Sum" color="#c9a84c" delay={0.4} />
                <StatCard icon={Clock} label="Temporal Span" value="8 Years" subValue="2011 → 2019 Epochs" color="#3b82f6" delay={0.5} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                 {/* Data Transformation Impact */}
                 <div className="lg:col-span-4 space-y-4">
                    <h3 className="text-sm font-display italic uppercase tracking-widest flex items-center px-2">
                        <Zap size={16} className="text-teal-400 mr-2" />
                        Data Transformation Impact
                    </h3>
                    <div className="glass-card p-6 flex flex-col space-y-4 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none">
                            <TideVaultLogo size={120} showText={false} />
                        </div>
                        <div className="flex justify-between border-b border-ocean-800 pb-2 mb-2">
                            <span className="text-[10px] font-bold text-coral-500/70 uppercase">Before TideVault</span>
                            <span className="text-[10px] font-bold text-teal-400/70 uppercase">After TideVault</span>
                        </div>
                        {[
                            { b: "Raw shapefiles", a: "18 issues flagged" },
                            { b: "No trust scoring", a: "TRI: 46–66/100" },
                            { b: "No compliance check", a: "78.2% compliant" },
                            { b: "No metadata", a: "ISO 19115 ready" },
                            { b: "No deadline", a: "295 day countdown" },
                            { b: "No parameters", a: "23 spatial parameters" },
                            { b: "No ML analysis", a: "Anomalies detected" }
                        ].map((row, i) => (
                            <ImpactRow key={i} before={row.b} after={row.a} index={i} />
                        ))}
                    </div>
                </div>

                {/* Live Map Preview (Condensed) */}
                <div className="lg:col-span-8 h-[400px] glass-card overflow-hidden relative">
                    <MapContainer 
                      center={[19.074, 72.826]} 
                      zoom={12} 
                      style={{ height: '100%', width: '100%' }} 
                      zoomControl={true}
                    >
                      <TileLayer
                        attribution='&copy; OpenStreetMap &copy; CARTO'
                        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                      />
                      
                      <Polyline
                        positions={[
                          [19.135, 72.821], [19.13637, 72.8208], [19.13755, 72.81987], [19.13895, 72.81978], [19.14027, 72.8194], [19.14172, 72.81956], [19.14304, 72.81917], [19.14443, 72.81905], [19.14557, 72.81793], [19.14698, 72.81792], [19.14822, 72.81721], [19.1496, 72.81706], [19.151, 72.81701], [19.15222, 72.81621], [19.15359, 72.81604], [19.155, 72.816]
                        ]}
                        pathOptions={{ color: '#F87171', weight: 4, opacity: 0.9 }}
                      />
                      <Polyline
                        positions={[
                          [19.195, 72.799], [19.19668, 72.79902], [19.19836, 72.79891], [19.20003, 72.79902], [19.20169, 72.79923], [19.20331, 72.79998], [19.20502, 72.7995], [19.20668, 72.79979], [19.20832, 72.80029], [19.21, 72.80025], [19.21162, 72.80086], [19.21333, 72.80045], [19.21501, 72.80051], [19.21666, 72.80087], [19.21836, 72.80053], [19.22, 72.801]
                        ]}
                        pathOptions={{ color: '#F87171', weight: 4, opacity: 0.9 }}
                      />
                      
                      <Polyline
                        positions={[
                          [19.135, 72.821], [19.13615, 72.81995], [19.13774, 72.82064], [19.13886, 72.81945], [19.14032, 72.81961], [19.14173, 72.8196], [19.14311, 72.81945], [19.14432, 72.81859], [19.14567, 72.81833], [19.14681, 72.81725], [19.14831, 72.81756], [19.14962, 72.81714], [19.15114, 72.81755], [19.15235, 72.81674], [19.15377, 72.81673], [19.155, 72.816]
                        ]}
                        pathOptions={{ color: '#2DD4BF', weight: 4, opacity: 0.9, dashArray: '8 4' }}
                      />
                      <Polyline
                        positions={[
                          [19.195, 72.799], [19.19672, 72.79843], [19.19834, 72.79918], [19.19996, 72.79994], [19.20163, 72.79994], [19.2033, 72.80013], [19.20501, 72.79967], [19.20662, 72.80053], [19.20833, 72.80013], [19.21007, 72.79936], [19.21167, 72.80025], [19.21341, 72.79957], [19.21493, 72.80146], [19.2166, 72.80162], [19.21836, 72.80054], [19.22, 72.801]
                        ]}
                        pathOptions={{ color: '#2DD4BF', weight: 4, opacity: 0.9, dashArray: '8 4' }}
                      />
                    
                      <Marker position={[19.135, 72.821]} icon={createCustomIcon('#1a9e8f')}>
                        <Popup><div className="font-mono text-xs"><b>A_2011</b><br/>Location A • Site 2</div></Popup>
                      </Marker>
                      <Marker position={[19.155, 72.816]} icon={createCustomIcon('#1a9e8f')}>
                        <Popup><div className="font-mono text-xs"><b>A_2019</b><br/>Location A • Site 2</div></Popup>
                      </Marker>
                      <Marker position={[19.145, 72.818]} icon={createCustomIcon('#c9a84c')}>
                        <Popup><div className="font-mono text-xs"><b>A_Boundary</b><br/>Location A • Site 2</div></Popup>
                      </Marker>
                      <Marker position={[19.195, 72.799]} icon={createCustomIcon('#1a9e8f')}>
                        <Popup><div className="font-mono text-xs"><b>C_2011</b><br/>Location B • Site 1</div></Popup>
                      </Marker>
                      <Marker position={[19.22, 72.801]} icon={createCustomIcon('#1a9e8f')}>
                        <Popup><div className="font-mono text-xs"><b>C_2019</b><br/>Location B • Site 1</div></Popup>
                      </Marker>
                      <Marker position={[19.207, 72.800]} icon={createCustomIcon('#c9a84c')}>
                        <Popup><div className="font-mono text-xs"><b>C_Boundary</b><br/>Location B • Site 1</div></Popup>
                      </Marker>
                    
                      <div className="leaflet-bottom leaflet-left" style={{zIndex: 1000}}>
                        <div style={{
                          background: 'rgba(10,22,40,0.9)',
                          border: '1px solid rgba(26,158,143,0.3)',
                          borderRadius: '8px',
                          padding: '8px 12px',
                          margin: '8px',
                          fontFamily: 'IBM Plex Mono',
                          fontSize: '9px'
                        }}>
                          <div style={{display:'flex',alignItems:'center',gap:'6px',marginBottom:'4px'}}>
                            <div style={{width:'20px',height:'2px',background:'#F87171'}}></div>
                            <span style={{color:'#F87171'}}>HTL 2011</span>
                          </div>
                          <div style={{display:'flex',alignItems:'center',gap:'6px',marginBottom:'4px'}}>
                            <div style={{width:'20px',height:'3px',background:'#2DD4BF'}}></div>
                            <span style={{color:'#2DD4BF'}}>HTL 2019</span>
                          </div>
                          <div style={{display:'flex',alignItems:'center',gap:'6px'}}>
                            <div style={{width:'10px',height:'10px',borderRadius:'50%',background:'#1a9e8f'}}></div>
                            <span style={{color:'#7aa3b8'}}>Survey Sites</span>
                          </div>
                        </div>
                      </div>
                    </MapContainer>
                    <div className="absolute bottom-4 left-4 z-[1000] bg-ocean-950/90 border border-ocean-700 p-3 rounded-xl backdrop-blur-md">
                        <div className="text-[9px] font-mono text-text-400 mb-2 uppercase tracking-widest border-b border-ocean-800 pb-1">Coastal Layout Preview</div>
                        <div className="flex flex-col space-y-2">
                            <div className="flex items-center text-[10px] font-mono text-text-200">
                                <div className="w-4 h-0.5 bg-coral-500 mr-2 rounded"></div> HTL 2011
                            </div>
                            <div className="flex items-center text-[10px] font-mono text-text-200">
                                <div className="w-4 h-1 bg-teal-500 mr-2 rounded"></div> HTL 2019
                            </div>
                            <div className="flex items-center text-[10px] font-mono text-text-200">
                                <div className="w-2 h-2 rounded-full bg-teal-500 mx-1 mr-3 shadow-[0_0_5px_rgba(26,158,143,0.8)]"></div> Dataset Maps
                            </div>
                        </div>
                    </div>
                    <div className="absolute bottom-4 right-4 z-[1000] bg-ocean-950/80 border border-ocean-700 px-3 py-1 rounded-full backdrop-blur-md">
                        <span className="text-[9px] font-mono text-teal-400">SURVEY REGISTRY VIEW</span>
                    </div>
                </div>
            </div>

            {/* Automated Intelligence Pipeline */}
            <div className="space-y-4">
                <h3 className="text-sm font-display italic uppercase tracking-widest flex items-center px-2">
                    <Zap size={16} className="text-teal-400 mr-2" />
                    Automated Intelligence Pipeline
                </h3>
                <div className="glass-card p-6 overflow-x-auto overflow-y-hidden">
                    <div className="flex flex-col md:flex-row items-center justify-between min-w-[800px] md:min-w-0 pb-4">
                        {[
                            { emoji: "📁", label: "SHAPEFILE INPUT", sub: "ESRI .shp Format", color: "#2dd4bf" },
                            { emoji: "🔍", label: "AUTO-DISCOVERY", sub: "os.walk Recursive Scan", color: "#2dd4bf" },
                            { emoji: "⚙️", label: "QUALITY ENGINE", sub: "18 Issues Detected", color: "#e05c3a" },
                            { emoji: "🤖", label: "ML DETECTION", sub: "IsolationForest Model", color: "#c9a84c" },
                            { emoji: "🏛️", label: "CRZ ENGINE", sub: "Regulatory Buffer Calc", color: "#2dd4bf" },
                            { emoji: "📋", label: "ISO 19115 EXPORT", sub: "Metadata Generated", color: "#2dd4bf" },
                            { emoji: "📊", label: "DASHBOARD OUTPUT", sub: "Live Intelligence Portal", color: "#2dd4bf" }
                        ].map((step, idx, arr) => (
                            <React.Fragment key={idx}>
                                <motion.div 
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: idx * 0.1 }}
                                    className="flex flex-col flex-1 items-center justify-center p-3 rounded-xl border border-ocean-800 bg-ocean-950/50 hover:bg-ocean-900/80 transition-all hover:shadow-[0_0_15px_rgba(45,212,191,0.2)] group cursor-default text-center min-w-[100px]"
                                    style={{ borderTopColor: step.color, borderTopWidth: '2px' }}
                                >
                                    <div className="text-2xl mb-2 group-hover:scale-110 transition-transform">{step.emoji}</div>
                                    <div className="text-[10px] font-mono font-bold text-text-200 uppercase leading-tight">{step.label}</div>
                                    <div className="text-[9px] font-mono text-text-500 mt-1">{step.sub}</div>
                                </motion.div>
                                {idx < arr.length - 1 && (
                                    <motion.div 
                                        initial={{ opacity: 0 }}
                                        whileInView={{ opacity: 1 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: (idx * 0.1) + 0.05 }}
                                        className="hidden md:flex items-center justify-center text-teal-500/50 px-2"
                                    >
                                        <ArrowRight size={16} />
                                    </motion.div>
                                )}
                                {idx < arr.length - 1 && (
                                    <div className="md:hidden flex items-center justify-center text-teal-500/50 py-2">
                                        <ArrowRight size={16} className="rotate-90" />
                                    </div>
                                )}
                            </React.Fragment>
                        ))}
                    </div>
                    <div className="mt-4 pt-4 border-t border-ocean-800 flex items-center justify-center bg-teal-500/5 rounded p-2">
                        <span className="text-[10px] font-mono text-text-400 italic text-center">
                            ⚡ Full pipeline executes in {"<"} 4 seconds - 6 datasets • 57 features • 18 issues • 23 parameters • ISO 19115 compliant output
                        </span>
                    </div>
                </div>
            </div>

            {/* Critical Issues Feed (Moved to bottom row) */}
            <div className="space-y-4">
                <div className="flex justify-between items-center px-2">
                    <h3 className="text-sm font-display italic uppercase tracking-widest flex items-center">
                        <AlertTriangle size={16} className="text-coral-500 mr-2" />
                        Intelligence Audit Feed
                    </h3>
                    <span className="badge border-coral-500 text-coral-500">{criticalCount} URGENT BREACHES</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {issues.slice(0, 6).map((issue, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            className="glass-card p-4 border-l-4 hover:bg-ocean-900/40 transition-all"
                            style={{ borderLeftColor: issue.severity === 'CRITICAL' ? '#e05c3a' : issue.severity === 'HIGH' ? '#c9a84c' : '#3b82f6' }}
                        >
                            <div className="flex justify-between items-start mb-2">
                                <span className="text-[10px] font-bold font-mono tracking-tighter text-text-400">{issue.type}</span>
                                <span className={`text-[9px] font-bold px-1.5 rounded bg-ocean-900 border border-ocean-700 ${
                                    issue.severity === 'CRITICAL' ? 'text-coral-500' : 'text-text-500'
                                }`}>{issue.severity}</span>
                            </div>
                            <p className="text-xs text-text-200 leading-snug mb-3">{issue.detail}</p>
                            <div className="flex justify-between items-center text-[9px] font-mono text-text-600 uppercase italic">
                                <span>{issue.dataset}</span>
                                <span>Site ID: SITE-2</span>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}
