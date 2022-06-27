import React, { Component } from 'react'

export class ErrorBoundary extends Component<{ children: React.ReactNode }, { hasError: boolean }> {
  public state = { hasError: false }

  public static getDerivedStateFromError () {
    return { hasError: true }
  }

  public componentDidCatch (error: Error): void {
    console.error(error)
  }

  public render (): React.ReactNode {
    return !this.state.hasError ? (
      this.props.children
    ) : (
      <div>
        <h1>Something went wrong</h1>
        <button
          onClick={() => {
            window.location.reload()
          }}
        >
          Reload page
        </button>
      </div>
    )
  }
}
