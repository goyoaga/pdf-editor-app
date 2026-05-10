import { Link, useLocation } from "wouter";
import { Github, Code2 } from "lucide-react";

export default function Header() {
  const [location] = useLocation();

  return (
    <header className="bg-surface/80 backdrop-blur-md border-b border-outline-variant sticky top-0 z-50 transition-colors">
      <div className="flex justify-between items-center h-16 px-4 md:px-8 w-full max-w-[1280px] mx-auto">
        <Link href="/">
          <a className="flex items-center gap-3 group">
            <img 
              src={`${import.meta.env.BASE_URL}logo-flowpdf.png`.replace('//', '/')}
              alt="FlowPDF Logo" 
              className="w-10 h-10 object-contain group-hover:scale-110 transition-transform" 
            />
            <span className="text-xl font-black tracking-tight text-gray-900">FlowPDF</span>
          </a>
        </Link>

        <nav className="hidden md:flex gap-8 items-center">
          <Link href="/">
            <a className={`text-sm font-bold py-5 transition-colors ${location === '/' ? 'text-primary border-b-2 border-primary' : 'text-gray-500 hover:text-primary'}`}>
              Herramientas
            </a>
          </Link>
          <Link href="/privacidad">
            <a className={`text-sm font-bold py-5 transition-colors ${location === '/privacidad' ? 'text-primary border-b-2 border-primary' : 'text-gray-500 hover:text-primary'}`}>
              Privacidad
            </a>
          </Link>
          <div className="bg-primary/10 text-primary px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border border-primary/20">
            Gratis & Privado
          </div>
        </nav>

        <div className="flex items-center gap-4">
          <a
            href="https://github.com/goyoaga/pdf-editor-app"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 text-gray-500 hover:text-primary transition-colors"
            title="Ver en GitHub"
          >
            <Code2 className="w-5 h-5" />
          </a>
          <a
            href="https://github.com/goyoaga"
            target="_blank"
            rel="noopener noreferrer"
            className="w-8 h-8 rounded-full bg-secondary-container flex items-center justify-center overflow-hidden hover:ring-2 hover:ring-primary transition-all"
          >
            <Github className="w-5 h-5 text-gray-700" />
          </a>
        </div>
      </div>
    </header>
  );
}
