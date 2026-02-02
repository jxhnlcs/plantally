import { Metadata } from 'next';
import PlantDetailsClient from './_components/PlantDetailsClient';

export const metadata: Metadata = {
    title: 'Detalhes da Planta',
};

export default function Page() {
    return <PlantDetailsClient />;
}
