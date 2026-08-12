import {
  bigint,
  boolean,
  integer,
  numeric,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
} from 'drizzle-orm/pg-core'

// Enums
export const userRoleEnum = pgEnum('user_role', [
  'super_admin',
  'company',
  'buyer',
  'investor',
  'realtor',
  'bank',
  'state_operator',
])

export const propertyTypeEnum = pgEnum('property_type', [
  'kvartira',
  'uy',
  'ofis',
  'dokon',
  'ombor',
  'qurilish',
  'davlat',
])

export const propertyStatusEnum = pgEnum('property_status', [
  'pending',
  'active',
  'sold',
  'rejected',
])

export const auctionStatusEnum = pgEnum('auction_status', [
  'upcoming',
  'active',
  'completed',
])

export const agreementStatusEnum = pgEnum('agreement_status', [
  'pending',
  'signed',
  'active',
  'completed',
  'cancelled',
])

export const appointmentStatusEnum = pgEnum('appointment_status', [
  'scheduled',
  'completed',
  'cancelled',
])

// Tables
export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  phone: text('phone').notNull(),
  role: userRoleEnum('role').default('buyer').notNull(),
  passwordHash: text('password_hash').notNull(),
  isBlocked: boolean('is_blocked').default(false).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

export const properties = pgTable('properties', {
  id: uuid('id').primaryKey().defaultRandom(),
  title: text('title').notNull(),
  description: text('description').notNull(),
  price: bigint('price', { mode: 'number' }).notNull(),
  area: numeric('area').notNull(),
  rooms: integer('rooms').notNull(),
  floor: integer('floor'),
  totalFloors: integer('total_floors'),
  region: text('region').notNull(),
  district: text('district').notNull(),
  address: text('address').notNull(),
  type: propertyTypeEnum('type').notNull(),
  status: propertyStatusEnum('status').default('pending').notNull(),
  has3D: boolean('has_3d').default(false).notNull(),
  modelUrl: text('model_url'),
  rentToOwn: boolean('rent_to_own').default(false).notNull(),
  monthlyRent: bigint('monthly_rent', { mode: 'number' }),
  sellerId: uuid('seller_id')
    .references(() => users.id, { onDelete: 'cascade' })
    .notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

export const auctions = pgTable('auctions', {
  id: uuid('id').primaryKey().defaultRandom(),
  propertyId: uuid('property_id')
    .references(() => properties.id, { onDelete: 'cascade' })
    .notNull(),
  startPrice: bigint('start_price', { mode: 'number' }).notNull(),
  currentBid: bigint('current_bid', { mode: 'number' }).notNull(),
  minStep: bigint('min_step', { mode: 'number' }).notNull(),
  status: auctionStatusEnum('status').default('active').notNull(),
  startTime: timestamp('start_time').notNull(),
  endTime: timestamp('end_time').notNull(),
  winnerId: uuid('winner_id').references(() => users.id),
  totalBids: integer('total_bids').default(0).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

export const bids = pgTable('bids', {
  id: uuid('id').primaryKey().defaultRandom(),
  auctionId: uuid('auction_id')
    .references(() => auctions.id, { onDelete: 'cascade' })
    .notNull(),
  userId: uuid('user_id')
    .references(() => users.id, { onDelete: 'cascade' })
    .notNull(),
  amount: bigint('amount', { mode: 'number' }).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

export const r2oAgreements = pgTable('r2o_agreements', {
  id: uuid('id').primaryKey().defaultRandom(),
  propertyId: uuid('property_id')
    .references(() => properties.id, { onDelete: 'cascade' })
    .notNull(),
  buyerId: uuid('buyer_id')
    .references(() => users.id, { onDelete: 'cascade' })
    .notNull(),
  sellerId: uuid('seller_id')
    .references(() => users.id, { onDelete: 'cascade' })
    .notNull(),
  monthlyPayment: bigint('monthly_payment', { mode: 'number' }).notNull(),
  priceLocked: bigint('price_locked', { mode: 'number' }).notNull(),
  status: agreementStatusEnum('status').default('pending').notNull(),
  signatureHash: text('signature_hash'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

export const appointments = pgTable('appointments', {
  id: uuid('id').primaryKey().defaultRandom(),
  realtorId: uuid('realtor_id')
    .references(() => users.id, { onDelete: 'cascade' })
    .notNull(),
  clientName: text('client_name').notNull(),
  phone: text('phone').notNull(),
  propertyId: uuid('property_id')
    .references(() => properties.id, { onDelete: 'cascade' })
    .notNull(),
  appointmentDate: timestamp('appointment_date').notNull(),
  status: appointmentStatusEnum('status').default('scheduled').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

export type UserSelect = typeof users.$inferSelect
export type UserInsert = typeof users.$inferInsert
export type PropertySelect = typeof properties.$inferSelect
export type PropertyInsert = typeof properties.$inferInsert
export type AuctionSelect = typeof auctions.$inferSelect
export type AuctionInsert = typeof auctions.$inferInsert
export type BidSelect = typeof bids.$inferSelect
export type BidInsert = typeof bids.$inferInsert
