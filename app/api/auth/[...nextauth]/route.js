// app/api/auth/[...nextauth]/route.js
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const res = await fetch("https://backendfix-production.up.railway.app/api/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            username: credentials.username,
            password: credentials.password,
          }),
        });

        const data = await res.json();

       if (res.ok && data?.user) {
  return {
    id: data.user.id,
    name: data.user.nama,
    email: data.user.email,
    image: data.user.foto_profil
      ? `https://backendfix-production.up.railway.app/storage/${data.user.foto_profil}`
      : null,
  };
}


        return null;
      },
    }),
  ],

  session: { strategy: "jwt" },

  callbacks: {
  async jwt({ token, user }) {
    if (user) {
      token.name = user.name;
      token.email = user.email;
      token.image = user.image; // ← ini dari `authorize()` saat login
    }
    return token;
  },
  async session({ session, token }) {
    session.user.name = token.name;
    session.user.email = token.email;
    session.user.image = token.image;
    session.user.foto_profil = token.image;
     // ✅ PENTING: Tambahkan baris ini
    return session;
  },
  },

  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };
