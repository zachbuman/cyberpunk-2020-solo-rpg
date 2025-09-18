import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { format } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Trash2, Calendar, FileText, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import type { Save, Character, GameState } from "@shared/schema";

interface LoadGameModalProps {
  isOpen: boolean;
  onClose: () => void;
  characterId: string;
  onLoadGame: (characterSnapshot: Character, gameStateSnapshot: GameState) => void;
}

export default function LoadGameModal({ isOpen, onClose, characterId, onLoadGame }: LoadGameModalProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedSave, setSelectedSave] = useState<Save | null>(null);

  // Fetch saves for the current character
  const { data: saves, isLoading } = useQuery<Save[]>({
    queryKey: ["/api/saves", characterId],
    enabled: isOpen && !!characterId,
  });

  // Delete save mutation
  const deleteSaveMutation = useMutation({
    mutationFn: async (saveId: string) => {
      const response = await apiRequest("DELETE", `/api/saves/${saveId}`);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/saves", characterId] });
      toast({
        title: "Save Deleted",
        description: "The save slot has been successfully deleted.",
      });
      setSelectedSave(null);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete save. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleLoadGame = () => {
    if (!selectedSave) return;

    try {
      // Parse the snapshots and load the game
      const characterSnapshot = selectedSave.characterSnapshot as Character;
      const gameStateSnapshot = selectedSave.gameStateSnapshot as GameState;
      
      onLoadGame(characterSnapshot, gameStateSnapshot);
      onClose();
      
      toast({
        title: "Game Loaded",
        description: `Successfully loaded save: ${selectedSave.name}`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load game. Save data may be corrupted.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteSave = (save: Save, e: React.MouseEvent) => {
    e.stopPropagation();
    deleteSaveMutation.mutate(save.id);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh]" data-testid="modal-load-game">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold neon-glow text-primary">
            LOAD GAME
          </DialogTitle>
          <DialogDescription>
            Select a save slot to load your previous game state.
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="flex-1 max-h-96">
          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-24 w-full" />
              ))}
            </div>
          ) : !saves || saves.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-lg font-medium">No Saves Found</p>
              <p className="text-muted-foreground">
                Create your first save by clicking the SAVE button in the game.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {saves.map((save: Save) => (
                <Card 
                  key={save.id} 
                  className={`cursor-pointer transition-all hover:bg-accent/50 ${
                    selectedSave?.id === save.id ? 'ring-2 ring-primary bg-accent/30' : ''
                  }`}
                  onClick={() => setSelectedSave(save)}
                  data-testid={`save-slot-${save.id}`}
                >
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg flex items-center gap-2">
                          <User className="h-4 w-4" />
                          {save.name}
                        </CardTitle>
                        <div className="flex items-center gap-4 mt-1">
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Calendar className="h-3 w-3" />
                            {save.createdAt ? format(new Date(save.createdAt), "MMM dd, yyyy 'at' HH:mm") : "Unknown date"}
                          </div>
                          <Badge variant="outline" className="text-xs">
                            {(save.characterSnapshot as Character).archetype}
                          </Badge>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                        onClick={(e) => handleDeleteSave(save, e)}
                        disabled={deleteSaveMutation.isPending}
                        data-testid={`button-delete-save-${save.id}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  {save.description && (
                    <CardContent className="pt-0">
                      <CardDescription className="text-sm">
                        {save.description}
                      </CardDescription>
                    </CardContent>
                  )}
                </Card>
              ))}
            </div>
          )}
        </ScrollArea>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} data-testid="button-cancel-load">
            CANCEL
          </Button>
          <Button 
            onClick={handleLoadGame} 
            disabled={!selectedSave}
            className="cyber-button"
            data-testid="button-confirm-load"
          >
            LOAD GAME
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}