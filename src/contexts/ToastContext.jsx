import React, { createContext, useContext, useState, useCallback } from 'react';
import Toast from '../components/ui/Toast';
import styled from 'styled-components';

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

const ToastContext = createContext();

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((toast) => {
    const id = Date.now() + Math.random();
    const newToast = { id, ...toast };
    setToasts(prev => [...prev, newToast]);
    return id;
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  const showToast = useCallback((type, title, message, duration = 5000) => {
    return addToast({ type, title, message, duration });
  }, [addToast]);

  const success = useCallback((title, message, duration) => {
    return showToast('success', title, message, duration);
  }, [showToast]);

  const error = useCallback((title, message, duration) => {
    return showToast('error', title, message, duration);
  }, [showToast]);

  const warning = useCallback((title, message, duration) => {
    return showToast('warning', title, message, duration);
  }, [showToast]);

  const info = useCallback((title, message, duration) => {
    return showToast('info', title, message, duration);
  }, [showToast]);

  const clearAll = useCallback(() => {
    setToasts([]);
  }, []);

  const value = {
    toasts,
    addToast,
    removeToast,
    showToast,
    success,
    error,
    warning,
    info,
    clearAll
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastContainer>
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            {...toast}
            onClose={removeToast}
          />
        ))}
      </ToastContainer>
    </ToastContext.Provider>
  );
}; 