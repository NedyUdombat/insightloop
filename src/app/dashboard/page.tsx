// app/dashboard/page.tsx

import AuthService from "@/api/services/AuthService";
import ProjectService from "@/api/services/ProjectService";
import UserService from "@/api/services/UserService";
import { redirect } from "next/navigation";

export default async function DashboardRoot() {
  const authService = new AuthService();
  const userService = new UserService();
  const projectService = new ProjectService();

  const session = await authService.getSession();

  if (!session) {
    redirect("/auth/login");
  }

  const user = await userService.fetchUserById({ id: session.user.id });

  if (!user) {
    redirect("/auth/login");
  }

  const projects = await projectService.findProjects({
    where: {
      ownerId: user.id,
      deletedAt: null,
    },
    take: 10,
    skip: 0,
    orderBy: { createdAt: "asc" },
  });

  // 🟢 No projects → onboarding
  if (!projects.length) {
    redirect("/onboarding/create-project");
  }

  // 🟢 Has projects → redirect to last used or first
  const targetProjectId = user.lastProjectId ?? projects[0].id;

  redirect(`/dashboard/${targetProjectId}`);
}
