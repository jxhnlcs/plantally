"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Leaf, Droplets, Calendar, CheckCircle2, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { useAppStore } from '@/lib/store';

export default function LandingPage() {
  const router = useRouter();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [authStep, setAuthStep] = useState<'login' | 'signup'>('signup');
  const [email, setEmail] = useState('');

  const { login, subscribe, isLoggedIn, generateDemoData } = useAppStore();

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login(email);
    setIsAuthModalOpen(false);
    setIsPaymentModalOpen(true);
  };

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    subscribe();
    setIsPaymentModalOpen(false);
    router.push('/dashboard');
  };

  const handleDemo = () => {
    generateDemoData();
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      {/* Navigation */}
      <nav className="fixed w-full bg-white/80 backdrop-blur-md z-40 border-b border-emerald-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <div className="bg-emerald-100 p-2 rounded-lg">
                <Leaf className="h-6 w-6 text-emerald-600" />
              </div>
              <span className="font-bold text-xl tracking-tight text-emerald-900">PlantAlly</span>
            </div>
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-sm font-medium text-slate-600 hover:text-emerald-600 transition-colors">Funcionalidades</a>
              <a href="#pricing" className="text-sm font-medium text-slate-600 hover:text-emerald-600 transition-colors">Preços</a>
              {isLoggedIn ? (
                <Link href="/dashboard">
                  <Button variant="outline" size="sm">Painel</Button>
                </Link>
              ) : (
                <Button variant="primary" size="sm" onClick={() => setIsAuthModalOpen(true)}>
                  Entrar
                </Button>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-700 text-sm font-medium mb-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            Disponível na versão Beta
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900 mb-8 max-w-4xl mx-auto leading-tight animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">
            Mantenha suas plantas <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-400">vivas e prósperas</span>.
          </h1>
          <p className="text-xl text-slate-600 mb-10 max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
            O assistente inteligente de cuidados com plantas que rastreia horários de rega, necessidades de luz solar e progresso do crescimento. Nunca mais mate uma suculenta.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300">
            <Button size="lg" className="rounded-full px-8 shadow-emerald-200 shadow-lg hover:shadow-xl hover:shadow-emerald-200/50 transition-all" onClick={() => setIsAuthModalOpen(true)}>
              Comece Seu Teste Grátis
            </Button>
            <Button variant="outline" size="lg" className="rounded-full px-8" onClick={handleDemo}>
              Ver Demo
            </Button>
          </div>
        </div>

        {/* Background Decorative Elements */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full z-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
          <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-teal-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-1/2 w-96 h-96 bg-lime-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-base font-semibold text-emerald-600 tracking-wide uppercase">Funcionalidades</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-slate-900 sm:text-4xl">
              Tudo o que você precisa para cultivar
            </p>
            <p className="mt-4 max-w-2xl text-xl text-slate-500 mx-auto">
              Ferramentas simples, mas poderosas, para gerenciar sua selva urbana.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              {
                icon: Droplets,
                title: "Agendamentos Inteligentes",
                desc: "Horários de rega personalizados com base na espécie da planta e no clima local."
              },
              {
                icon: Calendar,
                title: "Linha do Tempo Visual",
                desc: "Veja exatamente quando suas próximas tarefas de cuidado vencem com uma bela visualização de calendário."
              },
              {
                icon: CheckCircle2,
                title: "Monitoramento de Saúde",
                desc: "Registre o progresso do crescimento e identifique possíveis problemas antes que se tornem graves."
              }
            ].map((feature, i) => (
              <div key={i} className="relative group p-8 bg-slate-50 rounded-3xl hover:bg-emerald-50/50 transition-colors duration-300">
                <div className="absolute top-8 left-8 p-3 bg-white rounded-2xl shadow-sm ring-1 ring-slate-100 group-hover:ring-emerald-200 group-hover:shadow-md transition-all">
                  <feature.icon className="h-6 w-6 text-emerald-600" />
                </div>
                <div className="mt-16">
                  <h3 className="text-xl font-bold text-slate-900 mb-4">{feature.title}</h3>
                  <p className="text-slate-600 leading-relaxed">
                    {feature.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-lg mx-auto bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100">
            <div className="px-6 py-8 sm:p-10 sm:pb-6 text-center">
              <h2 className="text-2xl font-bold text-slate-900">Preço Simples</h2>
              <p className="mt-4 text-sm text-slate-500">Comece sua jornada hoje.</p>
              <div className="mt-8 flex items-center justify-center">
                <span className="text-5xl font-extrabold text-slate-900">R$ 3</span>
                <span className="ml-2 text-xl font-medium text-slate-500">/mês</span>
              </div>
              <ul className="mt-8 space-y-4 text-left max-w-xs mx-auto">
                {['Plantas ilimitadas', 'Notificações de rega', 'Dicas de cuidados especializados'].map((item) => (
                  <li key={item} className="flex items-start">
                    <CheckCircle2 className="flex-shrink-0 h-5 w-5 text-emerald-500" />
                    <p className="ml-3 text-base text-slate-600">{item}</p>
                  </li>
                ))}
              </ul>
            </div>
            <div className="px-6 pt-6 pb-8 bg-slate-50 sm:px-10 sm:py-10">
              <Button size="lg" fullWidth onClick={() => setIsAuthModalOpen(true)}>
                Começar
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Auth Modal */}
      <Modal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        title={authStep === 'login' ? 'Bem-vindo de volta' : 'Criar Conta'}
      >
        <form onSubmit={handleAuthSubmit} className="space-y-6">
          <Input
            label="Endereço de E-mail"
            type="email"
            placeholder="voce@exemplo.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Input
            label="Senha"
            type="password"
            placeholder="••••••••"
            required
          />
          <Button type="submit" fullWidth>
            {authStep === 'login' ? 'Entrar' : 'Cadastre-se'}
          </Button>
          <div className="text-center text-sm text-slate-500">
            {authStep === 'signup' ? (
              <>
                Já tem uma conta?{' '}
                <button type="button" onClick={() => setAuthStep('login')} className="text-emerald-600 font-medium hover:underline">
                  Entrar
                </button>
              </>
            ) : (
              <>
                Novo no PlantAlly?{' '}
                <button type="button" onClick={() => setAuthStep('signup')} className="text-emerald-600 font-medium hover:underline">
                  Cadastre-se
                </button>
              </>
            )}
          </div>
        </form>
      </Modal>

      {/* Payment Modal */}
      <Modal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        title="Mude para o Pro"
      >
        <div className="mb-6 bg-emerald-50 p-4 rounded-xl flex items-center gap-3 border border-emerald-100">
          <div className="p-2 bg-white rounded-full text-emerald-600">
            <DollarSign className="h-5 w-5" />
          </div>
          <div>
            <p className="font-semibold text-emerald-900">Total a Pagar Hoje: R$ 0,00</p>
            <p className="text-xs text-emerald-700">Teste grátis de 7 dias, depois R$ 3,00/mês</p>
          </div>
        </div>
        <form onSubmit={handlePaymentSubmit} className="space-y-4">
          <Input
            label="Número do Cartão"
            placeholder="0000 0000 0000 0000"
            required
          />
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Data de Validade"
              placeholder="MM/AA"
              required
            />
            <Input
              label="CVC"
              placeholder="123"
              required
            />
          </div>
          <Input
            label="Nome no Cartão"
            placeholder="João Silva"
            required
          />
          <Button type="submit" fullWidth className="mt-4">
            Iniciar Teste Grátis
          </Button>
        </form>
      </Modal>
    </div>
  );
}
