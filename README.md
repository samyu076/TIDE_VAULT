# 🌊 TideVault: Coastal Geospatial Intelligence & Governance Framework

TideVault is a comprehensive, full-stack solution designed for the systematic cataloguing, integration, and documentation of multi-temporal coastal geospatial datasets. Developed for the 2026 National Hackathon, it addresses the critical need for shoreline continuity and regulatory traceability.

## 🚀 Key Advantages

- **Dual-Capability Architecture:** Operates as both a high-performance **GIS Spatial Database** and a **Web-Enabled Portal**.
- **Automated Discovery:** OS-level scanning for seamless dataset ingestion and registration.
- **Temporal Continuity Audit:** Mathematical analysis of High Tide Line (HTL) drift across survey epochs (2011 ↔ 2019).
- **ISO Standardized Documentation:** Automated generation of ISO-19115 compliant metadata.
- **TRI Engine:** Introducing the **Temporal Reliability Index**, a heuristic model for quantifying dataset trust and sustainability.

## 🛠️ Technology Stack

- **Backend:** FastAPI, Python 3.10+, Uvicorn (Asynchronous Processing)
- **Geospatial Engine:** GeoPandas, Shapely, PyProj (CRS: EPSG:32643 to WGS84)
- **Frontend:** React 18, Leaflet.js, Lucide Icons
- **Design:** Custom Glassmorphism UI built with Vanilla CSS
- **Data:** ESRI Shapefiles (.shp), GeoJSON, ISO XML

## 📋 Problem Statement Compliance

TideVault is 100% compliant with the official problem statement:
- **Systematic Cataloguing:** Automated discovery and indexing.
- **Traceability:** Vector-level auditing of shoreline changes.
- **Interoperability:** Standardized ISO documentation.
- **Sustainability:** Long-term governance via the TRI scoring system.

## 🚦 Getting Started

### Prerequisites
- Python 3.10+
- Node.js & npm

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/samyu076/TIDE_VAULT.git
   ```
2. Setup Backend:
   ```bash
   cd backend
   pip install -r requirements.txt
   uvicorn main:app --reload
   ```
3. Setup Frontend:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

---
*Developed for the National Hackathon 2026.*
