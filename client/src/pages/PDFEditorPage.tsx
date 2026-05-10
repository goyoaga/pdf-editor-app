import { useState, useRef, useEffect } from "react";
import { Link } from "wouter";
import { ArrowLeft, ZoomIn, ZoomOut, ChevronLeft, ChevronRight, FileUp, Type, Pen, Download, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import UploadZone from "@/components/UploadZone";
import { toast } from "sonner";

import * as pdfjsLib from "pdfjs-dist";
import pdfWorker from "pdfjs-dist/build/pdf.worker.min.mjs?url";
import { Canvas, IText, PencilBrush } from "fabric";

// Configurar el worker de PDF.js
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;

export default function PDFEditorPage() {
  const [file, setFile] = useState<File | null>(null);
  const [pdfDoc, setPdfDoc] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [scale, setScale] = useState(1.5);
  
  const [isRendering, setIsRendering] = useState(false);
  const [isDrawingMode, setIsDrawingMode] = useState(false);
  
  const pdfCanvasRef = useRef<HTMLCanvasElement>(null);
  const fabricCanvasRef = useRef<HTMLCanvasElement>(null);
  const fabricInstance = useRef<Canvas | null>(null);
  
  // Guardar los dibujos/textos de cada página
  const pageData = useRef<Record<number, any>>({});
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });

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
      setScale(1.5);
      pageData.current = {}; // Reset drawings
      toast.success("Documento cargado correctamente");
    } catch (error) {
      console.error("Error al cargar PDF:", error);
      toast.error("Error al procesar el archivo PDF.");
    }
  };

  // Inicializar y gestionar Fabric.js
  useEffect(() => {
    if (!fabricCanvasRef.current) return;
    
    // Crear instancia de Fabric solo una vez
    if (!fabricInstance.current) {
      fabricInstance.current = new Canvas(fabricCanvasRef.current, {
        isDrawingMode: false,
      });
    }

    return () => {
      // Limpiar al desmontar
      if (fabricInstance.current) {
        fabricInstance.current.dispose();
        fabricInstance.current = null;
      }
    };
  }, [file]); // Solo se recrea si cambia el archivo principal

  // Renderizar la página PDF y ajustar dimensiones de Fabric
  useEffect(() => {
    if (!pdfDoc || !pdfCanvasRef.current || !fabricInstance.current) return;

    let renderTask: any = null;

    const renderPage = async () => {
      try {
        setIsRendering(true);
        const page = await pdfDoc.getPage(currentPage);
        const viewport = page.getViewport({ scale });
        const canvas = pdfCanvasRef.current;
        if (!canvas) return;
        
        const context = canvas.getContext("2d");
        if (!context) return;

        // Ajustar dimensiones de ambos canvas
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        setCanvasSize({ width: viewport.width, height: viewport.height });
        
        fabricInstance.current?.setDimensions({
          width: viewport.width,
          height: viewport.height
        });

        // Renderizar el PDF base
        const renderContext = {
          canvasContext: context,
          viewport: viewport,
        };
        renderTask = page.render(renderContext);
        await renderTask.promise;

        // Cargar los dibujos guardados para esta página (si los hay)
        fabricInstance.current?.clear();
        const savedData = pageData.current[currentPage];
        if (savedData) {
          await fabricInstance.current?.loadFromJSON(savedData);
        }
        fabricInstance.current?.renderAll();

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

  // Guardar el estado actual antes de cambiar de página
  const saveCurrentPageData = () => {
    if (fabricInstance.current) {
      pageData.current[currentPage] = fabricInstance.current.toJSON();
    }
  };

  const addText = () => {
    if (!fabricInstance.current) return;
    const text = new IText("Haz doble clic para editar", {
      left: 50,
      top: 50,
      fontFamily: "Inter",
      fill: "#0f172a", // slate-900
      fontSize: Math.max(16, 24 * (scale / 1.5)), // Escalar fuente aprox
      transparentCorners: false,
      cornerColor: "#3b82f6",
      cornerStrokeColor: "#3b82f6",
      borderColor: "#3b82f6",
      cornerSize: 8,
      padding: 10,
    });
    fabricInstance.current.add(text);
    fabricInstance.current.setActiveObject(text);
    setIsDrawingMode(false);
    fabricInstance.current.isDrawingMode = false;
  };

  const toggleDrawingMode = () => {
    if (!fabricInstance.current) return;
    const canvas = fabricInstance.current;
    canvas.isDrawingMode = !canvas.isDrawingMode;
    if (canvas.isDrawingMode) {
      const brush = new PencilBrush(canvas);
      brush.color = "#2563eb"; // blue-600 (tinta de boli)
      brush.width = Math.max(1, 3 * (scale / 1.5));
      canvas.freeDrawingBrush = brush;
    }
    setIsDrawingMode(canvas.isDrawingMode);
    
    // Deseleccionar objetos activos al entrar en modo dibujo
    if (canvas.isDrawingMode) {
      canvas.discardActiveObject();
      canvas.requestRenderAll();
    }
  };

  const deleteSelected = () => {
    if (!fabricInstance.current) return;
    const activeObjects = fabricInstance.current.getActiveObjects();
    if (activeObjects.length) {
      activeObjects.forEach(obj => fabricInstance.current?.remove(obj));
      fabricInstance.current.discardActiveObject();
    }
  };

  // Manejar eventos de teclado para borrar
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Delete" || e.key === "Backspace") {
        // Evitar borrar si estamos editando texto
        if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
        deleteSelected();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const changePage = (newPage: number) => {
    saveCurrentPageData(); // Guardar antes de cambiar
    setCurrentPage(newPage);
  };

  const zoomIn = () => {
    saveCurrentPageData();
    setScale((prev) => Math.min(prev + 0.25, 3.0));
  };
  const zoomOut = () => {
    saveCurrentPageData();
    setScale((prev) => Math.max(prev - 0.25, 0.5));
  };
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
            {/* Toolbar Superior */}
            <div className="h-14 bg-white border-b border-gray-200 flex items-center justify-center gap-2 shrink-0 shadow-sm z-10 px-4 relative">
              <span className="text-sm font-medium text-gray-500 mr-4 hidden md:inline">Añadir elementos:</span>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={addText}
                className="gap-2"
              >
                <Type className="w-4 h-4" />
                Texto
              </Button>
              <Button 
                variant={isDrawingMode ? "default" : "outline"}
                size="sm" 
                onClick={toggleDrawingMode}
                className={`gap-2 ${isDrawingMode ? "bg-blue-600 hover:bg-blue-700 text-white border-transparent" : ""}`}
              >
                <Pen className="w-4 h-4" />
                {isDrawingMode ? "Dejar de dibujar" : "Firmar / Dibujar"}
              </Button>
              
              <div className="w-px h-6 bg-gray-200 mx-2 hidden md:block"></div>
              
              <Button 
                variant="outline" 
                size="sm" 
                onClick={deleteSelected}
                className="gap-2 text-red-600 hover:bg-red-50 hover:text-red-700 border-red-200 hidden md:flex"
              >
                Eliminar selección
              </Button>

              <div className="absolute right-4">
                <Button size="sm" disabled className="gap-2 bg-gray-200 text-gray-500 cursor-not-allowed">
                  <Download className="w-4 h-4" />
                  Descargar (Próximamente)
                </Button>
              </div>
            </div>

            {/* Zona de Renderizado del Canvas */}
            <div className="flex-1 overflow-auto p-4 md:p-8 flex items-start justify-center">
              <div 
                className={`relative shadow-2xl transition-opacity duration-200 ${isRendering ? 'opacity-50' : 'opacity-100'}`}
                style={{ width: canvasSize.width, height: canvasSize.height, minHeight: '800px', backgroundColor: 'white' }}
              >
                {/* Capa inferior: PDF */}
                <canvas ref={pdfCanvasRef} className="absolute top-0 left-0 pointer-events-none" />
                {/* Capa superior: Fabric.js */}
                <canvas ref={fabricCanvasRef} className="absolute top-0 left-0" />
              </div>
            </div>

            {/* Controles Flotantes Inferiores (Zoom y Paginación) */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-white rounded-full shadow-lg border border-gray-200 px-4 py-2 flex items-center gap-6 z-20">
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
                <Button variant="ghost" size="icon" onClick={() => changePage(Math.max(currentPage - 1, 1))} disabled={currentPage <= 1} className="h-8 w-8 rounded-full hover:bg-gray-100">
                  <ChevronLeft className="w-4 h-4 text-gray-700" />
                </Button>
                <span className="text-sm font-medium text-gray-600">Pág {currentPage} de {totalPages}</span>
                <Button variant="ghost" size="icon" onClick={() => changePage(Math.min(currentPage + 1, totalPages))} disabled={currentPage >= totalPages} className="h-8 w-8 rounded-full hover:bg-gray-100">
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
