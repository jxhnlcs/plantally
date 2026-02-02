"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Droplets, Calendar, Leaf, LogOut, Trash2, Skull } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { useAppStore, Plant } from '@/lib/store';
import { DemoTimer } from '@/components/DemoTimer';

export default function DashboardClient() {
    const router = useRouter();
    const { isLoggedIn, isDemo, hasPaid, plants, addPlant, waterPlant, deletePlant, markPlantDead, logout, userEmail } = useAppStore();
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [newPlantName, setNewPlantName] = useState('');
    const [newPlantDays, setNewPlantDays] = useState('');
    const [confirmDialog, setConfirmDialog] = useState<{
        isOpen: boolean;
        title: string;
        message: string;
        onConfirm: () => void;
        variant?: 'danger' | 'warning';
    }>({
        isOpen: false,
        title: '',
        message: '',
        onConfirm: () => { },
    });

    useEffect(() => {
        // Protected Route Logic
        if (!isLoggedIn) {
            router.push('/');
            return;
        }

        // Demo Timer: 1 Minute
        if (isDemo) {
            // We rely on the DemoTimer display for visual, but we enforce here too
            // However, with persistence, we should check Date.now() vs start time
            // For simplicity in this step, let's keep the timeout but maybe it's better to just relying on the visual timer?
            // Actually, let's make it robust:
            const persistenceCheck = setInterval(() => {
                const { demoStartTime } = useAppStore.getState();
                if (demoStartTime && Date.now() - demoStartTime > 60000) {
                    logout();
                    router.push('/');
                    setConfirmDialog({
                        isOpen: true,
                        title: 'Demo Expirada',
                        message: 'O tempo da demo acabou! (Limite de 1 minuto)',
                        onConfirm: () => { },
                        variant: 'warning'
                    });
                    clearInterval(persistenceCheck);
                }
            }, 1000);
            return () => clearInterval(persistenceCheck);
        }
    }, [isLoggedIn, isDemo, router, logout]);

    const handleAddPlant = (e: React.FormEvent) => {
        e.preventDefault();

        if (isDemo && plants.length >= 2) {
            setConfirmDialog({
                isOpen: true,
                title: 'Limite Atingido',
                message: 'No modo Demo, você só pode ter 2 plantas.',
                onConfirm: () => { },
                variant: 'warning'
            });
            setIsAddModalOpen(false);
            return;
        }

        const plant: Plant = {
            id: Math.random().toString(36).substr(2, 9),
            name: newPlantName,
            waterFrequencyDays: parseInt(newPlantDays) || 7,
            lastWatered: new Date().toISOString(),
            nextWatering: new Date(Date.now() + (parseInt(newPlantDays) || 7) * 86400000).toISOString(),
            history: [],
            health: 100,
            status: 'alive',
            datePlanted: new Date().toISOString(),
            lightLevel: 'Medium',
            humidity: 50
        };
        addPlant(plant);
        setNewPlantName('');
        setNewPlantDays('');
        setIsAddModalOpen(false);
    };

    if (!isLoggedIn) return null; // Avoid flash of content

    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
            {/* Dashboard Nav */}
            <DemoTimer />
            <nav className="bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center gap-2">
                            <div className="bg-emerald-100 p-2 rounded-lg">
                                <Leaf className="h-5 w-5 text-emerald-600" />
                            </div>
                            <span className="font-bold text-lg text-emerald-900">PlantAlly</span>
                        </div>
                        <div className="flex items-center gap-4">
                            <span className="text-sm text-slate-500 hidden sm:inline-block">{userEmail}</span>
                            <Button variant="ghost" size="sm" onClick={() => { logout(); router.push('/'); }}>
                                <LogOut className="h-4 w-4 mr-2" />
                                Sair
                            </Button>
                        </div>
                    </div>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">Minha Selva</h1>
                        <p className="text-slate-500">Gerencie suas plantas e horários de rega.</p>
                    </div>
                    <Button onClick={() => setIsAddModalOpen(true)}>
                        <Plus className="h-4 w-4 mr-2" />
                        Adicionar Nova Planta
                    </Button>
                </div>

                {plants.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-300">
                        <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Leaf className="h-8 w-8 text-emerald-400" />
                        </div>
                        <h3 className="text-lg font-medium text-slate-900">Nenhuma planta ainda</h3>
                        <p className="text-slate-500 max-w-sm mx-auto mt-2 mb-6">
                            Comece adicionando sua primeira planta para rastrear seu horário de rega.
                        </p>
                        <Button onClick={() => setIsAddModalOpen(true)}>
                            Adicionar Planta
                        </Button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {plants.map((plant) => {
                            const nextWatering = new Date(plant.nextWatering);
                            const isOverdue = new Date() > nextWatering;
                            const daysUntil = Math.ceil((nextWatering.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
                            const isDead = plant.status === 'dead';

                            return (
                                <div
                                    key={plant.id}
                                    onClick={() => router.push(`/dashboard/plant/${plant.id}`)}
                                    className={`bg-white rounded-2xl p-6 shadow-sm border ${isDead ? 'border-gray-200 opacity-75 grayscale' : 'border-gray-100'} hover:shadow-md transition-all cursor-pointer group active:scale-[0.98] relative overflow-hidden`}
                                >
                                    {isDead && (
                                        <div className="absolute top-0 right-0 bg-slate-100 text-slate-500 text-xs font-bold px-2 py-1 rounded-bl-lg z-10">
                                            FALECIDA 🥀
                                        </div>
                                    )}
                                    <div className="flex justify-between items-start mb-4">
                                        <div className={`p-3 rounded-xl transition-colors ${isDead ? 'bg-slate-100' : 'bg-emerald-50 group-hover:bg-emerald-100'}`}>
                                            <Leaf className={`h-6 w-6 ${isDead ? 'text-slate-400' : 'text-emerald-600'}`} />
                                        </div>
                                        {!isDead && (
                                            isOverdue ? (
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                                    Com sede
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                    Feliz
                                                </span>
                                            )
                                        )}
                                    </div>
                                    <h3 className={`text-lg font-bold mb-1 ${isDead ? 'text-slate-500 line-through' : 'text-slate-900 group-hover:text-emerald-700'} transition-colors`}>{plant.name}</h3>
                                    <div className="flex items-center text-sm text-slate-500 mb-6">
                                        <Calendar className="h-4 w-4 mr-1 pb-0.5" />
                                        {isDead ? (
                                            <span>Viveu por {Math.ceil((new Date(plant.dateDied!).getTime() - new Date(plant.datePlanted || new Date()).getTime()) / (1000 * 60 * 60 * 24))} dias</span>
                                        ) : (
                                            <span>A cada {plant.waterFrequencyDays} dias</span>
                                        )}
                                    </div>

                                    <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-50">
                                        {isDead ? (
                                            <div className="w-full flex justify-between">
                                                <p className="text-sm text-slate-400 italic">Descanse em paz.</p>
                                                <Button
                                                    size="sm"
                                                    variant="ghost"
                                                    className="text-red-400 hover:text-red-500 hover:bg-red-50"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setConfirmDialog({
                                                            isOpen: true,
                                                            title: 'Remover Planta',
                                                            message: 'Tem certeza que deseja remover esta planta do histórico? Esta ação não pode ser desfeita.',
                                                            onConfirm: () => deletePlant(plant.id),
                                                            variant: 'danger'
                                                        });
                                                    }}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        ) : (
                                            <>
                                                <div className="flex gap-2">
                                                    <Button
                                                        size="sm"
                                                        variant="ghost"
                                                        className="text-slate-500 hover:text-slate-700 hover:bg-slate-50 flex items-center gap-1.5 px-3"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setConfirmDialog({
                                                                isOpen: true,
                                                                title: 'Marcar como Morta',
                                                                message: `Tem certeza que deseja marcar "${plant.name}" como morta? Esta ação não pode ser desfeita.`,
                                                                onConfirm: () => markPlantDead(plant.id),
                                                                variant: 'danger'
                                                            });
                                                        }}
                                                    >
                                                        <Skull className="h-4 w-4" />
                                                        <span className="text-xs">Morreu</span>
                                                    </Button>
                                                </div>
                                                <Button
                                                    size="sm"
                                                    variant={isOverdue ? "primary" : "secondary"}
                                                    onClick={(e) => {
                                                        e.stopPropagation(); // Prevent card click
                                                        waterPlant(plant.id);
                                                    }}
                                                >
                                                    <Droplets className="h-4 w-4 mr-1.5" />
                                                    Regar
                                                </Button>
                                            </>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </main>

            <Modal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                title="Adicionar Nova Planta"
            >
                <form onSubmit={handleAddPlant} className="space-y-4">
                    <Input
                        label="Nome da Planta"
                        placeholder="ex. Monstera Deliciosa"
                        value={newPlantName}
                        onChange={(e) => setNewPlantName(e.target.value)}
                        required
                        autoFocus
                    />
                    <Input
                        label="Regar a cada (dias)"
                        type="number"
                        min="1"
                        placeholder="7"
                        value={newPlantDays}
                        onChange={(e) => setNewPlantDays(e.target.value)}
                        required
                    />
                    <Button type="submit" fullWidth className="mt-4">
                        Adicionar Planta
                    </Button>
                </form>
            </Modal>

            <ConfirmDialog
                isOpen={confirmDialog.isOpen}
                onClose={() => setConfirmDialog({ ...confirmDialog, isOpen: false })}
                onConfirm={confirmDialog.onConfirm}
                title={confirmDialog.title}
                message={confirmDialog.message}
                variant={confirmDialog.variant}
            />
        </div>
    );
}
