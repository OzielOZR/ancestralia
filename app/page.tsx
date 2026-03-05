"use client";

import { useCallback, useRef, useState } from "react";
import { DefaultChatTransport, readUIMessageStream, UIMessage } from "ai";
import { useChat } from "@ai-sdk/react";
import HeroSection from "@/components/hero-section";
import NumerologyForm from "@/components/numerology-form";
import SocialProofSection from "@/components/social-proof-section";
import TeasersSection from "@/components/teasers-section";
import ReadingDisplay from "@/components/reading-display";

export default function HomePage() {
  const formRef = useRef<HTMLElement | null>(null);
  const [hasReading, setHasReading] = useState(false);
  const [userName, setUserName] = useState("");
  const [streamingContent, setStreamingContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const readingRef = useRef<HTMLDivElement>(null);

  const scrollToForm = useCallback(() => {
    document.getElementById("form-section")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }, []);

  async function handleSubmit(name: string, birthdate: string) {
    setUserName(name);
    setStreamingContent("");
    setIsLoading(true);
    setHasReading(true);

    // Scroll to reading area
    setTimeout(() => {
      readingRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 300);

    try {
      const response = await fetch("/api/numerology", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, birthdate }),
      });

      if (!response.ok || !response.body) {
        throw new Error("Erro ao buscar leitura");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let fullContent = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          const trimmed = line.trim();
          if (trimmed.startsWith("data:")) {
            const data = trimmed.slice(5).trim();
            if (data === "[DONE]") continue;
            try {
              const parsed = JSON.parse(data);
              // AI SDK v6 SSE: type 'text-delta' carries delta text
              if (parsed.type === "text-delta" && parsed.delta) {
                fullContent += parsed.delta;
                setStreamingContent(fullContent);
              }
            } catch {
              // skip non-JSON lines
            }
          }
        }
      }
    } catch (err) {
      console.error("[v0] Numerology stream error:", err);
      setStreamingContent(
        "Ocorreu um erro ao gerar sua leitura. Por favor, tente novamente."
      );
    } finally {
      setIsLoading(false);
    }
  }

  function handleReset() {
    setHasReading(false);
    setStreamingContent("");
    setUserName("");
    setTimeout(scrollToForm, 100);
  }

  return (
    <main className="min-h-screen bg-[#0a0812]">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 bg-[rgba(10,8,18,0.8)] backdrop-blur-md border-b border-[rgba(201,168,76,0.1)]">
        <span className="font-sans text-xl font-bold gold-gradient-text tracking-widest">
          ANCESTRALIA
        </span>
        <button
          onClick={scrollToForm}
          className="px-5 py-2 rounded-full bg-[#c9a84c] text-[#0a0812] font-body font-bold text-sm hover:bg-[#f0d080] transition-all duration-200"
        >
          Revelar meu mapa
        </button>
      </nav>

      {/* Hero */}
      <HeroSection onScrollToForm={scrollToForm} />

      {/* How it works strip */}
      <section className="py-16 px-4 border-y border-[rgba(201,168,76,0.1)]">
        <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-8 text-center">
          {[
            {
              step: "01",
              title: "Insira seus dados sagrados",
              desc: "Nome completo de nascimento e data. É tudo que o universo precisa.",
            },
            {
              step: "02",
              title: "A IA consulta os registros",
              desc: "Nossa inteligência analisa 8 números em dois sistemas distintos.",
            },
            {
              step: "03",
              title: "Receba sua revelação",
              desc: "Uma leitura de 1.200+ palavras personalizada e transformadora.",
            },
          ].map((item, i) => (
            <div key={i} className="flex flex-col items-center gap-3">
              <span className="font-sans text-5xl font-bold gold-gradient-text opacity-30">
                {item.step}
              </span>
              <h3 className="font-sans text-lg font-semibold text-[#f0e6c8]">
                {item.title}
              </h3>
              <p className="font-body text-[#a89070] text-sm leading-relaxed max-w-xs">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Social proof */}
      <SocialProofSection />

      {/* Form section */}
      {!hasReading && (
        <NumerologyForm onSubmit={handleSubmit} isLoading={isLoading} />
      )}

      {/* Reading display */}
      {hasReading && (
        <div ref={readingRef}>
          <ReadingDisplay
            content={streamingContent}
            isStreaming={isLoading}
            name={userName}
            onReset={handleReset}
          />
        </div>
      )}

      {/* Teasers (only before reading) */}
      {!hasReading && <TeasersSection onScrollToForm={scrollToForm} />}

      {/* Footer */}
      <footer className="py-10 px-4 border-t border-[rgba(201,168,76,0.1)] text-center">
        <p className="font-sans text-2xl font-bold gold-gradient-text tracking-widest mb-3">
          ANCESTRALIA
        </p>
        <p className="font-body text-[#4a3d5a] text-xs max-w-md mx-auto">
          A numerologia é uma ferramenta de autoconhecimento. As leituras são
          geradas por inteligência artificial com base em sistemas numerológicos
          tradicionais e não substituem orientação profissional de saúde mental.
        </p>
        <p className="font-body text-[#2e2248] text-xs mt-4">
          © {new Date().getFullYear()} Ancestralia. Todos os direitos
          reservados.
        </p>
      </footer>
    </main>
  );
}
