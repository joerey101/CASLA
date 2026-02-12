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
                const { username, password } = credentials || {};

                // 1. Admin
                if (username === "admin" && password === "admin") {
                    return { id: "1", name: "Admin CASLA", email: "admin@casla.com.ar", role: "admin" };
                }

                // 2. Super
                if (username === "super" && password === "super") {
                    return { id: "2", name: "Superuser CASLA", email: "super@casla.com.ar", role: "admin" };
                }

                // 3. Oper
                if (username === "oper" && password === "oper") {
                    return { id: "3", name: "Operador CASLA", email: "oper@casla.com.ar", role: "staff" };
                }

                return null;
            }
        })
    ],
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
    debug: true,
    secret: 'casla-portal-secret-2026-v5-fixed',
};
