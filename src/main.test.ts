import assert from 'node:assert';
import test from 'node:test';
import { generateKeyPair, signObject, verifySignature, publicKeyToAddress } from './main'
import { decode } from 'cbor-x';

const ADDRESS_PREFIX = "0xx1" as const;
const ADDRESS_LENGTH = 44;

test('main.test', async (t) => {
    await t.test("generates keypair", async () => {
        const keyPair: {
            publicKey: Uint8Array;
            privateKey: Uint8Array;
        } = generateKeyPair();
        assert.equal(keyPair.publicKey.length, 32, `public key should be 32 bytes, got ${keyPair.publicKey.length}`);
        assert.equal(keyPair.privateKey.length, 32, `private key should be 32 bytes, got ${keyPair.privateKey.length}`);
    })

    await t.test("public key to address", async () => {
        const keyPair = generateKeyPair();
        const { publicKey } = keyPair;
        const address = await publicKeyToAddress(publicKey);
        assert.strictEqual(address.length, ADDRESS_LENGTH, `expected address to be ${ADDRESS_LENGTH} in length, got ${address.length}`);
        assert.strictEqual(address.startsWith(ADDRESS_PREFIX), true, `expected address to start with ${ADDRESS_PREFIX}`);
    })

    await t.test("sign and verify", async () => {
        const keyPair = generateKeyPair();
        const keyPair2 = generateKeyPair();
        const message = "hello world";
        const { encodedView, signature } = await signObject(keyPair, { message });
        const verified = await verifySignature(keyPair, encodedView, signature);
        const verified2 = await verifySignature(keyPair2, encodedView, signature);
        assert.strictEqual(verified, true, "signature should be valid");
        assert.strictEqual(verified2, false, "verified with wrong key should be false");
        const obj = decode(encodedView);
        assert.strictEqual(obj.message, message, "message should be the same");
    })
});
