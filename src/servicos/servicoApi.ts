export interface InformacoesContato {
  nomeCompleto: string;
  email: string;
  telefone: string;
  cidadeEstado: string;
  perfilLinkedin: string;
  perfilGithub: string;
  sitePortifolio: string;
}

export interface DadosAnalise {
  descricaoVaga: string;
  informacoesContato: InformacoesContato;
  resumoProfissional: string;
  habilidadesUsuario: string;
  experienciaProfissional: string;
  formacaoAcademica: string;
  projetosUsuario: string;
  idiomas: string;
}

export interface ResultadoAnaliseDTO {
  pontuacaoATS: number;
  habilidadesIdentificadas: string[];
  habilidadesFaltantes: string[];
  sugestoesMelhoria: string[];
  curriculoGerado: string;
}

function simularRespostaBackend(): ResultadoAnaliseDTO {
  return {
    pontuacaoATS: 82,
    habilidadesIdentificadas: [
      "React",
      "TypeScript",
      "Node.js",
      "Tailwind CSS",
      "Git",
      "API REST",
      "Trabalho em equipe",
    ],
    habilidadesFaltantes: [
      "Docker",
      "Kubernetes",
      "CI/CD",
      "Testes automatizados",
    ],
    sugestoesMelhoria: [
      "Adicionar métricas e resultados quantificáveis nas experiências profissionais",
      "Incluir certificações relevantes para a vaga",
      "Destacar projetos que utilizam as tecnologias exigidas na vaga",
      "Reorganizar as habilidades por relevância para a posição",
      "Adicionar palavras-chave específicas do setor no resumo profissional",
    ],
    curriculoGerado: `JOÃO SILVA
São Paulo, SP | joao.silva@email.com | (11) 99999-0000
LinkedIn: linkedin.com/in/joaosilva | GitHub: github.com/joaosilva

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

RESUMO PROFISSIONAL
Desenvolvedor Full Stack com 5 anos de experiência em desenvolvimento de aplicações web escaláveis utilizando React, TypeScript e Node.js. Forte capacidade de resolver problemas complexos e entregar soluções de alta qualidade em ambientes ágeis.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

HABILIDADES TÉCNICAS

Linguagens: TypeScript, JavaScript, Python, SQL
Frameworks & Bibliotecas: React, Next.js, Node.js, Express, Tailwind CSS
Ferramentas: Git, VS Code, Figma, Jira
Banco de Dados: PostgreSQL, MongoDB, Redis

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

EXPERIÊNCIA PROFISSIONAL

Desenvolvedor Full Stack Pleno | Tech Solutions Ltda.
Janeiro 2022 – Presente
• Desenvolveu e manteve 3 aplicações React com mais de 50.000 usuários ativos
• Reduziu o tempo de carregamento em 40% através de otimizações de performance
• Implementou API REST com Node.js servindo mais de 100 endpoints

Desenvolvedor Frontend Júnior | StartupXYZ
Março 2020 – Dezembro 2021
• Construiu interfaces responsivas utilizando React e Tailwind CSS
• Colaborou com equipe de design para implementar sistema de design unificado
• Participou de code reviews e mentoria de estagiários

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

FORMAÇÃO ACADÊMICA

Bacharelado em Ciência da Computação
Universidade de São Paulo (USP) | 2016 – 2020

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

IDIOMAS

Português – Nativo
Inglês – Avançado
Espanhol – Intermediário`,
  };
}

export async function analisarCurriculo(
  dadosAnalise: DadosAnalise
): Promise<any> {
  const { informacoesContato } = dadosAnalise;
  const informacoesPessoais = `Nome: ${informacoesContato.nomeCompleto}\nE-mail: ${informacoesContato.email}\nTelefone: ${informacoesContato.telefone}\nCidade/Estado: ${informacoesContato.cidadeEstado}\nLinkedIn: ${informacoesContato.perfilLinkedin}\nGitHub: ${informacoesContato.perfilGithub}\nPortfólio: ${informacoesContato.sitePortifolio}`;
  const resposta = await fetch('/api/analisar', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      informacoesPessoais,
      resumoProfissional: dadosAnalise.resumoProfissional,
      habilidades: dadosAnalise.habilidadesUsuario,
      experienciaProfissional: dadosAnalise.experienciaProfissional,
      formacaoAcademica: dadosAnalise.formacaoAcademica,
      projetos: dadosAnalise.projetosUsuario,
      idiomas: dadosAnalise.idiomas,
      descricaoVaga: dadosAnalise.descricaoVaga,
    }),
  });
  if (!resposta.ok) {
    throw new Error('Erro ao analisar currículo');
  }
  return resposta.json();
}
