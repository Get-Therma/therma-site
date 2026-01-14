import { redirect } from 'next/navigation';

/**
 * Terms of Use page
 * Redirects to beta-terms (canonical Terms page)
 * This ensures all /terms links work correctly
 */
export default function TermsPage() {
  redirect('/beta-terms');
}
