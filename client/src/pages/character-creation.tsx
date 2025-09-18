import { useState } from "react";
import { useLocation } from "wouter";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UserPlus } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useGameState } from "@/hooks/use-game-state";
import { ARCHETYPES } from "@/lib/game-data";
import type { InsertCharacter } from "@shared/schema";

export default function CharacterCreation() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { setCurrentCharacter } = useGameState();
  const [name, setName] = useState("");
  const [archetype, setArchetype] = useState("");
  const [background, setBackground] = useState("");

  const createCharacterMutation = useMutation({
    mutationFn: async (character: InsertCharacter) => {
      const response = await apiRequest("POST", "/api/characters", character);
      return response.json();
    },
    onSuccess: (newCharacter) => {
      // Invalidate characters list to show the new character
      queryClient.invalidateQueries({ queryKey: ["/api/characters"] });
      
      // Set the new character as the current one
      setCurrentCharacter(newCharacter.id);
      
      toast({
        title: "Character Created",
        description: "Your cyberpunk character has been successfully created.",
      });
      
      // Redirect to characters list to show the new character
      setLocation("/characters");
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create character. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !archetype) {
      toast({
        title: "Missing Information",
        description: "Please provide a name and select an archetype.",
        variant: "destructive",
      });
      return;
    }

    const selectedArchetype = ARCHETYPES.find(arch => arch.name.toLowerCase() === archetype);
    if (!selectedArchetype) {
      toast({
        title: "Invalid Archetype",
        description: "Please select a valid archetype.",
        variant: "destructive",
      });
      return;
    }

    const character: InsertCharacter = {
      name,
      archetype,
      background: background || `A ${archetype} from the streets of Night City.`,
      stats: selectedArchetype.baseStats,
      skills: selectedArchetype.baseSkills,
      equipment: selectedArchetype.startingEquipment,
      cyberware: { implants: [] },
      health: selectedArchetype.baseStats.body * 5,
      maxHealth: selectedArchetype.baseStats.body * 5,
      humanity: selectedArchetype.baseStats.empathy * 10,
      maxHumanity: selectedArchetype.baseStats.empathy * 10,
      reputation: 0,
      streetCred: 0,
      eurodollars: 2000,
    };

    createCharacterMutation.mutate(character);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <Card className="cyber-panel w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-primary neon-glow text-center">
            CHARACTER CREATION
          </CardTitle>
          <p className="text-muted-foreground text-center terminal-text">
            Create your cyberpunk persona for the dark future
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name" className="terminal-text">CHARACTER NAME</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your character's name..."
                className="bg-input border-border"
                data-testid="input-character-name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="archetype" className="terminal-text">ARCHETYPE</Label>
              <Select value={archetype} onValueChange={setArchetype}>
                <SelectTrigger className="bg-input border-border" data-testid="select-archetype">
                  <SelectValue placeholder="Select your role..." />
                </SelectTrigger>
                <SelectContent className="bg-card border-border">
                  {ARCHETYPES.map((arch) => (
                    <SelectItem key={arch.name} value={arch.name.toLowerCase()}>
                      <div>
                        <div className="font-semibold text-primary">{arch.name}</div>
                        <div className="text-sm text-muted-foreground">{arch.description}</div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {archetype && (
              <div className="cyber-panel p-4 rounded border-accent">
                <h3 className="text-accent font-semibold mb-2">
                  {ARCHETYPES.find(arch => arch.name.toLowerCase() === archetype)?.name} DETAILS
                </h3>
                <p className="text-sm text-muted-foreground mb-3">
                  {ARCHETYPES.find(arch => arch.name.toLowerCase() === archetype)?.specialAbility}
                </p>
                <div className="text-xs terminal-text">
                  <strong>Starting Skills:</strong> {ARCHETYPES.find(arch => arch.name.toLowerCase() === archetype)?.primarySkills.join(", ")}
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="background" className="terminal-text">BACKGROUND (Optional)</Label>
              <Textarea
                id="background"
                value={background}
                onChange={(e) => setBackground(e.target.value)}
                placeholder="Describe your character's background and history..."
                className="bg-input border-border h-32"
                data-testid="textarea-background"
              />
            </div>

            <Button
              type="submit"
              className="cyber-button w-full py-3 text-lg font-semibold"
              disabled={createCharacterMutation.isPending}
              data-testid="button-create-character"
            >
              <UserPlus className="h-5 w-5 mr-2" />
              {createCharacterMutation.isPending ? "CREATING..." : "CREATE CHARACTER"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
