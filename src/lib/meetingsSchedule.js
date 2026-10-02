/**
 * Sunrise Semester's fixed weekly meeting schedule.
 *
 * Shared between the client-rendered MeetingsSchedule UI and the server-side
 * structured-data builder in structuredData.js, so the two can never drift.
 * All times are Eastern (America/New_York).
 */
export const ZOOM_ID = "901964988";
export const ZOOM_URL =
  "https://us02web.zoom.us/j/901964988?pwd=QkhEY1FFOUF2b1AzMmRwZ0VtejdVQT09";

export const meetings = [
  {
    id: "weekdays",
    label: "Monday – Friday",
    shortLabel: "M–F",
    title: "Daily Sunrise",
    time: "7:15 – 8:15 AM",
    startTime: "07:15",
    endTime: "08:15",
    blurb:
      "Start every weekday in fellowship. One hour of open discussion to set the tone of the day.",
    gradient: "linear-gradient(135deg, #ff6b35 0%, #ffa751 60%, #ffd89b 100%)",
    accent: "#ff6b35",
    days: ["Mon", "Tue", "Wed", "Thu", "Fri"],
    formats: [
      { label: "Mon", key: "weekday-mon" },
      { label: "Tue", key: "weekday-tue" },
      { label: "Wed", key: "weekday-wed" },
      { label: "Thu", key: "weekday-thu" },
      { label: "Fri", key: "weekday-fri" },
    ],
  },
  {
    id: "saturday-men",
    label: "Saturday",
    shortLabel: "Sat",
    title: "Men's Meeting",
    time: "8:00 – 9:15 AM",
    startTime: "08:00",
    endTime: "09:15",
    blurb: "Men of the group gather to share experience, strength, and hope.",
    gradient: "linear-gradient(135deg, #5b2c6f 0%, #c43c68 60%, #ff6b35 100%)",
    accent: "#c43c68",
    days: ["Sat"],
    formats: [{ label: "View Format", key: "saturday-men" }],
  },
  {
    id: "saturday-women",
    label: "Saturday",
    shortLabel: "Sat",
    title: "Women's Meeting",
    time: "9:30 AM",
    startTime: "09:30",
    endTime: "10:30",
    blurb: "Women of the group meet immediately after the men's meeting.",
    gradient: "linear-gradient(135deg, #2d1b4e 0%, #5b2c6f 50%, #c43c68 100%)",
    accent: "#5b2c6f",
    days: ["Sat"],
  },
  {
    id: "sunday",
    label: "Sunday",
    shortLabel: "Sun",
    title: "Sunday Morning",
    time: "8:00 – 9:00 AM",
    startTime: "08:00",
    endTime: "09:00",
    blurb: "Close the week the way we started it — together, in the light.",
    gradient: "linear-gradient(135deg, #c43c68 0%, #ff6b35 50%, #ffa751 100%)",
    accent: "#ff8555",
    days: ["Sun"],
    formats: [{ label: "View Format", key: "sunday" }],
  },
];
