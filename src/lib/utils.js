import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const statusColors = {
  // Orders
  REJECTED: {
    color: "#ef4444",
    badgeText: "Rejected",
  },
  APPROVED: {
    color: "#2b4cbe",
    badgeText: "Approved",
  },
  MEASURED: {
    color: "#c09000",
    badgeText: "Measured",
  },
  DONE: {
    color: "#1d4ed8",
    badgeText: "Done",
  },
  CLAIMED: {
    color: "#16a34a",
    badgeText: "Claimed",
  },
  PENDING: {
    color: "#dc2626",
    badgeText: "Pending",
  },
  // Rentals
  GIVEN: {
    color: "#c09000",
    badgeText: "Given",
  },
  RETURNED: {
    color: "#31a900",
    badgeText: "Returned",
  },
  // Raw Materials
  "Out of Stock": {
    color: "red",
    badgeText: "Out of Stock",
  },
  "In Stock": {
    color: "green",
    badgeText: "In Stock",
  },
  "Low Stock": {
    color: "orange",
    badgeText: "Low Stock",
  },
  default: {
    color: "#6b7280",
    badgeText: "Unknown",
  },
  downPayment: {
    color: "#6b7280",
    badgeText: "Down",
  },
  
};
