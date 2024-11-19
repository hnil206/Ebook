import axios from '@/lib/axios';
import { env } from '@/lib/validateEnv';
import { AuthOptions } from 'next-auth';
import Google from 'next-auth/providers/google';
const authOptions: AuthOptions = {
  providers: [
    Google({
      clientId: env.GOOGLE_CLIENT_ID as string,
      clientSecret: env.GOOGLE_CLIENT_SECRET as string,
    }),
  ],
  secret: env.NEXTAUTH_SECRET,
  session: {
    maxAge: 2 * 60 * 60,
  },
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      if (!account) return false;
      const auth = await authenticate(user, account);
      // console.log(auth);
      if (auth.isAuthenticated) {
        return true;
      } else {
        return false;
      }
      // return true;
    },
    async jwt({ token, user, account }) {
      if (account) {
        // console.log('chay jwt');
        const _token = await generateToken({
          provider: account.provider as string,
          providerAccountId: account.providerAccountId as string,
        });
        // console.log('token', _token);
        token.accessToken = _token;
      }
      //triggered when user sign in
      const decoded = await decode(token.accessToken as string);
      token.role = decoded.role;
      return { ...token, ...user };
    },
    async session({ session, token }) {
      session.user.accessToken = token.accessToken as string;
      session.user.role = token.role as string[];
      return session;
    },
  },
};

//Auth service
async function authenticate(user: any, account: any) {
  const data = {
    name: user.name as string,
    email: user.email as string,
    image: user.image as string,
    provider: account.provider as string,
    providerAccountId: account.providerAccountId as string,
  };
  // console.log(data);
  const res = await axios.post('/auth', data);
  // console.log('chay xong authenticate');
  return res.data;
}

async function generateToken(provider: {
  provider: string;
  providerAccountId: string;
}) {
  const res = await axios.post('/auth/token', provider);
  // console.log('chay xong generateToken, ', res.data);
  return res.data;
}

async function decode(token: string) {
  const res = await axios.get(`/auth/decode/${token}`);
  // console.log('chay xong decode, ', res.data);
  return res.data;
}

//Auth service
// const
export default authOptions;
