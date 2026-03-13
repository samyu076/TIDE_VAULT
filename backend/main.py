from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, Response
from core.data_loader import load_dataset, DATASET_REGISTRY
from core.tri_calculator import calculate_tri
from core.htl_analyzer import analyze_htl_continuity
from core.crz_engine import compute_crz_compliance
from core.metadata_generator import generate_iso19115_xml
from routers.datasets import router as framework_router
from ml_engine import detect_anomalies
from spatial_parameters import get_parameters, get_comparison, get_buffer_areas
from performance_tracker import tracker
import json

app = FastAPI(title="TideVault API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(framework_router)

@app.get("/api/health")
def health():
    return {"status": "ok", "datasets_loaded": len(DATASET_REGISTRY), "issues_total": 18}

@app.get("/api/datasets")
def list_datasets():
    return [load_dataset(did) for did in DATASET_REGISTRY.keys()]

@app.get("/api/datasets/{id}")
def get_dataset(id: str):
    if id not in DATASET_REGISTRY:
        raise HTTPException(status_code=404, detail="Dataset not found")
    return load_dataset(id)

@app.get("/api/datasets/{id}/export/geojson")
def export_geojson(id: str):
    ds = load_dataset(id)
    return JSONResponse(content=ds["geojson"])

@app.get("/api/datasets/{id}/export/iso19115")
def export_iso(id: str):
    xml_content = generate_iso19115_xml(id)
    return Response(content=xml_content, media_type="application/xml")

@app.get("/api/tri")
def list_tri():
    ids = ["A_2011", "A_2019", "C_2011", "C_2019"]
    return [calculate_tri(did) for did in ids]

@app.get("/api/tri/{id}")
def get_tri(id: str):
    return calculate_tri(id)

@app.get("/api/htl/{site}/analysis")
def get_htl_analysis(site: str):
    return analyze_htl_continuity(site)

@app.get("/api/crz/{site}")
def get_crz_analysis(site: str):
    return compute_crz_compliance(site)

@app.get("/api/ml/anomalies")
def get_ml_anomalies():
    return detect_anomalies()

@app.get("/api/parameters/comparison")
def get_params_comparison():
    return get_comparison()

@app.get("/api/parameters/{dataset_id}")
def get_dataset_parameters(dataset_id: str):
    params = get_parameters(dataset_id)
    if not params:
        raise HTTPException(status_code=404, detail="Dataset not found or no parameters")
    # Also add buffer areas if it's an HTL dataset
    if "2011" in dataset_id or "2019" in dataset_id:
        params["buffer_areas"] = get_buffer_areas(dataset_id)
    return params

@app.get("/api/performance")
def get_performance_metrics():
    return tracker.get_report()

@app.get("/api/governance/dashboard")
def get_governance_data():
    datasets = [load_dataset(did) for did in DATASET_REGISTRY.keys()]
    total_issues = sum(len(d["issues"]) for d in datasets)
    avg_tri = sum(calculate_tri(did)["tri_score"] for did in ["A_2011", "A_2019", "C_2011", "C_2019"]) / 4
    
    return {
        "total_issues": total_issues,
        "avg_tri": round(avg_tri, 1),
        "dataset_count": len(datasets),
        "compliance_matrix": [
            {"id": d["id"], "quality": d["quality_score"], "issues": len(d["issues"])} 
            for d in datasets
        ]
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
