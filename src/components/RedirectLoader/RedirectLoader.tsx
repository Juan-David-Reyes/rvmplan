"use client";

import React from "react";
import { RedirectLoaderProps } from "@/types/redirect-loader";
import { useRedirectTimer } from "@/hooks/useRedirectTimer";
import styles from "./RedirectLoader.module.css";

const RADIUS = 54;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export function RedirectLoader({
  targetUrl,
  durationInSeconds = 10,
  title = "Preparando tu redirección",
  description = "Serás redirigido automáticamente en unos instantes.",
  allowPause = true,
  allowCancel = true,
  onRedirect,
  onCancel,
}: RedirectLoaderProps) {
  const {
    timeLeft,
    progressPercentage,
    resolvedUrl,
    isExternal,
    isPaused,
    isCancelled,
    isRedirecting,
    pause,
    resume,
    cancel,
    reset,
    redirectNow,
  } = useRedirectTimer({
    targetUrl,
    durationInSeconds,
    onRedirect,
    onCancel,
  });

  const strokeDashoffset = CIRCUMFERENCE - (CIRCUMFERENCE * progressPercentage) / 100;

  return (
    <div
      className={`${styles.card} ${isCancelled ? styles.cancelledCard : ""}`}
      role="region"
      aria-label="Contador de redirección"
    >
      <div className={styles.cardGlow} />

      <header className={styles.header}>
        <h2 className={styles.title}>{title}</h2>
        <p className={styles.description}>{description}</p>
      </header>

      {/* Circular SVG Countdown Progress */}
      <div className={styles.timerSection}>
        <svg
          className={styles.svgRing}
          width="136"
          height="136"
          viewBox="0 0 136 136"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="timerGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#6366f1" />
              <stop offset="50%" stopColor="#a855f7" />
              <stop offset="100%" stopColor="#ec4899" />
            </linearGradient>
          </defs>
          <circle
            className={styles.ringBackground}
            cx="68"
            cy="68"
            r={RADIUS}
          />
          <circle
            className={styles.ringProgress}
            cx="68"
            cy="68"
            r={RADIUS}
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={isCancelled ? CIRCUMFERENCE : strokeDashoffset}
          />
        </svg>

        <div className={styles.timerCenter}>
          <span className={styles.timerValue}>
            {isCancelled ? "--" : timeLeft}
          </span>
          <span className={styles.timerUnit}>
            {isCancelled ? "Cancelado" : timeLeft === 1 ? "segundo" : "segundos"}
          </span>
        </div>
      </div>

      {/* Target URL Pill with normalized URL display */}
      <div className={styles.targetUrlContainer} title={resolvedUrl}>
        <span className={styles.urlBadge}>
          {isExternal ? "Web Externa" : "Ruta Interna"}
        </span>
        <span className={styles.urlText}>{resolvedUrl}</span>
      </div>

      {/* Linear Progress Bar */}
      <div
        className={styles.progressBarContainer}
        role="progressbar"
        aria-valuenow={Math.round(progressPercentage)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Progreso de tiempo transcurrido"
      >
        <div
          className={styles.progressBarFill}
          style={{ width: `${isCancelled ? 0 : progressPercentage}%` }}
        />
      </div>

      {/* Cancelled State feedback */}
      {isCancelled ? (
        <>
          <p className={styles.cancelledNotice}>
            Has cancelado la redirección automática.
          </p>
          <div className={styles.actionsContainer}>
            <button
              type="button"
              className={styles.primaryButton}
              onClick={reset}
            >
              Reiniciar cuenta regresiva
            </button>
          </div>
        </>
      ) : (
        /* Action buttons */
        <div className={styles.actionsContainer}>
          <button
            type="button"
            className={styles.primaryButton}
            onClick={redirectNow}
            disabled={isRedirecting}
          >
            {isRedirecting ? (
              <>
                <span className={styles.statusSpinner} />
                <span>Redirigiendo...</span>
              </>
            ) : (
              <>
                <span>Ir ahora</span>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M5 12h14" />
                  <path d="m12 5 7 7-7 7" />
                </svg>
              </>
            )}
          </button>

          {allowPause && !isRedirecting && (
            <button
              type="button"
              className={styles.secondaryButton}
              onClick={isPaused ? resume : pause}
              aria-label={isPaused ? "Reanudar temporizador" : "Pausar temporizador"}
            >
              {isPaused ? "Reanudar" : "Pausar"}
            </button>
          )}

          {allowCancel && !isRedirecting && (
            <button
              type="button"
              className={styles.dangerButton}
              onClick={cancel}
              aria-label="Cancelar redirección"
            >
              Cancelar
            </button>
          )}
        </div>
      )}

      {/* Live status caption */}
      {isPaused && (
        <div className={styles.statusNotice}>
          <span>⏸ Temporizador en pausa</span>
        </div>
      )}
      {isRedirecting && (
        <div className={styles.statusNotice}>
          <span className={styles.statusSpinner} />
          <span>Navegando a {resolvedUrl}...</span>
        </div>
      )}
    </div>
  );
}
