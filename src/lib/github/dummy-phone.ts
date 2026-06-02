function hashLogin(login: string): number {
  let hash = 0;
  for (let i = 0; i < login.length; i++) {
    hash = (hash * 31 + login.charCodeAt(i)) >>> 0;
  }
  return hash;
}

/** Telefone fictício estável por login (GitHub não expõe telefone). */
export function dummyPhoneFromLogin(login: string): string {
  const hash = hashLogin(login.toLowerCase());
  const block1 = String(1000 + (hash % 9000)).padStart(4, "0");
  const block2 = String(1000 + ((hash >>> 12) % 9000)).padStart(4, "0");
  return `+55 11 9${block1}-${block2}`;
}
