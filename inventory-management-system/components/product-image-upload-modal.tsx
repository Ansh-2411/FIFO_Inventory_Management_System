"use client"

import type React from "react"
import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Upload, X, Loader2 } from "lucide-react"
import { toast } from "@/hooks/use-toast"

interface ProductImageUploadModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  productId: string
  onImageUploaded: () => void
}

export function ProductImageUploadModal({ 
  open, 
  onOpenChange, 
  productId, 
  onImageUploaded 
}: ProductImageUploadModalProps) {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files)
      setSelectedFiles((prev) => [...prev, ...files])
    }
  }

  const removeFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (selectedFiles.length === 0) return

    setUploading(true)
    let successCount = 0
    let errorCount = 0

    try {
      for (const file of selectedFiles) {
        const formData = new FormData()
        formData.append('image', file)
        formData.append('product_id', productId)

        const response = await fetch('http://localhost:3005/api/images/upload', {
          method: 'POST',
          body: formData,
        })

        if (response.ok) {
          const result = await response.json()
          if (result.success) {
            successCount++
          } else {
            errorCount++
            console.error(`Failed to upload ${file.name}:`, result.message)
          }
        } else {
          errorCount++
          const errorData = await response.json().catch(() => ({ message: 'Upload failed' }))
          console.error(`Failed to upload ${file.name}:`, errorData.message)
        }
      }

      if (successCount > 0) {
        toast({
          title: "Upload Complete",
          description: `Successfully uploaded ${successCount} image(s)${errorCount > 0 ? `, ${errorCount} failed` : ''}`,
        })
        onImageUploaded()
        onOpenChange(false)
        setSelectedFiles([])
      } else {
        toast({
          title: "Upload Failed",
          description: "Failed to upload any images. Please try again.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error('Upload error:', error)
      toast({
        title: "Upload Error",
        description: "An error occurred during upload. Please try again.",
        variant: "destructive",
      })
    } finally {
      setUploading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Upload Product Images</DialogTitle>
          <DialogDescription>Upload images for this product.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label>Images</Label>
              <div
                className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center cursor-pointer hover:border-teal-500 transition-colors"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                <p className="text-sm text-gray-600 dark:text-gray-400">Click to upload images or drag and drop</p>
                <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">PNG, JPG, GIF up to 10MB each</p>
              </div>
              <Input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
              />
            </div>

            {selectedFiles.length > 0 && (
              <div className="grid gap-2">
                <Label>Selected Files ({selectedFiles.length})</Label>
                <div className="max-h-32 overflow-y-auto space-y-2">
                  {selectedFiles.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{file.name}</p>
                        <p className="text-xs text-gray-500">{(file.size / (1024 * 1024)).toFixed(1)} MB</p>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFile(index)}
                        className="text-red-600 hover:text-red-700"
                        disabled={uploading}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              disabled={uploading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-teal-600 hover:bg-teal-700"
              disabled={selectedFiles.length === 0 || uploading}
            >
              {uploading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Uploading...
                </>
              ) : (
                `Upload ${selectedFiles.length} Image${selectedFiles.length !== 1 ? 's' : ''}`
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
