import { headers } from "next/headers";
import { UAParser } from "ua-parser-js";

export const getClientIp = async () => {
  const headerStore = await headers();

  return (
    headerStore.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    headerStore.get("x-real-ip") ??
    ""
  );
};

export const getClientUserAgent = async () => {
  const headerStore = await headers();

  const userAgent = headerStore.get("user-agent") ?? "";
  const parsedUserAgent = UAParser(userAgent);
  return {
    userAgent,
    parsedUserAgent,
  };
};

export const getClientMeta = async () => {
  const ip = await getClientIp();
  const userAgent = await getClientUserAgent();
  return {
    ip,
    ...userAgent,
  };
};
