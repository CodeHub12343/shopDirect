import React, { useState } from 'react';
import styled from 'styled-components';

const DebugContainer = styled.div`
  position: fixed;
  bottom: 10px;
  right: 10px;
  background: rgba(0, 0, 0, 0.9);
  color: white;
  padding: 15px;
  border-radius: 5px;
  font-size: 11px;
  z-index: 1000;
  max-width: 400px;
  max-height: 300px;
  overflow-y: auto;
`;

const DebugButton = styled.button`
  background: #8b5cf6;
  color: white;
  border: none;
  padding: 5px 10px;
  border-radius: 3px;
  margin: 3px;
  cursor: pointer;
  font-size: 10px;
`;

const BackendDebug = () => {
  const [debugInfo, setDebugInfo] = useState({});

  const checkBackendStatus = async () => {
    try {
      console.log('Checking backend status...');
      
      // Test if backend is running
      const response = await fetch('http://127.0.0.1:5000/api/v4/health', {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      });
      
      const result = {
        status: response.status,
        ok: response.ok,
        data: response.ok ? await response.json() : await response.text()
      };
      
      setDebugInfo(prev => ({ ...prev, health: result }));
      console.log('Health check result:', result);
    } catch (error) {
      setDebugInfo(prev => ({ ...prev, health: { error: error.message } }));
      console.error('Health check error:', error);
    }
  };

  const checkOrdersController = async () => {
    try {
      console.log('Checking orders controller...');
      
      // Test orders endpoint with detailed logging
      const response = await fetch('http://127.0.0.1:5000/api/v4/orders', {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });
      
      const result = {
        status: response.status,
        ok: response.ok,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries()),
        data: response.ok ? await response.json() : await response.text()
      };
      
      setDebugInfo(prev => ({ ...prev, ordersController: result }));
      console.log('Orders controller result:', result);
    } catch (error) {
      setDebugInfo(prev => ({ ...prev, ordersController: { error: error.message } }));
      console.error('Orders controller error:', error);
    }
  };

  const checkDatabaseConnection = async () => {
    try {
      console.log('Checking database connection...');
      
      // Test a simple endpoint that doesn't require auth
      const response = await fetch('http://127.0.0.1:5000/api/v4/products', {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });
      
      const result = {
        status: response.status,
        ok: response.ok,
        data: response.ok ? await response.json() : await response.text()
      };
      
      setDebugInfo(prev => ({ ...prev, database: result }));
      console.log('Database connection result:', result);
    } catch (error) {
      setDebugInfo(prev => ({ ...prev, database: { error: error.message } }));
      console.error('Database connection error:', error);
    }
  };

  return (
    <DebugContainer>
      <div><strong>Backend Debug:</strong></div>
      <div>
        <DebugButton onClick={checkBackendStatus}>Health Check</DebugButton>
        <DebugButton onClick={checkOrdersController}>Orders Controller</DebugButton>
        <DebugButton onClick={checkDatabaseConnection}>Database</DebugButton>
      </div>
      
      {Object.entries(debugInfo).map(([key, result]) => (
        <div key={key} style={{ marginTop: '8px', borderTop: '1px solid #333', paddingTop: '5px' }}>
          <div><strong>{key}:</strong></div>
          <div>Status: {result.status || 'N/A'}</div>
          <div>OK: {result.ok ? 'Yes' : 'No'}</div>
          {result.statusText && <div>Status Text: {result.statusText}</div>}
          {result.error && <div style={{ color: '#ef4444' }}>Error: {result.error}</div>}
          {result.data && (
            <div style={{ fontSize: '9px', marginTop: '3px', color: '#10b981' }}>
              Data: {JSON.stringify(result.data).substring(0, 100)}...
            </div>
          )}
        </div>
      ))}
    </DebugContainer>
  );
};

export default BackendDebug;

