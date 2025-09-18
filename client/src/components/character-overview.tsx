import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Cpu, Eye, Zap, Swords, AlertTriangle } from "lucide-react";
import type { Character, Cyberware } from "@shared/schema";

interface CharacterOverviewProps {
  character: Character;
}

export default function CharacterOverview({ character }: CharacterOverviewProps) {
  const stats = character.stats as any;
  const cyberware = character.cyberware as Cyberware;
  
  const getCyberwareIcon = (category: string) => {
    switch (category) {
      case "neural": return <Cpu className="w-3 h-3" />;
      case "body": return <Zap className="w-3 h-3" />;
      case "sensory": return <Eye className="w-3 h-3" />;
      case "weapons": return <Swords className="w-3 h-3" />;
      default: return <Cpu className="w-3 h-3" />;
    }
  };

  const getStatBonus = (statName: string): number => {
    let totalBonus = 0;
    cyberware.implants?.forEach(implant => {
      if (implant.isActive && implant.gameEffects?.statBonuses?.[statName]) {
        totalBonus += implant.gameEffects.statBonuses[statName];
      }
    });
    return totalBonus;
  };

  const originalStats = { ...stats };
  // Apply cyberware bonuses to display stats
  cyberware.implants?.forEach(implant => {
    if (implant.isActive && implant.gameEffects?.statBonuses) {
      Object.entries(implant.gameEffects.statBonuses).forEach(([stat, bonus]) => {
        if (stats[stat] !== undefined) {
          stats[stat] = Math.min(10, (originalStats[stat] || 0) + bonus);
        }
      });
    }
  });

  const empathyPenalty = cyberware.psychologicalState?.empathyPenalty || 0;
  if (empathyPenalty > 0 && stats.empathy) {
    stats.empathy = Math.max(1, originalStats.empathy - empathyPenalty);
  }
  
  return (
    <Card className="cyber-panel">
      <CardHeader>
        <CardTitle className="text-lg font-bold text-primary neon-glow">
          CHARACTER PROFILE
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Character Portrait Placeholder */}
        <div className="character-portrait w-32 h-32 mx-auto mb-4 rounded-lg overflow-hidden flex items-center justify-center">
          <div className="text-6xl">🤖</div>
        </div>
        
        <div className="text-center space-y-2">
          <h3 className="text-xl font-semibold text-secondary" data-testid="text-character-name">
            {character.name.toUpperCase()}
          </h3>
          <p className="terminal-text text-accent" data-testid="text-character-archetype">
            {character.archetype.toUpperCase()}
          </p>
          <p className="text-sm text-muted-foreground" data-testid="text-character-reputation">
            Rep: {character.reputation} | Street Cred: {character.streetCred}
          </p>
          
          {/* Cyberpsychosis Warning */}
          {cyberware.psychologicalState?.cyberpsychosisRisk !== "none" && (
            <div className="flex items-center justify-center gap-1 text-xs">
              <AlertTriangle className="w-3 h-3 text-destructive" />
              <span className={
                cyberware.psychologicalState?.cyberpsychosisRisk === "critical" 
                  ? "text-destructive font-bold" 
                  : "text-yellow-500"
              }>
                {cyberware.psychologicalState?.cyberpsychosisRisk.toUpperCase()} CYBERPSYCHOSIS RISK
              </span>
            </div>
          )}
        </div>

        {/* Core Stats */}
        <div className="mt-6 space-y-3">
          {Object.entries(stats).map(([statName, value]) => {
            const bonus = getStatBonus(statName);
            const originalValue = originalStats[statName];
            const penalty = empathyPenalty > 0 && statName === "empathy" ? empathyPenalty : 0;
            
            return (
              <div key={statName} className="flex justify-between items-center">
                <span className="terminal-text text-sm uppercase">
                  {statName.slice(0, 4)}
                </span>
                <div className="stat-bar w-24 h-2 rounded overflow-hidden">
                  <div 
                    className="stat-fill h-full rounded" 
                    style={{ width: `${(value as number) * 10}%` }}
                    data-testid={`stat-bar-${statName}`}
                  />
                </div>
                <div className="flex items-center gap-1 w-8 text-right">
                  <span className="terminal-text text-sm" data-testid={`stat-value-${statName}`}>
                    {value as number}
                  </span>
                  {bonus > 0 && (
                    <Tooltip>
                      <TooltipTrigger>
                        <span className="text-accent text-xs">+{bonus}</span>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Cyberware bonus</p>
                      </TooltipContent>
                    </Tooltip>
                  )}
                  {penalty > 0 && (
                    <Tooltip>
                      <TooltipTrigger>
                        <span className="text-destructive text-xs">-{penalty}</span>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Humanity loss penalty</p>
                      </TooltipContent>
                    </Tooltip>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Installed Cyberware */}
        {cyberware.implants && cyberware.implants.length > 0 && (
          <div className="mt-6 space-y-3">
            <h4 className="text-secondary text-sm font-semibold">INSTALLED CYBERWARE</h4>
            <div className="space-y-2">
              {cyberware.implants.map((implant, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-muted/10 rounded" data-testid={`installed-cyberware-${index}`}>
                  <div className="flex items-center gap-2">
                    {getCyberwareIcon(implant.category)}
                    <span className="text-sm font-medium text-accent">{implant.name}</span>
                    {!implant.isActive && (
                      <Badge variant="destructive" className="text-xs">DAMAGED</Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-1">
                    {implant.installationQuality === "perfect" && (
                      <Badge className="text-xs bg-green-600">PERFECT</Badge>
                    )}
                    {implant.installationQuality === "good" && (
                      <Badge className="text-xs bg-blue-600">GOOD</Badge>
                    )}
                    {implant.installationQuality === "poor" && (
                      <Badge className="text-xs bg-yellow-600">POOR</Badge>
                    )}
                    {implant.installationQuality === "botched" && (
                      <Badge className="text-xs bg-red-600">BOTCHED</Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
            
            {/* Cyberware Summary */}
            <div className="text-xs space-y-1 pt-2 border-t border-border">
              <div className="flex justify-between">
                <span className="terminal-text">Total Humanity Loss:</span>
                <span className="text-destructive">{cyberware.totalHumanityLoss || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="terminal-text">Active Implants:</span>
                <span className="text-accent">{cyberware.implants.filter(i => i.isActive).length}</span>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
