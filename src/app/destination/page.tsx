import Link from "next/link";
import styles from "./destination.module.css";

export const metadata = {
  title: "Destino Alcanzado | RVM Plan",
  description: "Página de destino tras la redirección automática del temporizador",
};

export default function DestinationPage() {
  return (
    <main className={styles.container}>
      <div className={styles.card}>
        <div className={styles.iconContainer}>
          <svg
            width="36"
            height="36"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#10b981"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M20 6 9 17l-5-5" />
          </svg>
        </div>

        <h1 className={styles.title}>¡Redirección Exitosa!</h1>
        <p className={styles.description}>
          Has llegado a la URL de destino <code className={styles.code}>/destination</code> tras cumplirse el tiempo del loader.
        </p>

        <div className={styles.action}>
          <Link href="/" className={styles.backButton}>
            ← Volver a probar el Loader
          </Link>
        </div>
      </div>
    </main>
  );
}
