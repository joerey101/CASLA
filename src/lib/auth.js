import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";
import prisma from "@/lib/db";

export const authOptions = {
    providers: [
        // SOCIAL LOGIN (Placeholders — requires CLIENT_ID/SECRET in .env)
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID || "placeholder",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || "placeholder",
        }),
        FacebookProvider({
            clientId: process.env.FACEBOOK_CLIENT_ID || "placeholder",
            clientSecret: process.env.FACEBOOK_CLIENT_SECRET || "placeholder",
        }),

        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                username: { label: "DNI o Email", type: "text" },
                password: { label: "Contraseña", type: "password" }
            },
            async authorize(credentials) {
                const { username, password } = credentials || {};

                // 1. Check if it's an Admin/Staff (Username is Email) — hardcoded, no DB needed
                if (username && username.includes('@')) {
                    if (username === "admin@casla.com.ar" && password === "admin") {
                        return { id: "1", name: "Admin CASLA", email: "admin@casla.com.ar", role: "admin", type: "staff" };
                    }
                    if (username === "oper@casla.com.ar" && password === "oper") {
                        return { id: "3", name: "Operador CASLA", email: "oper@casla.com.ar", role: "staff", type: "staff" };
                    }
                }

                // 2. Check if it's a Socio (Username is DNI) — EMERGENCY MODE (Mock Login)
                if (username === "33000000" && password === "socio123") {
                    return {
                        id: "socio-mariano-123",
                        name: "Mariano Pérez",
                        email: "mariano.perez@example.com",
                        role: "member",
                        type: "socio",
                        memberNumber: "99999"
                    };
                }

                // Normal DB Access (Fallback if DB is available)
                if (prisma) {
                    try {
                        const member = await prisma.member.findUnique({
                            where: { dni: username }
                        });

                        if (member) {
                            const isValidPass = member.password ? (member.password === password) : (password === "casla");
                            if (isValidPass) {
                                return {
                                    id: member.id,
                                    name: member.fullName,
                                    email: member.email,
                                    role: "member",
                                    type: "socio",
                                    memberNumber: member.memberNumber
                                };
                            }
                        }
                    } catch (e) {
                        console.error("[AUTH] DB Error:", e.message);
                    }
                } else {
                    console.warn("[AUTH] Prisma not available — socio login disabled.");
                }

                return null;
            }
        })
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.role = user.role;
                token.userType = user.type; // 'staff' or 'socio'
                token.memberId = user.id;
            }
            return token;
        },
        async session({ session, token }) {
            if (session?.user) {
                session.user.role = token.role;
                session.user.userType = token.userType;
                session.user.memberId = token.memberId;
            }
            return session;
        }
    },
    pages: {
        signIn: '/socio/login',
    },
    debug: process.env.NODE_ENV !== 'production',
    secret: process.env.NEXTAUTH_SECRET || 'casla-fallback-secret-dev-only',
};
