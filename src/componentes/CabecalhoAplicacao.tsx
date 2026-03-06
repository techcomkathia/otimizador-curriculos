import { FileText, Sparkles } from "lucide-react";

const CabecalhoAplicacao = () => {
  return (
    <header className="cabecalho-gradiente py-10 px-4 text-center">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="rounded-xl bg-primary-foreground/20 p-2.5 backdrop-blur-sm">
            <FileText className="h-7 w-7 text-primary-foreground" />
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-primary-foreground tracking-tight">
            Otimizador de Currículos com IA
          </h1>
          <Sparkles className="h-6 w-6 text-primary-foreground/80" />
        </div>
        <p className="text-primary-foreground/85 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
          Analise uma vaga e gere um currículo otimizado para sistemas de
          recrutamento automatizados (ATS).
        </p>
      </div>
    </header>
  );
};

export default CabecalhoAplicacao;
