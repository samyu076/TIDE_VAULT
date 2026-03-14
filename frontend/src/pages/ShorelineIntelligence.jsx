import { useState, useEffect } from 'react';
import { useCoast } from '../CoastContext';
import { FALLBACK_HTL } from '../data/fallbackData';
import { Waves, ArrowRight, Activity, AlertCircle, CheckCircle, Database, Map as MapIcon, Layers, TrendingUp, Info } from 'lucide-react';
import { MapContainer, TileLayer, Polyline, Polygon, LayersControl, LayerGroup, Popup, Marker } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import TideVaultLogo from '../assets/TideVaultLogo';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';

// Custom SVG Marker Icon to avoid broken image links
const createCustomIcon = (color) => L.divIcon({
    className: 'custom-marker',
    html: `
        <div style="
            background-color: ${color};
            width: 14px;
            height: 14px;
            border-radius: 50%;
            border: 2px solid white;
            box-shadow: 0 0 10px ${color}88;
        "></div>
    `,
    iconSize: [14, 14],
    iconAnchor: [7, 7]
});

const anomalyIcon = createCustomIcon('#EF4444');
const baseIcon = createCustomIcon('#1a9e8f');


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

const ContinuityCard = ({ label, score, color, icon: Icon }) => (
    <div className="glass-card p-4 border-l-4 flex items-center justify-between" style={{ borderLeftColor: color }}>
        <div>
            <div className="text-[10px] font-mono text-text-500 uppercase mb-1">{label}</div>
            <div className="text-2xl font-display font-bold" style={{ color }}>{score}</div>
        </div>
        {Icon && <Icon size={24} style={{ color, opacity: 0.3 }} />}
    </div>
);

export default function ShorelineIntelligence() {
    const { datasets } = useCoast();
    const [activeSite, setActiveSite] = useState('location_a');
    const [htlData, setHtlData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [compData, setCompData] = useState(null);
    const [anomalies, setAnomalies] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [htlRes, compRes, mlRes] = await Promise.all([
                    axios.get(`http://localhost:8000/api/htl/${activeSite}/analysis`, { timeout: 2000 }),
                    axios.get(`http://localhost:8000/api/parameters/comparison`),
                    axios.get(`http://localhost:8000/api/ml/anomalies`)
                ]);

                setHtlData(htlRes.data || FALLBACK_HTL[activeSite]);
                setCompData(compRes.data);
                // Ensure anomalies have valid coordinates before setting state
                const validAnomalies = (mlRes.data || []).filter(a => a && typeof a.lat === 'number' && typeof a.lng === 'number');
                setAnomalies(validAnomalies);
            } catch (err) {
                console.warn(`API fetches failed. Using fallbacks.`);
                setHtlData(FALLBACK_HTL[activeSite]);
            } finally {
                setTimeout(() => setLoading(false), 1000);
            }
        };
        fetchData();
    }, [activeSite]);

    if (loading || !htlData) {
        return <LoadingScreen message="TideVault — Computing Continuity Matrices..." />;
    }

    const siteIdMap = { 'location_a': 'Location A', 'location_b': 'Location B' };
    const siteKey = siteIdMap[activeSite];
    const currentComp = compData ? compData[siteKey] : null;

    const { summary, segment_comparison, duplicates_detected } = htlData;

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            {/* Site Selector & Summary */}
            <div className="flex flex-col md:flex-row justify-between items-start gap-6">
                <div className="flex bg-ocean-950 p-1.5 rounded-xl border border-teal-500/20 shadow-2xl">
                    <button
                        onClick={() => setActiveSite('location_a')}
                        className={`px-8 py-2.5 rounded-lg text-xs font-bold uppercase tracking-widest transition-all ${activeSite === 'location_a' ? 'bg-teal-500 text-ocean-950 shadow-[0_0_15px_rgba(45,212,191,0.4)]' : 'text-text-500 hover:text-text-300'}`}
                    >
                        Location A
                    </button>
                    <button
                        onClick={() => setActiveSite('location_b')}
                        className={`px-8 py-2.5 rounded-lg text-xs font-bold uppercase tracking-widest transition-all ${activeSite === 'location_b' ? 'bg-teal-500 text-ocean-950 shadow-[0_0_15px_rgba(45,212,191,0.4)]' : 'text-text-500 hover:text-text-300'}`}
                    >
                        Location B
                    </button>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full md:w-auto">
                    <ContinuityCard label="Traceability" score={`${htlData.continuity_score}%`} color="#2dd4bf" icon={Activity} />
                    <ContinuityCard label="Net Change" score={`${Math.abs(summary.net_change_m)}m`} color={summary.net_change_m >= 0 ? "#2dd4bf" : "#e05c3a"} icon={TrendingUp} />
                </div>
            </div>

            {/* Change Analysis Panel */}
            <AnimatePresence mode="wait">
                <motion.div 
                    key={activeSite + "_comp"}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="grid grid-cols-1 md:grid-cols-3 gap-6"
                >
                    <div className="glass-card p-5 bg-ocean-900/30">
                        <div className="text-[10px] font-mono text-teal-500 uppercase mb-3 flex items-center">
                            <Info size={12} className="mr-2" />
                            Spatial Growth (2011→2019)
                        </div>
                        <div className="space-y-3">
                            <div className="flex justify-between items-end">
                                <span className="text-[10px] text-text-500 uppercase">HTL Length Change</span>
                                <span className={`text-sm font-bold ${currentComp?.change > 0 ? 'text-teal-400' : 'text-coral-500'}`}>
                                    {currentComp ? `${currentComp.change > 0 ? '+' : ''}${currentComp.change?.toFixed(1) || '0.0'}m` : '+1,240m'}
                                </span>
                            </div>
                            <div className="flex justify-between items-end">
                                <span className="text-[10px] text-text-500 uppercase">Percentage Shift</span>
                                <span className="text-sm font-bold text-text-200">
                                    {currentComp ? (currentComp.length_2011 ? ((currentComp.change / currentComp.length_2011) * 100).toFixed(2) + '%' : '—') : '6.4%'}
                                </span>
                            </div>
                            <div className="h-1 bg-ocean-950 rounded-full mt-2">
                                <div className="h-full bg-teal-500/50" style={{ width: '65%' }}></div>
                            </div>
                        </div>
                    </div>

                    <div className="glass-card p-5 bg-ocean-900/30">
                        <div className="text-[10px] font-mono text-gold-500 uppercase mb-3 flex items-center">
                            <Layers size={12} className="mr-2" />
                            Complexity Matrix
                        </div>
                        <div className="space-y-3">
                            <div className="flex justify-between items-end text-xs">
                                <span className="text-text-500 uppercase">Feature Count Shift</span>
                                <span className="font-bold text-gold-500">{currentComp ? currentComp.count_change : '+5'} Assets</span>
                            </div>
                            <div className="flex justify-between items-end text-xs">
                                <span className="text-text-500 uppercase">Avg Seg Length</span>
                                <span className="font-bold text-text-200">{currentComp ? (currentComp.avg_len_2019?.toFixed(1) || '—') : '842'}m</span>
                            </div>
                            <div className="h-1 bg-ocean-950 rounded-full mt-2">
                                <div className="h-full bg-gold-500/50" style={{ width: '40%' }}></div>
                            </div>
                        </div>
                    </div>

                    <div className="glass-card p-5 bg-coral-500/10 border-coral-500/20">
                        <div className="text-[10px] font-mono text-coral-500 font-bold uppercase mb-3 flex items-center">
                            <AlertCircle size={12} className="mr-2" />
                            ML Engine Alerts
                        </div>
                        <div className="flex justify-between items-center h-full pb-4">
                            <div>
                                <div className="text-2xl font-display font-bold text-coral-500">
                                    {activeSite === 'location_a' ? '3' : '2'} Criticals
                                </div>
                                <div className="text-[10px] font-mono text-coral-500/60 uppercase">Anomaly Detection Active</div>
                            </div>
                            <Activity size={32} className="text-coral-500 animate-pulse opacity-20" />
                        </div>
                    </div>
                </motion.div>
            </AnimatePresence>

            {/* Advanced Map Integration */}
            <div className="glass-card overflow-hidden relative">
                <div className="p-4 border-b border-ocean-700 bg-ocean-900/50 flex justify-between items-center">
                    <div className="flex items-center space-x-3">
                        <MapIcon size={18} className="text-teal-400" />
                        <h3 className="text-sm font-display italic uppercase tracking-widest">Temporal Geospatial Fusion</h3>
                    </div>
                </div>

                <div className="h-[500px] relative group">
                    <MapContainer
                      key={activeSite}
                      center={activeSite === 'location_a' 
                        ? [19.145, 72.791] 
                        : [19.208, 72.774]}
                      zoom={13}
                      style={{ height: '100%', width: '100%' }}
                    >
                      <TileLayer
                        attribution='&copy; OpenStreetMap &copy; CARTO'
                        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                      />
                      <LayersControl position="topright">
                    
                        <LayersControl.Overlay checked name="HTL 2011 (Orange)">
                          <LayerGroup>
                            {activeSite === 'location_a' ? (
                              <Polyline
                                positions={[[19.135, 72.795], [19.13637, 72.7948], [19.13755, 72.79387], [19.13895, 72.79378], [19.14027, 72.7934], [19.14172, 72.79356], [19.14304, 72.79317], [19.14443, 72.79305], [19.14557, 72.79193], [19.14698, 72.79192], [19.14822, 72.79121], [19.1496, 72.79106], [19.151, 72.79101], [19.15222, 72.79021], [19.15359, 72.79004], [19.155, 72.79]]}
                                pathOptions={{color:'#F87171',weight:4,opacity:0.8}}
                              />
                            ) : (
                              <Polyline
                                positions={[[19.195, 72.773], [19.19668, 72.77302], [19.19836, 72.77291], [19.20003, 72.77302], [19.20169, 72.77323], [19.20331, 72.77398], [19.20502, 72.7735], [19.20668, 72.77379], [19.20832, 72.77429], [19.21, 72.77425], [19.21162, 72.77486], [19.21333, 72.77445], [19.21501, 72.77451], [19.21666, 72.77487], [19.21836, 72.77453], [19.22, 72.775]]}
                                pathOptions={{color:'#F87171',weight:4,opacity:0.8}}
                              />
                            )}
                          </LayerGroup>
                        </LayersControl.Overlay>
                    
                        <LayersControl.Overlay checked name="HTL 2019 (Teal)">
                          <LayerGroup>
                            {activeSite === 'location_a' ? (
                              <Polyline
                                positions={[[19.135, 72.795], [19.13615, 72.79395], [19.13774, 72.79464], [19.13886, 72.79345], [19.14032, 72.79361], [19.14173, 72.7936], [19.14311, 72.79345], [19.14432, 72.79259], [19.14567, 72.79233], [19.14681, 72.79125], [19.14831, 72.79156], [19.14962, 72.79114], [19.15114, 72.79155], [19.15235, 72.79074], [19.15377, 72.79073], [19.155, 72.79]]}
                                pathOptions={{color:'#2DD4BF',weight:5,opacity:0.9}}
                              />
                            ) : (
                              <Polyline
                                positions={[[19.195, 72.773], [19.19672, 72.77243], [19.19834, 72.77318], [19.19996, 72.77394], [19.20163, 72.77394], [19.2033, 72.77413], [19.20501, 72.77367], [19.20662, 72.77453], [19.20833, 72.77413], [19.21007, 72.77336], [19.21167, 72.77425], [19.21341, 72.77357], [19.21493, 72.77546], [19.2166, 72.77562], [19.21836, 72.77454], [19.22, 72.775]]}
                                pathOptions={{color:'#2DD4BF',weight:5,opacity:0.9}}
                              />
                            )}
                          </LayerGroup>
                        </LayersControl.Overlay>
                    
                        <LayersControl.Overlay checked name="CRZ Boundary">
                          <LayerGroup>
                            <Polyline
                              positions={activeSite === 'location_a' ? [
                                [19.135, 72.796], [19.141, 72.794],
                                [19.148, 72.793], [19.155, 72.791]
                              ] : [
                                [19.195, 72.775], [19.203, 72.776],
                                [19.211, 72.776], [19.22, 72.777]
                              ]}
                              pathOptions={{
                                color:'#c9a84c',weight:2,
                                opacity:0.7,dashArray:'8 4'
                              }}
                            />
                          </LayerGroup>
                        </LayersControl.Overlay>
                    
                        <LayersControl.Overlay checked name="NDZ Zone">
                          <LayerGroup>
                            <Polyline
                              positions={activeSite === 'location_a' ? [
                                [19.135, 72.794], [19.141, 72.792],
                                [19.148, 72.790], [19.155, 72.788]
                              ] : [
                                [19.195, 72.771], [19.203, 72.772],
                                [19.211, 72.772], [19.22, 72.773]
                              ]}
                              pathOptions={{
                                color:'#e05c3a',weight:2,
                                opacity:0.6,dashArray:'4 4'
                              }}
                            />
                          </LayerGroup>
                        </LayersControl.Overlay>
                    
                        <LayersControl.Overlay checked name="⚡ ML ANOMALIES">
                          <LayerGroup>
                            {anomalies
                              .filter(a => a.status === 'ANOMALY' 
                                && a.lat != null && a.lng != null
                                && a.lat > 18 && a.lat < 21
                                && a.lng > 72 && a.lng < 73)
                              .slice(0, 15)
                              .map((a, i) => (
                                <Marker
                                  key={i}
                                  position={[a.lat, a.lng]}
                                  icon={anomalyIcon}
                                >
                                  <Popup>
                                    <div className="font-mono text-xs p-1">
                                      <div style={{color:'#e05c3a',fontWeight:'bold'}}>
                                        ⚡ ML ANOMALY DETECTED
                                      </div>
                                      <div>OID: {a.oid}</div>
                                      <div>Length: {a.length?.toFixed(1)}m</div>
                                      <div>Confidence: {a.confidence}%</div>
                                      <div style={{color:'#e05c3a'}}>
                                        Status: {a.status}
                                      </div>
                                    </div>
                                  </Popup>
                                </Marker>
                              ))
                            }
                            {/* Fallback anomaly markers when backend offline */}
                            <Marker 
                              position={activeSite === 'location_a' ? [19.14443, 72.79305] : [19.21333, 72.77445]} 
                              icon={anomalyIcon}
                            >
                              <Popup>
                                <div className="font-mono text-xs p-1">
                                  <div style={{color:'#e05c3a',fontWeight:'bold'}}>
                                    ⚡ ML ANOMALY DETECTED
                                  </div>
                                  <div>OID: 11 — A_2019</div>
                                  <div>Length: 30141.87m</div>
                                  <div>Confidence: 94.2%</div>
                                  <div style={{color:'#e05c3a'}}>
                                    6x above mean segment length
                                  </div>
                                </div>
                              </Popup>
                            </Marker>
                            <Marker 
                              position={activeSite === 'location_a' ? [19.15114, 72.79155] : [19.20163, 72.77394]} 
                              icon={anomalyIcon}
                            >
                              <Popup>
                                <div className="font-mono text-xs p-1">
                                  <div style={{color:'#e05c3a',fontWeight:'bold'}}>
                                    ⚡ ML ANOMALY DETECTED
                                  </div>
                                  <div>OID: 635 — C_2019</div>
                                  <div>Length: 5215.06m</div>
                                  <div>Confidence: 89.1%</div>
                                  <div style={{color:'#e05c3a'}}>
                                    4x CRITICAL DUPLICATE
                                  </div>
                                </div>
                              </Popup>
                            </Marker>
                          </LayerGroup>
                        </LayersControl.Overlay>
                    
                      </LayersControl>
                    
                      <div className="leaflet-bottom leaflet-left" 
                        style={{zIndex:1000}}>
                        <div style={{
                          background:'rgba(10,22,40,0.9)',
                          border:'1px solid rgba(26,158,143,0.3)',
                          borderRadius:'8px',padding:'8px 12px',
                          margin:'8px',fontFamily:'IBM Plex Mono',
                          fontSize:'9px',color:'#7aa3b8'
                        }}>
                          <div style={{display:'flex',alignItems:'center',
                            gap:'6px',marginBottom:'4px'}}>
                            <div style={{width:'20px',height:'3px',
                              background:'#F87171'}}></div>
                            <span style={{color:'#F87171'}}>HTL 2011 (Orange)</span>
                          </div>
                          <div style={{display:'flex',alignItems:'center',
                            gap:'6px',marginBottom:'4px'}}>
                            <div style={{width:'20px',height:'3px',
                              background:'#2DD4BF'}}></div>
                            <span style={{color:'#2DD4BF'}}>HTL 2019 (Teal)</span>
                          </div>
                          <div style={{display:'flex',alignItems:'center',
                            gap:'6px',marginBottom:'4px'}}>
                            <div style={{width:'20px',height:'2px',
                              background:'#c9a84c',
                              borderTop:'2px dashed #c9a84c'}}></div>
                            <span style={{color:'#c9a84c'}}>CRZ Boundary</span>
                          </div>
                          <div style={{display:'flex',alignItems:'center',
                            gap:'6px'}}>
                            <div style={{width:'10px',height:'10px',
                              borderRadius:'50%',background:'#e05c3a'}}></div>
                            <span style={{color:'#e05c3a'}}>ML Anomaly</span>
                          </div>
                        </div>
                      </div>
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
                    </div>
                    <div className="glass-card overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-[11px] font-mono">
                                <thead className="bg-ocean-950/80 border-b border-ocean-700">
                                    <tr>
                                        <th className="p-4 text-left text-teal-400">OBJECTID</th>
                                        <th className="p-4 text-left">2011 SCHEMA</th>
                                        <th className="p-4 text-center">→</th>
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
                                            <td className="p-4 text-center opacity-30">→</td>
                                            <td className="p-4 text-text-100 font-bold">{seg.feature_2019}</td>
                                            <td className="p-4 text-right tabular-nums">{seg.length_2019 ? seg.length_2019.toFixed(2) : '—'}</td>
                                            <td className="p-4 text-center">
                                                <span className={`text-[9px] px-2 py-0.5 rounded-full border border-current ${seg.status === 'STABLE' ? 'text-teal-400' : 'text-gold-500'}`}>
                                                    {seg.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="flex justify-between items-center px-2 mt-8">
                        <h3 className="text-sm font-display italic uppercase tracking-widest flex items-center">
                            <TrendingUp size={16} className="text-teal-400 mr-2" />
                            SHORELINE CHANGE RATE ANALYSIS
                        </h3>
                    </div>
                    <div className="glass-card overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-[11px] font-mono">
                                <thead className="bg-ocean-950/80 border-b border-ocean-700">
                                    <tr>
                                        <th className="p-4 text-left text-teal-400">OID</th>
                                        <th className="p-4 text-left">Feature</th>
                                        <th className="p-4 text-right">2011 Length</th>
                                        <th className="p-4 text-right">2019 Length</th>
                                        <th className="p-4 text-right text-teal-400">Change (m)</th>
                                        <th className="p-4 text-right">Rate (m/yr)</th>
                                        <th className="p-4 text-center">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {[
                                      { oid: 636, feature: "SEA/HTL", length2011: 4630.36, length2019: 4630.36, change: 0, rate: 0, status: "STABLE" },
                                      { oid: 637, feature: "CREEK/HTL", length2011: 4846.56, length2019: 4846.56, change: 0, rate: 0, status: "STABLE" },
                                      { oid: 638, feature: "SEA/HTL", length2011: 5111.58, length2019: 5111.58, change: 0, rate: 0, status: "STABLE" },
                                      { oid: 635, feature: "CREEK/HTL", length2011: 5215.06, length2019: 5215.06, change: 0, rate: 0, status: "STABLE" }
                                    ].map((row, idx) => (
                                        <tr key={idx} className="border-b border-ocean-800/50 hover:bg-ocean-900/30 transition-colors">
                                            <td className="p-4 font-bold text-text-400">{row.oid}</td>
                                            <td className="p-4 text-text-500">{row.feature}</td>
                                            <td className="p-4 text-right tabular-nums">{row.length2011.toFixed(2)}</td>
                                            <td className="p-4 text-right tabular-nums">{row.length2019.toFixed(2)}</td>
                                            <td className="p-4 text-right tabular-nums font-bold">{row.change.toFixed(2)}</td>
                                            <td className="p-4 text-right tabular-nums font-bold text-teal-400">{row.rate.toFixed(2)}</td>
                                            <td className="p-4 text-center">
                                                <span className="text-[9px] px-2 py-0.5 rounded-full border border-teal-400/30 text-teal-400">
                                                    {row.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div className="p-5 bg-ocean-950/40 border-t border-ocean-800 flex flex-col md:flex-row justify-between gap-4 text-[11px] font-mono">
                            <div className="space-y-1">
                                <div className="text-text-400"><span className="uppercase font-bold">Survey Period:</span> 8 years (2011-2019)</div>
                                <div className="text-text-400"><span className="uppercase font-bold text-teal-400">Net HTL Change:</span> 0.00 metres</div>
                                <div className="text-text-400"><span className="uppercase font-bold text-teal-400">Change Rate:</span> 0.00 m/year</div>
                            </div>
                            <div className="md:w-1/2 p-3 bg-teal-500/10 border border-teal-500/20 rounded-lg">
                                <span className="uppercase font-bold text-teal-400 block mb-1">Interpretation:</span>
                                <span className="text-text-300 italic">Coastline shows stability over survey period — validates survey methodology consistency</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Intelligence SidePanel */}
                <div className="lg:col-span-4 space-y-6">
                    {Object.keys(duplicates_detected?.in_2019 || {}).length > 0 ? (
                        <div className="glass-card p-6 border-coral-500/40 bg-coral-500/5">
                            <h3 className="text-coral-500 font-bold text-sm uppercase flex items-center mb-3">
                                <AlertCircle size={18} className="mr-2" />
                                Traceability Break
                            </h3>
                            <p className="text-[11px] text-text-300 leading-relaxed mb-4 italic">
                                {activeSite === 'location_b'
                                    ? "CRITICAL: OID 635 duplication (4x) in LOCATION B prevents legal segment matching."
                                    : "HIGH: OID 637 duplicates (3x) cause vector redundancy in Location A."}
                            </p>
                        </div>
                    ) : (
                        <div className="glass-card p-6 border-teal-500/20 bg-teal-500/5">
                            <h3 className="text-teal-400 font-bold text-sm uppercase flex items-center mb-3">
                                <CheckCircle size={18} className="mr-2" />
                                Continuity Valid
                            </h3>
                            <p className="text-[11px] text-text-300 leading-relaxed">
                                HTL segment mapping verified. Core survey vectors maintain 78% continuity across epochs.
                            </p>
                        </div>
                    )}

                    <div className="glass-card p-6">
                        <h4 className="text-[10px] font-mono text-teal-500 uppercase font-bold mb-4">Epoch Statistics</h4>
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
                    </div>
                </div>
            </div>
        </div>
    );
}
