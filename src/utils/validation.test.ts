import { describe, expect, it } from "vitest";
import {
  TIME_SLOTS,
  bookingSchema,
  getMaxBookingDateString,
  getMinBookingDateString,
  normalizePhone,
  validatePhone,
} from "./validation";

const validPayload = {
  name: "Анна",
  phone: "+7 (999) 123-45-67",
  date: getMinBookingDateString(),
  time: "18:00",
  guests: 4,
};

describe("normalizePhone", () => {
  it("removes non-digit characters", () => {
    expect(normalizePhone("+7 (999) 123-45-67")).toBe("79991234567");
  });
});

describe("validatePhone", () => {
  it("accepts +7 format with formatting", () => {
    expect(validatePhone("+7 (999) 123-45-67")).toBeNull();
  });

  it("accepts 8 format", () => {
    expect(validatePhone("89991234567")).toBeNull();
  });

  it("rejects too short numbers", () => {
    expect(validatePhone("+7 999")).toMatch(/корректный номер/i);
  });

  it("rejects numbers not starting with 7 or 8", () => {
    expect(validatePhone("+1 999 123 45 67")).toMatch(/корректный номер/i);
  });
});

describe("TIME_SLOTS", () => {
  it("contains hourly slots from 12:00 to 22:00", () => {
    expect(TIME_SLOTS).toEqual([
      "12:00",
      "13:00",
      "14:00",
      "15:00",
      "16:00",
      "17:00",
      "18:00",
      "19:00",
      "20:00",
      "21:00",
      "22:00",
    ]);
  });
});

describe("bookingSchema", () => {
  it("accepts valid booking data", () => {
    const result = bookingSchema.safeParse(validPayload);
    expect(result.success).toBe(true);
  });

  it("rejects empty required fields on submit-like payload", () => {
    const result = bookingSchema.safeParse({
      name: "",
      phone: "",
      date: "",
      time: "",
      guests: NaN,
    });
    expect(result.success).toBe(false);
  });

  it("rejects name shorter than 2 characters", () => {
    const result = bookingSchema.safeParse({ ...validPayload, name: "A" });
    expect(result.success).toBe(false);
  });

  it("rejects name with digits", () => {
    const result = bookingSchema.safeParse({ ...validPayload, name: "Anna1" });
    expect(result.success).toBe(false);
  });

  it("rejects date before today", () => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const iso = [
      yesterday.getFullYear(),
      String(yesterday.getMonth() + 1).padStart(2, "0"),
      String(yesterday.getDate()).padStart(2, "0"),
    ].join("-");

    const result = bookingSchema.safeParse({ ...validPayload, date: iso });
    expect(result.success).toBe(false);
  });

  it("rejects date later than 90 days", () => {
    const result = bookingSchema.safeParse({
      ...validPayload,
      date: getMaxBookingDateString(),
    });
    expect(result.success).toBe(true);

    const tooLate = new Date();
    tooLate.setDate(tooLate.getDate() + 91);
    const iso = [
      tooLate.getFullYear(),
      String(tooLate.getMonth() + 1).padStart(2, "0"),
      String(tooLate.getDate()).padStart(2, "0"),
    ].join("-");

    const invalid = bookingSchema.safeParse({ ...validPayload, date: iso });
    expect(invalid.success).toBe(false);
  });

  it("rejects invalid time slot", () => {
    const result = bookingSchema.safeParse({ ...validPayload, time: "11:00" });
    expect(result.success).toBe(false);
  });

  it("rejects guests outside 1-12 range", () => {
    expect(bookingSchema.safeParse({ ...validPayload, guests: 0 }).success).toBe(false);
    expect(bookingSchema.safeParse({ ...validPayload, guests: 13 }).success).toBe(false);
    expect(bookingSchema.safeParse({ ...validPayload, guests: 2.5 }).success).toBe(false);
  });
});
