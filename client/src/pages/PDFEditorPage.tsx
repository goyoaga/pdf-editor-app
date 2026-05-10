import { useState, useRef, useEffect } from "react";
import { Link } from "wouter";
import { ArrowLeft, ZoomIn, ZoomOut, ChevronLeft, ChevronRight, FileUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import UploadZone from "@/components/UploadZone";
import { toast } from "sonner";

import * as pdfjsLib from "pdfjs-dist";
import pdfWorker from "pdfjs-dist/build/pdf.worker.min.mjs?url";

// Configurar el worker de PDF.js
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;

export default function PDFEditorPage() {
  const [file, setFile] = useState<File | null>(null);
  const [pdfDoc, setPdfDoc] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [scale, setScale] = useState(1.5);
  const [isRendering, setIsRendering] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Cargar el documento PDF inicial
  const handleFilesSelected = async (files: File[]) => {
    if (files.length === 0) return;
    const selectedFile = files[0];
    
    if (selectedFile.type !== "application/pdf") {
      toast.error("Por favor, sube un archivo PDF válido.");
      return;
    }

    try {
      const arrayBuffer = await selectedFile.arrayBuffer();
      const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
      const pdf = await loadingTask.promise;

      setFile(selectedFile);
      setPdfDoc(pdf);
      setTotalPages(pdf.numPages);
      setCurrentPage(1);
      setScale(1.5); // Reset scale
      toast.success("Documento cargado correctamente");
    } catch (error) {
      console.error("Error al cargar PDF:", error);
      toast.error("Error al procesar el archivo PDF.");
    }
  };

  // Renderizar la página actual en el Canvas
  useEffect(() => {
    if (!pdfDoc || !canvasRef.current) return;

    let renderTask: any = null;

    const renderPage = async () => {
      try {
        setIsRendering(true);
        const page = await pdfDoc.getPage(currentPage);
        const viewport = page.getViewport({ scale });
        const canvas = canvasRef.current;
        if (!canvas) return;
        
        const context = canvas.getContext("2d");
        if (!context) return;

        // Ajustar dimensiones del canvas
        canvas.width = viewport.width;
        canvas.height = viewport.height;

        const renderContext = {
          canvasContext: context,
          viewport: viewport,
        };

        renderTask = page.render(renderContext);
        await renderTask.promise;
      } catch (error: any) {
        if (error?.name !== "RenderingCancelledException") {
          console.error("Error renderizando página:", error);
        }
      } finally {
        setIsRendering(false);
      }
    };

    renderPage();

    return () => {
      if (renderTask) {
        renderTask.cancel();
      }
    };
  }, [pdfDoc, currentPage, scale]);

  const zoomIn = () => setScale((prev) => Math.min(prev + 0.25, 3.0));
  const zoomOut = () => setScale((prev) => Math.max(prev - 0.25, 0.5));
  const nextPage = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  const prevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
  const resetFile = () => {
    setFile(null);
    setPdfDoc(null);
  };

  return (
    <div className="min-h-screen bg-surface flex flex-col">
      {/* Navbar Minimalista */}
      <header className="h-16 border-b border-outline-variant bg-surface-container-lowest flex items-center justify-between px-4 md:px-8 shrink-0">
        <Link href="/">
          <Button variant="ghost" className="gap-2 -ml-2 text-muted-foreground hover:text-foreground">
            <ArrowLeft className="w-4 h-4" />
            Salir del editor
          </Button>
        </Link>
        <div className="flex items-center gap-2">
          <span className="font-black tracking-tight text-gray-900">FlowPDF</span>
          <span className="text-primary font-bold text-sm bg-primary/10 px-2 py-0.5 rounded-md">Editor</span>
        </div>
        <div className="w-32 flex justify-end">
          {file && (
            <Button variant="ghost" size="sm" onClick={resetFile} className="text-red-500 hover:text-red-600 hover:bg-red-50">
              <FileUp className="w-4 h-4 mr-2" />
              Cambiar PDF
            </Button>
          )}
        </div>
      </header>

      {/* Main Workspace */}
      <main className="flex-1 bg-gray-100 flex flex-col overflow-hidden relative">
        {!file ? (
          <div className="flex-1 flex items-center justify-center p-4">
            <div className="max-w-2xl w-full bg-white p-8 rounded-2xl shadow-sm border border-gray-200">
              <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">Carga un documento para empezar a editar</h2>
              <UploadZone
                onFilesSelected={handleFilesSelected}
                acceptedFormats={[".pdf"]}
                multiple={false}
              />
            </div>
          </div>
        ) : (
          <>
            {/* Toolbar Superior (Fase 3: Aquí irán los textos y firmas) */}
            <div className="h-14 bg-white border-b border-gray-200 flex items-center justify-center gap-2 shrink-0 shadow-sm z-10 px-4">
              <span className="text-sm font-medium text-gray-500 mr-4">Herramientas:</span>
              <Button variant="outline" size="sm" disabled className="opacity-50">Añadir Texto (Próximamente)</Button>
              <Button variant="outline" size="sm" disabled className="opacity-50">Firmar (Próximamente)</Button>
            </div>

            {/* Zona de Renderizado del Canvas */}
            <div className="flex-1 overflow-auto p-8 flex items-start justify-center">
              <div 
                className={`relative shadow-2xl transition-opacity duration-200 ${isRendering ? 'opacity-50' : 'opacity-100'}`}
                style={{ minHeight: '800px', backgroundColor: 'white' }}
              >
                <canvas ref={canvasRef} className="block" />
              </div>
            </div>

            {/* Controles Flotantes Inferiores (Zoom y Paginación) */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-white rounded-full shadow-lg border border-gray-200 px-4 py-2 flex items-center gap-6">
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="icon" onClick={zoomOut} disabled={scale <= 0.5} className="h-8 w-8 rounded-full hover:bg-gray-100">
                  <ZoomOut className="w-4 h-4 text-gray-700" />
                </Button>
                <span className="text-sm font-medium text-gray-600 w-12 text-center">{Math.round(scale * 100)}%</span>
                <Button variant="ghost" size="icon" onClick={zoomIn} disabled={scale >= 3.0} className="h-8 w-8 rounded-full hover:bg-gray-100">
                  <ZoomIn className="w-4 h-4 text-gray-700" />
                </Button>
              </div>

              <div className="w-px h-6 bg-gray-200"></div>

              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" onClick={prevPage} disabled={currentPage <= 1} className="h-8 w-8 rounded-full hover:bg-gray-100">
                  <ChevronLeft className="w-4 h-4 text-gray-700" />
                </Button>
                <span className="text-sm font-medium text-gray-600">Pág {currentPage} de {totalPages}</span>
                <Button variant="ghost" size="icon" onClick={nextPage} disabled={currentPage >= totalPages} className="h-8 w-8 rounded-full hover:bg-gray-100">
                  <ChevronRight className="w-4 h-4 text-gray-700" />
                </Button>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
