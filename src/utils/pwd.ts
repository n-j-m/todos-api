export async function hash(value: string) {
  const encoded = new TextEncoder().encode(value);

  const digest = await crypto.subtle.digest(
    {
      name: "SHA-256",
    },
    encoded
  );

  return [...new Uint8Array(digest)]
    .map((c) => c.toString(16).padStart(2, "0"))
    .join("");
}

export async function verify(value: string, hashedValue: string) {
  const hashed = await hash(value);

  return hashed === hashedValue;
}
