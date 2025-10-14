'use client';

import { useState } from 'react';

export default function BulkSyncAdmin() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [batchSize, setBatchSize] = useState(10);
  const [dryRun, setDryRun] = useState(true);

  const handleSync = async (action: string) => {
    setIsLoading(true);
    setResult(null);
    
    try {
      const response = await fetch('/api/bulk-sync', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action,
          batchSize,
          dryRun
        })
      });

      const data = await response.json();
      setResult(data);
    } catch (error) {
      setResult({ error: 'Request failed', details: error });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ 
      padding: '40px', 
      maxWidth: '800px', 
      margin: '0 auto',
      fontFamily: 'system-ui, sans-serif'
    }}>
      <h1 style={{ fontSize: '32px', marginBottom: '32px', color: '#1f2937' }}>
        Bulk Sync Admin
      </h1>
      
      <div style={{ 
        backgroundColor: '#f9fafb', 
        padding: '24px', 
        borderRadius: '12px',
        marginBottom: '32px'
      }}>
        <h2 style={{ fontSize: '20px', marginBottom: '16px', color: '#374151' }}>
          Sync Settings
        </h2>
        
        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
            Batch Size:
          </label>
          <input
            type="number"
            value={batchSize}
            onChange={(e) => setBatchSize(parseInt(e.target.value) || 10)}
            style={{
              padding: '8px 12px',
              border: '1px solid #d1d5db',
              borderRadius: '6px',
              width: '100px'
            }}
            min="1"
            max="50"
          />
        </div>
        
        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <input
              type="checkbox"
              checked={dryRun}
              onChange={(e) => setDryRun(e.target.checked)}
            />
            Dry Run (test mode - no actual syncing)
          </label>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '16px', marginBottom: '32px' }}>
        <button
          onClick={() => handleSync('check-beehiv-status')}
          disabled={isLoading}
          style={{
            padding: '12px 24px',
            backgroundColor: '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: isLoading ? 'not-allowed' : 'pointer',
            opacity: isLoading ? 0.6 : 1
          }}
        >
          {isLoading ? 'Checking...' : 'Check Beehiv Status'}
        </button>
        
        <button
          onClick={() => handleSync('get-sync-stats')}
          disabled={isLoading}
          style={{
            padding: '12px 24px',
            backgroundColor: '#10b981',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: isLoading ? 'not-allowed' : 'pointer',
            opacity: isLoading ? 0.6 : 1
          }}
        >
          {isLoading ? 'Loading...' : 'Get Stats'}
        </button>
        
        <button
          onClick={() => handleSync('sync-all-to-beehiv')}
          disabled={isLoading}
          style={{
            padding: '12px 24px',
            backgroundColor: dryRun ? '#f59e0b' : '#dc2626',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: isLoading ? 'not-allowed' : 'pointer',
            opacity: isLoading ? 0.6 : 1
          }}
        >
          {isLoading ? 'Syncing...' : dryRun ? 'Test Sync' : 'Sync All to Beehiv'}
        </button>
      </div>

      {result && (
        <div style={{ 
          backgroundColor: result.error ? '#fef2f2' : '#f0fdf4',
          border: `1px solid ${result.error ? '#fecaca' : '#bbf7d0'}`,
          padding: '24px',
          borderRadius: '12px'
        }}>
          <h3 style={{ 
            fontSize: '18px', 
            marginBottom: '16px',
            color: result.error ? '#dc2626' : '#059669'
          }}>
            {result.error ? 'Error' : 'Result'}
          </h3>
          
          <pre style={{ 
            backgroundColor: '#1f2937',
            color: '#f9fafb',
            padding: '16px',
            borderRadius: '8px',
            overflow: 'auto',
            fontSize: '14px',
            lineHeight: '1.5'
          }}>
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}
      
      <div style={{ 
        marginTop: '32px',
        padding: '16px',
        backgroundColor: '#f3f4f6',
        borderRadius: '8px',
        fontSize: '14px',
        color: '#6b7280'
      }}>
        <h4 style={{ marginBottom: '8px', color: '#374151' }}>Instructions:</h4>
        <ol style={{ paddingLeft: '20px', lineHeight: '1.6' }}>
          <li><strong>Check Beehiv Status:</strong> Verify API connectivity and publication details</li>
          <li><strong>Get Stats:</strong> See how many emails are in the database</li>
          <li><strong>Test Sync:</strong> Run a dry run to see what would be synced (recommended first)</li>
          <li><strong>Sync All:</strong> Actually sync all emails to Beehiv (disable dry run first)</li>
        </ol>
        
        <p style={{ marginTop: '16px', fontWeight: '500' }}>
          ⚠️ <strong>Important:</strong> Always test with dry run first to avoid duplicate subscriptions!
        </p>
      </div>
    </div>
  );
}
