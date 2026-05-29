import type { BookingFormData } from "@/types/booking";
import { formatBookingDate } from "@/utils/format";
import styles from "./ConfirmationScreen.module.scss";

interface ConfirmationScreenProps {
  booking: BookingFormData;
  onReset: () => void;
}

export function ConfirmationScreen({ booking, onReset }: ConfirmationScreenProps) {
  return (
    <section className={styles.card} aria-live="polite">
      <div className={styles.icon}>✓</div>
      <h2 className={styles.title}>Бронирование подтверждено</h2>
      <p className={styles.subtitle}>Мы ждём вас в ресторане. Детали брони ниже.</p>

      <dl className={styles.details}>
        <div>
          <dt>Гость</dt>
          <dd>{booking.name}</dd>
        </div>
        <div>
          <dt>Дата</dt>
          <dd>{formatBookingDate(booking.date)}</dd>
        </div>
        <div>
          <dt>Время</dt>
          <dd>{booking.time}</dd>
        </div>
        <div>
          <dt>Гостей</dt>
          <dd>{booking.guests}</dd>
        </div>
      </dl>

      <button type="button" className={styles.resetButton} onClick={onReset}>
        Забронировать ещё
      </button>
    </section>
  );
}
