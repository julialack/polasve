'use client'

import { useState } from 'react'
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
  const [userLikes, setUserLikes] = useState(false)

  const [editingPost, setEditingPost] = useState(false)
  const [editPostContent, setEditPostContent] = useState(post.content)

  const supabase = createClient()

  const fetchComments = async () => {
    const { data } = await supabase
      .from('comments')
      .select('*')
      .eq('post_id', post.id)
      .order('created_at', { ascending: true })
    if (data) setComments(data)
  }

  const handleLike = async () => {
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

  return (
    <div className="bg-white border border-zinc-100 p-4 rounded-sm shadow-sm group">
      <div className="flex justify-between items-start mb-2">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-zinc-100 flex items-center justify-center text-[10px] font-bold text-zinc-400">{post.user_name?.[0]?.toUpperCase()}</div>
          <div>
            <span className="font-bold text-xs text-black">{formatDisplayName(post.user_name)}</span>
            <span className="text-[10px] text-zinc-400 ml-2">{new Date(post.created_at).toLocaleDateString()}</span>
            {post.edited && <span className="text-[9px] text-zinc-300 italic ml-2">(redigerad)</span>}
          </div>
        </div>
        {currentUser?.id === post.user_id && !editingPost && (
          <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button onClick={() => setEditingPost(true)} className="text-zinc-300 hover:text-blue-600"><Edit2 size={12} /></button>
            <button onClick={() => onDelete(post.id)} className="text-zinc-300 hover:text-red-800"><Trash2 size={12} /></button>
          </div>
        )}
      </div>

      {editingPost ? (
        <div className="space-y-2 mt-2">
          <textarea value={editPostContent} onChange={(e) => setEditPostContent(e.target.value)} className="w-full border p-2 text-sm text-black rounded-sm font-bold" rows={2} />
          <div className="flex gap-2 justify-end">
            <button onClick={() => setEditingPost(false)} className="text-[10px] font-bold text-zinc-400 px-3 py-1">Avbryt</button>
            <button onClick={handleUpdatePost} className="text-[10px] font-bold bg-[#003366] text-white px-4 py-1 rounded-full">Spara</button>
          </div>
        </div>
      ) : (
        <p className="text-sm text-zinc-600 mb-3">{post.content}</p>
      )}

      <div className="flex gap-4 items-center pt-2 border-t border-zinc-50">
        <button onClick={handleLike} className={`text-[10px] font-bold uppercase flex items-center gap-1 ${userLikes ? 'text-[#a11a2d]' : 'text-zinc-400 hover:text-[#a11a2d]'}`}>
          <Heart size={10} className={userLikes || post.likes_count > 0 ? "fill-current" : ""} /> {post.likes_count || 0}
        </button>
        <button onClick={() => { setActiveCommentPost(!activeCommentPost); if(!activeCommentPost) fetchComments() }} className="text-[10px] font-bold text-zinc-400 hover:text-black uppercase flex items-center gap-1">
          <MessageSquare size={10} /> Kommentarer
        </button>
      </div>

      {activeCommentPost && (
        <div className="mt-4 space-y-3 pl-4 border-l-2 border-zinc-50">
          {comments.map((comment) => (
            <div key={comment.id} className="text-xs">
              <span className="font-bold text-black">{formatDisplayName(comment.user_name)}: </span>
              <span className="text-zinc-600">{comment.content}</span>
            </div>
          ))}
          <div className="flex gap-2 pt-2">
            <input value={commentContent} onChange={(e) => setCommentContent(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handlePostComment()} placeholder="Svara..." className="flex-1 bg-zinc-50 p-2 rounded-full text-xs text-black font-bold outline-none" />
            <button onClick={handlePostComment} className="text-zinc-400 hover:text-[#003366]"><Send size={14} /></button>
          </div>
        </div>
      )}
    </div>
  )
}
