import { notFound, redirect } from "next/navigation";
import DailyReflection from "@/components/DailyReflection";
import {
  getReflection,
  serializeReflection,
  formatMonthDay,
} from "@/lib/reflections";

export const dynamic = "force-dynamic";

function parseParams(monthRaw, dayRaw) {
  const month = Number.parseInt(monthRaw, 10);
  const day = Number.parseInt(dayRaw, 10);
  if (!Number.isInteger(month) || month < 1 || month > 12) return null;
  if (!Number.isInteger(day) || day < 1 || day > 31) return null;
  const probe = new Date(Date.UTC(2024, month - 1, day));
  if (probe.getUTCMonth() + 1 !== month || probe.getUTCDate() !== day) return null;
  return { month, day };
}

export async function generateMetadata({ params }) {
  const { month, day } = await params;
  const parsed = parseParams(month, day);
  if (!parsed) return { title: "Daily Reflection" };
  const label = formatMonthDay(parsed.month, parsed.day);
  return {
    title: `Daily Reflection — ${label}`,
    description: `AA Daily Reflection for ${label}.`,
  };
}

export default async function ReflectionDayPage({ params }) {
  const { month, day } = await params;
  const parsed = parseParams(month, day);
  if (!parsed) {
    redirect("/");
  }
  const doc = await getReflection(parsed.month, parsed.day).catch(() => null);
  if (!doc) {
    notFound();
  }
  const reflection = serializeReflection(doc, new Date());
  return <DailyReflection reflection={reflection} variant="standalone" />;
}
