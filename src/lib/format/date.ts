import { format } from "date-fns";

export function formatDate(dateISO: string, pattern = "MMM d, yyyy") {
  try {
    return format(new Date(dateISO), pattern);
  } catch {
    return new Date(dateISO).toLocaleDateString();
  }
}

