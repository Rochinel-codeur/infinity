import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import prisma from "./prisma";

const JWT_SECRET = process.env.ADMIN_JWT_SECRET || "default-secret-change-me";
const TOKEN_NAME = "admin_token";

export interface AdminPayload {
  id: string;
  email: string;
  name: string;
  role: string;
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

export function generateToken(admin: AdminPayload): string {
  return jwt.sign(admin, JWT_SECRET, { expiresIn: "7d" });
}

export function verifyToken(token: string): AdminPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as AdminPayload;
  } catch {
    return null;
  }
}

export async function getAdminFromCookies(): Promise<AdminPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(TOKEN_NAME)?.value;
  
  if (!token) return null;
  
  return verifyToken(token);
}

export async function setAdminCookie(token: string): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(TOKEN_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: "/",
  });
}

export async function removeAdminCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(TOKEN_NAME);
}

export async function authenticateAdmin(email: string, password: string): Promise<AdminPayload | null> {
  const admin = await prisma.admin.findUnique({
    where: { email },
  });

  if (!admin) return null;

  const isValid = await verifyPassword(password, admin.password);
  if (!isValid) return null;

  return {
    id: admin.id,
    email: admin.email,
    name: admin.name,
    role: admin.role,
  };
}

export async function createDefaultAdmin(): Promise<void> {
  const defaultEmail = process.env.ADMIN_DEFAULT_EMAIL || "admin@example.com";
  const defaultPassword = process.env.ADMIN_DEFAULT_PASSWORD || "admin123";

  const existingAdmin = await prisma.admin.findUnique({
    where: { email: defaultEmail },
  });

  if (!existingAdmin) {
    const hashedPassword = await hashPassword(defaultPassword);
    await prisma.admin.create({
      data: {
        email: defaultEmail,
        password: hashedPassword,
        name: "Administrateur",
        role: "admin",
      },
    });
    console.log("✅ Admin par défaut créé:", defaultEmail);
  }
}
