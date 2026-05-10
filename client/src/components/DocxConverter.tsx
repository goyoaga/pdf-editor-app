import { useState } from "react";
import { renderAsync } from "docx-preview";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { Download, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import UploadZone from "@/components/UploadZone";
import { toast } from "sonner";

export default function DocxConverter() {
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
      const arrayBuffer = await selectedFile.arrayBuffer();
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
      pdf.save(`${selectedFile.name.replace(/\.[^/.]+$/, "")}.pdf`);
      toast.success("Archivo convertido exitosamente");

      // Clean up
      document.body.removeChild(container);
    } catch (error) {
      console.error("Error converting DOCX:", error);
      toast.error("Error al convertir el archivo");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <UploadZone
        onFilesSelected={handleFilesSelected}
        acceptedFormats={[".doc", ".docx"]}
        multiple={false}
      />

      {isLoading && (
        <div className="flex items-center justify-center p-8 bg-blue-50 rounded-lg border border-blue-200">
          <Loader2 className="w-6 h-6 animate-spin text-blue-600 mr-3" />
          <span className="text-blue-900">Convirtiendo documento...</span>
        </div>
      )}

      <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
        <p className="text-sm text-amber-900">
          La conversión mantiene el formato básico del documento. Documentos muy
          complejos pueden tener variaciones menores en el layout.
        </p>
      </div>
    </div>
  );
}
