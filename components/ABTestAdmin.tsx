'use client';

import { useState, useEffect } from 'react';
import { HEADLINE_VARIANTS, HEADLINE_AB_TEST, SUBHEADLINE_VARIANTS, SUBHEADLINE_AB_TEST } from '../lib/ab-testing';

export default function ABTestAdmin() {
  const [headlineResults, setHeadlineResults] = useState<any>(null);
  const [subheadlineResults, setSubheadlineResults] = useState<any>(null);
  const [isHeadlineActive, setIsHeadlineActive] = useState(true);
  const [isSubheadlineActive, setIsSubheadlineActive] = useState(true);

  useEffect(() => {
    // Load test results from localStorage
    const headlineResults = localStorage.getItem(`ab-test-results-${HEADLINE_AB_TEST.id}`);
    const subheadlineResults = localStorage.getItem(`ab-test-results-${SUBHEADLINE_AB_TEST.id}`);
    
    if (headlineResults) {
      setHeadlineResults(JSON.parse(headlineResults));
    }
    if (subheadlineResults) {
      setSubheadlineResults(JSON.parse(subheadlineResults));
    }
  }, []);

  const clearTestData = (testId: string) => {
    localStorage.removeItem(`ab-test-${testId}`);
    localStorage.removeItem(`ab-test-results-${testId}`);
    
    if (testId === HEADLINE_AB_TEST.id) {
      setHeadlineResults(null);
    } else {
      setSubheadlineResults(null);
    }
    
    alert('Test data cleared! Refresh the page to see changes.');
  };

  const exportResults = () => {
    const data = {
      headlineTest: {
        testId: HEADLINE_AB_TEST.id,
        testName: HEADLINE_AB_TEST.name,
        variants: HEADLINE_VARIANTS,
        results: headlineResults,
      },
      subheadlineTest: {
        testId: SUBHEADLINE_AB_TEST.id,
        testName: SUBHEADLINE_AB_TEST.name,
        variants: SUBHEADLINE_VARIANTS,
        results: subheadlineResults,
      },
      exportedAt: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ab-test-results-complete.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const TestSection = ({ 
    test, 
    variants, 
    results, 
    isActive, 
    setIsActive, 
    testId 
  }: {
    test: any;
    variants: any[];
    results: any;
    isActive: boolean;
    setIsActive: (active: boolean) => void;
    testId: string;
  }) => (
    <div style={{ marginBottom: '3rem' }}>
      <h2>{test.name}</h2>
      <p>Status: <span style={{ color: isActive ? 'green' : 'red' }}>
        {isActive ? 'Active' : 'Inactive'}
      </span></p>
      
      <button 
        onClick={() => setIsActive(!isActive)}
        style={{
          padding: '0.5rem 1rem',
          backgroundColor: isActive ? '#dc3545' : '#28a745',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          marginRight: '1rem'
        }}
      >
        {isActive ? 'Deactivate Test' : 'Activate Test'}
      </button>

      <button 
        onClick={() => clearTestData(testId)}
        style={{
          padding: '0.5rem 1rem',
          backgroundColor: '#dc3545',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        Clear Test Data
      </button>

      <div style={{ marginTop: '1rem' }}>
        <h3>Test Variants</h3>
        <div style={{ display: 'grid', gap: '1rem' }}>
          {variants.map((variant) => (
            <div key={variant.id} style={{ 
              padding: '1rem', 
              border: '1px solid #ddd', 
              borderRadius: '4px',
              backgroundColor: '#f9f9f9'
            }}>
              <strong>{variant.id}</strong>
              <p>{variant.text}</p>
              <small>Weight: {variant.weight || 1}</small>
            </div>
          ))}
        </div>
      </div>

      {results && (
        <div style={{ marginTop: '1rem' }}>
          <h3>Test Results</h3>
          <div style={{ display: 'grid', gap: '1rem' }}>
            {Object.entries(results).map(([variantId, resultData]: [string, any]) => (
              <div key={variantId} style={{ 
                padding: '1rem', 
                border: '1px solid #ddd', 
                borderRadius: '4px',
                backgroundColor: '#f0f8ff'
              }}>
                <h4>{variantId}</h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '0.5rem' }}>
                  {Object.entries(resultData).map(([action, count]: [string, any]) => (
                    <div key={action}>
                      <strong>{action}:</strong> {count}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div style={{ 
      padding: '2rem', 
      maxWidth: '1000px', 
      margin: '0 auto',
      fontFamily: 'system-ui, sans-serif'
    }}>
      <h1>A/B Test Admin Panel</h1>
      
      <TestSection
        test={HEADLINE_AB_TEST}
        variants={HEADLINE_VARIANTS}
        results={headlineResults}
        isActive={isHeadlineActive}
        setIsActive={setIsHeadlineActive}
        testId={HEADLINE_AB_TEST.id}
      />

      <TestSection
        test={SUBHEADLINE_AB_TEST}
        variants={SUBHEADLINE_VARIANTS}
        results={subheadlineResults}
        isActive={isSubheadlineActive}
        setIsActive={setIsSubheadlineActive}
        testId={SUBHEADLINE_AB_TEST.id}
      />

      <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
        <button 
          onClick={exportResults}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Export All Results
        </button>
      </div>

      <div style={{ marginTop: '2rem', padding: '1rem', backgroundColor: '#f8f9fa', borderRadius: '4px' }}>
        <h4>Instructions</h4>
        <ul>
          <li>Deactivate tests to stop showing variants</li>
          <li>Clear test data to reset all assignments and results</li>
          <li>Export results to analyze performance</li>
          <li>Results are stored in localStorage (client-side only)</li>
          <li>Both headline and subheadline tests run independently</li>
        </ul>
      </div>
    </div>
  );
}
