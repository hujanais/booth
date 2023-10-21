import './App.scss';

import { ThemeProvider } from '@emotion/react';
import { createTheme } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import HeaderComponent from './Components/Header/Header';
import LoginComponent from './Components/Login/Login';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

function App() {
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <div className='app-container'>
        <HeaderComponent></HeaderComponent>
        <LoginComponent></LoginComponent>
        <div>Create Rooms</div>
        <div>Rooms</div>
        <div>Room</div>
      </div>
    </ThemeProvider>
  );
}

export default App;