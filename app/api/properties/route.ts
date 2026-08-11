import { NextResponse } from 'next/server'
import { propertySchema } from '@/lib/validations/property'
import { properties as mockProperties } from '@/lib/data/properties'
import { db } from '@/lib/db'
import { properties } from '@/lib/db/schema'
import { eq, and, gte, lte } from 'drizzle-orm'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type')
    const region = searchParams.get('region')
    const rooms = searchParams.get('rooms')
    const minPrice = searchParams.get('minPrice')
    const maxPrice = searchParams.get('maxPrice')
    const page = Math.max(1, Number(searchParams.get('page')) || 1)
    const limit = Math.max(1, Math.min(50, Number(searchParams.get('limit')) || 12))
    const offset = (page - 1) * limit

    try {
      // Attempt database query
      const whereConditions = []
      if (type) whereConditions.push(eq(properties.type, type as any))
      if (region) whereConditions.push(eq(properties.region, region))
      if (rooms) whereConditions.push(eq(properties.rooms, Number(rooms)))
      if (minPrice) whereConditions.push(gte(properties.price, Number(minPrice)))
      if (maxPrice) whereConditions.push(lte(properties.price, Number(maxPrice)))

      const result = await db
        .select()
        .from(properties)
        .where(whereConditions.length > 0 ? and(...whereConditions) : undefined)
        .limit(limit)
        .offset(offset)

      return NextResponse.json({
        success: true,
        data: result,
        page,
        limit,
        total: result.length,
      })
    } catch {
      // Graceful fallback to static data if PostgreSQL server is not connected
      let filtered = [...mockProperties]
      if (type) filtered = filtered.filter((p) => p.type === type)
      if (region) filtered = filtered.filter((p) => p.region === region)
      if (rooms) filtered = filtered.filter((p) => p.rooms === Number(rooms))
      if (minPrice) filtered = filtered.filter((p) => p.price >= Number(minPrice))
      if (maxPrice) filtered = filtered.filter((p) => p.price <= Number(maxPrice))

      const paginated = filtered.slice(offset, offset + limit)
      return NextResponse.json({
        success: true,
        data: paginated,
        page,
        limit,
        total: filtered.length,
        isFallback: true,
      })
    }
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || 'Server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const validationResult = propertySchema.safeParse(body)

    if (!validationResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: 'Validation failed',
          details: validationResult.error.flatten().fieldErrors,
        },
        { status: 400 }
      )
    }

    const data = validationResult.data

    try {
      const [newProperty] = await db
        .insert(properties)
        .values({
          title: data.title,
          description: data.description,
          price: data.price,
          area: String(data.area),
          rooms: data.rooms,
          floor: data.floor,
          totalFloors: data.totalFloors,
          region: data.region,
          district: data.district,
          address: data.address,
          type: data.type as any,
          status: 'pending',
          has3D: data.has3D,
          rentToOwn: data.rentToOwn,
          sellerId: '00000000-0000-0000-0000-000000000000', // Demo seller UUID
        })
        .returning()

      return NextResponse.json({ success: true, data: newProperty }, { status: 201 })
    } catch {
      // Fallback created object for offline mode
      const createdObj = {
        id: `p-${Date.now()}`,
        ...data,
        status: 'pending',
        createdAt: new Date().toISOString(),
      }
      return NextResponse.json({ success: true, data: createdObj, isFallback: true }, { status: 201 })
    }
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || 'Server error' },
      { status: 500 }
    )
  }
}
