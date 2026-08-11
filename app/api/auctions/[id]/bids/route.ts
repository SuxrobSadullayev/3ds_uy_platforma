import { NextResponse } from 'next/server'

// In-memory SSE subscribers set for real-time auction live bidding
const clients = new Set<(data: string) => void>()

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: auctionId } = await params

  const stream = new ReadableStream({
    start(controller) {
      const sendEvent = (data: string) => {
        controller.enqueue(new TextEncoder().encode(`data: ${data}\n\n`))
      }

      clients.add(sendEvent)

      // Send initial heartbeat
      sendEvent(
        JSON.stringify({
          type: 'CONNECTED',
          auctionId,
          timestamp: new Date().toISOString(),
        })
      )

      request.signal.addEventListener('abort', () => {
        clients.delete(sendEvent)
        controller.close()
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
    const { bidder = 'Ishtirokchi #849', amount } = body

    if (!amount || amount <= 0) {
      return NextResponse.json(
        { success: false, error: 'Stavka miqdori ko\'rsatilmadi' },
        { status: 400 }
      )
    }

    const payload = JSON.stringify({
      type: 'NEW_BID',
      auctionId,
      bidder,
      amount,
      timestamp: new Date().toISOString(),
    })

    // Broadcast event to all SSE subscribers
    clients.forEach((client) => client(payload))

    return NextResponse.json({ success: true, data: { auctionId, bidder, amount } })
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || 'Server error' },
      { status: 500 }
    )
  }
}
