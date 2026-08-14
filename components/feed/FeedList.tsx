'use client'

import { useEffect, useState, useCallback } from 'react'
import { createClient } from '@/utils/supabase/client'
import PostCard from './PostCard'
import Skeleton from '../ui/Skeleton'
import { Post } from '@/types/database'

export default function FeedList() {
  const [posts, setPosts] = useState<Post[]>([])
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  const fetchPosts = useCallback(async () => {
    // We only show loading on the first fetch
    const { data: postsData, error: postsError } = await supabase
      .from('posts')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(20)

    if (postsError) {
      console.error("Error fetching posts:", postsError)
      setLoading(false)
      return
    }

    if (postsData) {
      const userIds = Array.from(new Set(postsData.map(p => p.user_id)))
      const { data: profilesData } = await supabase
        .from('profiles')
        .select('id, avatar_url')
        .in('id', userIds)

      const profileMap = (profilesData || []).reduce((acc: any, p: any) => {
        acc[p.id] = p.avatar_url
        return acc
      }, {})

      const postsWithProfiles = postsData.map(post => ({
        ...post,
        avatar_url: profileMap[post.user_id]
      }))

      setPosts(postsWithProfiles as any)
    }
    setLoading(false)
  }, [supabase])

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setCurrentUser(user)
    }

    getUser()
    fetchPosts()

    const postChannel = supabase
      .channel('realtime_posts_all')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'posts' }, () => {
        fetchPosts()
      })
      .subscribe()

    return () => {
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
    <div className="space-y-4">
      {posts.length === 0 ? (
        <p className="text-center py-10 text-zinc-400 italic text-sm">Inga inlägg ännu...</p>
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
