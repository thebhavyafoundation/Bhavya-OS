import { NextRequest, NextResponse } from "next/server";
import {
  handleContentReady,
  createKnowledgePackagePublication,
  createBlogPublication,
  createAnnouncementPublication,
} from "@/lib/content-factory.js";
import {
  getGitHubOSFeedback,
  publishAnalyticsToGitHub,
  collectAndReportAnalytics,
} from "@/lib/github-integration.js";
import {
  validateConstitutionalCompliance,
  validateBrandConsistency,
} from "@/lib/constitution-integration.js";
import { getPublication } from "@/lib/publications.js";
import type { PlatformType } from "@/lib/types.js";
import { withAuth } from "@/lib/api-auth";

export const POST = withAuth(async (request, _user) => {
  const body = await request.json();
  const { integration, action } = body;

  switch (integration) {
    case "content-factory": {
      switch (action) {
        case "publish-kp": {
          const result = createKnowledgePackagePublication(body.kp);
          return NextResponse.json({ success: true, ...result });
        }
        case "publish-blog": {
          const result = createBlogPublication(body.blog);
          return NextResponse.json({ success: true, ...result });
        }
        case "publish-announcement": {
          const result = createAnnouncementPublication(body.announcement);
          return NextResponse.json({ success: true, ...result });
        }
        case "content-ready": {
          const result = handleContentReady(body.event);
          return NextResponse.json({ success: true, ...result });
        }
        default:
          return NextResponse.json(
            { error: "unknown content-factory action" },
            { status: 400 },
          );
      }
    }

    case "github-os": {
      switch (action) {
        case "get-feedback": {
          const feedback = getGitHubOSFeedback();
          return NextResponse.json({ feedback });
        }
        case "publish-analytics": {
          publishAnalyticsToGitHub();
          return NextResponse.json({ success: true });
        }
        case "collect-analytics": {
          const report = collectAndReportAnalytics();
          return NextResponse.json({ report });
        }
        default:
          return NextResponse.json(
            { error: "unknown github-os action" },
            { status: 400 },
          );
      }
    }

    case "constitution": {
      switch (action) {
        case "validate": {
          const { publicationId } = body;
          const publication = getPublication(publicationId);
          if (!publication) {
            return NextResponse.json(
              { error: "publication not found" },
              { status: 404 },
            );
          }
          const check = validateConstitutionalCompliance(publication);
          return NextResponse.json({ check });
        }
        case "brand-check": {
          const { content } = body;
          const result = validateBrandConsistency(content);
          return NextResponse.json({ result });
        }
        default:
          return NextResponse.json(
            { error: "unknown constitution action" },
            { status: 400 },
          );
      }
    }

    default:
      return NextResponse.json(
        { error: "unknown integration" },
        { status: 400 },
      );
  }
});

export const GET = withAuth(async (_request, _user) => {
  return NextResponse.json({
    integrations: [
      {
        name: "content-factory",
        status: "active",
        description: "Publish content from Content Factory",
      },
      {
        name: "github-os",
        status: "active",
        description: "Analytics feedback to GitHub OS",
      },
      {
        name: "constitution",
        status: "active",
        description: "Constitutional compliance checks",
      },
    ],
    usage: {
      "POST /api/integrations": {
        "content-factory": {
          "publish-kp": "Publish a Knowledge Package",
          "publish-blog": "Publish a blog post",
          "publish-announcement": "Publish an announcement",
          "content-ready": "Handle content.ready event",
        },
        "github-os": {
          "get-feedback": "Get GitHub OS social feedback",
          "publish-analytics": "Publish analytics to GitHub OS",
          "collect-analytics": "Collect and report analytics",
        },
        constitution: {
          validate: "Validate constitutional compliance",
          "brand-check": "Check brand consistency",
        },
      },
    },
  });
});
