import { useState } from "react";
import { renderAsync } from "docx-preview";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { Download, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import UploadZone from "@/components/UploadZone";
import { toast } from "sonner";

export default function DocxConverter() {
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleFilesSelected = async (files: File[]) => {
    if (files.length === 0) return;

    const selectedFile = files[0];
    const isDocx =
      selectedFile.type ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
    const isDoc = selectedFile.type === "application/msword";

    if (!isDocx && !isDoc) {
      toast.error("Solo se pueden convertir archivos .doc y .docx");
      return;
    }

    setFile(selectedFile);
    toast.success("Documento cargado. Pulsa 'Convertir' para generar el PDF.");
  };

  const convertToPDF = async () => {
    if (!file) return;

    setIsLoading(true);
    try {
      // Create a container for rendering
      const container = document.createElement("div");
      container.style.position = "absolute";
      container.style.left = "-9999px";
      container.style.width = "210mm"; // A4 width
      container.style.padding = "20px";
      container.style.background = "white";
      document.body.appendChild(container);

      // Read and render the DOCX file
      const arrayBuffer = await file.arrayBuffer();
      await renderAsync(arrayBuffer, container);

      // Wait for images to load
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Convert to canvas
      const canvas = await html2canvas(container, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: "#ffffff",
      });

      // Create PDF from canvas
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const imgData = canvas.toDataURL("image/jpeg", 0.98);
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = pageWidth - 20;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      let heightLeft = imgHeight;
      let position = 10;

      // Add pages
      pdf.addImage(imgData, "JPEG", 10, position, imgWidth, imgHeight);
      heightLeft -= pageHeight - 20;

      while (heightLeft > 0) {
        position = heightLeft - imgHeight + 10;
        pdf.addPage();
        pdf.addImage(imgData, "JPEG", 10, position, imgWidth, imgHeight);
        heightLeft -= pageHeight - 20;
      }

      // Download PDF
      pdf.save(`flowpdf_${file.name.replace(/\.[^/.]+$/, "")}.pdf`);
      toast.success("Archivo convertido exitosamente");

      // Clean up
      document.body.removeChild(container);
      setFile(null); // Reset after successful download
    } catch (error) {
      console.error("Error converting DOCX:", error);
      toast.error("Error al convertir el archivo");
    } finally {
      setIsLoading(false);
    }
  };

  const cancelConversion = () => {
    setFile(null);
  };

  return (
    <div className="space-y-6">
      {!file ? (
        <UploadZone
          onFilesSelected={handleFilesSelected}
          acceptedFormats={[".doc", ".docx"]}
          multiple={false}
        />
      ) : (
        <div className="space-y-4">
          <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg flex items-center justify-between">
            <span className="font-medium text-gray-700 truncate max-w-[70%]">{file.name}</span>
            <Button variant="ghost" size="sm" onClick={cancelConversion} disabled={isLoading} className="text-red-500 hover:text-red-700 hover:bg-red-50">
              Cancelar
            </Button>
          </div>
          
          <Button
            onClick={convertToPDF}
            disabled={isLoading}
            className="w-full bg-primary hover:opacity-90 text-white"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Convirtiendo documento...
              </>
            ) : (
              <>
                <Download className="w-4 h-4 mr-2" />
                Convertir a PDF
              </>
            )}
          </Button>
        </div>
      )}

      <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
        <p className="text-sm text-amber-900 font-medium">
          ⚠️ Nota sobre el formato: La conversión divide el documento en páginas fijas (A4). Si un texto o tabla queda justo en el borde, podría cortarse. Para documentos muy complejos, se recomienda usar la opción "Guardar como PDF" de Word.
        </p>
      </div>
    </div>
  );
}
