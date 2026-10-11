"use client";

import React, { useState, useId } from "react";
import { RedirectLoader } from "@/components/RedirectLoader";
import { normalizeRedirectUrl } from "@/utils/url";
import styles from "./page.module.css";

export default function HomePage() {
  const urlInputId = useId();
  const durationInputId = useId();

  const [inputUrl, setInputUrl] = useState<string>("/destination");
  const [activeUrl, setActiveUrl] = useState<string>("/destination");
  const [duration, setDuration] = useState<number>(10);
  const [componentKey, setComponentKey] = useState<number>(0);

  const normalized = normalizeRedirectUrl(inputUrl);

  const handleApplyAndRestart = (urlToUse?: string, durationToUse?: number) => {
    const target = urlToUse ?? inputUrl;
    const dur = durationToUse ?? duration;
    setInputUrl(target);
    setActiveUrl(target);
    setDuration(dur);
    setComponentKey((prev) => prev + 1);
  };

  return (
    <main className={styles.main}>
      <div className={styles.ambientGlow} />

      <header className={styles.hero}>
        <div className={styles.tagline}>
          <span>React & Next.js 16</span>
          <span>•</span>
          <span>Redirección Segura y Normalizada</span>
        </div>
        <h1 className={styles.pageTitle}>Redirect Countdown Loader</h1>
        <p className={styles.pageSubtitle}>
          Temporizador de 10 segundos con normalización automática de URLs (evita errores 404
          al ingresar dominios sin protocolo como <code className={styles.inlineCode}>google.com</code>).
        </p>
      </header>

      {/* Main Loader Component */}
      <section className={styles.showcaseWrapper}>
        <RedirectLoader
          key={componentKey}
          targetUrl={activeUrl}
          durationInSeconds={duration}
          title="Redireccionando..."
          description={`Serás transferido automáticamente al finalizar la cuenta regresiva.`}
          allowPause={true}
          allowCancel={true}
        />
      </section>

      {/* Interactive Controls & Settings */}
      <section className={styles.controlsPanel}>
        <h2 className={styles.controlsTitle}>⚙️ Configuración y Prueba de URLs</h2>
        <div className={styles.controlsGrid}>
          <div className={styles.controlGroup}>
            <label htmlFor={urlInputId} className={styles.controlLabel}>
              URL o Dominio de Destino
            </label>
            <input
              id={urlInputId}
              type="text"
              value={inputUrl}
              onChange={(e) => {
                const nextVal = e.target.value;
                setInputUrl(nextVal);
                setActiveUrl(nextVal);
              }}
              className={styles.input}
              placeholder="Ej: google.com, /destination, https://nextjs.org"
            />

            {/* Resolved URL preview */}
            <div className={styles.resolvedInfo}>
              <span className={styles.resolvedLabel}>Destino resuelto:</span>
              <span className={styles.resolvedValue}>
                {normalized.url} ({normalized.isExternal ? "Externa" : "Interna"})
              </span>
            </div>

            <div className={styles.presetButtons}>
              <button
                type="button"
                className={styles.presetBtn}
                onClick={() => handleApplyAndRestart("/destination", 10)}
              >
                Ruta Interna (/destination)
              </button>
              <button
                type="button"
                className={styles.presetBtn}
                onClick={() => handleApplyAndRestart("google.com", 10)}
              >
                google.com (Sin https)
              </button>
              <button
                type="button"
                className={styles.presetBtn}
                onClick={() => handleApplyAndRestart("https://nextjs.org", 10)}
              >
                https://nextjs.org
              </button>
            </div>
          </div>

          <div className={styles.controlGroup}>
            <label htmlFor={durationInputId} className={styles.controlLabel}>
              Duración (segundos)
            </label>
            <input
              id={durationInputId}
              type="number"
              min="1"
              max="60"
              value={duration}
              onChange={(e) => {
                const newDuration = Math.max(1, Number(e.target.value) || 1);
                setDuration(newDuration);
              }}
              className={styles.input}
            />
            <div className={styles.presetButtons}>
              <button
                type="button"
                className={styles.presetBtnHighlight}
                onClick={() => handleApplyAndRestart()}
              >
                🔄 Reiniciar Temporizador
              </button>
              <button
                type="button"
                className={styles.presetBtn}
                onClick={() => handleApplyAndRestart(inputUrl, 5)}
              >
                Probar 5s
              </button>
              <button
                type="button"
                className={styles.presetBtn}
                onClick={() => handleApplyAndRestart(inputUrl, 10)}
              >
                Probar 10s
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Code snippet reference */}
      <section className={styles.codeSnippetCard}>
        <h3 className={styles.codeSnippetTitle}>Cómo usar en tu proyecto Next.js</h3>
        <pre className={styles.pre}>
{`import { RedirectLoader } from "@/components/RedirectLoader";

export default function MiPagina() {
  return (
    <RedirectLoader
      // Soporta rutas internas (/dashboard), dominios directos (google.com) o URLs completas (https://...)
      targetUrl="google.com" 
      durationInSeconds={10}
      title="Acceso concedido"
      description="Te estamos redirigiendo a la nueva plataforma..."
      onRedirect={(url) => console.log("Redirigido a:", url)}
    />
  );
}`}
        </pre>
      </section>
    </main>
  );
}
