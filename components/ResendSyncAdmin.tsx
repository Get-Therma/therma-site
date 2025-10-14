'use client';

import { useState } from 'react';

interface SyncResult {
  message: string;
  totalEmailsConsidered: number;
  successfullySynced: number;
  failedToSync: number;
  failedEmails: { email: string; error: string }[];
}

interface SpecificEmailResult {
  success: boolean;
  message: string;
  alreadySynced?: boolean;
  data?: any;
  error?: string;
}

export default function ResendSyncAdmin() {
  const [isLoading, setIsLoading] = useState(false);
  const [syncResult, setSyncResult] = useState<SyncResult | null>(null);
  const [specificEmailResult, setSpecificEmailResult] = useState<SpecificEmailResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [specificEmail, setSpecificEmail] = useState('');

  const handleBulkSync = async () => {
    setIsLoading(true);
    setSyncResult(null);
    setError(null);

    try {
      const response = await fetch('/api/resend-sync', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'sync-resend-to-beehiv'
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to perform Resend to Beehiiv sync');
      }

      const data: SyncResult = await response.json();
      setSyncResult(data);
    } catch (err) {
      console.error('Resend sync error:', err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSpecificEmailSync = async () => {
    if (!specificEmail.trim()) {
      setError('Please enter an email address');
      return;
    }

    setIsLoading(true);
    setSpecificEmailResult(null);
    setError(null);

    try {
      const response = await fetch('/api/resend-sync', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'sync-specific-email',
          email: specificEmail.trim()
        }),
      });

      const data: SpecificEmailResult = await response.json();
      setSpecificEmailResult(data);
    } catch (err) {
      console.error('Specific email sync error:', err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-4">Resend to Beehiiv Sync</h2>
      <p className="text-gray-400 mb-6">
        This tool syncs emails that were successfully sent via Resend but missed Beehiiv. 
        It will attempt to subscribe any emails that have emailSuccess: true but beehiivSuccess: false in the database.
      </p>

      {/* Bulk Sync Section */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-4">Bulk Sync</h3>
        <button
          onClick={handleBulkSync}
          disabled={isLoading}
          className="px-6 py-3 bg-green-600 hover:bg-green-700 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Syncing...' : 'Sync All Resend Emails to Beehiiv'}
        </button>

        {isLoading && (
          <p className="mt-4 text-green-400">Sync in progress. This might take a while for many emails...</p>
        )}

        {syncResult && (
          <div className="mt-6 p-4 bg-green-900/30 border border-green-700 rounded-lg text-green-300">
            <h4 className="font-semibold">Sync Results:</h4>
            <p>{syncResult.message}</p>
            <p>Total emails considered: {syncResult.totalEmailsConsidered}</p>
            <p>Successfully synced: {syncResult.successfullySynced}</p>
            <p>Failed to sync: {syncResult.failedToSync}</p>
            {syncResult.failedEmails.length > 0 && (
              <div className="mt-4">
                <p className="font-medium">Details for failed emails:</p>
                <ul className="list-disc list-inside">
                  {syncResult.failedEmails.map((item, index) => (
                    <li key={index}>{item.email}: {item.error}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Specific Email Sync Section */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-4">Sync Specific Email</h3>
        <div className="flex gap-4 mb-4">
          <input
            type="email"
            value={specificEmail}
            onChange={(e) => setSpecificEmail(e.target.value)}
            placeholder="Enter email address to sync"
            className="flex-1 px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400"
          />
          <button
            onClick={handleSpecificEmailSync}
            disabled={isLoading || !specificEmail.trim()}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Syncing...' : 'Sync Email'}
          </button>
        </div>

        {specificEmailResult && (
          <div className={`p-4 rounded-lg border ${
            specificEmailResult.success 
              ? 'bg-green-900/30 border-green-700 text-green-300'
              : 'bg-red-900/30 border-red-700 text-red-300'
          }`}>
            <h4 className="font-semibold">Sync Result:</h4>
            <p>{specificEmailResult.message}</p>
            {specificEmailResult.alreadySynced && (
              <p className="text-yellow-300">This email was already synced to Beehiiv.</p>
            )}
            {specificEmailResult.error && (
              <p className="text-red-300">Error: {specificEmailResult.error}</p>
            )}
          </div>
        )}
      </div>

      {/* Error Display */}
      {error && (
        <div className="mt-6 p-4 bg-red-900/30 border border-red-700 rounded-lg text-red-300">
          <h3 className="font-semibold">Error:</h3>
          <p>{error}</p>
        </div>
      )}

      {/* Instructions */}
      <div className="mt-8 p-4 bg-blue-900/30 border border-blue-700 rounded-lg text-blue-300">
        <h4 className="font-semibold mb-2">How it works:</h4>
        <ul className="list-disc list-inside space-y-1 text-sm">
          <li>Finds emails with emailSuccess: true but beehiivSuccess: false</li>
          <li>Attempts to subscribe them to Beehiiv with retry logic</li>
          <li>Updates the database attribution to reflect sync status</li>
          <li>Handles Beehiiv "already exists" responses as success</li>
          <li>Provides detailed reporting of sync results</li>
        </ul>
      </div>
    </div>
  );
}
