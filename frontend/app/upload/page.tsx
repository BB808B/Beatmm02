'use client'

import { useState, useEffect } from 'react'
import Layout from '../../components/Layout'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function Upload() {
  const [title, setTitle] = useState('')
  const [artist, setArtist] = useState('')
  const [genre, setGenre] = useState('')
  const [tags, setTags] = useState('')
  const [description, setDescription] = useState('')
  const [audioFile, setAudioFile] = useState<File | null>(null)
  const [coverFile, setCoverFile] = useState<File | null>(null)
  const [isVipOnly, setIsVipOnly] = useState(false)
  const [allowDownload, setAllowDownload] = useState(true)
  const [allowComments, setAllowComments] = useState(true)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [user, setUser] = useState<any>(null)
  const router = useRouter()

  const genres = [
    '流行音乐', '电子音乐', '摇滚音乐', '爵士音乐', '古典音乐', 
    '民谣音乐', '说唱音乐', '乡村音乐', '蓝调音乐', '雷鬼音乐',
    '缅甸传统', 'DJ混音', '其他'
  ]

  useEffect(() => {
    checkUser()
  }, [])

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      router.push('/auth/login')
      return
    }
    setUser(user)
    
    // 获取用户信息设置默认艺术家名
    const { data: userProfile } = await supabase
      .from('users')
      .select('username')
      .eq('id', user.id)
      .single()
    
    if (userProfile) {
      setArtist(userProfile.username)
    }
  }

  const uploadFile = async (file: File, bucket: string, path: string) => {
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(path, file, {
        cacheControl: '3600',
        upsert: false
      })

    if (error) throw error
    
    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(path)

    return publicUrl
  }

  const getAudioDuration = (file: File): Promise<number> => {
    return new Promise((resolve) => {
      const audio = new Audio()
      audio.onloadedmetadata = () => {
        resolve(Math.floor(audio.duration))
      }
      audio.src = URL.createObjectURL(file)
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!audioFile || !title || !artist || !genre) {
      alert('请填写必填信息并选择音频文件')
      return
    }

    setIsUploading(true)
    setUploadProgress(0)

    try {
      // 上传音频文件
      setUploadProgress(20)
      const audioPath = `audio/${user.id}/${Date.now()}_${audioFile.name}`
      const audioUrl = await uploadFile(audioFile, 'tracks', audioPath)

      // 上传封面文件（如果有）
      let coverUrl = null
      if (coverFile) {
        setUploadProgress(40)
        const coverPath = `covers/${user.id}/${Date.now()}_${coverFile.name}`
        coverUrl = await uploadFile(coverFile, 'tracks', coverPath)
      }

      // 获取音频时长
      setUploadProgress(60)
      const duration = await getAudioDuration(audioFile)

      // 保存到数据库
      setUploadProgress(80)
      const { error } = await supabase
        .from('tracks')
        .insert({
          title: title.trim(),
          artist: artist.trim(),
          description: description.trim() || null,
          audio_url: audioUrl,
          cover_url: coverUrl,
          duration: duration,
          genre: genre,
          tags: tags.split(',').map(tag => tag.trim()).filter(tag => tag),
          is_vip_only: isVipOnly,
          user_id: user.id,
          plays_count: 0,
          likes_count: 0
        })

      if (error) throw error

      setUploadProgress(100)
      
      // 重置表单
      setTitle('')
      setArtist('')
      setGenre('')
      setTags('')
      setDescription('')
      setAudioFile(null)
      setCoverFile(null)
      setIsVipOnly(false)
      setAllowDownload(true)
      setAllowComments(true)

      alert('音乐上传成功！')
      router.push('/profile')
    } catch (error: any) {
      console.error('Upload error:', error)
      alert('上传失败：' + (error.message || '未知错误'))
    } finally {
      setIsUploading(false)
      setUploadProgress(0)
    }
  }

  const handleAudioFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // 检查文件类型
      if (!file.type.startsWith('audio/')) {
        alert('请选择音频文件')
        return
      }
      
      // 检查文件大小（限制50MB）
      if (file.size > 50 * 1024 * 1024) {
        alert('音频文件大小不能超过50MB')
        return
      }
      
      setAudioFile(file)
    }
  }

  const handleCoverFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // 检查文件类型
      if (!file.type.startsWith('image/')) {
        alert('请选择图片文件')
        return
      }
      
      // 检查文件大小（限制5MB）
      if (file.size > 5 * 1024 * 1024) {
        alert('图片文件大小不能超过5MB')
        return
      }
      
      setCoverFile(file)
    }
  }

  if (!user) {
    return (
      <Layout>
        <div className="p-4 flex items-center justify-center min-h-screen">
          <div className="loading-spinner"></div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-6">上传音乐</h1>

        {isUploading && (
          <div className="mb-6 bg-gray-800 rounded-lg p-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm">上传进度</span>
              <span className="text-sm">{uploadProgress}%</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div 
                className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 音频文件上传 */}
          <div>
            <label className="block text-sm font-medium mb-2">音频文件 *</label>
            <div className="border-2 border-dashed border-gray-600 rounded-lg p-6 text-center">
              {audioFile ? (
                <div>
                  <p className="text-green-400 mb-2">✅ {audioFile.name}</p>
                  <p className="text-sm text-gray-400 mb-2">
                    大小: {(audioFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                  <button
                    type="button"
                    onClick={() => setAudioFile(null)}
                    className="text-red-400 text-sm hover:text-red-300"
                  >
                    移除文件
                  </button>
                </div>
              ) : (
                <div>
                  <span className="text-4xl mb-2 block">🎵</span>
                  <p className="text-gray-400 mb-2">点击或拖拽上传音频文件</p>
                  <p className="text-xs text-gray-500">支持 MP3, WAV, FLAC 格式，最大50MB</p>
                  <input
                    type="file"
                    accept="audio/*"
                    onChange={handleAudioFileChange}
                    className="hidden"
                    id="audio-upload"
                    disabled={isUploading}
                  />
                  <label
                    htmlFor="audio-upload"
                    className="inline-block bg-blue-600 text-white px-4 py-2 rounded-lg mt-2 cursor-pointer hover:bg-blue-700"
                  >
                    选择文件
                  </label>
                </div>
              )}
            </div>
          </div>

          {/* 封面上传 */}
          <div>
            <label className="block text-sm font-medium mb-2">封面图片</label>
            <div className="border-2 border-dashed border-gray-600 rounded-lg p-6 text-center">
              {coverFile ? (
                <div>
                  <p className="text-green-400 mb-2">✅ {coverFile.name}</p>
                  <p className="text-sm text-gray-400 mb-2">
                    大小: {(coverFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                  <button
                    type="button"
                    onClick={() => setCoverFile(null)}
                    className="text-red-400 text-sm hover:text-red-300"
                  >
                    移除图片
                  </button>
                </div>
              ) : (
                <div>
                  <span className="text-4xl mb-2 block">🖼️</span>
                  <p className="text-gray-400 mb-2">上传封面图片</p>
                  <p className="text-xs text-gray-500">建议尺寸 1:1，支持 JPG, PNG 格式，最大5MB</p>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleCoverFileChange}
                    className="hidden"
                    id="cover-upload"
                    disabled={isUploading}
                  />
                  <label
                    htmlFor="cover-upload"
                    className="inline-block bg-gray-600 text-white px-4 py-2 rounded-lg mt-2 cursor-pointer hover:bg-gray-700"
                  >
                    选择图片
                  </label>
                </div>
              )}
            </div>
          </div>

          {/* 歌曲信息 */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">歌曲标题 *</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="输入歌曲标题"
                className="input-field"
                required
                disabled={isUploading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">艺术家 *</label>
              <input
                type="text"
                value={artist}
                onChange={(e) => setArtist(e.target.value)}
                placeholder="输入艺术家名称"
                className="input-field"
                required
                disabled={isUploading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">音乐分类 *</label>
              <select
                value={genre}
                onChange={(e) => setGenre(e.target.value)}
                className="input-field"
                required
                disabled={isUploading}
              >
                <option value="">选择音乐分类</option>
                {genres.map((g) => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">标签</label>
              <input
                type="text"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="流行, 电子, DJ, 缅甸音乐 (用逗号分隔)"
                className="input-field"
                disabled={isUploading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">描述</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="介绍一下这首歌曲..."
                rows={4}
                className="input-field resize-none"
                disabled={isUploading}
              />
            </div>
          </div>

          {/* 发布设置 */}
          <div className="bg-gray-800 rounded-lg p-4">
            <h3 className="text-lg font-bold mb-3">发布设置</h3>
            <div className="space-y-3">
              <label className="flex items-center space-x-3">
                <input 
                  type="checkbox" 
                  checked={allowDownload}
                  onChange={(e) => setAllowDownload(e.target.checked)}
                  className="rounded"
                  disabled={isUploading}
                />
                <span className="text-sm">允许下载</span>
              </label>
              <label className="flex items-center space-x-3">
                <input 
                  type="checkbox" 
                  checked={allowComments}
                  onChange={(e) => setAllowComments(e.target.checked)}
                  className="rounded"
                  disabled={isUploading}
                />
                <span className="text-sm">允许评论</span>
              </label>
              <label className="flex items-center space-x-3">
                <input 
                  type="checkbox" 
                  checked={isVipOnly}
                  onChange={(e) => setIsVipOnly(e.target.checked)}
                  className="rounded"
                  disabled={isUploading}
                />
                <span className="text-sm">仅 VIP 用户可播放</span>
              </label>
            </div>
          </div>

          {/* 提交按钮 */}
          <div className="flex space-x-4">
            <button
              type="button"
              className="flex-1 btn-secondary"
              disabled={isUploading}
              onClick={() => router.push('/profile')}
            >
              取消
            </button>
            <button
              type="submit"
              className="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={!audioFile || !title || !artist || !genre || isUploading}
            >
              {isUploading ? '上传中...' : '发布音乐'}
            </button>
          </div>
        </form>

        {/* 上传须知 */}
        <div className="mt-6 bg-yellow-900/30 border border-yellow-600 rounded-lg p-4">
          <h3 className="text-yellow-400 font-bold mb-2">📋 上传须知</h3>
          <ul className="text-sm text-yellow-300 space-y-1">
            <li>• 请确保您拥有音乐的版权或已获得授权</li>
            <li>• 音频文件支持 MP3, WAV, FLAC 格式，最大50MB</li>
            <li>• 封面图片建议使用正方形比例，最大5MB</li>
            <li>• 上传的内容将经过审核，违规内容将被删除</li>
            <li>• 优质内容将获得更多推荐机会</li>
          </ul>
        </div>
      </div>
    </Layout>
  )
}

