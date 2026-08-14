'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function MeddelandenPage() {
  const router = useRouter()

  useEffect(() => {
    // Redirect to the new integrated chat on the profile page
    router.replace('/profil?view=chat')
  }, [router])

  return (
    <div className="min-h-screen bg-[#f8f9fa] flex items-center justify-center italic text-zinc-400 font-sans">
      Omdirigerar till din profil...
    </div>
  )
}
