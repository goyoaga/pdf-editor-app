import { useState, useRef } from "react";
import { Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface UploadZoneProps {
  onFilesSelected: (files: File[]) => void;
  acceptedFormats?: string[];
  multiple?: boolean;
  maxSize?: number; // in MB
}

export default function UploadZone({
  onFilesSelected,
  acceptedFormats = [".pdf", ".doc", ".docx", ".jpg", ".jpeg", ".png"],
  multiple = true,
  maxSize = 100,
}: UploadZoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    processFiles(files);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      processFiles(files);
    }
  };

  const processFiles = (files: File[]) => {
    const validFiles = files.filter((file) => {
      const ext = "." + file.name.split(".").pop()?.toLowerCase();
      const isValidFormat = acceptedFormats.includes(ext);
      const isValidSize = file.size / (1024 * 1024) <= maxSize;

      if (!isValidFormat) {
        alert(`Formato no soportado: ${file.name}`);
        return false;
      }
      if (!isValidSize) {
        alert(`Archivo demasiado grande: ${file.name} (máx ${maxSize}MB)`);
        return false;
      }
      return true;
    });

    if (validFiles.length > 0) {
      const newFiles = multiple ? [...selectedFiles, ...validFiles] : validFiles;
      setSelectedFiles(newFiles);
      onFilesSelected(newFiles);
    }
  };

  const removeFile = (index: number) => {
    const newFiles = selectedFiles.filter((_, i) => i !== index);
    setSelectedFiles(newFiles);
    onFilesSelected(newFiles);
  };

  return (
    <div className="space-y-4">
      {/* Drop Zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-all ${
          isDragging
            ? "border-blue-600 bg-blue-50"
            : "border-gray-300 bg-gray-50 hover:border-blue-400"
        }`}
      >
        <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="font-semibold text-gray-900 mb-2">
          Arrastra tus archivos aquí
        </h3>
        <p className="text-sm text-gray-600 mb-4">
          o haz clic para seleccionar
        </p>
        <Button
          onClick={() => fileInputRef.current?.click()}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          Seleccionar Archivos
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          multiple={multiple}
          accept={acceptedFormats.join(",")}
          onChange={handleFileInput}
          className="hidden"
        />
      </div>

      {/* Selected Files */}
      {selectedFiles.length > 0 && (
        <div className="space-y-2">
          <h4 className="font-semibold text-gray-900">
            Archivos seleccionados ({selectedFiles.length})
          </h4>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {selectedFiles.map((file, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-gray-50 border border-gray-200 rounded-lg"
              >
                <div className="flex-1">
                  <p className="font-medium text-gray-900 truncate">
                    {file.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {(file.size / (1024 * 1024)).toFixed(2)} MB
                  </p>
                </div>
                <button
                  onClick={() => removeFile(index)}
                  className="text-gray-400 hover:text-red-600 transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
