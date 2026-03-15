import React from "react";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    // Suppress 401 errors
    if (
      error?.message?.includes("401") ||
      error?.message?.includes("Unauthorized")
    ) {
      return { hasError: false }; // Don't show error UI for 401
    }
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Don't log 401 errors
    if (
      !error?.message?.includes("401") &&
      !error?.message?.includes("Unauthorized")
    ) {
      console.error("Error caught by boundary:", error, errorInfo);
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
            flexDirection: "column",
            textAlign: "center",
            padding: "20px",
          }}
        >
          <h2>Something went wrong</h2>
          <p>Please refresh the page or try again later.</p>
          <button
            onClick={() => window.location.reload()}
            style={{
              padding: "10px 20px",
              background: "#667eea",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
              marginTop: "20px",
            }}
          >
            Refresh Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
