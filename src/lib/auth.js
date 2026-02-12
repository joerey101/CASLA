import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions = {
    providers: [
        CredentialsProvider({
            name: "Credenciales",
            credentials: {
                email: { label: "Email / DNI", type: "text" },
                password: { label: "Contraseña", type: "password" }
            },
            async authorize(credentials) {
                // MOCK AUTH for Phase 1
                // In Phase 2: Connect to Prisma DB
                if (credentials?.email === "admin@casla.com.ar" && credentials?.password === "CaslaAdmin") {
                    return { id: "1", name: "Admin CASLA", email: "admin@casla.com.ar", role: "ADMIN" };
                }

                if (credentials?.email === "supervisor@casla.com.ar" && credentials?.password === "CaslaSuper") {
                    return { id: "3", name: "Supervisor Tarde", email: "supervisor@casla.com.ar", role: "SUPERVISOR" };
                }

                if (credentials?.email === "operador@casla.com.ar" && credentials?.password === "CaslaOper") {
                    return { id: "4", name: "Operador Caja 4", email: "operador@casla.com.ar", role: "OPERATOR" };
                }

                if (credentials?.email === "socio@casla.com" && credentials?.password === "socio") {
                    return {
                        id: "2",
                        name: "Mariano Volino",
                        email: "socio@casla.com",
                        role: "MEMBER",
                        memberId: "123456"
                    }
                }

                return null;
            }
        })
    ],
    pages: {
        signIn: '/login',
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.role = user.role;
                token.memberId = user.memberId;
            }
            return token;
        },
        async session({ session, token }) {
            if (token) {
                session.user.role = token.role;
                session.user.memberId = token.memberId;
            }
            return session;
        }
    },
    session: {
        strategy: "jwt",
    },
    debug: process.env.NODE_ENV === 'development',
    secret: process.env.NEXTAUTH_SECRET,
    trustHost: true,
};
