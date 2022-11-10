import { encode } from 'cbor-x';
import * as secp from '@noble/secp256k1';

const ADDRESS_PREFIX = "0xx1" as const;

interface KeyPair {
	publicKey: Uint8Array;
	privateKey: Uint8Array;
}

export async function generateKeyPairFromSeed(seed: Uint8Array): Promise<KeyPair> {
	const key = secp.utils.hashToPrivateKey(seed);
	const pubKey = secp.getPublicKey(key);

	return {
		publicKey: pubKey,
		privateKey: key,
	}
}

/**
 * Generates a new key pair.
 * The public key is a Schnorr public key.
 */
export function generateKeyPair(): KeyPair {
	const privKey = secp.utils.randomPrivateKey();
	const rpub = secp.schnorr.getPublicKey(privKey);

	return {
		publicKey: rpub,
		privateKey: privKey,
	};
}

export async function publicKeyToAddress(publicKey: Uint8Array): Promise<string> {
	const hash = await secp.utils.sha256(publicKey);// get the first 20 bytes of the hash
	// get the first 20 bytes of the hash
	const sub = hash.subarray(0, 20);
	const address = ADDRESS_PREFIX + secp.utils.bytesToHex(sub);
	return address;
}

export function isValidAddress(address: string): boolean {
	const start = address.startsWith(ADDRESS_PREFIX);
	const length = address.length === 44;
	return start && length;
}

/**
 * Encodes an object into a CBOR byte array as signs it with the private key.
 * The signature is a Schnorr signature.
 * 
 * @param key 
 * @param object 
 * @returns 
 */
export async function signObject(key: KeyPair, object: Record<string, unknown>) {
	const encodedView = encode(object);
	const signatureBuffer = await secp.schnorr.sign(encodedView, key.privateKey);

	return {
		encodedView,
		signature: new Uint8Array(signatureBuffer),
	}
}

export async function verifySignature(
	key: KeyPair,
	message: Uint8Array,
	signature: Uint8Array
) {
	return await secp.schnorr.verify(signature, message, key.publicKey);
}
