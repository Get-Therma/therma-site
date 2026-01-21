'use client';

import { useState, useEffect, useMemo } from 'react';

interface LinkPreviewData {
  url: string;
  title?: string;
  description?: string;
  image?: string;
  siteName?: string;
  favicon?: string;
}

interface LinkPreviewProps {
  url: string;
  className?: string;
}

// Function to extract URLs from text
export function extractUrls(text: string): string[] {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  return text.match(urlRegex) || [];
}

// Function to fetch link metadata
async function fetchLinkMetadata(url: string): Promise<LinkPreviewData | null> {
  try {
    // Use a link preview service or implement your own
    // For now, we'll use a simple approach with Open Graph tags
    const response = await fetch(`/api/link-preview?url=${encodeURIComponent(url)}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch metadata');
    }
    
    const data = await response.json();
    return {
      url,
      title: data.title,
      description: data.description,
      image: data.image,
      siteName: data.siteName,
      favicon: data.favicon
    };
  } catch (error) {
    console.error('Error fetching link metadata:', error);
    return null;
  }
}

// Link Preview Component
export function LinkPreview({ url, className = '' }: LinkPreviewProps) {
  const [previewData, setPreviewData] = useState<LinkPreviewData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  const [displayHost, displayUrl] = useMemo(() => {
    try {
      const parsed = new URL(url);
      const pathname = parsed.pathname && parsed.pathname !== '/' ? parsed.pathname : '';
      const cleanUrl = `${parsed.hostname}${pathname}`;
      return [parsed.hostname, cleanUrl];
    } catch {
      return [url, url];
    }
  }, [url]);

  useEffect(() => {
    const loadPreview = async () => {
      setIsLoading(true);
      setError(false);
      
      try {
        const data = await fetchLinkMetadata(url);
        if (data) {
          setPreviewData(data);
        } else {
          setError(true);
        }
      } catch (err) {
        setError(true);
      } finally {
        setIsLoading(false);
      }
    };

    loadPreview();
  }, [url]);

  if (isLoading) {
    return (
      <div className={`link-preview link-preview--loading ${className}`}>
        <div className="link-preview__skeleton">
          <div className="link-preview__skeleton-image"></div>
          <div className="link-preview__skeleton-content">
            <div className="link-preview__skeleton-title"></div>
            <div className="link-preview__skeleton-description"></div>
            <div className="link-preview__skeleton-url"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !previewData) {
    return (
      <div className={`link-preview link-preview--error ${className}`}>
        <a 
          href={url} 
          target="_blank" 
          rel="noopener noreferrer"
          className="link-preview__fallback"
        >
          <span className="link-preview__icon">🔗</span>
          <span className="link-preview__url">{url}</span>
        </a>
      </div>
    );
  }

  const displayTitle = previewData.title || previewData.siteName || displayHost || 'Link';
  const displaySite = previewData.siteName || displayHost;
  const displayDescription = previewData.description && previewData.description !== displayTitle ? previewData.description : '';

  return (
    <div className={`link-preview ${className}`}>
      <a 
        href={url} 
        target="_blank" 
        rel="noopener noreferrer"
        className="link-preview__content"
      >
        {previewData.image && (
          <div className="link-preview__image">
            <img 
              src={previewData.image} 
              alt={previewData.title || 'Link preview'}
              loading="lazy"
              onError={(e) => {
                // Hide image if it fails to load
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
          </div>
        )}
        
        <div className="link-preview__text">
          <div className="link-preview__header">
            {previewData.favicon && (
              <img 
                src={previewData.favicon} 
                alt="" 
                className="link-preview__favicon"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            )}
            <span className="link-preview__site">{displaySite}</span>
          </div>
          
          <h4 className="link-preview__title">
            {displayTitle}
          </h4>
          
          {displayDescription && (
            <p className="link-preview__description">
              {displayDescription}
            </p>
          )}
          
          <div className="link-preview__url">
            {displayUrl}
          </div>
        </div>
      </a>
    </div>
  );
}

// Message Component with Link Previews
interface MessageWithLinksProps {
  text: string;
  className?: string;
}

export function MessageWithLinks({ text, className = '' }: MessageWithLinksProps) {
  const urls = extractUrls(text);
  
  if (urls.length === 0) {
    return <span className={className}>{text}</span>;
  }

  // Split text by URLs and render with previews
  const parts = text.split(/(https?:\/\/[^\s]+)/g);
  
  return (
    <div className={className}>
      {parts.map((part, index) => {
        if (urls.includes(part)) {
          return <LinkPreview key={index} url={part} />;
        }
        return <span key={index}>{part}</span>;
      })}
    </div>
  );
}
