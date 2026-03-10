from core.data_loader import load_dataset

def analyze_htl_continuity(site: str) -> dict:
    if site == "location_a":
        ds_2011 = load_dataset("A_2011")
        ds_2019 = load_dataset("A_2019")
        site_label = "Location A (Site 2)"
    else:
        ds_2011 = load_dataset("C_2011")
        ds_2019 = load_dataset("C_2019")
        site_label = "Location B (Site 1)"

    def get_htl(records):
        htl = []
        for r in records:
            feat = r.get("Feature_Na","") or ""
            label = r.get("Label","") or ""
            if (feat.upper() in ["HTL","SEA","CREEK"] or 
                "tide line" in label.lower() or 
                "high tide" in label.lower()):
                htl.append(r)
        return htl

    htl_2011 = get_htl(ds_2011["records"])
    htl_2019 = get_htl(ds_2019["records"])

    def dedup(records):
        seen = {}
        for r in records:
            oid = r.get("OBJECTID")
            if oid not in seen:
                seen[oid] = r
        return list(seen.values())

    unique_2011 = dedup(htl_2011)
    unique_2019 = dedup(htl_2019)

    comparison = []
    all_oids = set([r["OBJECTID"] for r in unique_2011] + [r["OBJECTID"] for r in unique_2019])
    for oid in sorted(all_oids):
        r11 = next((r for r in unique_2011 if r["OBJECTID"]==oid), None)
        r19 = next((r for r in unique_2019 if r["OBJECTID"]==oid), None)
        len11 = float(r11["Shape_Leng"]) if r11 else None
        len19 = float(r19["Shape_Leng"]) if r19 else None

        if len11 and len19:
            delta = round(len19 - len11, 2)
            pct = round((delta / len11) * 100, 2) if len11 > 0 else 0
            status = ("STABLE" if abs(pct) < 1 else "ACCRETION" if delta > 0 else "EROSION")
        elif len19 and not len11:
            delta, pct, status = None, None, "NEW_SEGMENT"
        else:
            delta, pct, status = None, None, "REMOVED"

        comparison.append({
            "oid": oid,
            "length_2011": len11,
            "length_2019": len19,
            "delta_m": delta,
            "change_pct": pct,
            "status": status,
            "feature_2011": r11.get("Feature_Na") if r11 else None,
            "feature_2019": r19.get("Feature_Na") if r19 else None
        })

    def find_duplicates(records):
        from collections import Counter
        oid_counts = Counter(r["OBJECTID"] for r in records)
        return {oid: count for oid, count in oid_counts.items() if count > 1}

    dupes_2011 = find_duplicates(htl_2011)
    dupes_2019 = find_duplicates(htl_2019)

    total_len_2011 = sum(float(r["Shape_Leng"]) for r in unique_2011)
    total_len_2019 = sum(float(r["Shape_Leng"]) for r in unique_2019)

    continuity_score = 100
    continuity_score -= len(dupes_2019) * 15
    unmatched = [c for c in comparison if c["status"] in ["NEW_SEGMENT","REMOVED"]]
    continuity_score -= len(unmatched) * 5
    continuity_score = max(0, continuity_score)

    return {
        "site": site_label,
        "summary": {
            "htl_segments_2011": len(unique_2011),
            "htl_segments_2019": len(unique_2019),
            "total_htl_length_2011_m": round(total_len_2011, 2),
            "total_htl_length_2019_m": round(total_len_2019, 2),
            "net_change_m": round(total_len_2019 - total_len_2011, 2),
            "segment_count_change": len(unique_2019) - len(unique_2011),
        },
        "duplicates_detected": {"in_2011": dupes_2011, "in_2019": dupes_2019},
        "segment_comparison": comparison,
        "continuity_score": continuity_score
    }
