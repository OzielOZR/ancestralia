const TEASERS = [
  {
    icon: "◈",
    question: "Qual é o parceiro ideal que sua alma contratou antes do nascimento?",
    reveal: "Seu Número da Alma esconde os padrões de atração e os ciclos de relacionamentos que se repetem — e o que fazer para quebrá-los.",
  },
  {
    icon: "◈",
    question: "O ciclo de 2025–2027 pode mudar sua prosperidade para sempre?",
    reveal: "Os Anos Pessoais revelam janelas de oportunidade raras. Saber quando agir vale mais do que qualquer esforço fora de tempo.",
  },
  {
    icon: "◈",
    question: "Existe um talento adormecido bloqueado por um carma não resolvido?",
    reveal: "Ausências na tabela numerológica indicam lições que a alma ainda não aprendeu — e que drenam sua energia sem você perceber.",
  },
  {
    icon: "◈",
    question: "Por que certas situações continuam se repetindo na sua vida?",
    reveal: "A Lição Cármica codificada no seu nome revela o padrão central de repetição e o caminho exato para transcendê-lo.",
  },
  {
    icon: "◈",
    question: "Qual profissão ou missão está alinhada com a vibração da sua alma?",
    reveal: "O Número da Expressão mapeia seus talentos naturais e os campos onde você encontrará fluxo, propósito e abundância.",
  },
];

export default function TeasersSection({ onScrollToForm }: { onScrollToForm: () => void }) {
  return (
    <section className="py-24 px-4 bg-[#070510] relative overflow-hidden">
      {/* Atmospheric glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-24 bg-gradient-to-b from-transparent to-[#c9a84c]" />

      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <span className="inline-block text-[#c9a84c] text-xs font-body tracking-[0.3em] uppercase mb-4">
            Respostas que sua leitura traz
          </span>
          <h2 className="font-sans text-3xl md:text-5xl font-bold text-[#f0e6c8] mb-4 text-balance">
            Perguntas que ficaram{" "}
            <span className="gold-gradient-text">sem resposta</span>{" "}
            até hoje
          </h2>
          <p className="font-body text-[#a89070] text-lg max-w-xl mx-auto leading-relaxed">
            Os registros akáshicos guardam respostas que a mente racional não consegue acessar. A numerologia é a chave.
          </p>
        </div>

        <div className="space-y-4 mb-14">
          {TEASERS.map((t, i) => (
            <details
              key={i}
              className="group mystical-card rounded-xl overflow-hidden cursor-pointer"
            >
              <summary className="flex items-center gap-4 p-5 list-none select-none hover:bg-[rgba(201,168,76,0.05)] transition-colors duration-200">
                <span className="text-[#c9a84c] text-xl font-sans">{t.icon}</span>
                <span className="font-sans text-[#f0e6c8] text-base md:text-lg font-medium flex-1 text-balance">
                  {t.question}
                </span>
                <span className="text-[#c9a84c] text-sm transition-transform duration-300 group-open:rotate-45 ml-2">
                  +
                </span>
              </summary>
              <div className="px-5 pb-5 pt-1">
                <div className="h-px bg-[rgba(201,168,76,0.15)] mb-4" />
                <p className="font-body text-[#a89070] text-sm leading-relaxed">
                  {t.reveal}
                </p>
              </div>
            </details>
          ))}
        </div>

        {/* Final CTA */}
        <div className="text-center p-10 rounded-2xl mystical-card border border-[rgba(201,168,76,0.25)]">
          <p className="font-sans text-2xl md:text-3xl font-bold text-[#f0e6c8] mb-3 text-balance">
            A leitura completa e personalizada está disponível agora.
          </p>
          <p className="font-body text-[#a89070] mb-8 max-w-lg mx-auto leading-relaxed">
            Incluindo previsões para os próximos 12–24 meses, compatibilidade amorosa profunda, caminhos de manifestação de abundância e orientação para ascensão espiritual.
          </p>
          <p className="font-body text-[#c9a84c] text-sm font-semibold mb-6 tracking-wide">
            Não deixe esses segredos escaparem — eles foram escritos para você desde o nascimento.
          </p>
          <button
            onClick={onScrollToForm}
            className="group relative px-10 py-4 rounded-full bg-[#c9a84c] text-[#0a0812] font-body font-bold text-base tracking-wide overflow-hidden hover:shadow-[0_0_40px_rgba(201,168,76,0.5)] hover:scale-105 transition-all duration-300 animate-pulse-gold"
          >
            <span className="relative z-10">Quero meu mapa agora — é gratuito</span>
            <span className="absolute inset-0 bg-[#f0d080] translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-300" />
          </button>
        </div>
      </div>
    </section>
  );
}
