import React, { useState, forwardRef } from 'react'
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import Select from '@mui/material/Select'
import {
  useContractRead,
  useAccount,
  useContractEvent,
  usePrepareContractWrite,
  useContractWrite,
} from 'wagmi'
import KVStore from '../contracts/KVStore.json'
import * as openpgp from 'openpgp'
import Collapse from '@mui/material/Collapse'
import Alert from '@mui/material/Alert'
export default function ColorTextFields() {
  const [open, setOpen] = useState(false)

  const handleClose = (event, reason) => {
    setOpen(false)
  }
  const { address } = useAccount()
  const [option, setOption] = useState([])
  const [selected, setSelected] = useState()
  const [loading, setLoading] = useState(false)
  const [key, setKey] = useState()
  const [value, setValue] = useState()
  const { refetch } = useContractRead({
    addressOrName: process.env.REACT_APP_CONTRACT,
    contractInterface: KVStore.abi,
    functionName: 'getAllPGP',
    args: address,
    onSuccess(data) {
      const newData = data?.map((a) => ({ publicKey: a }))
      setOption(newData)
    },
  })
  const { config } = usePrepareContractWrite({
    addressOrName: process.env.REACT_APP_CONTRACT,
    contractInterface: KVStore.abi,
    functionName: 'set',
    args: [key, value],
  })
  const { writeAsync } = useContractWrite({
    ...config,
    onSuccess() {
      setOpen(true)
    },
  })
  useContractEvent({
    addressOrName: process.env.REACT_APP_CONTRACT,
    contractInterface: KVStore.abi,
    eventName: 'PGPset',
    listener: async (event) => {
      if (event[0] === address) {
        const { data } = await refetch()
        const newData = data?.map((a) => ({ publicKey: a }))
        setOption(newData)
      }
    },
  })
  async function storeKeyValue() {
    setLoading(true)
    try {
      const res = await fetch(`https://ipfs.io/ipfs/${selected}`)
      const publicKeyArmored = await res.text()
      const publicKey = await openpgp.readKey({ armoredKey: publicKeyArmored })
      const encrypted = await openpgp.encrypt({
        message: await openpgp.createMessage({ text: value }), // input as Message object
        encryptionKeys: publicKey,
        config: {
          preferredCompressionAlgorithm: openpgp.enums.compression.zlib,
        },
      })

      await writeAsync({
        recklesslySetUnpreparedArgs: [key, encrypted],
      })

      setLoading(false)
    } catch (e) {
      setOpen(false)
      console.log(e.message)
      setLoading(false)
    }
  }
  return (
    <Box component="form" margin={2} noValidate autoComplete="off">
      <Collapse in={open}>
        <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
          Transaction success
        </Alert>
      </Collapse>
      <TextField
        disabled={loading}
        value={key}
        onChange={(e) => setKey(e.target.value)}
        fullWidth
        label="Key"
      />
      <TextField
        disabled={loading}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        style={{ marginTop: 10 }}
        fullWidth
        label="Value"
      />
      <FormControl fullWidth sx={{ marginTop: 1 }}>
        <InputLabel>Public Key</InputLabel>
        <Select
          disabled={loading}
          label="Public Key"
          onChange={(e) => setSelected(e.target.value)}
          value={selected}
        >
          {option.map((a) => {
            return (
              <MenuItem key={a.publicKey} value={a.publicKey}>
                {a.publicKey}
              </MenuItem>
            )
          })}
        </Select>

        {/* <Button variant="contained">Add Public Key</Button> */}
      </FormControl>
      <Button
        disabled={loading}
        style={{ marginTop: 5 }}
        onClick={storeKeyValue}
        variant="contained"
      >
        Store
      </Button>
    </Box>
  )
}
