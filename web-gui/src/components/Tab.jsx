import * as React from 'react';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import SwipeableViews from 'react-swipeable-views';
import GeneratePGP from './GeneratePGP'
import KeyValue from './KeyValue'
import Decrypt from './Decrypt'
import Table from './Table'

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {children}
    </div>
  );
}
export default function CenteredTabs() {
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const handleChangeIndex = (index) => {
    setValue(index);
  };
  return (
    <Box sx={{ width: '100%', bgcolor: 'background.paper' }}>
      <Tabs value={value} onChange={handleChange} variant="fullWidth" >
        <Tab label="Generate Public Key" >
   
        </Tab>
        <Tab label="List Public Key" />
        <Tab label="Key Value Store" />
        <Tab label="Decrypt" />
      </Tabs>
      <SwipeableViews
    
        index={value}
        onChangeIndex={handleChangeIndex}
      >
        <TabPanel value={value} index={0} >
        <GeneratePGP/>
        </TabPanel>
        <TabPanel value={value} index={1} >
        <Table/>
        </TabPanel>
        <TabPanel value={value} index={2}>
          <KeyValue/>
        </TabPanel>
        <TabPanel value={value} index={3}>
          <Decrypt/>
        </TabPanel>
      </SwipeableViews>
    </Box>
  );
}