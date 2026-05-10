import { useState } from "react";
import { PDFDocument } from "pdf-lib";
import { Download, Loader2, GripVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import UploadZone from "@/components/UploadZone";
import { toast } from "sonner";

interface PDFFile {
  file: File;
  id: string;
}

export default function PDFMerger() {
  const [files, setFiles] = useState<PDFFile[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [draggedId, setDraggedId] = useState<string | null>(null);

  const handleFilesSelected = (selectedFiles: File[]) => {
    const pdfFiles = selectedFiles.filter((f) => f.type === "application/pdf");
    if (pdfFiles.length !== selectedFiles.length) {
      toast.error("Solo se pueden unir archivos PDF");
    }

    const newFiles: PDFFile[] = pdfFiles.map((file) => ({
      file,
      id: Math.random().toString(36),
    }));

    setFiles((prev) => [...prev, ...newFiles]);
    toast.success(`${pdfFiles.length} PDF(s) añadido(s)`);
  };

  const removeFile = (id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  };

  const moveFile = (fromIndex: number, toIndex: number) => {
    const newFiles = [...files];
    const [movedFile] = newFiles.splice(fromIndex, 1);
    newFiles.splice(toIndex, 0, movedFile);
    setFiles(newFiles);
  };

  const mergePDFs = async () => {
    if (files.length < 2) {
      toast.error("Necesitas al menos 2 PDFs para unir");
      return;
    }

    setIsLoading(true);
    try {
      const mergedPdf = await PDFDocument.create();

      for (const { file } of files) {
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await PDFDocument.load(arrayBuffer);
        const copiedPages = await mergedPdf.copyPages(
          pdf,
          pdf.getPageIndices()
        );
        copiedPages.forEach((page) => mergedPdf.addPage(page));
      }

      const pdfBytes = await mergedPdf.save();
      const blob = new Blob([pdfBytes], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "merged.pdf";
      link.click();
      URL.revokeObjectURL(url);

      toast.success("PDFs unidos exitosamente");
      setFiles([]);
    } catch (error) {
      console.error("Error merging PDFs:", error);
      toast.error("Error al unir los PDFs");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <UploadZone
        onFilesSelected={handleFilesSelected}
        acceptedFormats={[".pdf"]}
        multiple={true}
      />

      {files.length > 0 && (
        <div className="space-y-4">
          <h3 className="font-semibold text-gray-900">
            Orden de los archivos ({files.length})
          </h3>

          <div className="space-y-2 bg-gray-50 p-4 rounded-lg border border-gray-200">
            {files.map((item, index) => (
              <div
                key={item.id}
                draggable
                onDragStart={() => setDraggedId(item.id)}
                onDragOver={(e) => e.preventDefault()}
                onDrop={() => {
                  const draggedIndex = files.findIndex(
                    (f) => f.id === draggedId
                  );
                  if (draggedIndex !== index) {
                    moveFile(draggedIndex, index);
                  }
                  setDraggedId(null);
                }}
                className={`flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-lg cursor-move transition ${
                  draggedId === item.id ? "opacity-50" : ""
                }`}
              >
                <GripVertical className="w-5 h-5 text-gray-400" />
                <div className="flex-1">
                  <p className="font-medium text-gray-900 truncate">
                    {index + 1}. {item.file.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {(item.file.size / (1024 * 1024)).toFixed(2)} MB
                  </p>
                </div>
                <button
                  onClick={() => removeFile(item.id)}
                  className="text-gray-400 hover:text-red-600 transition"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>

          <Button
            onClick={mergePDFs}
            disabled={isLoading || files.length < 2}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Uniendo...
              </>
            ) : (
              <>
                <Download className="w-4 h-4 mr-2" />
                Descargar PDF Unido
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  );
}
