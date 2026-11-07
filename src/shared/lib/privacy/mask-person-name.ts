export function maskPersonName(fullName: string): string {
  const [firstName, ...otherNames] = fullName.trim().split(/\s+/);
  if (!firstName) return "";
  const lastName = otherNames.at(-1);
  if (!lastName) return firstName;
  return `${firstName} ${Array.from(lastName)[0]?.toUpperCase()}.`;
}
