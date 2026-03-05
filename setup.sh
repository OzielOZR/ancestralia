#!/bin/bash
# Remove pasta corrompida e recria arquivo correto
rm -rf /workspaces/ancestralia/api/analyze.js
rm -f /workspaces/ancestralia/vercel.json

# Cria analyze.js
cat > /workspaces/ancestralia/api/analyze.js << 'EOF'
const CABAL={A:1,B:2,C:3,D:4,E:5,F:6,G:7,H:8,I:9,J:1,K:2,L:3,M:4,N:5,O:6,P:7,Q:8,R:9,S:1,T:2,U:3,V:4,W:5,X:6,Y:7,Z:8};
const VOWELS=new Set(['A','E','I','O','U']);
function norm(s){return s.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toUpperCase().replace(/[^A-Z]/g,' ');}
function reduce(n){if(n===11||n===22||n===33)return n;while(n>9){n=String(n).split('').reduce((a,b)=>a+Number(b),0);}return n;}
module.exports=async function handler(req,res){
  res.setHeader('Access-Control-Allow-Origin','*');
  res.setHeader('Access-Control-Allow-Methods','POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers','Content-Type');
  if(req.method==='OPTIONS')return res.status(200).end();
  if(req.method!=='POST')return res.status(405).json({error:'Metodo nao permitido'});
  try{
    const{photoBase64,name,birthDate}=req.body;
    if(!photoBase64||!name||!birthDate)return res.status(400).json({error:'Dados incompletos'});
    const KEY=process.env.GEMINI_API_KEY;
    if(!KEY)return res.status(500).json({error:'SEM CHAVE API'});
    const clean=norm(name);
    const letters=clean.split('').filter(c=>c!==' ');
    const ex=reduce(letters.reduce((a,c)=>a+(CABAL[c]||0),0));
    const al=reduce(letters.filter(c=>VOWELS.has(c)).reduce((a,c)=>a+(CABAL[c]||0),0));
    const pe=reduce(letters.filter(c=>!VOWELS.has(c)&&CABAL[c]).reduce((a,c)=>a+(CABAL[c]||0),0));
    const[y,m,d]=birthDate.split('-').map(Number);
    const cv=reduce([...String(d),...String(m),...String(y)].map(Number).reduce((a,b)=>a+b,0));
    const dn=reduce(d);
    const ano=new Date().getFullYear();
    const ap=reduce([...String(d),...String(m),...String(ano)].map(Number).reduce((a,b)=>a+b,0));
    const df=String(d).padStart(2,'0')+'/'+String(m).padStart(2,'0')+'/'+y;
    const fn=name.split(' ')[0];
    const np=`Voce e um numerologo especialista pitagorico e cabalistico com 20 anos de experiencia. Linguagem profunda, mistica, transformadora. NUNCA resuma — expanda com exemplos, perguntas retoticas e metaforas. Minimo 2000 palavras.\n\nNome: ${name}\nNascimento: ${df}\nExpressao: ${ex}\nCaminho de Vida: ${cv}\nAlma: ${al}\nPersonalidade: ${pe}\nDia: ${dn}\nAno Pessoal ${ano}: ${ap}\n\nEscreva em portugues com estas secoes exatas:\n\n**1. Saudacao e Revelacao Inicial**\n"Querido(a) ${fn}, ao decifrar as vibracoes que sua alma escolheu antes desta encarnacao..." — apresente os numeros ${cv}, ${ex}, ${al} com impacto emocional profundo. Minimo 250 palavras.\n\n**2. Mapa Numerologico Pitagorico**\nCaminho ${cv}, Alma ${al}, Expressao ${ex}, Personalidade ${pe}, Dia ${dn}. Caracteristicas unicas, talentos ocultos, desafios reais, exemplos cotidianos especificos para ${fn}. Minimo 400 palavras.\n\n**3. Mapa Numerologico Cabalistico**\nMesmos numeros mas foco espiritual: missao da alma, licoes carmicas, Arvore da Vida, conexao com o divino. Minimo 300 palavras.\n\n**4. Integracao Pitagorico-Cabalistico**\nComo os dois sistemas revelam o "como" material e o "por que" divino de ${fn}. Minimo 200 palavras.\n\n**5. Onde Sua Alma e Persuadida**\nAlma ${al} + Caminho ${cv}. 4 areas especificas com exemplos em negocios, amor, decisoes. Minimo 300 palavras.\n\n**6. Evolucao Espiritual e Pessoal**\nCaminho ${cv}. 4 areas com desafio, licao karmica, potencial de ascensao, metafora espiritual. Minimo 300 palavras.\n\n**7. Licao Karmica e Bloqueio Oculto**\n2 bloqueios com origem karmica, como se manifestam hoje em ${fn} e caminho de liberacao. Minimo 250 palavras.\n\n**8. O Que Seu Futuro Guarda**\n5 teasers profundos e intrigantes sobre o que a leitura completa revela. Finalize: "A leitura completa esta disponivel agora. Nao deixe esses segredos escaparem — foram escritos para voce, ${fn}, desde o nascimento."\n\nExpanda TUDO ao maximo. Minimo absoluto: 2000 palavras.`;
    const ancp=`Analise esta foto e identifique origens ancestrais. Responda APENAS JSON valido:\n{"regioes":[{"regiao":"Africa Ocidental","porcentagem":36},{"regiao":"Europa do Sul","porcentagem":27},{"regiao":"Oriente Medio","porcentagem":17},{"regiao":"Amerindio","porcentagem":11},{"regiao":"Asia do Sul","porcentagem":6},{"regiao":"Norte Europa","porcentagem":3}],"narrativa":"tres paragrafos poeticos separados por \\n\\n sobre as origens identificadas na foto, citando civilizacoes reais, rios, imperios historicos. Minimo 300 palavras.","narrativa_completa":"cinco paragrafos aprofundados separados por \\n\\n explorando cada regiao — historia, contribuicoes culturais, como se manifestam em ${name} hoje. Minimo 500 palavras."}\nPorcentagens somam 100. Substitua as regioes pelas reais identificadas na foto.`;
    const[nr,ar]=await Promise.all([
      fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=${KEY}`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({contents:[{parts:[{text:np}]}],generationConfig:{temperature:0.87,topP:0.95,maxOutputTokens:8192}})}),
      fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=${KEY}`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({contents:[{parts:[{inline_data:{mime_type:'image/jpeg',data:photoBase64}},{text:ancp}]}],generationConfig:{temperature:0.8,maxOutputTokens:4096}})})
    ]);
    if(!nr.ok){const e=await nr.text();return res.status(500).json({error:'Gemini num erro',details:e});}
    if(!ar.ok){const e=await ar.text();return res.status(500).json({error:'Gemini anc erro',details:e});}
    const nd=await nr.json();const ad=await ar.json();
    if(!nd.candidates?.[0])return res.status(500).json({error:'Sem resp num',raw:nd});
    if(!ad.candidates?.[0])return res.status(500).json({error:'Sem resp anc',raw:ad});
    const nt=nd.candidates[0].content.parts[0].text;
    const ancRaw=ad.candidates[0].content.parts[0].text.replace(/```json\n?/g,'').replace(/```\n?/g,'').trim();
    let ancJ;
    try{ancJ=JSON.parse(ancRaw);}catch(e){ancJ={regioes:[{regiao:'Africa Ocidental',porcentagem:36},{regiao:'Europa do Sul',porcentagem:27},{regiao:'Oriente Medio',porcentagem:17},{regiao:'Amerindio',porcentagem:11},{regiao:'Asia do Sul',porcentagem:6},{regiao:'Norte Europa',porcentagem:3}],narrativa:'Sua face carrega memorias de civilizacoes que ergueram piramides.\n\nSeus ancestrais navegaram oceanos para chegar ate voce.\n\nVoce e a sintese de multiplas jornadas epicas.',narrativa_completa:'Africa Ocidental pulsa com sabedoria dos imperios do Sahel.\n\nEuropa do Sul trouxe sangue de navegadores.\n\nOriente Medio contribuiu com filosofia e ciencia.\n\nAmerica indigena conecta voce a terra sagrada.\n\nVoce e um arquivo vivo de resistencia ancestral.'};}
    return res.status(200).json({ancestralidade:ancJ,numerologia:{expressao:ex,alma:al,personalidade:pe,caminho_vida:cv,dia_nascimento:dn,ano_pessoal:ap,texto_completo:nt}});
  }catch(e){console.error(e);return res.status(500).json({error:'Erro interno',details:e.message});}
};
EOF

echo '{"rewrites":[{"source":"/api/(.*)","destination":"/api/$1"},{"source":"/(.*)","destination":"/index.html"}]}' > /workspaces/ancestralia/vercel.json

echo "✅ Arquivos criados com sucesso!"
ls -la /workspaces/ancestralia/api/analyze.js
cat /workspaces/ancestralia/vercel.json
