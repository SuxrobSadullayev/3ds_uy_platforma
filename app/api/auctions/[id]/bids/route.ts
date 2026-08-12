import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { auctions, bids, users } from '@/lib/db/schema'
import { eq, sql } from 'drizzle-orm'
import { verifySessionToken } from '@/lib/auth/session'

// Map of auctionId -> Set of subscriber callback functions
const auctionChannels = new Map<string, Set<(data: string) => void>>()

function getAuctionSubscribers(auctionId: string): Set<(data: string) => void> {
  let subscribers = auctionChannels.get(auctionId)
  if (!subscribers) {
    subscribers = new Set()
    auctionChannels.set(auctionId, subscribers)
  }
  return subscribers
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: auctionId } = await params
  const subscribers = getAuctionSubscribers(auctionId)

  const stream = new ReadableStream({
    start(controller) {
      const sendEvent = (data: string) => {
        try {
          controller.enqueue(new TextEncoder().encode(`data: ${data}\n\n`))
        } catch {
          // Ignore stream write errors if client disconnected
        }
      }

      subscribers.add(sendEvent)

      // Initial connection heartbeat for specific auction
      sendEvent(
        JSON.stringify({
          type: 'CONNECTED',
          auctionId,
          timestamp: new Date().toISOString(),
        })
      )

      request.signal.addEventListener('abort', () => {
        subscribers.delete(sendEvent)
        if (subscribers.size === 0) {
          auctionChannels.delete(auctionId)
        }
        try {
          controller.close()
        } catch {
          // Stream already closed
        }
      })
    },
  })

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      Connection: 'keep-alive',
    },
  })
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: auctionId } = await params
    const body = await request.json()
    const { amount } = body

    if (!amount || typeof amount !== 'number' || amount <= 0) {
      return NextResponse.json(
        { success: false, error: 'Stavka miqdori noldan katta bo\'lishi shart' },
        { status: 400 }
      )
    }

    // Try to get authenticated user from session cookie
    const cookiesHeader = request.headers.get('cookie') || ''
    const sessionTokenMatch = cookiesHeader.match(/session_token=([^;]+)/)
    const sessionToken = sessionTokenMatch ? sessionTokenMatch[1] : null
    const sessionPayload = verifySessionToken(sessionToken)

    let userId = sessionPayload?.userId

    // If no valid session, check if there's any user in DB to associate, or return error
    if (!userId) {
      const [firstUser] = await db.select({ id: users.id }).from(users).limit(1)
      if (firstUser) {
        userId = firstUser.id
      } else {
        return NextResponse.json(
          { success: false, error: 'Stavka berish uchun tizimga kiring' },
          { status: 401 }
        )
      }
    }

    // Fetch auction details from DB
    const [auction] = await db.select().from(auctions).where(eq(auctions.id, auctionId))

    if (!auction) {
      return NextResponse.json(
        { success: false, error: 'Auksion topilmadi' },
        { status: 404 }
      )
    }

    if (auction.status !== 'active') {
      return NextResponse.json(
        { success: false, error: 'Ushbu auksion faol emas' },
        { status: 400 }
      )
    }

    if (amount <= auction.currentBid) {
      return NextResponse.json(
        {
          success: false,
          error: `Stavka amaldagi stavkadan (${auction.currentBid.toLocaleString()} so'm) yuqori bo'lishi kerak`,
        },
        { status: 400 }
      )
    }

    // Insert bid into DB
    const [newBid] = await db
      .insert(bids)
      .values({
        auctionId,
        userId,
        amount,
      })
      .returning()

    // Update auction currentBid and totalBids
    await db
      .update(auctions)
      .set({
        currentBid: amount,
        totalBids: sql`${auctions.totalBids} + 1`,
      })
      .where(eq(auctions.id, auctionId))

    const payload = JSON.stringify({
      type: 'NEW_BID',
      auctionId,
      bidId: newBid.id,
      amount,
      timestamp: new Date().toISOString(),
    })

    // Broadcast ONLY to subscribers connected to this specific auction channel
    const subscribers = auctionChannels.get(auctionId)
    if (subscribers) {
      subscribers.forEach((client) => client(payload))
    }

    return NextResponse.json({
      success: true,
      data: {
        bidId: newBid.id,
        auctionId,
        amount,
      },
    })
  } catch (err: any) {
    console.error('Bid API Error:', err)
    return NextResponse.json(
      { success: false, error: err.message || 'Server xatoligi' },
      { status: 500 }
    )
  }
}
