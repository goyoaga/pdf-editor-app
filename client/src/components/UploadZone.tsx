import { useState, useRef } from "react";
import { Upload, X, Plus, FileUp } from "lucide-react";
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
    <div className="space-y-8">
      {/* Drop Zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`group relative border-2 border-dashed rounded-2xl p-12 md:p-16 text-center transition-all cursor-pointer ${
          isDragging
            ? "border-primary bg-primary-container/10 ring-4 ring-primary/5"
            : "border-outline-variant bg-surface-container-low/30 hover:border-primary hover:bg-primary-container/5"
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple={multiple}
          accept={acceptedFormats.join(",")}
          onChange={handleFileInput}
          className="hidden"
        />
        
        <div className="flex flex-col items-center gap-6">
          <div className={`w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 ${
            isDragging ? "bg-primary text-white scale-110" : "bg-surface-container-high text-primary group-hover:scale-110"
          }`}>
            <FileUp className="w-8 h-8" />
          </div>
          
          <div className="space-y-2">
            <h3 className="text-xl font-black text-gray-900 leading-none">
              Arrastra tus archivos aquí
            </h3>
            <p className="text-sm font-medium text-muted-foreground">
              o haz clic para seleccionar archivos de tu equipo
            </p>
          </div>

          <button
            className="bg-primary text-white px-10 py-3.5 rounded-xl font-black shadow-lg shadow-primary/20 hover:opacity-90 transition-all active:scale-95 flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Seleccionar archivos
          </button>
        </div>
      </div>

      {/* Selected Files List */}
      {selectedFiles.length > 0 && (
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex items-center justify-between px-2">
            <h4 className="text-sm font-black uppercase tracking-widest text-muted-foreground">
              Archivos seleccionados ({selectedFiles.length})
            </h4>
            <button 
              onClick={() => { setSelectedFiles([]); onFilesSelected([]); }}
              className="text-xs font-bold text-destructive hover:underline"
            >
              Limpiar todo
            </button>
          </div>
          
          <div className="grid grid-cols-1 gap-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
            {selectedFiles.map((file, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 bg-surface-container-lowest border border-outline-variant rounded-xl shadow-sm hover:border-primary/50 transition-all group"
              >
                <div className="flex items-center gap-4 min-w-0">
                  <div className="w-10 h-10 rounded-lg bg-surface-container-low flex items-center justify-center flex-shrink-0">
                    <Upload className="w-5 h-5 text-primary" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold text-gray-900 truncate pr-4">
                      {file.name}
                    </p>
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-tight">
                      {(file.size / (1024 * 1024)).toFixed(2)} MB
                    </p>
                  </div>
                </div>
                <button
                  onClick={(e) => { e.stopPropagation(); removeFile(index); }}
                  className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/5 rounded-lg transition-all"
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
