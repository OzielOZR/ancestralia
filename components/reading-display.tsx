"use client";

import { useEffect, useRef, useState } from "react";

interface ReadingDisplayProps {
  content: string;
  isStreaming: boolean;
  name: string;
  onReset: () => void;
}

export default function ReadingDisplay({
  content,
  isStreaming,
  name,
  onReset,
}: ReadingDisplayProps) {
  const bottomRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);

  // Auto-scroll while streaming
  useEffect(() => {
    if (isStreaming) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  }, [content, isStreaming]);

  function formatContent(text: string) {
    const lines = text.split("\n");
    const elements: JSX.Element[] = [];
    let key = 0;

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed) {
        elements.push(<div key={key++} className="h-3" />);
        continue;
      }

      // Bold headings with **
      if (trimmed.startsWith("**") && trimmed.endsWith("**") && trimmed.length > 4) {
        const title = trimmed.slice(2, -2);
        elements.push(
          <h2 key={key++} className="font-sans text-xl md:text-2xl font-bold text-[#c9a84c] mt-8 mb-3 border-b border-[rgba(201,168,76,0.2)] pb-2">
            {title}
          </h2>
        );
        continue;
      }

      // Inline bold with **...**
      const parts = trimmed.split(/(\*\*[^*]+\*\*)/g);
      const rendered = parts.map((part, idx) => {
        if (part.startsWith("**") && part.endsWith("**")) {
          return (
            <strong key={idx} className="text-[#c9a84c] font-semibold">
              {part.slice(2, -2)}
            </strong>
          );
        }
        return part;
      });

      elements.push(
        <p key={key++} className="font-body text-[#d4c4a8] text-base leading-[1.85] mb-0">
          {rendered}
        </p>
      );
    }

    return elements;
  }

  async function handleCopy() {
    await navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const firstName = name.split(" ")[0];

  return (
    <section className="py-20 px-4 min-h-screen relative">
      {/* Atmospheric glow */}
      <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full bg-[rgba(201,168,76,0.02)] blur-[120px] pointer-events-none" />

      <div className="relative max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full mystical-border bg-[rgba(26,18,40,0.6)]">
            <span className="w-2 h-2 rounded-full bg-[#c9a84c] animate-pulse" />
            <span className="text-[#c9a84c] text-xs font-body tracking-[0.2em] uppercase">
              {isStreaming ? "Consultando os registros akáshicos..." : "Leitura Completa"}
            </span>
          </div>

          <h2 className="font-sans text-3xl md:text-4xl font-bold text-[#f0e6c8] mb-2">
            O Mapa da Alma de{" "}
            <span className="gold-gradient-text">{firstName}</span>
          </h2>
          <p className="font-body text-[#a89070] text-sm">
            Numerologia Pitagórica & Cabalística — Leitura Personalizada
          </p>
        </div>

        {/* Reading content */}
        <div className="mystical-card rounded-2xl p-6 md:p-10 prose-mystical">
          {isStreaming && content.length === 0 ? (
            <div className="flex flex-col items-center py-16 gap-4">
              <div className="w-12 h-12 rounded-full border-2 border-[#c9a84c] border-t-transparent animate-spin" />
              <p className="font-body text-[#a89070] text-sm">
                Calculando suas vibrações numéricas...
              </p>
            </div>
          ) : (
            <div>
              {formatContent(content)}
              {isStreaming && (
                <span className="inline-block w-0.5 h-5 bg-[#c9a84c] animate-pulse ml-1" />
              )}
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Actions */}
        {!isStreaming && content.length > 0 && (
          <div className="mt-8 flex flex-col sm:flex-row items-center gap-4">
            <button
              onClick={handleCopy}
              className="flex-1 py-3 rounded-full mystical-border text-[#c9a84c] font-body text-sm hover:bg-[rgba(201,168,76,0.1)] transition-all duration-200"
            >
              {copied ? "Copiado!" : "Copiar leitura"}
            </button>
            <button
              onClick={onReset}
              className="flex-1 py-3 rounded-full bg-[#c9a84c] text-[#0a0812] font-body font-bold text-sm hover:bg-[#f0d080] transition-all duration-200"
            >
              Fazer nova leitura
            </button>
          </div>
        )}

        {/* Premium upsell — shown after reading */}
        {!isStreaming && content.length > 100 && (
          <div className="mt-12 p-8 rounded-2xl border border-[rgba(201,168,76,0.4)] bg-gradient-to-br from-[rgba(201,168,76,0.05)] to-[rgba(26,18,40,0.5)] text-center">
            <span className="inline-block text-[#c9a84c] text-xs font-body tracking-[0.3em] uppercase mb-3">
              Leitura Premium
            </span>
            <h3 className="font-sans text-2xl font-bold text-[#f0e6c8] mb-3 text-balance">
              Esta foi apenas a introdução.
            </h3>
            <p className="font-body text-[#a89070] text-sm leading-relaxed max-w-lg mx-auto mb-6">
              A leitura completa inclui previsões detalhadas para os próximos{" "}
              <strong className="text-[#c9a84c]">12–24 meses</strong>,
              compatibilidade amorosa, ciclos de prosperidade e orientação para
              transcender seus bloqueios cármicos mais profundos.
            </p>
            <a
              href="#form-section"
              className="inline-block px-8 py-4 rounded-full bg-[#c9a84c] text-[#0a0812] font-body font-bold text-base tracking-wide hover:bg-[#f0d080] transition-all duration-300 hover:shadow-[0_0_25px_rgba(201,168,76,0.4)]"
            >
              Quero a leitura completa
            </a>
          </div>
        )}
      </div>
    </section>
  );
}
