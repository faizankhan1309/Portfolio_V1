export interface Project {
  id: string;
  title: string;
  description: string;
  category: 'ai' | 'design' | 'web';
  tags: string[];
  thumbnail?: string;
  link?: string;
}

export interface Experience {
  id: string;
  role: string;
  company: string;
  period: string;
  description: string;
}

export interface Skill {
  name: string;
  category: 'ai' | 'web' | 'design' | 'tools';
  proficiency: number;
  icon?: string;
}

export interface Achievement {
  id: string;
  title: string;
  impact: string;
  icon: string;
}
