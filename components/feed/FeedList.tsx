'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import PostCard from './PostCard'
import Skeleton from '../ui/Skeleton'
import { Post } from '@/types/database'

export default function FeedList() {
  const [posts, setPosts] = useState<Post[]>([])
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  const fetchPosts = async () => {
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .order('created_at', { ascending: false })
    if (error) console.error("Error fetching posts:", error)
    if (data) setPosts(data)
    setLoading(false)
  }

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

    return () => { supabase.removeChannel(postChannel) }
  }, [])

  const handleDelete = async (id: string) => {
    // We already have confirmation inside the component if we want, or here
    await supabase.from('posts').delete().eq('id', id)
    fetchPosts()
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
