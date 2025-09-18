import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertCharacterSchema, updateCharacterSchema, insertCampaignSchema, insertGameStateSchema, insertSaveSchema, insertNetrunSessionSchema, insertCyberwareInstallationSchema } from "@shared/schema";
import { z } from "zod";
import { deployToGitHub } from "./deploy-to-github";

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Character routes
  app.get("/api/characters", async (req, res) => {
    try {
      const characters = await storage.getAllCharacters();
      res.json(characters);
    } catch (error) {
      res.status(500).json({ message: "Failed to get characters" });
    }
  });

  app.get("/api/characters/:id", async (req, res) => {
    try {
      const character = await storage.getCharacter(req.params.id);
      if (!character) {
        return res.status(404).json({ message: "Character not found" });
      }
      res.json(character);
    } catch (error) {
      res.status(500).json({ message: "Failed to get character" });
    }
  });

  app.post("/api/characters", async (req, res) => {
    try {
      const validatedData = insertCharacterSchema.parse(req.body);
      const character = await storage.createCharacter(validatedData);
      res.status(201).json(character);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid character data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create character" });
    }
  });

  app.patch("/api/characters/:id", async (req, res) => {
    try {
      // Use restricted schema that excludes protected fields (humanity, maxHumanity, eurodollars, cyberware)
      const partialData = updateCharacterSchema.partial().parse(req.body);
      const character = await storage.updateCharacter(req.params.id, partialData);
      if (!character) {
        return res.status(404).json({ message: "Character not found" });
      }
      res.json(character);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid character data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update character" });
    }
  });

  app.delete("/api/characters/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteCharacter(req.params.id);
      if (!deleted) {
        return res.status(404).json({ message: "Character not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete character" });
    }
  });

  // Campaign routes
  app.get("/api/campaigns/:id", async (req, res) => {
    try {
      const campaign = await storage.getCampaign(req.params.id);
      if (!campaign) {
        return res.status(404).json({ message: "Campaign not found" });
      }
      res.json(campaign);
    } catch (error) {
      res.status(500).json({ message: "Failed to get campaign" });
    }
  });

  app.get("/api/campaigns/character/:characterId", async (req, res) => {
    try {
      const campaign = await storage.getCampaignByCharacter(req.params.characterId);
      if (!campaign) {
        return res.status(404).json({ message: "Campaign not found" });
      }
      res.json(campaign);
    } catch (error) {
      res.status(500).json({ message: "Failed to get campaign" });
    }
  });

  app.post("/api/campaigns", async (req, res) => {
    try {
      const validatedData = insertCampaignSchema.parse(req.body);
      const campaign = await storage.createCampaign(validatedData);
      res.status(201).json(campaign);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid campaign data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create campaign" });
    }
  });

  app.patch("/api/campaigns/:id", async (req, res) => {
    try {
      const partialData = insertCampaignSchema.partial().parse(req.body);
      const campaign = await storage.updateCampaign(req.params.id, partialData);
      if (!campaign) {
        return res.status(404).json({ message: "Campaign not found" });
      }
      res.json(campaign);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid campaign data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update campaign" });
    }
  });

  // Game state routes
  app.get("/api/game-state/:characterId", async (req, res) => {
    try {
      const gameState = await storage.getGameState(req.params.characterId);
      if (!gameState) {
        return res.status(404).json({ message: "Game state not found" });
      }
      res.json(gameState);
    } catch (error) {
      res.status(500).json({ message: "Failed to get game state" });
    }
  });

  app.post("/api/game-state", async (req, res) => {
    try {
      const validatedData = insertGameStateSchema.parse(req.body);
      const gameState = await storage.createGameState(validatedData);
      res.status(201).json(gameState);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid game state data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create game state" });
    }
  });

  app.patch("/api/game-state/:characterId", async (req, res) => {
    try {
      const partialData = insertGameStateSchema.partial().parse(req.body);
      const gameState = await storage.updateGameState(req.params.characterId, partialData);
      if (!gameState) {
        return res.status(404).json({ message: "Game state not found" });
      }
      res.json(gameState);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid game state data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update game state" });
    }
  });

  // Save/Load routes
  app.get("/api/saves/:characterId", async (req, res) => {
    try {
      const saves = await storage.getAllSaves(req.params.characterId);
      res.json(saves);
    } catch (error) {
      res.status(500).json({ message: "Failed to get saves" });
    }
  });

  app.get("/api/saves/slot/:id", async (req, res) => {
    try {
      const save = await storage.getSave(req.params.id);
      if (!save) {
        return res.status(404).json({ message: "Save not found" });
      }
      res.json(save);
    } catch (error) {
      res.status(500).json({ message: "Failed to get save" });
    }
  });

  app.post("/api/saves", async (req, res) => {
    try {
      const validatedData = insertSaveSchema.parse(req.body);
      const save = await storage.createSave(validatedData);
      res.status(201).json(save);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid save data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create save" });
    }
  });

  app.delete("/api/saves/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteSave(req.params.id);
      if (!deleted) {
        return res.status(404).json({ message: "Save not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete save" });
    }
  });

  // Netrunning routes
  app.get("/api/netrunning/session/:characterId", async (req, res) => {
    try {
      const session = await storage.getActiveNetrunSession(req.params.characterId);
      if (!session) {
        return res.status(404).json({ message: "No active netrunning session found" });
      }
      res.json(session);
    } catch (error) {
      res.status(500).json({ message: "Failed to get netrunning session" });
    }
  });

  app.post("/api/netrunning/session", async (req, res) => {
    try {
      const validatedData = insertNetrunSessionSchema.parse(req.body);
      const session = await storage.createNetrunSession(validatedData);
      res.status(201).json(session);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid netrun session data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create netrunning session" });
    }
  });

  app.patch("/api/netrunning/session/:id", async (req, res) => {
    try {
      const partialData = insertNetrunSessionSchema.partial().parse(req.body);
      const session = await storage.updateNetrunSession(req.params.id, partialData);
      if (!session) {
        return res.status(404).json({ message: "Netrunning session not found" });
      }
      res.json(session);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid netrun session data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update netrunning session" });
    }
  });

  app.delete("/api/netrunning/session/:id", async (req, res) => {
    try {
      const ended = await storage.endNetrunSession(req.params.id);
      if (!ended) {
        return res.status(404).json({ message: "Netrunning session not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to end netrunning session" });
    }
  });

  // Cyberware catalog routes
  app.get("/api/cyberware", async (req, res) => {
    try {
      // Seed catalog if empty
      await storage.seedCyberwareCatalog();
      
      const category = req.query.category as string;
      let cyberware;
      
      if (category) {
        cyberware = await storage.getCyberwareByCategory(category);
      } else {
        cyberware = await storage.getAllCyberware();
      }
      
      res.json(cyberware);
    } catch (error) {
      res.status(500).json({ message: "Failed to get cyberware catalog" });
    }
  });

  app.get("/api/cyberware/:id", async (req, res) => {
    try {
      const cyberware = await storage.getCyberware(req.params.id);
      if (!cyberware) {
        return res.status(404).json({ message: "Cyberware not found" });
      }
      res.json(cyberware);
    } catch (error) {
      res.status(500).json({ message: "Failed to get cyberware" });
    }
  });

  // Cyberware installation routes
  app.get("/api/characters/:characterId/cyberware/installations", async (req, res) => {
    try {
      const installations = await storage.getCharacterInstallations(req.params.characterId);
      res.json(installations);
    } catch (error) {
      res.status(500).json({ message: "Failed to get character installations" });
    }
  });

  app.post("/api/characters/:characterId/cyberware/install", async (req, res) => {
    try {
      const characterId = req.params.characterId;
      const { cyberwareId, options } = req.body;
      
      // Validate input - only accept cyberwareId and options
      const validatedInput = z.object({
        cyberwareId: z.string(),
        options: z.object({
          useStreetDoc: z.boolean().default(false),
          rushJob: z.boolean().default(false),
          qualityClinic: z.boolean().default(false),
          anesthesia: z.boolean().default(true),
        })
      }).parse({ cyberwareId, options });

      // Perform server-side installation with validation and atomic transaction
      const result = await storage.performCyberwareInstallation(
        characterId, 
        validatedInput.cyberwareId, 
        validatedInput.options
      );
      
      res.status(201).json(result);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid installation data", errors: error.errors });
      }
      // Handle specific business logic errors
      if (error instanceof Error) {
        if (error.message.includes("Character not found")) {
          return res.status(404).json({ message: "Character not found" });
        }
        if (error.message.includes("Cyberware not found")) {
          return res.status(404).json({ message: "Cyberware not found" });
        }
        if (error.message.includes("Insufficient funds")) {
          return res.status(400).json({ message: "Insufficient funds for installation" });
        }
        if (error.message.includes("Insufficient humanity")) {
          return res.status(400).json({ message: "Insufficient humanity for installation" });
        }
      }
      res.status(500).json({ message: "Failed to install cyberware" });
    }
  });

  app.patch("/api/cyberware/installations/:id", async (req, res) => {
    try {
      const partialData = insertCyberwareInstallationSchema.partial().parse(req.body);
      const installation = await storage.updateInstallation(req.params.id, partialData);
      if (!installation) {
        return res.status(404).json({ message: "Installation not found" });
      }
      res.json(installation);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid installation data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update installation" });
    }
  });

  // Seed cyberware catalog route (for admin use)
  app.post("/api/cyberware/seed", async (req, res) => {
    try {
      const seeded = await storage.seedCyberwareCatalog();
      if (seeded) {
        res.json({ message: "Cyberware catalog seeded successfully" });
      } else {
        res.status(500).json({ message: "Failed to seed cyberware catalog" });
      }
    } catch (error) {
      res.status(500).json({ message: "Failed to seed cyberware catalog" });
    }
  });

  // GitHub deployment route
  app.post("/api/deploy/github", async (req, res) => {
    try {
      const result = await deployToGitHub();
      
      if (result.success) {
        res.json({
          message: "Successfully deployed to GitHub!",
          repoUrl: result.repoUrl,
          steps: result.steps
        });
      } else {
        res.status(500).json({
          message: "Deployment failed",
          error: result.error,
          steps: result.steps
        });
      }
    } catch (error: any) {
      res.status(500).json({ 
        message: "Failed to deploy to GitHub",
        error: error.message 
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
