'use client';

import { useState } from 'react';

export default function TestDuplicatePage() {
  const [email, setEmail] = useState('');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const testDuplicate = async () => {
    if (!email) return;
    
    setLoading(true);
    setResult(null);

    try {
      console.log('🧪 Testing duplicate detection for:', email);
      
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, source: 'Test Page' })
      });

      const data = await response.json();
      
      setResult({
        status: response.status,
        data,
        isDuplicate: response.status === 409 && data.duplicate,
        timestamp: new Date().toISOString()
      });

      console.log('📊 Test Results:', {
        status: response.status,
        duplicate: data.duplicate,
        message: data.message || data.error
      });
    } catch (error: any) {
      setResult({
        error: error.message,
        timestamp: new Date().toISOString()
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <h1>Duplicate Detection Test</h1>
      <p>Enter an email to test duplicate detection:</p>
      
      <div style={{ marginBottom: '1rem' }}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="test@example.com"
          style={{ padding: '0.5rem', width: '300px', marginRight: '1rem' }}
        />
        <button 
          onClick={testDuplicate} 
          disabled={loading || !email}
          style={{ padding: '0.5rem 1rem' }}
        >
          {loading ? 'Testing...' : 'Test'}
        </button>
      </div>

      {result && (
        <div style={{ 
          padding: '1rem', 
          backgroundColor: '#f5f5f5', 
          borderRadius: '8px',
          marginTop: '1rem'
        }}>
          <h2>Results:</h2>
          <pre style={{ 
            backgroundColor: '#fff', 
            padding: '1rem', 
            borderRadius: '4px',
            overflow: 'auto'
          }}>
            {JSON.stringify(result, null, 2)}
          </pre>
          
          {result.isDuplicate ? (
            <div style={{ 
              color: '#f59e0b', 
              marginTop: '1rem',
              padding: '1rem',
              backgroundColor: '#fef3c7',
              borderRadius: '4px'
            }}>
              ✅ Duplicate detected! Status: {result.status}
            </div>
          ) : result.status === 200 ? (
            <div style={{ 
              color: '#10b981', 
              marginTop: '1rem',
              padding: '1rem',
              backgroundColor: '#d1fae5',
              borderRadius: '4px'
            }}>
              ✅ New email accepted! Status: {result.status}
            </div>
          ) : (
            <div style={{ 
              color: '#ef4444', 
              marginTop: '1rem',
              padding: '1rem',
              backgroundColor: '#fee2e2',
              borderRadius: '4px'
            }}>
              ❌ Unexpected response: Status {result.status}
            </div>
          )}
        </div>
      )}

      <div style={{ marginTop: '2rem', padding: '1rem', backgroundColor: '#e0f2fe', borderRadius: '8px' }}>
        <h3>How to test:</h3>
        <ol>
          <li>Enter an email and click "Test" - should return 200 (new email)</li>
          <li>Enter the SAME email again and click "Test" - should return 409 (duplicate)</li>
          <li>Check the browser console (F12) for detailed logs</li>
        </ol>
      </div>
    </div>
  );
}

