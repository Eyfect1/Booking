import { z } from "zod";

const NAME_REGEX = /^[A-Za-zА-Яа-яЁё\s-]+$/;

function normalizePhone(value: string): string {
  return value.replace(/\D/g, "");
}

function getTodayDateOnly(): Date {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
}

function parseDateOnly(value: string): Date | null {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return null;
  }
  return new Date(parsed.getFullYear(), parsed.getMonth(), parsed.getDate());
}

export const TIME_SLOTS = Array.from({ length: 11 }, (_, index) => {
  const hour = 12 + index;
  return `${String(hour).padStart(2, "0")}:00`;
});

export function getMaxBookingDateString(): string {
  const today = getTodayDateOnly();
  const maxDate = new Date(today);
  maxDate.setDate(maxDate.getDate() + 90);
  return maxDate.toISOString().split("T")[0];
}

export function getMinBookingDateString(): string {
  return getTodayDateOnly().toISOString().split("T")[0];
}

export const bookingSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Имя должно содержать минимум 2 символа")
    .regex(NAME_REGEX, "Допустимы только буквы, пробелы и дефис"),
  phone: z.string().trim().refine((value) => {
    const digits = normalizePhone(value);
    return digits.length === 11 && (digits.startsWith("7") || digits.startsWith("8"));
  }, "Введите корректный номер: +7XXXXXXXXXX или 8XXXXXXXXXX"),
  date: z.string().refine((value) => {
    const selectedDate = parseDateOnly(value);
    if (!selectedDate) {
      return false;
    }

    const minDate = getTodayDateOnly();
    const maxDate = new Date(minDate);
    maxDate.setDate(maxDate.getDate() + 90);

    return selectedDate >= minDate && selectedDate <= maxDate;
  }, "Дата должна быть в диапазоне от сегодня до +90 дней"),
  time: z.string().refine((value) => TIME_SLOTS.includes(value), "Выберите время из доступных слотов"),
  guests: z
    .number({ message: "Введите количество гостей" })
    .int("Количество гостей должно быть целым числом")
    .min(1, "Минимум 1 гость")
    .max(12, "Максимум 12 гостей"),
});

export type BookingSchema = z.infer<typeof bookingSchema>;
