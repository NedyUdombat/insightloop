export function getInitialsFromName(
  email: string,
  firstname?: string | null,
  lastname?: string | null,
): string {
  // Try to get initials from firstname and lastname
  if (firstname && lastname) {
    return `${firstname[0]}${lastname[0]}`.toUpperCase();
  }

  // Try to get initials from firstname only
  if (firstname) {
    return firstname.slice(0, 2).toUpperCase();
  }

  // Try to get initials from lastname only
  if (lastname) {
    return lastname.slice(0, 2).toUpperCase();
  }

  // Fallback to email
  const parts = email.split("@")[0].split(/[._-]/);
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  }
  return email.slice(0, 2).toUpperCase();
}
