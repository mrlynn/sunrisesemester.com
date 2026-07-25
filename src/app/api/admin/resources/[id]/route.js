import { NextResponse } from "next/server";
import mongoose from "mongoose";
import connectDB from "@/lib/mongodb";
import SiteResource from "@/models/SiteResource";
import { assertAdmin } from "@/lib/requireAdmin";
import {
  deleteResourceBlob,
  sanitizeSiteResourceInput,
  validateSiteResourceDoc,
} from "@/lib/siteResources";

export async function GET(_request, context) {
  const denied = await assertAdmin();
  if (denied) {
    return denied;
  }
  const { id } = await context.params;
  if (!mongoose.isValidObjectId(id)) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }
  try {
    await connectDB();
    const doc = await SiteResource.findById(id).lean();
    if (!doc) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json(doc);
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function PUT(request, context) {
  const denied = await assertAdmin();
  if (denied) {
    return denied;
  }
  const { id } = await context.params;
  if (!mongoose.isValidObjectId(id)) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }
  try {
    const body = await request.json();
    const { data, error } = sanitizeSiteResourceInput(body, { partial: true });
    if (error) {
      return NextResponse.json({ error }, { status: 400 });
    }
    await connectDB();
    const existing = await SiteResource.findById(id);
    if (!existing) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const previousFile = existing.file
      ? { ...(existing.file.toObject?.() ?? existing.file) }
      : null;
    const nextKind = data.kind ?? existing.kind;

    if (data.title !== undefined) existing.title = data.title;
    if (data.description !== undefined) existing.description = data.description;
    if (data.category !== undefined) existing.category = data.category;
    if (data.kind !== undefined) existing.kind = data.kind;
    if (data.sourceNote !== undefined) existing.sourceNote = data.sourceNote;
    if (data.meetingKey !== undefined) existing.meetingKey = data.meetingKey;
    if (data.sortOrder !== undefined) existing.sortOrder = data.sortOrder;
    if (data.published !== undefined) existing.published = data.published;

    if (nextKind === "link") {
      if (data.externalUrl !== undefined) existing.externalUrl = data.externalUrl;
      existing.set("file", undefined);
    } else {
      existing.externalUrl = "";
      if (data.file !== undefined) {
        existing.file = data.file;
      }
    }

    const validationError = validateSiteResourceDoc(existing.toObject());
    if (validationError) {
      return NextResponse.json({ error: validationError }, { status: 400 });
    }

    await existing.save();

    const nextPath = existing.file?.pathname;
    const prevPath = previousFile?.pathname;
    if (prevPath && (nextKind === "link" || (nextPath && nextPath !== prevPath))) {
      await deleteResourceBlob(previousFile);
    }

    return NextResponse.json(existing.toObject());
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 400 });
  }
}

export async function DELETE(_request, context) {
  const denied = await assertAdmin();
  if (denied) {
    return denied;
  }
  const { id } = await context.params;
  if (!mongoose.isValidObjectId(id)) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }
  try {
    await connectDB();
    const doc = await SiteResource.findByIdAndDelete(id).lean();
    if (!doc) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    if (doc.kind === "pdf" && doc.file) {
      await deleteResourceBlob(doc.file);
    }
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
