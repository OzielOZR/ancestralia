export default async function handler(req, res) {
  // Permite chamadas do seu site
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

    const prompt = `Você é um especialista em antropologia física e numerologia cabalística. Analise a foto e os dados fornecidos e gere um relatório estruturado em JSON.

Nome: ${name}
Data de Nascimento: ${birthDate}

Gere EXATAMENTE o seguinte JSON (sem markdown, sem explicações, apenas o JSON puro):

{
  "ancestralidade": {
    "regioes_reveladas": [
      {"regiao": "nome da região 1", "porcentagem": 35},
      {"regiao": "nome da região 2", "porcentagem": 28}
    ],
    "regioes_bloqueadas": [
      {"regiao": "nome da região 3", "porcentagem": 20},
      {"regiao": "nome da região 4", "porcentagem": 10},
      {"regiao": "nome da região 5", "porcentagem": 5},
      {"regiao": "nome da região 6", "porcentagem": 2}
    ],
    "narrativa_completa": "3 parágrafos poéticos e envolventes sobre a história ancestral desta pessoa baseado nos traços faciais"
  },
  "numerologia": {
    "numero_personalidade": 7,
    "personalidade_teaser": "Duas linhas que começam a revelar o significado do número mas não completam — deixe o leitor curioso",
    "personalidade_completa": "Análise completa de 2 parágrafos do número de personalidade",
    "missao_vida": "Um parágrafo poderoso e completo sobre a missão de vida desta pessoa — deve soar único, poderoso e positivo",
    "vocacao_teaser": "Uma linha sobre possível vocação, incompleta propositalmente, termine com reticências",
    "vocacao_completa": "Análise completa das vocações e talentos",
    "ano_pessoal": 6,
    "ano_teaser": "Descrição parcial do ano pessoal atual, incompleta, termine com reticências",
    "ano_completo": "Análise completa do ano pessoal 2025 com orientações",
    "compatibilidade": "Análise de compatibilidade numerológica completa"
  }
}

Regras:
- As porcentagens devem somar exatamente 100%
- Tom: místico, sofisticado, profundo, pessoal
- Baseie a ancestralidade nos traços faciais visíveis na foto
- O número de personalidade deve ser calculado das consoantes do nome (sistema cabalístico)
- É para entretenimento e autoconhecimento, não diagnóstico médico`;

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
          generationConfig: { temperature: 0.8, maxOutputTokens: 2000 }
        })
      }
    );

    const data = await response.json();

    if (!data.candidates || !data.candidates[0]) {
      throw new Error('Resposta inválida do Gemini');
    }

    const text = data.candidates[0].content.parts[0].text;
    const clean = text.replace(/```json|```/g, '').trim();
    const result = JSON.parse(clean);

    return res.status(200).json(result);

  } catch (err) {
    console.error('Erro:', err);
    return res.status(500).json({ error: 'Erro na análise', details: err.message });
  }
}
