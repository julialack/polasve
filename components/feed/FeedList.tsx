'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import PostCard from './PostCard'

export default function FeedList() {
  const [posts, setPosts] = useState<any[]>([])
  const [currentUser, setCurrentUser] = useState<any>(null)
  const supabase = createClient()

  const fetchPosts = async () => {
    const { data } = await supabase
      .from('posts')
      .select('*')
      .order('created_at', { ascending: false })
    if (data) setPosts(data)
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
    await supabase.from('posts').delete().eq('id', id)
    fetchPosts()
  }

  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <PostCard
          key={post.id}
          post={post}
          currentUser={currentUser}
          onDelete={handleDelete}
          onUpdate={fetchPosts}
        />
      ))}
    </div>
  )
}
