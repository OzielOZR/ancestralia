const TESTIMONIALS = [
  {
    initials: "A",
    name: "Ana Paula M.",
    city: "Belo Horizonte",
    text: "Nunca imaginei que números poderiam descrever minha personalidade com tanta precisão. A leitura mudou minha perspectiva sobre relacionamentos e carreira.",
    number: "Número 7",
  },
  {
    initials: "R",
    name: "Roberto C.",
    city: "Rio de Janeiro",
    text: "Sempre fui cético. Mas a leitura identificou um padrão de bloqueio financeiro que eu vivia há anos. Depois de entender a origem cármica, consegui mudar.",
    number: "Número 4",
  },
  {
    initials: "F",
    name: "Fernanda L.",
    city: "Curitiba",
    text: "A precisão é assustadora. A leitura cabalística revelou minha missão de alma com uma clareza que me fez chorar. Recomendo de coração.",
    number: "Número 9",
  },
  {
    initials: "M",
    name: "Marcos A.",
    city: "São Paulo",
    text: "Passei por um divórcio difícil e a leitura me ajudou a entender a lição que aquele ciclo trouxe. Hoje me sinto alinhado com meu propósito.",
    number: "Número 2",
  },
];

const STATS = [
  { value: "+12.400", label: "Leituras realizadas" },
  { value: "20+", label: "Anos de experiência" },
  { value: "98%", label: "Taxa de satisfação" },
  { value: "2", label: "Sistemas numerológicos" },
];

export default function SocialProofSection() {
  return (
    <section className="py-24 px-4 relative overflow-hidden">
      {/* Divider */}
      <div className="flex items-center gap-4 max-w-4xl mx-auto mb-16">
        <div className="flex-1 h-px bg-gradient-to-r from-transparent to-[rgba(201,168,76,0.3)]" />
        <span className="text-[#c9a84c] text-lg font-sans">✦</span>
        <div className="flex-1 h-px bg-gradient-to-l from-transparent to-[rgba(201,168,76,0.3)]" />
      </div>

      {/* Stats */}
      <div className="max-w-4xl mx-auto mb-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {STATS.map((stat, i) => (
            <div key={i} className="text-center">
              <p className="font-sans text-4xl md:text-5xl font-bold gold-gradient-text mb-1">
                {stat.value}
              </p>
              <p className="font-body text-[#a89070] text-sm tracking-wide">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Testimonials */}
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <span className="inline-block text-[#c9a84c] text-xs font-body tracking-[0.3em] uppercase mb-3">
            Transformações Reais
          </span>
          <h2 className="font-sans text-3xl md:text-4xl font-bold text-[#f0e6c8] text-balance">
            Almas que encontraram seu caminho
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {TESTIMONIALS.map((t, i) => (
            <div
              key={i}
              className="mystical-card rounded-2xl p-6 hover:border-[rgba(201,168,76,0.4)] transition-all duration-300"
            >
              <div className="flex items-start gap-4 mb-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-br from-[#c9a84c] to-[#8b6914] flex items-center justify-center text-[#0a0812] font-sans font-bold text-lg">
                  {t.initials}
                </div>
                <div>
                  <p className="font-sans font-semibold text-[#f0e6c8]">
                    {t.name}
                  </p>
                  <p className="font-body text-[#a89070] text-xs">
                    {t.city} · {t.number}
                  </p>
                </div>
                <div className="ml-auto">
                  <div className="flex gap-0.5">
                    {[...Array(5)].map((_, s) => (
                      <span key={s} className="text-[#c9a84c] text-sm">
                        ★
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              <p className="font-body text-[#a89070] text-sm leading-relaxed italic">
                {'"'}
                {t.text}
                {'"'}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
