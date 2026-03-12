export function getInitialsFromName(
  email: string,
  firstName?: string | null,
  lastName?: string | null,
): string {
  // Try to get initials from firstName and lastName
  if (firstName && lastName) {
    return `${firstName[0]}${lastName[0]}`.toUpperCase();
  }

  // Try to get initials from firstName only
  if (firstName) {
    return firstName.slice(0, 2).toUpperCase();
  }

  // Try to get initials from lastName only
  if (lastName) {
    return lastName.slice(0, 2).toUpperCase();
  }

  // Fallback to email
  const parts = email.split("@")[0].split(/[._-]/);
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  }
  return email.slice(0, 2).toUpperCase();
}
