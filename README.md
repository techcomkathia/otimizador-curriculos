
# Otimizador de Currículo

🚀 Otimize seu currículo para vagas com inteligência artificial e aumente suas chances em processos seletivos!

<div align="center">
	<img src="public/telasResponsivas.png" alt="Telas Responsivas - Apresentação do Projeto" width="80%" />
</div>

## ✨ Visão Geral

O ATS Resume Optimizer é uma aplicação web que compara seu currículo com a descrição de uma vaga, gera um score de compatibilidade (ATS Score) e sugere melhorias automáticas usando IA (Google Gemini). O sistema também gera um currículo otimizado, pronto para ser enviado ao recrutador.

## 🛠️ Tecnologias Utilizadas

- React + TypeScript
- Vite
- Tailwind CSS
- Radix UI
- Google Gemini API (IA generativa)
- Vercel Serverless Functions

## 🎯 Funcionalidades

- Formulário completo para preenchimento de currículo
- Importação/exportação de perfil em JSON
- Análise automática de compatibilidade com a vaga (ATS Score)
- Sugestões de melhorias personalizadas
- Geração de currículo otimizado com IA
- Download do currículo em PDF e DOC
- Interface responsiva, acessível e moderna

## 💡 Como funciona?

1. Preencha seu currículo e cole a descrição da vaga.
2. O sistema compara as informações e gera:
	 - Pontuação ATS
	 - Habilidades identificadas e faltantes
	 - Sugestões de melhoria
	 - Currículo otimizado
3. Baixe ou copie o currículo pronto para enviar!

### ⚙️ Como o projeto funciona na prática

O ATS Resume Optimizer permite que você preencha seu currículo, importe dados de experiências anteriores via JSON, analise sua compatibilidade com vagas específicas e exporte o resultado em diferentes formatos. A interface é intuitiva e responsiva, facilitando o uso tanto em desktop quanto em dispositivos móveis. O sistema utiliza inteligência artificial para comparar seu perfil com a vaga desejada, sugerindo melhorias e gerando um currículo otimizado, pronto para ser enviado aos recrutadores.

Você pode:
- Preencher ou importar seu perfil;
- Analisar e receber sugestões automáticas;
- Exportar seu currículo otimizado;
- Visualizar o resultado final de forma clara e prática.
<!-- Adicione um GIF ou print da interface aqui -->

### 🔄 Recurso de reaproveitar o perfil (utilizar JSON)
<div align="center">
	<img src="public/telaJson.png" alt="Recurso de Reaproveitar Perfil - JSON" width="70%" />
</div>

---

### 📤 Recurso de exportar o perfil
<div align="center">
	<img src="public/exportarJson.png" alt="Exportar Perfil em JSON" width="70%" />
</div>

---

### 📝 Resultado final da análise e exportação do currículo gerado
<div align="center">
	<img src="public/resultadoAnalise.png" alt="Resultado da Análise e Exportação do Currículo" width="80%" />
</div>

---

## 🚀 Deploy

O projeto está pronto para deploy na Vercel. Basta clonar, configurar as variáveis de ambiente e publicar!

## 📦 Como rodar localmente

```bash
npm install
# Configure o .env com sua chave Gemini e dados do projeto
cp .envmodel .env # Edite o arquivo .env com suas chaves
npx vercel dev
# Em outro terminal
npm run dev
# Acesse http://localhost:8080
```


---


## 🔑 Configuração de APIs e Ambiente

- É necessário obter uma chave da API Google Gemini.
- Preencha o arquivo `.env` com as seguintes variáveis (veja o modelo em `.envmodel`):
	- `GEMINI_API_KEY=...`
	- `NOME_CHAVE=...`
	- `NOME_PROJETO=...`
	- `NUMERO_PROJETO=...`

## 📄 Licença
Este projeto é open source e está sob a licença MIT.