import { CheckCircle, XCircle, Lightbulb, FileText, Copy, Download } from "lucide-react";
import { ResultadoAnaliseDTO } from "@/servicos/servicoApi";
import { toast } from "sonner";
import { useMemo } from "react";

interface PropriedadesResultado {
  resultado: ResultadoAnaliseDTO;
}

const renderizarCurriculoEstilizado = (texto: string) => {
  const linhas = texto.split("\n");
  const elementos: React.ReactNode[] = [];
  let ehPrimeiraLinha = true;

  for (let i = 0; i < linhas.length; i++) {
    const linha = linhas[i].trim();

    // Linha separadora
    if (linha.match(/^[━─═─]{5,}$/)) {
      elementos.push(
        <hr key={i} className="border-t border-muted-foreground/30 my-5" />
      );
      continue;
    }

    // Linha vazia
    if (linha === "") {
      elementos.push(<div key={i} className="h-2" />);
      continue;
    }

    // Nome da pessoa (primeira linha não-vazia)
    if (ehPrimeiraLinha && linha.length > 0) {
      ehPrimeiraLinha = false;
      elementos.push(
        <h2 key={i} className="text-2xl font-bold tracking-wide text-center mb-1">
          {linha}
        </h2>
      );
      continue;
    }

    // Títulos de seção (tudo em maiúsculo, sem dois pontos)
    if (linha === linha.toUpperCase() && linha.length > 3 && !linha.includes(":") && !linha.startsWith("•") && !linha.startsWith("–") && !linha.match(/^\d/)) {
      elementos.push(
        <h3 key={i} className="text-lg font-bold uppercase tracking-widest mt-1 mb-2">
          {linha}
        </h3>
      );
      continue;
    }

    // Linha de contato (segunda linha, com email/telefone)
    if (i <= 2 && (linha.includes("@") || linha.includes("(")) && !linha.startsWith("•")) {
      const partes = linha.split("|").map((p) => p.trim());
      elementos.push(
        <p key={i} className="text-xs text-center mb-1 opacity-80">
          {partes.join("  ·  ")}
        </p>
      );
      continue;
    }

    // Linha com LinkedIn/GitHub
    if ((linha.toLowerCase().includes("linkedin") || linha.toLowerCase().includes("github")) && !linha.startsWith("•")) {
      const partes = linha.split("|").map((p) => p.trim());
      elementos.push(
        <p key={i} className="text-xs text-center mb-1 opacity-80">
          {partes.map((parte, j) => {
            const urlMatch = parte.match(/(linkedin\.com\/\S+|github\.com\/\S+)/i);
            if (urlMatch) {
              const url = urlMatch[1];
              const fullUrl = url.startsWith("http") ? url : `https://${url}`;
              return (
                <span key={j}>
                  {j > 0 && "  ·  "}
                  <a
                    href={fullUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline underline-offset-2 hover:opacity-70 transition-opacity"
                  >
                    {url}
                  </a>
                </span>
              );
            }
            return <span key={j}>{j > 0 && "  ·  "}{parte}</span>;
          })}
        </p>
      );
      continue;
    }

    // Cargo | Empresa (linha com pipe indicando cargo)
    if (linha.includes("|") && !linha.startsWith("•") && !linha.includes("@")) {
      const partes = linha.split("|").map((p) => p.trim());
      // Verifica se parece cargo (ex: "Desenvolvedor... | Empresa...")
      const pareceData = partes.some(p => p.match(/(Janeiro|Fevereiro|Março|Abril|Maio|Junho|Julho|Agosto|Setembro|Outubro|Novembro|Dezembro|\d{4})/i));
      if (pareceData) {
        // Linha de data/período
        elementos.push(
          <p key={i} className="text-xs opacity-70 mb-2">
            {linha}
          </p>
        );
      } else {
        elementos.push(
          <p key={i} className="font-bold text-sm mt-2">
            {linha}
          </p>
        );
      }
      continue;
    }

    // Linhas de período/data
    if (linha.match(/(Janeiro|Fevereiro|Março|Abril|Maio|Junho|Julho|Agosto|Setembro|Outubro|Novembro|Dezembro|Presente|\d{4}\s*[–-])/i) && !linha.startsWith("•")) {
      elementos.push(
        <p key={i} className="text-xs opacity-70 mb-2">
          {linha}
        </p>
      );
      continue;
    }

    // Bullet points
    if (linha.startsWith("•") || linha.startsWith("-")) {
      elementos.push(
        <p key={i} className="text-sm pl-2 mb-1 leading-relaxed">
          {linha}
        </p>
      );
      continue;
    }

    // Categorias de habilidades (Linguagens:, Frameworks:, etc.)
    if (linha.includes(":") && linha.indexOf(":") < 30) {
      const [categoria, ...resto] = linha.split(":");
      const valor = resto.join(":").trim();
      elementos.push(
        <p key={i} className="text-sm mb-1">
          <span className="font-bold">{categoria}:</span> {valor}
        </p>
      );
      continue;
    }

    // Resumo profissional (parágrafo longo) - texto justificado
    if (linha.length > 80) {
      elementos.push(
        <p key={i} className="text-sm leading-relaxed text-justify">
          {linha}
        </p>
      );
      continue;
    }

    // Texto padrão
    elementos.push(
      <p key={i} className="text-sm leading-relaxed">
        {linha}
      </p>
    );
  }

  return elementos;
};

const ResultadoAnalise = ({ resultado }: PropriedadesResultado) => {
  const { pontuacaoATS, habilidadesIdentificadas, habilidadesFaltantes, sugestoesMelhoria, curriculoGerado } = resultado;

  const corPontuacao = pontuacaoATS >= 75
    ? "bg-sucesso"
    : pontuacaoATS >= 50
    ? "bg-aviso"
    : "bg-destructive";

  const textoPontuacao = pontuacaoATS >= 75
    ? "Boa compatibilidade!"
    : pontuacaoATS >= 50
    ? "Compatibilidade moderada"
    : "Baixa compatibilidade";

  const copiarCurriculo = async () => {
    try {
      await navigator.clipboard.writeText(curriculoGerado);
      toast.success("Currículo copiado para a área de transferência!");
    } catch {
      toast.error("Não foi possível copiar o currículo.");
    }
  };

  const baixarCurriculoPDF = () => {
    const blob = new Blob([curriculoGerado], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "curriculo-otimizado.txt";
    link.click();
    URL.revokeObjectURL(url);
    toast.success("Download iniciado! (Versão PDF será disponibilizada em breve)");
  };

  const baixarCurriculoDoc = () => {
    const htmlContent = `
      <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40">
      <head><meta charset="utf-8"><title>Currículo</title>
      <style>body { font-family: Calibri, sans-serif; font-size: 12pt; line-height: 1.5; white-space: pre-wrap; }</style>
      </head><body>${curriculoGerado.replace(/\n/g, "<br>")}</body></html>`;
    const blob = new Blob(['\ufeff', htmlContent], { type: "application/msword" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "curriculo-otimizado.doc";
    link.click();
    URL.revokeObjectURL(url);
    toast.success("Download do arquivo .doc iniciado!");
  };

  return (
    <div className="space-y-6 animate-in fade-in-0 slide-in-from-bottom-4 duration-500">
      <h2 className="text-2xl font-bold text-foreground text-center">
        Resultado da Análise
      </h2>

      {/* Pontuação ATS */}
      <div className="cartao-secao text-center">
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
          Pontuação ATS
        </h3>
        <div className="text-5xl font-extrabold text-foreground mb-2">
          {pontuacaoATS}%
        </div>
        <p className="text-sm text-muted-foreground mb-4">{textoPontuacao}</p>
        <div className="w-full max-w-md mx-auto bg-muted rounded-full h-3 overflow-hidden">
          <div
            className={`barra-pontuacao ${corPontuacao}`}
            style={{ width: `${pontuacaoATS}%` }}
          />
        </div>
      </div>

      {/* Habilidades */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="cartao-secao">
          <div className="flex items-center gap-2 mb-4">
            <CheckCircle className="h-5 w-5 text-sucesso" />
            <h3 className="text-base font-bold text-foreground">Habilidades Identificadas</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {habilidadesIdentificadas.map((habilidade, indice) => (
              <span
                key={indice}
                className="etiqueta-habilidade bg-accent text-accent-foreground"
              >
                {habilidade}
              </span>
            ))}
          </div>
        </div>

        <div className="cartao-secao">
          <div className="flex items-center gap-2 mb-4">
            <XCircle className="h-5 w-5 text-destructive" />
            <h3 className="text-base font-bold text-foreground">Habilidades Faltantes</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {habilidadesFaltantes.map((habilidade, indice) => (
              <span
                key={indice}
                className="etiqueta-habilidade bg-destructive/10 text-destructive"
              >
                {habilidade}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Sugestões */}
      <div className="cartao-secao">
        <div className="flex items-center gap-2 mb-4">
          <Lightbulb className="h-5 w-5 text-aviso" />
          <h3 className="text-base font-bold text-foreground">Sugestões de Melhoria</h3>
        </div>
        <ul className="space-y-2">
          {sugestoesMelhoria.map((sugestao, indice) => (
            <li key={indice} className="flex items-start gap-2 text-sm text-foreground">
              <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />
              {sugestao}
            </li>
          ))}
        </ul>
      </div>

      {/* Currículo Gerado */}
      <div className="cartao-secao">
        <div className="flex items-center gap-2 mb-4">
          <FileText className="h-5 w-5 text-primary" />
          <h3 className="text-base font-bold text-foreground">Currículo Gerado</h3>
        </div>
        <div className="bg-card border border-border rounded-lg p-8 font-mono text-foreground max-h-[700px] overflow-y-auto">
          {renderizarCurriculoEstilizado(curriculoGerado)}
        </div>
        <div className="flex flex-wrap gap-3 mt-4">
          <button type="button" className="botao-secundario" onClick={copiarCurriculo}>
            <Copy className="h-4 w-4" />
            Copiar currículo
          </button>
          <button type="button" className="botao-secundario" onClick={baixarCurriculoPDF}>
            <Download className="h-4 w-4" />
            Baixar em PDF
          </button>
          <button type="button" className="botao-secundario" onClick={baixarCurriculoDoc}>
            <FileText className="h-4 w-4" />
            Baixar em DOC (editável)
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResultadoAnalise;
