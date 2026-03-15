// src/utils/errorHandler.js

// Suppress all axios errors globally
export const setupErrorHandling = () => {
  if (typeof window === "undefined") return;

  // Store original console methods
  const originalError = console.error;
  const originalWarn = console.warn;
  const originalLog = console.log;
  const originalInfo = console.info;
  const originalDebug = console.debug;

  // Filter function for axios errors - make it more aggressive
  const shouldSuppress = (args) => {
    try {
      const errorString = JSON.stringify(args).toLowerCase();
      const suppressedPatterns = [
        "axioserror",
        "401",
        "unauthorized",
        "403",
        "forbidden",
        "404",
        "not found",
        "500",
        "network error",
        "cors",
        "err_bad_request",
        "err_network",
        "xhr",
        "xmlhttprequest",
        "login failed",
        "not authenticated",
        "auth/me",
        "get",
        "post",
        "put",
        "delete",
        "localhost:5000",
        "api/auth",
        "api/tasks",
        "error: request failed",
        "status code 401",
        "uncaught (in promise)",
        "axios",
        "adapter",
        "dispatchrequest",
        "settle",
        "createerror",
      ];

      return suppressedPatterns.some((pattern) =>
        errorString.includes(pattern),
      );
    } catch (e) {
      return false;
    }
  };

  // Override ALL console methods
  console.error = (...args) => {
    if (!shouldSuppress(args)) {
      originalError.apply(console, args);
    }
  };

  console.warn = (...args) => {
    if (!shouldSuppress(args)) {
      originalWarn.apply(console, args);
    }
  };

  console.log = (...args) => {
    if (!shouldSuppress(args)) {
      originalLog.apply(console, args);
    }
  };

  console.info = (...args) => {
    if (!shouldSuppress(args)) {
      originalInfo.apply(console, args);
    }
  };

  console.debug = (...args) => {
    if (!shouldSuppress(args)) {
      originalDebug.apply(console, args);
    }
  };

  // Suppress React's error overlay for specific errors
  if (typeof window !== "undefined") {
    // Override the global error event
    const originalOnError = window.onerror;
    window.onerror = (message, source, lineno, colno, error) => {
      if (
        message?.includes("401") ||
        message?.includes("Unauthorized") ||
        message?.includes("AxiosError") ||
        source?.includes("xhr.js") ||
        source?.includes("axios")
      ) {
        return true; // Prevents default error handling
      }
      if (originalOnError) {
        return originalOnError(message, source, lineno, colno, error);
      }
      return false;
    };

    // Override unhandled rejection handler
    const originalOnUnhandledRejection = window.onunhandledrejection;
    window.onunhandledrejection = (event) => {
      if (
        event.reason?.message?.includes("401") ||
        event.reason?.message?.includes("Unauthorized") ||
        event.reason?.message?.includes("AxiosError") ||
        event.reason?.config?.url?.includes("/auth/me")
      ) {
        event.preventDefault();
        event.stopPropagation();
        return true;
      }
      if (originalOnUnhandledRejection) {
        return originalOnUnhandledRejection.call(this, event);
      }
    };

    // Add event listeners (keep these as backup)
    window.addEventListener(
      "error",
      (event) => {
        if (
          event.message?.includes("401") ||
          event.message?.includes("Unauthorized") ||
          event.message?.includes("AxiosError") ||
          event.filename?.includes("xhr.js")
        ) {
          event.preventDefault();
          event.stopPropagation();
          return false;
        }
      },
      true,
    ); // Use capture phase

    window.addEventListener(
      "unhandledrejection",
      (event) => {
        if (
          event.reason?.message?.includes("401") ||
          event.reason?.message?.includes("Unauthorized") ||
          event.reason?.message?.includes("AxiosError") ||
          event.reason?.config?.url?.includes("/auth/me")
        ) {
          event.preventDefault();
          event.stopPropagation();
          return false;
        }
      },
      true,
    ); // Use capture phase
  }

  // Inject CSS to hide error overlays
  const style = document.createElement("style");
  style.innerHTML = `
    iframe[src*="react-error-overlay"],
    [id*="react-error-overlay"],
    [class*="react-error-overlay"],
    vite-error-overlay,
    .nextjs-error-overlay,
    .react-error-overlay,
    [data-reactroot] + *,
    #error-overlay,
    .error-overlay,
    .vite-error-overlay {
      display: none !important;
      visibility: hidden !important;
      opacity: 0 !important;
      pointer-events: none !important;
      z-index: -9999 !important;
      width: 0 !important;
      height: 0 !important;
      position: fixed !important;
      top: -9999px !important;
      left: -9999px !important;
    }
  `;
  document.head.appendChild(style);

  // Return cleanup function
  return () => {
    console.error = originalError;
    console.warn = originalWarn;
    console.log = originalLog;
    console.info = originalInfo;
    console.debug = originalDebug;
    window.onerror = originalOnError;
    window.onunhandledrejection = originalOnUnhandledRejection;
  };
};

// Also export a function to manually suppress errors
export const suppressAxiosError = (error) => {
  if (
    error?.message?.includes("401") ||
    error?.response?.status === 401 ||
    error?.config?.url?.includes("/auth/me")
  ) {
    return true; // This error should be suppressed
  }
  return false;
};
