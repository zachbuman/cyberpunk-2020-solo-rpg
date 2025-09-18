import type { Stats, Skills, Equipment } from "@shared/schema";

export interface Archetype {
  name: string;
  description: string;
  specialAbility: string;
  primarySkills: string[];
  baseStats: Stats;
  baseSkills: Skills;
  startingEquipment: Equipment;
}

export const ARCHETYPES: Archetype[] = [
  {
    name: "Solo",
    description: "Combat specialist and mercenary",
    specialAbility: "Combat Sense - Enhanced awareness and reflexes in combat situations",
    primarySkills: ["Combat Sense", "Rifle", "Handgun", "Brawling"],
    baseStats: {
      intelligence: 6,
      reflexes: 8,
      technical: 4,
      cool: 7,
      attractiveness: 6,
      luck: 5,
      movement: 7,
      body: 8,
      empathy: 4,
    },
    baseSkills: {
      combatSense: 8,
      rifle: 8,
      handgun: 6,
      brawling: 7,
      martialArts: 5,
      dodgeEscape: 6,
      electronics: 2,
      securityTech: 3,
      streetwise: 7,
      intimidate: 6,
      fastTalk: 3,
      persuasion: 2,
      athletics: 6,
      awareness: 7,
      driving: 4,
      stealth: 5,
      interface: 0,
    },
    startingEquipment: {
      weapons: [
        {
          name: "Militech Assault Rifle",
          type: "assault_rifle",
          damage: "5d6",
          accuracy: 1,
          concealment: "N",
          availability: "P",
          rof: 25,
          reliability: "VR",
        },
        {
          name: "Federated Arms X-22",
          type: "handgun",
          damage: "2d6+1",
          accuracy: 0,
          concealment: "P",
          availability: "C",
          rof: 2,
          reliability: "ST",
        },
      ],
      armor: [
        {
          name: "Kevlar Vest",
          sp: 14,
          ev: 0,
          cost: 200,
        },
      ],
      gear: [
        { name: "Braindance Deck", description: "Personal entertainment system", cost: 400 },
        { name: "Medtech Kit", description: "First aid supplies", cost: 100 },
        { name: "Scrambler/Descrambler", description: "Communication encryption", cost: 500 },
      ],
    },
  },
  {
    name: "Netrunner",
    description: "Hacker and data specialist",
    specialAbility: "Interface - Direct neural connection to cyberspace",
    primarySkills: ["Interface", "Electronics", "Programming", "System Knowledge"],
    baseStats: {
      intelligence: 9,
      reflexes: 6,
      technical: 8,
      cool: 7,
      attractiveness: 5,
      luck: 6,
      movement: 5,
      body: 4,
      empathy: 6,
    },
    baseSkills: {
      combatSense: 0,
      rifle: 2,
      handgun: 4,
      brawling: 3,
      martialArts: 0,
      dodgeEscape: 5,
      electronics: 9,
      securityTech: 8,
      streetwise: 6,
      intimidate: 3,
      fastTalk: 5,
      persuasion: 6,
      athletics: 3,
      awareness: 7,
      driving: 4,
      stealth: 6,
      interface: 8,
    },
    startingEquipment: {
      weapons: [
        {
          name: "Light Autopistol",
          type: "handgun",
          damage: "2d6",
          accuracy: 0,
          concealment: "J",
          availability: "P",
          rof: 2,
          reliability: "ST",
        },
      ],
      armor: [
        {
          name: "Armor Jacket",
          sp: 10,
          ev: 0,
          cost: 50,
        },
      ],
      gear: [
        { name: "Cyberdeck", description: "Portable computer system", cost: 5000 },
        { name: "Interface Plugs", description: "Neural interface hardware", cost: 200 },
        { name: "Scrambler/Descrambler", description: "Communication encryption", cost: 500 },
      ],
    },
  },
  {
    name: "Techie",
    description: "Engineer and tech specialist",
    specialAbility: "Jury Rig - Create temporary solutions from available materials",
    primarySkills: ["Electronics", "Basic Tech", "Cybertech", "AV Tech"],
    baseStats: {
      intelligence: 8,
      reflexes: 6,
      technical: 9,
      cool: 6,
      attractiveness: 5,
      luck: 7,
      movement: 6,
      body: 6,
      empathy: 7,
    },
    baseSkills: {
      combatSense: 0,
      rifle: 3,
      handgun: 5,
      brawling: 4,
      martialArts: 0,
      dodgeEscape: 4,
      electronics: 8,
      securityTech: 7,
      streetwise: 5,
      intimidate: 3,
      fastTalk: 6,
      persuasion: 7,
      athletics: 4,
      awareness: 6,
      driving: 7,
      stealth: 4,
      interface: 0,
    },
    startingEquipment: {
      weapons: [
        {
          name: "Heavy Pistol",
          type: "handgun",
          damage: "3d6",
          accuracy: 0,
          concealment: "L",
          availability: "C",
          rof: 2,
          reliability: "ST",
        },
      ],
      armor: [
        {
          name: "Armor Vest",
          sp: 12,
          ev: 0,
          cost: 75,
        },
      ],
      gear: [
        { name: "Tech Toolkit", description: "Comprehensive repair kit", cost: 300 },
        { name: "Electronics Kit", description: "Circuit boards and components", cost: 500 },
        { name: "Cybernetic Scanner", description: "Diagnostic equipment", cost: 1000 },
      ],
    },
  },
];

export interface CampaignScene {
  id: string;
  title: string;
  description: string;
  choices: {
    text: string;
    skillCheck?: string;
    type?: "combat" | "stealth" | "social" | "technical" | "netrunning";
    nextScene?: string;
  }[];
}

export const CAMPAIGN_SCENES: Record<string, CampaignScene> = {
  securityCheckpoint: {
    id: "securityCheckpoint",
    title: "Security Checkpoint",
    description: "You approach the security checkpoint. Two armed guards stand behind reinforced glass, their eyes scanning the area. A biometric scanner glows red beside the door. You notice a maintenance shaft overhead, a service elevator nearby, and network access ports along the wall. How do you proceed?",
    choices: [
      {
        text: "Attempt to bluff your way past security using a fake ID",
        skillCheck: "COOL + Fast Talk (Difficulty: 18)",
        type: "social",
        nextScene: "elevator",
      },
      {
        text: "Crawl through the maintenance shaft",
        skillCheck: "REF + Athletics (Difficulty: 14)",
        type: "stealth",
        nextScene: "vents",
      },
      {
        text: "Hack the service elevator control panel", 
        skillCheck: "INT + Electronics (Difficulty: 16)",
        type: "technical",
        nextScene: "elevator",
      },
      {
        text: "Jack in and attempt to access the building's network remotely",
        skillCheck: "INT + Interface (Difficulty: 18)",
        type: "netrunning",
        nextScene: "netrunning_session",
      },
      {
        text: "Go in guns blazing",
        type: "combat",
        nextScene: "combat_security",
      },
    ],
  },
  elevator: {
    id: "elevator",
    title: "Service Elevator",
    description: "You've gained access to the service elevator. The cramped space hums with electrical components. Floor buttons glow softly, showing levels 1-50. Your target is on floor 47, but you notice the elevator camera is active and security alerts might be triggered.",
    choices: [
      {
        text: "Go directly to floor 47",
        type: "social",
        nextScene: "targetFloor",
      },
      {
        text: "Stop at floor 45 and take the stairs",
        type: "stealth",
        nextScene: "stairs",
      },
      {
        text: "Disable the elevator camera first",
        skillCheck: "INT + Electronics (Difficulty: 12)",
        type: "technical",
        nextScene: "targetFloor",
      },
      {
        text: "Jack in and access the building's elevator control system",
        skillCheck: "INT + Interface (Difficulty: 14)",
        type: "netrunning",
        nextScene: "netrunning_session",
      },
    ],
  },
  vents: {
    id: "vents",
    title: "Maintenance Shafts",
    description: "The maintenance shaft is darker than expected. Your cyberware provides limited light as you crawl through the confined space. You can hear voices below and see another shaft leading upward. There's also a maintenance access panel that might lead to the building's security systems.",
    choices: [
      {
        text: "Continue crawling toward the target floor",
        skillCheck: "REF + Athletics (Difficulty: 16)",
        type: "stealth",
        nextScene: "targetFloor",
      },
      {
        text: "Access the security panel to disable cameras",
        skillCheck: "INT + Electronics (Difficulty: 18)",
        type: "technical",
        nextScene: "securityDisabled",
      },
      {
        text: "Drop down and ambush the guards below",
        type: "combat",
        nextScene: "combat_ambush",
      },
    ],
  },
  netrunning_session: {
    id: "netrunning_session",
    title: "Cyberspace",
    description: "You jack in to the corporate network. The virtual landscape materializes around you as lines of code and data structures. Multiple data nodes pulse in the distance, but you detect ICE signatures protecting the system. Your objective data streams directly into your consciousness.",
    choices: [
      {
        text: "Enter the netrunning interface",
        type: "netrunning",
        nextScene: "start_netrunning",
      },
      {
        text: "Jack out immediately - this system seems too dangerous",
        type: "stealth",
        nextScene: "securityCheckpoint",
      },
    ],
  },
};
