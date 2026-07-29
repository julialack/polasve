'use client'

import { useState } from 'react'

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
  const [imgSrc, setImgSrc] = useState(src)
  const [hasError, setHasError] = useState(false)

  const handleError = () => {
    if (!hasError) {
      setImgSrc(fallbackSrc)
      setHasError(true)
    }
  }

  return (
    <img
      src={imgSrc}
      alt={alt}
      onError={handleError}
      className={className}
      {...props}
    />
  )
}
