'use client'

import { useState } from 'react'
import Image from 'next/image'
import { ChevronLeft, ChevronRight, Maximize2, X, ShieldCheck } from 'lucide-react'

interface AdImageGalleryProps {
  mainImage: string | null
  extraImages?: string[] | null
  title: string
  category: string
  isPremium?: boolean
}

export default function AdImageGallery({
  mainImage,
  extraImages = [],
  title,
  category,
  isPremium = false,
}: AdImageGalleryProps) {
  const allImages = [mainImage, ...(extraImages || [])].filter((img): img is string => Boolean(img))

  const [currentIndex, setCurrentIndex] = useState(0)
  const [fullscreen, setFullscreen] = useState(false)
  const [touchStart, setTouchStart] = useState<number | null>(null)
  const [touchEnd, setTouchEnd] = useState<number | null>(null)

  if (allImages.length === 0) return null

  const currentImage = allImages[currentIndex] || allImages[0]

  const handleNext = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation()
    setCurrentIndex((prev) => (prev + 1) % allImages.length)
  }

  const handlePrev = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation()
    setCurrentIndex((prev) => (prev - 1 + allImages.length) % allImages.length)
  }

  const minSwipeDistance = 50

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null)
    setTouchStart(e.targetTouches[0].clientX)
  }

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return
    const distance = touchStart - touchEnd
    const isLeftSwipe = distance > minSwipeDistance
    const isRightSwipe = distance < -minSwipeDistance

    if (isLeftSwipe) {
      handleNext()
    } else if (isRightSwipe) {
      handlePrev()
    }
  }

  return (
    <>
      <div className="w-full bg-zinc-950 relative border-b border-zinc-200 select-none">
        {/* Main Image View */}
        <div
          className="w-full h-[320px] sm:h-[420px] md:h-[520px] relative overflow-hidden flex items-center justify-center cursor-pointer group"
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
          onClick={() => setFullscreen(true)}
        >
          {/* Ambient blurred background */}
          <Image
            src={currentImage}
            alt=""
            fill
            sizes="100vw"
            unoptimized
            className="absolute inset-0 w-full h-full object-cover blur-2xl opacity-40 scale-110 pointer-events-none transition-all duration-500"
          />

          {/* Main Image */}
          <Image
            src={currentImage}
            alt={title}
            fill
            sizes="100vw"
            unoptimized
            className="relative z-10 max-w-full max-h-full object-contain mx-auto shadow-2xl p-2 transition-transform duration-300"
          />

          {/* Badges */}
          <div className="absolute top-4 left-4 md:top-6 md:left-6 z-20 flex gap-2 md:gap-3 pointer-events-none">
            <span className="bg-[#a11a2d] text-white px-3 py-1 md:px-4 md:py-1.5 rounded-sm text-[8px] md:text-[10px] font-black uppercase tracking-widest shadow-xl">
              {category}
            </span>
            {isPremium && (
              <span className="bg-[#003366] text-white px-3 py-1 md:px-4 md:py-1.5 rounded-sm text-[8px] md:text-[10px] font-black uppercase tracking-widest shadow-xl flex items-center gap-1 md:gap-2">
                <ShieldCheck size={12} /> Premium
              </span>
            )}
          </div>

          {/* Fullscreen Expand Hint */}
          <div className="absolute top-4 right-4 z-20 bg-black/50 hover:bg-black/80 text-white p-2 rounded-full backdrop-blur-sm transition-all shadow-lg opacity-80 group-hover:opacity-100">
            <Maximize2 size={16} />
          </div>

          {/* Image Counter */}
          {allImages.length > 1 && (
            <div className="absolute bottom-4 right-4 z-20 bg-black/60 text-white text-[10px] font-black px-3 py-1 rounded-full backdrop-blur-md border border-white/20 tracking-wider">
              {currentIndex + 1} / {allImages.length}
            </div>
          )}

          {/* Navigation Arrows */}
          {allImages.length > 1 && (
            <>
              <button
                onClick={handlePrev}
                className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/50 hover:bg-black text-white flex items-center justify-center backdrop-blur-sm transition-all shadow-xl active:scale-90"
                aria-label="Föregående bild"
              >
                <ChevronLeft size={22} />
              </button>
              <button
                onClick={handleNext}
                className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/50 hover:bg-black text-white flex items-center justify-center backdrop-blur-sm transition-all shadow-xl active:scale-90"
                aria-label="Nästa bild"
              >
                <ChevronRight size={22} />
              </button>
            </>
          )}
        </div>

        {/* Thumbnail Selector */}
        {allImages.length > 1 && (
          <div className="bg-zinc-900/90 border-t border-white/10 p-3 flex items-center justify-center gap-2 md:gap-3 overflow-x-auto scrollbar-hide">
            {allImages.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`relative w-14 h-14 sm:w-16 sm:h-16 flex-shrink-0 rounded-sm overflow-hidden border-2 transition-all ${
                  currentIndex === idx
                    ? 'border-[#a11a2d] ring-2 ring-[#a11a2d]/50 scale-105 opacity-100'
                    : 'border-white/20 opacity-60 hover:opacity-100 hover:border-white/50'
                }`}
              >
                <Image src={img} alt="" fill sizes="64px" unoptimized className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Fullscreen Lightbox Modal */}
      {fullscreen && (
        <div className="fixed inset-0 z-[200] bg-black/95 backdrop-blur-md flex flex-col items-center justify-between p-4 md:p-8 animate-in fade-in duration-200">
          <div className="w-full flex justify-between items-center text-white z-10">
            <span className="text-xs font-black uppercase tracking-widest text-zinc-400">
              {currentIndex + 1} av {allImages.length}
            </span>
            <button
              onClick={() => setFullscreen(false)}
              className="p-3 text-white hover:text-red-500 bg-white/10 rounded-full transition-all"
            >
              <X size={24} />
            </button>
          </div>

          {/* Fullscreen Image */}
          <div
            className="relative flex-1 w-full max-w-6xl my-4 flex items-center justify-center overflow-hidden"
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
          >
            <Image
              src={currentImage}
              alt=""
              fill
              sizes="100vw"
              unoptimized
              className="max-w-full max-h-full object-contain mx-auto shadow-2xl rounded-sm"
            />

            {allImages.length > 1 && (
              <>
                <button
                  onClick={handlePrev}
                  className="absolute left-2 md:left-6 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/30 text-white p-3 rounded-full backdrop-blur-md transition-all"
                >
                  <ChevronLeft size={28} />
                </button>
                <button
                  onClick={handleNext}
                  className="absolute right-2 md:left-auto md:right-6 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/30 text-white p-3 rounded-full backdrop-blur-md transition-all"
                >
                  <ChevronRight size={28} />
                </button>
              </>
            )}
          </div>

          {/* Fullscreen Thumbnails */}
          {allImages.length > 1 && (
            <div className="flex gap-2 overflow-x-auto p-2 scrollbar-hide">
              {allImages.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  className={`relative w-12 h-12 rounded-sm overflow-hidden border-2 transition-all ${
                    currentIndex === idx ? 'border-red-500 scale-110 opacity-100' : 'border-white/20 opacity-50'
                  }`}
                >
                  <Image src={img} alt="" fill sizes="48px" unoptimized className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </>
  )
}
