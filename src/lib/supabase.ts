import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase credentials not found. Running in offline mode.');
}

export const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Database types
export interface Profile {
  id: string;
  name: string;
  avatar: string;
  level: number;
  total_stars: number;
  created_at: string;
}

export interface GameProgress {
  id: string;
  user_id: string;
  game_type: string;
  games_played: number;
  correct_answers: number;
  total_answers: number;
  highest_streak: number;
  updated_at: string;
}

export interface Achievement {
  id: string;
  user_id: string;
  achievement: string;
  earned_at: string;
}

// Helper to check if Supabase is available
export const isSupabaseAvailable = () => supabase !== null;
