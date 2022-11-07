import assert from 'node:assert';
import test from 'node:test';
import { generateKeyPair, signObject, verifySignature, publicKeyToAddress } from './main'

const ADDRESS_PREFIX = "0xx1" as const;
const ADDRESS_LENGTH = 44;

test('main.test', async (t) => {
    await t.test("generates keypair", async () => {
        const keyPair = await generateKeyPair();
        const { publicKey, privateKey } = keyPair;
        assert.strictEqual(publicKey.type, 'public');
        assert.strictEqual(privateKey.type, 'private');
    })

    await t.test("public key to address", async () => {
        const keyPair = await generateKeyPair();
        const { publicKey } = keyPair;
        const address = await publicKeyToAddress(publicKey);
        assert.strictEqual(address.length, ADDRESS_LENGTH, `expected address to be ${ADDRESS_LENGTH} in length, got ${address.length}`);
        assert.strictEqual(address.startsWith(ADDRESS_PREFIX), true, `expected address to start with ${ADDRESS_PREFIX}`);
    })

    await t.test("sign and verify", async () => {
        const keyPair = await generateKeyPair();
        const { publicKey, privateKey } = keyPair;
        const message = {
            hello: 'world',
        }
        const result = await signObject(privateKey, message);
        const { encodedView, signature } = result;
        assert(signature.length === 64, `expected signature to be 64 bytes, got ${signature.length}`);
        const verified = await verifySignature(publicKey, encodedView, signature);
        assert(verified, "signature could not be verified");
    })
});
