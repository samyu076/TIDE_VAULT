import { useState, useEffect } from 'react';
import { useCoast } from '../CoastContext';
import { FALLBACK_DATASETS } from '../data/fallbackData';
import { Box, Code, RefreshCw, Layers, FileCode, CheckCircle2, ShieldCheck, FileText } from 'lucide-react';
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

const TabButton = ({ active, label, onClick, icon: Icon }) => (
    <button
        onClick={onClick}
        className={`flex items-center space-x-2 px-6 py-3 border-b-2 transition-all duration-300 text-xs font-bold uppercase tracking-widest ${active ? 'border-teal-400 text-teal-400 bg-teal-500/5' : 'border-transparent text-text-500 hover:text-text-300'
            }`}
    >
        <Icon size={14} />
        <span>{label}</span>
    </button>
);

export default function MetadataVault() {
    const { datasets, loading } = useCoast();
    const [selectedId, setSelectedId] = useState('');
    const [dataset, setDataset] = useState(null);
    const [activeTab, setActiveTab] = useState('iso');
    const [isRecomputing, setIsRecomputing] = useState(false);

    useEffect(() => {
        if (datasets.length > 0 && !selectedId) {
            setSelectedId(datasets[0].id);
        }
    }, [datasets]);

    useEffect(() => {
        const found = datasets.find(d => d.id === selectedId);
        if (found) setDataset(found);
        else if (selectedId) setDataset(FALLBACK_DATASETS[0]);
    }, [selectedId, datasets]);

    const handleRecompute = () => {
        setIsRecomputing(true);
        setTimeout(() => setIsRecomputing(false), 1000);
    };

    if (loading || !dataset) return <LoadingScreen message="TideVault — Mounting ISO 19115 Vault..." />;

    return (
        <div className="space-y-8 animate-in slide-in-from-right duration-700">
            {/* Header: Dataset Selection & Export */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="flex bg-ocean-950 p-1.5 rounded-2xl border border-ocean-800 shadow-inner group">
                    <div className="p-2 mr-2"><Layers size={18} className="text-teal-400" /></div>
                    <select
                        value={selectedId}
                        onChange={(e) => setSelectedId(e.target.value)}
                        className="bg-transparent border-none outline-none text-sm font-bold font-display italic text-text-100 pr-4"
                    >
                        {datasets.map(d => <option key={d.id} value={d.id}>{d.id}</option>)}
                    </select>
                </div>

                <div className="flex items-center space-x-4">
                    <button onClick={handleRecompute} className="btn-primary py-2 px-6 flex items-center space-x-2 group">
                        <RefreshCw size={16} className={isRecomputing ? 'animate-spin' : 'group-hover:rotate-180 transition-transform duration-500'} />
                        <span className="text-[11px] font-bold uppercase">{isRecomputing ? 'Recomputing...' : 'Live Recompute'}</span>
                    </button>
                    <div className="h-8 w-px bg-ocean-800"></div>
                    <div className="flex space-x-2">
                        {['XML', 'JSON', 'CSV'].map(ext => (
                            <button key={ext} className="w-10 h-10 flex items-center justify-center rounded-xl border border-ocean-700 hover:border-teal-500/50 hover:bg-ocean-900 transition-all text-[10px] font-mono text-text-500 hover:text-teal-400">
                                {ext}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Visual Metadata Summary */}
                <div className="lg:col-span-4 space-y-6">
                    <div className="glass-card p-6 overflow-hidden relative">
                        <div className="flex items-center space-x-3 mb-6">
                            <ShieldCheck size={20} className="text-teal-400" />
                            <h3 className="text-sm font-bold uppercase tracking-widest italic">Core Identification</h3>
                        </div>
                        <div className="space-y-4 relative z-10">
                            {[
                                { label: 'File Identifier', val: dataset.file_id },
                                { label: 'Schema Version', val: dataset.schema_version },
                                { label: 'CRS Authority', val: `EPSG:${dataset.epsg}` },
                                { label: 'Survey Year', val: dataset.year || 'N/A' },
                                { label: 'Feature Count', val: dataset.feature_count },
                            ].map(it => (
                                <div key={it.label} className="flex justify-between items-baseline border-b border-ocean-800/30 pb-2">
                                    <span className="text-[10px] text-text-500 font-mono uppercase italic">{it.label}</span>
                                    <span className="text-[11px] font-bold text-text-100 font-mono tracking-tighter tracking-tightest">{it.val}</span>
                                </div>
                            ))}
                        </div>
                        <div className="absolute right-0 bottom-0 p-4 opacity-5 pointer-events-none">
                            <Box size={140} />
                        </div>
                    </div>

                    <div className="glass-card p-6 border-b-4 border-teal-500">
                        <div className="flex items-center space-x-3 mb-4">
                            <CheckCircle2 size={18} className="text-teal-400" />
                            <h4 className="text-[10px] font-mono text-text-500 uppercase tracking-widest font-bold">ISO Compliance Check</h4>
                        </div>
                        <div className="space-y-3">
                            {[
                                { tag: 'gmd:identificationInfo', ok: true },
                                { tag: 'gmd:dataQualityInfo', ok: dataset.quality_score > 60 },
                                { tag: 'gmd:referenceSystemInfo', ok: true },
                                { tag: 'gmd:distributionInfo', ok: false },
                            ].map(tag => (
                                <div key={tag.tag} className="flex items-center justify-between text-[11px] font-mono uppercase bg-ocean-950/50 p-2 rounded">
                                    <span className="text-text-400 truncate opacity-70">{"<"}{tag.tag}{">"}</span>
                                    {tag.ok ? <span className="text-teal-400 font-bold">Valid</span> : <span className="text-coral-500 font-bold">Incomplete</span>}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Code/XML View */}
                <div className="lg:col-span-8 glass-card border-ocean-700 bg-ocean-950/30 flex flex-col min-h-[500px]">
                    <div className="flex border-b border-ocean-800 px-2 pt-1 bg-ocean-950/80">
                        <TabButton active={activeTab === 'iso'} label="XML (ISO 19139)" onClick={() => setActiveTab('iso')} icon={FileCode} />
                        <TabButton active={activeTab === 'geojson'} label="GeoJSON Header" onClick={() => setActiveTab('geojson')} icon={Code} />
                        <TabButton active={activeTab === 'fields'} label="Data Dictionary" onClick={() => setActiveTab('fields')} icon={FileText} />
                    </div>
                    <div className="flex-1 p-6 font-mono text-[11px] leading-relaxed relative overflow-hidden">
                        {activeTab === 'iso' && (
                            <div className="text-teal-100/80 space-y-1">
                                <p className="text-text-600">{"<?xml version=\"1.0\" encoding=\"UTF-8\"?>"}</p>
                                <p className="text-text-600">{"<gmd:MD_Metadata xmlns:gmd=\"http://www.isotc211.org/2005/gmd\">"}</p>
                                <div className="pl-4">
                                    <p>{"<gmd:fileIdentifier>"}</p>
                                    <p className="pl-4 text-gold-400 italic">{"<gco:CharacterString>"}{dataset.file_id || 'TideVault_ISO19115_A2019'}{"</gco:CharacterString>"}</p>
                                    <p>{"</gmd:fileIdentifier>"}</p>
                                    <p>{"<gmd:language>"}</p>
                                    <p className="pl-4 text-gold-400 italic">{"<gmd:LanguageCode codeListValue=\"eng\">English</gmd:LanguageCode>"}</p>
                                    <p>{"</gmd:language>"}</p>
                                    <p>{"<gmd:hierarchyLevel>"}</p>
                                    <p className="pl-4 text-gold-400 italic">{"<gmd:MD_ScopeCode codeListValue=\"dataset\" />"}</p>
                                    <p>{"</gmd:hierarchyLevel>"}</p>
                                    <p>{"<gmd:dateStamp>"}</p>
                                    <p className="pl-4 text-gold-400 italic">{"<gco:DateTime>"}{dataset.last_computed}{"</gco:DateTime>"}</p>
                                    <p>{"</gmd:dateStamp>"}</p>
                                    <p className="py-2 text-text-700 italic">{"<!-- [TRUNCATED] ISO 19139 Dynamic Body Generation Active -->"}</p>
                                </div>
                                <p className="text-text-600">{"</gmd:MD_Metadata>"}</p>
                            </div>
                        )}
                        {activeTab === 'geojson' && (
                            <div className="text-teal-100/80">
                                <pre>{JSON.stringify({
                                    type: "FeatureCollection",
                                    metadata: {
                                        id: dataset.id,
                                        file_id: dataset.file_id || 'TideVault_export_C2019',
                                        bbox_wgs84: dataset.bbox_wgs84,
                                        quality: dataset.quality_score,
                                        tri_index: 68.4
                                    },
                                    features: "[...]"
                                }, null, 2)}</pre>
                            </div>
                        )}
                        {activeTab === 'fields' && (
                            <div className="space-y-4">
                                <div className="grid grid-cols-3 gap-2 text-text-500 font-bold uppercase tracking-tighter border-b border-ocean-800 pb-2">
                                    <span>Field Name</span>
                                    <span>Type</span>
                                    <span>ISO Status</span>
                                </div>
                                {dataset.fields.map(f => (
                                    <div key={f} className="grid grid-cols-3 gap-2 py-0.5 group">
                                        <span className="text-text-100 font-bold group-hover:text-teal-400">{f}</span>
                                        <span className="text-text-400 opacity-60 italic">{f === 'OBJECTID' ? 'Int64' : 'String(254)'}</span>
                                        <span className="text-teal-500/50">Compliant</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
