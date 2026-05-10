import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import {
  Upload,
  FileText,
  Merge,
  Split,
  Edit3,
  Download,
  Trash2,
  Plus,
  GripVertical,
} from "lucide-react";
import Header from "@/components/Header";
import UploadZone from "@/components/UploadZone";
import PDFMerger from "@/components/PDFMerger";
import PDFSplitter from "@/components/PDFSplitter";
import PDFEditor from "@/components/PDFEditor";
import DocxConverter from "@/components/DocxConverter";
import ImageConverter from "@/components/ImageConverter";

/**
 * Home Page - Main Application Interface
 * Design: Minimalist Modern with emphasis on functionality
 * Colors: Professional blue (#2563EB) with clean whites and grays
 * Typography: Plus Jakarta Sans for body, Syne for headings
 */

type Tool = "merge" | "split" | "edit" | "docx" | "image";

export default function Home() {
  const [activeTool, setActiveTool] = useState<Tool>("merge");

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50/30 to-white">
      <Header />

      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="mb-12">
          <div className="max-w-3xl">
            <h1 className="text-4xl font-bold text-gray-900 mb-4" style={{ fontFamily: "'Syne', sans-serif" }}>
              Editor de PDF Gratuito y Open-Source
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              Procesa tus documentos directamente en tu navegador. Sin servidores, sin costes, 100% privado.
            </p>
          </div>
        </div>

        {/* Main Tools Section */}
        <Tabs value={activeTool} onValueChange={(value) => setActiveTool(value as Tool)} className="w-full">
          <TabsList className="grid w-full grid-cols-5 mb-8 bg-gray-100 p-1 rounded-lg">
            <TabsTrigger value="merge" className="flex items-center gap-2">
              <Merge className="w-4 h-4" />
              <span className="hidden sm:inline">Unir</span>
            </TabsTrigger>
            <TabsTrigger value="split" className="flex items-center gap-2">
              <Split className="w-4 h-4" />
              <span className="hidden sm:inline">Dividir</span>
            </TabsTrigger>
            <TabsTrigger value="edit" className="flex items-center gap-2">
              <Edit3 className="w-4 h-4" />
              <span className="hidden sm:inline">Editar</span>
            </TabsTrigger>
            <TabsTrigger value="docx" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              <span className="hidden sm:inline">DOCX</span>
            </TabsTrigger>
            <TabsTrigger value="image" className="flex items-center gap-2">
              <Upload className="w-4 h-4" />
              <span className="hidden sm:inline">Imagen</span>
            </TabsTrigger>
          </TabsList>

          {/* Merge PDF */}
          <TabsContent value="merge" className="space-y-6">
            <div className="grid gap-6">
              <Card className="p-6 border border-gray-200 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <Merge className="w-6 h-6 text-blue-600" />
                  <h2 className="text-2xl font-semibold text-gray-900" style={{ fontFamily: "'Syne', sans-serif" }}>
                    Unir PDFs
                  </h2>
                </div>
                <p className="text-gray-600 mb-6">
                  Carga varios archivos PDF y únelos en un solo documento. Puedes reordenarlos antes de descargar.
                </p>
                <PDFMerger />
              </Card>
            </div>
          </TabsContent>

          {/* Split PDF */}
          <TabsContent value="split" className="space-y-6">
            <div className="grid gap-6">
              <Card className="p-6 border border-gray-200 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <Split className="w-6 h-6 text-blue-600" />
                  <h2 className="text-2xl font-semibold text-gray-900" style={{ fontFamily: "'Syne', sans-serif" }}>
                    Dividir PDF
                  </h2>
                </div>
                <p className="text-gray-600 mb-6">
                  Extrae páginas específicas de un PDF o divide el documento en múltiples archivos.
                </p>
                <PDFSplitter />
              </Card>
            </div>
          </TabsContent>

          {/* Edit PDF */}
          <TabsContent value="edit" className="space-y-6">
            <div className="grid gap-6">
              <Card className="p-6 border border-gray-200 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <Edit3 className="w-6 h-6 text-blue-600" />
                  <h2 className="text-2xl font-semibold text-gray-900" style={{ fontFamily: "'Syne', sans-serif" }}>
                    Editar PDF
                  </h2>
                </div>
                <p className="text-gray-600 mb-6">
                  Añade anotaciones, texto, formas y firmas a tus documentos PDF.
                </p>
                <PDFEditor />
              </Card>
            </div>
          </TabsContent>

          {/* DOCX to PDF */}
          <TabsContent value="docx" className="space-y-6">
            <div className="grid gap-6">
              <Card className="p-6 border border-gray-200 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <FileText className="w-6 h-6 text-blue-600" />
                  <h2 className="text-2xl font-semibold text-gray-900" style={{ fontFamily: "'Syne', sans-serif" }}>
                    DOCX a PDF
                  </h2>
                </div>
                <p className="text-gray-600 mb-6">
                  Convierte archivos Word (.doc, .docx) a PDF manteniendo el formato original.
                </p>
                <DocxConverter />
              </Card>
            </div>
          </TabsContent>

          {/* Image to PDF */}
          <TabsContent value="image" className="space-y-6">
            <div className="grid gap-6">
              <Card className="p-6 border border-gray-200 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <Upload className="w-6 h-6 text-blue-600" />
                  <h2 className="text-2xl font-semibold text-gray-900" style={{ fontFamily: "'Syne', sans-serif" }}>
                    Imagen a PDF
                  </h2>
                </div>
                <p className="text-gray-600 mb-6">
                  Convierte imágenes JPG, PNG y otros formatos a PDF.
                </p>
                <ImageConverter />
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Privacy Notice */}
        <div className="mt-12 p-6 bg-blue-50 border border-blue-200 rounded-lg">
          <h3 className="font-semibold text-gray-900 mb-2">Privacidad Garantizada</h3>
          <p className="text-sm text-gray-700">
            Todos tus archivos se procesan directamente en tu navegador. Nunca se suben a ningún servidor. Tu privacidad es nuestra prioridad.
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 mt-16 py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Sobre nosotros</h4>
              <p className="text-sm text-gray-600">
                Editor de PDF gratuito, de código abierto y sin costes de servidor.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Características</h4>
              <ul className="text-sm text-gray-600 space-y-2">
                <li><a href="#" className="hover:text-blue-600">Unir PDFs</a></li>
                <li><a href="#" className="hover:text-blue-600">Dividir PDFs</a></li>
                <li><a href="#" className="hover:text-blue-600">Editar PDFs</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Recursos</h4>
              <ul className="text-sm text-gray-600 space-y-2">
                <li><a href="#" className="hover:text-blue-600">GitHub</a></li>
                <li><a href="#" className="hover:text-blue-600">Documentación</a></li>
                <li><a href="#" className="hover:text-blue-600">Privacidad</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-200 pt-8 text-center text-sm text-gray-600">
            <p>&copy; 2026 PDF Editor. Open Source bajo licencia MIT.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
