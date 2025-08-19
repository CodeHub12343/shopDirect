import React, { useState } from 'react';
import styled from 'styled-components';

const TestContainer = styled.div`
  position: fixed;
  top: 10px;
  left: 10px;
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 15px;
  border-radius: 5px;
  font-size: 12px;
  z-index: 1000;
  max-width: 400px;
`;

const TestButton = styled.button`
  background: #3b82f6;
  color: white;
  border: none;
  padding: 5px 10px;
  border-radius: 3px;
  margin: 5px;
  cursor: pointer;
  font-size: 11px;
`;

const Input = styled.input`
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: white;
  padding: 5px;
  border-radius: 3px;
  font-size: 11px;
  margin: 5px;
  width: 120px;
  
  &::placeholder {
    color: rgba(255, 255, 255, 0.6);
  }
`;

const AuthTest = () => {
  const [testResults, setTestResults] = useState({});
  const [email, setEmail] = useState('admin@example.com');
  const [password, setPassword] = useState('password123');

  const testAuth = async () => {
    try {
      console.log('Testing authentication...');
      const response = await fetch('http://127.0.0.1:5000/api/v4/users/me', {
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
      
      setTestResults(prev => ({ ...prev, auth: result }));
      console.log('Auth test result:', result);
    } catch (error) {
      setTestResults(prev => ({ ...prev, auth: { error: error.message } }));
      console.error('Auth test error:', error);
    }
  };

  const testLogin = async () => {
    try {
      console.log('Testing login with:', { email, password });
      const response = await fetch('http://127.0.0.1:5000/api/v4/users/login', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          password: password
        })
      });
      
      const result = {
        status: response.status,
        ok: response.ok,
        data: response.ok ? await response.json() : await response.text()
      };
      
      setTestResults(prev => ({ ...prev, login: result }));
      console.log('Login test result:', result);
      
      // If login successful, test auth immediately
      if (response.ok) {
        setTimeout(testAuth, 1000);
      }
    } catch (error) {
      setTestResults(prev => ({ ...prev, login: { error: error.message } }));
      console.error('Login test error:', error);
    }
  };

  const testOrders = async () => {
    try {
      console.log('Testing orders...');
      const response = await fetch('http://127.0.0.1:5000/api/v4/orders', {
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
      
      setTestResults(prev => ({ ...prev, orders: result }));
      console.log('Orders test result:', result);
    } catch (error) {
      setTestResults(prev => ({ ...prev, orders: { error: error.message } }));
      console.error('Orders test error:', error);
    }
  };

  const testProducts = async () => {
    try {
      console.log('Testing products...');
      const response = await fetch('http://127.0.0.1:5000/api/v4/products', {
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
      
      setTestResults(prev => ({ ...prev, products: result }));
      console.log('Products test result:', result);
    } catch (error) {
      setTestResults(prev => ({ ...prev, products: { error: error.message } }));
      console.error('Products test error:', error);
    }
  };

  return (
    <TestContainer>
      <div><strong>API Tests:</strong></div>
      <div style={{ marginBottom: '10px' }}>
        <Input 
          type="email" 
          placeholder="Email" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)}
        />
        <Input 
          type="password" 
          placeholder="Password" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <div>
        <TestButton onClick={testLogin}>Test Login</TestButton>
        <TestButton onClick={testAuth}>Test Auth</TestButton>
        <TestButton onClick={testOrders}>Test Orders</TestButton>
        <TestButton onClick={testProducts}>Test Products</TestButton>
      </div>
      
      {Object.entries(testResults).map(([key, result]) => (
        <div key={key} style={{ marginTop: '10px' }}>
          <div><strong>{key}:</strong></div>
          <div>Status: {result.status || 'N/A'}</div>
          <div>OK: {result.ok ? 'Yes' : 'No'}</div>
          {result.error && <div style={{ color: '#ef4444' }}>Error: {result.error}</div>}
          {result.data && (
            <div style={{ fontSize: '10px', marginTop: '5px' }}>
              Data: {JSON.stringify(result.data).substring(0, 100)}...
            </div>
          )}
        </div>
      ))}
    </TestContainer>
  );
};

export default AuthTest; 