import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import type { Character, GameState, InsertSave } from "@shared/schema";

const saveFormSchema = z.object({
  name: z.string().min(1, "Save name is required").max(50, "Save name must be 50 characters or less"),
  description: z.string().max(200, "Description must be 200 characters or less").optional(),
});

type SaveFormData = z.infer<typeof saveFormSchema>;

interface SaveGameDialogProps {
  isOpen: boolean;
  onClose: () => void;
  character: Character;
  gameState: GameState;
}

export default function SaveGameDialog({ isOpen, onClose, character, gameState }: SaveGameDialogProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const form = useForm<SaveFormData>({
    resolver: zodResolver(saveFormSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const createSaveMutation = useMutation({
    mutationFn: async (saveData: InsertSave) => {
      const response = await apiRequest("POST", "/api/saves", saveData);
      return response.json();
    },
    onSuccess: () => {
      // Invalidate saves list to show the new save
      queryClient.invalidateQueries({ queryKey: ["/api/saves", character.id] });
      
      form.reset();
      onClose();
      
      toast({
        title: "Game Saved",
        description: "Your game has been successfully saved.",
      });
    },
    onError: (error: any) => {
      console.error("Save error:", error);
      toast({
        title: "Save Failed",
        description: "Failed to save game. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSave = async (data: SaveFormData) => {
    if (!character || !gameState) {
      toast({
        title: "Error",
        description: "Cannot save: missing character or game state data.",
        variant: "destructive",
      });
      return;
    }

    try {
      const saveData: InsertSave = {
        characterId: character.id,
        name: data.name,
        description: data.description || undefined,
        characterSnapshot: character as any, // Store complete character state
        gameStateSnapshot: gameState as any, // Store complete game state
      };

      await createSaveMutation.mutateAsync(saveData);
    } catch (error) {
      console.error("Error creating save:", error);
    }
  };

  const handleClose = () => {
    form.reset();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md" data-testid="dialog-save-game">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold neon-glow text-primary flex items-center gap-2">
            <Save className="h-5 w-5" />
            SAVE GAME
          </DialogTitle>
          <DialogDescription>
            Create a save point to preserve your current progress.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSave)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Save Name *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter save name..."
                      className="cyber-input"
                      data-testid="input-save-name"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    A descriptive name for this save slot.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Add notes about this save..."
                      className="cyber-input resize-none"
                      rows={3}
                      data-testid="input-save-description"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Optional notes about your progress or situation.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button 
                type="button" 
                variant="outline" 
                onClick={handleClose}
                disabled={createSaveMutation.isPending}
                data-testid="button-cancel-save"
              >
                CANCEL
              </Button>
              <Button
                type="submit"
                className="cyber-button"
                disabled={createSaveMutation.isPending}
                data-testid="button-confirm-save"
              >
                {createSaveMutation.isPending ? (
                  <>
                    <Save className="h-4 w-4 mr-2 animate-spin" />
                    SAVING...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    SAVE GAME
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}