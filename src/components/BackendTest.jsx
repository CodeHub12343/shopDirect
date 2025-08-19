import React, { useState } from 'react';
import styled from 'styled-components';

const TestContainer = styled.div`
  position: fixed;
  bottom: 10px;
  left: 10px;
  background: rgba(0, 0, 0, 0.9);
  color: white;
  padding: 15px;
  border-radius: 5px;
  font-size: 11px;
  z-index: 1000;
  max-width: 500px;
  max-height: 300px;
  overflow-y: auto;
`;

const TestButton = styled.button`
  background: #10b981;
  color: white;
  border: none;
  padding: 5px 10px;
  border-radius: 3px;
  margin: 3px;
  cursor: pointer;
  font-size: 10px;
`;

const BackendTest = () => {
  const [testResults, setTestResults] = useState({});

  const testBackendOrders = async () => {
    try {
      console.log('Testing backend orders directly...');
      
      // Test without authentication first
      const response = await fetch('http://127.0.0.1:5000/api/v4/orders', {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });
      
      const result = {
        status: response.status,
        ok: response.ok,
        headers: Object.fromEntries(response.headers.entries()),
        data: response.ok ? await response.json() : await response.text()
      };
      
      setTestResults(prev => ({ ...prev, backendOrders: result }));
      console.log('Backend orders test result:', result);
    } catch (error) {
      setTestResults(prev => ({ ...prev, backendOrders: { error: error.message } }));
      console.error('Backend orders test error:', error);
    }
  };

  const testBackendOrdersWithAuth = async () => {
    try {
      console.log('Testing backend orders with auth...');
      
      // Test with authentication
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
        headers: Object.fromEntries(response.headers.entries()),
        data: response.ok ? await response.json() : await response.text()
      };
      
      setTestResults(prev => ({ ...prev, backendOrdersAuth: result }));
      console.log('Backend orders with auth test result:', result);
    } catch (error) {
      setTestResults(prev => ({ ...prev, backendOrdersAuth: { error: error.message } }));
      console.error('Backend orders with auth test error:', error);
    }
  };

  const testBackendUsers = async () => {
    try {
      console.log('Testing backend users...');
      
      const response = await fetch('http://127.0.0.1:5000/api/v4/users', {
        method: 'GET',
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
      
      setTestResults(prev => ({ ...prev, backendUsers: result }));
      console.log('Backend users test result:', result);
    } catch (error) {
      setTestResults(prev => ({ ...prev, backendUsers: { error: error.message } }));
      console.error('Backend users test error:', error);
    }
  };

  const testBackendProducts = async () => {
    try {
      console.log('Testing backend products...');
      
      const response = await fetch('http://127.0.0.1:5000/api/v4/products', {
        method: 'GET',
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
      
      setTestResults(prev => ({ ...prev, backendProducts: result }));
      console.log('Backend products test result:', result);
    } catch (error) {
      setTestResults(prev => ({ ...prev, backendProducts: { error: error.message } }));
      console.error('Backend products test error:', error);
    }
  };

  return (
    <TestContainer>
      <div><strong>Backend Tests:</strong></div>
      <div>
        <TestButton onClick={testBackendOrders}>Orders (No Auth)</TestButton>
        <TestButton onClick={testBackendOrdersWithAuth}>Orders (With Auth)</TestButton>
        <TestButton onClick={testBackendUsers}>Users</TestButton>
        <TestButton onClick={testBackendProducts}>Products</TestButton>
      </div>
      
      {Object.entries(testResults).map(([key, result]) => (
        <div key={key} style={{ marginTop: '8px', borderTop: '1px solid #333', paddingTop: '5px' }}>
          <div><strong>{key}:</strong></div>
          <div>Status: {result.status || 'N/A'}</div>
          <div>OK: {result.ok ? 'Yes' : 'No'}</div>
          {result.error && <div style={{ color: '#ef4444' }}>Error: {result.error}</div>}
          {result.data && (
            <div style={{ fontSize: '9px', marginTop: '3px', color: '#10b981' }}>
              Data: {JSON.stringify(result.data).substring(0, 150)}...
            </div>
          )}
        </div>
      ))}
    </TestContainer>
  );
};

export default BackendTest;
