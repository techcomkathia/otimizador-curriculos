import { CheckCircle, XCircle, Lightbulb, FileText, Copy, Download } from "lucide-react";
import { ResultadoAnaliseDTO } from "@/servicos/servicoApi";
import { toast } from "sonner";

interface PropriedadesResultado {
  resultado: ResultadoAnaliseDTO;
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
        <div className="bg-card border border-border rounded-lg p-6 font-mono text-sm text-foreground whitespace-pre-wrap leading-relaxed max-h-[600px] overflow-y-auto">
          {curriculoGerado}
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
