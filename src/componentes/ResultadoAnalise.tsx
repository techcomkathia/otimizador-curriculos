import { CheckCircle, XCircle, Lightbulb, FileText, Copy, Download } from "lucide-react";
import { ResultadoAnaliseDTO } from "@/servicos/servicoApi";
import { toast } from "sonner";
import React from "react";

interface PropriedadesResultado {
  resultado: ResultadoAnaliseDTO;
}

const SECOES_CURRICULO = [
  "RESUMO PROFISSIONAL",
  "HABILIDADES TÉCNICAS",
  "EXPERIÊNCIA PROFISSIONAL",
  "FORMAÇÃO ACADÊMICA",
  "IDIOMAS",
  "PROJETOS",
  "CERTIFICAÇÕES",
];

function renderizarCurriculo(texto: string): React.ReactNode[] {
  const linhas = texto.split("\n");
  const elementos: React.ReactNode[] = [];
  let primeiraLinha = true;

  for (let i = 0; i < linhas.length; i++) {
    const linha = linhas[i].trim();

    if (/^[━─═\-]{5,}$/.test(linha)) {
      elementos.push(<hr key={i} className="border-border my-4" />);
      continue;
    }

    if (linha === "") {
      elementos.push(<div key={i} className="h-1" />);
      continue;
    }

    if (primeiraLinha && linha.length > 0) {
      primeiraLinha = false;
      elementos.push(
        <h2 key={i} className="text-2xl font-bold text-foreground tracking-wide">{linha}</h2>
      );
      continue;
    }

    if (SECOES_CURRICULO.includes(linha)) {
      elementos.push(
        <h3 key={i} className="text-lg font-bold text-primary uppercase tracking-wider mt-1">{linha}</h3>
      );
      continue;
    }

    // Cargo | Empresa
    if (linha.includes(" | ") && !linha.startsWith("•") && !linha.toLowerCase().startsWith("linkedin") && !linha.toLowerCase().startsWith("github")) {
      const proximaLinha = i + 1 < linhas.length ? linhas[i + 1].trim() : "";
      const pareceCargoExperiencia = /\d{4}/.test(proximaLinha) || /presente/i.test(proximaLinha);
      if (pareceCargoExperiencia) {
        const partes = linha.split(" | ");
        elementos.push(
          <p key={i} className="text-base text-foreground">
            <span className="font-bold">{partes[0]}</span>
            <span className="text-muted-foreground"> | {partes.slice(1).join(" | ")}</span>
          </p>
        );
        continue;
      }
    }

    // Categoria de habilidade (ex: "Linguagens: ...")
    if (/^[A-Za-zÀ-ú\s&]+:/.test(linha) && !linha.startsWith("•")) {
      const sep = linha.indexOf(":");
      const categoria = linha.substring(0, sep);
      const valor = linha.substring(sep + 1);
      elementos.push(
        <p key={i} className="text-sm text-foreground">
          <span className="font-bold">{categoria}:</span>{valor}
        </p>
      );
      continue;
    }

    if (linha.startsWith("•")) {
      elementos.push(
        <p key={i} className="text-sm text-foreground pl-2">{linha}</p>
      );
      continue;
    }

    // Data
    if (/^(janeiro|fevereiro|março|abril|maio|junho|julho|agosto|setembro|outubro|novembro|dezembro|\d{4})/i.test(linha)) {
      elementos.push(
        <p key={i} className="text-xs text-muted-foreground italic">{linha}</p>
      );
      continue;
    }

    // Contato (linhas 2-3)
    if (i <= 2 && (linha.includes("@") || linha.includes("|"))) {
      elementos.push(
        <p key={i} className="text-sm text-muted-foreground">{linha}</p>
      );
      continue;
    }

    elementos.push(<p key={i} className="text-sm text-foreground">{linha}</p>);
  }

  return elementos;
}

function gerarHtmlCurriculoFormatado(texto: string): string {
  const linhas = texto.split("\n");
  let html = "";
  let primeiraLinha = true;

  for (let i = 0; i < linhas.length; i++) {
    const linha = linhas[i].trim();

    if (/^[━─═\-]{5,}$/.test(linha)) {
      html += '<hr style="border:1px solid #ccc; margin:12px 0;">';
      continue;
    }
    if (linha === "") { html += "<br>"; continue; }

    if (primeiraLinha && linha.length > 0) {
      primeiraLinha = false;
      html += `<h1 style="font-size:22pt; font-weight:bold; margin:0 0 4px 0;">${linha}</h1>`;
      continue;
    }

    if (SECOES_CURRICULO.includes(linha)) {
      html += `<h2 style="font-size:13pt; font-weight:bold; text-transform:uppercase; letter-spacing:1px; color:#2563eb; margin:8px 0 4px 0;">${linha}</h2>`;
      continue;
    }

    if (linha.includes(" | ") && !linha.startsWith("•")) {
      const proximaLinha = i + 1 < linhas.length ? linhas[i + 1].trim() : "";
      if (/\d{4}/.test(proximaLinha) || /presente/i.test(proximaLinha)) {
        const partes = linha.split(" | ");
        html += `<p style="margin:4px 0;"><b>${partes[0]}</b> | ${partes.slice(1).join(" | ")}</p>`;
        continue;
      }
    }

    if (/^[A-Za-zÀ-ú\s&]+:/.test(linha) && !linha.startsWith("•")) {
      const sep = linha.indexOf(":");
      html += `<p style="margin:2px 0;"><b>${linha.substring(0, sep)}:</b>${linha.substring(sep + 1)}</p>`;
      continue;
    }

    html += `<p style="margin:2px 0;">${linha}</p>`;
  }

  return html;
}

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
    const corpoHtml = gerarHtmlCurriculoFormatado(curriculoGerado);
    const htmlContent = `
      <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40">
      <head><meta charset="utf-8"><title>Currículo</title>
      <style>body { font-family: Calibri, sans-serif; font-size: 11pt; line-height: 1.4; color: #222; }</style>
      </head><body>${corpoHtml}</body></html>`;
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
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">Pontuação ATS</h3>
        <div className="text-5xl font-extrabold text-foreground mb-2">{pontuacaoATS}%</div>
        <p className="text-sm text-muted-foreground mb-4">{textoPontuacao}</p>
        <div className="w-full max-w-md mx-auto bg-muted rounded-full h-3 overflow-hidden">
          <div className={`barra-pontuacao ${corPontuacao}`} style={{ width: `${pontuacaoATS}%` }} />
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
            {habilidadesIdentificadas.map((h, i) => (
              <span key={i} className="etiqueta-habilidade bg-accent text-accent-foreground">{h}</span>
            ))}
          </div>
        </div>
        <div className="cartao-secao">
          <div className="flex items-center gap-2 mb-4">
            <XCircle className="h-5 w-5 text-destructive" />
            <h3 className="text-base font-bold text-foreground">Habilidades Faltantes</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {habilidadesFaltantes.map((h, i) => (
              <span key={i} className="etiqueta-habilidade bg-destructive/10 text-destructive">{h}</span>
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
          {sugestoesMelhoria.map((s, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-foreground">
              <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />
              {s}
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
        <div className="bg-card border border-border rounded-lg p-8 leading-relaxed max-h-[700px] overflow-y-auto space-y-0.5">
          {renderizarCurriculo(curriculoGerado)}
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