import { Metadata } from 'next';
import LandingPageClient from './_components/LandingPageClient';

export const metadata: Metadata = {
  title: 'Início',
};

export default function Page() {
  return <LandingPageClient />;
}
