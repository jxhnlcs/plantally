import { Metadata } from 'next';
import DashboardClient from './_components/DashboardClient';

export const metadata: Metadata = {
    title: 'Meu Painel',
};

export default function Page() {
    return <DashboardClient />;
}
