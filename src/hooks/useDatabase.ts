import { useState, useEffect, useCallback } from 'react';
import { supabase, isSupabaseAvailable } from '../lib/supabase';
import type { Profile, GameProgress } from '../lib/supabase';

// Hook for syncing game progress with Supabase
export const useProgressSync = (userId: string | null) => {
  const [syncing, setSyncing] = useState(false);
  const [lastSyncedAt, setLastSyncedAt] = useState<Date | null>(null);

  // Load progress from database
  const loadProgress = useCallback(async () => {
    if (!supabase || !userId) return null;

    const { data, error } = await supabase
      .from('game_progress')
      .select('*')
      .eq('user_id', userId);

    if (error) {
      console.error('Error loading progress:', error);
      return null;
    }

    // Convert array to record format
    const progress: Record<string, GameProgress> = {};
    data?.forEach((item: GameProgress) => {
      progress[item.game_type] = item;
    });

    return progress;
  }, [userId]);

  // Save progress to database
  const saveProgress = useCallback(async (
    gameType: string,
    stats: {
      gamesPlayed: number;
      correctAnswers: number;
      totalAnswers: number;
      highestStreak: number;
    }
  ) => {
    if (!supabase || !userId) return;

    setSyncing(true);

    const { error } = await supabase
      .from('game_progress')
      .upsert({
        user_id: userId,
        game_type: gameType,
        games_played: stats.gamesPlayed,
        correct_answers: stats.correctAnswers,
        total_answers: stats.totalAnswers,
        highest_streak: stats.highestStreak,
        updated_at: new Date().toISOString(),
      }, {
        onConflict: 'user_id,game_type',
      });

    if (error) {
      console.error('Error saving progress:', error);
    } else {
      setLastSyncedAt(new Date());
    }

    setSyncing(false);
  }, [userId]);

  return { loadProgress, saveProgress, syncing, lastSyncedAt };
};

// Hook for managing achievements
export const useAchievements = (userId: string | null) => {
  const [achievements, setAchievements] = useState<string[]>([]);

  // Load achievements from database
  const loadAchievements = useCallback(async () => {
    if (!supabase || !userId) return [];

    const { data, error } = await supabase
      .from('achievements')
      .select('achievement')
      .eq('user_id', userId);

    if (error) {
      console.error('Error loading achievements:', error);
      return [];
    }

    const list = data?.map((a: { achievement: string }) => a.achievement) || [];
    setAchievements(list);
    return list;
  }, [userId]);

  // Add new achievement
  const addAchievement = useCallback(async (achievement: string) => {
    if (!supabase || !userId) return;

    // Check if already exists
    if (achievements.includes(achievement)) return;

    const { error } = await supabase
      .from('achievements')
      .insert({
        user_id: userId,
        achievement,
      });

    if (error) {
      console.error('Error saving achievement:', error);
    } else {
      setAchievements(prev => [...prev, achievement]);
    }
  }, [userId, achievements]);

  return { achievements, loadAchievements, addAchievement };
};

// Hook for leaderboard
export const useLeaderboard = () => {
  const [leaders, setLeaders] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchLeaderboard = useCallback(async (limit = 10) => {
    if (!supabase) return;

    setLoading(true);

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('total_stars', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching leaderboard:', error);
    } else {
      setLeaders(data as Profile[]);
    }

    setLoading(false);
  }, []);

  useEffect(() => {
    if (isSupabaseAvailable()) {
      fetchLeaderboard();
    }
  }, [fetchLeaderboard]);

  return { leaders, loading, fetchLeaderboard };
};

// Hook to update profile stars
export const useProfileStars = () => {
  const updateStars = useCallback(async (userId: string, totalStars: number, level: number) => {
    if (!supabase) return;

    const { error } = await supabase
      .from('profiles')
      .update({ total_stars: totalStars, level })
      .eq('id', userId);

    if (error) {
      console.error('Error updating stars:', error);
    }
  }, []);

  return { updateStars };
};
