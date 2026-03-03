const CABAL = {A:1,B:2,C:3,D:4,E:5,F:6,G:7,H:8,I:9,J:1,K:2,L:3,M:4,N:5,O:6,P:7,Q:8,R:9,S:1,T:2,U:3,V:4,W:5,X:6,Y:7,Z:8};
const VOWELS = new Set(['A','E','I','O','U']);
function norm(s){return s.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toUpperCase().replace(/[^A-Z]/g,' ');}
function reduce(n){if(n===11||n===22||n===33)return n;while(n>9){n=String(n).split('').reduce((a,b)=>a+Number(b),0);}return n;}

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin','*');
  res.setHeader('Access-Control-Allow-Methods','POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers','Content-Type');
  if(req.method==='OPTIONS') return res.status(200).end();
  if(req.method!=='POST') return res.status(405).json({error:'Método não permitido'});

  try {
    const {photoBase64, name, birthDate} = req.body;
    if(!photoBase64||!name||!birthDate) return res.status(400).json({error:'Dados incompletos'});

    const KEY = process.env.GEMINI_API_KEY;
    if(!KEY) return res.status(500).json({error:'Chave API não configurada'});

    const clean = norm(name);
    const letters = clean.split('').filter(c=>c!==' ');
    const expressao = reduce(letters.reduce((a,c)=>a+(CABAL[c]||0),0));
    const alma = reduce(letters.filter(c=>VOWELS.has(c)).reduce((a,c)=>a+(CABAL[c]||0),0));
    const personalidade = reduce(letters.filter(c=>!VOWELS.has(c)&&CABAL[c]).reduce((a,c)=>a+(CABAL[c]||0),0));
    const [y,m,d] = birthDate.split('-').map(Number);
    const caminho = reduce([...String(d),...String(m),...String(y)].map(Number).reduce((a,b)=>a+b,0));
    const anoAtual = new Date().getFullYear();
    const anoP = reduce([...String(d),...String(m),...String(anoAtual)].map(Number).reduce((a,b)=>a+b,0));

    const prompt = `Você é um psicólogo junguiano e mestre em numerologia cabalística. Os números foram calculados com precisão matemática — NÃO recalcule.

DADOS:
Nome: ${name}
Nascimento: ${birthDate}
Expressão/Destino: ${expressao}
Caminho de Vida: ${caminho}
Alma/Motivação: ${alma}
Personalidade: ${personalidade}
Ano Pessoal ${anoAtual}: ${anoP}

Analise a foto para identificar origens ancestrais pelos traços fenotípicos.

REGRAS ABSOLUTAS:
- Responda APENAS com JSON válido, sem markdown, sem texto antes ou depois
- Mínimo 150 palavras por campo de texto longo
- Seja ESPECÍFICO para ${name} e para os números exatos — nada genérico
- Porcentagens das regiões somam EXATAMENTE 100
- Use segunda pessoa (você) nos textos
- Tom: psicológico profundo, literário, revelador — não esotérico barato

JSON a retornar:

{
  "ancestralidade": {
    "regioes": [
      {"regiao": "nome da região real", "porcentagem": 35},
      {"regiao": "nome da região real", "porcentagem": 25},
      {"regiao": "nome da região real", "porcentagem": 18},
      {"regiao": "nome da região real", "porcentagem": 12},
      {"regiao": "nome da região real", "porcentagem": 7},
      {"regiao": "nome da região real", "porcentagem": 3}
    ],
    "narrativa": "Três parágrafos longos (min 120 palavras cada) separados por \\n\\n. Sobre as origens ancestrais identificadas na foto — civilizações reais, rios, impérios, contribuições históricas. Tom poético e revelador. Cite as regiões identificadas.",
    "narrativa_completa": "Cinco parágrafos longos (min 150 palavras cada) separados por \\n\\n. Aprofunde cada região — história específica, como esses traços se manifestam em ${name} hoje, legado cultural e genético. Tom literário rico."
  },
  "numerologia": {
    "expressao": ${expressao},
    "expressao_nome": "arquétipo específico do número ${expressao}",
    "caminho_vida": ${caminho},
    "caminho_nome": "arquétipo do número ${caminho}",
    "alma": ${alma},
    "alma_nome": "arquétipo do número ${alma}",
    "personalidade": ${personalidade},
    "personalidade_nome": "arquétipo do número ${personalidade}",
    "ano_pessoal": ${anoP},
    "ano_pessoal_tema": "tema de 4-6 palavras para ano ${anoP}",

    "personalidade_analise": "Quatro parágrafos longos (min 150 palavras cada) separados por \\n\\n. Analise a psicologia profunda de ${name} com número de expressão ${expressao} e caminho ${caminho}. Como essa combinação molda a forma de pensar, sentir, tomar decisões, se relacionar. Cite ${name} pelo menos 3 vezes. Seja ESPECÍFICO para estes números, não escreva texto que poderia servir para qualquer pessoa.",

    "virtudes": [
      {"nome": "nome da virtude específica do número ${expressao}", "desc": "Três linhas descrevendo como essa força se manifesta no comportamento real e cotidiano de ${name}. Com exemplos situacionais concretos."},
      {"nome": "segunda virtude", "desc": "descrição com exemplos"},
      {"nome": "terceira virtude", "desc": "descrição com exemplos"},
      {"nome": "quarta virtude", "desc": "descrição com exemplos"}
    ],

    "defeitos": [
      {"nome": "nome do padrão sombrio do número ${expressao}", "desc": "Como esse padrão se manifesta em situações concretas do dia a dia de ${name}. O que dispara. Como se sente por dentro. Um caminho prático e específico de transformação."},
      {"nome": "segundo padrão", "desc": "manifestação real e transformação"},
      {"nome": "terceiro padrão", "desc": "manifestação real e transformação"},
      {"nome": "quarto padrão", "desc": "manifestação real e transformação"}
    ],

    "pontos_cegos": [
      {"nome": "ponto cego específico do número ${expressao}", "desc": "O que ${name} genuinamente não consegue ver em si mesmo. Como isso se manifesta nas relações e decisões. Por que é tão difícil de enxergar."},
      {"nome": "segundo ponto cego", "desc": "descrição específica"},
      {"nome": "terceiro ponto cego", "desc": "descrição específica"}
    ],

    "sombra_analise": "Três parágrafos longos (min 120 palavras cada) separados por \\n\\n. A sombra junguiana do número ${expressao} aplicada a ${name}. Padrões inconscientes, medos que dirigem comportamentos sem que ${name} perceba, crenças limitantes centrais. Mencione Jung se relevante. Tom honesto e compassivo.",

    "missao_vida": "Três parágrafos longos (min 150 palavras cada) separados por \\n\\n. A missão de vida da combinação expressão ${expressao} + caminho ${caminho}. O que ${name} veio fazer nesta encarnação. Como reconhece quando está no caminho. O legado que pode deixar. Tom revelador, não vago.",

    "persuasao": "Quatro parágrafos longos (min 130 palavras cada) separados por \\n\\n. Como ${name} é persuadido e manipulado — seus gatilhos emocionais reais, o que penetra suas defesas racionais, o que cria resistência absoluta, onde é mais vulnerável à manipulação. Como usar esse autoconhecimento para tomar decisões mais conscientes. ESPECÍFICO para os números ${expressao}/${caminho}/${alma}.",

    "amor": "Três parágrafos longos (min 150 palavras cada) separados por \\n\\n. Como ${name} se comporta em relacionamentos amorosos — padrões inconscientes de atração, o que sabota, o que faz florescer. Compatibilidade específica com outros números. Não seja genérico.",

    "lideranca": {
      "habilidades": [
        {"nome": "Visão Estratégica", "valor": 82},
        {"nome": "Influência Natural", "valor": 75},
        {"nome": "Gestão de Conflitos", "valor": 60},
        {"nome": "Comunicação", "valor": 78},
        {"nome": "Análise de Situação", "valor": 88},
        {"nome": "Inteligência Emocional", "valor": 71}
      ],
      "analise": "Três parágrafos longos (min 120 palavras cada) separados por \\n\\n. Estilo de liderança específico de ${name} com número ${expressao}. Como lidera naturalmente, onde brilha, onde tropeça, que tipo de equipe funciona melhor."
    },

    "ano_pessoal_analise": "Três parágrafos (min 110 palavras cada) separados por \\n\\n. O que significa o Ano Pessoal ${anoP} em ${anoAtual} para ${name} especificamente. Oportunidades concretas, armadilhas a evitar, orientações práticas por período do ano."
  }
}`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=${KEY}`,
      {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          contents: [{
            parts: [
              {inline_data: {mime_type: 'image/jpeg', data: photoBase64}},
              {text: prompt}
            ]
          }],
          generationConfig: {temperature: 0.85, maxOutputTokens: 8192}
        })
      }
    );

    if (!response.ok) {
      const err = await response.text();
      console.error('Gemini error:', err);
      return res.status(500).json({error: 'Erro Gemini', details: err});
    }

    const data = await response.json();
    if (!data.candidates?.[0]) {
      return res.status(500).json({error: 'Sem resposta', raw: data});
    }

    const text = data.candidates[0].content.parts[0].text;
    const cleaned = text.replace(/```json\n?/g,'').replace(/```\n?/g,'').trim();

    let result;
    try {
      result = JSON.parse(cleaned);
    } catch(e) {
      console.error('Parse error:', e.message, cleaned.substring(0,300));
      return res.status(500).json({error: 'JSON inválido', raw: cleaned.substring(0,300)});
    }

    return res.status(200).json(result);

  } catch(err) {
    console.error('Handler error:', err);
    return res.status(500).json({error: 'Erro interno', details: err.message});
  }
};