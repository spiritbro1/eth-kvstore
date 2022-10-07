import { generateKey } from 'openpgp';
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  if(req.method === 'OPTIONS') {
    return res.status(200).json(({
        body: "OK"
    }))
}
  const { name,email,password } = req.body;
  const data=await generateKey({
    type: 'rsa', // Type of the key
    rsaBits: 4096, // RSA key size (defaults to 4096 bits)
    userIDs: [{ name, email }],
    passphrase: password

  })
  res.json(data)

}