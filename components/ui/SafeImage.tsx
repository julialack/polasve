'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'

interface SafeImageProps {
  src: string | null | undefined
  alt: string
  className?: string
  fallbackSrc?: string
  sizes?: string
  priority?: boolean
}

export default function SafeImage({
  src,
  alt = "",
  fallbackSrc = "https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=800&auto=format&fit=crop",
  className = "",
  sizes = "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw",
  priority = false,
}: SafeImageProps) {
  const [imgSrc, setImgSrc] = useState<string>(src || fallbackSrc)
  const [hasError, setHasError] = useState(false)

  useEffect(() => {
    setImgSrc(src || fallbackSrc)
    setHasError(false)
  }, [src, fallbackSrc])

  const handleError = () => {
    if (!hasError) {
      setImgSrc(fallbackSrc)
      setHasError(true)
    }
  }

  if (!imgSrc) return null

  return (
    <div className={`relative ${className}`}>
      <Image
        src={imgSrc}
        alt={alt}
        fill
        className="object-cover"
        onError={handleError}
        sizes={sizes}
        priority={priority}
      />
    </div>
  )
}
