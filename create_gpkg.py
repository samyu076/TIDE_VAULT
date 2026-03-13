#!/usr/bin/env python3
"""Quick minimal GeoPackage creation"""

import geopandas as gpd
from shapely.geometry import LineString
from pathlib import Path

output_path = Path("backend/data/coastmetaai.gpkg")
output_path.parent.mkdir(parents=True, exist_ok=True)

print("Creating minimal coastmetaai.gpkg...")

# Create minimal dataset
data = {
    "OBJECTID": [1, 2, 3],
    "Feature_Na": ["HTL", "LTL", "CRZ"],
    "Shape_Leng": [4630.36, 4846.56, 5111.58]
}

geoms = [
    LineString([(728500, 2108000), (728600, 2108000)]),
    LineString([(728500, 2108100), (728600, 2108100)]),
    LineString([(728500, 2108200), (728600, 2108200)])
]

gdf = gpd.GeoDataFrame(data, geometry=geoms, crs="EPSG:32643")
gdf.to_file(output_path, layer="coastal_features", driver="GPKG")

print(f"✓ GeoPackage created: {output_path}")
print(f"  Geometry: LineString")
print(f"  CRS: EPSG:32643")
print(f"  Features: {len(gdf)}")
