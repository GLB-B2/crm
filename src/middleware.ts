export { auth as middleware } from "@/auth";

export const config = {
  // Schützt alles außer Login-Seite, Auth-API, statischen Dateien
  matcher: ["/((?!login|api/auth|_next/static|_next/image|favicon.ico).*)"],
};
