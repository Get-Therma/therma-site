import { redirect } from 'next/navigation';

/**
 * Terms of Use page
 * Redirects to terms-of-service (canonical Terms page)
 */
export default function TermsPage() {
  redirect('/terms-of-service');
}
