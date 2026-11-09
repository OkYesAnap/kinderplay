import { authConfig } from "@/lib/auth";
import { cookies, headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { AUTH_SECRET } from "next/dist/server/config-schema";
import { createHash } from "crypto";

// Create a simple hash of the request URL for the cookie
const createCookieName = (name: string, salt: string): string => {
  return `${name}__${createHash("sha256").update(salt).digest("hex").slice(0, 10)}`;
};

const authSecret = process.env.NEXTAUTH_SECRET || "default-secret";

// Helper to get request headers
async function getRequest(req: NextRequest) {
  const cookieStore = await cookies();
  const url = req.nextUrl.clone();
  const headersList = new Headers();

  // Copy headers from NextRequest
  req.headers.forEach((value, key) => {
    headersList.set(key, value);
  });

  // Set cookie header from cookies store
  const cookieEntries = cookieStore.getAll();
  if (cookieEntries.length > 0) {
    const cookieString = cookieEntries.map((c) => `${c.name}=${c.value}`).join("; ");
    headersList.set("cookie", cookieString);
  }

  return {
    ...req,
    url,
    cookies: cookieStore,
    headers: headersList,
  };
}

// Google OAuth handler using @auth/core
export async function GET(req: NextRequest, { params }: { params: Promise<{ nextauth: string[] }> }) {
  try {
    const { NextRequest: CoreNextRequest, NextResponse: CoreNextResponse } = await import("@auth/core");
    const nextauth = await params;

    // Create a custom request object that matches Auth.js expectations
    const url = req.nextUrl.clone();
    url.pathname = url.pathname.replace(/\/api\/auth\/(.*)/, "/$1");

    const response = await new Promise((resolve, reject) => {
      import("@auth/core")
        .then(async (auth) => {
          // We need to use the core directly
        })
        .catch(reject);
    });

    return response as NextResponse;
  } catch (error) {
    console.error("Auth error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ nextauth: string[] }> }) {
  return GET(req, { params });
}
