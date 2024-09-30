import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export default NextAuth({
  providers: [
    CredentialsProvider({
      async authorize(credentials) {
        const user = { id: 1, name: "John Doe", email: "john@example.com" }; // Replace with real user authentication
        return user || null;
      },
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      session.userId = token.sub; // Attach the user ID to the session
      return session;
    }
  }
});
