'use client'

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileText, AlertCircle, CheckCircle, Loader } from 'lucide-react';

interface FileUploadProps {
  onImportComplete: () => void;
}

interface ImportResult {
  success: boolean;
  importedCount: number;
  errorCount: number;
  errors?: string[];
}

export function FileUpload({ onImportComplete }: FileUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState<ImportResult | null>(null);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    setUploading(true);
    setResult(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/import', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();
      
      if (response.ok) {
        setResult(result);
        onImportComplete();
      } else {
        setResult({
          success: false,
          importedCount: 0,
          errorCount: 1,
          errors: [result.error || 'Import failed']
        });
      }
    } catch {
      setResult({
        success: false,
        importedCount: 0,
        errorCount: 1,
        errors: ['Failed to upload file']
      });
    } finally {
      setUploading(false);
    }
  }, [onImportComplete]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/rtf': ['.rtf'],
      'text/plain': ['.txt'],
    },
    maxFiles: 1,
    disabled: uploading,
  });

  return (
    <div className="w-full">
      <div
        {...getRootProps()}
        className={`relative border-2 border-dashed rounded-lg p-6 transition-colors ${
          isDragActive
            ? 'border-blue-400 bg-blue-50'
            : uploading
            ? 'border-gray-300 bg-gray-50'
            : 'border-gray-300 hover:border-gray-400'
        } ${uploading ? 'cursor-not-allowed' : 'cursor-pointer'}`}
      >
        <input {...getInputProps()} />
        
        <div className="text-center">
          <div className="mx-auto flex justify-center">
            {uploading ? (
              <Loader className="h-12 w-12 text-blue-500 animate-spin" />
            ) : (
              <Upload className="h-12 w-12 text-gray-400" />
            )}
          </div>
          
          <div className="mt-4">
            <p className="text-lg font-medium text-gray-900">
              {uploading ? 'Processing your vinyl list...' : 'Upload your vinyl want list'}
            </p>
            <p className="mt-2 text-sm text-gray-600">
              {isDragActive
                ? 'Drop your file here'
                : 'Drag and drop your RTF or TXT file here, or click to browse'}
            </p>
            <p className="mt-1 text-xs text-gray-500">
              Supports RTF and TXT files with checkbox format
            </p>
          </div>
        </div>
      </div>

      {/* Upload Result */}
      {result && (
        <div className={`mt-4 p-4 rounded-lg ${
          result.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
        }`}>
          <div className="flex items-start">
            <div className="flex-shrink-0">
              {result.success ? (
                <CheckCircle className="h-5 w-5 text-green-400" />
              ) : (
                <AlertCircle className="h-5 w-5 text-red-400" />
              )}
            </div>
            <div className="ml-3">
              <h3 className={`text-sm font-medium ${
                result.success ? 'text-green-800' : 'text-red-800'
              }`}>
                {result.success ? 'Import Successful!' : 'Import Failed'}
              </h3>
              <div className={`mt-1 text-sm ${
                result.success ? 'text-green-700' : 'text-red-700'
              }`}>
                {result.success ? (
                  <p>
                    Successfully imported {result.importedCount} albums.
                    {result.errorCount > 0 && ` ${result.errorCount} albums could not be processed.`}
                  </p>
                ) : (
                  <div>
                    <p>Failed to import albums.</p>
                    {result.errors && result.errors.length > 0 && (
                      <ul className="mt-1 list-disc list-inside">
                        {result.errors.slice(0, 3).map((error, index) => (
                          <li key={index}>{error}</li>
                        ))}
                        {result.errors.length > 3 && (
                          <li>...and {result.errors.length - 3} more errors</li>
                        )}
                      </ul>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* File Format Help */}
      <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex">
          <FileText className="h-5 w-5 text-blue-400 flex-shrink-0" />
          <div className="ml-3">
            <h4 className="text-sm font-medium text-blue-800">Supported file format:</h4>
            <p className="mt-1 text-sm text-blue-700">
              Your file should contain lines like:
            </p>
            <code className="mt-1 block text-xs text-blue-600 bg-blue-100 p-2 rounded">
              - [ ] Artist Name - Album Title<br />
              - [x] Another Artist - Another Album
            </code>
            <p className="mt-1 text-xs text-blue-600">
              ✓ = albums you have, ☐ = albums you want
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}