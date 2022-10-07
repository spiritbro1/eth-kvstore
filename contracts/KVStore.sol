pragma solidity ^0.5.0;
pragma experimental ABIEncoderV2;
contract KVStore {
    uint256 private constant MAX_STRING_LENGTH = 1000;
    mapping(address => mapping(string => string)) private store;
    mapping(string => bool) private checksum;
    mapping(address => string[]) private pubkeyPGP;
    event PGPset(address currentAddress);

    function get(address _account, string memory _key)
        public
        view
        returns (string memory)
    {
        return store[_account][_key];
    }

    function set(string memory _key, string memory _value) public {
        require(
            bytes(_key).length <= MAX_STRING_LENGTH &&
                bytes(_value).length <= MAX_STRING_LENGTH
        );
        store[msg.sender][_key] = _value;
    }

    function setPGP(string memory _fingerprint,string memory publicKey) public {
        require(!checksum[_fingerprint], "pgp already used");
        checksum[_fingerprint] = true;
        pubkeyPGP[msg.sender].push(publicKey);
        emit PGPset(msg.sender);
    }

    function getAllPGP(address _account) public view returns (string[] memory) {
        return pubkeyPGP[_account];
    }

}
