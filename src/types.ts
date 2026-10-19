export type ArchetypeId = 'saas' | 'agency' | 'ecommerce' | 'fintech';

export type DeviceViewport = 'desktop' | 'tablet' | 'mobile';

export type ThemeStyle = 'obsidian' | 'clean-white' | 'navy' | 'warm-editorial';

export interface Archetype {
  id: ArchetypeId;
  name: string;
  tagline: string;
  description: string;
  industry: string;
  typicalStack: string[];
  features: string[];
  colorPalette: {
    name: string;
    bg: string;
    card: string;
    accent: string;
  };
}

export interface ProjectSpecState {
  projectType: string;
  industry: string;
  features: string[];
  theme: string;
  clientName: string;
  email: string;
  notes: string;
}
