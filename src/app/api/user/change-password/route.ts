import { NextResponse } from "next/server";
import { prisma } from "@/api/lib/db";
import { requireAuth } from "@/api/middleware/requireAuth";
import AuditService from "@/api/services/AuditService";
import AuthService from "@/api/services/AuthService";
import UserService from "@/api/services/UserService";
import { ChangePasswordSchema } from "@/api/validators/user";

export const POST = requireAuth(async (req) => {
  const userService = new UserService();
  const authService = new AuthService();
  const auditService = new AuditService();

  const reqBody = await req.json();
  const validatedData = ChangePasswordSchema.safeParse(reqBody);

  if (!validatedData.success) {
    return NextResponse.json(
      { error: "Invalid request data" },
      { status: 400 },
    );
  }

  const { currentPassword, newPassword } = validatedData.data;
  const userData = req.user;

  // Fetch full user data to get the password hash
  const fullUser = await userService.fetchUserById({ id: userData.id });

  if (!fullUser) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  // Verify current password
  const isPasswordValid = await authService.verifyPassword(
    currentPassword,
    fullUser.password,
  );

  if (!isPasswordValid) {
    return NextResponse.json(
      { error: "Current password is incorrect" },
      { status: 401 },
    );
  }

  // Use Prisma transaction for password update and audit logging
  await prisma.$transaction(async (tx) => {
    // Hash the new password
    const hashedPassword = await authService.hashPassword(newPassword);
    // Update the password
    await userService.updateUser({
      where: { id: userData.id },
      data: {
        password: hashedPassword,
        previousHashes: [...fullUser.previousHashes, fullUser.password],
      },
      tx,
    });

    // Create audit log
    await auditService.audit({
      action: "PASSWORD_CHANGED",
      userId: userData.id,
      metadata: {
        metadata: { changedAt: new Date() },
      },
      tx,
    });
  });

  return NextResponse.json(
    {
      success: true,
      message: "Password changed successfully",
    },
    { status: 200 },
  );
});
