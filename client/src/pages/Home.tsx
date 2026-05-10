import { useState } from "react";
import { Link } from "wouter";
import {
  Merge,
  Split,
  Edit3,
  FileText,
  Image as ImageIcon,
  Upload,
  Shield,
  Lock,
  Zap,
  Maximize,
  Trash2,
  Hexagon,
  Plus,
  ArrowRight,
  Coffee,
  ShieldCheck,
  Github
} from "lucide-react";
import Header from "@/components/Header";
import PDFMerger from "@/components/PDFMerger";
import PDFSplitter from "@/components/PDFSplitter";
import PDFEditor from "@/components/PDFEditor";
import DocxConverter from "@/components/DocxConverter";
import ImageConverter from "@/components/ImageConverter";

type Tool = "merge" | "split" | "edit" | "docx" | "image";

const tools = [
  { id: "merge", name: "Unir PDFs", icon: Merge, description: "Carga varios archivos PDF y únelos en un solo documento." },
  { id: "split", name: "Dividir PDF", icon: Split, description: "Extrae páginas específicas de un PDF o divide el documento." },
  { id: "edit", name: "Editar PDF", icon: Edit3, description: "Añade anotaciones, texto, formas y firmas a tus documentos." },
  { id: "docx", name: "DOCX a PDF", icon: FileText, description: "Convierte archivos Word a PDF manteniendo el formato original." },
  { id: "image", name: "Imagen a PDF", icon: ImageIcon, description: "Convierte imágenes JPG, PNG y otros formatos a PDF." },
];

export default function Home() {
  const [activeTool, setActiveTool] = useState<Tool>("merge");

  const ActiveComponent = {
    merge: PDFMerger,
    split: PDFSplitter,
    edit: PDFEditor,
    docx: DocxConverter,
    image: ImageConverter,
  }[activeTool];

  const currentTool = tools.find(t => t.id === activeTool)!;

  return (
    <div className="min-h-screen bg-surface selection:bg-primary/10">
      <Header />

      {/* Tool Switcher */}
      <div className="bg-surface-container-low border-b border-outline-variant">
        <div className="w-full max-w-[1280px] mx-auto px-4 overflow-x-auto">
          <div className="flex flex-row justify-center gap-4 py-3 min-w-max">
            {tools.map((tool) => (
              <button
                key={tool.id}
                onClick={() => setActiveTool(tool.id as Tool)}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-lg font-bold transition-all duration-200 ${
                  activeTool === tool.id
                    ? "bg-primary text-on-primary shadow-sm scale-100"
                    : "text-muted-foreground hover:bg-secondary-container hover:text-foreground scale-95"
                }`}
              >
                <tool.icon className="w-5 h-5" />
                <span className="text-sm whitespace-nowrap">{tool.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <main className="pb-20 relative overflow-hidden">
        {/* Decorative background hexagon */}
        <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 opacity-[0.03] pointer-events-none">
          <Hexagon className="w-[800px] h-[800px] text-primary" strokeWidth={0.5} />
        </div>
        
        {/* Hero Section */}
        <section className="px-4 md:px-8 py-16 md:py-24 max-w-[1280px] mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-black uppercase tracking-widest mb-8 animate-in fade-in slide-in-from-top-4 duration-1000">
            <Shield className="w-3 h-3" />
            100% Privado • Sin Servidores • Gratis
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-gray-900 mb-6 tracking-tight leading-tight">
            Tus documentos PDF, <span className="text-primary">seguros</span> y bajo tu control.
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-12 font-medium leading-relaxed">
            Procesa, edita y convierte archivos directamente en tu navegador. Sin esperas, sin registros y totalmente <span className="text-gray-900 font-bold underline decoration-primary/30 decoration-4 underline-offset-4">gratis para siempre</span>.
          </p>

          {/* Main Tool Card */}
          <div className="max-w-4xl mx-auto bg-surface-container-lowest rounded-2xl shadow-xl shadow-primary/5 border border-outline-variant overflow-hidden">
            <div className="p-8 md:p-12">
              <div className="flex flex-col items-center mb-10">
                <div className="w-16 h-16 bg-primary-container text-white rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-primary/20">
                  <currentTool.icon className="w-10 h-10" />
                </div>
                <h2 className="text-2xl font-black text-gray-900 mb-2">{currentTool.name}</h2>
                <p className="text-base text-muted-foreground text-center max-w-lg font-medium">
                  {currentTool.description}
                </p>
              </div>

              {/* Dynamic Tool Component */}
              <ActiveComponent />

              {/* Info Badges */}
              <div className="mt-12 flex flex-wrap justify-center gap-x-8 gap-y-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-primary fill-primary/10" />
                  Sin carga al servidor
                </div>
                <div className="flex items-center gap-2">
                  <Lock className="w-4 h-4 text-primary fill-primary/10" />
                  Privacidad garantizada
                </div>
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-primary fill-primary/10" />
                  Procesamiento local ultra-rápido
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Bento Features Grid */}
        <section className="bg-surface-container-low py-24 px-4 md:px-8">
          <div className="max-w-[1280px] mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Feature 1 */}
              <div className="md:col-span-2 bg-surface-container-lowest p-8 md:p-12 rounded-2xl border border-outline-variant flex flex-col md:flex-row gap-8 items-center shadow-sm">
                <div className="flex-1 text-left">
                  <h3 className="text-2xl font-black text-gray-900 mb-4">Seguridad sin concesiones</h3>
                  <p className="text-muted-foreground leading-relaxed font-medium">
                    A diferencia de otros editores, FlowPDF nunca sube tus documentos a un servidor externo. Todo el procesamiento ocurre en el motor de JavaScript de tu navegador. Tus datos privados nunca salen de tu dispositivo.
                  </p>
                </div>
                <div className="w-full md:w-56 aspect-square rounded-2xl bg-primary-container/10 flex items-center justify-center overflow-hidden relative group">
                  <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <Lock className="w-24 h-24 text-primary opacity-20" />
                </div>
              </div>

              {/* Feature 2 */}
              <div className="bg-primary text-white p-8 md:p-10 rounded-2xl flex flex-col justify-between shadow-lg shadow-primary/20 relative overflow-hidden group">
                <div className="absolute -right-8 -top-8 w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover:bg-white/20 transition-all" />
                <img src={`${import.meta.env.BASE_URL}logo-flowpdf.png`.replace('//', '/')} alt="Logo" className="w-12 h-12 mb-6 brightness-0 invert" />
                <div>
                  <h3 className="text-xl font-black mb-3">Herramientas Profesionales</h3>
                  <p className="text-sm opacity-90 leading-relaxed font-medium">Gratis para siempre. Sin marcas de agua, sin límites de tamaño y sin necesidad de registro.</p>
                </div>
              </div>

              {/* Feature 3 */}
              <div className="bg-surface-container-lowest p-8 rounded-2xl border border-outline-variant shadow-sm hover:border-primary transition-colors group">
                <div className="w-12 h-12 rounded-xl bg-secondary-container text-primary flex items-center justify-center mb-6 transition-transform group-hover:scale-110">
                  <ArrowRight className="w-6 h-6 rotate-45" />
                </div>
                <h3 className="text-lg font-black text-gray-900 mb-2">Reordenación Visual</h3>
                <p className="text-sm text-muted-foreground leading-relaxed font-medium">Arrastra y suelta las miniaturas de tus documentos para cambiar el orden de unión antes de generar el archivo final.</p>
              </div>

              {/* Feature 4 */}
              <div className="bg-surface-container-lowest p-8 rounded-2xl border border-outline-variant shadow-sm hover:border-primary transition-colors group">
                <div className="w-12 h-12 rounded-xl bg-primary-container/10 text-primary flex items-center justify-center mb-6 transition-transform group-hover:scale-110">
                  <Maximize className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-black text-gray-900 mb-2">Sin Pérdida de Calidad</h3>
                <p className="text-sm text-muted-foreground leading-relaxed font-medium">Mantenemos la resolución original de tus documentos y todas las capas vectoriales intactas durante la fusión.</p>
              </div>

              {/* Feature 5 */}
              <div className="bg-surface-container-lowest p-8 rounded-2xl border border-outline-variant shadow-sm hover:border-primary transition-colors group">
                <div className="w-12 h-12 rounded-xl bg-destructive/10 text-destructive flex items-center justify-center mb-6 transition-transform group-hover:scale-110">
                  <Trash2 className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-black text-gray-900 mb-2">Basura Cero</h3>
                <p className="text-sm text-muted-foreground leading-relaxed font-medium">No guardamos logs ni rastro de tus archivos. Al cerrar la pestaña, todo se borra de la memoria temporal del navegador.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Ko-fi Support Banner */}
        <section className="px-4 md:px-8 py-12 max-w-[1280px] mx-auto">
          <a 
            href="https://ko-fi.com/arielgoyoaga" 
            target="_blank" 
            rel="noopener noreferrer"
            className="group block bg-surface-container-lowest border border-outline-variant rounded-2xl p-8 hover:border-primary hover:shadow-xl hover:shadow-primary/5 transition-all text-center relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-1 h-full bg-primary" />
            <div className="flex flex-col md:flex-row items-center justify-center gap-6">
              <div className="w-16 h-16 rounded-full bg-[#FF5E5B]/10 flex items-center justify-center text-[#FF5E5B] group-hover:scale-110 transition-transform">
                <Coffee className="w-8 h-8 fill-current" />
              </div>
              <div className="text-center md:text-left">
                <h3 className="text-xl font-black text-gray-900 mb-1">¿Te gusta FlowPDF?</h3>
                <p className="text-muted-foreground font-medium">Ayúdame a mantenerlo gratis y sin anuncios. ¡Cómprame un café!</p>
              </div>
              <div className="bg-[#FF5E5B] text-white px-8 py-3 rounded-xl font-black shadow-lg shadow-[#FF5E5B]/20 group-hover:opacity-90 transition-all flex items-center gap-2">
                <span>Apoyar en Ko-fi</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          </a>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-surface-container border-t border-outline-variant">
        <div className="flex flex-col md:flex-row justify-between items-center py-12 px-4 md:px-8 w-full max-w-[1280px] mx-auto gap-8">
          <div className="flex flex-col items-center md:items-start gap-4">
            <div className="flex items-center gap-3">
              <img src={`${import.meta.env.BASE_URL}logo-flowpdf.png`.replace('//', '/')} alt="FlowPDF Logo" className="w-8 h-8 object-contain" />
              <span className="text-lg font-black tracking-tight text-gray-900">FlowPDF</span>
            </div>
            <p className="text-sm text-muted-foreground text-center md:text-left max-w-sm font-medium leading-relaxed">
              © 2026 FlowPDF. Open Source. Procesamiento 100% en el navegador para máxima privacidad.
            </p>
          </div>
          <div className="flex items-center gap-8">
            <Link href="/privacidad">
              <a className="flex items-center justify-center text-muted-foreground hover:text-primary transition-all hover:scale-110" title="Privacidad">
                <ShieldCheck className="w-6 h-6" />
              </a>
            </Link>
            <a 
              href="https://github.com/goyoaga/pdf-editor-app" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="flex items-center justify-center text-muted-foreground hover:text-primary transition-all hover:scale-110" 
              title="GitHub"
            >
              <Github className="w-6 h-6" />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
