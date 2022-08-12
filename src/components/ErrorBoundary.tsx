import React, { Component } from 'react'
import Button from 'react-bootstrap/Button'

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
      <div className="d-flex align-items-center justify-content-center vh-100 bg-primary">
        <div>
          <h1 className="display-1 fw-bold text-white">
            Something went wrong
          </h1>
          <div className="row">
            <Button
              size="lg"
              variant="light"
              onClick={() => {
                window.location.reload()
              }}
            >
              Reload page
            </Button>
          </div>
        </div>
      </div>
    )
  }
}
