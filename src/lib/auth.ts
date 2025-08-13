import { NextAuthOptions } from 'next-auth'
import GithubProvider from 'next-auth/providers/github'
import GoogleProvider from 'next-auth/providers/google'

declare module 'next-auth' {
  interface Session {
    accessToken?: string
    provider?: string
    user: {
      id: string
      email?: string | null
      name?: string | null
      image?: string | null
      role?: 'user' | 'consultant' | 'admin'
      onboardingCompleted?: boolean
    }
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    accessToken?: string
    provider?: string
    role?: 'user' | 'consultant' | 'admin'
    onboardingCompleted?: boolean
    githubLogin?: string
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
      authorization: {
        params: {
          scope: 'read:user user:email public_repo'
        }
      }
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          scope: 'openid email profile https://www.googleapis.com/auth/drive.readonly'
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user, account, profile }) {
      // Initial sign in
      if (account && user) {
        token.accessToken = account.access_token
        token.provider = account.provider
        
        // Store additional provider-specific data
        if (account.provider === 'github') {
          token.githubLogin = (profile as any)?.login
        }

        // For now, default all users to 'user' role
        // In production, this would query Supabase for the user's role
        token.role = 'user'
        token.onboardingCompleted = false
      }

      return token
    },
    async session({ session, token }) {
      return {
        ...session,
        accessToken: token.accessToken as string,
        provider: token.provider as string,
        user: {
          ...session.user,
          id: token.sub as string,
          role: token.role as 'user' | 'consultant' | 'admin',
          onboardingCompleted: token.onboardingCompleted as boolean
        },
        githubLogin: token.githubLogin as string
      }
    }
  },
  pages: {
    signIn: '/auth/signin',
    signOut: '/auth/signout',
    error: '/auth/error'
  },
  session: {
    strategy: 'jwt'
  }
}