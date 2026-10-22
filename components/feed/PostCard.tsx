'use client'

import { useState, useEffect, useCallback, useSyncExternalStore } from 'react'
import { createClient } from '@/utils/supabase/client'
import { formatDisplayName } from '@/utils/formatName'
import { Heart, MessageSquare, Loader2, Send, Trash2, Edit2, X, Check, Share2, Flag } from 'lucide-react'
import { toast } from 'sonner'
import { Post } from '@/types/database'
import UserAvatar from '../ui/UserAvatar'
import ReportModal from '../ui/ReportModal'
import SmartText from '../ui/SmartText'
import Link from 'next/link'
import { capitalizeFirst } from '@/utils/capitalize'
import { useTranslation } from '@/utils/translations'

interface PostCardProps {
  post: Post & { category?: string; avatar_url?: string | null }
  currentUser: PostCardUser | null
  onDelete: (id: string) => void
  onUpdate: () => void
}

interface PostCardUser {
  id: string
  email?: string
  user_metadata?: {
    full_name?: string
    avatar_url?: string
  }
}

interface PostComment {
  id: string
  user_id: string
  user_name: string
  content: string
  created_at: string
  likes_count: number
  edited: boolean
  avatar_url?: string | null
}

interface CommentProfile {
  id: string
  avatar_url: string | null
}

const CATEGORY_STYLES: Record<string, string> = {
  allmänt: 'bg-zinc-100 text-zinc-600',
  fråga: 'bg-blue-50 text-blue-700 border-blue-100',
  tips: 'bg-green-50 text-green-700 border-green-100',
  varning: 'bg-red-50 text-red-700 border-red-100',
  hjälp: 'bg-orange-50 text-orange-700 border-orange-100'
}

export default function PostCard({ post, currentUser, onDelete, onUpdate }: PostCardProps) {
  const { t } = useTranslation()
  const [loadingLikes, setLoadingLikes] = useState(false)
  const [activeCommentPost, setActiveCommentPost] = useState(false)
  const [commentContent, setCommentContent] = useState('')
  const [comments, setComments] = useState<PostComment[]>([])
  const [commentCount, setCommentCount] = useState(0)
  const [likeOverride, setLikeOverride] = useState<{ postId: string; baseline: number; count: number } | null>(null)
  const localLikes = likeOverride?.postId === post.id && likeOverride.baseline === (post.likes_count || 0)
    ? likeOverride.count
    : post.likes_count || 0

  const [editingPost, setEditingPost] = useState(false)
  const [editPostContent, setEditPostContent] = useState(post.content)

  const [editingComment, setEditingComment] = useState<string | null>(null)
  const [editCommentContent, setEditCommentContent] = useState('')

  const [reportModalOpen, setReportModalOpen] = useState(false)
  const [reportTarget, setReportTarget] = useState<{ id: string, type: 'post' | 'comment' } | null>(null)

  const supabase = createClient()

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: `Inlägg av ${post.user_name}`,
          text: post.content,
          url: window.location.href,
        })
      } else {
        await navigator.clipboard.writeText(window.location.href)
        toast.success(t.linkCopied)
      }
    } catch (err) {
      console.error('Share failed:', err)
    }
  }

  const openReport = (id: string, type: 'post' | 'comment') => {
    if (!currentUser) return toast.error('Logga in för att anmäla')
    setReportTarget({ id, type })
    setReportModalOpen(true)
  }

  const fetchComments = useCallback(async () => {
    const { data: commentsData, error: commentsError } = await supabase
      .from('comments')
      .select('*')
      .eq('post_id', post.id)
      .order('created_at', { ascending: true })

    if (!commentsError && commentsData) {
      const userIds = Array.from(new Set(commentsData.map(c => c.user_id)))
      const { data: profilesData } = await supabase
        .from('profiles')
        .select('id, avatar_url')
        .in('id', userIds)

      const profileMap = (profilesData || []).reduce<Record<string, string | null>>((acc, p: CommentProfile) => {
        acc[p.id] = p.avatar_url
        return acc
      }, {})

      const commentsWithProfiles: PostComment[] = commentsData.map(c => ({
        ...c,
        avatar_url: profileMap[c.user_id]
      }))

      setComments(commentsWithProfiles)
      setCommentCount(commentsData.length)
    }
  }, [supabase, post.id])

  useEffect(() => {
    const fetchCommentCount = async () => {
      const { count } = await supabase.from('comments').select('*', { count: 'exact', head: true }).eq('post_id', post.id)
      if (count !== null) setCommentCount(count)
    }
    fetchCommentCount()
  }, [post.id, supabase])

  const likedPostsKey = currentUser ? `polasve_liked_posts_${currentUser.id}` : 'polasve_liked_posts_guest'

  const subscribeToLikes = useCallback((onStoreChange: () => void) => {
    window.addEventListener('storage', onStoreChange)
    window.addEventListener('polasve-liked-posts-changed', onStoreChange)
    return () => {
      window.removeEventListener('storage', onStoreChange)
      window.removeEventListener('polasve-liked-posts-changed', onStoreChange)
    }
  }, [])

  const getUserLikesSnapshot = useCallback(() => {
    try {
      const stored = localStorage.getItem(likedPostsKey)
      return stored ? (JSON.parse(stored) as string[]).includes(post.id) : false
    } catch {
      return false
    }
  }, [likedPostsKey, post.id])
  const userLikes = useSyncExternalStore(subscribeToLikes, getUserLikesSnapshot, () => false)

  const updateLocalLikes = (nextCount: number | ((count: number) => number)) => {
    const currentCount = likeOverride?.postId === post.id && likeOverride.baseline === (post.likes_count || 0)
      ? likeOverride.count
      : post.likes_count || 0
    setLikeOverride({
      postId: post.id,
      baseline: post.likes_count || 0,
      count: typeof nextCount === 'function' ? nextCount(currentCount) : nextCount
    })
  }

  const handleLike = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (!currentUser) return toast.error('Logga in för att gilla inlägg')
    if (loadingLikes) return

    setLoadingLikes(true)

    let likedIds: string[] = []
    try {
      const stored = localStorage.getItem(likedPostsKey)
      if (stored) likedIds = JSON.parse(stored)
    } catch {
      likedIds = []
    }

    const alreadyLiked = likedIds.includes(post.id)

    if (alreadyLiked) {
      // UNLIKE
      const newLikesCount = Math.max(0, localLikes - 1)
      updateLocalLikes(newLikesCount)

      const updatedLikedIds = likedIds.filter(id => id !== post.id)
      try {
        localStorage.setItem(likedPostsKey, JSON.stringify(updatedLikedIds))
      } catch {}
      window.dispatchEvent(new Event('polasve-liked-posts-changed'))

      const { error } = await supabase
        .from('posts')
        .update({ likes_count: Math.max(0, (post.likes_count || 1) - 1) })
        .eq('id', post.id)

      if (error) {
        updateLocalLikes(prev => prev + 1)
        toast.error('Kunde inte ta bort gillning')
      } else {
        toast.success('Gillning borttagen')
        onUpdate()
      }
    } else {
      // LIKE
      const newLikesCount = localLikes + 1
      updateLocalLikes(newLikesCount)

      const updatedLikedIds = [...likedIds, post.id]
      try {
        localStorage.setItem(likedPostsKey, JSON.stringify(updatedLikedIds))
      } catch {}
      window.dispatchEvent(new Event('polasve-liked-posts-changed'))

      const { error } = await supabase
        .from('posts')
        .update({ likes_count: (post.likes_count || 0) + 1 })
        .eq('id', post.id)

      if (error) {
        updateLocalLikes(prev => Math.max(0, prev - 1))
        toast.error('Kunde inte gilla inlägget')
      } else {
        toast.success('Du gillade inlägget! ❤️')
        onUpdate()
      }
    }

    setLoadingLikes(false)
  }

  const handlePostComment = async () => {
    if (!commentContent.trim() || !currentUser) return
    const { error } = await supabase.from('comments').insert([{
      post_id: post.id,
      user_id: currentUser.id,
      user_name: currentUser.user_metadata?.full_name || currentUser.email?.split('@')[0],
      content: capitalizeFirst(commentContent)
    }])
    if (!error) {
      setCommentContent(''); fetchComments(); onUpdate(); toast.success('Kommentar skickad')
    }
  }

  const handleUpdatePost = async () => {
    const { error } = await supabase.from('posts').update({ content: capitalizeFirst(editPostContent), edited: true }).eq('id', post.id)
    if (!error) { setEditingPost(false); onUpdate(); toast.success('Inlägg uppdaterat') }
  }

  const handleUpdateComment = async (commentId: string) => {
    const { error } = await supabase.from('comments').update({ content: capitalizeFirst(editCommentContent), edited: true }).eq('id', commentId)
    if (!error) { setEditingComment(null); fetchComments(); toast.success('Kommentar uppdaterad') }
  }

  const handleDeleteComment = async (commentId: string) => {
    if (!confirm('Ta bort kommentaren?')) return
    const { error } = await supabase.from('comments').delete().eq('id', commentId)
    if (!error) { fetchComments(); toast.success('Borttagen') }
  }

  return (
    <div className="w-full max-w-full overflow-hidden bg-white border border-zinc-100 p-3 md:p-4 rounded-sm shadow-sm group text-left">
      <div className="flex justify-between items-start gap-3 mb-3">
        <div className="flex items-center gap-2 md:gap-2.5 min-w-0 flex-1">
          <UserAvatar
            avatarUrl={post.avatar_url}
            userId={post.user_id}
            userName={post.user_name}
            size="sm"
          />
          <div>
            <div className="flex items-center gap-1.5 md:gap-2">
              <Link href={`/profil/${post.user_id}`} className="hover:underline">
                <span className="font-pacifico text-[13px] md:text-sm text-[#003366] tracking-normal">{formatDisplayName(post.user_name)}</span>
              </Link>
              {post.category && (
                <span className={`text-[7px] md:text-[8px] font-black uppercase px-1.5 md:px-2 py-0.5 rounded-full border ${CATEGORY_STYLES[post.category] || CATEGORY_STYLES.allmänt}`}>
                  {post.category}
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-[8px] md:text-[9px] text-zinc-400 font-bold">{new Date(post.created_at).toLocaleDateString()}</span>
              {post.edited && <span className="text-[7px] md:text-[8px] text-zinc-300 italic">{t.edited}</span>}
            </div>
          </div>
        </div>
        {currentUser?.id === post.user_id && !editingPost && (
          <div className="flex gap-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
            <button onClick={() => { setEditingPost(true); setEditPostContent(post.content) }} className="text-zinc-400 hover:text-blue-600 transition-colors p-1" title={t.edit}><Edit2 size={13} /></button>
            <button onClick={() => onDelete(post.id)} className="text-zinc-400 hover:text-red-800 transition-colors p-1" title={t.delete}><Trash2 size={13} /></button>
          </div>
        )}
      </div>

      {editingPost ? (
        <div className="space-y-2 mt-2">
          <textarea value={editPostContent} onChange={(e) => setEditPostContent(e.target.value)} className="w-full border border-[#003366]/30 p-3 text-sm text-zinc-900 rounded-sm font-bold outline-none" rows={3} autoFocus />
          <div className="flex gap-2 justify-end">
            <button onClick={() => setEditingPost(false)} className="text-[10px] font-black text-zinc-400 px-3 py-1 uppercase tracking-widest">{t.cancel}</button>
            <button onClick={handleUpdatePost} className="text-[10px] font-black bg-[#003366] text-white px-4 py-1.5 rounded-sm uppercase tracking-widest shadow-md">{t.save}</button>
          </div>
        </div>
      ) : (
        <SmartText text={post.content} className="text-sm text-zinc-800 font-medium mb-4 leading-relaxed px-1 break-words overflow-hidden max-w-full whitespace-pre-wrap" />
      )}

      <div className="flex items-center gap-3 sm:gap-6 pt-3 border-t border-zinc-50 min-w-0">
        <button
          onClick={handleLike}
          disabled={loadingLikes}
          className={`flex items-center gap-1.5 transition-colors ${userLikes ? 'text-[#a11a2d]' : 'text-zinc-400 hover:text-[#a11a2d]'}`}
          title={userLikes ? 'Klicka för att ångra gillning' : 'Klicka för att gilla inlägget'}
        >
          {loadingLikes ? (
            <Loader2 size={12} className="animate-spin" />
          ) : (
            <Heart size={15} className={userLikes ? 'fill-[#a11a2d] text-[#a11a2d]' : ''} />
          )}
          <span className="text-xs font-black">{localLikes}</span>
        </button>
        <button
          onClick={() => {
            const shouldOpen = !activeCommentPost
            setActiveCommentPost(shouldOpen)
            if (shouldOpen) void fetchComments()
          }}
          className={`flex items-center gap-1.5 transition-colors ${activeCommentPost ? 'text-[#003366]' : 'text-zinc-400 hover:text-black'}`}
        >
          <MessageSquare size={15} className="scale-x-[-1]" />
          <span className="text-xs font-black">{commentCount}</span>
        </button>
        <button onClick={handleShare} className="flex items-center gap-1.5 text-zinc-400 hover:text-[#003366] transition-colors">
          <Share2 size={15} />
          <span className="text-[10px] font-black uppercase tracking-widest hidden sm:inline">{t.share}</span>
        </button>
        <button onClick={() => openReport(post.id, 'post')} className="flex items-center gap-1.5 text-zinc-300 hover:text-[#a11a2d] transition-colors ml-auto">
          <Flag size={14} />
          <span className="text-[10px] font-black uppercase tracking-widest hidden sm:inline">{t.report}</span>
        </button>
      </div>

      <ReportModal
        isOpen={reportModalOpen}
        onClose={() => setReportModalOpen(false)}
        contentId={reportTarget?.id || ''}
        contentType={reportTarget?.type || 'post'}
        reporterId={currentUser?.id}
      />

      {activeCommentPost && (
        <div className="mt-4 space-y-4 pl-3 md:pl-4 border-l-2 border-zinc-100 animate-in fade-in slide-in-from-top-1">
          {comments.length > 0 && (
            <div className="space-y-4 mb-4 max-h-[350px] overflow-y-auto pr-2 scrollbar-hide">
              {comments.map((comment) => (
                <div key={comment.id} className="group/comment">
                  <div className="flex items-start gap-2.5 mb-1">
                    <UserAvatar
                      avatarUrl={comment.avatar_url}
                      userId={comment.user_id}
                      userName={comment.user_name}
                      size="xs"
                      className="mt-0.5"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start text-xs">
                        <Link href={`/profil/${comment.user_id}`} className="hover:underline">
                          <span className="font-pacifico text-[#003366] tracking-normal">{formatDisplayName(comment.user_name)} {comment.edited && <span className="font-sans font-normal text-[8px] text-zinc-300 italic lowercase ml-1">{t.edited}</span>}</span>
                        </Link>
                        <div className="flex gap-2">
                          {currentUser?.id === comment.user_id && !editingComment && (
                            <div className="flex gap-2 opacity-0 group-hover/comment:opacity-100 transition-opacity">
                              <button onClick={() => { setEditingComment(comment.id); setEditCommentContent(comment.content) }} className="text-zinc-300 hover:text-blue-600"><Edit2 size={10} /></button>
                              <button onClick={() => handleDeleteComment(comment.id)} className="text-zinc-300 hover:text-red-800"><Trash2 size={10} /></button>
                            </div>
                          )}
                          <button onClick={() => openReport(comment.id, 'comment')} className="text-zinc-200 hover:text-[#a11a2d] transition-colors opacity-0 group-hover/comment:opacity-100">
                            <Flag size={10} />
                          </button>
                        </div>
                      </div>
                      {editingComment === comment.id ? (
                        <div className="flex gap-2 mt-1">
                          <input value={editCommentContent} onChange={(e) => setEditCommentContent(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleUpdateComment(comment.id)} className="flex-1 border border-[#003366]/30 text-xs text-black p-2 font-bold outline-none rounded-sm" autoFocus />
                          <button onClick={() => handleUpdateComment(comment.id)} className="text-[#003366] p-1"><Check size={14} /></button>
                          <button onClick={() => setEditingComment(null)} className="text-zinc-400 p-1"><X size={14} /></button>
                        </div>
                      ) : (
                        <SmartText text={comment.content} className="text-xs text-zinc-700 font-medium leading-normal bg-zinc-50/50 p-2.5 rounded-sm border border-zinc-100/50 break-words overflow-hidden max-w-full" />
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="flex gap-2 pt-4 border-t border-zinc-50 items-center min-w-0">
            <UserAvatar
              avatarUrl={currentUser?.user_metadata?.avatar_url}
              userId={currentUser?.id}
              userName={currentUser?.user_metadata?.full_name}
              size="xs"
            />
            <input value={commentContent} onChange={(e) => setCommentContent(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handlePostComment()} placeholder={t.writeReply} className="flex-1 min-w-0 bg-zinc-100 border border-zinc-200 py-3 px-4 sm:px-5 rounded-full text-sm text-black font-bold outline-none focus:border-[#003366] placeholder:text-zinc-400 placeholder:font-normal h-11 w-full" />
            <button onClick={handlePostComment} className="shrink-0 text-[#003366] hover:text-[#a11a2d] transition-all p-2 active:scale-90" aria-label={t.sendComment}><Send size={20} /></button>
          </div>
        </div>
      )}
    </div>
  )
}
