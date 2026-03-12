'use client'

import React, { useState } from 'react'
import { X, AlertCircle, UploadCloud, Image as ImageIcon } from 'lucide-react'
import { addCourse } from '@/app/actions/admin'
import Image from 'next/image'

interface AddCourseModalProps {
  onCancel: () => void
  onSuccess: () => void
}

export default function AddCourseModal({ onCancel, onSuccess }: AddCourseModalProps) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [image, setImage] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setError('Image must be less than 2MB')
        return
      }
      const reader = new FileReader()
      reader.onloadend = () => {
        setImage(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const result = await addCourse({
        title,
        description,
        image_url: image || undefined
      })

      if (result.error) {
        setError(result.error)
      } else {
        onSuccess()
      }
    } catch (err) {
      setError('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-[2.5rem] p-8 w-full max-w-xl shadow-2xl animate-in zoom-in duration-300">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-black text-[#0f172a] tracking-tight">Create Course</h2>
          <p className="text-slate-500 text-sm font-medium mt-1">Add a new course bundle for students.</p>
        </div>
        <button 
          onClick={onCancel}
          className="p-2 hover:bg-slate-100 rounded-full transition-colors"
        >
          <X className="w-6 h-6 text-slate-400" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="p-4 bg-red-50 text-red-600 rounded-2xl text-sm font-bold border border-red-100 flex items-center gap-2">
            <AlertCircle className="w-4 h-4" />
            {error}
          </div>
        )}

        <div className="space-y-2">
          <label className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Course Title</label>
          <input
            required
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Complete DGCA Preparation"
            className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all font-bold"
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Description</label>
          <textarea
            required
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Briefly describe what this course includes..."
            className="w-full p-6 bg-slate-50 border border-slate-200 rounded-3xl outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all font-bold min-h-[120px]"
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Course Image <span className="normal-case tracking-normal opacity-70 font-bold">(Optional)</span></label>
          <label className={`block w-full ${image ? 'p-2' : 'p-4'} bg-slate-50 border-2 border-dashed ${image ? 'border-primary/50' : 'border-slate-200'} rounded-2xl cursor-pointer hover:bg-slate-100 hover:border-primary/50 transition-all text-center group`}>
            {image ? (
              <div className="relative w-full h-24 rounded-xl overflow-hidden bg-white">
                <Image src={image} alt="Course preview" fill className="object-cover" />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-white font-bold flex items-center gap-2 text-sm">
                    <UploadCloud className="w-4 h-4" /> Change Image
                  </span>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center space-y-2">
                <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-slate-400 group-hover:text-primary group-hover:scale-110 transition-all">
                  <ImageIcon className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-bold text-[#0f172a] text-sm">Click to upload an image</p>
                  <p className="text-xs font-medium text-slate-500 mt-0.5">PNG, JPG, or GIF (max. 2MB)</p>
                </div>
              </div>
            )}
            <input 
              type="file" 
              accept="image/png, image/jpeg, image/gif" 
              className="hidden" 
              onChange={handleImageUpload}
            />
          </label>
        </div>

        <div className="flex gap-4 pt-4">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 py-4 px-6 border-2 border-slate-100 text-slate-600 rounded-2xl font-black hover:bg-slate-50 transition-all"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex-[2] py-4 px-6 bg-primary text-white rounded-2xl font-black shadow-lg shadow-primary/20 hover:bg-[#152e75] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {loading ? 'Creating...' : 'Create Course'}
          </button>
        </div>
      </form>
    </div>
  )
}
