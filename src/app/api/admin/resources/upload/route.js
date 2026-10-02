import { handleUpload } from "@vercel/blob/client";
import { NextResponse } from "next/server";
import { assertAdmin } from "@/lib/requireAdmin";

const MAX_PDF_BYTES = 25 * 1024 * 1024;

export async function POST(request) {
  const denied = await assertAdmin();
  if (denied) {
    return denied;
  }

  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return NextResponse.json(
      {
        error:
          "BLOB_READ_WRITE_TOKEN is not configured. Add a Vercel Blob store and pull env vars.",
      },
      { status: 503 },
    );
  }

  try {
    const body = await request.json();
    const jsonResponse = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (pathname) => {
        const normalized = String(pathname || "").replace(/^\/+/, "");
        if (!normalized.startsWith("resources/")) {
          throw new Error("Uploads must use the resources/ path prefix.");
        }
        if (!normalized.toLowerCase().endsWith(".pdf")) {
          throw new Error("Only PDF uploads are allowed.");
        }
        return {
          allowedContentTypes: ["application/pdf"],
          maximumSizeInBytes: MAX_PDF_BYTES,
          addRandomSuffix: true,
          access: "public",
          tokenPayload: JSON.stringify({ purpose: "site-resource" }),
        };
      },
      onUploadCompleted: async ({ blob }) => {
        console.log("Site resource PDF uploaded:", blob.pathname);
      },
    });
    return NextResponse.json(jsonResponse);
  } catch (error) {
    return NextResponse.json(
      { error: error?.message || "Upload authorization failed." },
      { status: 400 },
    );
  }
}
