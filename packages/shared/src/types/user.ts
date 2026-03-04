export type UserRole = "operator" | "viewer" | "client"

// Stored in public.profiles, linked 1-to-1 with Supabase auth.users
export interface Profile {
  id: string          // matches auth.users.id
  email: string
  role: UserRole
  fullName: string | null
  avatarUrl: string | null
  createdAt: string
}