import bcrypt from 'bcryptjs'
import { properties as sampleProperties } from '../data/properties'
import { auctions as sampleAuctions } from '../data/auctions'
import { db } from './index'
import { auctions, properties, users } from './schema'

async function seed() {
  console.log('🌱 Database Seeding boshlandi...')

  try {
    const defaultPassword = await bcrypt.hash('password123', 10)

    // 1. Seed Users
    const [demoSeller] = await db
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

    const sellerId = demoSeller?.id || '00000000-0000-0000-0000-000000000000'

    console.log('✅ Demo foydalanuvchilar yaratildi')

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
          modelUrl: p.modelUrl,
          rentToOwn: p.rentToOwn,
          monthlyRent: p.monthlyRent,
          sellerId,
        })
        .onConflictDoNothing()
    }

    console.log('✅ Demo mulklar bazaga kirizildi')

    console.log('🎉 DB Seeder muvaffaqiyatli yakunlandi!')
    process.exit(0)
  } catch (err) {
    console.error('❌ DB Seeder xatosi:', err)
    process.exit(1)
  }
}

seed()
