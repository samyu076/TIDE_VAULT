import geopandas as gpd
from shapely.geometry import Point, MultiLineString, LineString
import numpy as np
from core.data_loader import DATASET_REGISTRY, DATA_DIR
from pyproj import Transformer

def get_parameters(dataset_id: str):
    """
    Computes 8 spatial parameters for a single dataset.
    """
    if dataset_id not in DATASET_REGISTRY:
        return None
        
    meta = DATASET_REGISTRY[dataset_id]
    shp_path = DATA_DIR / meta["path"]
    gdf = gpd.read_file(shp_path)
    
    if "Shape_Leng" not in gdf.columns:
        gdf["Shape_Leng"] = gdf.length
        
    lengths = gdf["Shape_Leng"]
    
    # 1. Total HTL length
    # Note: Features might be HTL lines. 
    # In some datasets like A_2011, specific OIDs are HTL.
    # We'll sum all lengths for simplicity in this general function, 
    # or filter if HTL is a specific type.
    total_len = float(lengths.sum())
    
    # 2. Mean segment length
    mean_len = float(lengths.mean())
    
    # 3. Max segment length
    max_idx = lengths.idxmax()
    max_len = float(lengths.max())
    max_oid = int(max_idx)
    
    # 4. Min segment length
    min_idx = lengths.idxmin()
    min_len = float(lengths.min())
    min_oid = int(min_idx)
    
    # 5. Std Dev
    std_dev = float(lengths.std())
    
    # 6. Feature count by type
    # If exists, use "Type" or similar column. If not, fallback to count.
    type_counts = {}
    if "TYPE" in gdf.columns:
        type_counts = gdf["TYPE"].value_counts().to_dict()
    elif "DESCRIPT" in gdf.columns:
        type_counts = gdf["DESCRIPT"].value_counts().to_dict()
    else:
        type_counts = {"General": len(gdf)}
        
    # 7. Bounding Box in WGS84
    gdf_wgs84 = gdf.to_crs(epsg=4326)
    bbox = list(gdf_wgs84.total_bounds) # minx, miny, maxx, maxy
    
    # 8. Total survey area coverage in sq.km
    # Using total_bounds to create a polygon and calc area
    from shapely.geometry import box
    bounds = gdf.total_bounds
    area_sqm = box(*bounds).area
    area_sqkm = float(area_sqm / 1_000_000)
    
    return {
        "total_htl_length": total_len,
        "mean_length": mean_len,
        "max_length": max_len,
        "max_oid": max_oid,
        "min_length": min_len,
        "min_oid": min_oid,
        "std_dev": std_dev,
        "feature_counts": type_counts,
        "bbox_wgs84": bbox,
        "area_sqkm": area_sqkm
    }

def get_comparison():
    """
    Computes cross-epoch comparisons (2011 vs 2019).
    """
    # Location A: A_2011 vs A_2019
    # Location B: C_2011 vs C_2019
    comp = {}
    
    sites = [
        {"name": "Location A", "id1": "A_2011", "id2": "A_2019"},
        {"name": "Location B", "id1": "C_2011", "id2": "C_2019"}
    ]
    
    for site in sites:
        p1 = get_parameters(site["id1"])
        p2 = get_parameters(site["id2"])
        
        if not p1 or not p2:
            continue
            
        change = p2["total_htl_length"] - p1["total_htl_length"]
        # 9. HTL length change
        # 10. Change rate
        rate = change / 8.0 # 8 years
        
        # 11. New feature types
        types1 = set(p1["feature_counts"].keys())
        types2 = set(p2["feature_counts"].keys())
        new_types = list(types2 - types1)
        
        # 12. Schema evolution
        gdf1 = gpd.read_file(DATA_DIR / DATASET_REGISTRY[site["id1"]]["path"])
        gdf2 = gpd.read_file(DATA_DIR / DATASET_REGISTRY[site["id2"]]["path"])
        fields1 = set(gdf1.columns)
        fields2 = set(gdf2.columns)
        new_fields = list(fields2 - fields1)
        
        # 13. Segment count change
        count_change = len(gdf2) - len(gdf1)
        
        comp[site["name"]] = {
            "length_2011": p1["total_htl_length"],
            "length_2019": p2["total_htl_length"],
            "change": change,
            "change_rate": rate,
            "new_features": new_types,
            "schema_evolution": new_fields,
            "count_change": count_change
        }
        
    return comp

def get_buffer_areas(dataset_id: str):
    """
    Calculates CRZ buffer areas using Shapely buffer.
    """
    if dataset_id not in DATASET_REGISTRY:
        return None
        
    shp_path = DATA_DIR / DATASET_REGISTRY[dataset_id]["path"]
    gdf = gpd.read_file(shp_path)
    
    # Combine all geometries to one multi-line for buffering
    # (Assuming these are the HTL lines)
    union_geom = gdf.geometry.unary_union
    
    # 14-17. Buffer areas
    buffers = [50, 100, 200, 500]
    areas = {}
    
    for dist in buffers:
        # Buffer calculation in metres (since data is EPSG:32643)
        buffer_geom = union_geom.buffer(dist)
        areas[f"area_{dist}m"] = float(buffer_geom.area)
        
    return areas
