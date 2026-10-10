export interface RedirectLoaderProps {
  /**
   * Target URL to redirect to (can be relative like '/dashboard' or absolute like 'https://google.com')
   */
  targetUrl: string;

  /**
   * Countdown duration in seconds. Defaults to 10.
   */
  durationInSeconds?: number;

  /**
   * Optional custom title displayed above the timer.
   */
  title?: string;

  /**
   * Optional subtitle or message explaining the redirect reason.
   */
  description?: string;

  /**
   * Whether to allow the user to pause/resume the countdown. Defaults to true.
   */
  allowPause?: boolean;

  /**
   * Whether to allow the user to cancel the countdown entirely. Defaults to true.
   */
  allowCancel?: boolean;

  /**
   * Callback fired when redirection is triggered.
   */
  onRedirect?: (url: string) => void;

  /**
   * Callback fired if user manually cancels the countdown.
   */
  onCancel?: () => void;
}

export interface UseRedirectTimerOptions {
  targetUrl: string;
  durationInSeconds: number;
  autoStart?: boolean;
  onRedirect?: (url: string) => void;
  onCancel?: () => void;
}

export interface UseRedirectTimerReturn {
  timeLeft: number;
  totalDuration: number;
  progressPercentage: number;
  isRunning: boolean;
  isPaused: boolean;
  isCancelled: boolean;
  isRedirecting: boolean;
  pause: () => void;
  resume: () => void;
  cancel: () => void;
  reset: () => void;
  redirectNow: () => void;
}
