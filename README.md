# TideVault — Coastal Intelligence System

> *"Most teams catalogue coastal data. We evaluate its continuity, legal compliance, and trust-decay over time."*

**National Hackathon 2026 | Maharashtra Coast | Geospatial Framework**

---

## 🌊 Executive Summary
TideVault is a full-stack coastal geospatial intelligence framework designed for the systematic cataloguing, audit, and traceability of multi-temporal coastal datasets. It solves the "Static Data Trap" by treating geospatial layers not just as files, but as living, decaying assets that require constant continuity verification.

### 🏗️ Problem Statement Alignment
- **Systematic Cataloguing:** Automated discovery and metadata extraction from diverse shapefile sources.
- **Interoperability:** ISO 19115 compliant metadata generation and OGC-ready schemas.
- **Traceability:** Segment-level High Tide Line (HTL) continuity matrices across temporal scales (2011 vs 2019).
- **Sustainability:** A Dynamic Governance framework that calculates data trust-decay and predicts re-survey requirements.

---

## 🚀 Features Built
### 1. Auto-Discovery Framework
- **Dynamic Scanning:** backend/core/data_loader.py recursively scans the filesystem for .shp files, automatically registering them into the vault.
- **Metadata Inferencing:** Automatically extracts site names (Location A/B) and survey years (2011/2019) from filenames and directory structures.

### 2. TRI-Coast Engine (Temporal Reliability Index)
- **Trust Formula:** A proprietary weighted scoring algorithm that evaluates dataset reliability based on:
  - **Temporal Decay (30%)**: Age of survey vs current planning year.
  - **Update Frequency (25%)**: Historical continuity of updates.
  - **Spatial Accuracy (25%)**: Geometry audit (zero-length checks, duplication).
  - **Compliance (20%)**: CRS and Attribute schema validity.

### 3. HTL Continuity Matrix
- **Traceability Bridge:** Cross-epoch segment analysis to detect "drifting" shorelines.
- **Audit Feed:** Identifies OBJECTID duplications and geometry errors that could break legal traceability.

### 4. Metadata Vault (ISO 19115)
- **Standards-First:** Dynamic generation of ISO-compliant XML metadata for every discovered asset.
- **Interoperability:** Support for GeoJSON and Data Dictionary exports to ensure multi-agency use.

### 5. Governance Intelligence
- **Regulatory Countdown:** Real-time visibility into "Data Sunset" — when datasets lose legal validity per CRZ notifications.
- **Algorithmic Recommendations:** Hands-on advice for GIS analysts on fixing specific topological errors found in the vault.

---

## 🔬 Data Quality Findings (Audit Results)
During the framework implementation, our engines identified several critical issues in the provided datasets:
- **Location B (2019):** Found 4 duplicate OBJECTIDs (OID 635) which breaks segment-level traceability.
- **Location A (2011):** 78 features detected with Zero Geometry (Shape_Leng = 0).
- **Convergence:** HTL-drift detected in Location A Sector 4, indicating either erosion or survey calibration error.

---

## 🛠️ Quick Start

### 1. Prerequisites
- Python 3.9+
- Node.js 18+

### 2. Fast Launch (All-in-One)
**Windows:**
```bash
./start.bat
```
**Linux/macOS:**
```bash
chmod +x start.sh
./start.sh
```

### 3. Manual Setup
**Backend:**
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```
**Frontend:**
```bash
cd frontend
npm install
npm run dev
```

---

## 🧬 Tech Stack
- **Backend:** FastAPI (Python), GeoPandas, Shapely, PyProj.
- **Frontend:** React, Vite, TailwindCSS, Framer Motion, Recharts.
- **GIS Core:** Coordinate projection (EPSG:32643), ISO 19115 Standards.

---

## 📂 Project Structure
```text
TideVault (Root)
├── data/                  # Source Shapefiles (Location A & B)
├── backend/
│   ├── core/              # Engines: TRI, Continuity, Discovery
│   ├── routers/           # API Endpoints
│   └── main.py            # FastAPI Entry
├── frontend/
│   ├── src/
│   │   ├── pages/         # Dashboard, TRI, Intelligence, Governance
│   │   ├── components/    # Reusable UI Blocks
│   │   └── assets/        # TideVault Branding
└── README.md              # Project Documentation
```

---
**Developed for the Maharashtra Coastal Governance Hackathon 2026.**
