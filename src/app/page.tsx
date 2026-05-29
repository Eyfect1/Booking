"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { BookingForm } from "@/components/BookingForm/BookingForm";
import { ConfirmationScreen } from "@/components/ConfirmationScreen/ConfirmationScreen";
import type { BookingFormData, BookingStatus } from "@/types/booking";
import styles from "./page.module.scss";

// Общие параметры анимации для смены формы и экрана подтверждения
const transitionProps = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
  transition: { duration: 0.2 },
};

export default function HomePage() {
  const [status, setStatus] = useState<BookingStatus>("idle");
  const [bookingData, setBookingData] = useState<BookingFormData | null>(null);

  const handleSubmit = async (data: BookingFormData) => {
    setStatus("loading");
    // Имитация сетевого запроса (по ТЗ — 1.5 секунды)
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setBookingData(data);
    setStatus("success");
  };

  const handleReset = () => {
    setBookingData(null);
    setStatus("idle");
  };

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        {/* mode="wait" — сначала скрывается старый экран, потом показывается новый */}
        <AnimatePresence mode="wait">
          {status === "success" && bookingData ? (
            <motion.div key="success" {...transitionProps}>
              <ConfirmationScreen booking={bookingData} onReset={handleReset} />
            </motion.div>
          ) : (
            // key="form" при возврате с экрана успеха перемонтирует форму с defaultValues
            <motion.div key="form" {...transitionProps}>
              <BookingForm onSubmit={handleSubmit} isLoading={status === "loading"} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}
