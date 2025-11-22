import ThermaWeeklyHero from '../components/ThermaWeeklyHero';
import SiteHeader from '../components/site/SiteHeader';
import SiteFooter from '../components/site/SiteFooter';

export default function HomePage() {
  return (
    <>
      <SiteHeader />
      <main style={{ minHeight: '100vh', width: '100%', backgroundColor: '#05070A', paddingTop: '140px' }}>
        <ThermaWeeklyHero />
      </main>
      <SiteFooter />
    </>
  );
}