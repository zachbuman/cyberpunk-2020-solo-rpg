import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dices } from "lucide-react";
import type { Character } from "@shared/schema";
import { rollD10, rollD6, rollSkillCheck } from "@/lib/dice";

interface DiceRollerProps {
  character: Character;
}

export default function DiceRoller({ character }: DiceRollerProps) {
  const [lastRoll, setLastRoll] = useState<{ result: number; description: string } | null>(null);
  const [selectedSkill, setSelectedSkill] = useState("");
  
  const skills = character.skills as any;
  const stats = character.stats as any;

  const handleD10Roll = () => {
    const result = rollD10();
    setLastRoll({ result, description: "D10" });
  };

  const handleD6Roll = () => {
    const result = rollD6();
    setLastRoll({ result, description: "D6" });
  };

  const handleSkillCheck = () => {
    if (!selectedSkill) return;
    
    const skillValue = skills[selectedSkill] || 0;
    const result = rollSkillCheck(skillValue);
    setLastRoll({ 
      result, 
      description: `${selectedSkill.toUpperCase()} (${skillValue})` 
    });
  };

  const availableSkills = Object.keys(skills).filter(skill => skills[skill] > 0);

  return (
    <Card className="cyber-panel">
      <CardHeader>
        <CardTitle className="text-lg font-bold text-primary neon-glow">
          DICE SYSTEM
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="dice-container space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Button
              onClick={handleD10Roll}
              className="dice-face aspect-square rounded-lg text-2xl font-bold text-primary hover:animate-pulse-neon"
              data-testid="button-roll-d10"
            >
              D10
            </Button>
            <Button
              onClick={handleD6Roll}
              className="dice-face aspect-square rounded-lg text-2xl font-bold text-secondary hover:animate-pulse-neon"
              data-testid="button-roll-d6"
            >
              D6
            </Button>
          </div>
          
          {lastRoll && (
            <div className="text-center">
              <div className="terminal-text text-xs mb-2">LAST ROLL</div>
              <div className="text-3xl font-bold text-accent neon-glow animate-pulse-neon" data-testid="text-last-roll">
                {lastRoll.result}
              </div>
              <div className="terminal-text text-xs mt-1" data-testid="text-roll-description">
                {lastRoll.description}
              </div>
            </div>
          )}
          
          <div className="space-y-2">
            <Select value={selectedSkill} onValueChange={setSelectedSkill}>
              <SelectTrigger className="w-full bg-input border-border" data-testid="select-skill">
                <SelectValue placeholder="Select skill for check..." />
              </SelectTrigger>
              <SelectContent className="bg-card border-border">
                {availableSkills.map((skill) => (
                  <SelectItem key={skill} value={skill}>
                    <div className="flex justify-between w-full">
                      <span>{skill}</span>
                      <span className="text-accent ml-4">+{skills[skill]}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button 
              onClick={handleSkillCheck}
              disabled={!selectedSkill}
              className="cyber-button w-full"
              data-testid="button-skill-check"
            >
              <Dices className="h-4 w-4 mr-2" />
              SKILL CHECK
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
