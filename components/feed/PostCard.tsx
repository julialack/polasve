'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'
import { formatDisplayName } from '@/utils/formatName'
import { Heart, MessageSquare, Loader2, Send, Trash2, Edit2, X, Check, Tag } from 'lucide-react'
import { toast } from 'sonner'
import { Post, Comment } from '@/types/database'

interface PostCardProps {
  post: Post & { category?: string }
  currentUser: any
  onDelete: (id: string) => void
  onUpdate: () => void
}

const CATEGORY_STYLES: Record<string, string> = {
  allmänt: 'bg-zinc-100 text-zinc-600',
  fråga: 'bg-blue-50 text-blue-700 border-blue-100',
  tips: 'bg-green-50 text-green-700 border-green-100',
  varning: 'bg-red-50 text-red-700 border-red-100',
  hjälp: 'bg-orange-50 text-orange-700 border-orange-100'
}

export default function PostCard({ post, currentUser, onDelete, onUpdate }: PostCardProps) {
  const [loadingLikes, setLoadingLikes] = useState(false)
  const [activeCommentPost, setActiveCommentPost] = useState(false)
  const [commentContent, setCommentContent] = useState('')
  const [comments, setComments] = useState<Comment[]>([])
  const [commentCount, setCommentCount] = useState(0)
  const [userLikes, setUserLikes] = useState(false)

  const [editingPost, setEditingPost] = useState(false)
  const [editPostContent, setEditPostContent] = useState(post.content)

  const [editingComment, setEditingComment] = useState<string | null>(null)
  const [editCommentContent, setEditCommentContent] = useState('')
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)

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

  useEffect(() => {
    let mounted = true
    const tryLoadAvatar = async () => {
      if (!post?.user_id) return
      try {
        const { data: listData, error: listError } = await supabase.storage.from('avatars').list('', { search: post.user_id })
        if (!listError && listData && listData.length > 0 && mounted) {
          const { data: urlData } = supabase.storage.from('avatars').getPublicUrl(listData[0].name)
          if (urlData && urlData.publicUrl) setAvatarUrl(urlData.publicUrl)
        }
      } catch { /* ignore */ }
    }
    tryLoadAvatar()
    return () => { mounted = false }
  }, [post?.user_id])

  useEffect(() => {
    const fetchCommentCount = async () => {
      const { count } = await supabase.from('comments').select('*', { count: 'exact', head: true }).eq('post_id', post.id)
      if (count !== null) setCommentCount(count)
    }
    fetchCommentCount()
  }, [post.id])

  useEffect(() => {
    if (activeCommentPost) fetchComments()
  }, [activeCommentPost])

  const handleLike = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (!currentUser) return toast.error('Logga in för att gilla')
    if (userLikes) return

    setLoadingLikes(true)
    const { error } = await supabase.from('posts').update({ likes_count: (post.likes_count || 0) + 1 }).eq('id', post.id)

    if (!error) {
      setUserLikes(true)
      onUpdate()
      toast.success('Inlägg gillat')
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
      setCommentContent(''); fetchComments(); onUpdate(); toast.success('Kommentar skickad')
    }
  }

  const handleUpdatePost = async () => {
    const { error } = await supabase.from('posts').update({ content: editPostContent, edited: true }).eq('id', post.id)
    if (!error) { setEditingPost(false); onUpdate(); toast.success('Inlägg uppdaterat') }
  }

  const handleUpdateComment = async (commentId: string) => {
    const { error } = await supabase.from('comments').update({ content: editCommentContent, edited: true }).eq('id', commentId)
    if (!error) { setEditingComment(null); fetchComments(); toast.success('Kommentar uppdaterad') }
  }

  const handleDeleteComment = async (commentId: string) => {
    if (!confirm('Ta bort kommentaren?')) return
    const { error } = await supabase.from('comments').delete().eq('id', commentId)
    if (!error) { fetchComments(); toast.success('Borttagen') }
  }

  return (
    <div className="bg-white border border-zinc-100 p-4 rounded-sm shadow-sm group text-left">
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-zinc-100 flex items-center justify-center overflow-hidden border border-zinc-50 shadow-inner">
            {avatarUrl ? (
              <img src={avatarUrl} alt="" className="w-full h-full object-cover" />
            ) : (
              <span className="text-[10px] font-black text-zinc-400">{post.user_name?.[0]?.toUpperCase()}</span>
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-pacifico text-sm text-[#003366] tracking-normal">{formatDisplayName(post.user_name)}</span>
              {post.category && (
                <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded-full border ${CATEGORY_STYLES[post.category] || CATEGORY_STYLES.allmänt}`}>
                  {post.category}
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-[9px] text-zinc-400 font-bold">{new Date(post.created_at).toLocaleDateString()}</span>
              {post.edited && <span className="text-[8px] text-zinc-300 italic">(redigerad)</span>}
            </div>
          </div>
        </div>
        {currentUser?.id === post.user_id && !editingPost && (
          <div className="flex gap-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
            <button onClick={() => { setEditingPost(true); setEditPostContent(post.content) }} className="text-zinc-400 hover:text-blue-600 transition-colors p-1"><Edit2 size={13} /></button>
            <button onClick={() => onDelete(post.id)} className="text-zinc-400 hover:text-red-800 transition-colors p-1"><Trash2 size={13} /></button>
          </div>
        )}
      </div>

      {editingPost ? (
        <div className="space-y-2 mt-2">
          <textarea value={editPostContent} onChange={(e) => setEditPostContent(e.target.value)} className="w-full border border-[#003366]/30 p-3 text-sm text-zinc-900 rounded-sm font-bold outline-none" rows={3} autoFocus />
          <div className="flex gap-2 justify-end">
            <button onClick={() => setEditingPost(false)} className="text-[10px] font-black text-zinc-400 px-3 py-1 uppercase tracking-widest">Avbryt</button>
            <button onClick={handleUpdatePost} className="text-[10px] font-black bg-[#003366] text-white px-4 py-1.5 rounded-sm uppercase tracking-widest shadow-md">Spara</button>
          </div>
        </div>
      ) : (
        <p className="text-sm text-zinc-800 font-medium mb-4 leading-relaxed px-1">{post.content}</p>
      )}

      <div className="flex gap-6 items-center pt-3 border-t border-zinc-50">
        <button onClick={handleLike} disabled={loadingLikes || userLikes} className={`flex items-center gap-1.5 transition-colors ${userLikes ? 'text-[#a11a2d]' : 'text-zinc-400 hover:text-[#a11a2d]'}`}>
          {loadingLikes ? <Loader2 size={12} className="animate-spin" /> : <Heart size={15} className={userLikes || post.likes_count > 0 ? "fill-current" : ""} />}
          <span className="text-xs font-black">{post.likes_count || 0}</span>
        </button>
        <button onClick={() => setActiveCommentPost(!activeCommentPost)} className={`flex items-center gap-1.5 transition-colors ${activeCommentPost ? 'text-[#003366]' : 'text-zinc-400 hover:text-black'}`}>
          <MessageSquare size={15} className="scale-x-[-1]" />
          <span className="text-xs font-black">{commentCount}</span>
        </button>
      </div>

      {activeCommentPost && (
        <div className="mt-4 space-y-4 pl-4 border-l-2 border-zinc-100 animate-in fade-in slide-in-from-top-1">
          {comments.length > 0 && (
            <div className="space-y-4 mb-4 max-h-60 overflow-y-auto pr-2 scrollbar-hide">
              {comments.map((comment) => (
                <div key={comment.id} className="group/comment">
                  <div className="flex justify-between items-start mb-1 text-xs">
                    <span className="font-pacifico text-[#003366] tracking-normal">{formatDisplayName(comment.user_name)} {comment.edited && <span className="font-sans font-normal text-[8px] text-zinc-300 italic lowercase ml-1">(redigerad)</span>}</span>
                    {currentUser?.id === comment.user_id && !editingComment && (
                      <div className="flex gap-2 opacity-0 group-hover/comment:opacity-100 transition-opacity">
                        <button onClick={() => { setEditingComment(comment.id); setEditCommentContent(comment.content) }} className="text-zinc-300 hover:text-blue-600"><Edit2 size={10} /></button>
                        <button onClick={() => handleDeleteComment(comment.id)} className="text-zinc-300 hover:text-red-800"><Trash2 size={10} /></button>
                      </div>
                    )}
                  </div>
                  {editingComment === comment.id ? (
                    <div className="flex gap-2 mt-1">
                      <input value={editCommentContent} onChange={(e) => setEditCommentContent(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleUpdateComment(comment.id)} className="flex-1 border border-[#003366]/30 text-xs text-black p-2 font-bold outline-none rounded-sm" autoFocus />
                      <button onClick={() => handleUpdateComment(comment.id)} className="text-[#003366] p-1"><Check size={14} /></button>
                      <button onClick={() => setEditingComment(null)} className="text-zinc-400 p-1"><X size={14} /></button>
                    </div>
                  ) : (
                    <p className="text-xs text-zinc-700 font-medium leading-normal bg-zinc-50/50 p-2.5 rounded-sm border border-zinc-100/50">{comment.content}</p>
                  )}
                </div>
              ))}
            </div>
          )}

          <div className="flex gap-2 pt-2 border-t border-zinc-50">
            <input value={commentContent} onChange={(e) => setCommentContent(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handlePostComment()} placeholder="Skriv ett svar..." className="flex-1 bg-zinc-100 border border-zinc-200 p-2.5 px-5 rounded-full text-xs text-black font-black outline-none focus:border-[#003366] placeholder:text-zinc-400 placeholder:font-normal" />
            <button onClick={handlePostComment} className="text-[#003366] hover:text-[#a11a2d] transition-all p-2 active:scale-90"><Send size={18} /></button>
          </div>
        </div>
      )}
    </div>
  )
}
