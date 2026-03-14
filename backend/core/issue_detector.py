def detect_issues(gdf, dataset_id: str) -> list:
    issues = []

    # 1. Duplicate OBJECTIDs (CRITICAL if count > 2)
    if "OBJECTID" in gdf.columns:
        oid_counts = gdf["OBJECTID"].value_counts()
        dupes = oid_counts[oid_counts > 1]
        for oid, count in dupes.items():
            severity = "CRITICAL" if count >= 4 else "HIGH" if count >= 3 else "HIGH"
            issues.append({
                "severity": severity,
                "type": "DUPLICATE_OBJECTID",
                "field": "OBJECTID",
                "detail": f"OBJECTID {oid} appears {count} times — traceability break",
                "affected_count": int(count),
                "recommendation": f"Assign unique IDs to all {count} records "
                                  f"with OID={oid}. Use UUID or auto-increment.",
                "iso_element": "MD_DataQuality > DQ_LogicalConsistency"
            })

    # 2. Zero-geometry / zero-length features
    if "Shape_Leng" in gdf.columns:
        zeros = gdf[gdf["Shape_Leng"] == 0]
        if len(zeros) > 0:
            feat_names = zeros["Feature_Na"].tolist() if "Feature_Na" in zeros else []
            issues.append({
                "severity": "HIGH",
                "type": "ZERO_GEOMETRY",
                "field": "Shape_Leng",
                "detail": f"{len(zeros)} features have zero length: "
                          f"{feat_names} — likely placeholder entries",
                "affected_count": len(zeros),
                "recommendation": "Digitise actual geometry or mark as "
                                  "'provisional' with a status field.",
                "iso_element": "MD_DataQuality > DQ_CompletenessCommission"
            })

    # 3. Missing Label field (schema v1 gap)
    if "Label" not in gdf.columns:
        issues.append({
            "severity": "MEDIUM",
            "type": "MISSING_FIELD",
            "field": "Label",
            "detail": "Label field absent — present in 2019 schema only. "
                      "Prevents cartographic display consistency.",
            "affected_count": len(gdf),
            "recommendation": "Backfill Label field in 2011 datasets using "
                              "Feature_Na as source value.",
            "iso_element": "MD_ContentInformation > MD_FeatureCatalogueDescription"
        })

    # 4. Blank mandatory fields
    for field in ["Feature_Na", "OBJECTID", "CTS_CS_NO", "Coordinato"]:
        if field in gdf.columns:
            if field == "OBJECTID":
                blank_mask = (gdf[field].isna() | (gdf[field] == 0))
            else:
                blank_mask = (gdf[field].isna() |
                              (gdf[field].astype(str).str.strip() == ""))
            blanks = gdf[blank_mask]
            if len(blanks) > 0:
                severity = "HIGH" if field == "OBJECTID" else "MEDIUM"
                issues.append({
                    "severity": severity,
                    "type": "BLANK_MANDATORY_FIELD",
                    "field": field,
                    "detail": f"{len(blanks)} records have blank/zero {field}",
                    "affected_count": len(blanks),
                    "recommendation": f"Populate {field} for all records. "
                                      f"OBJECTID=0 breaks database integrity.",
                    "iso_element": "MD_DataQuality > DQ_CompletenessOmission"
                })

    # 5. No acquisition date field
    date_fields = [f for f in gdf.columns if
                   any(k in f.lower() for k in ["date","year","acq","time"])]
    if not date_fields:
        issues.append({
            "severity": "LOW",
            "type": "MISSING_TEMPORAL_FIELD",
            "field": "AcqDate",
            "detail": "No acquisition date field found — temporal metadata "
                      "relies on filename only",
            "affected_count": len(gdf),
            "recommendation": "Add AcqDate or SurveyYear field to all layers. "
                              "ISO 19115 requires temporal extent.",
            "iso_element": "MD_Identification > EX_TemporalExtent"
        })

    return sorted(issues,
                  key=lambda x: ["CRITICAL","HIGH","MEDIUM","LOW"]
                  .index(x["severity"]))
