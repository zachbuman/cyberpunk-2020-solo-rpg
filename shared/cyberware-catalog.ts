import type { InsertCyberwareCatalogItem } from "./schema";

// Authentic Cyberpunk 2020 Cyberware Catalog
// Based on the original tabletop RPG rules and sourcebooks

export const cyberwareCatalogData: InsertCyberwareCatalogItem[] = [
  // NEURAL CYBERWARE
  {
    name: "Chipware Socket",
    category: "neural",
    subcategory: "interface",
    humanityCost: 2,
    cost: 1000,
    installationDifficulty: 15,
    surgeryTime: 60,
    description: "A neural interface that allows the installation of skill chips and other software.",
    gameEffects: {
      statBonuses: {},
      specialAbilities: ["chip_interface"],
      skillBonuses: {}
    },
    complications: [
      {
        name: "Neural Feedback",
        description: "Temporary confusion and disorientation",
        severity: "minor",
        rollRange: "1-2"
      },
      {
        name: "Interface Rejection",
        description: "Socket fails to integrate properly, causing chronic headaches",
        severity: "major",
        rollRange: "9-10"
      }
    ],
    availability: "C",
    streetPrice: 1500,
    legalStatus: "legal",
    bodyLocation: "skull"
  },
  {
    name: "Interface Plugs",
    category: "neural",
    subcategory: "interface", 
    humanityCost: 1,
    cost: 200,
    installationDifficulty: 12,
    surgeryTime: 30,
    description: "Direct neural interface ports allowing connection to cyberspace and electronic devices.",
    gameEffects: {
      statBonuses: {},
      specialAbilities: ["neural_interface"],
      skillBonuses: { interface: 1 }
    },
    complications: [
      {
        name: "Port Infection",
        description: "Bacterial infection at interface sites",
        severity: "minor",
        rollRange: "1-3"
      }
    ],
    availability: "C",
    streetPrice: 300,
    legalStatus: "legal",
    bodyLocation: "temples"
  },
  {
    name: "Memory Chip",
    category: "neural",
    subcategory: "memory",
    humanityCost: 1,
    cost: 500,
    installationDifficulty: 10,
    surgeryTime: 15,
    description: "Additional storage capacity for the human brain, allowing perfect recall of stored information.",
    gameEffects: {
      statBonuses: {},
      specialAbilities: ["perfect_memory"],
      skillBonuses: {}
    },
    complications: [
      {
        name: "Memory Confusion",
        description: "Difficulty distinguishing real memories from stored data",
        severity: "minor",
        rollRange: "1-2"
      }
    ],
    availability: "C",
    legalStatus: "legal",
    bodyLocation: "brain"
  },
  {
    name: "Sandevistan Speedware",
    category: "neural",
    subcategory: "boosterware",
    humanityCost: 7,
    cost: 15000,
    installationDifficulty: 25,
    surgeryTime: 240,
    description: "Military-grade neural enhancement that dramatically accelerates reflexes and perception.",
    gameEffects: {
      statBonuses: { reflexes: 3 },
      specialAbilities: ["bullet_time", "enhanced_speed"],
      skillBonuses: { dodgeEscape: 2 }
    },
    complications: [
      {
        name: "Neural Burnout",
        description: "Severe neural damage from overstimulation",
        severity: "critical",
        rollRange: "9-10"
      },
      {
        name: "Addiction Syndrome",
        description: "Psychological dependence on speed enhancement",
        severity: "major",
        rollRange: "7-8"
      }
    ],
    availability: "E",
    streetPrice: 25000,
    legalStatus: "illegal",
    bodyLocation: "spinal_cord"
  },

  // BODY CYBERWARE
  {
    name: "Cyberarm",
    category: "body",
    subcategory: "cyberlimbs",
    humanityCost: 3,
    cost: 3000,
    installationDifficulty: 20,
    surgeryTime: 180,
    description: "Full replacement cybernetic arm with enhanced strength and built-in tool mounts.",
    gameEffects: {
      statBonuses: { body: 2 },
      specialAbilities: ["enhanced_strength", "tool_mount"],
      skillBonuses: { brawling: 1 }
    },
    complications: [
      {
        name: "Nerve Interface Failure",
        description: "Poor motor control in cybernetic limb",
        severity: "major",
        rollRange: "8-10"
      },
      {
        name: "Rejection Syndrome",
        description: "Body rejects the foreign implant",
        severity: "critical",
        rollRange: "1"
      }
    ],
    availability: "R",
    streetPrice: 4500,
    legalStatus: "legal",
    bodyLocation: "arm"
  },
  {
    name: "Cyberleg",
    category: "body",
    subcategory: "cyberlimbs",
    humanityCost: 3,
    cost: 2500,
    installationDifficulty: 20,
    surgeryTime: 180,
    description: "Cybernetic leg replacement with enhanced speed and jumping capability.",
    gameEffects: {
      statBonuses: { movement: 2 },
      specialAbilities: ["enhanced_jump", "shock_absorbers"],
      skillBonuses: { athletics: 1 }
    },
    complications: [
      {
        name: "Balance Issues",
        description: "Difficulty with coordination and balance",
        severity: "minor",
        rollRange: "1-3"
      },
      {
        name: "Joint Malfunction",
        description: "Mechanical failure in knee or ankle joint",
        severity: "major",
        rollRange: "9-10"
      }
    ],
    availability: "R",
    streetPrice: 3800,
    legalStatus: "legal",
    bodyLocation: "leg"
  },
  {
    name: "Muscle & Bone Lace",
    category: "body",
    subcategory: "enhancement",
    humanityCost: 4,
    cost: 8000,
    installationDifficulty: 22,
    surgeryTime: 300,
    description: "Synthetic muscle fibers and bone reinforcement providing superhuman strength.",
    gameEffects: {
      statBonuses: { body: 3 },
      specialAbilities: ["superhuman_strength", "damage_resistance"],
      skillBonuses: { brawling: 2 }
    },
    complications: [
      {
        name: "Metabolic Strain",
        description: "Increased caloric requirements and fatigue",
        severity: "minor",
        rollRange: "1-4"
      },
      {
        name: "Bone Stress Fractures",
        description: "Micro-fractures from enhancement stress",
        severity: "major",
        rollRange: "8-10"
      }
    ],
    availability: "R",
    streetPrice: 12000,
    legalStatus: "restricted",
    bodyLocation: "full_body"
  },
  {
    name: "Subdermal Armor",
    category: "body",
    subcategory: "protection",
    humanityCost: 2,
    cost: 5000,
    installationDifficulty: 18,
    surgeryTime: 120,
    description: "Flexible armor plating installed beneath the skin for protection.",
    gameEffects: {
      statBonuses: {},
      specialAbilities: ["natural_armor_sp10"],
      skillBonuses: {}
    },
    complications: [
      {
        name: "Skin Necrosis",
        description: "Tissue death around implant sites",
        severity: "major",
        rollRange: "9-10"
      },
      {
        name: "Reduced Flexibility",
        description: "Stiffness and reduced range of motion",
        severity: "minor",
        rollRange: "1-5"
      }
    ],
    availability: "R",
    streetPrice: 7500,
    legalStatus: "restricted",
    bodyLocation: "torso"
  },

  // SENSORY CYBERWARE
  {
    name: "Cybereyes",
    category: "sensory",
    subcategory: "visual",
    humanityCost: 2,
    cost: 1500,
    installationDifficulty: 16,
    surgeryTime: 90,
    description: "Artificial eyes with enhanced visual capabilities and built-in optics.",
    gameEffects: {
      statBonuses: {},
      specialAbilities: ["thermographic_vision", "low_light_vision", "telescopic"],
      skillBonuses: { awareness: 2 }
    },
    complications: [
      {
        name: "Optical Glitches",
        description: "Random visual distortions and artifacts",
        severity: "minor",
        rollRange: "1-3"
      },
      {
        name: "Depth Perception Loss",
        description: "Difficulty judging distances accurately",
        severity: "major",
        rollRange: "9-10"
      }
    ],
    availability: "C",
    streetPrice: 2200,
    legalStatus: "legal",
    bodyLocation: "eyes"
  },
  {
    name: "Cyberears",
    category: "sensory",
    subcategory: "auditory",
    humanityCost: 2,
    cost: 1000,
    installationDifficulty: 14,
    surgeryTime: 60,
    description: "Enhanced hearing system with frequency filtering and audio recording.",
    gameEffects: {
      statBonuses: {},
      specialAbilities: ["enhanced_hearing", "audio_recording", "frequency_filter"],
      skillBonuses: { awareness: 1 }
    },
    complications: [
      {
        name: "Audio Feedback",
        description: "Painful feedback from loud sounds",
        severity: "minor",
        rollRange: "1-2"
      },
      {
        name: "Hearing Loss",
        description: "Malfunction causes partial deafness",
        severity: "major",
        rollRange: "9-10"
      }
    ],
    availability: "C",
    streetPrice: 1500,
    legalStatus: "legal",
    bodyLocation: "ears"
  },
  {
    name: "Tactile Boost",
    category: "sensory",
    subcategory: "touch",
    humanityCost: 1,
    cost: 800,
    installationDifficulty: 12,
    surgeryTime: 45,
    description: "Enhanced nerve endings providing superhuman tactile sensitivity.",
    gameEffects: {
      statBonuses: {},
      specialAbilities: ["enhanced_touch", "texture_analysis"],
      skillBonuses: { securityTech: 1, medical: 1 }
    },
    complications: [
      {
        name: "Hypersensitivity",
        description: "Overwhelming sensory input from touch",
        severity: "minor",
        rollRange: "1-3"
      }
    ],
    availability: "C",
    legalStatus: "legal",
    bodyLocation: "nervous_system"
  },

  // WEAPONS CYBERWARE
  {
    name: "Wolvers",
    category: "weapons",
    subcategory: "melee",
    humanityCost: 3,
    cost: 2000,
    installationDifficulty: 18,
    surgeryTime: 120,
    description: "Retractable monofilament claws extending from knuckles.",
    gameEffects: {
      statBonuses: {},
      specialAbilities: ["retractable_claws", "melee_weapon_2d6"],
      skillBonuses: { brawling: 2 }
    },
    complications: [
      {
        name: "Accidental Extension",
        description: "Claws extend involuntarily during stress",
        severity: "minor",
        rollRange: "1-2"
      },
      {
        name: "Tendon Damage",
        description: "Damage to hand tendons from installation",
        severity: "major",
        rollRange: "9-10"
      }
    ],
    availability: "R",
    streetPrice: 3000,
    legalStatus: "illegal",
    bodyLocation: "hands"
  },
  {
    name: "Popup Gun",
    category: "weapons",
    subcategory: "firearms",
    humanityCost: 4,
    cost: 3500,
    installationDifficulty: 20,
    surgeryTime: 150,
    description: "Concealed firearm built into cybernetic arm with neural firing control.",
    gameEffects: {
      statBonuses: {},
      specialAbilities: ["concealed_firearm", "neural_targeting", "weapon_3d6"],
      skillBonuses: { handgun: 1 }
    },
    complications: [
      {
        name: "Misfire",
        description: "Weapon fires unexpectedly",
        severity: "critical",
        rollRange: "1"
      },
      {
        name: "Ammunition Jam",
        description: "Feeding mechanism malfunctions",
        severity: "major",
        rollRange: "8-10"
      }
    ],
    availability: "E",
    streetPrice: 5500,
    legalStatus: "illegal",
    bodyLocation: "arm"
  },
  {
    name: "Rippers",
    category: "weapons",
    subcategory: "melee",
    humanityCost: 2,
    cost: 1200,
    installationDifficulty: 16,
    surgeryTime: 90,
    description: "Monofilament fingertip blades designed for surgical precision.",
    gameEffects: {
      statBonuses: {},
      specialAbilities: ["precision_cutting", "melee_weapon_1d6+2"],
      skillBonuses: { brawling: 1, medical: 1 }
    },
    complications: [
      {
        name: "Nerve Damage",
        description: "Loss of fine motor control in fingers",
        severity: "major",
        rollRange: "9-10"
      }
    ],
    availability: "R",
    streetPrice: 1800,
    legalStatus: "restricted",
    bodyLocation: "fingers"
  },
  {
    name: "Big Knucks",
    category: "weapons",
    subcategory: "melee",
    humanityCost: 2,
    cost: 1000,
    installationDifficulty: 14,
    surgeryTime: 60,
    description: "Reinforced knuckle plates that turn fists into devastating weapons.",
    gameEffects: {
      statBonuses: {},
      specialAbilities: ["reinforced_fists", "melee_weapon_1d6+1"],
      skillBonuses: { brawling: 1 }
    },
    complications: [
      {
        name: "Joint Stiffness",
        description: "Reduced hand flexibility and dexterity",
        severity: "minor",
        rollRange: "1-4"
      }
    ],
    availability: "R",
    streetPrice: 1500,
    legalStatus: "restricted",
    bodyLocation: "hands"
  },

  // Additional Neural Cyberware
  {
    name: "Kerenzikov Boosterware",
    category: "neural",
    subcategory: "boosterware",
    humanityCost: 5,
    cost: 10000,
    installationDifficulty: 22,
    surgeryTime: 180,
    description: "Russian military boosterware that enhances reaction time and combat reflexes.",
    gameEffects: {
      statBonuses: { reflexes: 2 },
      specialAbilities: ["combat_boost", "initiative_bonus"],
      skillBonuses: { dodgeEscape: 1, brawling: 1 }
    },
    complications: [
      {
        name: "Neural Jitters",
        description: "Involuntary muscle twitches and tremors",
        severity: "minor",
        rollRange: "1-3"
      },
      {
        name: "Stress Overload",
        description: "System overload during high stress",
        severity: "major",
        rollRange: "8-10"
      }
    ],
    availability: "P",
    streetPrice: 15000,
    legalStatus: "illegal",
    bodyLocation: "nervous_system"
  },
  {
    name: "Neural Processor",
    category: "neural",
    subcategory: "processor",
    humanityCost: 3,
    cost: 2000,
    installationDifficulty: 18,
    surgeryTime: 120,
    description: "Enhanced processing power for the human brain, improving calculation and analysis.",
    gameEffects: {
      statBonuses: { intelligence: 1 },
      specialAbilities: ["enhanced_processing", "data_analysis"],
      skillBonuses: { electronics: 2, interface: 1 }
    },
    complications: [
      {
        name: "Logic Loops",
        description: "Getting stuck in repetitive thought patterns",
        severity: "minor",
        rollRange: "1-2"
      },
      {
        name: "Processing Overflow",
        description: "Temporary shutdown from information overload",
        severity: "major",
        rollRange: "9-10"
      }
    ],
    availability: "R",
    streetPrice: 3000,
    legalStatus: "legal",
    bodyLocation: "brain"
  }
];