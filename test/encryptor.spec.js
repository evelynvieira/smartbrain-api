const chai = require('chai');
const { expect } = chai;
const { encrypt, compareHash } = require('../src/encryptor/encryptor');

describe('encryptor', () => {
  it('should return a hashed string', () => {
    const hashed = encrypt("teste123");

    expect(hashed).not.null;
    expect(hashed).to.not.eql("teste123")
  })

  it('should return true when string is same of hashed', () => {
    const hashed = encrypt("teste123");

    expect(compareHash("teste123", hashed)).to.be.true;
  })

  it('should return false when string is different of hashed', () => {
    const hashed = encrypt("teste123");

    expect(compareHash("123teste", hashed)).to.be.false;
  })
});