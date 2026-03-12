import { NextResponse } from "next/server";
import { requireAuth } from "@/api/middleware/requireAuth";
import AuditService from "@/api/services/AuditService";
import UserService from "@/api/services/UserService";
import type { PublicUser } from "@/api/types/IUser";
import { type UpdateUserInput, UpdateUserSchema } from "@/api/validators/user";

export const PATCH = requireAuth(async (req) => {
  const userService = new UserService();
  const auditService = new AuditService();

  const reqBody = await req.json();
  const validatedData = UpdateUserSchema.safeParse(reqBody);
  if (!validatedData.success) {
    return NextResponse.json(
      { error: "Invalid request data" },
      { status: 400 },
    );
  }

  const validatedUserData = validatedData.data;

  const userData = req.user;

  const updateData: UpdateUserInput = {} as UpdateUserInput;

  if (validatedUserData.firstName) {
    updateData.firstName = validatedUserData.firstName;
  }

  if (validatedUserData.lastName) {
    updateData.lastName = validatedUserData.lastName;
  }

  if (validatedUserData.phone !== undefined) {
    updateData.phone = validatedUserData.phone;
  }

  if (validatedUserData.profileImage !== undefined) {
    updateData.profileImage = validatedUserData.profileImage;
  }

  const user = await userService.updateUser({
    where: { id: userData.id },
    data: updateData,
  });

  const me: PublicUser = await userService.serializeUser(user);

  await auditService.audit({
    action: "USER_UPDATED",
    userId: user.id,
    metadata: updateData,
  });
  return NextResponse.json(
    {
      success: true,
      data: me,
    },
    { status: 200 },
  );
});
