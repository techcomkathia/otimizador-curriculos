import { useState, useRef } from "react";
import { Send, Loader2, Briefcase, User, Code, GraduationCap, Globe, FolderOpen, Download, Upload } from "lucide-react";
import { DadosAnalise, InformacoesContato } from "@/servicos/servicoApi";
import { toast } from "sonner";

interface DadosPerfil {
  informacoesContato: InformacoesContato;
  resumoProfissional: string;
  habilidadesUsuario: string;
  experienciaProfissional: string;
  formacaoAcademica: string;
  projetosUsuario: string;
  idiomas: string;
}

interface PropriedadesFormulario {
  aoEnviar: (dados: DadosAnalise) => void;
  carregando: boolean;
}

const FormularioAnalise = ({ aoEnviar, carregando }: PropriedadesFormulario) => {
  const [descricaoVaga, setDescricaoVaga] = useState("");
  const [nomeCompleto, setNomeCompleto] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");
  const [cidadeEstado, setCidadeEstado] = useState("");
  const [perfilLinkedin, setPerfilLinkedin] = useState("");
  const [perfilGithub, setPerfilGithub] = useState("");
  const [sitePortifolio, setSitePortifolio] = useState("");
  const [resumoProfissional, setResumoProfissional] = useState("");
  const [habilidadesUsuario, setHabilidadesUsuario] = useState("");
  const [experienciaProfissional, setExperienciaProfissional] = useState("");
  const [formacaoAcademica, setFormacaoAcademica] = useState("");
  const [projetosUsuario, setProjetosUsuario] = useState("");
  const [idiomas, setIdiomas] = useState("");

  const referenciaInputArquivo = useRef<HTMLInputElement>(null);

  const carregarDadosPerfil = (dados: DadosPerfil) => {
    const { informacoesContato } = dados;
    setNomeCompleto(informacoesContato.nomeCompleto || "");
    setEmail(informacoesContato.email || "");
    setTelefone(informacoesContato.telefone || "");
    setCidadeEstado(informacoesContato.cidadeEstado || "");
    setPerfilLinkedin(informacoesContato.perfilLinkedin || "");
    setPerfilGithub(informacoesContato.perfilGithub || "");
    setSitePortifolio(informacoesContato.sitePortifolio || "");
    setResumoProfissional(dados.resumoProfissional || "");
    setHabilidadesUsuario(dados.habilidadesUsuario || "");
    setExperienciaProfissional(dados.experienciaProfissional || "");
    setFormacaoAcademica(dados.formacaoAcademica || "");
    setProjetosUsuario(dados.projetosUsuario || "");
    setIdiomas(dados.idiomas || "");
  };

  const gerarJsonPerfil = () => {
    const dadosPerfil: DadosPerfil = {
      informacoesContato: {
        nomeCompleto,
        email,
        telefone,
        cidadeEstado,
        perfilLinkedin,
        perfilGithub,
        sitePortifolio,
      },
      resumoProfissional,
      habilidadesUsuario,
      experienciaProfissional,
      formacaoAcademica,
      projetosUsuario,
      idiomas,
    };

    const jsonTexto = JSON.stringify(dadosPerfil, null, 2);
    const blob = new Blob([jsonTexto], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `perfil-${nomeCompleto.replace(/\s+/g, "-").toLowerCase() || "usuario"}.json`;
    link.click();
    URL.revokeObjectURL(url);
    toast.success("JSON do perfil exportado com sucesso!");
  };

  const importarJsonPerfil = (evento: React.ChangeEvent<HTMLInputElement>) => {
    const arquivo = evento.target.files?.[0];
    if (!arquivo) return;

    const leitor = new FileReader();
    leitor.onload = (e) => {
      try {
        const dados = JSON.parse(e.target?.result as string) as DadosPerfil;
        if (!dados.informacoesContato) {
          toast.error("Formato de JSON inválido. Verifique o arquivo.");
          return;
        }
        carregarDadosPerfil(dados);
        toast.success("Perfil importado! Agora cole a nova descrição de vaga.");
      } catch {
        toast.error("Erro ao ler o arquivo JSON. Verifique o formato.");
      }
    };
    leitor.readAsText(arquivo);
    // Reset para permitir reimportar o mesmo arquivo
    evento.target.value = "";
  };

  const enviarFormulario = (evento: React.FormEvent) => {
    evento.preventDefault();

    const informacoesContato: InformacoesContato = {
      nomeCompleto,
      email,
      telefone,
      cidadeEstado,
      perfilLinkedin,
      perfilGithub,
      sitePortifolio,
    };

    const dadosAnalise: DadosAnalise = {
      descricaoVaga,
      informacoesContato,
      resumoProfissional,
      habilidadesUsuario,
      experienciaProfissional,
      formacaoAcademica,
      projetosUsuario,
      idiomas,
    };

    aoEnviar(dadosAnalise);
  };

  return (
    <form onSubmit={enviarFormulario} className="space-y-6">
      {/* Importar / Exportar JSON */}
      <div className="cartao-secao">
        <div className="flex items-center gap-2 mb-3">
          <Upload className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-bold text-foreground">Reutilizar Perfil</h2>
        </div>
        <p className="text-sm text-muted-foreground mb-4">
          Importe um JSON de perfil salvo anteriormente para preencher os campos automaticamente,
          ou exporte seus dados atuais para reutilizar em futuras vagas.
        </p>
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            className="botao-secundario"
            onClick={() => referenciaInputArquivo.current?.click()}
          >
            <Upload className="h-4 w-4" />
            Importar perfil (JSON)
          </button>
          <button
            type="button"
            className="botao-secundario"
            onClick={gerarJsonPerfil}
          >
            <Download className="h-4 w-4" />
            Exportar perfil (JSON)
          </button>
          <input
            ref={referenciaInputArquivo}
            type="file"
            accept=".json"
            className="hidden"
            onChange={importarJsonPerfil}
          />
        </div>
      </div>

      {/* Descrição da Vaga */}
      <div className="cartao-secao">
        <div className="flex items-center gap-2 mb-4">
          <Briefcase className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-bold text-foreground">Descrição da Vaga</h2>
        </div>
        <label className="rotulo-campo" htmlFor="descricaoVaga">
          Cole a descrição completa da vaga
        </label>
        <textarea
          id="descricaoVaga"
          className="campo-textarea"
          placeholder="Cole aqui a descrição completa da vaga"
          value={descricaoVaga}
          onChange={(e) => setDescricaoVaga(e.target.value)}
          rows={6}
          required
        />
      </div>

      {/* Informações de Contato */}
      <div className="cartao-secao">
        <div className="flex items-center gap-2 mb-4">
          <User className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-bold text-foreground">Informações de Contato</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="rotulo-campo" htmlFor="nomeCompleto">Nome completo *</label>
            <input id="nomeCompleto" className="campo-entrada" placeholder="Seu nome completo" value={nomeCompleto} onChange={(e) => setNomeCompleto(e.target.value)} required />
          </div>
          <div>
            <label className="rotulo-campo" htmlFor="email">E-mail *</label>
            <input id="email" type="email" className="campo-entrada" placeholder="seu@email.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div>
            <label className="rotulo-campo" htmlFor="telefone">Telefone *</label>
            <input id="telefone" className="campo-entrada" placeholder="(00) 00000-0000" value={telefone} onChange={(e) => setTelefone(e.target.value)} required />
          </div>
          <div>
            <label className="rotulo-campo" htmlFor="cidadeEstado">Cidade / Estado *</label>
            <input id="cidadeEstado" className="campo-entrada" placeholder="São Paulo, SP" value={cidadeEstado} onChange={(e) => setCidadeEstado(e.target.value)} required />
          </div>
          <div>
            <label className="rotulo-campo" htmlFor="perfilLinkedin">LinkedIn *</label>
            <input id="perfilLinkedin" className="campo-entrada" placeholder="linkedin.com/in/seuperfil" value={perfilLinkedin} onChange={(e) => setPerfilLinkedin(e.target.value)} required />
          </div>
          <div>
            <label className="rotulo-campo" htmlFor="perfilGithub">GitHub (opcional)</label>
            <input id="perfilGithub" className="campo-entrada" placeholder="github.com/seuusuario" value={perfilGithub} onChange={(e) => setPerfilGithub(e.target.value)} />
          </div>
          <div className="md:col-span-2">
            <label className="rotulo-campo" htmlFor="sitePortifolio">Portfólio (opcional)</label>
            <input id="sitePortifolio" className="campo-entrada" placeholder="seusite.com.br" value={sitePortifolio} onChange={(e) => setSitePortifolio(e.target.value)} />
          </div>
        </div>
      </div>

      {/* Resumo Profissional */}
      <div className="cartao-secao">
        <div className="flex items-center gap-2 mb-4">
          <User className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-bold text-foreground">Resumo Profissional</h2>
        </div>
        <label className="rotulo-campo" htmlFor="resumoProfissional">Descreva seu perfil</label>
        <textarea
          id="resumoProfissional"
          className="campo-textarea"
          placeholder="Descreva brevemente seu perfil profissional"
          value={resumoProfissional}
          onChange={(e) => setResumoProfissional(e.target.value)}
          rows={4}
          required
        />
      </div>

      {/* Habilidades */}
      <div className="cartao-secao">
        <div className="flex items-center gap-2 mb-4">
          <Code className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-bold text-foreground">Habilidades</h2>
        </div>
        <label className="rotulo-campo" htmlFor="habilidadesUsuario">Liste suas competências</label>
        <textarea
          id="habilidadesUsuario"
          className="campo-textarea"
          placeholder="Liste suas habilidades, tecnologias, ferramentas ou competências"
          value={habilidadesUsuario}
          onChange={(e) => setHabilidadesUsuario(e.target.value)}
          rows={4}
          required
        />
        <p className="text-xs text-muted-foreground mt-2">
          A IA organizará suas habilidades em categorias relevantes para a vaga.
        </p>
      </div>

      {/* Experiência Profissional */}
      <div className="cartao-secao">
        <div className="flex items-center gap-2 mb-4">
          <Briefcase className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-bold text-foreground">Experiência Profissional</h2>
        </div>
        <label className="rotulo-campo" htmlFor="experienciaProfissional">Descreva suas experiências</label>
        <textarea
          id="experienciaProfissional"
          className="campo-textarea"
          placeholder="Descreva suas experiências profissionais, cargos ocupados, empresas e principais atividades"
          value={experienciaProfissional}
          onChange={(e) => setExperienciaProfissional(e.target.value)}
          rows={6}
          required
        />
      </div>

      {/* Formação Acadêmica */}
      <div className="cartao-secao">
        <div className="flex items-center gap-2 mb-4">
          <GraduationCap className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-bold text-foreground">Formação Acadêmica</h2>
        </div>
        <label className="rotulo-campo" htmlFor="formacaoAcademica">Informe sua formação</label>
        <textarea
          id="formacaoAcademica"
          className="campo-textarea"
          placeholder="Informe seus cursos, graduações, instituições e anos de conclusão"
          value={formacaoAcademica}
          onChange={(e) => setFormacaoAcademica(e.target.value)}
          rows={4}
          required
        />
      </div>

      {/* Projetos */}
      <div className="cartao-secao">
        <div className="flex items-center gap-2 mb-4">
          <FolderOpen className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-bold text-foreground">Projetos (opcional)</h2>
        </div>
        <label className="rotulo-campo" htmlFor="projetosUsuario">Descreva projetos relevantes</label>
        <textarea
          id="projetosUsuario"
          className="campo-textarea"
          placeholder="Descreva projetos relevantes (especialmente projetos de tecnologia)"
          value={projetosUsuario}
          onChange={(e) => setProjetosUsuario(e.target.value)}
          rows={4}
        />
      </div>

      {/* Idiomas */}
      <div className="cartao-secao">
        <div className="flex items-center gap-2 mb-4">
          <Globe className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-bold text-foreground">Idiomas</h2>
        </div>
        <label className="rotulo-campo" htmlFor="idiomas">Informe idiomas e níveis</label>
        <textarea
          id="idiomas"
          className="campo-textarea"
          placeholder="Informe idiomas e níveis de proficiência (ex: Inglês – Intermediário)"
          value={idiomas}
          onChange={(e) => setIdiomas(e.target.value)}
          rows={3}
          required
        />
      </div>

      {/* Botão de Envio */}
      <div className="flex justify-center pt-2">
        <button
          type="submit"
          className="botao-primario text-base px-8 py-4"
          disabled={carregando}
        >
          {carregando ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              Analisando...
            </>
          ) : (
            <>
              <Send className="h-5 w-5" />
              Analisar vaga e gerar currículo otimizado
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export default FormularioAnalise;
