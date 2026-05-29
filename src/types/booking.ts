// Тип данных формы выводится из Zod-схемы — без дублирования интерфейса
export type { BookingFormData } from "@/utils/validation";

/** Состояние сценария бронирования на главной странице */
export type BookingStatus = "idle" | "loading" | "success";
