import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"

const handler = NextAuth({
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                username: { label: "Usuario", type: "text", placeholder: "admin" },
                password: { label: "Contraseña", type: "password" }
            },
            async authorize(credentials, req) {
                // Mock Admin User for initial setup
                // TODO: Replace with Database check after Prisma is fully integrated
                if (credentials?.username === "admin" && credentials?.password === "casla2024") {
                    return { id: "1", name: "Admin CASLA", email: "admin@casla.com.ar", role: "admin" }
                }
                return null
            }
        })
    ],
    pages: {
        signIn: '/api/auth/signin', // Use default for now or custom page later
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.role = user.role
            }
            return token
        },
        async session({ session, token }) {
            if (session?.user) {
                session.user.role = token.role
            }
            return session
        }
    }
})

export { handler as GET, handler as POST }
