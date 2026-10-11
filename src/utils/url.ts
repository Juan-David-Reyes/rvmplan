/**
 * Utility to sanitize, validate, and normalize redirect URLs.
 * Resolves URLs entered without protocols (e.g., 'google.com' -> 'https://google.com')
 * and relative paths without leading slash (e.g., 'destination' -> '/destination').
 */

export interface NormalizedUrlResult {
  /** The safe, fully-qualified or root-relative URL ready for navigation */
  url: string;
  /** Whether the destination is external (outside current Next.js domain) */
  isExternal: boolean;
  /** Human-readable representation of the destination */
  displayLabel: string;
}

export function normalizeRedirectUrl(input: string): NormalizedUrlResult {
  const trimmed = (input || "").trim();

  // If empty, default to home page
  if (!trimmed) {
    return {
      url: "/",
      isExternal: false,
      displayLabel: "Inicio (/)",
    };
  }

  // Check for absolute protocol: http:// or https://
  if (/^https?:\/\//i.test(trimmed)) {
    return {
      url: trimmed,
      isExternal: true,
      displayLabel: trimmed,
    };
  }

  // Check for protocol-relative URL: //example.com
  if (trimmed.startsWith("//")) {
    const fullUrl = `https:${trimmed}`;
    return {
      url: fullUrl,
      isExternal: true,
      displayLabel: fullUrl,
    };
  }

  // Check for root-relative internal path: /path
  if (trimmed.startsWith("/")) {
    return {
      url: trimmed,
      isExternal: false,
      displayLabel: trimmed,
    };
  }

  // Check for common external domain patterns:
  // e.g. "www.google.com", "google.com", "github.com/repo", "subdomain.domain.org"
  const isDomainPattern =
    trimmed.startsWith("www.") ||
    /^([a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}(\/.*)?$/i.test(trimmed);

  if (isDomainPattern) {
    const formattedUrl = `https://${trimmed}`;
    return {
      url: formattedUrl,
      isExternal: true,
      displayLabel: formattedUrl,
    };
  }

  // If none of the above, treat as internal route and prepend '/' (e.g., 'destination' -> '/destination')
  const internalRoute = `/${trimmed}`;
  return {
    url: internalRoute,
    isExternal: false,
    displayLabel: internalRoute,
  };
}
