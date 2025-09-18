import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Character } from "@shared/schema";

interface SkillsProps {
  character: Character;
}

export default function Skills({ character }: SkillsProps) {
  const skills = character.skills as any;

  const specialAbilities = {
    combatSense: skills.combatSense,
  };

  const combatSkills = {
    rifle: skills.rifle,
    handgun: skills.handgun,
    brawling: skills.brawling,
    martialArts: skills.martialArts,
    dodgeEscape: skills.dodgeEscape,
  };

  const technicalSkills = {
    electronics: skills.electronics,
    securityTech: skills.securityTech,
  };

  const socialSkills = {
    streetwise: skills.streetwise,
    intimidate: skills.intimidate,
    fastTalk: skills.fastTalk,
    persuasion: skills.persuasion,
  };

  const otherSkills = {
    athletics: skills.athletics,
    awareness: skills.awareness,
    driving: skills.driving,
    stealth: skills.stealth,
  };

  const renderSkillSection = (title: string, skillsObj: any, testIdPrefix: string) => {
    const filteredSkills = Object.entries(skillsObj).filter(([, value]) => (value as number) > 0);
    
    if (filteredSkills.length === 0) return null;

    return (
      <div className="border-b border-border pb-3">
        <h4 className="text-secondary text-sm font-semibold mb-2">{title}</h4>
        <div className="space-y-2">
          {filteredSkills.map(([skillName, value]) => (
            <div key={skillName} className="flex justify-between items-center">
              <span className="terminal-text text-sm capitalize">
                {skillName.replace(/([A-Z])/g, ' $1').trim()}
              </span>
              <span className="text-accent font-bold" data-testid={`${testIdPrefix}-${skillName}`}>
                +{value as number}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <Card className="cyber-panel">
      <CardHeader>
        <CardTitle className="text-lg font-bold text-primary neon-glow">
          SKILLS
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {renderSkillSection("SPECIAL ABILITIES", specialAbilities, "skill-special")}
        {renderSkillSection("COMBAT", combatSkills, "skill-combat")}
        {renderSkillSection("TECHNICAL", technicalSkills, "skill-technical")}
        {renderSkillSection("SOCIAL", socialSkills, "skill-social")}
        {renderSkillSection("OTHER", otherSkills, "skill-other")}
      </CardContent>
    </Card>
  );
}
