import { useState } from "react";
import jsPDF from "jspdf";
import { Download, Loader2, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import UploadZone from "@/components/UploadZone";
import { toast } from "sonner";

interface ImageFile {
  file: File;
  id: string;
  preview: string;
}

export default function ImageConverter() {
  const [images, setImages] = useState<ImageFile[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleFilesSelected = async (files: File[]) => {
    if (files.length === 0) return;

    const imageFiles = files.filter((f) =>
      ["image/jpeg", "image/png", "image/webp"].includes(f.type)
    );

    if (imageFiles.length !== files.length) {
      toast.error("Solo se soportan imágenes JPG, PNG y WebP");
    }

    const newImages: ImageFile[] = await Promise.all(
      imageFiles.map(async (file) => {
        const preview = await new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onload = (e) => resolve(e.target?.result as string);
          reader.readAsDataURL(file);
        });

        return {
          file,
          id: Math.random().toString(36),
          preview,
        };
      })
    );

    setImages((prev) => [...prev, ...newImages]);
    toast.success(`${imageFiles.length} imagen(es) añadida(s)`);
  };

  const removeImage = (id: string) => {
    setImages((prev) => prev.filter((img) => img.id !== id));
  };

  const isIOS = () => {
    return /iPad|iPhone|iPod/.test(navigator.userAgent);
  };

  const convertToPDF = async () => {
    if (images.length === 0) {
      toast.error("Por favor añade al menos una imagen");
      return;
    }

    setIsLoading(true);
    try {
      const pdf = new jsPDF({
        orientation: "portrait" as const,
        unit: "mm",
        format: "a4",
      });

      for (let i = 0; i < images.length; i++) {
        const image = images[i];
        const img = new Image();

        await new Promise<void>((resolve) => {
          img.onload = () => resolve();
          img.src = image.preview;
        });

        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();
        const imgWidth = pageWidth - 20;
        const imgHeight = (img.height * imgWidth) / img.width;

        if (i > 0) {
          pdf.addPage();
        }

        const yPosition = Math.max(10, (pageHeight - imgHeight) / 2);
        pdf.addImage(image.preview, "JPEG", 10, yPosition, imgWidth, imgHeight);
      }

      const fileName = `images_${new Date().getTime()}.pdf`;
      const pdfBlob = pdf.output("blob");

      // Detectar si es iOS
      if (isIOS()) {
        // En iOS, usar compartir nativo o abrir en nueva pestaña
        const url = URL.createObjectURL(pdfBlob);
        
        // Intentar usar Web Share API si está disponible
        if (navigator.share) {
          try {
            const file = new File([pdfBlob], fileName, { type: "application/pdf" });
            await navigator.share({
              files: [file],
              title: "Mi PDF",
              text: "PDF creado con FlowPDF",
            });
            toast.success("PDF compartido exitosamente");
          } catch (error) {
            // Si el usuario cancela share, abrir en nueva pestaña
            if ((error as Error).name !== "AbortError") {
              window.open(url, "_blank");
              toast.success("PDF abierto en nueva pestaña. Usa Compartir para guardarlo.");
            }
          }
        } else {
          // Fallback: abrir en nueva pestaña
          window.open(url, "_blank");
          toast.success("PDF abierto en nueva pestaña. Usa Compartir para guardarlo.");
        }

        setTimeout(() => URL.revokeObjectURL(url), 100);
      } else {
        // Desktop: descargar directamente
        const url = URL.createObjectURL(pdfBlob);
        const link = document.createElement("a");
        link.href = url;
        link.download = fileName;
        link.click();
        URL.revokeObjectURL(url);
        toast.success("PDF descargado exitosamente");
      }

      setImages([]);
    } catch (error) {
      console.error("Error converting images to PDF:", error);
      toast.error("Error al crear el PDF");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <UploadZone
        onFilesSelected={handleFilesSelected}
        acceptedFormats={[".jpg", ".jpeg", ".png", ".webp"]}
        multiple={true}
      />

      {images.length > 0 && (
        <div className="space-y-4">
          <h3 className="font-semibold text-gray-900">
            Imágenes seleccionadas ({images.length})
          </h3>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {images.map((image) => (
              <div
                key={image.id}
                className="relative group rounded-lg overflow-hidden border border-gray-200"
              >
                <img
                  src={image.preview}
                  alt={image.file.name}
                  className="w-full h-32 object-cover"
                />
                <button
                  onClick={() => removeImage(image.id)}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition"
                >
                  ✕
                </button>
                <p className="text-xs text-gray-600 p-2 truncate">
                  {image.file.name}
                </p>
              </div>
            ))}
          </div>

          <div className="space-y-2">
            <Button
              onClick={convertToPDF}
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Creando PDF...
                </>
              ) : (
                <>
                  <Download className="w-4 h-4 mr-2" />
                  {isIOS() ? "Crear y Compartir PDF" : "Descargar como PDF"}
                </>
              )}
            </Button>

            {isIOS() && (
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-900">
                  💡 <strong>En iPhone:</strong> Toca el botón para crear el PDF. Luego usa el botón Compartir para guardarlo en Archivos o enviarlo.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
