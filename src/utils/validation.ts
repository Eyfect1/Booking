import { z } from "zod";

const NAME_REGEX = /^[A-Za-zА-Яа-яЁё\s-]+$/;

export function normalizePhone(value: string): string {
  return value.replace(/\D/g, "");
}

/** Validates Russian phone: +7 or 8 + 10 digits (per test task spec). */
export function validatePhone(value: string): string | null {
  const digits = normalizePhone(value);
  if (digits.length === 11 && (digits.startsWith("7") || digits.startsWith("8"))) {
    return null;
  }
  return "Введите корректный номер: +7XXXXXXXXXX или 8XXXXXXXXXX";
}

/** Сегодняшняя дата без времени — для сравнения с полем type="date". */
function getTodayDateOnly(): Date {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
}

/**
 * Парсит строку YYYY-MM-DD в локальной timezone.
 * toISOString() здесь не используем — иначе дата может «съехать» на день.
 */
function parseDateOnly(value: string): Date | null {
  const [year, month, day] = value.split("-").map(Number);
  if (!year || !month || !day) {
    return null;
  }
  const parsed = new Date(year, month - 1, day);
  // Отсекаем невалидные даты вроде 2026-02-31
  if (
    parsed.getFullYear() !== year ||
    parsed.getMonth() !== month - 1 ||
    parsed.getDate() !== day
  ) {
    return null;
  }
  return parsed;
}

/** Формат для атрибутов min/max у input[type="date"]. */
function formatDateOnly(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

// 12:00, 13:00, … 22:00 — 11 слотов по ТЗ
export const TIME_SLOTS = Array.from({ length: 11 }, (_, index) => {
  const hour = 12 + index;
  return `${String(hour).padStart(2, "0")}:00`;
});

export function getMaxBookingDateString(): string {
  const today = getTodayDateOnly();
  const maxDate = new Date(today);
  maxDate.setDate(maxDate.getDate() + 90);
  return formatDateOnly(maxDate);
}

export function getMinBookingDateString(): string {
  return formatDateOnly(getTodayDateOnly());
}

// Единая схема: используется в react-hook-form и в unit-тестах
export const bookingSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Укажите имя гостя")
    .min(2, "Имя должно содержать минимум 2 символа")
    .regex(NAME_REGEX, "Допустимы только буквы, пробелы и дефис"),
  phone: z
    .string()
    .trim()
    .min(1, "Укажите номер телефона")
    .superRefine((value, ctx) => {
      const error = validatePhone(value);
      if (error) {
        ctx.addIssue({ code: "custom", message: error });
      }
    }),
  date: z
    .string()
    .min(1, "Укажите дату")
    .refine((value) => {
      const selectedDate = parseDateOnly(value);
      if (!selectedDate) {
        return false;
      }

      const minDate = getTodayDateOnly();
      const maxDate = new Date(minDate);
      maxDate.setDate(maxDate.getDate() + 90);

      return selectedDate >= minDate && selectedDate <= maxDate;
    }, "Дата должна быть в диапазоне от сегодня до +90 дней"),
  time: z
    .string()
    .min(1, "Выберите время")
    .refine((value) => TIME_SLOTS.includes(value), "Выберите время из доступных слотов"),
  guests: z
    .number({ message: "Введите количество гостей" })
    .int("Количество гостей должно быть целым числом")
    .min(1, "Минимум 1 гость")
    .max(12, "Максимум 12 гостей"),
});

export type BookingFormData = z.infer<typeof bookingSchema>;
