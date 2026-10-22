'use client'

import { useState } from 'react'
import Image, { type ImageProps } from 'next/image'

interface SafeImageProps extends Omit<ImageProps, 'src' | 'alt' | 'fill' | 'onError'> {
  src?: string
  alt?: string
  fallbackSrc?: string
}

export default function SafeImage({
  src,
  alt = "",
  fallbackSrc = "https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=800&auto=format&fit=crop",
  className,
  ...props
}: SafeImageProps) {
  const source = src || fallbackSrc
  const [failedSource, setFailedSource] = useState<string | null>(null)
  const imgSrc = failedSource === source ? fallbackSrc : source

  const handleError = () => {
    setFailedSource(source)
  }

  if (!imgSrc) return null

  return (
    <Image
      src={imgSrc || fallbackSrc}
      alt={alt}
      fill
      sizes="100vw"
      unoptimized
      onError={handleError}
      className={className}
      {...props}
    />
  )
}
