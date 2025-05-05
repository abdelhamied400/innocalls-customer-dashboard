import { setCookie } from "cookies-next";

export async function POST(req: Request) {
  const { orgId } = await req.json();

  try {
    await setCookie("OrganizationId", orgId, {});
  } catch (error) {
    console.log("Error setting cookie:", error);
  }
  return Response.json({ message: "Organization set" });
}
