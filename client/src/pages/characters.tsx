import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, Plus, Eye } from "lucide-react";
import type { Character } from "@shared/schema";

export default function Characters() {
  const { data: characters, isLoading } = useQuery<Character[]>({
    queryKey: ["/api/characters"],
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-primary text-xl neon-glow">LOADING CHARACTERS...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen scan-lines">
      {/* Navigation */}
      <nav className="cyber-panel border-b border-border p-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <Link href="/">
            <h1 className="text-2xl font-bold neon-glow text-primary glitch-effect cursor-pointer" data-text="CYBERPUNK 2020">
              CYBERPUNK 2020
            </h1>
          </Link>
          <div className="flex items-center space-x-4">
            <Link href="/character-creation">
              <Button className="cyber-button" data-testid="button-create-new-character">
                <Plus className="h-4 w-4 mr-2" />
                NEW CHARACTER
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Character List */}
      <div className="max-w-7xl mx-auto p-6">
        <Card className="cyber-panel mb-6">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-primary neon-glow flex items-center">
              <Users className="h-6 w-6 mr-2" />
              CHARACTER ROSTER
            </CardTitle>
          </CardHeader>
          <CardContent>
            {!characters || characters.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-muted-foreground mb-4">
                  No characters found. Create your first cyberpunk persona.
                </div>
                <Link href="/character-creation">
                  <Button className="cyber-button" data-testid="button-create-first-character">
                    <Plus className="h-4 w-4 mr-2" />
                    CREATE CHARACTER
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {characters.map((character: Character) => (
                  <Card key={character.id} className="cyber-panel border-secondary hover:border-primary transition-colors">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="text-lg font-bold text-primary" data-testid={`text-character-name-${character.id}`}>
                          {character.name.toUpperCase()}
                        </h3>
                        <Badge variant="outline" className="text-accent border-accent" data-testid={`badge-archetype-${character.id}`}>
                          {character.archetype.toUpperCase()}
                        </Badge>
                      </div>
                      
                      <div className="space-y-2 text-sm">
                        <div className="grid grid-cols-3 gap-2 text-xs">
                          <div className="text-center border border-border p-2 rounded">
                            <div className="terminal-text">REF</div>
                            <div className="text-primary font-bold">
                              {(character.stats as any)?.reflexes || 5}
                            </div>
                          </div>
                          <div className="text-center border border-border p-2 rounded">
                            <div className="terminal-text">COOL</div>
                            <div className="text-secondary font-bold">
                              {(character.stats as any)?.cool || 5}
                            </div>
                          </div>
                          <div className="text-center border border-border p-2 rounded">
                            <div className="terminal-text">BODY</div>
                            <div className="text-accent font-bold">
                              {(character.stats as any)?.body || 5}
                            </div>
                          </div>
                        </div>
                        
                        <div className="text-muted-foreground">
                          {character.background ? character.background.substring(0, 80) + '...' : 'No background'}
                        </div>
                      </div>

                      <div className="flex space-x-2 mt-4">
                        <Link href={`/characters/${character.id}`} className="flex-1">
                          <Button className="cyber-button w-full" size="sm" data-testid={`button-view-character-${character.id}`}>
                            <Eye className="h-4 w-4 mr-2" />
                            VIEW
                          </Button>
                        </Link>
                        <Button 
                          className="cyber-button" 
                          size="sm"
                          onClick={() => {
                            localStorage.setItem("currentCharacterId", character.id);
                            window.location.href = "/";
                          }}
                          data-testid={`button-play-as-${character.id}`}
                        >
                          PLAY AS
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}