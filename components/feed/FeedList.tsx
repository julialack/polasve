'use client'

import { useEffect, useState, useCallback } from 'react'
import { createClient } from '@/utils/supabase/client'
import PostCard from './PostCard'
import Skeleton from '../ui/Skeleton'
import { Post } from '@/types/database'

interface FeedListProps {
  categoryFilter?: string
}

type Profile = {
  id: string
  avatar_url: string | null
}

export default function FeedList({ categoryFilter }: FeedListProps = {}) {
  const [posts, setPosts] = useState<Post[]>([])
  const [currentUser, setCurrentUser] = useState<{ id: string } | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  const fetchPosts = useCallback(async () => {
    let query = supabase
      .from('posts')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(30)

    const isMeetingPlaceFilter = categoryFilter?.toLowerCase().includes('mötesplats') ||
      categoryFilter?.toLowerCase().includes('motesplats') ||
      categoryFilter?.toLowerCase().includes('meeting')

    if (isMeetingPlaceFilter) {
      query = query.or('category.ilike.%mötesplats%,category.ilike.%motesplats%,category.ilike.%meeting%')
    } else {
      query = query.not('category', 'in', '("mötesplats","motesplats","meeting-place","meeting place","Mötesplats","Meeting Place")')
    }

    const { data: postsData, error: postsError } = await query

    if (postsError) {
      console.error('Error fetching posts:', postsError.message, postsError.details, postsError.hint)
      setLoading(false)
      return
    }

    if (postsData && postsData.length > 0) {
      const userIds = Array.from(new Set(postsData.map(post => post.user_id)))
      let profileMap: Record<string, string | null> = {}

      if (userIds.length > 0) {
        const { data: profilesData } = await supabase
          .from('profiles')
          .select('id, avatar_url')
          .in('id', userIds)

        if (profilesData) {
          profileMap = profilesData.reduce<Record<string, string | null>>((acc, profile: Profile) => {
            acc[profile.id] = profile.avatar_url
            return acc
          }, {})
        }
      }

      const postsWithProfiles: Post[] = postsData.map(post => ({
        ...post,
        avatar_url: profileMap[post.user_id]
      }))

      setPosts(postsWithProfiles)
    } else {
      setPosts([])
    }
    setLoading(false)
  }, [supabase, categoryFilter])

  useEffect(() => {
    let isMounted = true

    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (isMounted) {
        setCurrentUser(user)
      }
    }

    const loadData = async () => {
      await getUser()
      await fetchPosts()
    }

    loadData()

    const postChannel = supabase
      .channel('realtime_posts_all')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'posts' }, () => {
        fetchPosts()
      })
      .subscribe()

    return () => {
      isMounted = false
      supabase.removeChannel(postChannel)
    }
  }, [supabase, fetchPosts])

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from('posts').delete().eq('id', id)
    if (!error) {
      fetchPosts()
    }
  }

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white border border-zinc-100 p-4 rounded-sm shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <Skeleton className="w-7 h-7 rounded-full" />
              <Skeleton className="w-24 h-3" />
            </div>
            <Skeleton className="w-full h-4 mb-2" />
            <Skeleton className="w-3/4 h-4" />
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="w-full max-w-full space-y-4 text-left overflow-x-hidden">
      {posts.length === 0 ? (
        <p className="text-center py-10 text-zinc-400 italic text-sm">Inga inlägg här ännu...</p>
      ) : (
        posts.map((post) => (
          <PostCard
            key={post.id}
            post={post}
            currentUser={currentUser}
            onDelete={handleDelete}
            onUpdate={fetchPosts}
          />
        ))
      )}
    </div>
  )
}
