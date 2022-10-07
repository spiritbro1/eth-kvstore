import { expose } from 'comlink';
import { generateKey } from 'openpgp/lightweight';


// Define API
export const api= {generate:async(name,email,password)=>{
  const { privateKey, publicKey } = await generateKey({
    type: 'rsa', // Type of the key
    rsaBits: 4096, // RSA key size (defaults to 4096 bits)
    userIDs:[{name,email}],
    passphrase:password

  })
  return  {privateKey, publicKey };
}}

// Expose API
expose(api);