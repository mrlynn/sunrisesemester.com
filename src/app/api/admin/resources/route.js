import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import SiteResource from "@/models/SiteResource";
import { assertAdmin } from "@/lib/requireAdmin";
import {
  sanitizeSiteResourceInput,
  validateSiteResourceDoc,
} from "@/lib/siteResources";

export async function GET() {
  const denied = await assertAdmin();
  if (denied) {
    return denied;
  }
  try {
    await connectDB();
    const items = await SiteResource.find({})
      .sort({ sortOrder: 1, title: 1 })
      .lean();
    return NextResponse.json(items);
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function POST(request) {
  const denied = await assertAdmin();
  if (denied) {
    return denied;
  }
  try {
    const body = await request.json();
    const { data, error } = sanitizeSiteResourceInput(body);
    if (error) {
      return NextResponse.json({ error }, { status: 400 });
    }
    const validationError = validateSiteResourceDoc(data);
    if (validationError) {
      return NextResponse.json({ error: validationError }, { status: 400 });
    }
    if (data.kind === "link") {
      data.file = undefined;
    }
    if (data.kind === "pdf") {
      data.externalUrl = "";
    }
    await connectDB();
    const doc = await SiteResource.create(data);
    return NextResponse.json(doc.toObject());
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 400 });
  }
}
