const CABAL = {A:1,B:2,C:3,D:4,E:5,F:6,G:7,H:8,I:9,J:1,K:2,L:3,M:4,N:5,O:6,P:7,Q:8,R:9,S:1,T:2,U:3,V:4,W:5,X:6,Y:7,Z:8};
const VOWELS = new Set(['A','E','I','O','U']);

function normalize(s) {
  return s.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toUpperCase().replace(/[^A-Z]/g,' ');
}

function reduce(n) {
  if (n === 11 || n === 22 || n === 33) return n;
  while (n > 9) { n = String(n).split('').reduce((a,b) => a + Number(b), 0); }
  return n;
}

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Método não permitido' });

  try {
    const { photoBase64, name, birthDate } = req.body;
    if (!photoBase64 || !name || !birthDate) {
      return res.status(400).json({ error: 'Dados incompletos' });
    }

    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
    if (!GEMINI_API_KEY) {
      return res.status(500).json({ error: 'Chave API não configurada' });
    }

    // Cálculo cabalístico real
    const clean = normalize(name);
    const letters = clean.split('').filter(c => c !== ' ');
    const expressao = reduce(letters.reduce((a,c) => a + (CABAL[c] || 0), 0));
    const alma = reduce(letters.filter(c => VOWELS.has(c)).reduce((a,c) => a + (CABAL[c] || 0), 0));
    const personalidade = reduce(letters.filter(c => !VOWELS.has(c) && CABAL[c]).reduce((a,c) => a + (CABAL[c] || 0), 0));
    const [y,m,d] = birthDate.split('-').map(Number);
    const caminho_vida = reduce([...String(d),...String(m),...String(y)].map(Number).reduce((a,b) => a+b, 0));
    const anoAtual = new Date().getFullYear();
    const ano_pessoal = reduce([...String(d),...String(m),...String(anoAtual)].map(Number).reduce((a,b) => a+b, 0));

    const prompt = `Você é um mestre em numerologia cabalística e psicologia arquetípica profunda. Os números já foram calculados com precisão matemática:

Nome completo: ${name}
Data de nascimento: ${birthDate}
Número de Expressão/Destino: ${expressao}
Número do Caminho de Vida: ${caminho_vida}
Número da Alma/Motivação: ${alma}
Número de Personalidade: ${personalidade}
Ano Pessoal ${anoAtual}: ${ano_pessoal}

Analise a foto para identificar as origens ancestrais pelos traços fenotípicos.

RESPONDA APENAS COM JSON VÁLIDO, sem markdown, sem texto antes ou depois:

{
  "ancestralidade": {
    "regioes": [
      {"regiao": "Nome da região", "porcentagem": 35},
      {"regiao": "Nome da região", "porcentagem": 25},
      {"regiao": "Nome da região", "porcentagem": 18},
      {"regiao": "Nome da região", "porcentagem": 12},
      {"regiao": "Nome da região", "porcentagem": 7},
      {"regiao": "Nome da região", "porcentagem": 3}
    ],
    "heranca_cultural": "Resumo em uma linha da herança dominante",
    "narrativa": "ESCREVA 3 PARÁGRAFOS LONGOS separados por \\n\\n. Mínimo 120 palavras por parágrafo. Tom poético e revelador sobre a origem ancestral desta pessoa específica baseado nos traços faciais. Use a segunda pessoa. Cite civilizações reais, rios, montanhas, impérios históricos das regiões identificadas.",
    "narrativa_completa": "ESCREVA 5 PARÁGRAFOS LONGOS separados por \\n\\n. Mínimo 150 palavras cada. Aprofunde cada região ancestral identificada, suas civilizações, contribuições históricas únicas, como esses traços se manifestam fisicamente e culturalmente nesta pessoa. Tom literário rico em detalhes históricos específicos."
  },
  "numerologia": {
    "expressao": ${expressao},
    "expressao_nome": "arquétipo único e específico para o número ${expressao}",
    "caminho_vida": ${caminho_vida},
    "caminho_nome": "arquétipo para ${caminho_vida}",
    "alma": ${alma},
    "alma_nome": "arquétipo para ${alma}",
    "personalidade": ${personalidade},
    "personalidade_nome": "arquétipo para ${personalidade}",
    "ano_pessoal": ${ano_pessoal},
    "ano_pessoal_tema": "tema específico do ano ${ano_pessoal} em poucas palavras",
    "personalidade_analise": "ESCREVA 4 PARÁGRAFOS LONGOS separados por \\n\\n. Mínimo 150 palavras cada. Analise profundamente o número ${expressao} aplicado a esta pessoa específica chamada ${name}. Como esse número se manifesta no seu dia a dia, nas suas relações, nas suas escolhas. O que a move internamente. Como processa emoções. Seja ESPECÍFICO, não genérico. Mencione situações concretas da vida cotidiana.",
    "virtudes": [
      {"nome": "Nome da virtude específica do número ${expressao}", "desc": "Descrição de 3-4 linhas de como essa virtude se manifesta concretamente no comportamento diário de uma pessoa com número ${expressao}. Dê exemplos situacionais."},
      {"nome": "Segunda virtude", "desc": "Descrição específica com exemplos"},
      {"nome": "Terceira virtude", "desc": "Descrição específica com exemplos"},
      {"nome": "Quarta virtude", "desc": "Descrição específica com exemplos"}
    ],
    "defeitos": [
      {"nome": "Nome do desafio específico do número ${expressao}", "desc": "Como esse desafio se manifesta em situações reais do dia a dia. Como se sente por dentro. E um caminho concreto de transformação — não vago, mas específico e aplicável."},
      {"nome": "Segundo desafio", "desc": "Manifestação real e caminho de transformação"},
      {"nome": "Terceiro desafio", "desc": "Manifestação real e caminho de transformação"},
      {"nome": "Quarto desafio", "desc": "Manifestação real e caminho de transformação"}
    ],
    "sombra_analise": "ESCREVA 3 PARÁGRAFOS separados por \\n\\n. Mínimo 100 palavras cada. A sombra psicológica do número ${expressao} — os padrões inconscientes, os medos que dirigem comportamentos, as crenças limitantes. Tom: honesto, compassivo, transformador. Cite Carl Jung se relevante.",
    "missao_vida": "ESCREVA 3 PARÁGRAFOS LONGOS separados por \\n\\n. Mínimo 120 palavras cada. A missão de vida desta pessoa com expressão ${expressao} e caminho de vida ${caminho_vida}. Deve soar como uma revelação profunda e única. O que veio fazer neste plano. Como reconhece quando está no caminho certo. O legado que pode deixar.",
    "lideranca": {
      "habilidades": [
        {"nome": "Visão Estratégica", "valor": 82},
        {"nome": "Influência Natural", "valor": 71},
        {"nome": "Gestão de Conflitos", "valor": 58},
        {"nome": "Comunicação", "valor": 76},
        {"nome": "Tomada de Decisão", "valor": 85},
        {"nome": "Inteligência Emocional", "valor": 69}
      ],
      "analise": "ESCREVA 3 PARÁGRAFOS separados por \\n\\n. Mínimo 120 palavras cada. Estilo de liderança específico do número ${expressao}. Como lidera naturalmente, onde brilha, onde tropeça. Que tipo de equipe funciona melhor com esse perfil. Exemplos concretos de situações de liderança."
    },
    "persuasao": "ESCREVA 4 PARÁGRAFOS LONGOS separados por \\n\\n. Mínimo 120 palavras cada. Como a pessoa com números ${expressao}/${caminho_vida}/${alma} é persuadida. Que argumentos penetram suas defesas. Que gatilhos emocionais ativam. O que cria resistência absoluta. Como usar esse autoconhecimento para tomar decisões mais conscientes. SEJA ESPECÍFICO para estes números, não genérico.",
    "amor": "ESCREVA 3 PARÁGRAFOS LONGOS separados por \\n\\n. Mínimo 130 palavras cada. Como esta pessoa com número ${expressao} e alma ${alma} se comporta em relacionamentos amorosos. Seus padrões inconscientes de atração. O que sabota seus relacionamentos. O que precisa para florescer num relacionamento. Compatibilidade específica com outros números.",
    "vocacoes": "ESCREVA 3 PARÁGRAFOS LONGOS separados por \\n\\n. Mínimo 120 palavras cada. Vocações e talentos específicos dos números ${expressao}, ${caminho_vida} e ${alma} combinados. Carreiras específicas com exemplos. Ambientes de trabalho ideais e tóxicos. Como monetizar os talentos naturais.",
    "ano_pessoal_analise": "ESCREVA 3 PARÁGRAFOS separados por \\n\\n. Mínimo 100 palavras cada. O que significa estar no Ano Pessoal ${ano_pessoal} em ${anoAtual}. Oportunidades concretas deste ciclo. Armadilhas a evitar. Ações práticas recomendadas para cada trimestre do ano."
  }
}

REGRAS CRÍTICAS:
- Use os números EXATOS fornecidos acima — NÃO recalcule
- Porcentagens somam EXATAMENTE 100
- NUNCA escreva texto genérico que poderia se aplicar a qualquer pessoa
- SEMPRE mencione o nome ${name} pelo menos uma vez em cada seção longa
- Mínimo total de 3000 palavras no JSON completo
- JSON deve ser válido — sem vírgulas extras, sem caracteres especiais quebrados`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [
              { inline_data: { mime_type: 'image/jpeg', data: photoBase64 } },
              { text: prompt }
            ]
          }],
          generationConfig: {
            temperature: 0.9,
            maxOutputTokens: 8192
          }
        })
      }
    );

    if (!response.ok) {
      const errText = await response.text();
      console.error('Gemini error:', errText);
      return res.status(500).json({ error: 'Erro na API Gemini', details: errText });
    }

    const data = await response.json();

    if (!data.candidates || !data.candidates[0]) {
      console.error('Sem candidatos:', JSON.stringify(data));
      return res.status(500).json({ error: 'Resposta vazia do Gemini', raw: data });
    }

    const text = data.candidates[0].content.parts[0].text;
    const clean2 = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();

    let result;
    try {
      result = JSON.parse(clean2);
    } catch(parseErr) {
      console.error('JSON parse error:', parseErr.message);
      console.error('Raw text:', clean2.substring(0, 500));
      return res.status(500).json({ error: 'JSON inválido do Gemini', raw: clean2.substring(0, 500) });
    }

    return res.status(200).json(result);

  } catch (err) {
    console.error('Handler error:', err);
    return res.status(500).json({ error: 'Erro interno', details: err.message });
  }
};