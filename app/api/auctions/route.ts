import { NextResponse } from 'next/server'
import { auctions as mockAuctions } from '@/lib/data/auctions'
import { db } from '@/lib/db'
import { auctions, bids } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

export async function GET() {
  try {
    try {
      const activeAuctions = await db.select().from(auctions).where(eq(auctions.status, 'active'))
      return NextResponse.json({ success: true, data: activeAuctions })
    } catch {
      return NextResponse.json({ success: true, data: mockAuctions, isFallback: true })
    }
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { auctionId, amount, userId = 'user-demo-id' } = body

    if (!auctionId || !amount || amount <= 0) {
      return NextResponse.json(
        { success: false, error: 'Auktsion ID va stavka miqdori ko\'rsatilishi shart' },
        { status: 400 }
      )
    }

    try {
      // Find auction in DB
      const [auction] = await db.select().from(auctions).where(eq(auctions.id, auctionId))

      if (auction && amount <= auction.currentBid) {
        return NextResponse.json(
          { success: false, error: 'Stavka joriy stavkadan yuqori bo\'lishi shart' },
          { status: 400 }
        )
      }

      if (auction) {
        // Record bid
        await db.insert(bids).values({
          auctionId,
          userId,
          amount,
        })

        // Update auction current bid
        const [updated] = await db
          .update(auctions)
          .set({
            currentBid: amount,
            totalBids: auction.totalBids + 1,
          })
          .where(eq(auctions.id, auctionId))
          .returning()

        return NextResponse.json({ success: true, data: updated })
      }
    } catch {
      // Offline simulation response
      return NextResponse.json({
        success: true,
        data: {
          auctionId,
          currentBid: amount,
          time: new Date().toISOString(),
        },
        isFallback: true,
      })
    }

    return NextResponse.json({ success: true, message: 'Stavka qabul qilindi', currentBid: amount })
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 })
  }
}
