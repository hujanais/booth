import './App.scss';

import { ThemeProvider } from '@emotion/react';
import { Divider, createTheme } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import HeaderComponent from './Components/Header/Header';
import LoginComponent from './Components/Login/Login';
import { RoomsComponent } from './Components/Rooms/RoomsComponent';
import { CreateRoomComponent } from './Components/CreateRoom/CreateRoomComponent';
import { RoomComponent } from './Components/Room/RoomComponent';

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
        <Divider/>
        <CreateRoomComponent></CreateRoomComponent>
        <Divider/>
        <div className='div-rooms'>
        <RoomsComponent></RoomsComponent>
        </div>
        <Divider/>
        <div className='div-room'>
          <RoomComponent></RoomComponent>
        </div>
      </div>
    </ThemeProvider>
  );
}

export default App;