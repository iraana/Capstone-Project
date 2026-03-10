export const formatOrderDateTime = (timestamp?: string) => {
    if (!timestamp) return "N/A";

    const dt = new Date(timestamp);
    if (isNaN(dt.getTime())) return "Invalid Date";

    return dt.toLocaleString("en-US", {
      timeZone: "America/Toronto",
      dateStyle: "medium",
      timeStyle: "short",
    });
  };