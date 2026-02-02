"use client";

import React, { useEffect, useState } from 'react';
import { Clock } from 'lucide-react';
import { useAppStore } from '@/lib/store';

export function DemoTimer() {
    const { isDemo, demoStartTime } = useAppStore();

    // Calculate initial time correctly to avoid flash
    const getTimeLeft = () => {
        if (!demoStartTime) return 60;
        const elapsed = Math.floor((Date.now() - demoStartTime) / 1000);
        return Math.max(0, 60 - elapsed);
    };

    const [timeLeft, setTimeLeft] = useState(getTimeLeft);

    useEffect(() => {
        if (!isDemo || !demoStartTime) return;

        // Calculate time based on demoStartTime from store
        const interval = setInterval(() => {
            const elapsed = Math.floor((Date.now() - demoStartTime) / 1000);
            const remaining = Math.max(0, 60 - elapsed);
            setTimeLeft(remaining);

            if (remaining <= 0) {
                clearInterval(interval);
            }
        }, 500); // Update every 500ms for smooth countdown

        return () => clearInterval(interval);
    }, [isDemo, demoStartTime]);

    if (!isDemo || !demoStartTime) return null;

    return (
        <div className="fixed bottom-4 right-4 bg-slate-900 text-white px-4 py-3 rounded-full shadow-lg flex items-center gap-3 z-50 animate-pulse">
            <Clock className="h-5 w-5 text-yellow-400" />
            <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Modo Demo</p>
                <p className="font-mono text-xl font-bold leading-none text-yellow-400">
                    00:{timeLeft.toString().padStart(2, '0')}
                </p>
            </div>
        </div>
    );
}
