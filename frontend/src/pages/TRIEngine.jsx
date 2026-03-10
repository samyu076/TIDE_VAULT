import { useState, useEffect } from 'react';
import { useCoast } from '../CoastContext';
import { FALLBACK_TRI } from '../data/fallbackData';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { ShieldCheck, Zap, ChevronDown, ChevronUp, CheckCircle, TrendingDown, AlertCircle } from 'lucide-react';
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

const TRIGauge = ({ score, site, id, trustLevel, breakdown }) => {
    const radius = 40;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (score / 100) * circumference;
    const [isExpanded, setIsExpanded] = useState(false);

    const getColor = (s) => {
        if (s >= 75) return 'text-teal-400 stroke-teal-400';
        if (s >= 55) return 'text-gold-400 stroke-gold-400';
        return 'text-coral-500 stroke-coral-500';
    };

    const colors = getColor(score);

    return (
        <div className="glass-card p-6 flex flex-col items-center transition-all duration-300 hover:scale-[1.02] border-b-2" style={{ borderBottomColor: score < 50 ? '#e05c3a' : 'transparent' }}>
            <div className="relative w-32 h-32 mb-4 group cursor-help">
                <svg className="w-full h-full -rotate-90">
                    <circle cx="64" cy="64" r={radius} className="stroke-ocean-700 fill-none" strokeWidth="8" />
                    <circle
                        cx="64" cy="64" r={radius}
                        className={`fill-none transition-all duration-1000 ease-out ${colors.split(' ')[1]}`}
                        strokeWidth="8"
                        strokeDasharray={circumference}
                        strokeDashoffset={offset}
                        strokeLinecap="round"
                    />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className={`text-3xl font-display font-bold ${colors.split(' ')[0]}`}>{Math.round(score)}</span>
                    <span className="text-[10px] text-text-500 font-mono uppercase tracking-tighter">TRI Index</span>
                </div>
            </div>

            <div className="text-center w-full">
                <span className={`badge mb-3 ${score >= 75 ? 'border-teal-500/30 text-teal-400' : score >= 55 ? 'border-gold-500/30 text-gold-400' : 'border-coral-500/30 text-coral-500'}`}>
                    {trustLevel} TRUST
                </span>
                <h3 className="text-sm font-semibold text-text-100 tracking-tight">{site}</h3>
                <p className="text-[10px] text-text-500 font-mono mb-4 uppercase italic tracking-tighter">{id}</p>

                <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="w-full py-2 bg-ocean-900 rounded border border-ocean-700 hover:border-teal-500/30 transition-colors flex items-center justify-center space-x-2 text-[11px] uppercase tracking-wider text-text-300"
                >
                    <span className="font-bold">{isExpanded ? 'Hide' : 'Explain'} Score</span>
                    {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                </button>

                {isExpanded && (
                    <div className="mt-4 text-left space-y-3 animate-in fade-in slide-in-from-top-2 duration-300">
                        <div className="bg-ocean-950/50 p-3 rounded text-[11px] border border-ocean-700">
                            <h4 className="text-teal-400 font-bold mb-1 uppercase tracking-tighter flex items-center">
                                <ShieldCheck size={12} className="mr-1" />
                                Impact Analysis
                            </h4>
                            <p className="text-text-300 leading-relaxed italic opacity-90">{breakdown?.explanation || "Calculating..."}</p>
                        </div>
                        <div className="space-y-1.5 px-1">
                            {Object.entries(breakdown?.factors || {}).map(([key, f]) => (
                                <div key={key} className="flex justify-between items-center text-[10px]">
                                    <span className="text-text-500 font-mono italic capitalize">{key.replace('_score', '')} ({(f.weight * 100)}%)</span>
                                    <div className="flex items-center space-x-1.5">
                                        <div className="w-16 h-1 bg-ocean-800 rounded-full overflow-hidden">
                                            <div className={`h-full ${colors.split(' ')[1]}`} style={{ width: `${f.value}%` }}></div>
                                        </div>
                                        <span className="text-text-100 font-bold min-w-[30px] text-right">{f.contribution}pts</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default function TRIEngine() {
    const { datasets } = useCoast();
    const [triData, setTriData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTri = async () => {
            try {
                const res = await axios.get('http://localhost:8000/api/tri', { timeout: 1000 });
                setTriData(res.data.length > 0 ? res.data : FALLBACK_TRI);
            } catch (err) {
                console.warn("TRI API failed, using fallback metrics.");
                setTriData(FALLBACK_TRI);
            } finally {
                setTimeout(() => setLoading(false), 1000);
            }
        };
        fetchTri();
    }, []);

    const decayData = [];
    if (triData.length > 0) {
        const years = Object.keys(triData[0].decay_projection);
        years.forEach(year => {
            const row = { year };
            triData.forEach(d => {
                row[d.dataset_id] = d.decay_projection[year];
            });
            decayData.push(row);
        });
    }

    if (loading) {
        return <LoadingScreen message="TideVault — Initialising..." />;
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-1000">
            {/* Header / Formula Display */}
            <div className="glass-card p-8 border-l-4 border-teal-500 relative overflow-hidden bg-gradient-to-r from-teal-500/5 to-transparent">
                <div className="flex flex-col md:flex-row justify-between gap-8 relative z-10">
                    <div className="md:w-3/5">
                        <h2 className="text-3xl mb-3 flex items-center font-display italic tracking-tight">
                            <Zap className="text-teal-400 mr-3" size={28} />
                            TideVault TRI-Coast Engine
                        </h2>
                        <p className="text-text-400 text-sm leading-relaxed">
                            The Temporal Reliability Index (TRI) quantifies the trust level of coastal geospatial data.
                            It dynamically evaluates age, update frequency, spatial accuracy, and schema compliance to provide planning officers with an auditable reliability metric.
                        </p>
                    </div>
                    <div className="md:w-2/5 flex items-center justify-center bg-ocean-950/80 rounded-2xl p-5 border border-ocean-700 shadow-2xl backdrop-blur-xl">
                        <div className="text-center w-full">
                            <p className="text-[10px] text-teal-500 font-mono uppercase tracking-[0.2em] mb-3 font-bold italic">Primary Reliability Algorithm</p>
                            <div className="bg-ocean-900 border border-ocean-800 p-3 rounded-lg">
                                <code className="text-[11px] text-teal-100 font-mono leading-loose">
                                    TRI = (Age×0.3) + (Freq×0.25) + (Acc×0.25) + (CRS×0.1) + (Comp×0.1)
                                </code>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Gauge Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {triData.map(d => (
                    <TRIGauge
                        key={d.dataset_id}
                        site={datasets.find(ds => ds.id === d.dataset_id)?.site || d.dataset_id}
                        id={d.dataset_id}
                        score={d.tri_score}
                        trustLevel={d.trust_level}
                        breakdown={{
                            explanation: d.explanation,
                            factors: d.breakdown
                        }}
                    />
                ))}
            </div>

            {/* Chart Area */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <div className="lg:col-span-8 glass-card p-8 min-h-[480px] flex flex-col relative group">
                    <div className="flex justify-between items-center mb-10">
                        <div>
                            <h2 className="text-xl font-display italic">Audit: Trust Decay Projection</h2>
                            <p className="text-xs text-text-500 font-mono uppercase tracking-tighter mt-1 italic">Predicted TRI erosion without survey intervention (10-year model)</p>
                        </div>
                        <div className="flex space-x-6">
                            <div className="flex items-center space-x-2"><div className="w-3 h-3 rounded-full bg-teal-400"></div><span className="text-[10px] text-text-300 font-bold uppercase tracking-widest">LOC A</span></div>
                            <div className="flex items-center space-x-2"><div className="w-3 h-3 rounded-full bg-coral-500 uppercase"></div><span className="text-[10px] text-text-300 font-bold uppercase tracking-widest">LOC B</span></div>
                        </div>
                    </div>
                    <div className="flex-1 w-full opacity-90">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={decayData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#102a43" vertical={false} />
                                <XAxis dataKey="year" stroke="#4a6a8c" fontSize={11} tickLine={false} axisLine={false} dy={10} />
                                <YAxis stroke="#4a6a8c" fontSize={11} tickLine={false} axisLine={false} domain={[0, 100]} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#050c18', border: '1px solid #102a43', borderRadius: '12px', color: '#e8f4f8', backdropBlur: '10px' }}
                                    itemStyle={{ fontSize: '11px', fontFamily: 'IBM Plex Mono', padding: '2px 0' }}
                                />
                                <ReferenceLine y={25} stroke="#e05c3a" strokeDasharray="5 5" label={{ value: 'CRITICAL', position: 'right', fill: '#e05c3a', fontSize: 10, fontWeight: 'bold' }} />
                                <ReferenceLine x="2027" stroke="#fbbf24" strokeDasharray="10 10" label={{ value: 'SURVEY DUE', position: 'top', fill: '#fbbf24', fontSize: 10, fontWeight: 'bold' }} />

                                <Line type="monotone" dataKey="A_2011" stroke="#22c4b3" strokeWidth={4} dot={{ r: 4, fill: '#1a9e8f', strokeWidth: 2 }} activeDot={{ r: 6 }} />
                                <Line type="monotone" dataKey="A_2019" stroke="#2dd4bf" strokeWidth={2} strokeDasharray="8 4" dot={{ r: 3 }} opacity={0.6} />
                                <Line type="monotone" dataKey="C_2011" stroke="#e05c3a" strokeWidth={4} dot={{ r: 4, fill: '#c53030' }} />
                                <Line type="monotone" dataKey="C_2019" stroke="#f07a5a" strokeWidth={2} strokeDasharray="8 4" dot={{ r: 3 }} opacity={0.6} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="lg:col-span-4 space-y-6">
                    <div className="glass-card p-6 bg-teal-500/5 border-teal-500/30 shadow-inner">
                        <h3 className="text-lg mb-4 flex items-center text-teal-400 font-display italic">
                            <ShieldCheck className="mr-3" size={20} />
                            2027 Survey Strategy
                        </h3>
                        <p className="text-sm text-text-300 mb-5 leading-relaxed italic opacity-90">
                            A new survey in Q1 2027 would reset the system average TRI to <span className="text-teal-400 font-bold">72.4/100</span> by correcting 15-year temporal gaps.
                        </p>
                        <ul className="space-y-4">
                            <li className="flex items-start space-x-3 text-xs text-text-200">
                                <div className="p-1 rounded bg-teal-500/20 text-teal-400 mt-0.5"><CheckCircle size={12} /></div>
                                <span>Extend temporal extent for Mumbai-North sector by 96%.</span>
                            </li>
                            <li className="flex items-start space-x-3 text-xs text-text-200">
                                <div className="p-1 rounded bg-teal-500/20 text-teal-400 mt-0.5"><CheckCircle size={12} /></div>
                                <span>Bridge the 8-year update gap to meet CRZ-2019 audit criteria.</span>
                            </li>
                        </ul>
                    </div>

                    <div className="glass-card p-6 border-coral-500/30 bg-coral-500/5 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                            <AlertCircle size={80} />
                        </div>
                        <h3 className="text-lg mb-4 flex items-center text-coral-500 italic uppercase tracking-tighter font-bold">
                            <TrendingDown className="mr-3" size={20} />
                            Decay Sunset Alert
                        </h3>
                        <div className="space-y-4 relative z-10">
                            <div className="flex justify-between items-center px-4 py-3 bg-ocean-950/80 rounded-xl border-l-4 border-coral-500 shadow-xl">
                                <span className="text-[10px] text-text-500 font-mono font-bold tracking-widest uppercase">Critical Failure</span>
                                <span className="text-sm font-bold text-coral-500 font-mono">2028 - Q1</span>
                            </div>
                            <p className="text-[11px] text-text-400 leading-relaxed italic">
                                Projected data obsolescence will bypass regulatory reliability margins for <span className="text-text-100 font-bold">Location A</span> by early 2027. Immediate survey tendering recommended to avoid governance lapse.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
