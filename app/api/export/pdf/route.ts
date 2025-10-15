import { NextRequest, NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import type { Database } from '@/types/database'

export async function GET(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient<Database>({ cookies })
    const searchParams = request.nextUrl.searchParams
    const profileId = searchParams.get('profile_id')

    if (!profileId) {
      return NextResponse.json(
        { error: 'Profile ID is required' },
        { status: 400 }
      )
    }

    // Get the session
    const {
      data: { session },
    } = await supabase.auth.getSession()

    // Fetch profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*, users!inner(*)')
      .eq('id', profileId)
      .single()

    if (profileError || !profile) {
      return NextResponse.json(
        { error: 'Profile not found' },
        { status: 404 }
      )
    }

    // Check if user has access (owner or public profile)
    const hasAccess =
      profile.is_public ||
      (session && (profile as any).user_id === session.user.id)

    if (!hasAccess) {
      return NextResponse.json(
        { error: 'You do not have access to this profile' },
        { status: 403 }
      )
    }

    // Check if PDF service is available
    const pdfServiceUrl = process.env.PDF_SERVICE_URL
    if (!pdfServiceUrl) {
      return NextResponse.json(
        { error: 'PDF service not configured' },
        { status: 503 }
      )
    }

    // Call PDF generation service
    const response = await fetch(`${pdfServiceUrl}/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.PDF_SERVICE_API_KEY || ''}`,
      },
      body: JSON.stringify({
        profileId: profile.id,
        profileData: profile.data,
        user: (profile as any).users,
      }),
    })

    if (!response.ok) {
      throw new Error('PDF generation failed')
    }

    const pdfBuffer = await response.arrayBuffer()

    // Save export record
    await supabase.from('exports').insert({
      profile_id: profile.id,
      file_url: `data:application/pdf;base64,${Buffer.from(pdfBuffer).toString('base64')}`,
      type: 'pdf',
      status: 'success',
    })

    // Return PDF
    return new NextResponse(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="resume-${(profile as any).users.username}.pdf"`,
      },
    })
  } catch (error) {
    console.error('PDF export error:', error)
    return NextResponse.json(
      { error: 'Failed to generate PDF' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient<Database>({ cookies })
    const body = await request.json()
    const { profileId } = body

    if (!profileId) {
      return NextResponse.json(
        { error: 'Profile ID is required' },
        { status: 400 }
      )
    }

    // Get the session
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    // Fetch profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*, users!inner(*)')
      .eq('id', profileId)
      .eq('user_id', session.user.id)
      .single()

    if (profileError || !profile) {
      return NextResponse.json(
        { error: 'Profile not found' },
        { status: 404 }
      )
    }

    // Create export record
    const { data: exportRecord, error: exportError } = await supabase
      .from('exports')
      .insert({
        profile_id: profile.id,
        file_url: '',
        type: 'pdf',
        status: 'pending',
      })
      .select()
      .single()

    if (exportError) {
      throw exportError
    }

    // In production, this would trigger an async job
    // For now, return the export record
    return NextResponse.json({
      success: true,
      exportId: exportRecord.id,
      message: 'PDF generation started',
    })
  } catch (error) {
    console.error('PDF export error:', error)
    return NextResponse.json(
      { error: 'Failed to start PDF generation' },
      { status: 500 }
    )
  }
}

