import React from 'react';
import styled from 'styled-components';
import { useToast } from '../contexts/ToastContext';
import { CheckCircle, AlertCircle, Info, XCircle } from 'lucide-react';

const DemoContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const SectionTitle = styled.h2`
  font-size: 24px;
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 16px 0;
`;

const ButtonGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-bottom: 24px;
`;

const DemoButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px 20px;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
`;

const SuccessButton = styled(DemoButton)`
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
`;

const ErrorButton = styled(DemoButton)`
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  color: white;
`;

const WarningButton = styled(DemoButton)`
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
  color: white;
`;

const InfoButton = styled(DemoButton)`
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  color: white;
`;

const ClearButton = styled(DemoButton)`
  background: linear-gradient(135deg, #6b7280 0%, #4b5563 100%);
  color: white;
`;

const Description = styled.p`
  color: #64748b;
  font-size: 14px;
  line-height: 1.6;
  margin: 0;
`;

const ToastDemo = () => {
  const { success, error, warning, info, clearAll } = useToast();

  const handleSuccess = () => {
    success(
      'Success!',
      'Your action was completed successfully.',
      5000
    );
  };

  const handleError = () => {
    error(
      'Error!',
      'Something went wrong. Please try again.',
      5000
    );
  };

  const handleWarning = () => {
    warning(
      'Warning!',
      'Please review your input before proceeding.',
      5000
    );
  };

  const handleInfo = () => {
    info(
      'Information',
      'Here is some helpful information for you.',
      5000
    );
  };

  return (
    <DemoContainer>
      <SectionTitle>Toast Notifications Demo</SectionTitle>
      <Description>
        Click the buttons below to see different types of toast notifications in action. 
        Toasts will appear in the top-right corner of the screen.
      </Description>
      
      <ButtonGrid>
        <SuccessButton onClick={handleSuccess}>
          <CheckCircle size={18} />
          Success Toast
        </SuccessButton>
        
        <ErrorButton onClick={handleError}>
          <XCircle size={18} />
          Error Toast
        </ErrorButton>
        
        <WarningButton onClick={handleWarning}>
          <AlertCircle size={18} />
          Warning Toast
        </WarningButton>
        
        <InfoButton onClick={handleInfo}>
          <Info size={18} />
          Info Toast
        </InfoButton>
        
        <ClearButton onClick={clearAll}>
          <XCircle size={18} />
          Clear All Toasts
        </ClearButton>
      </ButtonGrid>
      
      <Description>
        <strong>Features:</strong>
        <br />
        • Different toast types (success, error, warning, info)
        <br />
        • Auto-dismiss after 5 seconds
        <br />
        • Manual close button
        <br />
        • Stack multiple toasts
        <br />
        • Clear all toasts at once
      </Description>
    </DemoContainer>
  );
};

export default ToastDemo; 