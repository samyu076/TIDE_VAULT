import geopandas as gpd
from shapely.geometry import LineString, Polygon
import pandas as pd
from pathlib import Path

def create_mock_shapefiles():
    data_dir = Path("data")
    (data_dir / "location_a").mkdir(parents=True, exist_ok=True)
    (data_dir / "location_b").mkdir(parents=True, exist_ok=True)

    # Helper to save with all sidecars
    def save_shp(gdf, path):
        gdf.to_file(path)

    # --- LOCATION A: SITE 2 ---
    # A_2011.shp
    a2011_data = {
        "OBJECTID": [636, 637, 637, 637, 638, 692, 0, 0],
        "Feature_Na": ["HTL", "HTL", "HTL", "HTL", "HTL", "HTL", "LTL", "CRZ"],
        "Shape_Leng": [4630.36, 4846.56, 4846.56, 4846.56, 5111.58, 92.38, 0.0, 0.0]
    }
    # Mock geometries (UTM 43N around 19.05N, 72.85E approx)
    geoms = [LineString([(728500, 2108000), (728500 + l, 2108000)]) if l > 0 else LineString([(728500, 2108000), (728500, 2108000)]) for l in a2011_data["Shape_Leng"]]
    gdf_a2011 = gpd.GeoDataFrame(a2011_data, geometry=geoms, crs="EPSG:32643")
    save_shp(gdf_a2011, data_dir / "location_a/A_2011.shp")

    # A_2019.shp
    a2019_data = {
        "OBJECTID": [636, 637, 637, 637, 638, 692, 47, 0, 27, 11, 11],
        "Feature_Na": ["SEA", "CREEK", "CREEK", "CREEK", "SEA", "CREEK", "CRZ", "", "NDZ", "", ""],
        "Shape_Leng": [4630.36, 4846.56, 4846.56, 4846.56, 5111.58, 92.38, 4164.08, 0.0, 786.10, 30141.87, 30141.87],
        "Label": ["High Tide Line"] * 6 + ["CRZ Boundary"] * 2 + ["CRZ Boundary"] + ["Low Tide Line"] * 2
    }
    geoms_2019 = [LineString([(728500, 2108000), (728500 + l, 2108050)]) if l > 0 else LineString([(728500, 2108000), (728500, 2108000)]) for l in a2019_data["Shape_Leng"]]
    gdf_a2019 = gpd.GeoDataFrame(a2019_data, geometry=geoms_2019, crs="EPSG:32643")
    save_shp(gdf_a2019, data_dir / "location_a/A_2019.shp")

    # Site_2_Boundary.shp
    a_bound_data = {
        "OBJECTID": [25813, 0, 0],
        "CTS_CS_NO": ["1049C", "345", "678"],
        "Coordinato": ["SJ", "DTV", "KSR"],
        "State": ["MH", "MH", "MH"],
        "Institute": ["IRS", "IRS", "IRS"],
        "Client": ["Enviro", "", ""]
    }
    poly_geoms = [Polygon([(728000, 2107000), (729000, 2107000), (729000, 2108000), (728000, 2108000)])] * 3
    gdf_a_bound = gpd.GeoDataFrame(a_bound_data, geometry=poly_geoms, crs="EPSG:32643")
    save_shp(gdf_a_bound, data_dir / "location_a/Site_2_Boundary.shp")

    # --- LOCATION B: SITE 1 ---
    # C_2011.shp
    c2011_data = {
        "OBJECTID": [635, 636, 696, 697, 698, 699, 700, 701, 702, 703, 704, 0, 0],
        "Feature_Na": ["HTL"] * 11 + ["LTL", "CRZ"],
        "Shape_Leng": [5215.06, 4630.36, 111.0, 347.36, 43.21, 124.79, 132.81, 244.75, 133.31, 68.19, 244.47, 0.0, 0.0]
    }
    geoms_c2011 = [LineString([(728800, 2109000), (728800 + l, 2109000)]) if l > 0 else LineString([(728800, 2109000), (728800, 2109000)]) for l in c2011_data["Shape_Leng"]]
    gdf_c2011 = gpd.GeoDataFrame(c2011_data, geometry=geoms_c2011, crs="EPSG:32643")
    save_shp(gdf_c2011, data_dir / "location_b/C_2011.shp")

    # C_2019.shp
    c2019_data = {
        "OBJECTID": [635, 635, 635, 635, 636, 696, 697, 698, 699, 700, 701, 702, 703, 704, 47, 48, 11, 11],
        "Feature_Na": ["CREEK"] * 4 + ["SEA"] + ["CREEK"] * 9 + ["CRZ", "CRZ", "", ""],
        "Shape_Leng": [5215.06, 5215.06, 5215.06, 5215.06, 4630.36, 111.0, 347.36, 43.21, 124.79, 132.81, 244.75, 133.31, 68.19, 244.47, 4164.08, 481.63, 30141.87, 30141.87],
        "Label": ["High Tide Line"] * 14 + ["CRZ Boundary"] * 2 + ["Low Tide Line"] * 2
    }
    geoms_c2019 = [LineString([(728800, 2109000), (728800 + l, 2109050)]) if l > 0 else LineString([(728800, 2109000), (728800, 2109000)]) for l in c2019_data["Shape_Leng"]]
    gdf_c2019 = gpd.GeoDataFrame(c2019_data, geometry=geoms_c2019, crs="EPSG:32643")
    save_shp(gdf_c2019, data_dir / "location_b/C_2019.shp")

    # Site_1_Boundary.shp
    c_bound_data = {
        "OBJECTID": [26064, 0, 0, 0, 0],
        "CTS_CS_NO": ["157", "190", "178", "148", ""],
        "Coordinato": ["KSP", "MS", "CUK", "KSR", ""],
        "Institute": ["IRS", "IRS", "IRS", "IRS", ""],
        "State": ["MH", "MH", "MH", "MH", ""],
        "Client": ["ENviro", "Sushan", "Augus", "Sharth", "AbAsso"]
    }
    poly_geoms_c = [Polygon([(728000, 2109000), (729000, 2109000), (729000, 2110000), (728000, 2110000)])] * 5
    gdf_c_bound = gpd.GeoDataFrame(c_bound_data, geometry=poly_geoms_c, crs="EPSG:32643")
    save_shp(gdf_c_bound, data_dir / "location_b/Site_1_Boundary.shp")

    print("Mock shapefiles generated successfully.")

if __name__ == "__main__":
    create_mock_shapefiles()
