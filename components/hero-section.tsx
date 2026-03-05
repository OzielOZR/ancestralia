"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

const STAR_COUNT = 80;

function StarField() {
  const stars = useRef(
    Array.from({ length: STAR_COUNT }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 100,
      size: Math.random() * 2 + 0.5,
      delay: Math.random() * 4,
      duration: Math.random() * 3 + 2,
    }))
  );

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {stars.current.map((star) => (
        <div
          key={star.id}
          className="absolute rounded-full bg-[#f0e6c8] animate-shimmer"
          style={{
            left: `${star.left}%`,
            top: `${star.top}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            animationDelay: `${star.delay}s`,
            animationDuration: `${star.duration}s`,
            opacity: 0.4,
          }}
        />
      ))}
    </div>
  );
}

export default function HeroSection({
  onScrollToForm,
}: {
  onScrollToForm: () => void;
}) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <Image
          src="/hero-cosmos.jpg"
          alt="Cosmos místico com geometria sagrada"
          fill
          priority
          className="object-cover"
        />
        <div className="hero-overlay absolute inset-0" />
      </div>

      <StarField />

      {/* Sacred geometry ring */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div
          className="w-[600px] h-[600px] rounded-full border border-[rgba(201,168,76,0.08)] animate-float"
          style={{ animationDuration: "8s" }}
        />
        <div
          className="absolute w-[450px] h-[450px] rounded-full border border-[rgba(201,168,76,0.12)] animate-float"
          style={{ animationDuration: "6s", animationDelay: "1s" }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        {/* Badge */}
        <div
          className={`inline-flex items-center gap-2 mb-8 px-4 py-2 rounded-full mystical-border bg-[rgba(26,18,40,0.6)] backdrop-blur-sm transition-all duration-700 ${
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#c9a84c] animate-pulse-gold" />
          <span className="text-[#c9a84c] text-xs font-body tracking-[0.2em] uppercase font-light">
            Numerologia Pitagórica & Cabalística
          </span>
        </div>

        {/* Headline */}
        <h1
          className={`font-sans text-5xl md:text-7xl lg:text-8xl font-bold leading-tight mb-6 text-balance transition-all duration-700 delay-150 ${
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <span className="text-[#f0e6c8]">Os números</span>
          <br />
          <span className="gold-gradient-text">revelam sua alma</span>
          <br />
          <span className="text-[#f0e6c8] text-4xl md:text-5xl lg:text-6xl font-medium">
            desde o nascimento
          </span>
        </h1>

        {/* Subheadline */}
        <p
          className={`font-body text-lg md:text-xl text-[#a89070] leading-relaxed max-w-2xl mx-auto mb-10 transition-all duration-700 delay-300 ${
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          Descubra o mapa numerológico que sua alma escolheu antes desta
          encarnação. Uma leitura profunda, personalizada e transformadora — que
          nenhuma outra ferramenta oferece.
        </p>

        {/* CTAs */}
        <div
          className={`flex flex-col sm:flex-row items-center justify-center gap-4 transition-all duration-700 delay-500 ${
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <button
            onClick={onScrollToForm}
            className="group relative px-8 py-4 rounded-full bg-[#c9a84c] text-[#0a0812] font-body font-bold text-base tracking-wide overflow-hidden transition-all duration-300 hover:shadow-[0_0_30px_rgba(201,168,76,0.5)] hover:scale-105 animate-pulse-gold"
          >
            <span className="relative z-10">
              Revelar meu mapa gratuito agora
            </span>
            <span className="absolute inset-0 bg-[#f0d080] translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-300" />
          </button>
          <button
            onClick={onScrollToForm}
            className="px-8 py-4 rounded-full border border-[rgba(201,168,76,0.4)] text-[#c9a84c] font-body text-base tracking-wide hover:bg-[rgba(201,168,76,0.1)] transition-all duration-300"
          >
            Ver como funciona
          </button>
        </div>

        {/* Social proof pill */}
        <div
          className={`mt-12 flex items-center justify-center gap-6 transition-all duration-700 delay-700 ${
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          <div className="flex -space-x-2">
            {[
              "bg-[#8b7355]",
              "bg-[#6b5b3e]",
              "bg-[#9c8465]",
              "bg-[#7a6448]",
            ].map((c, i) => (
              <div
                key={i}
                className={`w-8 h-8 rounded-full ${c} border-2 border-[#0a0812] flex items-center justify-center text-xs text-[#f0e6c8] font-bold`}
              >
                {["A", "M", "C", "R"][i]}
              </div>
            ))}
          </div>
          <p className="text-[#a89070] text-sm font-body">
            <span className="text-[#c9a84c] font-bold">+12.400</span> almas
            iluminadas pelo mapa
          </p>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-float">
        <span className="text-[#a89070] text-xs font-body tracking-widest uppercase">
          Descer
        </span>
        <div className="w-px h-12 bg-gradient-to-b from-[#c9a84c] to-transparent" />
      </div>
    </section>
  );
}
