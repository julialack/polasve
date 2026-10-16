import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import { createAdminClient } from '@/lib/supabase-admin'

const ADMIN_EMAIL = 'julia.lackchristensen@gmail.com'

export async function POST(req: Request) {
  const supabase = await createClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    return NextResponse.json({ error: 'Du måste vara inloggad.' }, { status: 401 })
  }

  if (user.email !== ADMIN_EMAIL) {
    return NextResponse.json({ error: 'Behörighet saknas. Endast administratör har tillgång.' }, { status: 403 })
  }

  const adminSupabase = createAdminClient()
  if (!adminSupabase) {
    return NextResponse.json(
      { error: 'Serverkonfiguration saknas. Kontrollera SUPABASE_SERVICE_ROLE_KEY.' },
      { status: 500 }
    )
  }

  let body: any
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Ogiltigt JSON-format.' }, { status: 400 })
  }

  const { action, payload } = body || {}

  try {
    switch (action) {
      case 'delete_ad': {
        const { adId, permanent } = payload || {}
        if (!adId) return NextResponse.json({ error: 'Annons-ID saknas' }, { status: 400 })

        if (permanent) {
          const { error } = await adminSupabase.from('ads').delete().eq('id', adId)
          if (error) throw error
          return NextResponse.json({ success: true, message: 'Annons raderad permanent' })
        } else {
          const { error } = await adminSupabase.from('ads').update({ status: 'finished' }).eq('id', adId)
          if (error) throw error
          return NextResponse.json({ success: true, message: 'Annons flyttad till borttagna/avslutade' })
        }
      }

      case 'restore_ad': {
        const { adId } = payload || {}
        if (!adId) return NextResponse.json({ error: 'Annons-ID saknas' }, { status: 400 })

        const { error } = await adminSupabase.from('ads').update({ status: 'active' }).eq('id', adId)
        if (error) throw error
        return NextResponse.json({ success: true, message: 'Annons återaktiverad' })
      }

      case 'mark_ad_paid': {
        const { adId } = payload || {}
        if (!adId) return NextResponse.json({ error: 'Annons-ID saknas' }, { status: 400 })

        const { error } = await adminSupabase.from('ads').update({ payment_status: 'paid' }).eq('id', adId)
        if (error) throw error
        return NextResponse.json({ success: true, message: 'Betalning godkänd manuellt' })
      }

      case 'delete_post': {
        const { postId } = payload || {}
        if (!postId) return NextResponse.json({ error: 'Inläggs-ID saknas' }, { status: 400 })

        // Delete comments first if foreign key requires it, or delete post directly
        await adminSupabase.from('comments').delete().eq('post_id', postId)
        const { error } = await adminSupabase.from('posts').delete().eq('id', postId)
        if (error) throw error
        return NextResponse.json({ success: true, message: 'Inlägg och dess kommentarer raderade permanent' })
      }

      case 'toggle_ban_user': {
        const { userId, isBanned } = payload || {}
        if (!userId) return NextResponse.json({ error: 'Användar-ID saknas' }, { status: 400 })

        const { error } = await adminSupabase.from('profiles').update({ is_banned: !isBanned }).eq('id', userId)
        if (error) throw error
        return NextResponse.json({
          success: true,
          message: !isBanned ? 'Användare har stängts av' : 'Användare har återställts'
        })
      }

      case 'handle_report': {
        const { reportId, status } = payload || {}
        if (!reportId || !status) return NextResponse.json({ error: 'Data saknas' }, { status: 400 })

        const { error } = await adminSupabase.from('reports').update({ status }).eq('id', reportId)
        if (error) throw error
        return NextResponse.json({ success: true, message: 'Anmälan uppdaterad' })
      }

      case 'delete_report_content': {
        const { reportId, contentType, contentId } = payload || {}
        if (!reportId || !contentType || !contentId) {
          return NextResponse.json({ error: 'Ogiltiga parametrar' }, { status: 400 })
        }

        if (contentType === 'ad') {
          await adminSupabase.from('ads').delete().eq('id', contentId)
        } else if (contentType === 'post') {
          await adminSupabase.from('comments').delete().eq('post_id', contentId)
          await adminSupabase.from('posts').delete().eq('id', contentId)
        }

        await adminSupabase.from('reports').update({ status: 'resolved' }).eq('id', reportId)
        return NextResponse.json({ success: true, message: 'Innehåll raderat och anmälan åtgärdad' })
      }

      case 'add_announcement': {
        const { title, content } = payload || {}
        if (!title || !content) return NextResponse.json({ error: 'Titel och innehåll krävs' }, { status: 400 })

        const { error } = await adminSupabase.from('announcements').insert([{ title, content }])
        if (error) throw error
        return NextResponse.json({ success: true, message: 'Meddelande publicerat' })
      }

      case 'delete_announcement': {
        const { id } = payload || {}
        if (!id) return NextResponse.json({ error: 'ID saknas' }, { status: 400 })

        const { error } = await adminSupabase.from('announcements').delete().eq('id', id)
        if (error) throw error
        return NextResponse.json({ success: true, message: 'Meddelande borttaget' })
      }

      case 'add_category': {
        const { name, slug } = payload || {}
        if (!name) return NextResponse.json({ error: 'Namn krävs' }, { status: 400 })

        const categorySlug = slug || name.toLowerCase().replace(/ /g, '-').replace(/[^a-z0-9-]/g, '')
        const { error } = await adminSupabase.from('site_categories').insert([{ name, slug: categorySlug }])
        if (error) throw error
        return NextResponse.json({ success: true, message: 'Kategori tillagd' })
      }

      case 'delete_category': {
        const { id } = payload || {}
        if (!id) return NextResponse.json({ error: 'ID saknas' }, { status: 400 })

        const { error } = await adminSupabase.from('site_categories').delete().eq('id', id)
        if (error) throw error
        return NextResponse.json({ success: true, message: 'Kategori borttagen' })
      }

      case 'approve_name_change': {
        const { reqId, userId, requestedName } = payload || {}
        if (!reqId || !userId || !requestedName) return NextResponse.json({ error: 'Data saknas' }, { status: 400 })

        await adminSupabase.from('profiles').update({ full_name: requestedName }).eq('id', userId)
        await adminSupabase.from('name_change_requests').update({ status: 'approved' }).eq('id', reqId)
        return NextResponse.json({ success: true, message: 'Namnändring godkänd' })
      }

      case 'reject_name_change': {
        const { reqId } = payload || {}
        if (!reqId) return NextResponse.json({ error: 'ID saknas' }, { status: 400 })

        await adminSupabase.from('name_change_requests').update({ status: 'rejected' }).eq('id', reqId)
        return NextResponse.json({ success: true, message: 'Namnändring nekad' })
      }

      case 'add_news': {
        const { title, description, image_url } = payload || {}
        if (!title || !description) return NextResponse.json({ error: 'Titel och beskrivning krävs' }, { status: 400 })

        const { error } = await adminSupabase.from('news').insert([{
          title,
          description,
          image_url: image_url || 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=800&auto=format&fit=crop',
          date: new Date().toLocaleDateString('sv-SE', { day: 'numeric', month: 'long', year: 'numeric' })
        }])
        if (error) throw error
        return NextResponse.json({ success: true, message: 'Nyhet publicerad' })
      }

      case 'delete_news': {
        const { id } = payload || {}
        if (!id) return NextResponse.json({ error: 'ID saknas' }, { status: 400 })

        const { error } = await adminSupabase.from('news').delete().eq('id', id)
        if (error) throw error
        return NextResponse.json({ success: true, message: 'Nyhet raderad' })
      }

      case 'handle_contact': {
        const { reqId, deleteItem } = payload || {}
        if (!reqId) return NextResponse.json({ error: 'ID saknas' }, { status: 400 })

        if (deleteItem) {
          const { error } = await adminSupabase.from('contact_requests').delete().eq('id', reqId)
          if (error) throw error
          return NextResponse.json({ success: true, message: 'Kontaktförfrågan raderad' })
        } else {
          const { error } = await adminSupabase.from('contact_requests').update({ status: 'handled' }).eq('id', reqId)
          if (error) throw error
          return NextResponse.json({ success: true, message: 'Kontaktförfrågan hanterad' })
        }
      }

      default:
        return NextResponse.json({ error: 'Okänd åtgärd' }, { status: 400 })
    }
  } catch (err: any) {
    console.error('Admin API error:', err)
    return NextResponse.json({ error: err.message || 'Ett fel uppstod vid adminåtgärd' }, { status: 500 })
  }
}
