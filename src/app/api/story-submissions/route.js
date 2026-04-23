import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import StorySubmission from "@/models/StorySubmission";

const MAX_FILE_BYTES = 100 * 1024 * 1024;
const ALLOWED_EXT = new Set([
  "gif","jpg","jpeg","png","bmp","eps","tif","pict","psd","txt","rtf","html",
  "odf","pdf","doc","docx","ppt","pptx","xls","xlsx","xml","avi","mov","mp3",
  "mp4","ogg","wav","bz2","dmg","gz","jar","rar","sit","svg","tar","zip",
]);

export async function POST(request) {
  try {
    const form = await request.formData();
    const get = (k) => String(form.get(k) ?? "").trim();

    const submissionType = get("submissionType");
    const displayNameStyle = get("displayNameStyle");
    const firstName = get("firstName");
    const lastName = get("lastName");
    const email = get("email");
    const storyText = get("storyText");
    const agreedCopyrightTransfer = form.get("agreedCopyrightTransfer") === "on" || form.get("agreedCopyrightTransfer") === "true";
    const agreedAuthorRepresentations = form.get("agreedAuthorRepresentations") === "on" || form.get("agreedAuthorRepresentations") === "true";

    if (!submissionType || !displayNameStyle || !firstName || !lastName || !email) {
      return NextResponse.json({ error: "Please fill out all required fields." }, { status: 400 });
    }
    if (!agreedCopyrightTransfer || !agreedAuthorRepresentations) {
      return NextResponse.json({ error: "You must agree to both terms to submit." }, { status: 400 });
    }

    let filePayload;
    const file = form.get("file");
    if (file && typeof file === "object" && file.size > 0) {
      if (file.size > MAX_FILE_BYTES) {
        return NextResponse.json({ error: "File exceeds the 100 MB limit." }, { status: 400 });
      }
      const ext = (file.name.split(".").pop() || "").toLowerCase();
      if (!ALLOWED_EXT.has(ext)) {
        return NextResponse.json({ error: `File type .${ext} is not allowed.` }, { status: 400 });
      }
      const buf = Buffer.from(await file.arrayBuffer());
      filePayload = { name: file.name, size: file.size, type: file.type, data: buf };
    }

    if (!storyText && !filePayload) {
      return NextResponse.json({ error: "Please paste your story or upload a file." }, { status: 400 });
    }

    await connectDB();
    await StorySubmission.create({
      submissionType,
      displayNameStyle,
      firstName: firstName.slice(0, 80),
      lastName: lastName.slice(0, 80),
      email: email.slice(0, 200),
      mailingAddress: get("mailingAddress").slice(0, 300),
      cityStateZip: get("cityStateZip").slice(0, 200),
      storyText: storyText.slice(0, 200000),
      file: filePayload,
      agreedCopyrightTransfer,
      agreedAuthorRepresentations,
    });

    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
