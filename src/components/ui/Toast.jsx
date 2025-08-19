import React, { useEffect, useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from 'lucide-react';

// Animations
const slideIn = keyframes`
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
`;

const slideOut = keyframes`
  from {
    transform: translateX(0);
    opacity: 1;
  }
  to {
    transform: translateX(100%);
    opacity: 0;
  }
`;

const progressAnimation = keyframes`
  from {
    width: 100%;
  }
  to {
    width: 0%;
  }
`;

// Toast Container
const ToastContainer = styled.div`
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  gap: 12px;
  max-width: 400px;
`;

// Individual Toast
const ToastWrapper = styled.div`
  background: white;
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
  border: 1px solid ${props => props.borderColor};
  border-left: 4px solid ${props => props.borderColor};
  position: relative;
  overflow: hidden;
  animation: ${props => props.isVisible ? slideIn : slideOut} 0.3s ease-in-out;
  min-width: 300px;
`;

const ToastContent = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 12px;
`;

const ToastIcon = styled.div`
  color: ${props => props.color};
  flex-shrink: 0;
  margin-top: 2px;
`;

const ToastText = styled.div`
  flex: 1;
`;

const ToastTitle = styled.div`
  font-weight: 600;
  font-size: 14px;
  color: #1f2937;
  margin-bottom: 4px;
`;

const ToastMessage = styled.div`
  font-size: 13px;
  color: #6b7280;
  line-height: 1.4;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: #9ca3af;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  transition: all 0.2s ease;
  flex-shrink: 0;
  
  &:hover {
    background: #f3f4f6;
    color: #6b7280;
  }
`;

const ProgressBar = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  height: 3px;
  background: ${props => props.color};
  animation: ${progressAnimation} ${props => props.duration}ms linear;
`;

// Toast types configuration
const toastTypes = {
  success: {
    icon: CheckCircle,
    color: '#10b981',
    borderColor: '#d1fae5',
    bgColor: '#f0fdf4'
  },
  error: {
    icon: AlertCircle,
    color: '#ef4444',
    borderColor: '#fee2e2',
    bgColor: '#fef2f2'
  },
  warning: {
    icon: AlertTriangle,
    color: '#f59e0b',
    borderColor: '#fef3c7',
    bgColor: '#fffbeb'
  },
  info: {
    icon: Info,
    color: '#3b82f6',
    borderColor: '#dbeafe',
    bgColor: '#eff6ff'
  }
};

const Toast = ({ 
  id, 
  type = 'info', 
  title, 
  message, 
  duration = 5000, 
  onClose, 
  isVisible = true 
}) => {
  const [isClosing, setIsClosing] = useState(false);
  const toastConfig = toastTypes[type] || toastTypes.info;
  const IconComponent = toastConfig.icon;

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        handleClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [duration]);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose(id);
    }, 300);
  };

  return (
    <ToastWrapper 
      borderColor={toastConfig.borderColor}
      isVisible={!isClosing}
    >
      <ToastContent>
        <ToastIcon color={toastConfig.color}>
          <IconComponent size={20} />
        </ToastIcon>
        
        <ToastText>
          <ToastTitle>{title}</ToastTitle>
          {message && <ToastMessage>{message}</ToastMessage>}
        </ToastText>
        
        <CloseButton onClick={handleClose}>
          <X size={16} />
        </CloseButton>
      </ToastContent>
      
      {duration > 0 && (
        <ProgressBar 
          color={toastConfig.color} 
          duration={duration}
        />
      )}
    </ToastWrapper>
  );
};

export default Toast; 