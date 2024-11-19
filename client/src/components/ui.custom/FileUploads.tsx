import {
  FileInput,
  FileUploader,
  FileUploaderContent,
  FileUploaderItem,
} from '@/components/ui/file-upload';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import useFileUpload, { FileUploadOptions } from '@/hooks/useFileUpload';
import { motion } from 'framer-motion';
import { FileIcon } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { DropzoneOptions } from 'react-dropzone';
import { toast } from 'react-toastify';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
interface FileUploadDropzoneProps {
  onFileUploads: (urls: string[] | string) => void;
  onClear?: () => void;
  imageOptions?: FileUploadOptions;
  maxFiles?: number;
}
const FileUploadDropzone = ({
  onFileUploads,
  onClear,
  imageOptions,
  maxFiles = 1,
}: FileUploadDropzoneProps) => {
  const [files, setFiles] = useState<File[] | null>([]);
  const {
    uploadedFiles,
    filesToUpload,
    isUploading,
    addFilesToUpload,
    removeFileToUpload,
    onUploadFiles,
    clearUploadedFiles,
  } = useFileUpload(imageOptions);

  const dropzone = {
    accept: {
      'image/*': ['.jpg', '.jpeg', '.png'],
      'application/epub+zip': ['.epub'],
    },
    multiple: maxFiles > 1,
    maxFiles: maxFiles,
    maxSize: 5 * 1024 * 1024,
  } satisfies DropzoneOptions;

  const handleValueChange = (files: File[] | null) => {
    if (files) {
      const currentFileNames = new Set(
        filesToUpload.map((item) => item.file.name),
      );
      const newFiles = files.filter((file) => !currentFileNames.has(file.name));
      const removedFiles = filesToUpload.filter(
        (item) => !files.some((file) => file.name === item.file.name),
      );
      if (newFiles.length > 0) {
        addFilesToUpload(newFiles);
      }

      removedFiles.forEach((item) => removeFileToUpload(item.file));
    } else {
      clearUploadedFiles();
    }
  };

  const handleUpload = async () => {
    try {
      const uploadFiles = await onUploadFiles();
      if (uploadFiles && uploadFiles.length > 0) {
        const fileUrls = uploadFiles.map((item) => item.url);
        console.log('fileUrls', fileUrls);
        onFileUploads(fileUrls);
        toast.success('Upload files successfully!');
        return fileUrls;
      }
      return [];
    } catch (error) {
      toast.error('Upload files failed!');
      console.error('Upload files failed!', error);
      // throw error;
    }
  };

  useEffect(() => {
    return () => {
      clearUploadedFiles();
    };
  }, [clearUploadedFiles]);

  return (
    <>
      <FileUploader
        value={filesToUpload.map((item) => item.file)}
        onValueChange={handleValueChange}
        dropzoneOptions={dropzone}
      >
        <FileInput>
          <div className="flex items-center justify-center h-32 w-full border bg-background rounded-md">
            <p className="">Drag or click to select!</p>
          </div>
        </FileInput>
        <FileUploaderContent className="flex items-center flex-row gap-2">
          {filesToUpload.map((item, i) => (
            <>
              <FileUploaderItem
                key={i}
                index={i}
                className="size-20 p-0 rounded-md overflow-hidden"
                aria-roledescription={`file ${i + 1} containing ${
                  item.file.name
                }`}
              >
                <FilePreview file={item.file} />
              </FileUploaderItem>
            </>
          ))}
        </FileUploaderContent>
      </FileUploader>
      <Button
        className="w-full mt-4"
        onClick={handleUpload}
        disabled={isUploading || filesToUpload.length === 0}
      >
        {isUploading ? 'Uploading...' : 'Upload'}
      </Button>
    </>
  );
};
const FilePreview = ({ file }: any) => {
  const isImage = file.type.startsWith('image/');

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.2 }}
    >
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <Card className="w-20 h-20 overflow-hidden">
              <CardContent className="p-0 flex items-center justify-center h-full">
                {isImage ? (
                  <Image
                    src={URL.createObjectURL(file)}
                    alt={file.name}
                    width={80}
                    height={80}
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center w-full h-full bg-gray-100 text-gray-500">
                    <FileIcon className="w-8 h-8 mb-1" />
                    <span className="text-xs text-center px-1 truncate w-full">
                      {file.name.split('.').pop()}
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>
          </TooltipTrigger>
          <TooltipContent>
            <p>{file.name}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </motion.div>
  );
};

export default FileUploadDropzone;
