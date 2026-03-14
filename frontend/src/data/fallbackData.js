export const FALLBACK_DATASETS = [
    {
        id: "A_2011",
        file_id: "LOC-A-SHP-001",
        site: "Location A",
        site_id: "SITE-2",
        year: 2011,
        schema_version: "v1",
        feature_count: 8,
        geometry_type: "LineString",
        epsg: 32643,
        crs: "WGS 1984 UTM Zone 43N",
        fields: ["OBJECTID", "Feature_Na", "Shape_Leng"],
        quality_score: 62,
        issues: [
            {
                severity: "CRITICAL", type: "DUPLICATE_OBJECTID",
                detail: "OBJECTID 637 appears 3 times", affected_count: 3,
                recommendation: "Assign unique IDs to all duplicate records"
            },
            {
                severity: "HIGH", type: "ZERO_GEOMETRY",
                detail: "2 features have zero length (LTL, CRZ placeholders)",
                affected_count: 2,
                recommendation: "Digitise actual geometry or mark as provisional"
            },
            {
                severity: "MEDIUM", type: "MISSING_FIELD",
                detail: "Label field absent — present in 2019 schema only",
                affected_count: 8,
                recommendation: "Backfill Label field from Feature_Na values"
            }
        ],
        records: [
            { OBJECTID: 636, Feature_Na: "HTL", Shape_Leng: 4630.36 },
            { OBJECTID: 637, Feature_Na: "HTL", Shape_Leng: 4846.56 },
            { OBJECTID: 637, Feature_Na: "HTL", Shape_Leng: 4846.56 },
            { OBJECTID: 637, Feature_Na: "HTL", Shape_Leng: 4846.56 },
            { OBJECTID: 638, Feature_Na: "HTL", Shape_Leng: 5111.58 },
            { OBJECTID: 692, Feature_Na: "HTL", Shape_Leng: 92.38 },
            { OBJECTID: 0, Feature_Na: "LTL", Shape_Leng: 0.00 },
            { OBJECTID: 0, Feature_Na: "CRZ", Shape_Leng: 0.00 }
        ]
    },
    {
        id: "A_2019",
        file_id: "LOC-A-SHP-002",
        site: "Location A",
        site_id: "SITE-2",
        year: 2019,
        schema_version: "v2",
        feature_count: 11,
        geometry_type: "LineString",
        epsg: 32643,
        crs: "WGS 1984 UTM Zone 43N",
        fields: ["OBJECTID", "Feature_Na", "Shape_Leng", "Label"],
        quality_score: 84,
        issues: [
            {
                severity: "HIGH", type: "DUPLICATE_OBJECTID",
                detail: "OBJECTID 637 appears 3 times", affected_count: 3,
                recommendation: "Assign unique IDs"
            },
            {
                severity: "MEDIUM", type: "BLANK_MANDATORY_FIELD",
                detail: "2 records have blank Feature_Na", affected_count: 2,
                recommendation: "Populate Feature_Na for all records"
            }
        ],
        records: [
            { OBJECTID: 636, Feature_Na: "SEA", Shape_Leng: 4630.36, Label: "High Tide Line" },
            { OBJECTID: 637, Feature_Na: "CREEK", Shape_Leng: 4846.56, Label: "High Tide Line" },
            { OBJECTID: 637, Feature_Na: "CREEK", Shape_Leng: 4846.56, Label: "High Tide Line" },
            { OBJECTID: 637, Feature_Na: "CREEK", Shape_Leng: 4846.56, Label: "High Tide Line" },
            { OBJECTID: 638, Feature_Na: "SEA", Shape_Leng: 5111.58, Label: "High Tide Line" },
            { OBJECTID: 692, Feature_Na: "CREEK", Shape_Leng: 92.38, Label: "High Tide Line" },
            { OBJECTID: 47, Feature_Na: "CRZ", Shape_Leng: 4164.08, Label: "CRZ Boundary" },
            { OBJECTID: 0, Feature_Na: "", Shape_Leng: 0.00, Label: "CRZ Boundary" },
            { OBJECTID: 27, Feature_Na: "NDZ", Shape_Leng: 786.10, Label: "CRZ Boundary" },
            { OBJECTID: 11, Feature_Na: "", Shape_Leng: 30141.87, Label: "Low Tide Line" },
            { OBJECTID: 11, Feature_Na: "", Shape_Leng: 30141.87, Label: "Low Tide Line" }
        ],
        bbox_wgs84: [72.8, 19.0, 72.9, 19.1],
        last_computed: new Date().toISOString()
    },
    {
        id: "A_boundary",
        file_id: "LOC-A-SHP-003",
        site: "Location A",
        site_id: "SITE-2",
        year: null,
        schema_version: "boundary",
        feature_count: 3,
        geometry_type: "Polygon",
        epsg: 32643,
        quality_score: 68,
        issues: [
            {
                severity: "HIGH", type: "BLANK_MANDATORY_FIELD",
                detail: "2 records have OBJECTID=0", affected_count: 2,
                recommendation: "Assign unique OBJECTIDs"
            }
        ],
        records: [
            { OBJECTID: 25813, CTS_CS_NO: "1049C", Coordinato: "SJ", State: "MH", Institute: "IRS", Client: "Enviro" },
            { OBJECTID: 0, CTS_CS_NO: "345", Coordinato: "DTV", State: "MH", Institute: "IRS", Client: "" },
            { OBJECTID: 0, CTS_CS_NO: "678", Coordinato: "KSR", State: "MH", Institute: "IRS", Client: "" }
        ]
    },
    {
        id: "C_2011",
        file_id: "LOC-B-SHP-004",
        site: "Location B",
        site_id: "SITE-1",
        year: 2011,
        schema_version: "v1",
        feature_count: 13,
        geometry_type: "LineString",
        epsg: 32643,
        crs: "WGS 1984 UTM Zone 43N",
        fields: ["OBJECTID", "Feature_Na", "Shape_Leng"],
        quality_score: 65,
        issues: [
            {
                severity: "HIGH", type: "ZERO_GEOMETRY",
                detail: "2 features have zero length (LTL, CRZ placeholders)",
                affected_count: 2,
                recommendation: "Digitise actual geometry"
            },
            {
                severity: "MEDIUM", type: "MISSING_FIELD",
                detail: "Label field absent", affected_count: 13,
                recommendation: "Backfill Label field"
            }
        ],
        records: [
            { OBJECTID: 635, Feature_Na: "HTL", Shape_Leng: 5215.06 },
            { OBJECTID: 636, Feature_Na: "HTL", Shape_Leng: 4630.36 },
            { OBJECTID: 696, Feature_Na: "HTL", Shape_Leng: 111.00 },
            { OBJECTID: 697, Feature_Na: "HTL", Shape_Leng: 347.36 },
            { OBJECTID: 698, Feature_Na: "HTL", Shape_Leng: 43.21 },
            { OBJECTID: 699, Feature_Na: "HTL", Shape_Leng: 124.79 },
            { OBJECTID: 700, Feature_Na: "HTL", Shape_Leng: 132.81 },
            { OBJECTID: 701, Feature_Na: "HTL", Shape_Leng: 244.75 },
            { OBJECTID: 702, Feature_Na: "HTL", Shape_Leng: 133.31 },
            { OBJECTID: 703, Feature_Na: "HTL", Shape_Leng: 68.19 },
            { OBJECTID: 704, Feature_Na: "HTL", Shape_Leng: 244.47 },
            { OBJECTID: 0, Feature_Na: "LTL", Shape_Leng: 0.00 },
            { OBJECTID: 0, Feature_Na: "CRZ", Shape_Leng: 0.00 }
        ]
    },
    {
        id: "C_2019",
        file_id: "LOC-B-SHP-005",
        site: "Location B",
        site_id: "SITE-1",
        year: 2019,
        schema_version: "v2",
        feature_count: 18,
        geometry_type: "LineString",
        epsg: 32643,
        crs: "WGS 1984 UTM Zone 43N",
        fields: ["OBJECTID", "Feature_Na", "Shape_Leng", "Label"],
        quality_score: 80,
        issues: [
            {
                severity: "CRITICAL", type: "DUPLICATE_OBJECTID",
                detail: "OBJECTID 635 appears 4 times — critical traceability break",
                affected_count: 4,
                recommendation: "Assign OID 635A/B/C/D with lineage note"
            },
            {
                severity: "MEDIUM", type: "BLANK_MANDATORY_FIELD",
                detail: "2 records have blank Feature_Na", affected_count: 2,
                recommendation: "Populate Feature_Na for all records"
            }
        ],
        records: [
            { OBJECTID: 635, Feature_Na: "CREEK", Shape_Leng: 5215.06, Label: "High Tide Line" },
            { OBJECTID: 635, Feature_Na: "CREEK", Shape_Leng: 5215.06, Label: "High Tide Line" },
            { OBJECTID: 635, Feature_Na: "CREEK", Shape_Leng: 5215.06, Label: "High Tide Line" },
            { OBJECTID: 635, Feature_Na: "CREEK", Shape_Leng: 5215.06, Label: "High Tide Line" },
            { OBJECTID: 636, Feature_Na: "SEA", Shape_Leng: 4630.36, Label: "High Tide Line" },
            { OBJECTID: 696, Feature_Na: "CREEK", Shape_Leng: 111.00, Label: "High Tide Line" },
            { OBJECTID: 697, Feature_Na: "CREEK", Shape_Leng: 347.36, Label: "High Tide Line" },
            { OBJECTID: 698, Feature_Na: "CREEK", Shape_Leng: 43.21, Label: "High Tide Line" },
            { OBJECTID: 699, Feature_Na: "CREEK", Shape_Leng: 124.79, Label: "High Tide Line" },
            { OBJECTID: 700, Feature_Na: "CREEK", Shape_Leng: 132.81, Label: "High Tide Line" },
            { OBJECTID: 701, Feature_Na: "CREEK", Shape_Leng: 244.75, Label: "High Tide Line" },
            { OBJECTID: 702, Feature_Na: "CREEK", Shape_Leng: 133.31, Label: "High Tide Line" },
            { OBJECTID: 703, Feature_Na: "CREEK", Shape_Leng: 68.19, Label: "High Tide Line" },
            { OBJECTID: 704, Feature_Na: "CREEK", Shape_Leng: 244.47, Label: "High Tide Line" },
            { OBJECTID: 47, Feature_Na: "CRZ", Shape_Leng: 4164.08, Label: "CRZ Boundary" },
            { OBJECTID: 48, Feature_Na: "CRZ", Shape_Leng: 481.63, Label: "CRZ Boundary" },
            { OBJECTID: 11, Feature_Na: "", Shape_Leng: 30141.87, Label: "Low Tide Line" },
            { OBJECTID: 11, Feature_Na: "", Shape_Leng: 30141.87, Label: "Low Tide Line" }
        ]
    },
    {
        id: "C_boundary",
        file_id: "LOC-B-SHP-006",
        site: "Location B",
        site_id: "SITE-1",
        year: null,
        schema_version: "boundary",
        feature_count: 5,
        geometry_type: "Polygon",
        epsg: 32643,
        quality_score: 55,
        issues: [
            {
                severity: "HIGH", type: "BLANK_MANDATORY_FIELD",
                detail: "4 records have OBJECTID=0", affected_count: 4,
                recommendation: "Assign unique OBJECTIDs"
            },
            {
                severity: "HIGH", type: "EMPTY_RECORD",
                detail: "1 completely empty record", affected_count: 1,
                recommendation: "Remove or populate the empty record"
            }
        ],
        records: [
            { OBJECTID: 26064, CTS_CS_NO: "157", Coordinato: "KSP", Institute: "IRS", State: "MH", Client: "ENviro" },
            { OBJECTID: 0, CTS_CS_NO: "190", Coordinato: "MS", Institute: "IRS", State: "MH", Client: "Sushan" },
            { OBJECTID: 0, CTS_CS_NO: "178", Coordinato: "CUK", Institute: "IRS", State: "MH", Client: "Augus" },
            { OBJECTID: 0, CTS_CS_NO: "148", Coordinato: "KSR", Institute: "IRS", State: "MH", Client: "Sharth" },
            { OBJECTID: 0, CTS_CS_NO: "", Coordinato: "", Institute: "", State: "", Client: "AbAsso" }
        ]
    }
];

export const FALLBACK_TRI = [
    {
        dataset_id: "A_2011", tri_score: 47.5, trust_level: "MEDIUM",
        breakdown: {
            age_score: { value: 25.0, weight: 0.30, contribution: 7.5 },
            update_score: { value: 20.0, weight: 0.25, contribution: 5.0 },
            accuracy_score: { value: 75.0, weight: 0.25, contribution: 18.75 },
            crs_score: { value: 100.0, weight: 0.10, contribution: 10.0 },
            completeness_score: { value: 62.0, weight: 0.10, contribution: 6.2 }
        },
        explanation: "Dataset is 15 years old — age score 25/100 contributing only 7.5 of 30 possible points. 8-year survey gap reduces update frequency to 20/100. Two zero-geometry placeholder features reduce spatial accuracy. CRS EPSG:32643 fully confirmed.",
        recommendation: "URGENT: Schedule new survey by 2027. Current TRI in medium-risk zone.",
        decay_projection: {
            "2026": 47.5, "2027": 44.0, "2028": 40.5,
            "2029": 37.0, "2030": 33.5, "2031": 30.0,
            "2032": 26.5, "2033": 23.0, "2034": 19.5, "2035": 16.0
        }
    },
    {
        dataset_id: "A_2019", tri_score: 67.9, trust_level: "MEDIUM",
        breakdown: {
            age_score: { value: 65.0, weight: 0.30, contribution: 19.5 },
            update_score: { value: 20.0, weight: 0.25, contribution: 5.0 },
            accuracy_score: { value: 100.0, weight: 0.25, contribution: 25.0 },
            crs_score: { value: 100.0, weight: 0.10, contribution: 10.0 },
            completeness_score: { value: 84.0, weight: 0.10, contribution: 8.4 }
        },
        explanation: "Dataset is 7 years old — age score 65/100. 8-year survey gap still penalises update frequency. No zero-geometry features — spatial accuracy 100/100. CRS EPSG:32643 confirmed.",
        recommendation: "Schedule next survey by 2027 to maintain TRI above 60.",
        decay_projection: {
            "2026": 67.9, "2027": 64.4, "2028": 60.9,
            "2029": 57.4, "2030": 53.9, "2031": 50.4,
            "2032": 46.9, "2033": 43.4, "2034": 39.9, "2035": 36.4
        }
    },
    {
        dataset_id: "C_2011", tri_score: 50.2, trust_level: "MEDIUM",
        breakdown: {
            age_score: { value: 25.0, weight: 0.30, contribution: 7.5 },
            update_score: { value: 20.0, weight: 0.25, contribution: 5.0 },
            accuracy_score: { value: 84.6, weight: 0.25, contribution: 21.15 },
            crs_score: { value: 100.0, weight: 0.10, contribution: 10.0 },
            completeness_score: { value: 65.0, weight: 0.10, contribution: 6.5 }
        },
        explanation: "Dataset is 15 years old — age score 25/100. 8-year survey gap. 2 zero-geometry features out of 13 reduce accuracy to 84.6/100.",
        recommendation: "URGENT: 15-year-old dataset. New survey required by 2027.",
        decay_projection: {
            "2026": 50.2, "2027": 46.7, "2028": 43.2,
            "2029": 39.7, "2030": 36.2, "2031": 32.7,
            "2032": 29.2, "2033": 25.7, "2034": 22.2, "2035": 18.7
        }
    },
    {
        dataset_id: "C_2019", tri_score: 67.5, trust_level: "MEDIUM",
        breakdown: {
            age_score: { value: 65.0, weight: 0.30, contribution: 19.5 },
            update_score: { value: 20.0, weight: 0.25, contribution: 5.0 },
            accuracy_score: { value: 100.0, weight: 0.25, contribution: 25.0 },
            crs_score: { value: 100.0, weight: 0.10, contribution: 10.0 },
            completeness_score: { value: 80.0, weight: 0.10, contribution: 8.0 }
        },
        explanation: "Dataset is 7 years old — age score 65/100. CRZ boundaries now have real geometry unlike 2011. OID 635 duplicated 4× reduces completeness score.",
        recommendation: "Fix OID 635 duplication immediately. Schedule 2027 survey.",
        decay_projection: {
            "2026": 67.5, "2027": 64.0, "2028": 60.5,
            "2029": 57.0, "2030": 53.5, "2031": 50.0,
            "2032": 46.5, "2033": 43.0, "2034": 39.5, "2035": 36.0
        }
    }
];

export const FALLBACK_HTL = {
    location_a: {
        site: "Location A (Site 2)",
        summary: {
            htl_segments_2011: 5,
            htl_segments_2019: 7,
            total_htl_length_2011_m: 14681.88,
            total_htl_length_2019_m: 14681.88,
            net_change_m: 0,
            segment_count_change: 2
        },
        continuity_score: 78,
        duplicates_detected: {
            in_2011: { "637": 3 },
            in_2019: { "637": 3 },
            traceability_impact: "HIGH"
        },
        segment_comparison: [
            { oid: 636, feature_2011: "HTL", feature_2019: "SEA", length_2019: 4630.36, status: "STABLE" },
            { oid: 637, feature_2011: "HTL (x3 dup)", feature_2019: "CREEK (x3 dup)", length_2019: 4846.56, status: "STABLE" },
            { oid: 638, feature_2011: "HTL", feature_2019: "SEA", length_2019: 5111.58, status: "STABLE" },
            { oid: 692, feature_2011: "HTL", feature_2019: "CREEK", length_2019: 92.38, status: "STABLE" },
            { oid: 47, feature_2011: null, feature_2019: "CRZ", length_2019: 4164.08, status: "NEW_SEGMENT" },
            { oid: 27, feature_2011: null, feature_2019: "NDZ", length_2019: 786.10, status: "NEW_SEGMENT" },
            { oid: 11, feature_2011: null, feature_2019: "LTL", length_2019: 30141.87, status: "NEW_SEGMENT" }
        ],
        coords_2011: [
            [[19.07, 72.83], [19.08, 72.84], [19.09, 72.85]]
        ],
        coords_2019: [
            [[19.07, 72.83], [19.08, 72.84], [19.09, 72.85]]
        ]
    },
    location_b: {
        site: "Location B (Site 1)",
        summary: {
            htl_segments_2011: 11,
            htl_segments_2019: 14,
            total_htl_length_2011_m: 11295.31,
            total_htl_length_2019_m: 11295.31,
            net_change_m: 0,
            segment_count_change: 3
        },
        continuity_score: 61,
        duplicates_detected: {
            in_2011: {},
            in_2019: { "635": 4, "11": 2 },
            traceability_impact: "CRITICAL"
        },
        segment_comparison: [
            { oid: 635, feature_2011: "HTL (x4 dup)", feature_2019: "CREEK (x4 dup)", length_2019: 5215.06, status: "STABLE" },
            { oid: 636, feature_2011: "HTL", feature_2019: "SEA", length_2019: 4630.36, status: "STABLE" },
            { oid: 47, feature_2011: null, feature_2019: "CRZ", length_2019: 4164.08, status: "NEW_SEGMENT" },
            { oid: 48, feature_2011: null, feature_2019: "CRZ", length_2019: 481.63, status: "NEW_SEGMENT" },
            { oid: 11, feature_2011: null, feature_2019: "LTL", length_2019: 30141.87, status: "NEW_SEGMENT" }
        ],
        coords_2011: [
            [[19.05, 72.82], [19.06, 72.83], [19.07, 72.84]]
        ],
        coords_2019: [
            [[19.05, 72.82], [19.06, 72.83], [19.07, 72.84]]
        ]
    }
};

export const FALLBACK_CRZ = {
    location_a: {
        site_analysis: {
            site: "Location A",
            compliance_status: "PARTIAL",
            compliance_notes: [
                "CRZ-I sensitive areas identified with 0m buffer logic.",
                "⚠ OID 637 duplicates (3x) cause vector overlap.",
                "HTL segment match 78% traceable to 2011 epoch.",
                "⚠ 2 features have zero-geometry placeholders."
            ],
            htl_segments: [
                { oid: 636, length_m: 4630.36, feature: "SEA (HTL)" },
                { oid: 637, length_m: 4846.56, feature: "CREEK (HTL)" },
                { oid: 638, length_m: 5111.58, feature: "SEA (HTL)" }
            ],
            crz_boundary_length_m: 4164.08,
            ndz_length_m: 786.10
        },
        buffer_analysis: [
            {
                oid: 636,
                crz_classification: "CRZ-II",
                buffers: { "50m_buffer": 231518, "200m_buffer": 926072, "500m_buffer": 2315180 }
            },
            {
                oid: 637,
                crz_classification: "CRZ-IV (Creek)",
                buffers: { "100m_buffer": 484656, "NDZ_buffer": 484656 }
            }
        ]
    },
    location_b: {
        site_analysis: {
            site: "Location B",
            compliance_status: "NON-COMPLIANT",
            compliance_notes: [
                "⚠ CRITICAL: OID 635 duplication (4x) breaks regulatory trace.",
                "⚠ HTL segments unmatched in 3 major sectors.",
                "CRZ-IV (Creek) buffers apply to 85% of segments.",
                "LTL geometry verified but disconnected from main frame."
            ],
            htl_segments: [
                { oid: 635, length_m: 5215.06, feature: "CREEK (HTL)" },
                { oid: 636, length_m: 4630.36, feature: "SEA (HTL)" }
            ],
            crz_boundary_length_m: 4645.71,
            ndz_length_m: 0
        },
        buffer_analysis: [
            {
                oid: 635,
                crz_classification: "CRZ-IV (Creek)",
                buffers: { "100m_buffer": 521506, "NDZ_buffer": 521506 }
            }
        ]
    }
};

export const FALLBACK_ALL_ISSUES = [
    {
        severity: "CRITICAL", dataset: "C_2019", type: "DUPLICATE_OBJECTID",
        detail: "OBJECTID 635 appears 4 times — traceability break", affected_count: 4, recommendation: "Assign unique IDs"
    },
    {
        severity: "CRITICAL", dataset: "A_2011", type: "DUPLICATE_OBJECTID",
        detail: "OBJECTID 637 appears 3 times", affected_count: 3, recommendation: "Assign unique IDs"
    },
    {
        severity: "HIGH", dataset: "A_2011", type: "ZERO_GEOMETRY",
        detail: "LTL feature has zero length — placeholder", affected_count: 1, recommendation: "Digitise geometry"
    },
    {
        severity: "HIGH", dataset: "A_2011", type: "ZERO_GEOMETRY",
        detail: "CRZ feature has zero length — placeholder", affected_count: 1, recommendation: "Digitise geometry"
    },
    {
        severity: "HIGH", dataset: "C_2011", type: "ZERO_GEOMETRY",
        detail: "LTL feature has zero length — placeholder", affected_count: 1, recommendation: "Digitise geometry"
    },
    {
        severity: "HIGH", dataset: "C_2011", type: "ZERO_GEOMETRY",
        detail: "CRZ feature has zero length — placeholder", affected_count: 1, recommendation: "Digitise geometry"
    },
    {
        severity: "HIGH", dataset: "A_boundary", type: "BLANK_MANDATORY_FIELD",
        detail: "2 records have OBJECTID=0", affected_count: 2, recommendation: "Assign unique IDs"
    },
    {
        severity: "HIGH", dataset: "C_boundary", type: "BLANK_MANDATORY_FIELD",
        detail: "4 records have OBJECTID=0", affected_count: 4, recommendation: "Assign unique IDs"
    },
    {
        severity: "HIGH", dataset: "C_boundary", type: "EMPTY_RECORD",
        detail: "1 completely empty record (last entry)", affected_count: 1, recommendation: "Remove record"
    },
    {
        severity: "MEDIUM", dataset: "A_2011", type: "MISSING_FIELD",
        detail: "Label field absent in 2011 schema", affected_count: 8, recommendation: "Backfill field"
    },
    {
        severity: "MEDIUM", dataset: "C_2011", type: "MISSING_FIELD",
        detail: "Label field absent in 2011 schema", affected_count: 13, recommendation: "Backfill field"
    },
    {
        severity: "MEDIUM", dataset: "A_2019", type: "BLANK_MANDATORY_FIELD",
        detail: "2 records have blank Feature_Na", affected_count: 2, recommendation: "Populate field"
    },
    {
        severity: "MEDIUM", dataset: "C_2019", type: "BLANK_MANDATORY_FIELD",
        detail: "2 records have blank Feature_Na", affected_count: 2, recommendation: "Populate field"
    },
    {
        severity: "MEDIUM", dataset: "A_2019", type: "DUPLICATE_OBJECTID",
        detail: "OID 11 (LTL) appears twice", affected_count: 2, recommendation: "Assign unique IDs"
    },
    {
        severity: "MEDIUM", dataset: "C_2019", type: "DUPLICATE_OBJECTID",
        detail: "OID 11 (LTL) appears twice", affected_count: 2, recommendation: "Assign unique IDs"
    },
    {
        severity: "MEDIUM", dataset: "A_boundary", type: "BLANK_MANDATORY_FIELD",
        detail: "2 Client fields are blank", affected_count: 2, recommendation: "Populate client field"
    },
    {
        severity: "LOW", dataset: "ALL_2019", type: "VOCABULARY_DRIFT",
        detail: "Feature_Na changed from HTL to SEA/CREEK between epochs",
        affected_count: 6, recommendation: "Standardise vocab"
    },
    {
        severity: "LOW", dataset: "ALL", type: "MISSING_TEMPORAL_FIELD",
        detail: "No acquisition date field in any layer", affected_count: 6, recommendation: "Add survey_date"
    }
];
