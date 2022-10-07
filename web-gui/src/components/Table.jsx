import React,{useState,forwardRef} from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import { useContractRead,useAccount,useContractEvent } from 'wagmi'
import KVStore from '../contracts/KVStore.json'
import ImportButton from './ImportButton'
import Alert from '@mui/material/Alert';
import Collapse from '@mui/material/Collapse';


const columns = [
  { id: 'publicKey', label: 'Public Key', minWidth: 100 }
];





export default function ColumnGroupingTable() {
  const { address } = useAccount()
  
 
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [rows, setRows] = useState([]);

  

  const {refetch}=useContractRead({
    addressOrName: process.env.REACT_APP_CONTRACT,
    contractInterface: KVStore.abi,
    functionName: 'getAllPGP',
    args:address,
    onSuccess(data) {
      const newData=data?.map(a=>({publicKey:a})) 
      setRows(newData)
    },
  })
  // setRows(newData)
  useContractEvent({
    addressOrName: process.env.REACT_APP_CONTRACT,
    contractInterface: KVStore.abi,
    eventName: 'PGPset',
    listener: async (event) => {
      if(event[0]===address){
        const {data}=await refetch();
        
        const newData=data?.map(a=>({publicKey:a})) 
        setRows(newData)
      }
    },
  })
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };
  const [open,setOpen]=useState(false)
 
  return (
    <>
    
    <Collapse in={open}>
    <Alert severity="success" onClose={() => setOpen(!open)}>Transaction successful</Alert>
    </Collapse>
    
      
      <ImportButton setOpen={setOpen}/>
      
    <Paper sx={{ margin:5 }}>
   
    
      <TableContainer >
        <Table >
          <TableHead>
            
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  style={{ top: 57, minWidth: column.minWidth,fontWeight:"bold" }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row,index) => {
                return (
                  <TableRow hover role="checkbox" tabIndex={-1} key={index}>
                    {columns.map((column) => {
                      const value = row[column.id];
                      return (
                        <TableCell key={column.id} align={column.align}>
                          <a rel="noreferrer" href={`https://ipfs.io/ipfs/${value}`} target="_blank" style={{color:"blue"}}>{value}</a>
                        </TableCell>
                      );
                    })}
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={rows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
    </>
  );
}
