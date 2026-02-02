"use client";

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import {
    ArrowLeft, Droplets, Sun, Wind, Thermometer,
    Leaf, Info, History, Calendar
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useAppStore, Plant } from '@/lib/store';
import { DemoTimer } from '@/components/DemoTimer';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area
} from 'recharts';

export default function PlantDetailsClient() {
    const router = useRouter();
    const params = useParams();
    const { isLoggedIn, isDemo, plants, waterPlant, logout } = useAppStore();
    const [plant, setPlant] = useState<Plant | null>(null);

    useEffect(() => {
        if (!isLoggedIn) {
            router.push('/');
            return;
        }
        const foundPlant = plants.find(p => p.id === params.id);
        if (foundPlant) {
            setPlant(foundPlant);
            document.title = `${foundPlant.name} | PlantAlly`;
        } else {
            router.push('/dashboard');
        }

        // Demo Timer: 1 Minute
        if (isDemo) {
            const persistenceCheck = setInterval(() => {
                const { demoStartTime } = useAppStore.getState();
                if (demoStartTime && Date.now() - demoStartTime > 60000) {
                    logout();
                    router.push('/');
                    alert('O tempo da demo acabou! (Limite de 1 minuto)');
                    clearInterval(persistenceCheck);
                }
            }, 1000);
            return () => clearInterval(persistenceCheck);
        }
    }, [isLoggedIn, isDemo, plants, params.id, router, logout]);

    if (!plant) return null;

    const getLightIcon = (level: string) => {
        switch (level) {
            case 'Low': return <Sun className="h-5 w-5 text-yellow-600 opacity-60" />;
            case 'Medium': return <Sun className="h-5 w-5 text-yellow-500" />;
            case 'High': return <Sun className="h-5 w-5 text-orange-500" />;
            case 'Direct': return <Sun className="h-5 w-5 text-red-500" />;
            default: return <Sun className="h-5 w-5 text-gray-400" />;
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-20">
            <DemoTimer />
            {/* Header / Nav */}
            <div className="bg-white border-b border-gray-200 sticky top-0 z-30">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center gap-4">
                    <Button variant="ghost" size="icon" onClick={() => router.back()}>
                        <ArrowLeft className="h-5 w-5 text-slate-500" />
                    </Button>
                    <div className="flex-1">
                        <h1 className="font-bold text-lg text-slate-900 leading-tight">{plant.name}</h1>
                        <p className="text-xs text-slate-500 italic">{plant.scientificName || 'Espécie Desconhecida'}</p>
                    </div>
                    <Button size="sm" onClick={() => waterPlant(plant.id)}>
                        <Droplets className="h-4 w-4 mr-2" />
                        Regar
                    </Button>
                </div>
            </div>

            <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

                {/* Top Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center text-center gap-2">
                        <div className="p-2 bg-blue-50 rounded-full">
                            <Droplets className="h-5 w-5 text-blue-500" />
                        </div>
                        <div>
                            <p className="text-xs text-slate-500 uppercase font-semibold">Humidade</p>
                            <p className="text-lg font-bold text-slate-900">{plant.humidity || 50}%</p>
                        </div>
                    </div>
                    <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center text-center gap-2">
                        <div className="p-2 bg-yellow-50 rounded-full">
                            {getLightIcon(plant.lightLevel || 'Medium')}
                        </div>
                        <div>
                            <p className="text-xs text-slate-500 uppercase font-semibold">Luz Solar</p>
                            <p className="text-lg font-bold text-slate-900">{plant.lightLevel || 'Moderada'}</p>
                        </div>
                    </div>
                    <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center text-center gap-2">
                        <div className="p-2 bg-green-50 rounded-full">
                            <Thermometer className="h-5 w-5 text-green-500" />
                        </div>
                        <div>
                            <p className="text-xs text-slate-500 uppercase font-semibold">Saúde</p>
                            <p className="text-lg font-bold text-slate-900">{plant.health || 100}%</p>
                        </div>
                    </div>
                    <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center text-center gap-2">
                        <div className="p-2 bg-purple-50 rounded-full">
                            <Calendar className="h-5 w-5 text-purple-500" />
                        </div>
                        <div>
                            <p className="text-xs text-slate-500 uppercase font-semibold">Prox. Rega</p>
                            <p className="text-lg font-bold text-slate-900">
                                {new Date(plant.nextWatering).toLocaleDateString('pt-BR')}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Charts Section */}
                <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                            <History className="h-5 w-5 text-emerald-500" />
                            Histórico de Hidratação
                        </h2>
                        {plant.status === 'dead' ? (
                            <span className="text-red-500 font-bold bg-red-50 text-sm px-3 py-1 rounded-full border border-red-100">
                                ✝ Planta Falecida em {new Date(plant.dateDied!).toLocaleDateString('pt-BR')}
                            </span>
                        ) : (
                            <select className="text-sm border-none bg-slate-50 rounded-lg px-3 py-1 font-medium text-slate-600 focus:ring-0">
                                <option>Últimos 30 dias</option>
                                <option>Últimos 6 meses</option>
                            </select>
                        )}
                    </div>

                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={plant.history}>
                                <defs>
                                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#10B981" stopOpacity={0.2} />
                                        <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                                <XAxis
                                    dataKey="date"
                                    tick={{ fontSize: 12, fill: '#64748B' }}
                                    axisLine={false}
                                    tickLine={false}
                                    tickFormatter={(value) => value.split('-')[2]} // Show only day
                                />
                                <YAxis
                                    tick={{ fontSize: 12, fill: '#64748B' }}
                                    axisLine={false}
                                    tickLine={false}
                                    domain={[0, 100]}
                                />
                                <Tooltip
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="value"
                                    stroke="#10B981"
                                    strokeWidth={3}
                                    fillOpacity={1}
                                    fill="url(#colorValue)"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                    <p className="text-center text-sm text-slate-400 mt-4">
                        Dados simulados de sensores de umidade do solo.
                    </p>
                </div>

                {/* Care Profile Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
                        <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                            <Info className="h-5 w-5 text-emerald-500" />
                            Perfil de Cuidado
                        </h3>
                        <div className="space-y-4">
                            <div className="flex items-start gap-4">
                                <div className="bg-slate-100 p-2 rounded-lg">
                                    <Wind className="h-5 w-5 text-slate-500" />
                                </div>
                                <div>
                                    <h4 className="font-semibold text-slate-900">Ambiente</h4>
                                    <p className="text-sm text-slate-500 leading-relaxed">
                                        Prefere ambientes {plant.location || 'internos'} com boa circulação de ar. Evite correntes de ar frio direto (ar condicionado).
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <div className="bg-slate-100 p-2 rounded-lg">
                                    <Leaf className="h-5 w-5 text-slate-500" />
                                </div>
                                <div>
                                    <h4 className="font-semibold text-slate-900">Solo</h4>
                                    <p className="text-sm text-slate-500 leading-relaxed">
                                        Solo bem drenado, rico em matéria orgânica. Mantenha levemente úmido, mas não encharcado.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-emerald-900 rounded-3xl p-6 text-white shadow-lg relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-16 bg-emerald-800 rounded-full blur-3xl opacity-50 -mr-10 -mt-10"></div>
                        <h3 className="text-lg font-bold mb-4 relative z-10">Dica do Especialista</h3>
                        <p className="text-emerald-100 leading-relaxed relative z-10">
                            "Lembre-se que {plant.name} geralmente cresce em direção à luz. Gire o vaso um quarto de volta toda vez que regar para garantir um crescimento uniforme."
                        </p>
                        <div className="mt-6 flex items-center gap-2 relative z-10">
                            <div className="h-8 w-8 rounded-full bg-emerald-200 flex items-center justify-center text-emerald-900 font-bold text-xs">AI</div>
                            <span className="text-sm font-medium text-emerald-200">PlantAlly Botanist</span>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
