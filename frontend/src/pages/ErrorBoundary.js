import React from "react";

class ErrorBoundary extends React.Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error("ErrorBoundary caught an error:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return <div className="text-center text-danger">Something went wrong. Please try again.</div>;
    }
    return this.props.children;
  }
}

export default ErrorBoundary;