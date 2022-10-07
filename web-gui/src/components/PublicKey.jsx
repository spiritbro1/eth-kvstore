import React,{useState} from 'react';
import Card from '@mui/material/Card';

import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';



export default function BasicCard({publicKey}) {
  const [reveal,setReveal]=useState(false)
  return (
    <>
    <Card sx={{ minWidth: 275,marginLeft:2,marginRight:2 }}>
      <CardContent>
        <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
          Public Key
        </Typography>
        <Button disabled={!publicKey}  variant="contained" onClick={()=>setReveal(!reveal)}>Reveal Public Key</Button>
        {reveal && <Typography  component="div">
        {publicKey}
        </Typography>}
        
      </CardContent>
      
    </Card>
    </>
  );
}
