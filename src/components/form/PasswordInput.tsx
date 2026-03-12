'use client'

import React, { useState } from 'react'
import { Lock, Eye, EyeOff } from 'lucide-react'

interface PasswordInputProps {
  id: string
  name: string
  placeholder?: string
  required?: boolean
  autoComplete?: string
}

export default function PasswordInput({
  id,
  name,
  placeholder = '••••••••',
  required = true,
  autoComplete,
}: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false)

  return (
    <div className="mt-1 relative rounded-md shadow-sm">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Lock className="h-5 w-5 text-slate-400" />
      </div>
      <input
        id={id}
        name={name}
        type={showPassword ? 'text' : 'password'}
        autoComplete={autoComplete}
        required={required}
        className="focus:ring-primary focus:border-primary block w-full pl-10 pr-10 sm:text-sm border-slate-300 rounded-xl py-3 bg-slate-50 border border-slate-200 outline-none transition-colors"
        placeholder={placeholder}
      />
      <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="text-slate-400 hover:text-primary focus:outline-none transition-colors"
          tabIndex={-1}
        >
          {showPassword ? (
            <EyeOff className="h-5 w-5" />
          ) : (
            <Eye className="h-5 w-5" />
          )}
        </button>
      </div>
    </div>
  )
}
