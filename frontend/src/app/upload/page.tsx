// src/app/upload/page.tsx
'use client';

import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { UploadCloud, Music, Image as ImageIcon, X, Loader2, CheckCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
// 注意：确保你的项目中已经有了Supabase的Provider设置，以便这里能获取到client
import { useSupabaseClient } from '@supabase/auth-helpers-react'; 

// --- 主页面组件 ---

const UploadPage = () => {
  // 修复了语法错误，并为未来的多语言功能提供一个安全的占位符
  const t = (key: string) => key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

  // --- 状态管理 ---
  const [title, setTitle] = useState('');
  const [artist, setArtist] = useState('');
  const [genre, setGenre] = useState(''); // 根据我们的后端，需要 genre 字段
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const router = useRouter();
  const supabase = useSupabaseClient();

  // --- 文件拖放区域逻辑 (使用 react-dropzone 库，更专业) ---
  const onDrop = useCallback((acceptedFiles: File[], fileRejections: any[], type: 'audio' | 'cover') => {
    if (fileRejections.length > 0) {
      setError(`Invalid file. Please check file type and size.`);
      return;
    }
    const file = acceptedFiles[0];
    if (type === 'audio') {
      setAudioFile(file);
    } else {
      setCoverFile(file);
      // 清理上一个预览图的内存，防止内存泄漏
      if (coverPreview) {
        URL.revokeObjectURL(coverPreview);
      }
      setCoverPreview(URL.createObjectURL(file));
    }
    setError(null);
  }, [coverPreview]);

  const { getRootProps: getAudioRootProps, getInputProps: getAudioInputProps, isDragActive: isAudioDragActive } = useDropzone({
    onDrop: (accepted, rejected) => onDrop(accepted, rejected, 'audio'),
    accept: { 'audio/*': ['.mp3', '.wav', '.flac', '.m4a'] },
    maxFiles: 1,
  });

  const { getRootProps: getCoverRootProps, getInputProps: getCoverInputProps, isDragActive: isCoverDragActive } = useDropzone({
    onDrop: (accepted, rejected) => onDrop(accepted, rejected, 'cover'),
    accept: { 'image/*': ['.jpeg', 'image/png', '.jpg', '.webp'] },
    maxFiles: 1,
  });
  
  // --- 表单提交逻辑 ---
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!title || !artist || !genre || !audioFile || !coverFile) {
      setError('Please fill all fields and upload both files.');
      return;
    }
    
    setIsUploading(true);
    setError(null);
    setSuccessMessage(null);

    // 未来，我们会将这里替换为调用真实后端API的代码
    // 现在，我们先用一个模拟上传来展示流程
    try {
      console.log("Simulating upload with data:", { title, artist, genre, audioFile, coverFile });
      
      // 模拟网络延迟
      await new Promise(resolve => setTimeout(resolve, 2000));

      setSuccessMessage('Track has been successfully uploaded!');

      // 上传成功后，2秒后跳转到首页
      setTimeout(() => {
        router.push('/');
      }, 2000);

    } catch (e: any) {
      setError(e.message || "An unknown error occurred during upload.");
    } finally {
      setIsUploading(false);
    }
  };

  const dropzoneBaseClasses = 'border-2 border-dashed rounded-xl flex flex-col items-center justify-center p-8 text-center cursor-pointer transition-colors duration-300 h-48';
  const dropzoneActiveClasses = 'border-accent-color-1 bg-accent-color-1/10';
  const dropzoneInactiveClasses = 'border-border-color hover:border-accent-color-2';

  return (
    <main className="flex-grow py-10 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto max-w-4xl">
        <div className="bg-background-secondary p-8 rounded-2xl shadow-2xl animate-fade-in">
          <h1 className="text-3xl font-bold text-white mb-2">{t('upload_your_track')}</h1>
          <p className="text-text-secondary mb-8">{t('share_your_music_with_the_world')}</p>

          <form onSubmit={handleSubmit} className="space-y-6">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* 音频上传 */}
              <div {...getAudioRootProps()} className={`${dropzoneBaseClasses} ${isAudioDragActive ? dropzoneActiveClasses : dropzoneInactiveClasses}`}>
                <input {...getAudioInputProps()} />
                <UploadCloud className="w-12 h-12 text-accent-color-1 mb-4" />
                <p className="text-text-primary font-semibold">{t('drag_n_drop_audio')}</p>
                <p className="text-sm text-text-secondary">{t('MP3, WAV, FLAC')}</p>
                {audioFile && <div className="mt-4 flex items-center gap-2 text-sm bg-background-primary px-3 py-2 rounded-md"><Music size={16} className="text-accent-color-1"/> {audioFile.name}</div>}
              </div>
              {/* 封面上传 */}
              <div {...getCoverRootProps()} className={`${dropzoneBaseClasses} ${isCoverDragActive ? dropzoneActiveClasses : dropzoneInactiveClasses} relative overflow-hidden`}>
                <input {...getCoverInputProps()} />
                {coverPreview ? (
                  <>
                    <Image src={coverPreview} alt="Cover preview" layout="fill" className="object-cover" />
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                      <p className="text-white font-bold">{t('change_cover')}</p>
                    </div>
                  </>
                ) : (
                  <>
                    <ImageIcon className="w-12 h-12 text-accent-color-2 mb-4" />
                    <p className="text-text-primary font-semibold">{t('drag_n_drop_cover')}</p>
                    <p className="text-sm text-text-secondary">{t('JPG, PNG, WEBP')}</p>
                  </>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-text-secondary mb-2">{t('title')} *</label>
                <input type="text" id="title" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full bg-background-primary border border-border-color rounded-md px-4 py-2 text-white focus:ring-2 focus:ring-accent-color-1 focus:border-accent-color-1 outline-none transition" required />
              </div>
              <div>
                <label htmlFor="artist" className="block text-sm font-medium text-text-secondary mb-2">{t('artist')} *</label>
                <input type="text" id="artist" value={artist} onChange={(e) => setArtist(e.target.value)} className="w-full bg-background-primary border border-border-color rounded-md px-4 py-2 text-white focus:ring-2 focus:ring-accent-color-1 focus:border-accent-color-1 outline-none transition" required />
              </div>
              <div>
                <label htmlFor="genre" className="block text-sm font-medium text-text-secondary mb-2">{t('genre')} *</label>
                <input type="text" id="genre" placeholder="e.g. Techno, House, EDM" value={genre} onChange={(e) => setGenre(e.target.value)} className="w-full bg-background-primary border border-border-color rounded-md px-4 py-2 text-white focus:ring-2 focus:ring-accent-color-1 focus:border-accent-color-1 outline-none transition" required />
              </div>
            </div>
            
            {error && <div className="text-red-400 bg-red-500/10 p-3 rounded-md text-sm flex items-center gap-2 animate-fade-in"><X size={16} /> {error}</div>}
            {successMessage && <div className="text-green-400 bg-green-500/10 p-3 rounded-md text-sm flex items-center gap-2 animate-fade-in"><CheckCircle size={16} /> {successMessage}</div>}

            <div className="flex justify-end pt-4">
              <button type="submit" disabled={isUploading || !!successMessage} className="bg-gradient-to-r from-accent-color-1 to-accent-color-2 text-white font-bold py-3 px-8 rounded-full hover:opacity-90 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 min-w-[150px]">
                {isUploading ? (
                  <>
                    <Loader2 className="animate-spin" />
                    <span>{t('uploading...')}</span>
                  </>
                ) : (
                  t('submit_track')
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
};

export default UploadPage;
