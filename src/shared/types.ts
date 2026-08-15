export interface AdminUser {
  id: number;
  email: string;
  role: "admin";
  first_name?: string;
  last_name?: string;
  profile_image?: string;
  // TEMP: not part of the real /profile/ response yet — local-only until backend supports it.
  securityCode?: number;
}

export type NavKey = "statistics" | "subjects" | "users" | "stories";
