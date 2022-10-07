import React, { useState } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import { useContractRead, useAccount } from 'wagmi'
import KVStore from '../contracts/KVStore.json'
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import * as openpgp from 'openpgp';
import Collapse from '@mui/material/Collapse';
import Alert from '@mui/material/Alert';
export default function ColorTextFields() {
  const [open, setOpen] = useState(false);

  

  const handleClose = (event, reason) => {
   

    setOpen(false);
  };
  const { address } = useAccount();
  const [key, setKey] = useState();
  const [value, setValue] = useState();
  const [decrypted, setDecrypted] = useState();
  const [privkey, setPrivkey] = useState();
  const [reveal, setReveal] = useState(false);
  const [password, setPassword] = useState('');
  const inputRef = React.useRef(null);
  const { refetch } = useContractRead({
    addressOrName: process.env.REACT_APP_CONTRACT,
    contractInterface: KVStore.abi,
    functionName: 'get',
    args: [address, key]
  })
  async function getValue() {
    try{
      const { data } = await refetch();
      setValue(data)
    }catch(e){
      setValue(false)
    }
    
  }
  const handleFile = (e) => {
    const content = e.target.result;
    setPrivkey(content)


  }

  const handleChange = (ev) => {

    const reader = new FileReader();
    reader.addEventListener('load', handleFile);
    reader.readAsText(ev.target.files[0]);
  };
  const handleClick = () => {
    inputRef.current.click();
  };
  async function decryptValue() {
    try{
      const privateKey = password.length > 0 ? (await openpgp.decryptKey({
        privateKey: await openpgp.readPrivateKey({ armoredKey: privkey }),
        passphrase: password
      })) : (await openpgp.readPrivateKey({ armoredKey: privkey }));
      const message = await openpgp.readMessage({
        armoredMessage: value // parse armored message
      });
  
      const { data: decryptedVal } = await openpgp.decrypt({
        message,
        decryptionKeys: privateKey
      });
  
      setDecrypted(decryptedVal)
    }catch(e){
setDecrypted(false)
setOpen(true)
    }
    
  }
  return (
    <Box
      component="form"
      margin={2}
      noValidate
      autoComplete="off"
    >


      <TextField value={key} onChange={e => setKey(e.target.value)} style={{ marginTop: 10 }} fullWidth label="Key" />

      <Button style={{ marginTop: 5 }} variant="contained" onClick={getValue}>Get</Button>
      <Divider sx={{ marginTop: 3 }} />
      {value && <Card sx={{ minWidth: 275 }}>
        <CardContent>
          <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
            Value
          </Typography>
          <Typography variant="h5" component="div">
            {value}
          </Typography>

        </CardContent>

      </Card>}

      {/* <TextField style={{marginTop:10}} fullWidth label="Private Key"  />
    <Grid container justifyContent="center" >
    OR
      </Grid> */}
      {value && <><Grid container  >
        <h1>DECRYPT</h1>
       
      </Grid>
      <Collapse in={open}>
        <Alert onClose={handleClose} severity="error" sx={{ width: '100%' }}>
          Error decrypting
        </Alert>
        </Collapse>
      <Grid container sx={{ marginBottom: 3 }} >
        <Button style={{ marginTop: 5 }} variant="contained" onClick={handleClick}>Upload Private Key</Button>
        <input
          type="file"
          aria-label="add files"
          style={{ display: "none" }}
          ref={inputRef}
          onChange={handleChange}

        />
      </Grid>
      <Card sx={{ minWidth: 275 }}>
        <CardContent>
          <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
            Private Key
          </Typography>
          <Button disabled={!privkey} style={{ marginTop: 5 }} variant="contained" onClick={e => setReveal(!reveal)}>Reveal Private Key</Button>
          <Typography variant="h5" component="div">
            {reveal && privkey}
          </Typography>

        </CardContent>

      </Card>
      <TextField disabled={!privkey} value={password} onChange={e => setPassword(e.target.value)} style={{ marginTop: 10 }} fullWidth label="Passphrase" />
      <Button disabled={!privkey} style={{ marginTop: 5 }} variant="contained" onClick={decryptValue}>Decrypt</Button>
      {decrypted && <Card sx={{ minWidth: 275, marginTop: 2 }}>
        <CardContent>
          <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
            Decrypted Value
          </Typography>
          <Typography variant="h5" component="div">
            {decrypted}
          </Typography>

        </CardContent>

      </Card>}</>}
    </Box>
  );
}
