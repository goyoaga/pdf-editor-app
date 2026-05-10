import { FileText, Github } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Header() {
  return (
    <header className="border-b border-gray-200 bg-white sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
            <FileText className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-gray-900" style={{ fontFamily: "'Syne', sans-serif" }}>
              PDF Editor
            </h1>
            <p className="text-xs text-gray-500">Gratuito & Open-Source</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-600 hover:text-gray-900 transition"
          >
            <Github className="w-5 h-5" />
          </a>
          <Button variant="outline" size="sm">
            Documentación
          </Button>
        </div>
      </div>
    </header>
  );
}
