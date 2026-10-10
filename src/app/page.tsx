"use client";

import React, { useState } from "react";
import { RedirectLoader } from "@/components/RedirectLoader";
import styles from "./page.module.css";

export default function HomePage() {
  const [targetUrl, setTargetUrl] = useState<string>("/destination");
  const [duration, setDuration] = useState<number>(10);
  const [componentKey, setComponentKey] = useState<number>(0);

  const handleReset = () => {
    setComponentKey((prev) => prev + 1);
  };

  const setPreset = (url: string, seconds: number = 10) => {
    setTargetUrl(url);
    setDuration(seconds);
    setComponentKey((prev) => prev + 1);
  };

  return (
    <main className={styles.main}>
      <div className={styles.ambientGlow} />

      <header className={styles.hero}>
        <div className={styles.tagline}>
          <span>React & Next.js 16</span>
          <span>•</span>
          <span>Auto Redirect Engine</span>
        </div>
        <h1 className={styles.pageTitle}>Redirect Countdown Loader</h1>
        <p className={styles.pageSubtitle}>
          Temporizador interactivo con animación circular de alta precisión y redirección
          automática al expirar los 10 segundos.
        </p>
      </header>

      {/* Main Loader Demo */}
      <section className={styles.showcaseWrapper}>
        <RedirectLoader
          key={componentKey}
          targetUrl={targetUrl}
          durationInSeconds={duration}
          title="Redireccionando..."
          description={`Serás transferido automáticamente a ${targetUrl} al finalizar.`}
          allowPause={true}
          allowCancel={true}
        />
      </section>

      {/* Interactive Controls & Settings */}
      <section className={styles.controlsPanel}>
        <h2 className={styles.controlsTitle}>⚙️ Configuración del Demo</h2>
        <div className={styles.controlsGrid}>
          <div className={styles.controlGroup}>
            <label htmlFor="url-input" className={styles.controlLabel}>
              URL de Destino
            </label>
            <input
              id="url-input"
              type="text"
              value={targetUrl}
              onChange={(e) => setTargetUrl(e.target.value)}
              className={styles.input}
              placeholder="/destination o https://..."
            />
            <div className={styles.presetButtons}>
              <button
                type="button"
                className={styles.presetBtn}
                onClick={() => setPreset("/destination", 10)}
              >
                Ruta Interna (/destination)
              </button>
              <button
                type="button"
                className={styles.presetBtn}
                onClick={() => setPreset("https://nextjs.org", 10)}
              >
                Sitio Externo (Next.js)
              </button>
            </div>
          </div>

          <div className={styles.controlGroup}>
            <label htmlFor="duration-input" className={styles.controlLabel}>
              Duración (segundos)
            </label>
            <input
              id="duration-input"
              type="number"
              min="1"
              max="60"
              value={duration}
              onChange={(e) => setDuration(Math.max(1, Number(e.target.value) || 1))}
              className={styles.input}
            />
            <div className={styles.presetButtons}>
              <button
                type="button"
                className={styles.presetBtn}
                onClick={handleReset}
              >
                🔄 Reiniciar Temporizador
              </button>
              <button
                type="button"
                className={styles.presetBtn}
                onClick={() => setPreset(targetUrl, 5)}
              >
                Probar 5s
              </button>
              <button
                type="button"
                className={styles.presetBtn}
                onClick={() => setPreset(targetUrl, 10)}
              >
                Probar 10s
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Code snippet reference */}
      <section className={styles.codeSnippetCard}>
        <h3 className={styles.codeSnippetTitle}>Modo de uso en tu aplicación</h3>
        <pre className={styles.pre}>
{`import { RedirectLoader } from "@/components/RedirectLoader";

export default function MiPagina() {
  return (
    <RedirectLoader
      targetUrl="/dashboard" // O URL externa: "https://ejemplo.com"
      durationInSeconds={10}
      title="Acceso concedido"
      description="Te estamos redirigiendo a tu panel principal..."
    />
  );
}`}
        </pre>
      </section>
    </main>
  );
}
