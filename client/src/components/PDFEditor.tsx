import { useState, useRef } from "react";
import * as pdfjsLib from "pdfjs-dist";
import { Download, Loader2, Type, Square, Pen } from "lucide-react";
import { Button } from "@/components/ui/button";
import UploadZone from "@/components/UploadZone";
import { toast } from "sonner";

// Set up PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

export default function PDFEditor() {
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [pdfDoc, setPdfDoc] = useState<any>(null);

  const handleFilesSelected = async (files: File[]) => {
    if (files.length === 0) return;

    const selectedFile = files[0];
    if (selectedFile.type !== "application/pdf") {
      toast.error("Solo se pueden editar archivos PDF");
      return;
    }

    try {
      setIsLoading(true);
      const arrayBuffer = await selectedFile.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

      setFile(selectedFile);
      setPdfDoc(pdf);
      setTotalPages(pdf.numPages);
      setCurrentPage(1);

      // Render first page
      renderPage(pdf, 1);
      toast.success("PDF cargado correctamente");
    } catch (error) {
      console.error("Error loading PDF:", error);
      toast.error("Error al cargar el PDF");
    } finally {
      setIsLoading(false);
    }
  };

  const renderPage = async (pdf: any, pageNum: number) => {
    try {
      const page = await pdf.getPage(pageNum);
      const viewport = page.getViewport({ scale: 1.5 });

      if (canvasRef.current) {
        canvasRef.current.width = viewport.width;
        canvasRef.current.height = viewport.height;

        const context = canvasRef.current.getContext("2d");
        if (context) {
          const renderContext = {
            canvasContext: context,
            viewport: viewport,
          };
          await page.render(renderContext).promise;
        }
      }
    } catch (error) {
      console.error("Error rendering page:", error);
      toast.error("Error al renderizar la página");
    }
  };

  const goToPage = (pageNum: number) => {
    if (pdfDoc && pageNum >= 1 && pageNum <= totalPages) {
      setCurrentPage(pageNum);
      renderPage(pdfDoc, pageNum);
    }
  };

  return (
    <div className="space-y-6">
      <UploadZone
        onFilesSelected={handleFilesSelected}
        acceptedFormats={[".pdf"]}
        multiple={false}
      />

      {file && pdfDoc && (
        <div className="space-y-4">
          {/* Toolbar */}
          <div className="flex flex-wrap gap-2 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              <Type className="w-4 h-4" />
              Texto
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              <Square className="w-4 h-4" />
              Forma
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              <Pen className="w-4 h-4" />
              Dibujar
            </Button>
          </div>

          {/* PDF Viewer */}
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 overflow-auto max-h-96">
            {isLoading ? (
              <div className="flex items-center justify-center h-64">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
              </div>
            ) : (
              <canvas ref={canvasRef} className="mx-auto" />
            )}
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
            <Button
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage <= 1}
              variant="outline"
              size="sm"
            >
              Anterior
            </Button>
            <span className="text-sm text-gray-600">
              Página {currentPage} de {totalPages}
            </span>
            <Button
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage >= totalPages}
              variant="outline"
              size="sm"
            >
              Siguiente
            </Button>
          </div>

          {/* Download */}
          <Button className="w-full bg-primary hover:opacity-90 text-white">
            <Download className="w-4 h-4 mr-2" />
            Descargar PDF Editado
          </Button>
        </div>
      )}
    </div>
  );
}
