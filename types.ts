export interface Team {
  id: string;
  name: string;
  colors: string[];
  logoUrl?: string;
}

export type AppStep = 'UPLOAD' | 'SELECT_TEAM' | 'GENERATING' | 'RESULT';
