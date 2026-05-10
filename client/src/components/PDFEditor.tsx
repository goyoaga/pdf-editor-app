import { HardHat, Wrench, Pen } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function PDFEditor() {
  return (
    <div className="flex flex-col items-center justify-center p-8 md:p-12 text-center bg-amber-50/50 rounded-2xl border-2 border-dashed border-amber-200">
      <div className="w-20 h-20 bg-amber-100 text-amber-600 rounded-2xl flex items-center justify-center mb-6 shadow-sm">
        <HardHat className="w-10 h-10" />
      </div>
      <h3 className="text-2xl font-black text-gray-900 mb-3">Editor Avanzado en Construcción</h3>
      <p className="text-amber-800/80 max-w-md mx-auto mb-8 font-medium leading-relaxed">
        Estamos desarrollando una nueva pantalla completa para que puedas firmar, dibujar y añadir textos a tus PDFs con total comodidad. ¡Estará disponible muy pronto!
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
  );
}
