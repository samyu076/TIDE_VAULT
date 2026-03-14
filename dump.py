import sys
sys.path.append('backend')
from core.data_loader import DATASET_REGISTRY, DATA_DIR
import geopandas as gpd

def get_coords(ds_id):
    ds = DATASET_REGISTRY.get(ds_id)
    if not ds: return []
    gdf = gpd.read_file(DATA_DIR / ds['path'])
    gdf_wgs = gdf.to_crs(epsg=4326)
    # Find HTL lines
    if 'Feature_Na' in gdf_wgs.columns:
        htl = gdf_wgs[gdf_wgs['Feature_Na'].isin(['HTL', 'SEA', 'CREEK'])]
    else:
        htl = gdf_wgs
    coords = []
    for geom in htl.geometry:
        if geom.geom_type == 'LineString':
            # sample every 5th point to keep it small for hardcoding
            pts = list(geom.coords)[::5]
            coords.append([[round(p[1], 5), round(p[0], 5)] for p in pts])
        elif geom.geom_type == 'MultiLineString':
            for line in geom.geoms:
                pts = list(line.coords)[::5]
                coords.append([[round(p[1], 5), round(p[0], 5)] for p in pts])
                
    # Flatten slightly if only one line
    if len(coords) == 1:
        return coords[0]
    return coords

print("A_2011 =", get_coords('A_2011')[:1][0][:5], "...")
print("A_2019 =", get_coords('A_2019')[:1][0][:5], "...")

with open('dump_coords.js', 'w') as f:
    f.write("export const coast_paths = {\n")
    for ds in ['A_2011', 'A_2019', 'C_2011', 'C_2019']:
         f.write(f"  '{ds}': {get_coords(ds)},\n")
    f.write("};\n")
