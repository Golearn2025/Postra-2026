'use client'

import { useState, useRef } from 'react'
import { Upload, File, X, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { validateFileType } from '../utils/file-parsers'

interface FileUploadProps {
  onFileSelect: (file: File) => void
  onFileRemove: () => void
  selectedFile: File | null
  isProcessing?: boolean
  error?: string | null
}

export function FileUpload({ 
  onFileSelect, 
  onFileRemove, 
  selectedFile, 
  isProcessing = false,
  error 
}: FileUploadProps) {
  const [isDragOver, setIsDragOver] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (file: File) => {
    const fileType = validateFileType(file)
    if (!fileType) {
      return
    }
    onFileSelect(file)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    
    const files = Array.from(e.dataTransfer.files)
    const validFile = files.find(file => validateFileType(file))
    
    if (validFile) {
      handleFileSelect(validFile)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }

  const handleDragLeave = () => {
    setIsDragOver(false)
  }

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleFileSelect(file)
    }
  }

  const handleClick = () => {
    if (!isProcessing) {
      fileInputRef.current?.click()
    }
  }

  if (selectedFile) {
    return (
      <Card className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <File className="h-8 w-8 text-blue-500" />
            <div>
              <p className="font-medium">{selectedFile.name}</p>
              <p className="text-sm text-muted-foreground">
                {(selectedFile.size / 1024).toFixed(1)} KB
              </p>
            </div>
          </div>
          {!isProcessing && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onFileRemove}
              className="text-muted-foreground hover:text-destructive"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
        {error && (
          <div className="mt-3 flex items-center gap-2 text-sm text-destructive">
            <AlertCircle className="h-4 w-4" />
            {error}
          </div>
        )}
      </Card>
    )
  }

  return (
    <Card 
      className={`p-8 border-2 border-dashed transition-colors cursor-pointer ${
        isDragOver 
          ? 'border-primary bg-primary/5' 
          : 'border-muted-foreground/25 hover:border-muted-foreground/50'
      } ${isProcessing ? 'cursor-not-allowed opacity-50' : ''}`}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onClick={handleClick}
    >
      <div className="flex flex-col items-center justify-center gap-4 text-center">
        <Upload className="h-12 w-12 text-muted-foreground" />
        <div>
          <p className="font-medium">Drop your file here or click to browse</p>
          <p className="text-sm text-muted-foreground mt-1">
            Supports JSON and CSV files up to 10MB
          </p>
        </div>
        <Button variant="outline" disabled={isProcessing}>
          Choose File
        </Button>
      </div>
      
      <input
        ref={fileInputRef}
        type="file"
        accept=".json,.csv"
        onChange={handleFileInputChange}
        className="hidden"
        disabled={isProcessing}
      />
      
      {error && (
        <div className="mt-4 flex items-center gap-2 text-sm text-destructive">
          <AlertCircle className="h-4 w-4" />
          {error}
        </div>
      )}
    </Card>
  )
}
