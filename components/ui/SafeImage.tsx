'use client'

import { useState, useEffect } from 'react'

interface SafeImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallbackSrc?: string
}

export default function SafeImage({
  src,
  alt = "",
  fallbackSrc = "https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=800&auto=format&fit=crop",
  className,
  ...props
}: SafeImageProps) {
  const [imgSrc, setImgSrc] = useState(src || fallbackSrc)
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

  if (!imgSrc && !src) return null

  return (
    <img
      src={imgSrc || fallbackSrc}
      alt={alt}
      onError={handleError}
      className={className}
      {...props}
    />
  )
}
