export function parsePagination(req: Request) {
  const url = new URL(req.url);
  const page = Math.max(Number(url.searchParams.get("page")) || 1, 1);
  const limit = Math.min(Number(url.searchParams.get("limit")) || 20, 100);

  return {
    page,
    limit,
    skip: (page - 1) * limit,
  };
}
