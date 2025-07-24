// frontend/src/app/upload/page.tsx
'use client';
import React, { useState, useCallback, useRef } from 'react';
// import { useTranslation } from 'react-i18next';
import Navbar from '@/components/Navbar'; // 假设Navbar存在

// --- 临时的 Navbar 组件 ---
const Navbar = () => (
  <header className="bg-background-primary/80 backdrop-blur-sm sticky top-0 z-50 border-b border-border-color">
    <nav className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
      <a href="/" className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-purple-blue">BeatMM Pro</a>
      <div className="flex items-center gap-4">
        <a href="/profile" className="btn-secondary">My Profile</a>
      </div>
    </nav>
  </header>
);
// --- 临时组件结束 ---

const UploadPage = () => {
  // const { t } = useTranslation();
  const t = (key: string) => ({...})[key] || key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

  // --- 核心逻辑状态 ---
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isFree, setIsFree] = useState(true);
  const [price, setPrice] = useState('');
  
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // 用于触发文件输入的引用
  const audioInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);

  // --- 文件处理逻辑 ---
  const handleAudioDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setAudioFile(e.dataTransfer.files[0]);
    }
  }, []);

  const handleAudioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setAudioFile(e.target.files[0]);
    }
  };

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setCoverImage(file);
      // 创建预览 URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // --- 表单提交逻辑 ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!audioFile || !coverImage || !title) {
      setError('Please fill all required fields: Audio, Cover, and Title.');
      return;
    }
    setError('');
    setSuccess('');
    setIsUploading(true);

    const formData = new FormData();
    formData.append('audio', audioFile);
    formData.append('cover', coverImage);
    formData.append('title', title);
    formData.append('description', description);
    formData.append('price', isFree ? '0' : price);

    try {
      // 这里的 API 端点需要后端支持
      const response = await fetch('/api/music/upload', {
        method: 'POST',
        // 'Content-Type' is not needed, browser sets it for FormData
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess('Track uploaded successfully!');
        // 清空表单
        setAudioFile(null);
        setCoverImage(null);
        setCoverPreview(null);
        setTitle('');
        setDescription('');
        setIsFree(true);
        setPrice('');
      } else {
        setError(data.error || 'Upload failed. Please try again.');
      }
    } catch (err) {
      setError('An network error occurred.');
      console.error(err);
    } finally {
      setIsUploading(false);
    }
  };
  
  const inputClass = "input-field focus:ring-2 focus:ring-accent-color-1 focus:border-transparent transition-all duration-300";

  return (
    <div className="min-h-screen bg-background-primary">
      <Navbar />
      <main className="container mx-auto py-10 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-extrabold text-white mb-2">Upload Your Track</h1>
          <p className="text-text-secondary mb-8">Share your music with the world.</p>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              
              {/* 左侧：封面上传 */}
              <div className="md:col-span-1">
                <h2 className="text-xl font-semibold mb-2">Cover Art</h2>
                <input type="file" ref={coverInputRef} onChange={handleCoverChange} accept="image/*" className="hidden" />
                <div 
                  onClick={() => coverInputRef.current?.click()}
                  className="aspect-square bg-background-secondary rounded-lg border-2 border-dashed border-border-color flex items-center justify-center text-center text-text-secondary cursor-pointer hover:border-accent-color-1 transition-colors"
                >
                  {coverPreview ? (
                    <img src={coverPreview} alt="Cover preview" className="w-full h-full object-cover rounded-lg" />
                  ) : (
                    <p>Click or Drag<br/>to Upload Cover</p>
                  )}
                </div>
              </div>

              {/* 右侧：信息填写 */}
              <div className="md:col-span-2 space-y-6">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-text-secondary mb-1">Track Title *</label>
                  <input type="text" id="title" value={title} onChange={e => setTitle(e.target.value)} className={inputClass} required />
                </div>
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-text-secondary mb-1">Description</label>
                  <textarea id="description" value={description} onChange={e => setDescription(e.target.value)} rows={4} className={`${inputClass} resize-none`}></textarea>
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-1">Pricing</label>
                  <div className="flex bg-background-secondary p-1 rounded-lg">
                    <button type="button" onClick={() => setIsFree(true)} className={`w-1/2 py-2 rounded-md text-sm font-semibold transition-colors ${isFree ? 'bg-accent-color-1 text-white' : 'text-text-secondary hover:bg-white/10'}`}>Free</button>
                    <button type="button" onClick={() => setIsFree(false)} className={`w-1/2 py-2 rounded-md text-sm font-semibold transition-colors ${!isFree ? 'bg-accent-color-1 text-white' : 'text-text-secondary hover:bg-white/10'}`}>Priced</button>
                  </div>
                  {!isFree && (
                    <div className="mt-2">
                      <input type="number" placeholder="Price in MMK" value={price} onChange={e => setPrice(e.target.value)} className={inputClass} />
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* 底部：音频上传和提交 */}
            <div>
              <h2 className="text-xl font-semibold mb-2">Audio File *</h2>
              <input type="file" ref={audioInputRef} onChange={handleAudioChange} accept="audio/*" className="hidden" />
              <div
                onDrop={handleAudioDrop}
                onDragOver={e => e.preventDefault()}
                onClick={() => audioInputRef.current?.click()}
                className="w-full p-6 bg-background-secondary rounded-lg border-2 border-dashed border-border-color text-center cursor-pointer hover:border-accent-color-1 transition-colors"
              >
                {audioFile ? (
                  <p className="text-green-400">File selected: <span className="font-semibold">{audioFile.name}</span></p>
                ) : (
                  <p className="text-text-secondary">Click or Drag & Drop your audio file here (MP3, WAV, FLAC)</p>
                )}
              </div>
            </div>

            <div className="text-right">
              {error && <p className="text-red-400 text-sm mb-4 text-center">{error}</p>}
              {success && <p className="text-green-400 text-sm mb-4 text-center">{success}</p>}
              <button type="submit" className="btn-primary !py-3 !px-8" disabled={isUploading}>
                {isUploading ? 'Uploading...' : 'Publish Track'}
              </button>
            </div>

          </form>
        </div>
      </main>
    </div>
  );
};

export default UploadPage;
