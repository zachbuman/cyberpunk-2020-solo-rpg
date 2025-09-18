import { useState, useMemo } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useGameState } from "@/hooks/use-game-state";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { CyberwareUtils } from "@shared/cyberware-installation";
import type { CyberwareCatalogItem, Character, Skills } from "@shared/schema";
import { AlertTriangle, Zap, Eye, Cpu, Swords, DollarSign, Clock, Heart, Shield } from "lucide-react";

interface CyberwareShopProps {
  character: Character;
}

interface InstallationOptions {
  useStreetDoc: boolean;
  rushJob: boolean;
  qualityClinic: boolean;
  anesthesia: boolean;
}

export default function CyberwareShop({ character }: CyberwareShopProps) {
  const { updateCharacter } = useGameState();
  const { toast } = useToast();
  
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("name");
  const [selectedCyberware, setSelectedCyberware] = useState<CyberwareCatalogItem | null>(null);
  const [installationOptions, setInstallationOptions] = useState<InstallationOptions>({
    useStreetDoc: false,
    rushJob: false,
    qualityClinic: false,
    anesthesia: true
  });
  const [showInstallDialog, setShowInstallDialog] = useState(false);

  // Fetch cyberware catalog
  const { data: cyberware = [], isLoading } = useQuery<CyberwareCatalogItem[]>({
    queryKey: ["/api/cyberware", selectedCategory !== "all" ? selectedCategory : undefined],
  });

  // Install cyberware mutation
  const installCyberwareMutation = useMutation({
    mutationFn: async (data: { cyberwareId: string; options: InstallationOptions }) => {
      // Send only cyberwareId and options to server - let server handle all calculations
      const response = await apiRequest("POST", `/api/characters/${character.id}/cyberware/install`, {
        cyberwareId: data.cyberwareId,
        options: data.options
      });
      
      return response;
    },
    onSuccess: (response) => {
      // Server returns the complete result - trust it completely
      const { updatedCharacter, installationResult } = response;
      updateCharacter(updatedCharacter);
      
      toast({
        title: installationResult.success ? "Installation Complete!" : "Installation Failed!",
        description: `Installation quality: ${installationResult.quality}. ${installationResult.complications.length > 0 ? 'Complications occurred.' : 'No complications.'}`,
        variant: installationResult.success ? "default" : "destructive"
      });
      
      queryClient.invalidateQueries({ queryKey: ["/api/characters", character.id] });
      setShowInstallDialog(false);
      setSelectedCyberware(null);
    },
    onError: (error) => {
      toast({
        title: "Installation Error",
        description: "Failed to install cyberware. Please try again.",
        variant: "destructive"
      });
    }
  });

  // Filter and sort cyberware
  const filteredCyberware = useMemo(() => {
    let filtered = cyberware;
    
    if (selectedCategory !== "all") {
      filtered = filtered.filter(item => item.category === selectedCategory);
    }
    
    // Sort cyberware
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name);
        case "cost":
          return a.cost - b.cost;
        case "humanity":
          return a.humanityCost - b.humanityCost;
        case "difficulty":
          return a.installationDifficulty - b.installationDifficulty;
        default:
          return 0;
      }
    });
    
    return filtered;
  }, [cyberware, selectedCategory, sortBy]);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "neural": return <Cpu className="w-4 h-4" />;
      case "body": return <Zap className="w-4 h-4" />;
      case "sensory": return <Eye className="w-4 h-4" />;
      case "weapons": return <Swords className="w-4 h-4" />;
      default: return <Cpu className="w-4 h-4" />;
    }
  };

  const getAvailabilityColor = (availability: string) => {
    switch (availability) {
      case "C": return "bg-green-600";
      case "R": return "bg-yellow-600";
      case "P": return "bg-orange-600";
      case "E": return "bg-red-600";
      default: return "bg-gray-600";
    }
  };

  const canAfford = (item: CyberwareCatalogItem) => {
    const estimatedCost = CyberwareUtils.estimateInstallationCost(item, installationOptions);
    return (character.eurodollars ?? 0) >= estimatedCost;
  };

  const hasEnoughHumanity = (item: CyberwareCatalogItem) => {
    return character.humanity > item.humanityCost;
  };

  const skills = character.skills as Skills;
  const medicalSkill = skills.medical || 0;

  if (isLoading) {
    return (
      <Card className="cyber-panel">
        <CardContent className="p-6">
          <div className="text-center terminal-text">
            ACCESSING CYBERWARE CATALOG...
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="cyber-panel">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-primary neon-glow flex items-center gap-2">
            <Cpu className="w-6 h-6" />
            CYBERWARE EMPORIUM
          </CardTitle>
          <div className="text-sm text-muted-foreground">
            "Upgrade your body, expand your possibilities"
          </div>
        </CardHeader>
      </Card>

      {/* Character Status */}
      <Card className="cyber-panel">
        <CardContent className="p-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-accent" />
              <span className="terminal-text">Funds: {(character.eurodollars ?? 0).toLocaleString()}€$</span>
            </div>
            <div className="flex items-center gap-2">
              <Heart className="w-4 h-4 text-secondary" />
              <span className="terminal-text">Humanity: {character.humanity}/{character.maxHumanity}</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-primary" />
              <span className="terminal-text">Medical Skill: {medicalSkill}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-muted-foreground" />
              <span className="terminal-text">Status: Ready</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Controls */}
      <div className="flex flex-wrap gap-4">
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-48" data-testid="select-category">
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="neural">Neural</SelectItem>
            <SelectItem value="body">Body</SelectItem>
            <SelectItem value="sensory">Sensory</SelectItem>
            <SelectItem value="weapons">Weapons</SelectItem>
          </SelectContent>
        </Select>

        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-48" data-testid="select-sort">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="name">Name</SelectItem>
            <SelectItem value="cost">Cost</SelectItem>
            <SelectItem value="humanity">Humanity Cost</SelectItem>
            <SelectItem value="difficulty">Difficulty</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Cyberware Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCyberware.map((item) => (
          <Card key={item.id} className="cyber-panel hover:border-primary/50 transition-colors" data-testid={`cyberware-${item.id}`}>
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  {getCategoryIcon(item.category)}
                  <CardTitle className="text-lg text-accent">{item.name}</CardTitle>
                </div>
                <Badge className={`${getAvailabilityColor(item.availability)} text-white`}>
                  {item.availability}
                </Badge>
              </div>
              <div className="text-xs text-muted-foreground uppercase">
                {item.category} • {item.subcategory}
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-sm text-foreground">
                {item.description}
              </div>
              
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="terminal-text">
                  Cost: {item.cost.toLocaleString()}€$
                </div>
                <div className="terminal-text text-secondary">
                  Humanity: -{item.humanityCost}
                </div>
                <div className="terminal-text">
                  Difficulty: {item.installationDifficulty}
                </div>
                <div className="terminal-text">
                  Surgery: {item.surgeryTime}min
                </div>
              </div>

              {/* Game Effects */}
              {Object.keys(item.gameEffects?.statBonuses || {}).length > 0 && (
                <div className="text-xs">
                  <div className="text-accent font-semibold">Stat Bonuses:</div>
                  <div className="terminal-text">
                    {Object.entries(item.gameEffects.statBonuses).map(([stat, bonus]) => 
                      `${stat}: +${bonus}`
                    ).join(", ")}
                  </div>
                </div>
              )}

              {item.gameEffects?.specialAbilities?.length > 0 && (
                <div className="text-xs">
                  <div className="text-accent font-semibold">Abilities:</div>
                  <div className="terminal-text">
                    {item.gameEffects.specialAbilities.join(", ")}
                  </div>
                </div>
              )}

              {/* Affordability Check */}
              <div className="space-y-1">
                {!canAfford(item) && (
                  <Alert className="py-2">
                    <AlertTriangle className="h-3 w-3" />
                    <AlertDescription className="text-xs">
                      Insufficient funds
                    </AlertDescription>
                  </Alert>
                )}
                
                {!hasEnoughHumanity(item) && (
                  <Alert className="py-2" variant="destructive">
                    <AlertTriangle className="h-3 w-3" />
                    <AlertDescription className="text-xs">
                      Insufficient humanity
                    </AlertDescription>
                  </Alert>
                )}
              </div>

              <Button
                className="w-full cyber-button"
                onClick={() => {
                  setSelectedCyberware(item);
                  setShowInstallDialog(true);
                }}
                disabled={!canAfford(item) || !hasEnoughHumanity(item)}
                data-testid={`button-install-${item.id}`}
              >
                INSTALL CYBERWARE
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredCyberware.length === 0 && (
        <Card className="cyber-panel">
          <CardContent className="p-6 text-center">
            <div className="terminal-text text-muted-foreground">
              No cyberware found matching your criteria.
            </div>
          </CardContent>
        </Card>
      )}

      {/* Installation Dialog */}
      <Dialog open={showInstallDialog} onOpenChange={setShowInstallDialog}>
        <DialogContent className="cyber-panel max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-primary neon-glow">
              Install {selectedCyberware?.name}
            </DialogTitle>
          </DialogHeader>
          
          {selectedCyberware && (
            <div className="space-y-4">
              <div className="text-sm text-foreground">
                {selectedCyberware.description}
              </div>

              {/* Installation Options */}
              <div className="space-y-3">
                <h4 className="text-accent font-semibold">Installation Options</h4>
                
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="streetDoc"
                      checked={installationOptions.useStreetDoc}
                      onCheckedChange={(checked) =>
                        setInstallationOptions(prev => ({ ...prev, useStreetDoc: !!checked }))
                      }
                      data-testid="checkbox-street-doc"
                    />
                    <label htmlFor="streetDoc" className="text-sm">
                      Street Doc (40% discount, +3 difficulty)
                    </label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="qualityClinic"
                      checked={installationOptions.qualityClinic}
                      onCheckedChange={(checked) =>
                        setInstallationOptions(prev => ({ ...prev, qualityClinic: !!checked }))
                      }
                      data-testid="checkbox-quality-clinic"
                    />
                    <label htmlFor="qualityClinic" className="text-sm">
                      Quality Clinic (80% markup, -2 difficulty)
                    </label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="rushJob"
                      checked={installationOptions.rushJob}
                      onCheckedChange={(checked) =>
                        setInstallationOptions(prev => ({ ...prev, rushJob: !!checked }))
                      }
                      data-testid="checkbox-rush-job"
                    />
                    <label htmlFor="rushJob" className="text-sm">
                      Rush Job (50% surcharge, +4 difficulty)
                    </label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="anesthesia"
                      checked={installationOptions.anesthesia}
                      onCheckedChange={(checked) =>
                        setInstallationOptions(prev => ({ ...prev, anesthesia: !!checked }))
                      }
                      data-testid="checkbox-anesthesia"
                    />
                    <label htmlFor="anesthesia" className="text-sm">
                      Anesthesia (200€$ extra, -1 difficulty)
                    </label>
                  </div>
                </div>
              </div>

              {/* Cost Breakdown */}
              <div className="space-y-2 p-3 bg-muted/10 rounded">
                <h4 className="text-accent font-semibold">Cost Breakdown</h4>
                <div className="text-sm space-y-1">
                  <div className="flex justify-between">
                    <span>Base Cost:</span>
                    <span className="terminal-text">{selectedCyberware.cost.toLocaleString()}€$</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Estimated Total:</span>
                    <span className="terminal-text text-accent">
                      {CyberwareUtils.estimateInstallationCost(selectedCyberware, installationOptions).toLocaleString()}€$
                    </span>
                  </div>
                </div>
              </div>

              {/* Risk Assessment */}
              <div className="space-y-2 p-3 bg-destructive/10 rounded">
                <h4 className="text-destructive font-semibold">Risk Assessment</h4>
                <div className="text-sm space-y-1">
                  <div className="flex justify-between">
                    <span>Humanity Loss:</span>
                    <span className="text-destructive">-{selectedCyberware.humanityCost}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Installation Difficulty:</span>
                    <span className="text-destructive">{selectedCyberware.installationDifficulty}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Your Medical Skill:</span>
                    <span className={medicalSkill >= selectedCyberware.installationDifficulty ? "text-accent" : "text-destructive"}>
                      {medicalSkill}
                    </span>
                  </div>
                </div>
              </div>

              {/* Warnings */}
              {character.humanity - selectedCyberware.humanityCost <= 20 && (
                <Alert variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    WARNING: This installation will bring you dangerously close to cyberpsychosis!
                  </AlertDescription>
                </Alert>
              )}

              {medicalSkill < selectedCyberware.installationDifficulty - 5 && (
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    Your medical skill is significantly below the recommended level. High risk of complications.
                  </AlertDescription>
                </Alert>
              )}
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowInstallDialog(false)}
              data-testid="button-cancel-install"
            >
              Cancel
            </Button>
            <Button
              className="cyber-button"
              onClick={() => {
                if (selectedCyberware) {
                  installCyberwareMutation.mutate({
                    cyberwareId: selectedCyberware.id,
                    options: installationOptions
                  });
                }
              }}
              disabled={installCyberwareMutation.isPending}
              data-testid="button-confirm-install"
            >
              {installCyberwareMutation.isPending ? "INSTALLING..." : "PROCEED WITH INSTALLATION"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}