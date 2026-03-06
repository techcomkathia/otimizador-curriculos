import { useState } from "react";
import CabecalhoAplicacao from "@/componentes/CabecalhoAplicacao";
import FormularioAnalise from "@/componentes/FormularioAnalise";
import ResultadoAnalise from "@/componentes/ResultadoAnalise";
import { DadosAnalise, ResultadoAnaliseDTO, analisarCurriculo } from "@/servicos/servicoApi";
import { toast } from "sonner";

const PaginaPrincipal = () => {
  const [carregando, setCarregando] = useState(false);
  const [resultadoAnalise, setResultadoAnalise] = useState<ResultadoAnaliseDTO | null>(null);

  const aoEnviarFormulario = async (dadosAnalise: DadosAnalise) => {
    setCarregando(true);
    setResultadoAnalise(null);

    try {
      const resultado = await analisarCurriculo(dadosAnalise);
      setResultadoAnalise(resultado);
      toast.success("Análise concluída com sucesso!");

      // Scroll para resultado
      setTimeout(() => {
        document.getElementById("secao-resultado")?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } catch {
      toast.error("Erro ao analisar o currículo. Tente novamente.");
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <CabecalhoAplicacao />

      <main className="max-w-3xl mx-auto px-4 py-8 space-y-8">
        <FormularioAnalise aoEnviar={aoEnviarFormulario} carregando={carregando} />

        {resultadoAnalise && (
          <div id="secao-resultado">
            <ResultadoAnalise resultado={resultadoAnalise} />
          </div>
        )}
      </main>
    </div>
  );
};

export default PaginaPrincipal;
