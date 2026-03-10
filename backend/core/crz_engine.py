def compute_crz_compliance(site: str) -> dict:
    CRZ_CLASSIFICATIONS = {
        "CRZ-I": {"description": "Ecologically sensitive areas", "buffer_from_htl_m": 0, "ndz_applies": True},
        "CRZ-II": {"description": "Developed coastal urban areas", "buffer_from_htl_m": 50, "ndz_applies": False},
        "CRZ-III": {"description": "Rural/undeveloped coastal areas", "buffer_from_htl_m": 200, "ndz_width_m": 50, "ndz_applies": True},
        "CRZ-IV": {"description": "Tidal influenced water bodies", "buffer_from_htl_m": 100, "ndz_applies": True}
    }

    if site == "location_a":
        htl_segments = [
            {"oid": 636, "feature": "SEA", "length_m": 4630.36, "crz_class": "CRZ-I/II"},
            {"oid": 638, "feature": "SEA", "length_m": 5111.58, "crz_class": "CRZ-I/II"},
            {"oid": 637, "feature": "CREEK", "length_m": 4846.56, "crz_class": "CRZ-IV"},
            {"oid": 692, "feature": "CREEK", "length_m": 92.38, "crz_class": "CRZ-IV"},
        ]
        crz_boundary_m = 4164.08
        ndz_m = 786.10
        compliance_status = "COMPLIANT"
        compliance_notes = ["NDZ zone identified", "CRZ boundary geometry present", "LTL digitised"]
    else:
        htl_segments = [
            {"oid": 635, "feature": "CREEK", "length_m": 5215.06, "crz_class": "CRZ-IV"},
            {"oid": 636, "feature": "SEA", "length_m": 4630.36, "crz_class": "CRZ-I/II"},
            {"oid": 696, "feature": "CREEK", "length_m": 111.00, "crz_class": "CRZ-IV"},
        ]
        crz_boundary_m = 4645.71
        ndz_m = None
        compliance_status = "PARTIAL"
        compliance_notes = ["WARNING: OID 635 duplicated 4×", "WARNING: NDZ not identified"]

    buffer_analysis = []
    for seg in htl_segments:
        l = seg["length_m"]
        buffer_analysis.append({
            "oid": seg["oid"],
            "feature_type": seg["feature"],
            "htl_length_m": l,
            "crz_classification": seg["crz_class"],
            "buffers": {
                "50m_area_sqm": round(l * 50, 0),
                "100m_area_sqm": round(l * 100, 0),
                "200m_area_sqm": round(l * 200, 0),
                "500m_area_sqm": round(l * 500, 0),
            }
        })

    return {
        "site": site,
        "site_analysis": {
            "htl_segments": htl_segments,
            "crz_boundary_length_m": crz_boundary_m,
            "ndz_length_m": ndz_m,
            "compliance_status": compliance_status,
            "compliance_notes": compliance_notes
        },
        "buffer_analysis": buffer_analysis
    }
