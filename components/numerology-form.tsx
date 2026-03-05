"use client";

import { useRef, useState } from "react";

interface NumerologyFormProps {
  onSubmit: (name: string, birthdate: string) => void;
  isLoading: boolean;
}

const TEASER_ITEMS = [
  {
    icon: "✦",
    title: "Número do Destino",
    desc: "A missão que sua alma trouxe para esta vida",
  },
  {
    icon: "✦",
    title: "Número da Alma",
    desc: "Seus desejos mais profundos e motivações ocultas",
  },
  {
    icon: "✦",
    title: "Lição Cármica",
    desc: "O bloqueio principal que impede sua expansão",
  },
  {
    icon: "✦",
    title: "Sistema Pitagórico + Cabalístico",
    desc: "Dupla revelação — o plano material e o divino",
  },
];

export default function NumerologyForm({
  onSubmit,
  isLoading,
}: NumerologyFormProps) {
  const [name, setName] = useState("");
  const [day, setDay] = useState("");
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const formRef = useRef<HTMLDivElement>(null);

  function validate() {
    const errs: Record<string, string> = {};
    if (!name.trim() || name.trim().split(" ").length < 2)
      errs.name = "Informe seu nome completo de nascimento";
    const d = parseInt(day);
    const m = parseInt(month);
    const y = parseInt(year);
    if (!day || d < 1 || d > 31) errs.day = "Dia inválido";
    if (!month || m < 1 || m > 12) errs.month = "Mês inválido";
    if (!year || y < 1900 || y > new Date().getFullYear())
      errs.year = "Ano inválido";
    return errs;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setErrors({});
    const birthdate = `${day.padStart(2, "0")}/${month.padStart(2, "0")}/${year}`;
    onSubmit(name.trim(), birthdate);
  }

  return (
    <section
      id="form-section"
      ref={formRef}
      className="relative py-24 px-4 overflow-hidden"
    >
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-[rgba(201,168,76,0.03)] blur-[100px] pointer-events-none" />

      <div className="relative max-w-6xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-16">
          <span className="inline-block text-[#c9a84c] text-xs font-body tracking-[0.3em] uppercase mb-4">
            Sua Revelação Gratuita
          </span>
          <h2 className="font-sans text-4xl md:text-5xl font-bold text-[#f0e6c8] mb-4 text-balance">
            O universo guardou este mapa{" "}
            <span className="gold-gradient-text">só para você</span>
          </h2>
          <p className="font-body text-[#a89070] text-lg max-w-xl mx-auto leading-relaxed">
            Insira seus dados sagrados e receba, em segundos, uma leitura
            profunda e personalizada pelos dois sistemas mais precisos do mundo.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Left: What you'll receive */}
          <div className="space-y-6">
            <h3 className="font-sans text-2xl font-semibold text-[#f0e6c8] mb-6">
              O que sua leitura vai revelar:
            </h3>
            {TEASER_ITEMS.map((item, i) => (
              <div key={i} className="flex gap-4 group">
                <div className="flex-shrink-0 w-10 h-10 rounded-full mystical-border bg-[rgba(201,168,76,0.08)] flex items-center justify-center text-[#c9a84c] text-sm group-hover:bg-[rgba(201,168,76,0.15)] transition-colors duration-300">
                  {item.icon}
                </div>
                <div>
                  <p className="font-sans text-[#f0e6c8] font-semibold text-lg">
                    {item.title}
                  </p>
                  <p className="font-body text-[#a89070] text-sm leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}

            {/* Trust badge */}
            <div className="mt-8 p-4 rounded-xl mystical-card">
              <p className="text-[#a89070] text-sm font-body italic leading-relaxed">
                {'"'}Depois da leitura, entendi por que certas situações se
                repetiam na minha vida. Fez sentido como nunca antes.{'"'}
              </p>
              <p className="text-[#c9a84c] text-xs font-body mt-2 font-semibold">
                — Mariana S., São Paulo
              </p>
            </div>
          </div>

          {/* Right: Form */}
          <div className="mystical-card rounded-2xl p-8 md:p-10">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name */}
              <div>
                <label className="block font-body text-[#c9a84c] text-xs tracking-widest uppercase mb-2">
                  Nome Completo de Nascimento
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ex: Maria Aparecida Souza Lima"
                  className="w-full px-4 py-3 bg-[#0a0812] border border-[rgba(201,168,76,0.25)] rounded-lg text-[#f0e6c8] font-body placeholder-[#4a3d5a] focus:outline-none focus:border-[#c9a84c] focus:ring-1 focus:ring-[rgba(201,168,76,0.3)] transition-all duration-200"
                />
                {errors.name && (
                  <p className="text-red-400 text-xs mt-1 font-body">
                    {errors.name}
                  </p>
                )}
                <p className="text-[#4a3d5a] text-xs mt-1 font-body">
                  Use o nome que consta na certidão de nascimento
                </p>
              </div>

              {/* Date */}
              <div>
                <label className="block font-body text-[#c9a84c] text-xs tracking-widest uppercase mb-2">
                  Data de Nascimento
                </label>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <input
                      type="number"
                      value={day}
                      onChange={(e) => setDay(e.target.value)}
                      placeholder="DD"
                      min="1"
                      max="31"
                      className="w-full px-3 py-3 bg-[#0a0812] border border-[rgba(201,168,76,0.25)] rounded-lg text-[#f0e6c8] font-body placeholder-[#4a3d5a] focus:outline-none focus:border-[#c9a84c] transition-all duration-200 text-center"
                    />
                    {errors.day && (
                      <p className="text-red-400 text-xs mt-1 font-body">
                        {errors.day}
                      </p>
                    )}
                  </div>
                  <div>
                    <input
                      type="number"
                      value={month}
                      onChange={(e) => setMonth(e.target.value)}
                      placeholder="MM"
                      min="1"
                      max="12"
                      className="w-full px-3 py-3 bg-[#0a0812] border border-[rgba(201,168,76,0.25)] rounded-lg text-[#f0e6c8] font-body placeholder-[#4a3d5a] focus:outline-none focus:border-[#c9a84c] transition-all duration-200 text-center"
                    />
                    {errors.month && (
                      <p className="text-red-400 text-xs mt-1 font-body">
                        {errors.month}
                      </p>
                    )}
                  </div>
                  <div>
                    <input
                      type="number"
                      value={year}
                      onChange={(e) => setYear(e.target.value)}
                      placeholder="AAAA"
                      min="1900"
                      max={new Date().getFullYear()}
                      className="w-full px-3 py-3 bg-[#0a0812] border border-[rgba(201,168,76,0.25)] rounded-lg text-[#f0e6c8] font-body placeholder-[#4a3d5a] focus:outline-none focus:border-[#c9a84c] transition-all duration-200 text-center"
                    />
                    {errors.year && (
                      <p className="text-red-400 text-xs mt-1 font-body">
                        {errors.year}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-4 rounded-full bg-[#c9a84c] text-[#0a0812] font-body font-bold text-base tracking-wide hover:bg-[#f0d080] transition-all duration-300 hover:shadow-[0_0_25px_rgba(201,168,76,0.4)] disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-3">
                    <span className="w-4 h-4 rounded-full border-2 border-[#0a0812] border-t-transparent animate-spin" />
                    Consultando os registros akáshicos...
                  </span>
                ) : (
                  "Revelar meu mapa agora"
                )}
              </button>

              <p className="text-[#4a3d5a] text-xs text-center font-body">
                100% gratuito. Seus dados são usados apenas para calcular sua
                leitura.
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
