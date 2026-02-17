export function getAppUrl(isFrontend?: boolean) {
  if (isFrontend) {
    return "";
  }

  // Server / API → absolute production URL
  return `${process.env.NEXT_PUBLIC_HTTP_PROTOCOL}${process.env.NEXT_PUBLIC_VERCEL_URL}`;
}
