import { useState, useEffect } from "react";
import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import type { Character, GameState } from "@shared/schema";

export function useGameState() {
  const [currentCharacterId, setCurrentCharacterId] = useState<string | null>(null);
  const queryClient = useQueryClient();

  // Load character ID from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem("currentCharacterId");
    if (stored) {
      setCurrentCharacterId(stored);
    }
  }, []);

  // Fetch current character
  const { data: currentCharacter, isLoading: characterLoading } = useQuery<Character>({
    queryKey: ["/api/characters", currentCharacterId],
    enabled: !!currentCharacterId,
  });

  // Create default game state mutation
  const createDefaultGameStateMutation = useMutation({
    mutationFn: async (characterId: string) => {
      const defaultGameState = {
        characterId,
        currentScene: "securityCheckpoint",
        sceneData: {
          title: "Corporate Extraction",
          location: "Night City Corporate Plaza",
          description: "Your fixer contacted you about a high-paying extraction job."
        },
        combatState: null,
        inCombat: false,
        lastRoll: null
      };
      const response = await apiRequest("POST", "/api/game-state", defaultGameState);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/game-state", currentCharacterId] });
    },
  });

  // Fetch game state with automatic creation if not exists
  const { data: gameState, isLoading: gameStateLoading, error: gameStateError } = useQuery<GameState>({
    queryKey: ["/api/game-state", currentCharacterId],
    enabled: !!currentCharacterId,
    retry: false, // Don't retry 404s
    throwOnError: false, // Handle errors gracefully
  });

  // If game state returns 404, create default one
  React.useEffect(() => {
    if (currentCharacterId && gameStateError && !gameState) {
      // Check if it's a 404 error (more robust detection)
      const errorMessage = (gameStateError as any)?.message || '';
      const isNotFound = errorMessage.includes('404') || 
                        errorMessage.includes('Not Found') ||
                        (gameStateError as any)?.status === 404;
      
      if (isNotFound && !createDefaultGameStateMutation.isPending && !createDefaultGameStateMutation.isSuccess) {
        console.log("Creating default game state for character:", currentCharacterId);
        createDefaultGameStateMutation.mutate(currentCharacterId);
      }
    }
  }, [currentCharacterId, gameStateError, gameState, createDefaultGameStateMutation]);

  // Update character mutation
  const updateCharacterMutation = useMutation({
    mutationFn: async (updates: Partial<Character>) => {
      if (!currentCharacterId) throw new Error("No character selected");
      const response = await apiRequest("PATCH", `/api/characters/${currentCharacterId}`, updates);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/characters", currentCharacterId] });
    },
  });

  // Update game state mutation
  const updateGameStateMutation = useMutation({
    mutationFn: async (updates: Partial<GameState>) => {
      if (!currentCharacterId) throw new Error("No character selected");
      const response = await apiRequest("PATCH", `/api/game-state/${currentCharacterId}`, updates);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/game-state", currentCharacterId] });
    },
  });

  // Async wrapper for game state updates with proper error handling
  const updateGameStateAsync = async (updates: Partial<GameState>) => {
    if (!currentCharacterId) {
      throw new Error("No character selected - please select a character first");
    }
    return await updateGameStateMutation.mutateAsync(updates);
  };

  // Set current character and save to localStorage
  const setCurrentCharacter = (characterId: string) => {
    setCurrentCharacterId(characterId);
    localStorage.setItem("currentCharacterId", characterId);
  };

  return {
    currentCharacter,
    gameState,
    isLoading: characterLoading || gameStateLoading || createDefaultGameStateMutation.isPending,
    setCurrentCharacter,
    updateCharacter: updateCharacterMutation.mutate,
    updateGameState: updateGameStateAsync,
  };
}
