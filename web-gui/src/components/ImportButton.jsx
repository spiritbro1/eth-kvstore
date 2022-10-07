import React,{useRef,forwardRef,useState} from 'react';
import Button from '@mui/material/Button';

import {  usePrepareContractWrite, useContractWrite} from 'wagmi'
import KVStore from '../contracts/KVStore.json'
import Grid from '@mui/material/Grid';
import { NFTStorage } from 'nft.storage'
import * as openpgp from 'openpgp'

const client = new NFTStorage({ token: process.env.REACT_APP_NFT_STORAGE_API })

export default function BasicCard({setOpen}) {
  const { config } = usePrepareContractWrite({
    addressOrName: process.env.REACT_APP_CONTRACT,
    contractInterface: KVStore.abi,
    functionName: 'setPGP',
    args:['',''],
    overrides:{
      gasLimit:2e5
    }
  })
  const {  writeAsync } = useContractWrite({...config,onSuccess(){
    console.log("SUCCESS")
    setOpen(true)
  }})
    const inputRef = useRef(null);
    const handleFile = async (e) => {
      const pubkey = e.target.result;
         const fingerprint2 = await openpgp.readKey({ armoredKey: pubkey });
    
      const someData = new Blob([pubkey])
      const cid2 = await client.storeBlob(someData)

try{await writeAsync({
  recklesslySetUnpreparedArgs:[fingerprint2.getFingerprint(),cid2],
});}catch(e){
  console.log(e.message)
}
      
   
      
    }
    
    const handleChange = (ev) => {
    
      const reader = new FileReader();
      reader.addEventListener('load', handleFile);
      reader.readAsText(ev.target.files[0]);
    };
    const handleClick = () => {
      inputRef.current.click();
    };
  return (
    <Grid container  margin={5} >
    
    <Button variant="contained" onClick={handleClick}>Import Public Key</Button>
    <input
      type="file"
      aria-label="add files"
      style={{ display: "none" }}
      ref={inputRef}
      onChange={handleChange}
      onClick={handleClick}
    />
  </Grid>
  );
}
