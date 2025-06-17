import crypto from "crypto";
import { scrypt } from 'crypto';
import { promisify } from 'util';


// from Deepseek
const scryptPromise = promisify(scrypt);

export async function hashPassword(password: string, salt: string): Promise<string> {
  const hash = await scryptPromise(password, salt, 64);
  return (hash as Buffer).toString('hex');
}

//enhance the password difficulty
export function generateSalt() {
  return crypto.randomBytes(16).toString("hex").normalize();
}

export async function comparePasswords({
  password,
  salt,
  hashedPassword,
}: {
  password: string;
  salt: string;
  hashedPassword: string;
}) {
  const inputHashedPassword = await hashPassword(password, salt);

  return crypto.timingSafeEqual(
    Buffer.from(inputHashedPassword, "hex"),
    Buffer.from(hashedPassword, "hex")
  );
}

// from chatGPT
// import { scrypt } from "crypto";
// import { promisify } from "util";

// const scryptAsync = promisify(scrypt);

// export async function hashPassword(password: string, salt: string) {
//   const hash = (await scryptAsync(password.normalize(), salt, 64)) as Buffer;
//   return hash.toString("hex").normalize();
// }
