import React, { useState,forwardRef } from 'react';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import * as openpgp from 'openpgp';

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
  const { write } = useContractWrite({...config,onSuccess(data) {
    setOpen(true)
  }})
  async function generatePublicKey() {
    setLoading(true)
    try {
      const { privateKey: privkey, publicKey: pubkey } = await openpgp.generateKey({
        type: 'rsa', // Type of the key
        rsaBits: 4096, // RSA key size (defaults to 4096 bits)
        userIDs: [{ name, email }],
        passphrase: password

      });

      setPrivateKey(privkey)
      setPublicKey(pubkey)
      const fingerprint2 = await openpgp.readKey({ armoredKey: pubkey });
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

  return (
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
  );
}
