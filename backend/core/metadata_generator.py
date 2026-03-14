from core.data_loader import load_dataset, DATASET_REGISTRY

def generate_iso19115_xml(dataset_id: str) -> str:
    ds = load_dataset(dataset_id)
    meta = DATASET_REGISTRY[dataset_id]
    year = meta.get("year", "Unknown")
    site = meta["site"]
    bbox = ds["bbox_wgs84"]

    xml = f'''<?xml version="1.0" encoding="UTF-8"?>
<gmd:MD_Metadata xmlns:gmd="http://www.isotc211.org/2005/gmd" xmlns:gco="http://www.isotc211.org/2005/gco" xmlns:gml="http://www.opengis.net/gml">
  <gmd:fileIdentifier><gco:CharacterString>{dataset_id}</gco:CharacterString></gmd:fileIdentifier>
  <gmd:language><gco:CharacterString>eng</gco:CharacterString></gmd:language>
  <gmd:hierarchyLevel><gmd:MD_ScopeCode codeListValue="dataset"/></gmd:hierarchyLevel>
  <gmd:contact>
    <gmd:CI_ResponsibleParty>
      <gmd:organisationName><gco:CharacterString>Institute of Remote Sensing (IRS), Maharashtra, India</gco:CharacterString></gmd:organisationName>
      <gmd:role><gmd:CI_RoleCode codeListValue="originator"/></gmd:role>
    </gmd:CI_ResponsibleParty>
  </gmd:contact>
  <gmd:dateStamp><gco:Date>{year}-01-01</gco:Date></gmd:dateStamp>
  <gmd:identificationInfo>
    <gmd:MD_DataIdentification>
      <gmd:citation>
        <gmd:CI_Citation>
          <gmd:title><gco:CharacterString>TideVault: {site} Coastal Survey {year}</gco:CharacterString></gmd:title>
          <gmd:date>
            <gmd:CI_Date>
              <gmd:date><gco:Date>{year}-01-01</gco:Date></gmd:date>
              <gmd:dateType><gmd:CI_DateTypeCode codeListValue="creation"/></gmd:dateType>
            </gmd:CI_Date>
          </gmd:date>
        </gmd:CI_Citation>
      </gmd:citation>
      <gmd:abstract><gco:CharacterString>Multi-temporal coastal geospatial dataset for {site}, Maharashtra, India. Survey year: {year}. Feature count: {ds["feature_count"]}. Quality score: {ds["quality_score"]}/100.</gco:CharacterString></gmd:abstract>
      <gmd:extent>
        <gmd:EX_Extent>
          <gmd:geographicElement>
            <gmd:EX_GeographicBoundingBox>
              <gmd:westBoundLongitude><gco:Decimal>{round(bbox[0],6)}</gco:Decimal></gmd:westBoundLongitude>
              <gmd:eastBoundLongitude><gco:Decimal>{round(bbox[2],6)}</gco:Decimal></gmd:eastBoundLongitude>
              <gmd:southBoundLatitude><gco:Decimal>{round(bbox[1],6)}</gco:Decimal></gmd:southBoundLatitude>
              <gmd:northBoundLatitude><gco:Decimal>{round(bbox[3],6)}</gco:Decimal></gmd:northBoundLatitude>
            </gmd:EX_GeographicBoundingBox>
          </gmd:geographicElement>
        </gmd:EX_Extent>
      </gmd:extent>
    </gmd:MD_DataIdentification>
  </gmd:identificationInfo>
  <gmd:dataQualityInfo>
    <gmd:DQ_DataQuality>
      <gmd:lineage>
        <gmd:LI_Lineage>
          <gmd:statement><gco:CharacterString>Processed and catalogued by TideVault system. CRS: EPSG:32643.</gco:CharacterString></gmd:statement>
        </gmd:LI_Lineage>
      </gmd:lineage>
    </gmd:DQ_DataQuality>
  </gmd:dataQualityInfo>
</gmd:MD_Metadata>'''
    return xml
