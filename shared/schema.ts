import { boolean, integer, jsonb, pgTable, serial, text, timestamp, varchar } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';

// API Endpoints table
export const apiEndpoints = pgTable('api_endpoints', {
  id: varchar('id').primaryKey().default(sql`gen_random_uuid()`),
  name: text('name').notNull(),
  description: text('description').notNull(),
  method: text('method').notNull(),
  path: text('path').notNull(),
  category: text('category').notNull(),
  parameters: jsonb('parameters'),
  responseSchema: jsonb('response_schema'),
  exampleRequest: text('example_request'),
  exampleResponse: text('example_response'),
  rateLimit: integer('rate_limit'),
  createdAt: timestamp('created_at').defaultNow(),
});

// API Keys table
export const apiKeys = pgTable('api_keys', {
  id: varchar('id').primaryKey().default(sql`gen_random_uuid()`),
  name: text('name').notNull(),
  keyHash: text('key_hash').notNull(),
  key: text('key'),
  isActive: boolean('is_active').default(true).notNull(),
  active: boolean('active'),
  partnerId: text('partner_id'),
  userId: varchar('user_id'),
  rateLimitPerMinute: integer('rate_limit_per_minute').default(60).notNull(),
  expiresAt: timestamp('expires_at'),
  lastUsedAt: timestamp('last_used_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// API Usage table
export const apiUsage = pgTable('api_usage', {
  id: varchar('id').primaryKey().default(sql`gen_random_uuid()`),
  apiKeyId: varchar('api_key_id').notNull(),
  endpoint: text('endpoint').notNull(),
  timestamp: timestamp('timestamp').defaultNow().notNull(),
  statusCode: integer('status_code'),
  responseTimeMs: integer('response_time_ms'),
  ipAddress: text('ip_address'),
});

// Developer Profiles table
export const developerProfiles = pgTable('developer_profiles', {
  id: varchar('id').primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar('user_id').notNull(),
  companyName: text('company_name'),
  website: text('website'),
  apiUsagePlan: text('api_usage_plan').default('free').notNull(),
  monthlyRequestLimit: integer('monthly_request_limit').default(1000).notNull(),
  partnerId: text('partner_id').notNull().unique(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Relay Logs table
export const relayLogs = pgTable('relay_logs', {
  id: serial('id').primaryKey(),
  partnerId: text('partner_id'),
  chain: text('chain').notNull(),
  toAddr: text('to_addr').notNull(),
  fromAddr: text('from_addr'),
  decision: text('decision').notNull(),
  riskScore: integer('risk_score').default(0).notNull(),
  riskBand: text('risk_band').notNull(),
  reasons: text('reasons').array(),
  txHash: text('tx_hash'),
  idempotencyKey: text('idempotency_key'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Risk Events table
export const riskEvents = pgTable('risk_events', {
  id: varchar('id').primaryKey().default(sql`gen_random_uuid()`),
  wallet: text('wallet').notNull(),
  feature: text('feature').notNull(),
  category: text('category'),
  details: jsonb('details'),
  metadata: jsonb('metadata'),
  weightApplied: integer('weight_applied').default(0).notNull(),
  confidence: integer('confidence'),
  occurredAt: timestamp('occurred_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Risk Scores table
export const riskScores = pgTable('risk_scores', {
  wallet: text('wallet').primaryKey(),
  score: integer('score').default(0).notNull(),
  band: text('band').default('LOW').notNull(),
  confidence: integer('confidence'),
  metadata: jsonb('metadata'),
  lastUpdated: timestamp('last_updated'),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Sanctioned Wallets table
export const sanctionedWallets = pgTable('sanctioned_wallets', {
  address: text('address').primaryKey(),
  source: text('source').default('OFAC').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Real Time Transfers table
export const realTimeTransfers = pgTable('real_time_transfers', {
  id: varchar('id').primaryKey().default(sql`gen_random_uuid()`),
  hash: text('hash').notNull(),
  fromAddress: text('from_address').notNull(),
  toAddress: text('to_address').notNull(),
  amount: integer('amount').notNull(),
  currency: text('currency').default('ETH').notNull(),
  network: text('network').default('ethereum').notNull(),
  blockNumber: integer('block_number').notNull(),
  timestamp: timestamp('timestamp').notNull(),
  usdValue: integer('usd_value').default(0).notNull(),
  isWhale: boolean('is_whale').default(false).notNull(),
  gasUsed: integer('gas_used'),
  gasPrice: integer('gas_price'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Stablecoin Transfers table
export const stablecoinTransfers = pgTable('stablecoin_transfers', {
  id: varchar('id').primaryKey().default(sql`gen_random_uuid()`),
  senderAddress: text('sender_address').notNull(),
  receiverAddress: text('receiver_address').notNull(),
  amount: integer('amount').notNull(),
  tokenName: text('token_name').notNull(),
  tokenSymbol: text('token_symbol').notNull(),
  network: text('network').default('ethereum').notNull(),
  blockTime: timestamp('block_time').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Tracked Wallets table
export const trackedWallets = pgTable('tracked_wallets', {
  id: varchar('id').primaryKey().default(sql`gen_random_uuid()`),
  address: text('address').notNull(),
  name: text('name'),
  network: text('network').default('ethereum').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Wallet Transactions table
export const walletTransactions = pgTable('wallet_transactions', {
  id: varchar('id').primaryKey().default(sql`gen_random_uuid()`),
  hash: text('hash').notNull().unique(),
  fromAddress: text('from_address').notNull(),
  toAddress: text('to_address').notNull(),
  value: text('value').notNull(),
  gasPrice: text('gas_price'),
  gasUsed: text('gas_used'),
  blockNumber: integer('block_number').notNull(),
  blockHash: text('block_hash').notNull(),
  timestamp: timestamp('timestamp').notNull(),
  status: text('status').default('success').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});