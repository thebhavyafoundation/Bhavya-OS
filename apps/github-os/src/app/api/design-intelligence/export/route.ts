import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { withAuth } from "@/lib/api-auth";

export const GET = withAuth(async (_request, _user) => {
  const db = getDb();

  const approvedPatterns = db
    .prepare(
      `SELECT * FROM pattern_library
       WHERE bhavya_recommendation IS NOT NULL
       ORDER BY name ASC`,
    )
    .all();

  const designGenome = db
    .prepare(
      `SELECT * FROM design_genome
       WHERE avg_bhavya_relevance >= 60
       ORDER BY avg_bhavya_relevance DESC`,
    )
    .all();

  const designScores = db
    .prepare(
      `SELECT * FROM design_scores
       WHERE overall_score >= 70
       ORDER BY overall_score DESC`,
    )
    .all();

  const websites = db
    .prepare(
      `SELECT * FROM website_intelligence
       WHERE bhavya_relevance_score >= 60
       ORDER BY bhavya_relevance_score DESC`,
    )
    .all();

  const recommendations = db
    .prepare(
      `SELECT * FROM recommendations
       WHERE status = 'accepted' OR priority = 'high'
       ORDER BY created_at DESC`,
    )
    .all();

  const tokens = {
    colors: {
      primary: "#0E382E",
      secondary: "#F7F4EC",
      accent: "#D4AF37",
      background: "#0a0a0a",
      surface: "#111111",
      border: "#27272a",
    },
    typography: {
      display: "Playfair Display",
      body: "Inter",
      code: "JetBrains Mono",
    },
    spacing: {
      xs: "4px",
      sm: "8px",
      md: "16px",
      lg: "24px",
      xl: "32px",
      "2xl": "48px",
    },
  };

  const exportData = {
    exported_at: new Date().toISOString(),
    version: "1.0.0",
    provenance: {
      source: "bhavya-git-os",
      type: "design-intelligence-export",
    },
    approved_patterns: approvedPatterns,
    design_specifications: {
      genome: designGenome,
      scores: designScores,
      websites: websites,
    },
    implementation_recommendations: recommendations,
    bhavya_design_tokens: tokens,
    component_requirements: {
      required: [
        "Card",
        "Badge",
        "Skeleton",
        "EmptyState",
        "LoadingState",
        "SearchBar",
        "DataTable",
        "Modal",
        "Tabs",
        "PageLayout",
      ],
      preferred_library: "@bhavya/platform-ui",
    },
    motion_requirements: {
      preferred_library: "framer-motion",
      reduced_motion_support: true,
      scroll_animations: true,
      page_transitions: true,
    },
    accessibility_requirements: {
      wcag_level: "AA",
      keyboard_navigation: true,
      screen_reader_support: true,
      color_contrast: 4.5,
      focus_indicators: true,
    },
    responsive_requirements: {
      breakpoints: {
        mobile: "<=640px",
        tablet: "<=1024px",
        desktop: ">1024px",
      },
      mobile_first: true,
    },
    approval_status: "approved",
  };

  return NextResponse.json(exportData);
});
