const KVStore = artifacts.require('./KVStore.sol');
const openpgp = require('openpgp');
const fs = require('fs');
const path = require('path');

contract('KVStore', async (accounts) => {
  it('returns a correct value to the address storing the key-value pair', async () => {
    const instance = await KVStore.deployed();
    const [accountOne] = accounts;
    await instance.set('satoshi', 'nakamoto', {
      from: accountOne,
    });
    const value = await instance.get.call(accountOne, 'satoshi', {
      from: accountOne,
    });
    assert.equal(value, 'nakamoto');
  });

  it('returns a correct value to another address', async () => {
    const instance = await KVStore.deployed();
    const [accountOne, accountTwo] = accounts;
    await instance.set('satoshi', 'nakamoto', {
      from: accountOne,
    });
    const value = await instance.get.call(accountOne, 'satoshi', {
      from: accountTwo,
    });
    assert.equal(value, 'nakamoto');
  });

  it("doesn't allow storing a too long key", async () => {
    const instance = await KVStore.deployed();
    const [accountOne] = accounts;
    try {
      await instance.set(
        'satoshinakamotosatoshinakamotosatoshinakamotosatoshinakamotosatoshinakamotosatoshinakamotosatoshinakamotosatoshinakamotosatoshinakamotosatoshinakamotosatoshinakamotosatoshinakamotosatoshinakamotosatoshinakamotosatoshinakamotosatoshinakamotosatoshinakamotosatoshinakamotosatoshinakamotosatoshinakamotosatoshinakamotosatoshinakamotosatoshinakamotosatoshinakamotosatoshinakamotosatoshinakamotosatoshinakamotosatoshinakamotosatoshinakamotosatoshinakamotosatoshinakamotosatoshinakamotosatoshinakamotosatoshinakamotosatoshinakamotosatoshinakamotosatoshinakamotosatoshinakamotosatoshinakamotosatoshinakamotosatoshinakamotosatoshinakamotosatoshinakamotosatoshinakamotosatoshinakamotosatoshinakamotosatoshinakamotosatoshinakamotosatoshinakamotosatoshinakamotosatoshinakamotosatoshinakamotosatoshinakamotosatoshinakamotosatoshinakamotosatoshinakamotosatoshinakamotosatoshinakamotosatoshinakamotosatoshinakamotosatoshinakamotosatoshinakamotosatoshinakamotosatoshinakamotosatoshinakamotosatoshinakamotosatoshinakamotosatoshinakamotosatoshinakamotosatoshinakamotosatoshinakamotosatoshinakamotosatoshinakamotosatoshinakamotosatoshinakamotosatoshinakamotosatoshinakamotosatoshinakamotosatoshinakamotosatoshinakamoto',
        'satoshi',
        { from: accountOne },
      );
      assert.fail();
    } catch (err) {
      assert.ok(/revert/.test(err.message));
    }
  });

  it("doesn't allow storing a too long value", async () => {
    const instance = await KVStore.deployed();
    const [accountOne] = accounts;
    try {
      await instance.set(
        'satoshi',
        'satoshinakamotosatoshinakamotosatoshinakamotosatoshinakamotosatoshinakamotosatoshinakamotosatoshinakamotosatoshinakamotosatoshinakamotosatoshinakamotosatoshinakamotosatoshinakamotosatoshinakamotosatoshinakamotosatoshinakamotosatoshinakamotosatoshinakamotosatoshinakamotosatoshinakamotosatoshinakamotosatoshinakamotosatoshinakamotosatoshinakamotosatoshinakamotosatoshinakamotosatoshinakamotosatoshinakamotosatoshinakamotosatoshinakamotosatoshinakamotosatoshinakamotosatoshinakamotosatoshinakamotosatoshinakamotosatoshinakamotosatoshinakamotosatoshinakamotosatoshinakamotosatoshinakamotosatoshinakamotosatoshinakamotosatoshinakamotosatoshinakamotosatoshinakamotosatoshinakamotosatoshinakamotosatoshinakamotosatoshinakamotosatoshinakamotosatoshinakamotosatoshinakamotosatoshinakamotosatoshinakamotosatoshinakamotosatoshinakamotosatoshinakamotosatoshinakamotosatoshinakamotosatoshinakamotosatoshinakamotosatoshinakamotosatoshinakamotosatoshinakamotosatoshinakamotosatoshinakamotosatoshinakamotosatoshinakamotosatoshinakamotosatoshinakamotosatoshinakamotosatoshinakamotosatoshinakamotosatoshinakamotosatoshinakamotosatoshinakamotosatoshinakamotosatoshinakamotosatoshinakamotosatoshinakamotosatoshinakamoto',
        { from: accountOne },
      );
      assert.fail();
    } catch (err) {
      assert.ok(/revert/.test(err.message));
    }
  });

  it('outputs an address on deployment', async () => {
    const instance = await KVStore.deployed();
    assert.typeOf(instance.address, 'string');
    assert.isAtLeast(instance.address.length, 10);
  });

  it('store public key and its fingerprint on smart contract', async () => {
    const instance = await KVStore.deployed();
    const [accountOne] = accounts;
    try {
      await instance.setPGP(
        '71f8b7a5fcd42ddc8fe5b89ae536191d60754345',
        'bafkreieadxyvobae4a2ww7tytw37dw2ihvvbujj5npjepurraavtaoczcq',
        { from: accountOne },
      );

      const value = await instance.getAllPGP.call(accountOne, {
        from: accountOne,
      });
      assert.equal(value[0], 'bafkreieadxyvobae4a2ww7tytw37dw2ihvvbujj5npjepurraavtaoczcq');
    } catch (err) {
      assert.ok(/revert/.test(err.message));
    }
  });
  it('shouldn\'t store same public key fingerprint multiple times', async () => {
    const instance = await KVStore.deployed();
    const [accountOne] = accounts;
    try {
      await instance.setPGP(
        '71f8b7a5fcd42ddc8fe5b89ae536191d60754345',
        'bafkreieadxyvobae4a2ww7tytw37dw2ihvvbujj5npjepurraavtaoczcq',
        { from: accountOne },
      );
      await instance.setPGP(
        '71f8b7a5fcd42ddc8fe5b89ae536191d60754345',
        'bafkreieadxyvobae4a2ww7tytw37dw2ihvvbujj5npjepurraavtaoczcq',
        { from: accountOne },
      );
      const value = await instance.getAllPGP.call(accountOne, {
        from: accountOne,
      });
      assert.equal(value.length, 1);
      assert.fail();
    } catch (err) {
      assert.ok(/revert/.test(err.message));
    }
  });

  it('should store encrypted value and decrypt the value', async () => {
    const instance = await KVStore.deployed();
    const [accountOne] = accounts;
    try {
      const encrypted = fs.readFileSync(path.resolve(__dirname, './encrypted_message.txt'), { encoding: 'utf8', flag: 'r' });
      const privkey = fs.readFileSync(path.resolve(__dirname, './private_key_for_testing'), { encoding: 'utf8', flag: 'r' });
      await instance.set('satoshi', encrypted, {
        from: accountOne,
      });
      const value = await instance.get.call(accountOne, 'satoshi', {
        from: accountOne,
      });
      assert.equal(value, encrypted);
      const message = await openpgp.readMessage({
        armoredMessage: encrypted,
      });
      const { data: decrypted } = await openpgp.decrypt({
        message,
        decryptionKeys: await openpgp.readPrivateKey({ armoredKey: privkey }),
      });
      assert.equal(decrypted, 'H');
    } catch (err) {
      assert.ok(/revert/.test(err.message));
    }
  });
});
