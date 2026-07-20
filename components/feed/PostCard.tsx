'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'
import { formatDisplayName } from '@/utils/formatName'
import { Heart, MessageSquare, Loader2, Send, Trash2, Edit2, X, Check } from 'lucide-react'

interface PostCardProps {
  post: any
  currentUser: any
  onDelete: (id: string) => void
  onUpdate: () => void
}

export default function PostCard({ post, currentUser, onDelete, onUpdate }: PostCardProps) {
  const [loadingLikes, setLoadingLikes] = useState(false)
  const [activeCommentPost, setActiveCommentPost] = useState(false)
  const [commentContent, setCommentContent] = useState('')
  const [comments, setComments] = useState<any[]>([])
  const [commentCount, setCommentCount] = useState(0)
  const [userLikes, setUserLikes] = useState(false)

  const [editingPost, setEditingPost] = useState(false)
  const [editPostContent, setEditPostContent] = useState(post.content)

  const [editingComment, setEditingComment] = useState<string | null>(null)
  const [editCommentContent, setEditCommentContent] = useState('')

  const supabase = createClient()

  const fetchComments = async () => {
    const { data, error } = await supabase
      .from('comments')
      .select('*')
      .eq('post_id', post.id)
      .order('created_at', { ascending: true })

    if (!error) {
      setComments(data || [])
      setCommentCount(data?.length || 0)
    }
  }

  const fetchCommentCount = async () => {
    const { count, error } = await supabase
      .from('comments')
      .select('*', { count: 'exact', head: true })
      .eq('post_id', post.id)

    if (!error && count !== null) {
      setCommentCount(count)
    }
  }

  useEffect(() => {
    fetchCommentCount()
  }, [])

  useEffect(() => {
    if (activeCommentPost) {
      fetchComments()
    }
  }, [activeCommentPost])

  const handleLike = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (!currentUser) return alert('Logga in för att gilla')
    if (userLikes) return

    setLoadingLikes(true)
    const { error } = await supabase
      .from('posts')
      .update({ likes_count: (post.likes_count || 0) + 1 })
      .eq('id', post.id)

    if (!error) {
      setUserLikes(true)
      onUpdate()
    }
    setLoadingLikes(false)
  }

  const handlePostComment = async () => {
    if (!commentContent.trim() || !currentUser) return
    const { error } = await supabase.from('comments').insert([{
      post_id: post.id,
      user_id: currentUser.id,
      user_name: currentUser.user_metadata?.full_name || currentUser.email?.split('@')[0],
      content: commentContent
    }])
    if (!error) {
      setCommentContent('')
      fetchComments()
      onUpdate()
    }
  }

  const handleUpdatePost = async () => {
    const { error } = await supabase.from('posts').update({
      content: editPostContent,
      edited: true
    }).eq('id', post.id)
    if (!error) {
      setEditingPost(false)
      onUpdate()
    }
  }

  const handleUpdateComment = async (commentId: string) => {
    const { error } = await supabase.from('comments').update({
      content: editCommentContent,
      edited: true
    }).eq('id', commentId)
    if (!error) {
      setEditingComment(null)
      fetchComments()
    }
  }

  const handleDeleteComment = async (commentId: string) => {
    if (!confirm('Ta bort kommentaren?')) return
    const { error } = await supabase.from('comments').delete().eq('id', commentId)
    if (!error) fetchComments()
  }

  return (
    <div className="bg-white border border-zinc-100 p-4 rounded-sm shadow-sm group text-left">
      <div className="flex justify-between items-start mb-2">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-zinc-100 flex items-center justify-center text-[10px] font-bold text-zinc-400">
            {post.user_name?.[0]?.toUpperCase() || 'U'}
          </div>
          <div>
            <span className="font-bold text-xs text-black">{formatDisplayName(post.user_name)}</span>
            <span className="text-[10px] text-zinc-400 ml-2">{new Date(post.created_at).toLocaleDateString()}</span>
            {post.edited && <span className="text-[9px] text-zinc-300 italic ml-2">(redigerad)</span>}
          </div>
        </div>
        {currentUser?.id === post.user_id && !editingPost && (
          <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button onClick={() => setEditingPost(true)} className="text-zinc-300 hover:text-blue-600 transition-colors p-1"><Edit2 size={12} /></button>
            <button onClick={() => onDelete(post.id)} className="text-zinc-300 hover:text-red-800 transition-colors p-1"><Trash2 size={12} /></button>
          </div>
        )}
      </div>

      {editingPost ? (
        <div className="space-y-2 mt-2">
          <textarea value={editPostContent} onChange={(e) => setEditPostContent(e.target.value)} className="w-full border border-[#003366] p-2 text-sm text-black font-bold outline-none" rows={2} autoFocus />
          <div className="flex gap-2 justify-end">
            <button onClick={() => setEditingPost(false)} className="text-[10px] font-bold text-zinc-400 px-3 py-1">Avbryt</button>
            <button onClick={handleUpdatePost} className="text-[10px] font-bold bg-[#003366] text-white px-4 py-1 rounded-sm">Spara</button>
          </div>
        </div>
      ) : (
        <p className="text-sm text-zinc-800 font-medium mb-3 leading-relaxed">{post.content}</p>
      )}

      <div className="flex gap-6 items-center pt-2 border-t border-zinc-50">
        <button onClick={handleLike} disabled={loadingLikes || userLikes} className={`flex items-center gap-1.5 transition-colors ${userLikes ? 'text-[#a11a2d]' : 'text-zinc-400 hover:text-[#a11a2d]'}`}>
          {loadingLikes ? <Loader2 size={12} className="animate-spin" /> : <Heart size={14} className={userLikes || post.likes_count > 0 ? "fill-current" : ""} />}
          <span className="text-xs font-medium">{post.likes_count || 0}</span>
        </button>
        <button onClick={() => setActiveCommentPost(!activeCommentPost)} className={`flex items-center gap-1.5 transition-colors ${activeCommentPost ? 'text-[#003366]' : 'text-zinc-400 hover:text-black'}`}>
          <MessageSquare size={14} className="scale-x-[-1]" />
          <span className="text-xs font-medium">{commentCount}</span>
        </button>
      </div>

      {activeCommentPost && (
        <div className="mt-4 space-y-3 pl-4 border-l-2 border-zinc-100 animate-in fade-in slide-in-from-top-1">
          {comments.length > 0 ? (
            <div className="space-y-3 mb-4 max-h-40 overflow-y-auto pr-2 scrollbar-hide">
              {comments.map((comment) => (
                <div key={comment.id} className="group/comment">
                  <div className="flex justify-between items-start mb-1 text-xs">
                    <span className="font-bold text-[#003366]">{formatDisplayName(comment.user_name)} {comment.edited && <span className="font-normal text-[8px] text-zinc-300 italic">(redigerad)</span>}</span>
                    {currentUser?.id === comment.user_id && !editingComment && (
                      <div className="flex gap-2 opacity-0 group-hover/comment:opacity-100 transition-opacity">
                        <button onClick={() => { setEditingComment(comment.id); setEditCommentContent(comment.content) }} className="text-zinc-300 hover:text-blue-600"><Edit2 size={10} /></button>
                        <button onClick={() => handleDeleteComment(comment.id)} className="text-zinc-300 hover:text-red-800"><Trash2 size={10} /></button>
                      </div>
                    )}
                  </div>
                  {editingComment === comment.id ? (
                    <div className="flex gap-2 mt-1">
                      <input value={editCommentContent} onChange={(e) => setEditCommentContent(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleUpdateComment(comment.id)} className="flex-1 border border-[#003366] text-xs text-black p-1 font-bold outline-none" autoFocus />
                      <button onClick={() => handleUpdateComment(comment.id)} className="text-[#003366] hover:text-[#a11a2d]"><Check size={12} /></button>
                      <button onClick={() => setEditingComment(null)} className="text-zinc-400 hover:text-black"><X size={12} /></button>
                    </div>
                  ) : (
                    <p className="text-xs text-zinc-800 leading-normal bg-zinc-50 p-2 rounded-sm">{comment.content}</p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-[10px] text-zinc-400 italic mb-2">Inga kommentarer ännu.</p>
          )}

          <div className="flex gap-2 pt-2 border-t border-zinc-50">
            <input value={commentContent} onChange={(e) => setCommentContent(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handlePostComment()} placeholder="Skriv ett svar..." className="flex-1 bg-zinc-50 border border-zinc-200 p-2 px-4 rounded-full text-xs text-black font-bold outline-none focus:border-[#003366]" />
            <button onClick={handlePostComment} className="text-[#003366] hover:text-[#a11a2d] transition-colors p-1"><Send size={16} /></button>
          </div>
        </div>
      )}
    </div>
  )
}
