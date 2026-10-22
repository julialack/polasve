'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'
import { User } from 'lucide-react'
import Image from 'next/image'

interface UserAvatarProps {
  avatarUrl?: string | null
  userId?: string
  userName?: string
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  className?: string
}

const sizeClasses = {
  xs: 'w-6 h-6 text-[8px]',
  sm: 'w-8 h-8 text-[10px]',
  md: 'w-10 h-10 text-xs',
  lg: 'w-12 h-12 text-sm',
  xl: 'w-full h-full text-lg'
}

export default function UserAvatar({ avatarUrl, userId, userName, size = 'sm', className = '' }: UserAvatarProps) {
  const [failedUrl, setFailedUrl] = useState<string | null>(null)
  const [fetchedAvatar, setFetchedAvatar] = useState<{ userId: string; url: string } | null>(null)
  const supabase = createClient()

  useEffect(() => {
    let mounted = true

    const loadAvatar = async () => {
      // 1. If we already have a valid avatarUrl, we're done
      if (avatarUrl) return

      // 2. If we don't have a userId, we can't do much more
      if (!userId) return

      try {
        // 3. Fetch from profiles table (where the design avatar URL is stored)
        const { data: profile } = await supabase
          .from('profiles')
          .select('avatar_url')
          .eq('id', userId)
          .single()

        if (profile?.avatar_url && mounted) {
          setFetchedAvatar({ userId, url: profile.avatar_url })
        }
      } catch {
        // Fail silently
      }
    }

    loadAvatar()
    return () => { mounted = false }
  }, [userId, avatarUrl, supabase])

  const finalUrl = avatarUrl || (fetchedAvatar && fetchedAvatar.userId === userId ? fetchedAvatar.url : null)
  const showImage = finalUrl && failedUrl !== finalUrl

  return (
    <div className={`${sizeClasses[size]} relative rounded-full bg-zinc-100 flex items-center justify-center overflow-hidden border border-zinc-200 shadow-inner shrink-0 ${className}`}>
      {showImage ? (
        <Image
          src={finalUrl!}
          alt=""
          fill
          sizes="48px"
          unoptimized
          className="w-full h-full object-cover"
          onError={() => setFailedUrl(finalUrl)}
        />
      ) : userName ? (
        <span className="font-black text-zinc-400 uppercase">{userName[0]}</span>
      ) : (
        <User className="text-zinc-300" size={size === 'xs' ? 12 : 16} />
      )}
    </div>
  )
}
