import React from "react";

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  render() {
    if (this.state.error) {
      return (
        <main className="crash-screen">
          <div>
            <p className="eyebrow">UI error</p>
            <h1>Something in this view crashed.</h1>
            <p>{this.state.error.message}</p>
            <button onClick={() => window.location.reload()}>Reload app</button>
          </div>
        </main>
      );
    }

    return this.props.children;
  }
}
