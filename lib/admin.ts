export const ADMIN_EMAIL = "atsuyaw7@gmail.com";

export function isAdmin(email: string | undefined | null): boolean {
  return email === ADMIN_EMAIL;
}
