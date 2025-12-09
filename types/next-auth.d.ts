// types/next-auth.d.ts
import "next-auth";

declare module "next-auth" {
    interface User {
        id: string,
        avatar: string | null,
        name: string,
        email: string,
        role: 'user' | 'admin',
        updatedAt: string | null,
        createdAt: string,
    }

    interface Session {
        user: User;
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        id: string,
        avatar: string | null,
        name: string,
        email: string,
        role: 'user' | 'admin',
        updatedAt: string | null,
        createdAt: string,
    }
}