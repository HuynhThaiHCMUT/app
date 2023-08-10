import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                username: { label: "Tên người dùng", type: "text" },
                password: { label: "Mật khẩu", type: "password" }
            },
            async authorize(credentials, req) {
                if (credentials?.username === "admin" && credentials?.password === "123456") {
                    return { id: "0", name: "Admin"};
                }
                return null;
            }
        }),
    ],
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };