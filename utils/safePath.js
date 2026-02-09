import path from "path";

export function safeJoin(base, target) {
  const resolved = path.resolve(base, target);
  if (!resolved.startsWith(base)) {
    throw new Error("Invalid path access");
  }
  return resolved;
}
