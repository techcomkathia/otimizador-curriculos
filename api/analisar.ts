// Função serverless para análise ATS usando Gemini
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Carrega a chave da API Gemini da variável de ambiente
const CHAVE_API_GEMINI = process.env.GEMINI_API_KEY;

if (!CHAVE_API_GEMINI) {
  throw new Error('GEMINI_API_KEY não definida nas variáveis de ambiente.');
}

const geminiIA = new GoogleGenerativeAI(CHAVE_API_GEMINI);

export default async function analisarCurriculo(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ erro: 'Método não permitido' });
  }

  try {
    const {
      informacoesPessoais,
      resumoProfissional,
      habilidades,
      experienciaProfissional,
      formacaoAcademica,
      projetos,
      idiomas,
      descricaoVaga
    } = req.body;

    // Monta o prompt para o Gemini
    const prompt = `Compare o currículo abaixo com a descrição da vaga e gere um ATS Score de 0 a 100, considerando compatibilidade de habilidades, experiência e requisitos.\n\nCurrículo:\nInformações Pessoais: ${informacoesPessoais}\nResumo Profissional: ${resumoProfissional}\nHabilidades: ${habilidades}\nExperiência Profissional: ${experienciaProfissional}\nFormação Acadêmica: ${formacaoAcademica}\nProjetos: ${projetos}\nIdiomas: ${idiomas}\n\nDescrição da Vaga:\n${descricaoVaga}\n\nResponda em JSON com os campos: pontuacao, resumo, pontosPositivos, pontosDeMelhoria.`;

    const modelo = geminiIA.getGenerativeModel({ model: 'gemini-pro' });
    const resultado = await modelo.generateContent(prompt);
    const resposta = await resultado.response;
    const texto = resposta.text();

    // Tenta converter a resposta em JSON
    let json;
    try {
      json = JSON.parse(texto);
    } catch (e) {
      // Se não for JSON válido, retorna texto bruto
      return res.status(200).json({ bruto: texto });
    }

    return res.status(200).json(json);
  } catch (erro) {
    return res.status(500).json({ erro: 'Erro ao analisar currículo', detalhes: erro?.toString() });
  }
}
