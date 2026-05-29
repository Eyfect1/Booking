"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import type { BookingFormData } from "@/types/booking";
import {
  bookingSchema,
  getMaxBookingDateString,
  getMinBookingDateString,
  TIME_SLOTS,
  type BookingSchema,
} from "@/utils/validation";
import styles from "./BookingForm.module.scss";

interface BookingFormProps {
  onSubmit: (data: BookingFormData) => Promise<void>;
  isLoading: boolean;
}

export function BookingForm({ onSubmit, isLoading }: BookingFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<BookingSchema>({
    resolver: zodResolver(bookingSchema),
    mode: "onBlur",
    reValidateMode: "onBlur",
    defaultValues: {
      name: "",
      phone: "",
      date: "",
      time: "",
      guests: 2,
    },
  });

  return (
    <form className={styles.form} onSubmit={handleSubmit(onSubmit)} noValidate>
      <h1 className={styles.title}>Онлайн-бронирование</h1>
      <p className={styles.subtitle}>Оставьте детали, и мы забронируем столик для вас.</p>

      <div className={styles.field}>
        <label htmlFor="name">Имя гостя</label>
        <input id="name" type="text" placeholder="Например, Анна" {...register("name")} className={errors.name ? styles.errorInput : ""} />
        {errors.name && <p className={styles.errorText}>{errors.name.message}</p>}
      </div>

      <div className={styles.field}>
        <label htmlFor="phone">Телефон</label>
        <input id="phone" type="tel" placeholder="+7 (999) 123-45-67" {...register("phone")} className={errors.phone ? styles.errorInput : ""} />
        {errors.phone && <p className={styles.errorText}>{errors.phone.message}</p>}
      </div>

      <div className={styles.grid}>
        <div className={styles.field}>
          <label htmlFor="date">Дата</label>
          <input
            id="date"
            type="date"
            min={getMinBookingDateString()}
            max={getMaxBookingDateString()}
            {...register("date")}
            className={errors.date ? styles.errorInput : ""}
          />
          {errors.date && <p className={styles.errorText}>{errors.date.message}</p>}
        </div>

        <div className={styles.field}>
          <label htmlFor="time">Время</label>
          <select id="time" {...register("time")} className={errors.time ? styles.errorInput : ""}>
            <option value="">Выберите слот</option>
            {TIME_SLOTS.map((slot) => (
              <option key={slot} value={slot}>
                {slot}
              </option>
            ))}
          </select>
          {errors.time && <p className={styles.errorText}>{errors.time.message}</p>}
        </div>
      </div>

      <div className={styles.field}>
        <label htmlFor="guests">Количество гостей</label>
        <input
          id="guests"
          type="number"
          min={1}
          max={12}
          {...register("guests", { valueAsNumber: true })}
          className={errors.guests ? styles.errorInput : ""}
        />
        {errors.guests && <p className={styles.errorText}>{errors.guests.message}</p>}
      </div>

      <button type="submit" className={styles.submitButton} disabled={isLoading}>
        {isLoading ? (
          <span className={styles.loadingContent}>
            <span className={styles.spinner} />
            Бронирую...
          </span>
        ) : (
          "Забронировать столик"
        )}
      </button>
    </form>
  );
}
