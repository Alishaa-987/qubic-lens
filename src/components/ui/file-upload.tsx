"use client"

import { useCallback, useState } from "react"
import { useDropzone } from "react-dropzone"
import { Upload, X, FileText } from "lucide-react"
import { cn } from "@/lib/utils"

interface FileUploadProps {
  onFileSelect: (file: File) => void
  accept?: Record<string, string[]>
  placeholder?: string
  className?: string
}

export function FileUpload({
  onFileSelect,
  accept = { "application/json": [".json"] },
  placeholder = "Drop your file here or click to browse",
  className
}: FileUploadProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    if (file) {
      setSelectedFile(file)
      onFileSelect(file)
    }
  }, [onFileSelect])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    multiple: false
  })

  const removeFile = () => {
    setSelectedFile(null)
  }

  return (
    <div className={cn("w-full", className)}>
      {!selectedFile ? (
        <div
          {...getRootProps()}
          className={cn(
            "group relative h-32 w-full cursor-pointer overflow-hidden rounded-xl border-2 border-dashed border-slate-300 bg-gradient-to-br from-slate-50 to-slate-100 transition-all duration-300 ease-in-out hover:border-blue-400 hover:from-blue-50 hover:to-blue-100 dark:border-slate-600 dark:from-slate-800 dark:to-slate-900 dark:hover:border-blue-500 dark:hover:from-blue-900/20 dark:hover:to-blue-800/20",
            isDragActive && "border-blue-500 bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/30 dark:to-blue-800/30"
          )}
        >
          <input {...getInputProps()} />
          <div className="flex h-full w-full flex-col items-center justify-center p-4">
            <div className="mb-3 rounded-full bg-blue-100 p-3 transition-colors group-hover:bg-blue-200 dark:bg-blue-900/50 dark:group-hover:bg-blue-800/50">
              <Upload className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <p className="text-sm font-medium text-slate-600 transition-colors group-hover:text-blue-700 dark:text-slate-400 dark:group-hover:text-blue-300">
              {isDragActive ? "Drop the file here" : placeholder}
            </p>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-500">
              Supports {Object.values(accept).flat().join(", ")}
            </p>
          </div>
        </div>
      ) : (
        <div className="relative rounded-xl border border-slate-200 bg-gradient-to-r from-green-50 to-emerald-50 p-4 shadow-sm dark:border-slate-700 dark:from-green-900/10 dark:to-emerald-900/10">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-green-100 p-2 dark:bg-green-900/30">
              <FileText className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-900 truncate dark:text-slate-100">
                {selectedFile.name}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {(selectedFile.size / 1024).toFixed(1)} KB
              </p>
            </div>
            <button
              onClick={removeFile}
              className="rounded-full p-1 text-slate-400 transition-colors hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-900/30 dark:hover:text-red-400"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
