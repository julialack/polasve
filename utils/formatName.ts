/**
 * Formats a full name to "Firstname L." (first name and first letter of last name)
 */
export function formatDisplayName(fullName: string | null | undefined): string {
  if (!fullName) return 'Medlem';

  const parts = fullName.trim().split(/\s+/);

  if (parts.length <= 1) {
    return parts[0];
  }

  const firstName = parts[0];
  const lastInitial = parts[parts.length - 1].charAt(0).toUpperCase();

  return `${firstName} ${lastInitial}.`;
}
