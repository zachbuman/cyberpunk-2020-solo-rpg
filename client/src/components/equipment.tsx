import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Character } from "@shared/schema";

interface EquipmentProps {
  character: Character;
}

export default function Equipment({ character }: EquipmentProps) {
  const equipment = character.equipment as any;
  const cyberware = character.cyberware as any;

  return (
    <Card className="cyber-panel">
      <CardHeader>
        <CardTitle className="text-lg font-bold text-primary neon-glow">
          EQUIPMENT
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="border-b border-border pb-3">
          <h4 className="text-secondary text-sm font-semibold mb-2">WEAPONS</h4>
          <div className="space-y-2">
            {equipment.weapons.map((weapon: any, index: number) => (
              <div key={index} className="flex justify-between items-center p-2 bg-muted/10 rounded" data-testid={`weapon-${index}`}>
                <div>
                  <span className="text-sm font-medium">{weapon.name}</span>
                  <div className="terminal-text text-xs">
                    WA: {weapon.accuracy >= 0 ? '+' : ''}{weapon.accuracy}, CONC: {weapon.concealment}, AVAIL: {weapon.availability}, DMG: {weapon.damage}
                  </div>
                </div>
                {weapon.rof && (
                  <span className="text-accent text-xs">ROF: {weapon.rof}</span>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="border-b border-border pb-3">
          <h4 className="text-secondary text-sm font-semibold mb-2">ARMOR</h4>
          <div className="space-y-2">
            {equipment.armor.map((armor: any, index: number) => (
              <div key={index} className="p-2 bg-muted/10 rounded" data-testid={`armor-${index}`}>
                <span className="text-sm font-medium">{armor.name}</span>
                <div className="terminal-text text-xs">SP: {armor.sp}, EV: {armor.ev}, COST: {armor.cost}€$</div>
              </div>
            ))}
          </div>
        </div>

        {cyberware.implants.length > 0 && (
          <div className="border-b border-border pb-3">
            <h4 className="text-secondary text-sm font-semibold mb-2">CYBERWARE</h4>
            <div className="space-y-2">
              {cyberware.implants.map((implant: any, index: number) => (
                <div key={index} className="p-2 bg-muted/10 rounded" data-testid={`cyberware-${index}`}>
                  <span className="text-sm font-medium text-accent">{implant.name}</span>
                  <div className="terminal-text text-xs">{implant.effects}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div>
          <h4 className="text-secondary text-sm font-semibold mb-2">GEAR</h4>
          <div className="terminal-text text-xs space-y-1">
            {equipment.gear.map((item: any, index: number) => (
              <div key={index} data-testid={`gear-${index}`}>• {item.name}</div>
            ))}
            <div data-testid="text-eurodollars">• {(character.eurodollars || 0).toLocaleString()} Eurodollars</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
