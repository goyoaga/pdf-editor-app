import { useState, useRef, useEffect } from "react";
import { Link } from "wouter";
import { ArrowLeft, ChevronLeft, ChevronRight, FileUp, Type, Pen, Download, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import UploadZone from "@/components/UploadZone";
import { toast } from "sonner";

import * as pdfjsLib from "pdfjs-dist";
import pdfWorker from "pdfjs-dist/build/pdf.worker.min.mjs?url";
import { Canvas, IText, PencilBrush } from "fabric";
import { PDFDocument } from "pdf-lib";

// Configurar el worker de PDF.js
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;

export default function PDFEditorPage() {
  const [file, setFile] = useState<File | null>(null);
  const [pdfDoc, setPdfDoc] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  
  const [isRendering, setIsRendering] = useState(false);
  const [isDrawingMode, setIsDrawingMode] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  
  const pdfCanvasRef = useRef<HTMLCanvasElement>(null);
  const fabricCanvasRef = useRef<HTMLCanvasElement>(null);
  const fabricInstance = useRef<Canvas | null>(null);
  
  // Guardar los dibujos/textos de cada página: { json, width, height }
  const pageData = useRef<Record<number, any>>({});
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });

  // Escala fija para evitar problemas de coordenadas en la exportación
  const scale = 1.5;

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
      pageData.current = {};
      toast.success("Documento cargado correctamente");
    } catch (error) {
      console.error("Error al cargar PDF:", error);
      toast.error("Error al procesar el archivo PDF.");
    }
  };

  useEffect(() => {
    if (!fabricCanvasRef.current) return;
    if (!fabricInstance.current) {
      fabricInstance.current = new Canvas(fabricCanvasRef.current, {
        isDrawingMode: false,
      });
    }
    return () => {
      if (fabricInstance.current) {
        fabricInstance.current.dispose();
        fabricInstance.current = null;
      }
    };
  }, [file]);

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

        canvas.width = viewport.width;
        canvas.height = viewport.height;
        setCanvasSize({ width: viewport.width, height: viewport.height });
        
        fabricInstance.current?.setDimensions({
          width: viewport.width,
          height: viewport.height
        });

        const renderContext = {
          canvasContext: context,
          viewport: viewport,
        };
        renderTask = page.render(renderContext);
        await renderTask.promise;

        fabricInstance.current?.clear();
        const savedData = pageData.current[currentPage];
        if (savedData && savedData.json) {
          await fabricInstance.current?.loadFromJSON(savedData.json);
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

  const saveCurrentPageData = () => {
    if (fabricInstance.current) {
      pageData.current[currentPage] = {
        json: fabricInstance.current.toJSON(),
        width: canvasSize.width,
        height: canvasSize.height
      };
    }
  };

  const addText = () => {
    if (!fabricInstance.current) return;
    const text = new IText("Haz doble clic para editar", {
      left: 50,
      top: 50,
      fontFamily: "Inter",
      fill: "#0f172a",
      fontSize: 24,
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
      brush.color = "#2563eb";
      brush.width = 3;
      canvas.freeDrawingBrush = brush;
    }
    setIsDrawingMode(canvas.isDrawingMode);
    
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

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Delete" || e.key === "Backspace") {
        if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
        deleteSelected();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const changePage = (newPage: number) => {
    saveCurrentPageData();
    setCurrentPage(newPage);
  };

  const resetFile = () => {
    setFile(null);
    setPdfDoc(null);
  };

  const handleDownload = async () => {
    if (!file) return;
    try {
      setIsExporting(true);
      saveCurrentPageData(); // Asegurar que guardamos la página actual

      // 1. Cargar el PDF original con pdf-lib
      const arrayBuffer = await file.arrayBuffer();
      const pdfDocExport = await PDFDocument.load(arrayBuffer);

      // 2. Crear un canvas temporal (offscreen) para renderizar las capas de Fabric
      const offscreenHtmlCanvas = document.createElement("canvas");
      const offscreenFabric = new Canvas(offscreenHtmlCanvas);

      // 3. Iterar por cada página modificada
      for (let i = 1; i <= totalPages; i++) {
        const savedData = pageData.current[i];
        
        // Si hay datos y hay objetos dibujados/escritos
        if (savedData && savedData.json && savedData.json.objects.length > 0) {
          // Configurar el canvas temporal al tamaño exacto en el que se dibujó
          offscreenFabric.setDimensions({ width: savedData.width, height: savedData.height });
          await offscreenFabric.loadFromJSON(savedData.json);
          offscreenFabric.renderAll();

          // Exportar a PNG transparente
          const dataUrl = offscreenFabric.toDataURL({ format: "png", multiplier: 2 }); // Multiplier 2 para alta resolución
          const pngImage = await pdfDocExport.embedPng(dataUrl);

          // Obtener la página correspondiente en pdf-lib (índice base 0)
          const page = pdfDocExport.getPage(i - 1);
          const { width: pdfWidth, height: pdfHeight } = page.getSize();

          // Dibujar el PNG cubriendo toda la página
          // pdf-lib escalará el PNG al tamaño exacto de la página PDF original
          page.drawImage(pngImage, {
            x: 0,
            y: 0,
            width: pdfWidth,
            height: pdfHeight,
          });
        }
      }

      // 4. Guardar y descargar el PDF final
      const pdfBytes = await pdfDocExport.save();
      const blob = new Blob([pdfBytes], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement("a");
      link.href = url;
      // Usar prefijo flowpdf_
      const originalName = file.name.replace(".pdf", "");
      link.download = `flowpdf_${originalName}_editado.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      URL.revokeObjectURL(url);
      toast.success("¡PDF guardado con éxito!");

    } catch (error) {
      console.error("Error exportando PDF:", error);
      toast.error("Ocurrió un error al guardar el documento.");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface flex flex-col">
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
            <div className="h-14 bg-white border-b border-gray-200 flex items-center justify-center gap-2 shrink-0 shadow-sm z-10 px-4 relative">
              <span className="text-sm font-medium text-gray-500 mr-4 hidden md:inline">Añadir elementos:</span>
              <Button variant="outline" size="sm" onClick={addText} className="gap-2">
                <Type className="w-4 h-4" /> Texto
              </Button>
              <Button 
                variant={isDrawingMode ? "default" : "outline"}
                size="sm" 
                onClick={toggleDrawingMode}
                className={`gap-2 ${isDrawingMode ? "bg-blue-600 hover:bg-blue-700 text-white border-transparent" : ""}`}
              >
                <Pen className="w-4 h-4" /> {isDrawingMode ? "Dejar de dibujar" : "Firmar / Dibujar"}
              </Button>
              <div className="w-px h-6 bg-gray-200 mx-2 hidden md:block"></div>
              <Button variant="outline" size="sm" onClick={deleteSelected} className="gap-2 text-red-600 hover:bg-red-50 hover:text-red-700 border-red-200 hidden md:flex">
                Eliminar selección
              </Button>

              <div className="absolute right-4">
                <Button 
                  size="sm" 
                  onClick={handleDownload}
                  disabled={isExporting}
                  className="gap-2 bg-gray-900 text-white hover:bg-gray-800 shadow-sm"
                >
                  {isExporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                  {isExporting ? "Procesando..." : "Descargar PDF"}
                </Button>
              </div>
            </div>

            <div className="flex-1 overflow-auto p-4 md:p-8 flex items-start justify-center">
              <div 
                className={`relative shadow-2xl transition-opacity duration-200 ${isRendering ? 'opacity-50' : 'opacity-100'}`}
                style={{ width: canvasSize.width, height: canvasSize.height, minHeight: '800px', backgroundColor: 'white' }}
              >
                <canvas ref={pdfCanvasRef} className="absolute top-0 left-0 pointer-events-none" />
                <canvas ref={fabricCanvasRef} className="absolute top-0 left-0" />
              </div>
            </div>

            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-white rounded-full shadow-lg border border-gray-200 px-4 py-2 flex items-center gap-4 z-20">
              <Button variant="ghost" size="icon" onClick={() => changePage(Math.max(currentPage - 1, 1))} disabled={currentPage <= 1} className="h-8 w-8 rounded-full hover:bg-gray-100">
                <ChevronLeft className="w-4 h-4 text-gray-700" />
              </Button>
              <span className="text-sm font-medium text-gray-600">Pág {currentPage} de {totalPages}</span>
              <Button variant="ghost" size="icon" onClick={() => changePage(Math.min(currentPage + 1, totalPages))} disabled={currentPage >= totalPages} className="h-8 w-8 rounded-full hover:bg-gray-100">
                <ChevronRight className="w-4 h-4 text-gray-700" />
              </Button>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
