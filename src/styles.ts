import styles from "./style.module.css";
// Keep semantic class hooks stable for browser tests; presentation uses scoped modules.
export function cn(names: string): string {
  return names
    .split(/\s+/)
    .filter(Boolean)
    .flatMap((name) => (styles[name] ? [name, styles[name]] : [name]))
    .join(" ");
}
