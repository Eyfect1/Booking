import { describe, expect, it } from "vitest";
import { formatBookingDate } from "./format";

describe("formatBookingDate", () => {
  it("formats ISO date in Russian locale", () => {
    const formatted = formatBookingDate("2026-05-28");
    expect(formatted).toContain("2026");
    expect(formatted).toMatch(/ма/i);
  });
});
