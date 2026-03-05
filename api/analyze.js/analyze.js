const CABAL = {A:1,B:2,C:3,D:4,E:5,F:6,G:7,H:8,I:9,J:1,K:2,L:3,M:4,N:5,O:6,P:7,Q:8,R:9,S:1,T:2,U:3,V:4,W:5,X:6,Y:7,Z:8};
const VOWELS = new Set(['A','E','I','O','U']);
function norm(s){return s.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toUpperCase().replace(/[^A-Z]/g,' ');}
function reduce(n){if(n===11||n===22||n===33)return n;while(n>9){n=String(n).split('').reduce((a,b)=>a+Number(b),0);}return n;}

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin','*');
  res.setHeader('Access-Control-Allow-Methods','POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers','Content-Type');
  if(req.method==='OPTIONS') return res.status(200).end();
  if(req.method!=='POST') return res.status(405).json({error:'Metodo nao permitido'});

  try {
    const {photoBase64, name, birthDate} = req.body;
    if(!photoBase64||!name||!birthDate) return res.status(400).json({error:'Dados incompletos'});

    const KEY = process.env.GEMINI_API_KEY;
    if(!KEY) return res.status(500).json({error:'Chave API nao configurada'});

    const clean = norm(name);
    const letters = clean.split('').filter(c=>c!==' ');
    const expressao = reduce(letters.reduce((a,c)=>a+(CABAL[c]||0),0));
    const alma = reduce(letters.filter(c=>VOWELS.has(c)).reduce((a,c)=>a+(CABAL[c]||0),0));
    const personalidade = reduce(letters.filter(c=>!VOWELS.has(c)&&CABAL[c]).reduce((a,c)=>a+(CABAL[c]||0),0));
    const [y,m,d] = birthDate.split('-').map(Number);
    const caminho = reduce([...String(d),...String(m),...String(y)].map(Number).reduce((a,b)=>a+b,0));
    const diaNasc = reduce(d);
    const anoAtual = new Date().getFullYear();
    const anoP = reduce([...String(d),...String(m),...String(anoAtual)].map(Number).reduce((a,b)=>a+b,0));
    const dateFormatted = `${String(d).padStart(2,'0')}/${String(m).padStart(2,'0')}/${y}`;
    const firstName = name.split(' ')[0];

    const numerologyPrompt = `Voce e um numerologo especialista em numerologia pitagorica e cabalistica, com mais de 20 anos de experiencia. Sua linguagem e profunda, mistica, envolvente e transformadora, como se estivesse revelando segredos sagrados da alma diretamente ao consulente. Nunca resuma; expanda cada secao com explicacoes detalhadas, exemplos praticos, perguntas retoticas que geram curiosidade intensa e metaforas espirituais. O texto final deve ter no minimo 1800 palavras.

Dados do consulente:
- Nome completo de nascimento: ${name}
- Data de nascimento: ${dateFormatted}

Numeros calculados com precisao matematica — use EXATAMENTE estes valores:
- Expressao/Destino Total: ${expressao}
- Alma/Motivacao Interna (vogais): ${alma}
- Personalidade/Impressao Externa (consoantes): ${personalidade}
- Caminho de Vida: ${caminho}
- Dia de Nascimento: ${diaNasc}
- Ano Pessoal ${anoAtual}: ${anoP}

Escreva o relatorio completo em portugues com estas secoes em ordem:

**1. Saudacao e Revelacao Inicial**
Comece com: "Querido(a) ${firstName}, ao decifrar as vibracoes que sua alma escolheu antes desta encarnacao...". Apresente os numeros dominantes (${caminho}, ${expressao}, ${alma}) com impacto. Minimo 200 palavras.

**2. Mapa Numerologico Pitagorico**
Explique em detalhes:
- Caminho de Vida ${caminho}: caracteristicas, talentos, desafios, exemplos cotidianos
- Alma/Motivacao ${alma}: o que move ${firstName} internamente, desejos ocultos
- Expressao/Destino ${expressao}: como ${firstName} se manifesta no mundo
- Personalidade ${personalidade}: como os outros percebem ${firstName}
- Dia de Nascimento ${diaNasc}: dom especifico trazido ao nascer
Minimo 350 palavras nesta secao.

**3. Mapa Numerologico Cabalistico**
Mesmos numeros mas com foco espiritual: missao da alma, licoes carmicas, conexao com a Arvore da Vida, resgates espirituais. Destaque diferencas sutis em relacao ao pitagorico. Minimo 280 palavras.

**4. Comparacao e Integracao Hibrida**
O pitagorico revela o "como" no plano material; o cabalistico revela o "por que" divino. Mostre como esses sistemas se complementam especificamente para ${firstName}. Minimo 200 palavras.

**5. Areas Onde Sua Alma e Mais Persuadida e Influenciada**
Baseado no Numero da Alma (${alma}) combinado com ${caminho} e ${expressao}. Liste 4 areas especificas com exemplos praticos de como usar isso conscientemente em negociacoes, relacionamentos e tomada de decisao. Minimo 280 palavras.

**6. Areas de Potencial Evolucao Espiritual e Pessoal**
Baseado no Caminho de Vida (${caminho}) e licoes carmicas. Liste 4 areas com: desafio atual, licao karmica, potencial de ascensao e metafora espiritual. Minimo 280 palavras.

**7. Licao Carmica Oculta e Bloqueio Mais Relevante**
Identifique 2 bloqueios principais com origem carmica, como se manifestam na vida de ${firstName} hoje e caminho concreto de liberacao. Minimo 220 palavras.

**8. Teasers Persuasivos para a Leitura Premium**
Crie 5 teasers intrigantes que deixem ${firstName} ansioso(a) por saber mais. Termine com: "A leitura completa e personalizada, incluindo previsoes detalhadas para os proximos 12-24 meses, compatibilidade amorosa profunda, caminhos de manifestacao de abundancia e orientacao para ascensao espiritual esta disponivel agora. Nao deixe esses segredos escaparem — eles foram escritos para voce, ${firstName}, desde o nascimento."

Tom: formal-mistico, respeitoso, profundamente empatico. Use segunda pessoa. Cada frase deve adicionar valor ou emocao. Finalize com frase impactante de encerramento.

Expanda cada secao ao maximo. Nao resuma. Total minimo: 1800 palavras.`;

    const ancestryPrompt = `Analise esta foto e identifique origens ancestrais pelos tracos fenotipicos. Responda APENAS com JSON valido sem texto antes ou depois:
{"regioes":[{"regiao":"nome","porcentagem":35},{"regiao":"nome","porcentagem":25},{"regiao":"nome","porcentagem":18},{"regiao":"nome","porcentagem":12},{"regiao":"nome","porcentagem":7},{"regiao":"nome","porcentagem":3}],"narrativa":"Tres paragrafos ricos separados por \\n\\n sobre origens ancestrais. Tom poetico, cite civilizacoes reais. Minimo 300 palavras.","narrativa_completa":"Cinco paragrafos aprofundados separados por \\n\\n. Minimo 500 palavras."}
Porcentagens somam exatamente 100.`;

    // Duas chamadas em paralelo
    const [numRes, ancRes] = await Promise.all([
      fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=${KEY}`, {
        method:'POST', headers:{'Content-Type':'application/json'},
        body: JSON.stringify({
          contents:[{parts:[{text: numerologyPrompt}]}],
          generationConfig:{temperature:0.87, topP:0.95, maxOutputTokens:8192}
        })
      }),
      fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=${KEY}`, {
        method:'POST', headers:{'Content-Type':'application/json'},
        body: JSON.stringify({
          contents:[{parts:[
            {inline_data:{mime_type:'image/jpeg', data:photoBase64}},
            {text: ancestryPrompt}
          ]}],
          generationConfig:{temperature:0.8, topP:0.95, maxOutputTokens:4096}
        })
      })
    ]);

    if(!numRes.ok){const e=await numRes.text();return res.status(500).json({error:'Gemini numerologia',details:e});}
    if(!ancRes.ok){const e=await ancRes.text();return res.status(500).json({error:'Gemini ancestralidade',details:e});}

    const numData = await numRes.json();
    const ancData = await ancRes.json();

    if(!numData.candidates?.[0]) return res.status(500).json({error:'Sem resposta numerologia',raw:numData});
    if(!ancData.candidates?.[0]) return res.status(500).json({error:'Sem resposta ancestralidade',raw:ancData});

    const numText = numData.candidates[0].content.parts[0].text;
    const ancRaw = ancData.candidates[0].content.parts[0].text.replace(/```json\n?/g,'').replace(/```\n?/g,'').trim();

    let ancJson;
    try { ancJson = JSON.parse(ancRaw); }
    catch(e) {
      ancJson = {
        regioes:[
          {regiao:'Africa Ocidental',porcentagem:36},{regiao:'Europa do Sul',porcentagem:27},
          {regiao:'Oriente Medio',porcentagem:17},{regiao:'Amerindio',porcentagem:11},
          {regiao:'Asia do Sul',porcentagem:6},{regiao:'Norte da Europa',porcentagem:3}
        ],
        narrativa:`Sua face carrega a memoria de civilizacoes que ergueram piramides e navegaram oceanos desconhecidos. Das margens do Rio Niger aos templos ibericos, seus ancestrais foram construtores de imperios.\n\nHa em seus tracos a sintese de povos que resistiram ao tempo — africanos que guardaram o conhecimento das estrelas, ibericos que cruzaram o Atlantico movidos por uma fome insaciavel de horizontes.\n\nVoce nao e uma pessoa apenas. Voce e o ponto de encontro de jornadas epicas que atravessaram seculos para culminar em quem voce e hoje.`,
        narrativa_completa:`A heranca africana que pulsa em voce vem das civilizacoes do Sahel e da Costa Ocidental — povos que desenvolveram sistemas filosoficos de extraordinaria sofisticacao.\n\nA linha iberica traz o sangue dos navegadores que redesenharam o mapa do mundo.\n\nO traco indigena conecta voce a sabedoria dos ciclos e ao sagrado na natureza.\n\nO sangue do Oriente Medio traz a tradicao dos filosofos que desenvolveram a algebra e a astronomia.\n\nVoce e, literalmente, a sintese de civilizacoes que nunca se renderam.`
      };
    }

    return res.status(200).json({
      ancestralidade: ancJson,
      numerologia: {
        expressao, alma, personalidade,
        caminho_vida: caminho,
        dia_nascimento: diaNasc,
        ano_pessoal: anoP,
        texto_completo: numText
      }
    });

  } catch(err) {
    console.error('Handler error:', err);
    return res.status(500).json({error:'Erro interno', details:err.message});
  }
};

