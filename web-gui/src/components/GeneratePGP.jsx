import React, { useState, forwardRef, Suspense, useMemo } from 'react';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import { generateKey, readKey } from 'openpgp/lightweight';

import Grid from '@mui/material/Grid';
import PublicKey from './PublicKey'
import TextField from '@mui/material/TextField';
import { saveAs } from 'file-saver';
import JSzip from 'jszip'
import { useContractWrite, usePrepareContractWrite } from 'wagmi'
import KVStore from '../contracts/KVStore.json'
import { NFTStorage } from 'nft.storage'
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

import { wrap } from 'comlink';
import MyComlinkWorker,{api} from './generate.worker';
const Alert = forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const client = new NFTStorage({ token: process.env.REACT_APP_NFT_STORAGE_API })
export default function BasicButtons() {
  const [open, setOpen] = useState(false);



  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };
  const [name, setName] = useState()
  const [email, setEmail] = useState()
  const [password, setPassword] = useState()
  const [privateKey, setPrivateKey] = useState()
  const [publicKey, setPublicKey] = useState()
  const [fingerprint, setFingerprint] = useState()
  const [loading, setLoading] = useState(false)
  const [cid, setCid] = useState(false)


  const { config } = usePrepareContractWrite({
    addressOrName: process.env.REACT_APP_CONTRACT,
    contractInterface: KVStore.abi,
    functionName: 'setPGP',
    args: [fingerprint, cid]
  })
  const { write } = useContractWrite({
    ...config, onSuccess(data) {
      setOpen(true)
    }
  })
  async function generatePublicKey() {
    
setPublicKey(false)
    setLoading(true)
    try {
      // const myComlinkWorkerInstance = new MyComlinkWorker({type:"module",name:new Date().getTime()});
      // const myComlinkWorkerApi = wrap(myComlinkWorkerInstance);
      // const data=await myComlinkWorkerApi.generate(name,email,password);
      // const { privateKey: privkey, publicKey: pubkey }=data;
      // myComlinkWorkerInstance.terminate()
      // const { privateKey: privkey, publicKey: pubkey } = await generateKey({
      //   type: 'rsa', // Type of the key
      //   rsaBits: 2048, // RSA key size (defaults to 4096 bits)
      //   userIDs: [{ name, email }],
      //   passphrase: password

      // })
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({name,email,password})
      });
const { privateKey: privkey, publicKey: pubkey } = await res.json();
      setPrivateKey(privkey)
      setPublicKey(pubkey)
      const fingerprint2 = await readKey({ armoredKey: pubkey });
      setFingerprint(fingerprint2.getFingerprint())

      const someData = new Blob([pubkey])
      const cid = await client.storeBlob(someData)
      setCid(cid)

      setLoading(false)
    } catch (e) {
      console.log(e.message)
      setLoading(false)
      setPublicKey(false)
   
    }



  }
  
  async function downloadKey() {
    try {
      const pubkey = new Blob([publicKey], { type: 'text/plain' });
      const privkey = new Blob([privateKey], { type: 'text/plain' });
      const zip = new JSzip();

      zip.file("public_key.gpg", pubkey);
      zip.file("private_key", privkey);
      const ja = await zip.generateAsync({ type: "blob" })
      saveAs(ja, `${fingerprint}.zip`);
    } catch (e) {
      console.log(e.message)
    }

  }
  async function storeKV() {
    await write()
  }

  return (<Suspense>
    <Stack spacing={2} direction="column" justifyContent="center" marginTop={3} >
      <Snackbar open={open} autoHideDuration={3000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
          Transaction success
        </Alert>
      </Snackbar>
      <Grid container justifyContent="center" >
        <TextField autoComplete="" disabled={loading} id="outlined-basic" label="Name" value={name} onChange={e => setName(e.target.value)} variant="outlined" />
      </Grid>
      <Grid container justifyContent="center" >
        <TextField autoComplete="" type="email" disabled={loading} id="outlined-basic" label="Email" value={email} onChange={e => setEmail(e.target.value)} variant="outlined" />
      </Grid>
      <Grid container justifyContent="center" >
        <TextField autoComplete="" disabled={loading} id="outlined-basic" type="password" label="Passphrase" value={password} onChange={e => setPassword(e.target.value)} variant="outlined" />
      </Grid>
      <Grid container justifyContent="center" >
        <Button disabled={loading} variant="contained" onClick={generatePublicKey}>Generate Public Key</Button>
      </Grid>
      <Grid justifyContent="center" >
        {(loading || publicKey) && <PublicKey publicKey={publicKey} />}
      </Grid>
      <Grid container justifyContent="center" >
        {(loading || publicKey) && <Button disabled={loading} variant="contained" onClick={downloadKey}>Download Key</Button>}
      </Grid>
      <Grid container justifyContent="center" >
        {(loading || publicKey) && <Button disabled={loading || !write} sx={{ marginBottom: 10 }} variant="contained" onClick={storeKV}>Add Public Key to ETH-KVSTORE</Button>}
      </Grid>
    </Stack>
  </Suspense>
  );
}
