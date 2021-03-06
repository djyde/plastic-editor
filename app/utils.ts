export const encrypt = {
  async generateKey() {
    const key = await window.crypto.subtle.generateKey(
      { name: "AES-GCM", length: 128 },
      true, // extractable
      ["encrypt", "decrypt"]
    );

    return key
  },
  async encrypt(text: string) {
    const key = await encrypt.generateKey()
    const encrypted = await window.crypto.subtle.encrypt(
      { name: "AES-GCM", iv: new Uint8Array(12) },
      key,
      new TextEncoder().encode(JSON.stringify(text))
    );
    const objectKey = (await window.crypto.subtle.exportKey("jwk", key)).k;
    return {
      objectKey,
      encrypted,
    };
  }
}