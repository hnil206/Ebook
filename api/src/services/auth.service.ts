import jwt, { type JwtPayload } from 'jsonwebtoken';
import User from '../models/user.model';
import env from '../utils/validateEnv.util';
interface UserProfile {
  // id?: string;
  name: string;
  email: string;
  image?: string;
  username?: string;
}

interface Provider {
  provider: string;
  providerAccountId: string;
}

interface DecodedToken extends JwtPayload {
  id: string;
  role: string[];
}

async function authenticate(
  profile: UserProfile,
  provider: Provider,
): Promise<{
  isAuthenticated: boolean;
  message: string;
}> {
  try {
    const user = await User.findOne({
      providerId: provider.providerAccountId,
      provider: provider.provider,
    });
    if (!user) {
      const newUser = new User({
        username: profile.username || profile.name,
        email: profile.email,
        image: profile.image,
        role: ['user'],
        provider: provider.provider,
        providerId: provider.providerAccountId,
      });
      await newUser.save();
      return {
        isAuthenticated: true,
        message: 'Authentication new user!',
      };
    } else {
      return {
        isAuthenticated: true,
        message: 'Authentication successful!',
      };
    }
  } catch (error: any) {
    return {
      isAuthenticated: false,
      message: `Authentication failed!,${error}`,
    };
  }
}

async function generateToken(provider: Provider): Promise<string> {
  const user = await User.findOne({
    providerId: provider.providerAccountId,
    provider: provider.provider,
  });
  if (!user) {
    throw new Error('User not found!');
  }
  return jwt.sign({ id: user.id, role: user.role }, env.JWT_SECRET as string, {
    expiresIn: env.EXPIRE_JWT,
    algorithm: 'HS256',
    allowInsecureKeySizes: true, // allow weak key
  });
}

async function decode(token: string): Promise<any> {
  try {
    const decoded = jwt.verify(token, env.JWT_SECRET as string);
    return decoded;
  } catch (error: any) {
    throw new Error(`Decode token failed!,${error}`);
  }
}

async function refreshToken(token: string): Promise<string> {
  try {
    const decoded = jwt.verify(token, env.JWT_SECRET as string) as DecodedToken;
    return jwt.sign(
      { id: decoded.id, role: decoded.role },
      env.JWT_SECRET as string,
      {
        expiresIn: env.EXPIRE_JWT,
        algorithm: 'HS256',
        allowInsecureKeySizes: true, // allow weak key
      },
    );
  } catch (error) {
    throw new Error(
      `Refresh token failed!, ${
        error instanceof Error ? error.message : error
      }`,
    );
  }
}

async function verifyToken(
  token: string,
): Promise<{ userId: string; role: string[] }> {
  try {
    const decoded = jwt.verify(token, env.JWT_SECRET as string) as DecodedToken;
    return { userId: decoded.id, role: decoded.role };
  } catch (error) {
    throw new Error(
      `Verify token failed!, ${error instanceof Error ? error.message : error}`,
    );
  }
}

export async function getUser(userId: string): Promise<any> {
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found!');
    }
    return user;
  } catch (error: any) {
    throw new Error(`Get profile failed!,${error}`);
  }
}

export default authenticate;
export { decode, generateToken, refreshToken, verifyToken };
