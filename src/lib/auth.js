import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions = {
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                username: { label: "Usuario", type: "text", placeholder: "admin" },
                password: { label: "Contraseña", type: "password" }
            },
            async authorize(credentials) {
                // Legacy Logic - EXACTLY as verify version 7c465c0
                if (credentials?.username === "admin" && credentials?.password === "casla2024") {
                    return {
                        id: "1",
                        name: "Admin CASLA",
                        email: "admin@casla.com.ar",
                        role: "admin"
                    };
                }
                return null;
            }
        })
    ],
    pages: {
        signIn: '/', // Home acts as login
        error: '/api/auth/error',
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.role = user.role;
            }
            return token;
        },
        async session({ session, token }) {
            if (session?.user) {
                session.user.role = token.role;
            }
            return session;
        }
    },
    secret: process.env.NEXTAUTH_SECRET,
    trustHost: true,
};
