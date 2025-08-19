import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import styled from 'styled-components';

const DebugContainer = styled.div`
  position: fixed;
  top: 10px;
  right: 10px;
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 10px;
  border-radius: 5px;
  font-size: 12px;
  z-index: 1000;
  max-width: 300px;
`;

const AuthDebug = () => {
  const { isAuthenticated, user, isLoading } = useAuth();

  return (
    <DebugContainer>
      <div><strong>Auth Debug:</strong></div>
      <div>Loading: {isLoading ? 'Yes' : 'No'}</div>
      <div>Authenticated: {isAuthenticated ? 'Yes' : 'No'}</div>
      <div>User: {user ? user.name || user.email : 'None'}</div>
      <div>Cookies: {document.cookie ? 'Present' : 'None'}</div>
    </DebugContainer>
  );
};

export default AuthDebug; 