import { Link } from "wouter";
import { ArrowLeft, HardHat, Wrench, Pen } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function PDFEditorPage() {
  return (
    <div className="min-h-screen bg-surface flex flex-col">
      {/* Navbar Minimalista */}
      <header className="h-16 border-b border-outline-variant bg-surface-container-lowest flex items-center px-4 md:px-8 shrink-0">
        <Link href="/">
          <Button variant="ghost" className="gap-2 -ml-2 text-muted-foreground hover:text-foreground">
            <ArrowLeft className="w-4 h-4" />
            Volver a inicio
          </Button>
        </Link>
        <div className="mx-auto flex items-center gap-2">
          <span className="font-black tracking-tight text-gray-900">FlowPDF</span>
          <span className="text-muted-foreground font-medium text-sm">Editor Avanzado</span>
        </div>
        <div className="w-24"></div> {/* Spacer for centering */}
      </header>

      {/* Main Workspace (En Construcción) */}
      <main className="flex-1 overflow-hidden flex items-center justify-center p-4">
        <div className="flex flex-col items-center justify-center p-8 md:p-12 text-center bg-amber-50/50 rounded-2xl border-2 border-dashed border-amber-200 max-w-2xl w-full">
          <div className="w-20 h-20 bg-amber-100 text-amber-600 rounded-2xl flex items-center justify-center mb-6 shadow-sm">
            <HardHat className="w-10 h-10" />
          </div>
          <h3 className="text-2xl font-black text-gray-900 mb-3">Espacio de Trabajo en Preparación</h3>
          <p className="text-amber-800/80 max-w-md mx-auto mb-8 font-medium leading-relaxed">
            Esta será la pantalla completa donde podrás cargar tu PDF, arrastrar textos, añadir tu firma manuscrita y redimensionar elementos libremente.
          </p>
          
          <div className="flex flex-wrap justify-center gap-3 opacity-60 pointer-events-none">
            <Button variant="outline" className="gap-2 bg-white/50 border-amber-200 text-amber-900">
              <Wrench className="w-4 h-4"/> 
              Añadir Textos
            </Button>
            <Button variant="outline" className="gap-2 bg-white/50 border-amber-200 text-amber-900">
              <Pen className="w-4 h-4"/> 
              Firmar y Dibujar
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
