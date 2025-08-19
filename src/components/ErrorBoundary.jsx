import React from 'react';
import styled from 'styled-components';
import { AlertTriangle, RefreshCw } from 'lucide-react';

const ErrorContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  padding: 24px;
  text-align: center;
  background-color: #fef2f2;
`;

const ErrorIcon = styled(AlertTriangle)`
  color: #ef4444;
  width: 64px;
  height: 64px;
  margin-bottom: 24px;
`;

const ErrorTitle = styled.h1`
  font-size: 24px;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 12px 0;
`;

const ErrorMessage = styled.p`
  font-size: 16px;
  color: #64748b;
  margin: 0 0 24px 0;
  max-width: 500px;
`;

const RetryButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: #2563eb;
  }
`;

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <ErrorContainer>
          <ErrorIcon />
          <ErrorTitle>Something went wrong</ErrorTitle>
          <ErrorMessage>
            We encountered an unexpected error. Please try refreshing the page or contact support if the problem persists.
          </ErrorMessage>
          <RetryButton onClick={this.handleRetry}>
            <RefreshCw size={16} />
            Refresh Page
          </RetryButton>
        </ErrorContainer>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary; 