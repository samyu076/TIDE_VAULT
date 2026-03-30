# TIDEVAULT — Coastal Geospatial Intelligence & Governance Framework
**National Hackathon 2026 | Maharashtra Coast | Third Level Evaluation Submission**

---

## PAGES 1–2: TECHNICAL DESCRIPTION

### 1. Scalability
**Zero-Configuration Ingestion**
Data loader Python `os.walk` can be called with the purpose of finding all ESRI Shapefiles within `/data` and it can also contain sub-folders. The Indian coast of 36 total states would not involve any revisions of code — dropping a folder, TideVault indexes and opens it as a requirement of the first opportunity.

**Enterprise Scale**
GeoPandas Vectorised pipeline has the possibility to be replicated directly to the PostGIS/PostgreSQL without designing the architecture in any way and scale to serve the millions of the geometries of a nation.

**National Interoperability**
Metadata vault has the possibility of generating all the necessary XML of the ISO 19115:2003 on a dataset — to either NGDI or Bhuvan (ISRO) or Google Earth Engine usage.

| Capability | Implementation |
| :--- | :--- |
| **Data Ingestion** | `os.walk()` — zero config for any new state or district |
| **Database Scale** | GeoPandas → PostGIS, no rewrites needed |
| **Interoperability** | ISO 19115:2003 XML — NGDI / Bhuvan / GEE ready |
| **CRS Handling** | Auto-reproject any EPSG → 4326 |
| **Speed** | < 4 seconds — 57 features, 6 datasets, 8 stages |
| **Deployment** | Live: [https://samyu076.github.io/TIDE_VAULT/](https://samyu076.github.io/TIDE_VAULT/) |

---

### 2. Effective Utilisation of Provided Datasets
They were in shapefiles namely `A_2011.shp`, `A_2019.shp`, `Site_2_Boundary.shp` (Location A), and `C_2011.shp`, `C_2019.shp`, `Site_1_Boundary.shp` (Location B) having a CRS: EPSG:32643. The fields were tabulated and all the fields entered on the calculators.

**Field-by-Field Utilisation:**

| Field | Usage | Output |
| :--- | :--- | :--- |
| **OBJECTID** | Epoch traceability 2011↔2019 | OID 637 ×3 dup (A_2011), ×4 dup (A_2019); OID 635 ×4 dup (C_2019) — CRITICAL breaks |
| **Shape_Leng** | TRI score, Erosion rate m/yr, ML input | OID 11 = 30,141.87 m — 7.1× mean; flagged at 94.2% confidence |
| **Feature_Na** | Schema drift and Feature Classification | HTL (2011) and SEA/CREEK (2019) — auto detected and standardised |
| **Label** | Schema evolution detection | Absent for 2011, found for 2019 — v1→v2 migration flag, backfill required. |
| **.prj file** | CRS compliance validation | Verified against EPSG:32643; CRS score 100/100; auto-reprojected to 4326 |
| **Site Boundaries** | Cadastral Metadata | OBJECTID=0 on 4 of 5 records in Site_1_Boundary — blank field violation flagged |

**TRI Engine — Weighted Trust Score per Dataset:**

| Dataset | TRI | Level | Key Finding |
| :--- | :--- | :--- | :--- |
| **A_2011** | 46/100 | LOW | 15-yr age decay; OID 637 ×3 dup; 2 zero-geometry features; no Label field |
| **A_2019** | 62/100 | MEDIUM | OID 637 ×4 dup; OID 11 anomaly 30,141.87 m; Label field present |
| **C_2011** | 44/100 | LOW | 15-yr age decay; 11 HTL segments; 2 zero-geometry features; no Label field |
| **C_2019** | 58/100 | MEDIUM | OID 635 ×4 dup — CRITICAL; OID 11 ×2 dup; 18 total records |

> **DECAY ALERT:** A_2011 and C_2011 fall below critical threshold (25/100) in Q1 2028 — re-survey will be required prior to Maharashtra sunset in 2027.

**Shoreline Intelligence**
`Shape_Leng` the period of 2011↔2019 showed the equal values based on OBJECTID. OIDs 636, 638, 692 STABLE at 0.00 m delta. OID 637 traceability break. OID 11 ML-flagged new segment. OID 635 CRITICAL duplication in C_2019. Erosion rate = delta ÷ 8 years per segment.

**CRZ Compliance**
`Shapely.buffer()` on HTL vectors to generate 50m/100m/200m/500m NDZ polygons. Location A: COMPLIANT — OID 27, 786.10 m; CRZ boundary OID 47, 4,164.08 m in A_2019.shp. Location B: PARTIAL — NDZ is not a part of C_2019.shp.

---

### 3. Automation — Workflow and Processing Framework
Speedy slick 8 processes total automatic — no manual interference allowed. Each stage script-driven from the moment the shapefile is dropped in the data directory.

| Stage | Script | What Is Automated |
| :--- | :--- | :--- |
| **1** | `data_loader.py` | Registers all .shp; reads .prj for CRS; infers site, year, schema |
| **2** | `PyProj / GeoPandas` | Auto-reproject EPSG:32643→4326; recalculate geometry, bounding boxes |
| **3** | `issue_detector.py` | Flags duplicate OIDs, zero Shape_Leng, missing Label, blank OBJECTID=0 |
| **4** | `tri_calculator.py` | 5-factor TRI from Shape_Leng, Feature_Na, CRS, age; 10-year decay projection |
| **5** | `htl_analyzer.py` | OBJECTID epoch match; delta_m from Shape_Leng; STABLE/EROSION/NEW classification |
| **6** | `ml_engine.py` | IsolationForest on 57 Shape_Leng values; contamination=0.15; 94.2% confidence |
| **7** | `crz_engine.py` | Shapely.buffer() NDZ polygons from HTL geometry; 1-click PDF audit |
| **8** | `metadata_generator.py` | ISO 19115:2003 XML from all fields; JSON / XML / CSV export |

**Technology Stack:**

| Layer | Tools | Role |
| :--- | :--- | :--- |
| **Backend** | Python 3, FastAPI, Uvicorn | REST API for all 8 modules |
| **Geospatial** | GeoPandas, Fiona, Shapely, PyProj | Shapefile processing, CRS, buffer, topology |
| **AI / ML** | scikit-learn IsolationForest | Shape_Leng unsupervised anomaly detection |
| **Frontend** | React 18, Vite, Tailwind CSS | 7-page dashboard; Optional Chaining eliminates null crashes |
| **Map UI** | react-leaflet, CartoDB Dark | HTL polylines, CRZ buffers, ML markers from provided geometry |
| **Deployment**| Render + GitHub Pages | Live production system |