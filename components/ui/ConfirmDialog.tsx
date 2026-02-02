"use client";

import React from 'react';
import { AlertTriangle, X } from 'lucide-react';
import { Button } from './Button';

interface ConfirmDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    variant?: 'danger' | 'warning';
}

export function ConfirmDialog({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmText = 'Confirmar',
    cancelText = 'Cancelar',
    variant = 'warning'
}: ConfirmDialogProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Dialog */}
            <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 animate-in fade-in zoom-in duration-200">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors"
                >
                    <X className="h-5 w-5" />
                </button>

                <div className="flex items-start gap-4 mb-4">
                    <div className={`p-3 rounded-full ${variant === 'danger' ? 'bg-red-100' : 'bg-yellow-100'}`}>
                        <AlertTriangle className={`h-6 w-6 ${variant === 'danger' ? 'text-red-600' : 'text-yellow-600'}`} />
                    </div>
                    <div className="flex-1">
                        <h3 className="text-lg font-bold text-slate-900 mb-2">{title}</h3>
                        <p className="text-sm text-slate-600">{message}</p>
                    </div>
                </div>

                <div className="flex gap-3 justify-end mt-6">
                    <Button
                        variant="secondary"
                        onClick={onClose}
                    >
                        {cancelText}
                    </Button>
                    <Button
                        variant="primary"
                        onClick={() => {
                            onConfirm();
                            onClose();
                        }}
                        className={variant === 'danger' ? 'bg-red-500 hover:bg-red-600' : ''}
                    >
                        {confirmText}
                    </Button>
                </div>
            </div>
        </div>
    );
}
