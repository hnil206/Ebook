'use client';
import FileUploadDropzone from '@/components/ui.custom/FileUploads';
import { useState } from 'react';

export default function ImagePage() {
  const [url, setUrl] = useState<string | null>(null);

  const handleUpload = (urls: string[] | string) => {
    if (Array.isArray(urls)) {
      setUrl(urls[0]);
    } else {
      setUrl(urls);
    }
  };
  return (
    <div>
      <FileUploadDropzone
        onFileUploads={handleUpload}
        maxFiles={4}
        // imageOptions={{ width: 300, height: 300 }}
      />
    </div>
  );
}
