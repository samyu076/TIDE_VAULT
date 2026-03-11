import os
from core.metadata_generator import generate_iso19115_xml
from core.data_loader import DATASET_REGISTRY

def export_all_metadata():
    print("🚀 Exporting ISO-19115 Metadata for GIS Database Verification...")
    
    for dataset_id, info in DATASET_REGISTRY.items():
        try:
            # Generate the XML content
            xml_content = generate_iso19115_xml(dataset_id)
            
            # Determine the path where the .shp would be
            # Based on current structure: backend/data/location/year/
            site = info['site'].lower().replace(' ', '_')
            year = str(info['year'])
            target_dir = os.path.join('data', site, year)
            
            # Create directory if it doesn't exist
            os.makedirs(target_dir, exist_ok=True)
            
            # Save the file
            file_path = os.path.join(target_dir, f'ISO_19115_METADATA_{dataset_id}.xml')
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(xml_content)
            
            print(f"✅ Exported: {file_path}")
            
        except Exception as e:
            print(f"❌ Failed to export {dataset_id}: {str(e)}")

if __name__ == "__main__":
    export_all_metadata()
