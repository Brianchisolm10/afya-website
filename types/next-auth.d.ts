import { Role, AccountStatus } from "@prisma/client";
import "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      name?: string | null;
      role: Role;
      status: AccountStatus;
    };
  }

  interface User {
    id: string;
    email: string;
    name?: string | null;
    role: Role;
    status: AccountStatus;
  }
}
