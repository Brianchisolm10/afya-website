import { getServerSession } from "next-auth/next";
import { authConfig } from "./auth";
import { GetServerSidePropsContext, NextApiRequest, NextApiResponse } from "next";

export async function auth(
  ...args:
    | [GetServerSidePropsContext["req"], GetServerSidePropsContext["res"]]
    | [NextApiRequest, NextApiResponse]
    | []
) {
  return await getServerSession(...args, authConfig);
}
