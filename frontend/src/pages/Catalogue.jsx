import { useState } from 'react';
import { useCoast } from '../CoastContext';
import { Search, Database, AlertTriangle, Info, X } from 'lucide-react';
import TideVaultLogo from '../assets/TideVaultLogo';

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

const DatasetCard = ({ dataset, onSelect }) => {
    const score = dataset.quality_score;
    const color = score > 75 ? 'bg-green-500' : score > 60 ? 'bg-yellow-500' : 'bg-red-500';
    const textColor = score > 75 ? 'text-green-400' : score > 60 ? 'text-yellow-400' : 'text-red-400';

    return (
        <div
            onClick={() => onSelect(dataset)}
            className="glass-card p-5 group cursor-pointer hover:border-teal-500/50 transition-all duration-300 transform hover:-translate-y-1"
        >
            <div className="flex justify-between items-start mb-4">
                <div className="p-2 rounded bg-ocean-900 border border-ocean-700">
                    <Database size={18} className="text-teal-400" />
                </div>
                <div className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border border-current ${textColor} bg-current/5`}>
                    {score}% QUALITY
                </div>
            </div>
            <h3 className="text-sm font-bold text-text-100 mb-1 group-hover:text-teal-400 transition-colors">{dataset.id}</h3>
            <p className="text-[10px] text-text-500 font-mono italic mb-4 uppercase tracking-tighter">{dataset.site}</p>

            <div className="space-y-3">
                <div className="h-1 bg-ocean-900 rounded-full overflow-hidden">
                    <div className={`h-full ${color} shadow-[0_0_8px_rgba(45,212,191,0.3)]`} style={{ width: `${score}%` }}></div>
                </div>
                <div className="flex justify-between items-center text-[9px] font-mono text-text-500">
                    <span className="uppercase italic">{dataset.feature_count} Features</span>
                    <span className="font-bold">EPSG:{dataset.epsg}</span>
                </div>
            </div>
        </div>
    );
};

export default function Catalogue() {
    const { datasets, loading } = useCoast();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedDataset, setSelectedDataset] = useState(null);

    const filtered = datasets.filter(d =>
        d.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        d.site.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return <LoadingScreen message="TideVault — Initialising..." />;
    }

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-right-4 duration-700">
            {/* Search Header */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="relative w-full md:w-96 group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-500 group-focus-within:text-teal-400 transition-colors" size={18} />
                    <input
                        type="text"
                        placeholder="Search by Dataset ID or Location..."
                        className="w-full bg-ocean-950/80 border border-ocean-800 focus:border-teal-500/50 outline-none rounded-2xl py-3 pl-12 pr-4 text-sm font-mono text-text-200 backdrop-blur-xl transition-all shadow-inner"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex items-center space-x-4">
                    {['All', 'LineString', 'Polygon'].map(type => (
                        <button key={type} className="px-4 py-1.5 rounded-full border border-ocean-700 text-[10px] font-mono uppercase italic text-text-500 hover:border-teal-500/50 hover:text-teal-400 transition-all">
                            {type}
                        </button>
                    ))}
                </div>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filtered.map(d => (
                    <DatasetCard key={d.id} dataset={d} onSelect={setSelectedDataset} />
                ))}
            </div>

            {/* Record Inspector Overlay */}
            {selectedDataset && (
                <div className="fixed inset-0 z-[2000] flex items-center justify-end animate-in fade-in duration-300">
                    <div className="absolute inset-0 bg-ocean-950/60 backdrop-blur-sm" onClick={() => setSelectedDataset(null)}></div>
                    <div className="relative w-full max-w-2xl h-full bg-ocean-950 border-l border-ocean-700 shadow-2xl flex flex-col animate-in slide-in-from-right duration-500">
                        <div className="p-8 border-b border-ocean-800 flex justify-between items-center">
                            <div>
                                <h2 className="text-2xl font-display italic tracking-tighter text-teal-400">{selectedDataset.id}</h2>
                                <div className="flex items-center space-x-3 mt-1">
                                    <span className="text-[10px] font-mono text-text-500 uppercase italic tracking-widest">{selectedDataset.file_id}</span>
                                    <div className="w-1 h-1 rounded-full bg-ocean-700"></div>
                                    <span className="text-[10px] font-mono text-teal-500/70 border border-teal-500/20 px-2 rounded">{selectedDataset.geometry_type}</span>
                                </div>
                            </div>
                            <button onClick={() => setSelectedDataset(null)} className="p-2 hover:bg-ocean-900 rounded-xl transition-colors text-text-500 hover:text-text-100">
                                <X size={24} />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar space-y-10">
                            {/* Stats Bar */}
                            <div className="grid grid-cols-4 gap-4">
                                {[
                                    { label: 'Quality', val: selectedDataset.quality_score + '%' },
                                    { label: 'Features', val: selectedDataset.feature_count },
                                    { label: 'EPSG', val: selectedDataset.epsg },
                                    { label: 'Fields', val: selectedDataset.fields.length }
                                ].map(s => (
                                    <div key={s.label} className="bg-ocean-900/50 p-3 rounded-xl border border-ocean-800 text-center">
                                        <div className="text-[9px] text-text-500 uppercase font-mono mb-1">{s.label}</div>
                                        <div className="text-sm font-bold text-text-100">{s.val}</div>
                                    </div>
                                ))}
                            </div>

                            {/* Data Audit Feed */}
                            <div className="space-y-4">
                                <h4 className="text-xs font-bold uppercase tracking-wider text-text-500 flex items-center">
                                    <AlertTriangle size={14} className="mr-2 text-gold-500" />
                                    Dataset Quality Audit
                                </h4>
                                <div className="space-y-3">
                                    {selectedDataset.issues.map((iss, i) => (
                                        <div key={i} className="bg-ocean-900/40 p-4 rounded-xl border border-ocean-800 group hover:border-ocean-700 transition-colors">
                                            <div className="flex justify-between text-[10px] items-center mb-1.5">
                                                <span className={`font-bold px-2 py-0.5 rounded ${iss.severity === 'CRITICAL' ? 'bg-red-500/10 text-red-400' : 'bg-gold-500/10 text-gold-400'
                                                    }`}>{iss.severity}</span>
                                                <span className="text-text-600 font-mono italic">#{iss.type}</span>
                                            </div>
                                            <p className="text-xs text-text-300 leading-snug">{iss.detail}</p>
                                            <div className="mt-3 flex items-center text-[10px] text-teal-400/80 italic font-mono bg-teal-500/5 p-2 rounded-lg border border-teal-500/10">
                                                <Info size={10} className="mr-2" />
                                                <span>Rec: {iss.recommendation}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Sample Table */}
                            <div className="space-y-4">
                                <h4 className="text-xs font-bold uppercase tracking-wider text-text-500">Sample Record Registry</h4>
                                <div className="border border-ocean-800 rounded-xl overflow-hidden bg-ocean-900/20">
                                    <table className="w-full text-[10px] font-mono">
                                        <thead className="bg-ocean-950/80">
                                            <tr>
                                                {selectedDataset.fields.slice(0, 4).map(f => (
                                                    <th key={f} className="p-3 text-left text-text-500 uppercase tracking-tighter border-b border-ocean-800">{f}</th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {selectedDataset.records.slice(0, 10).map((r, i) => (
                                                <tr key={i} className="border-b border-ocean-800 last:border-0 hover:bg-ocean-900/40 transition-colors">
                                                    {selectedDataset.fields.slice(0, 4).map(f => (
                                                        <td key={f} className="p-3 text-text-300 tabular-nums">{r[f]}</td>
                                                    ))}
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
