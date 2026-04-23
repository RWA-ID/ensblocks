'use client'

import { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'

interface IPFSUploaderProps {
  accept: Record<string, string[]>
  maxFiles?: number
  onUpload: (cids: string[]) => void
  label?: string
}

export default function IPFSUploader({ accept, maxFiles = 1, onUpload, label = 'Drop files or click to select' }: IPFSUploaderProps) {
  const [uploading, setUploading] = useState(false)
  const [cids, setCids] = useState<string[]>([])
  const [error, setError] = useState('')

  const onDrop = useCallback(async (files: File[]) => {
    setUploading(true)
    setError('')
    const newCids: string[] = []
    try {
      for (const file of files) {
        const fd = new FormData()
        fd.append('file', file)
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL ?? ''}/api/upload`, { method: 'POST', body: fd })
        if (!res.ok) throw new Error(await res.text())
        const { cid } = await res.json()
        newCids.push(cid)
      }
      setCids(prev => [...prev, ...newCids])
      onUpload([...cids, ...newCids])
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Upload failed')
    } finally {
      setUploading(false)
    }
  }, [cids, onUpload])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    maxFiles,
    maxSize: 10 * 1024 * 1024,
  })

  return (
    <div>
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors ${
          isDragActive ? 'border-[#6C63FF] bg-[#6C63FF]/5' : 'border-[#2A2A3E] hover:border-[#6C63FF]/50'
        }`}
      >
        <input {...getInputProps()} />
        {uploading ? (
          <p className="text-[#8888AA] text-sm">Uploading to IPFS…</p>
        ) : (
          <p className="text-[#8888AA] text-sm">{label}</p>
        )}
      </div>
      {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
      {cids.length > 0 && (
        <div className="mt-2 space-y-1">
          {cids.map(cid => (
            <p key={cid} className="text-xs text-[#6C63FF] font-mono truncate">
              ✓ ipfs://{cid}
            </p>
          ))}
        </div>
      )}
    </div>
  )
}
