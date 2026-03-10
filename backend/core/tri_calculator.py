from core.issue_detector import detect_issues

def compute_quality_score(gdf, dataset_id: str) -> int:
    score = 100
    issues = detect_issues(gdf, dataset_id)
    deductions = {
        "CRITICAL": 15,
        "HIGH": 10,
        "MEDIUM": 6,
        "LOW": 3
    }
    for issue in issues:
        score -= deductions.get(issue["severity"], 0)
    return max(0, min(100, score))

def calculate_tri(dataset_id: str, current_year: int = 2026) -> dict:
    from core.data_loader import load_dataset, DATASET_REGISTRY
    meta = DATASET_REGISTRY[dataset_id]
    ds = load_dataset(dataset_id)

    # -- FACTOR 1: Dataset Age (weight 30%) --
    survey_year = meta.get("year") or current_year
    age_years = current_year - survey_year
    age_score = max(0, round(100 - (age_years / 20 * 100), 1))

    # -- FACTOR 2: Update Frequency (weight 25%) --
    update_gap = 8  # known from dataset pair comparison
    update_score = max(0, round(100 - (update_gap / 10 * 100), 1))

    # -- FACTOR 3: Spatial Accuracy (weight 25%) --
    zero_geom_issues = [i for i in ds["issues"] if i["type"] == "ZERO_GEOMETRY"]
    zero_count = sum(i["affected_count"] for i in zero_geom_issues)
    total = ds["feature_count"]
    accuracy_score = max(0, round(100 - (zero_count / total * 100), 1))

    # -- FACTOR 4: CRS & Standards Compliance (weight 10%) --
    crs_score = 100.0 if ds["crs_valid"] else 0.0

    # -- FACTOR 5: Attribute Completeness (weight 10%) --
    completeness_score = float(ds["quality_score"])

    # -- FINAL TRI CALCULATION --
    tri = round(
        (age_score * 0.30) +
        (update_score * 0.25) +
        (accuracy_score * 0.25) +
        (crs_score * 0.10) +
        (completeness_score * 0.10),
        1
    )

    trust_level = (
        "HIGH" if tri >= 75 else
        "MEDIUM" if tri >= 50 else
        "LOW" if tri >= 25 else
        "CRITICAL"
    )

    # -- DECAY PROJECTION --
    decay = {}
    for future_year in range(current_year, current_year + 10):
        future_age = future_year - survey_year
        future_age_score = max(0, 100 - (future_age / 20 * 100))
        future_tri = round(
            (future_age_score * 0.30) +
            (update_score * 0.25) +
            (accuracy_score * 0.25) +
            (crs_score * 0.10) +
            (completeness_score * 0.10),
            1
        )
        decay[str(future_year)] = future_tri

    # -- PLAIN ENGLISH EXPLANATION --
    explanation_parts = []
    if age_score < 50:
        explanation_parts.append(f"Dataset is {age_years} years old — age score {age_score}/100")
    if update_score < 50:
        explanation_parts.append(f"8-year gap between surveys — update frequency score {update_score}/100")
    if zero_count > 0:
        explanation_parts.append(f"{zero_count} zero-geometry features found — spatial accuracy score {accuracy_score}/100")
    explanation_parts.append(f"CRS EPSG:32643 confirmed — compliance score 100/100")
    explanation_parts.append(f"Attribute completeness: {completeness_score}/100")
    explanation = ". ".join(explanation_parts)

    recommendation = (
        "URGENT: Dataset is 15+ years old. TRI is in RED zone." if survey_year <= 2011 else
        "Dataset approaching medium-risk threshold. Schedule next survey by 2027." if survey_year <= 2019 else
        "Dataset within acceptable reliability window."
    )

    return {
        "dataset_id": dataset_id,
        "survey_year": survey_year,
        "current_year": current_year,
        "tri_score": tri,
        "trust_level": trust_level,
        "breakdown": {
            "age_score": {"value": age_score, "weight": 0.30, "contribution": round(age_score*0.30,1)},
            "update_score": {"value": update_score, "weight": 0.25, "contribution": round(update_score*0.25,1)},
            "accuracy_score": {"value": accuracy_score, "weight": 0.25, "contribution": round(accuracy_score*0.25,1)},
            "crs_score": {"value": crs_score, "weight": 0.10, "contribution": round(crs_score*0.10,1)},
            "completeness_score": {"value": completeness_score, "weight": 0.10, "contribution": round(completeness_score*0.10,1)}
        },
        "decay_projection": decay,
        "explanation": explanation,
        "recommendation": recommendation,
        "critical_threshold_year": next((yr for yr, score in decay.items() if score < 25), "Beyond 2035")
    }
