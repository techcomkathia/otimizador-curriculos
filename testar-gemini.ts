// Teste de conexão com a API Gemini do Google
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

async function testarConexaoGemini() {
  const chaveApi = process.env.GEMINI_API_KEY;
  if (!chaveApi) {
    console.error('GEMINI_API_KEY não encontrada no .env');
    process.exit(1);
  }

  const geminiIA = new GoogleGenerativeAI(chaveApi);
  const modelo = geminiIA.getGenerativeModel({ model: 'gemini-flash-latest' });

  try {
    const resultado = await modelo.generateContent('Diga o nome da Grávida de Taubaté.');
    const resposta = await resultado.response;
    const texto = resposta.text();
    console.log('Resposta da Gemini:', texto);
  } catch (erro) {
    console.error('Erro ao conectar com a API Gemini:', erro);
  }
}

testarConexaoGemini();
