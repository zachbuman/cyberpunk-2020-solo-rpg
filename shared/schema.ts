import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, jsonb, timestamp, boolean, decimal } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const characters = pgTable("characters", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  archetype: text("archetype").notNull(),
  background: text("background"),
  stats: jsonb("stats").notNull(),
  skills: jsonb("skills").notNull(),
  equipment: jsonb("equipment").notNull(),
  cyberware: jsonb("cyberware").notNull(),
  health: integer("health").notNull(),
  maxHealth: integer("max_health").notNull(),
  humanity: integer("humanity").notNull(),
  maxHumanity: integer("max_humanity").notNull(),
  reputation: integer("reputation").default(0),
  streetCred: integer("street_cred").default(0),
  eurodollars: integer("eurodollars").default(2000),
  createdAt: timestamp("created_at").defaultNow(),
});

export const campaigns = pgTable("campaigns", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  characterId: varchar("character_id").notNull().references(() => characters.id),
  title: text("title").notNull(),
  description: text("description").notNull(),
  currentMissionId: text("current_mission_id"),
  progress: jsonb("progress").notNull(),
  choices: jsonb("choices").notNull(),
  gameState: jsonb("game_state").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const gameStates = pgTable("game_states", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  characterId: varchar("character_id").notNull().references(() => characters.id),
  campaignId: varchar("campaign_id").references(() => campaigns.id),
  currentScene: text("current_scene").notNull(),
  sceneData: jsonb("scene_data").notNull(),
  combatState: jsonb("combat_state"),
  inCombat: boolean("in_combat").default(false),
  lastRoll: jsonb("last_roll"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const saves = pgTable("saves", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  characterId: varchar("character_id").notNull().references(() => characters.id),
  name: text("name").notNull(),
  description: text("description"),
  characterSnapshot: jsonb("character_snapshot").notNull(),
  gameStateSnapshot: jsonb("game_state_snapshot").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Cyberware tables
export const cyberwareCatalog = pgTable("cyberware_catalog", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  category: text("category").notNull(), // "neural", "body", "sensory", "weapons"
  subcategory: text("subcategory").notNull(), // "chipware", "cyberlimbs", "cybereyes", etc.
  humanityCost: integer("humanity_cost").notNull(),
  cost: integer("cost").notNull(), // in eurodollars
  installationDifficulty: integer("installation_difficulty").notNull(), // Medical skill target
  surgeryTime: integer("surgery_time").notNull(), // in minutes
  description: text("description").notNull(),
  gameEffects: jsonb("game_effects").notNull(), // stat bonuses, special abilities
  complications: jsonb("complications").notNull(), // possible installation failures
  availability: text("availability").notNull(), // "C", "R", "P", "E"
  streetPrice: integer("street_price"), // black market price
  legalStatus: text("legal_status").notNull(), // "legal", "restricted", "illegal"
  bodyLocation: text("body_location"), // where it's installed
});

export const cyberwareInstallations = pgTable("cyberware_installations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  characterId: varchar("character_id").notNull().references(() => characters.id),
  cyberwareId: varchar("cyberware_id").notNull().references(() => cyberwareCatalog.id),
  installedAt: timestamp("installed_at").defaultNow(),
  installationQuality: text("installation_quality").notNull(), // "perfect", "good", "poor", "botched"
  medicalRoll: integer("medical_roll"), // the actual dice roll made
  complications: jsonb("complications"), // any complications that occurred
  paidPrice: integer("paid_price").notNull(),
  installedBy: text("installed_by"), // NPC doctor name
  recoveryTime: integer("recovery_time"), // days of recovery needed
  isActive: boolean("is_active").default(true),
});

// Netrunning tables
export const netrunSessions = pgTable("netrun_sessions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  characterId: varchar("character_id").notNull().references(() => characters.id),
  gameStateId: varchar("game_state_id").references(() => gameStates.id),
  systemType: text("system_type").notNull(), // "datafortress", "corporate", "government", etc.
  systemDifficulty: integer("system_difficulty").notNull(),
  currentPosition: jsonb("current_position").notNull(), // {x, y} coordinates
  programsLoaded: jsonb("programs_loaded").notNull(),
  traceLevel: integer("trace_level").default(0),
  isActive: boolean("is_active").default(true),
  objectives: jsonb("objectives").notNull(),
  completedObjectives: jsonb("completed_objectives").default([]),
  iceEncountered: jsonb("ice_encountered").default([]),
  dataRetrieved: jsonb("data_retrieved").default([]),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Character schemas
export const statsSchema = z.object({
  intelligence: z.number().min(1).max(10),
  reflexes: z.number().min(1).max(10),
  technical: z.number().min(1).max(10),
  cool: z.number().min(1).max(10),
  attractiveness: z.number().min(1).max(10),
  luck: z.number().min(1).max(10),
  movement: z.number().min(1).max(10),
  body: z.number().min(1).max(10),
  empathy: z.number().min(1).max(10),
});

export const skillsSchema = z.object({
  // Special Abilities
  combatSense: z.number().default(0),
  // Combat Skills
  rifle: z.number().default(0),
  handgun: z.number().default(0),
  brawling: z.number().default(0),
  martialArts: z.number().default(0),
  dodgeEscape: z.number().default(0),
  // Technical Skills
  electronics: z.number().default(0),
  securityTech: z.number().default(0),
  medical: z.number().default(0),
  // Social Skills
  streetwise: z.number().default(0),
  intimidate: z.number().default(0),
  fastTalk: z.number().default(0),
  persuasion: z.number().default(0),
  // Other Skills
  athletics: z.number().default(0),
  awareness: z.number().default(0),
  driving: z.number().default(0),
  stealth: z.number().default(0),
  // Netrunning Skills
  interface: z.number().default(0),
});

export const equipmentSchema = z.object({
  weapons: z.array(z.object({
    name: z.string(),
    type: z.string(),
    damage: z.string(),
    accuracy: z.number(),
    concealment: z.string(),
    availability: z.string(),
    rof: z.number().optional(),
    reliability: z.string().optional(),
  })),
  armor: z.array(z.object({
    name: z.string(),
    sp: z.number(),
    ev: z.number(),
    cost: z.number(),
  })),
  gear: z.array(z.object({
    name: z.string(),
    description: z.string(),
    cost: z.number().optional(),
  })),
});

export const cyberwareSchema = z.object({
  implants: z.array(z.object({
    id: z.string(),
    catalogId: z.string(),
    name: z.string(),
    category: z.string(),
    subcategory: z.string(),
    humanityCost: z.number(),
    description: z.string(),
    gameEffects: z.object({
      statBonuses: z.record(z.number()).default({}),
      specialAbilities: z.array(z.string()).default([]),
      skillBonuses: z.record(z.number()).default({}),
    }),
    installationDate: z.string(),
    installationQuality: z.enum(["perfect", "good", "poor", "botched"]),
    paidPrice: z.number(),
    isActive: z.boolean().default(true),
    complications: z.array(z.string()).default([]),
  })),
  totalHumanityLoss: z.number().default(0),
  psychologicalState: z.object({
    empathyPenalty: z.number().default(0),
    cyberpsychosisRisk: z.enum(["none", "low", "moderate", "high", "critical"]).default("none"),
    symptoms: z.array(z.string()).default([]),
    lastBreakdown: z.string().optional(),
  }),
});

// Netrunning schemas
export const iceSchema = z.object({
  id: z.string(),
  name: z.string(),
  type: z.enum(["defensive", "offensive", "detection"]),
  subType: z.string(), // "Barrier", "Wall", "Killer", "Hellhound", "Watchdog", "Bloodhound", etc.
  difficulty: z.number().min(1).max(30),
  strength: z.number().min(1).max(20),
  position: z.object({ x: z.number(), y: z.number() }),
  isActive: z.boolean().default(true),
  description: z.string(),
  effects: z.array(z.string()).default([]),
  detectedNetrunner: z.boolean().default(false),
});

export const programSchema = z.object({
  id: z.string(),
  name: z.string(),
  type: z.enum(["attack", "defense", "stealth", "utility", "daemon"]),
  description: z.string(),
  strength: z.number().min(1).max(20),
  mu: z.number().min(1).max(10), // Memory Units required
  difficulty: z.number().min(1).max(25), // Difficulty to use
  cost: z.number().min(0), // eb cost
  effects: z.array(z.string()).default([]),
  isLoaded: z.boolean().default(false),
});

export const netrunningStateSchema = z.object({
  isJackedIn: z.boolean().default(false),
  currentSystem: z.string().optional(),
  systemType: z.string().optional(),
  position: z.object({ x: z.number(), y: z.number() }).default({ x: 0, y: 0 }),
  traceLevel: z.number().min(0).max(100).default(0),
  traceTurns: z.number().default(0),
  programsLoaded: z.array(programSchema).default([]),
  memoryUsed: z.number().default(0),
  maxMemory: z.number().default(20), // Base cyberdeck memory
  activeIce: z.array(iceSchema).default([]),
  systemMap: z.array(
    z.array(z.object({
      type: z.enum(["empty", "ice", "data", "cpu", "gateway", "sysop"]),
      content: z.any().optional(),
      discovered: z.boolean().default(false),
    }))
  ).default([]),
  objectives: z.array(z.object({
    id: z.string(),
    description: z.string(),
    type: z.enum(["data_retrieval", "system_crash", "backdoor_install", "trace_evasion"]),
    completed: z.boolean().default(false),
    difficulty: z.number(),
  })).default([]),
  dataRetrieved: z.array(z.object({
    name: z.string(),
    type: z.string(),
    value: z.number(), // eb value or importance
    description: z.string(),
  })).default([]),
});

export const insertCharacterSchema = createInsertSchema(characters).omit({
  id: true,
  createdAt: true,
}).extend({
  stats: statsSchema,
  skills: skillsSchema,
  equipment: equipmentSchema,
  cyberware: cyberwareSchema,
});

// Restricted schema for character updates that excludes protected fields
export const updateCharacterSchema = insertCharacterSchema.omit({
  humanity: true,
  maxHumanity: true,
  eurodollars: true,
  cyberware: true,
});

export const insertCampaignSchema = createInsertSchema(campaigns).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertGameStateSchema = createInsertSchema(gameStates).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertSaveSchema = createInsertSchema(saves).omit({
  id: true,
  createdAt: true,
});

export const insertNetrunSessionSchema = createInsertSchema(netrunSessions).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Cyberware schemas
export const cyberwareCatalogSchema = z.object({
  id: z.string(),
  name: z.string(),
  category: z.enum(["neural", "body", "sensory", "weapons"]),
  subcategory: z.string(),
  humanityCost: z.number().min(1).max(8),
  cost: z.number().min(0),
  installationDifficulty: z.number().min(10).max(30),
  surgeryTime: z.number().min(15).max(480), // 15 minutes to 8 hours
  description: z.string(),
  gameEffects: z.object({
    statBonuses: z.record(z.number()).default({}),
    specialAbilities: z.array(z.string()).default([]),
    skillBonuses: z.record(z.number()).default({}),
  }),
  complications: z.array(z.object({
    name: z.string(),
    description: z.string(),
    severity: z.enum(["minor", "major", "critical"]),
    rollRange: z.string(), // e.g., "1-2", "3-5"
  })).default([]),
  availability: z.enum(["C", "R", "P", "E"]), // Common, Rare, Poor, Exotic
  streetPrice: z.number().optional(),
  legalStatus: z.enum(["legal", "restricted", "illegal"]),
  bodyLocation: z.string().optional(),
});

export const insertCyberwareCatalogSchema = createInsertSchema(cyberwareCatalog).omit({
  id: true,
});

export const cyberwareInstallationSchema = z.object({
  id: z.string(),
  characterId: z.string(),
  cyberwareId: z.string(),
  installedAt: z.string(),
  installationQuality: z.enum(["perfect", "good", "poor", "botched"]),
  medicalRoll: z.number().optional(),
  complications: z.array(z.object({
    name: z.string(),
    description: z.string(),
    severity: z.enum(["minor", "major", "critical"]),
    resolved: z.boolean().default(false),
  })).default([]),
  paidPrice: z.number(),
  installedBy: z.string().optional(),
  recoveryTime: z.number().optional(),
  isActive: z.boolean().default(true),
});

export const insertCyberwareInstallationSchema = createInsertSchema(cyberwareInstallations).omit({
  id: true,
  installedAt: true,
});

export type Character = typeof characters.$inferSelect;
export type InsertCharacter = z.infer<typeof insertCharacterSchema>;
export type UpdateCharacter = z.infer<typeof updateCharacterSchema>;
export type Campaign = typeof campaigns.$inferSelect;
export type InsertCampaign = z.infer<typeof insertCampaignSchema>;
export type GameState = typeof gameStates.$inferSelect;
export type InsertGameState = z.infer<typeof insertGameStateSchema>;
export type Save = typeof saves.$inferSelect;
export type InsertSave = z.infer<typeof insertSaveSchema>;
export type Stats = z.infer<typeof statsSchema>;
export type Skills = z.infer<typeof skillsSchema>;
export type Equipment = z.infer<typeof equipmentSchema>;
export type Cyberware = z.infer<typeof cyberwareSchema>;
export type NetrunSession = typeof netrunSessions.$inferSelect;
export type InsertNetrunSession = z.infer<typeof insertNetrunSessionSchema>;
export type ICE = z.infer<typeof iceSchema>;
export type Program = z.infer<typeof programSchema>;
export type NetrunningState = z.infer<typeof netrunningStateSchema>;
export type CyberwareCatalogItem = typeof cyberwareCatalog.$inferSelect;
export type InsertCyberwareCatalogItem = z.infer<typeof insertCyberwareCatalogSchema>;
export type CyberwareInstallation = typeof cyberwareInstallations.$inferSelect;
export type InsertCyberwareInstallation = z.infer<typeof insertCyberwareInstallationSchema>;
