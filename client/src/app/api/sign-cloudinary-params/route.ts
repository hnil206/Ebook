import cloudinary from "@/lib/cloudinary";
import { env } from "@/lib/validateEnv";
export async function POST(request: Request) {
  const body = await request.json();
  const { paramsToSign } = body;

  const signature = cloudinary.utils.api_sign_request(
    paramsToSign,
    env.CLOUDINARY_API_SECRET as string
  );

  return Response.json({ signature });
}
