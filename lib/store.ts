import { create } from 'zustand';

export interface Plant {
    id: string;
    name: string;
    scientificName?: string;
    location?: string;
    waterFrequencyDays: number;
    lastWatered: string; // ISO string
    nextWatering: string;

    // Advanced details
    lightLevel?: 'Low' | 'Medium' | 'High' | 'Direct';
    humidity?: number; // percentage
    health?: number; // 0-100
    status: 'alive' | 'dead';
    datePlanted: string; // ISO string
    dateDied?: string; // ISO string
    history: { date: string; value: number }[]; // For charts (e.g. soil moisture or growth)
    image?: string; // Placeholder for now
}

interface UserState {
    isLoggedIn: boolean;
    isDemo: boolean;
    demoStartTime: number | null;
    hasPaid: boolean;
    userEmail: string | null;
    plants: Plant[];

    // Actions
    login: (email: string) => void;
    logout: () => void;
    subscribe: () => void;
    addPlant: (plant: Plant) => void;
    deletePlant: (id: string) => void;
    markPlantDead: (id: string) => void;
    waterPlant: (id: string) => void;
    generateDemoData: () => void;
}

export const useAppStore = create<UserState>((set) => ({
    isLoggedIn: false,
    isDemo: false,
    demoStartTime: null,
    hasPaid: false,
    userEmail: null,
    plants: [],

    login: (email) => set({ isLoggedIn: true, userEmail: email }),

    logout: () => set({
        isLoggedIn: false,
        isDemo: false,
        demoStartTime: null,
        userEmail: null,
        hasPaid: false,
        plants: []
    }),

    subscribe: () => set({ hasPaid: true }),

    addPlant: (plant) => set((state) => ({
        plants: [...state.plants, plant]
    })),

    deletePlant: (id) => set((state) => ({
        plants: state.plants.filter(p => p.id !== id)
    })),

    markPlantDead: (id) => set((state) => ({
        plants: state.plants.map(p =>
            p.id === id ? { ...p, status: 'dead', dateDied: new Date().toISOString(), health: 0 } : p
        )
    })),

    waterPlant: (id) => set((state) => ({
        plants: state.plants.map(p => {
            if (p.id === id) {
                const now = new Date();
                const next = new Date(now);
                next.setDate(next.getDate() + p.waterFrequencyDays);
                return {
                    ...p,
                    lastWatered: now.toISOString(),
                    nextWatering: next.toISOString(),
                    history: [...p.history, { date: now.toISOString().split('T')[0], value: 100 }]
                };
            }
            return p;
        })
    })),

    generateDemoData: () => set({
        isLoggedIn: true,
        hasPaid: true,
        isDemo: true, // Set isDemo to true for demo data
        demoStartTime: Date.now(),
        userEmail: 'demo@plantally.com',
        plants: [
            {
                id: '1',
                name: 'Monstera',
                scientificName: 'Monstera Deliciosa',
                location: 'Sala de Estar',
                status: 'alive',
                datePlanted: '2023-12-15',
                waterFrequencyDays: 7,
                lastWatered: new Date(Date.now() - 2 * 86400000).toISOString(),
                nextWatering: new Date(Date.now() + 5 * 86400000).toISOString(),
                lightLevel: 'Medium',
                humidity: 60,
                health: 92,
                history: [
                    { date: '2024-01-01', value: 40 },
                    { date: '2024-01-08', value: 85 },
                    { date: '2024-01-15', value: 60 },
                    { date: '2024-01-22', value: 90 },
                    { date: '2024-01-29', value: 50 },
                ]
            }
        ]
    })

}));
