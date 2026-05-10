import { useState } from "react";
import { PDFDocument } from "pdf-lib";
import { Download, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import UploadZone from "@/components/UploadZone";
import { toast } from "sonner";

export default function PDFSplitter() {
  const [file, setFile] = useState<File | null>(null);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [startPage, setStartPage] = useState("1");
  const [endPage, setEndPage] = useState("1");
  const [splitMode, setSplitMode] = useState<"range" | "individual">("range");

  const handleFilesSelected = async (files: File[]) => {
    if (files.length === 0) return;

    const selectedFile = files[0];
    if (selectedFile.type !== "application/pdf") {
      toast.error("Solo se pueden dividir archivos PDF");
      return;
    }

    try {
      const arrayBuffer = await selectedFile.arrayBuffer();
      const pdf = await PDFDocument.load(arrayBuffer);
      const pages = pdf.getPageCount();

      setFile(selectedFile);
      setTotalPages(pages);
      setEndPage(pages.toString());
      toast.success(`PDF cargado: ${pages} páginas`);
    } catch (error) {
      console.error("Error loading PDF:", error);
      toast.error("Error al cargar el PDF");
    }
  };

  const splitPDF = async () => {
    if (!file || totalPages === 0) {
      toast.error("Por favor carga un PDF primero");
      return;
    }

    setIsLoading(true);
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await PDFDocument.load(arrayBuffer);

      if (splitMode === "range") {
        const start = Math.max(1, parseInt(startPage) || 1);
        const end = Math.min(totalPages, parseInt(endPage) || totalPages);

        if (start > end) {
          toast.error("La página inicial debe ser menor que la final");
          setIsLoading(false);
          return;
        }

        const newPdf = await PDFDocument.create();
        const pages = await newPdf.copyPages(
          pdf,
          Array.from({ length: end - start + 1 }, (_, i) => start - 1 + i)
        );
        pages.forEach((page) => newPdf.addPage(page));

        const pdfBytes = await newPdf.save();
        const blob = new Blob([pdfBytes], { type: "application/pdf" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `split_${start}-${end}.pdf`;
        link.click();
        URL.revokeObjectURL(url);

        toast.success(`PDF dividido: páginas ${start}-${end}`);
      } else {
        // Individual pages
        for (let i = 0; i < totalPages; i++) {
          const newPdf = await PDFDocument.create();
          const pages = await newPdf.copyPages(pdf, [i]);
          pages.forEach((page) => newPdf.addPage(page));

          const pdfBytes = await newPdf.save();
          const blob = new Blob([pdfBytes], { type: "application/pdf" });
          const url = URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.href = url;
          link.download = `page_${i + 1}.pdf`;
          link.click();
          URL.revokeObjectURL(url);
        }
        toast.success(`${totalPages} PDFs descargados`);
      }
    } catch (error) {
      console.error("Error splitting PDF:", error);
      toast.error("Error al dividir el PDF");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <UploadZone
        onFilesSelected={handleFilesSelected}
        acceptedFormats={[".pdf"]}
        multiple={false}
      />

      {file && totalPages > 0 && (
        <div className="space-y-4 bg-gray-50 p-6 rounded-lg border border-gray-200">
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">
              Modo de división
            </h3>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  checked={splitMode === "range"}
                  onChange={() => setSplitMode("range")}
                  className="w-4 h-4"
                />
                <span className="text-gray-700">Rango de páginas</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  checked={splitMode === "individual"}
                  onChange={() => setSplitMode("individual")}
                  className="w-4 h-4"
                />
                <span className="text-gray-700">Cada página por separado</span>
              </label>
            </div>
          </div>

          {splitMode === "range" && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Página inicial
                </label>
                <Input
                  type="number"
                  min="1"
                  max={totalPages}
                  value={startPage}
                  onChange={(e) => setStartPage(e.target.value)}
                  className="w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Página final (máx: {totalPages})
                </label>
                <Input
                  type="number"
                  min="1"
                  max={totalPages}
                  value={endPage}
                  onChange={(e) => setEndPage(e.target.value)}
                  className="w-full"
                />
              </div>
            </div>
          )}

          <Button
            onClick={splitPDF}
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Dividiendo...
              </>
            ) : (
              <>
                <Download className="w-4 h-4 mr-2" />
                Descargar PDF(s) Dividido(s)
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  );
}
