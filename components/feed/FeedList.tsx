'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { formatDisplayName } from '@/utils/formatName'
import { Heart, MessageSquare, Loader2, Send, Trash2 } from 'lucide-react'

export default function FeedList() {
  const [posts, setPosts] = useState<any[]>([])
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [loadingLikes, setLoadingLikes] = useState<string | null>(null)
  const [activeCommentPost, setActiveCommentPost] = useState<string | null>(null)
  const [commentContent, setCommentContent] = useState('')
  const [comments, setComments] = useState<Record<string, any[]>>({})
  const supabase = createClient()

  const fetchPosts = async () => {
    const { data } = await supabase
      .from('posts')
      .select('*')
      .order('created_at', { ascending: false })
    if (data) setPosts(data)
  }

  const fetchComments = async (postId: string) => {
    const { data } = await supabase
      .from('comments')
      .select('*')
      .eq('post_id', postId)
      .order('created_at', { ascending: true })
    if (data) {
      setComments(prev => ({ ...prev, [postId]: data }))
    }
  }

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setCurrentUser(user)
    }
    getUser()
    fetchPosts()

    const postChannel = supabase
      .channel('realtime posts')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'posts' }, () => {
        fetchPosts()
      })
      .subscribe()

    const commentChannel = supabase
      .channel('realtime comments')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'comments' }, (payload) => {
        if (payload.eventType === 'INSERT') {
          const newComment = payload.new;
          setComments(prev => ({
            ...prev,
            [newComment.post_id]: [...(prev[newComment.post_id] || []), newComment]
          }))
        } else if (payload.eventType === 'DELETE') {
          // Simplest is to refresh all posts/comments on delete
          fetchPosts()
        }
      })
      .subscribe()

    return () => {
      supabase.removeChannel(postChannel)
      supabase.removeChannel(commentChannel)
    }
  }, [])

  const handleLike = async (postId: string, currentLikes: number) => {
    if (!currentUser) return alert('Logga in för att gilla')
    setLoadingLikes(postId)
    await supabase
      .from('posts')
      .update({ likes_count: (currentLikes || 0) + 1 })
      .eq('id', postId)
    setLoadingLikes(null)
  }

  const handlePostComment = async (postId: string) => {
    if (!commentContent.trim() || !currentUser) return
    const { error } = await supabase
      .from('comments')
      .insert([{
        post_id: postId,
        user_id: currentUser.id,
        user_name: currentUser.user_metadata?.full_name || currentUser.email?.split('@')[0],
        content: commentContent
      }])

    if (!error) {
      setCommentContent('')
      fetchComments(postId)
    }
  }

  const handleDeletePost = async (postId: string) => {
    if (!confirm('Är du säker på att du vill ta bort inlägget?')) return

    const { error } = await supabase
      .from('posts')
      .delete()
      .eq('id', postId)

    if (error) {
      alert('Kunde inte ta bort inlägget: ' + error.message)
    } else {
      fetchPosts()
    }
  }

  const handleDeleteComment = async (commentId: string, postId: string) => {
    if (!confirm('Är du säker på att du vill ta bort kommentaren?')) return

    const { error } = await supabase
      .from('comments')
      .delete()
      .eq('id', commentId)

    if (error) {
      alert('Kunde inte ta bort kommentar')
    } else {
      fetchComments(postId)
    }
  }

  const toggleComments = (postId: string) => {
    if (activeCommentPost === postId) {
      setActiveCommentPost(null)
    } else {
      setActiveCommentPost(postId)
      if (!comments[postId]) fetchComments(postId)
    }
  }

  return (
    <div className="space-y-12">
      {posts.map((post) => (
        <div key={post.id} className="group border-b border-zinc-50 pb-8 last:border-0">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full border border-zinc-100 flex items-center justify-center font-bold text-[10px] text-zinc-400 bg-zinc-50">
                {post.user_name?.[0]?.toUpperCase() || 'U'}
              </div>
              <div>
                <h4 className="font-bold text-xs uppercase tracking-widest text-zinc-900">{formatDisplayName(post.user_name)}</h4>
                <p className="text-[9px] text-zinc-300 font-bold uppercase tracking-tighter">
                  {new Date(post.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
            {currentUser?.id === post.user_id && (
              <button
                onClick={() => handleDeletePost(post.id)}
                className="text-zinc-300 hover:text-red-800 transition-colors opacity-0 group-hover:opacity-100 p-2"
                title="Ta bort inlägg"
              >
                <Trash2 size={14} />
              </button>
            )}
          </div>

          <div className="pl-0 sm:pl-14">
            <p className="text-zinc-600 font-light leading-relaxed mb-4">{post.content}</p>
            {post.image_url && (
              <div className="mb-6 rounded-sm overflow-hidden border border-zinc-100 shadow-sm bg-zinc-50">
                <img
                  src={post.image_url}
                  alt="Content"
                  className="w-full h-auto max-h-[600px] object-contain mx-auto"
                  onError={(e) => (e.currentTarget.style.display = 'none')}
                />
              </div>
            )}

            <div className="flex gap-8 items-center mb-6">
              <button onClick={() => handleLike(post.id, post.likes_count)} className="flex items-center gap-2 text-[10px] font-bold text-zinc-400 hover:text-red-800 transition-colors uppercase tracking-[0.2em]">
                {loadingLikes === post.id ? <Loader2 size={12} className="animate-spin" /> : <Heart size={12} className={post.likes_count > 0 ? "fill-red-800 text-red-800" : ""} />}
                Gilla ({post.likes_count || 0})
              </button>
              <button onClick={() => toggleComments(post.id)} className="flex items-center gap-2 text-[10px] font-bold text-zinc-400 hover:text-zinc-900 transition-colors uppercase tracking-[0.2em]">
                <MessageSquare size={12} />
                Kommentera
              </button>
            </div>

            {/* Comments Section */}
            {activeCommentPost === post.id && (
              <div className="space-y-4 pt-4 border-t border-zinc-50 animate-in fade-in slide-in-from-top-2">
                {comments[post.id]?.map((comment) => (
                  <div key={comment.id} className="flex gap-3 group/comment">
                    <div className="w-6 h-6 rounded-full bg-zinc-100 flex items-center justify-center text-[8px] font-bold text-zinc-400 flex-shrink-0">
                      {comment.user_name?.[0]?.toUpperCase()}
                    </div>
                    <div className="bg-zinc-50 p-3 rounded-sm flex-1 relative">
                      <div className="flex justify-between items-start">
                        <p className="text-[9px] font-bold uppercase tracking-widest text-zinc-900 mb-1">{formatDisplayName(comment.user_name)}</p>
                        {currentUser?.id === comment.user_id && (
                          <button
                            onClick={() => handleDeleteComment(comment.id, post.id)}
                            className="text-zinc-300 hover:text-red-800 transition-colors opacity-0 group-hover/comment:opacity-100"
                          >
                            <Trash2 size={10} />
                          </button>
                        )}
                      </div>
                      <p className="text-xs text-zinc-600 font-light">{comment.content}</p>
                    </div>
                  </div>
                ))}

                <div className="flex gap-3 pt-2">
                  <div className="w-6 h-6 rounded-full bg-zinc-900 flex items-center justify-center text-[8px] font-bold text-white flex-shrink-0">DU</div>
                  <div className="flex-1 relative">
                    <input
                      value={commentContent}
                      onChange={(e) => setCommentContent(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handlePostComment(post.id)}
                      placeholder="Skriv ett svar..."
                      className="w-full bg-zinc-50 border-none p-3 pr-10 rounded-sm text-xs font-light outline-none focus:ring-1 focus:ring-zinc-200"
                    />
                    <button onClick={() => handlePostComment(post.id)} className="absolute right-2 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-red-800 transition-colors">
                      <Send size={14} />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
