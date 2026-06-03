/* Intl.DateTimeFormat is a built-in browser API that handles timezone conversion and locale formatting;
   formatToParts() returns day/month/year as separate values so they can be rearranged in the order
   chosen in the user's settings (DD/MM/YYYY, MM/DD/YYYY or YYYY-MM-DD) */
export const formatDateTime = (dateString, settings) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  if (isNaN(date)) return dateString;

  const tz = settings?.timezone || "UTC";
  const dateFormat = settings?.dateFormat || "DD/MM/YYYY";
  const timeFormat = settings?.timeFormat || "24h";

  try {
    const optionsDate = { timeZone: tz, year: "numeric", month: "2-digit", day: "2-digit" };
    const optionsTime = { timeZone: tz, hour: "2-digit", minute: "2-digit", hour12: timeFormat === "12h" };

    const parts = new Intl.DateTimeFormat("en-US", optionsDate).formatToParts(date);
    const m = parts.find((p) => p.type === "month").value;
    const d = parts.find((p) => p.type === "day").value;
    const y = parts.find((p) => p.type === "year").value;

    let formattedDate = "";
    if (dateFormat === "DD/MM/YYYY") formattedDate = `${d}/${m}/${y}`;
    else if (dateFormat === "MM/DD/YYYY") formattedDate = `${m}/${d}/${y}`;
    else if (dateFormat === "YYYY-MM-DD") formattedDate = `${y}-${m}-${d}`;

    const formattedTime = new Intl.DateTimeFormat("en-US", optionsTime).format(date);
    return `${formattedDate} ${formattedTime}`;
  } catch (e) {
    // if the timezone string is invalid the Intl API throws, so the raw string is returned as fallback
    return dateString;
  }
};
