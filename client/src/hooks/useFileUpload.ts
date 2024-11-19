import axios from '@/lib/axios';
import { useCallback, useState } from 'react';
import useAuth from './useAuth';

interface UploadFile {
  id: number;
  fileUrl: string;
  publicId: string;
}
interface FileUploadsProgess {
  file: File;
  progress: number;
}

export interface FileUploadOptions {
  type?: any;
  relatedId?: string;
  onModel?: string;
}

function useFileUpload(options: FileUploadOptions = {}) {
  const [uploadedFiles, setUploadedFiles] = useState<UploadFile[]>([]);
  const [filesToUpload, setFilesToUpload] = useState<FileUploadsProgess[]>([]);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const { user } = useAuth();

  const addFilesToUpload = useCallback((files: File[]) => {
    setFilesToUpload((prev) => {
      const newFiles = files
        .filter(
          (file) =>
            !prev.some(
              (item) =>
                item.file.name === file.name && item.file.size === file.size,
            ),
        )
        .map((file) => ({ file, progress: 0 }));
      return [...prev, ...newFiles];
    });
  }, []);

  const removeFileToUpload = useCallback((file: File) => {
    setFilesToUpload((prev) => prev.filter((item) => item.file !== file));
  }, []);

  const onUploadFiles = useCallback(async () => {
    setIsUploading(true);
    try {
      const uploadPromises = filesToUpload.map(async ({ file }) => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('type', options.type);
        options.relatedId && formData.append('relatedId', options.relatedId);
        options.onModel && formData.append('onModel', options.onModel);

        //TODO : add user.accessToken
        // const res = await axiosWithAuth(user.acesstoken).post('/upload', formData, {
        const res = await axios.post('/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          onUploadProgress: (progressEvent) => {
            const progress = Math.round(
              (progressEvent.loaded * 100) / (progressEvent.total || 1),
            );
            setFilesToUpload((prev) =>
              prev.map((item) =>
                item.file === file ? { ...item, progress } : item,
              ),
            );
          },
        });
        return res.data;
      });

      const results = await Promise.all(uploadPromises);
      console.log('upload results', results);
      setUploadedFiles((prev) => [...prev, ...results]);
      return results;
    } catch (error) {
      console.log('error', error);
    } finally {
      setIsUploading(false);
    }
  }, [
    filesToUpload,
    options.onModel,
    options.relatedId,
    options.type,
    // user.accessToken,
  ]);

  const clearUploadedFiles = useCallback(() => {
    setUploadedFiles([]);
    setFilesToUpload([]);
  }, []);

  return {
    uploadedFiles,
    filesToUpload,
    isUploading,
    addFilesToUpload,
    removeFileToUpload,
    onUploadFiles,
    clearUploadedFiles,
  };
}

export default useFileUpload;
