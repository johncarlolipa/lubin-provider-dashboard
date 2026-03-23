// ─── Shared types ─────────────────────────────────────────────────────────────

export type SessionType = "one-on-one" | "group";

export type SocialPlatform = "facebook" | "twitter" | "instagram" | "youtube" | "linkedin";

export interface SocialLink {
  id: number;
  platform: SocialPlatform;
  url: string;
}

export type MainTab = "services" | "availability" | "appointments" | "works" | "about";

export type ServiceTab = "active" | "archive" | "organize" | "add";

export interface Service {
  id: number;
  title: string;
  price: string;
  priceLabel?: string;
  duration: string;
  sessionType: SessionType;
  description: string;
  included: string[];
  whatToExpect?: string[];
  whoIsThisFor?: string;
}

export interface DaySchedule {
  day: string;
  enabled: boolean;
  startTime: string;
  endTime: string;
}
