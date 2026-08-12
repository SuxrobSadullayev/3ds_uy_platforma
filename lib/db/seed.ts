import bcrypt from 'bcryptjs'
import { properties as sampleProperties } from '../data/properties'
import { db } from './index'
import { properties, users } from './schema'
import { eq } from 'drizzle-orm'

async function seed() {
  console.log('🌱 Database Seeding boshlandi...')

  try {
    const seedPassword = process.env.SEED_DEFAULT_PASSWORD || 'SecureDefaultPassword!2026'
    const defaultPassword = await bcrypt.hash(seedPassword, 10)

    // 1. Seed Users
    let [demoSeller] = await db
      .insert(users)
      .values({
        name: 'Murad Buildings MCHJ',
        email: 'info@muradbuildings.uz',
        phone: '+998901234567',
        role: 'company',
        passwordHash: defaultPassword,
      })
      .onConflictDoNothing()
      .returning()

    if (!demoSeller) {
      // If user already existed, fetch existing seller ID
      const [existing] = await db
        .select()
        .from(users)
        .where(eq(users.email, 'info@muradbuildings.uz'))
      demoSeller = existing
    }

    if (!demoSeller) {
      throw new Error('❌ Demo seller sotuvchisini yaratib bo\'lmadi')
    }

    const sellerId = demoSeller.id

    console.log('✅ Demo foydalanuvchilar tayyorlandi:', sellerId)

    // 2. Seed Properties
    for (const p of sampleProperties) {
      await db
        .insert(properties)
        .values({
          title: p.title,
          description: p.description,
          price: p.price,
          area: String(p.area),
          rooms: p.rooms,
          floor: p.floor,
          totalFloors: p.totalFloors,
          region: p.region,
          district: p.district,
          address: p.address,
          type: p.type as any,
          status: 'active',
          has3D: p.has3D,
          modelUrl: (p as any).modelUrl || null,
          rentToOwn: p.rentToOwn,
          monthlyRent: (p as any).monthlyRent || null,
          sellerId,
        })
        .onConflictDoNothing()
    }

    console.log('✅ Demo mulklar bazaga kiritildi')
    console.log('🎉 DB Seeder muvaffaqiyatli yakunlandi!')
    process.exit(0)
  } catch (err) {
    console.error('❌ DB Seeder xatosi:', err)
    process.exit(1)
  }
}

seed()
