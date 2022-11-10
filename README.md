## WebKeypair

Generates an ethereum inspired identity that can be used as a crypto address.

The public key is a schnorr public key, hence the signature is a schnorr signature.

## API

`async function signObject(key: KeyPair, object: Record<string, unknown>)`

Encodes the object using `CBOR` and signs it using the key.

`export async function verifySignature(key: KeyPair, message:Uint8Array, signature: Uint8Array)`

Verifies the signature of the message using the key provided.
