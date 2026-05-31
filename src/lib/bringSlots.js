import mongoose from "mongoose";
import { normalizeCategory } from "@/lib/coordination";

// Parses the JSON-encoded bringSlots field from the admin event form into
// sanitized subdocuments. When `keepIds` is true (updates), existing slot _ids
// are preserved so claimed contributions keep pointing at the right slot.
export function parseBringSlots(raw, { keepIds = false } = {}) {
  let parsed = [];
  try {
    parsed = JSON.parse(raw || "[]");
  } catch {
    parsed = [];
  }
  if (!Array.isArray(parsed)) return [];
  return parsed
    .filter((s) => s && String(s.label ?? "").trim())
    .slice(0, 60)
    .map((s) => {
      const slot = {
        category: normalizeCategory(s.category),
        label: String(s.label).trim().slice(0, 120),
        quantity: Math.min(Math.max(Number.parseInt(s.quantity, 10) || 1, 1), 99),
      };
      if (keepIds && s.id && mongoose.isValidObjectId(s.id)) {
        slot._id = new mongoose.Types.ObjectId(s.id);
      }
      return slot;
    });
}
