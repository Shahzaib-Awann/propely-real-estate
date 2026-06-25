export type SignInUser = {
  id: number;
  avatar: string | null;
  name: string;
  email: string;
  password: string;
  role: "user" | "admin";
  createdAt: string;
  updatedAt: string | null;
};

/**
 * User data shape (safe version)
 */
export type SafeUser = {
  id: number;
  avatar: string | null;
  avatarPublicId: string | null;
  name: string;
  email: string;
  role: "user" | "admin";
  createdAt: string;
  updatedAt: string | null;
};

/**
 * Full user data (includes password)
 */
export type FullUser = SafeUser & {
  password: string;
};