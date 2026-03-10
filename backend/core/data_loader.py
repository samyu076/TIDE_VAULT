import os
import re
from pathlib import Path
import geopandas as gpd
import json, hashlib
from datetime import datetime
from core.issue_detector import detect_issues
from core.tri_calculator import compute_quality_score

# Dynamic Data Directory resolving relative to this file's parent 'core'
DATA_DIR = Path(__file__).resolve().parent.parent.parent / "data"

def scan_and_register_datasets() -> dict:
    """
    Auto-discovers all shapefiles in the data directory.
    This is the systematic cataloguing framework — any .shp
    file placed in /data is automatically registered.
    """
    registry = {}
    
    # Recursively find all .shp files
    shp_files = list(DATA_DIR.rglob("*.shp"))
    
    for shp_path in shp_files:
        # Generate a clean dataset ID from the filename
        dataset_id = shp_path.stem  # filename without extension
        
        # Infer year from filename
        year_match = re.search(r'(20\d{2}|19\d{2})', dataset_id)
        year = int(year_match.group()) if year_match else None
        
        # Infer site from parent folder name
        folder = shp_path.parent.name.lower()
        if 'location_a' in folder or 'loc_a' in folder:
            site = "Location A"
            site_id = "SITE-2"
        elif 'location_b' in folder or 'loc_b' in folder:
            site = "Location B"
            site_id = "SITE-1"
        else:
            site = folder.replace('_', ' ').title()
            site_id = folder.upper()
        
        # Infer schema version
        if year and year >= 2019:
            schema_version = "v2"
        elif year and year <= 2011:
            schema_version = "v1"
        else:
            schema_version = "boundary"
        
        # Generate sequential file ID
        file_id = f"AUTO-{len(registry)+1:03d}"
        
        registry[dataset_id] = {
            "path": str(shp_path.relative_to(DATA_DIR)).replace("\\", "/"),
            "site": site,
            "site_id": site_id,
            "year": year,
            "schema_version": schema_version,
            "file_id": file_id,
            "auto_discovered": True,
            "discovery_time": datetime.utcnow().isoformat()
        }
        
        print(f"✅ Auto-registered: {dataset_id} "
              f"({site}, {year or 'no year'})")
    
    print(f"\n📦 TideVault Framework: "
          f"{len(registry)} datasets discovered in /data")
    return registry

# Initialize Global Registry via Auto-Discovery
DATASET_REGISTRY = scan_and_register_datasets()

def load_dataset(dataset_id: str) -> dict:
    if dataset_id not in DATASET_REGISTRY:
        raise KeyError(f"Dataset {dataset_id} not found in registry")
        
    meta = DATASET_REGISTRY[dataset_id]
    shp_path = DATA_DIR / meta["path"]
    if not shp_path.exists():
        raise FileNotFoundError(f"Shapefile not found at {shp_path}")
        
    gdf = gpd.read_file(shp_path)
    gdf_wgs84 = gdf.to_crs(epsg=4326)

    return {
        "id": dataset_id,
        "file_id": meta["file_id"],
        "site": meta["site"],
        "site_id": meta["site_id"],
        "year": meta["year"],
        "schema_version": meta["schema_version"],
        "crs": str(gdf.crs),
        "epsg": gdf.crs.to_epsg(),
        "crs_valid": gdf.crs.to_epsg() == 32643,
        "feature_count": len(gdf),
        "fields": list(gdf.columns.drop("geometry")),
        "geometry_type": gdf.geom_type.iloc[0] if len(gdf) > 0 else "Unknown",
        "bbox": list(gdf.total_bounds),
        "bbox_wgs84": list(gdf_wgs84.total_bounds),
        "file_size_kb": round(
            shp_path.stat().st_size / 1024, 1
        ),
        "last_computed": datetime.utcnow().isoformat(),
        "records": json.loads(
            gdf.drop(columns="geometry").to_json(orient="records")
        ),
        "geojson": json.loads(gdf_wgs84.to_json()),
        "issues": detect_issues(gdf, dataset_id),
        "quality_score": compute_quality_score(gdf, dataset_id)
    }
