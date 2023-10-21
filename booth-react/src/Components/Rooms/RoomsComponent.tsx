import './RoomsComponent.scss';
import { Box, Button, IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import { useEffect, useState } from 'react';
import { Chat, DeleteForever } from '@mui/icons-material';
import { BoothApi } from '../../Services/Booth-Api';
import { RoomModel } from "../../Models/room-model";
import { RoomChangedModel, RoomUpdatedModel } from "../../Models/ws-models";
import { Subscription } from "rxjs";


export const RoomsComponent = () => {

  const [message, setMessage] = useState('');
  const [rooms, setRooms] = useState<RoomModel[]>([]);
  const api = BoothApi.instance;

  useEffect(() => {
    console.log('useEffect');
    const subscriptions = new Subscription();

    subscriptions.add(api.wssInstance.roomAdded.subscribe({
      next: (data: RoomChangedModel) => {
        setRooms([...data.rooms]);
      }
    }))

    subscriptions.add(api.wssInstance.roomDeleted.subscribe({
      next: (data: RoomChangedModel) => {
        setRooms([...data.rooms]);
      }
    }))

    subscriptions.add(api.wssInstance.roomUpdated.subscribe({
      next: (data: RoomUpdatedModel) => {
        const clonedArr = [...rooms];

        const room = clonedArr.find(r => r.id === data.id);
        if (room) {
          room.title = room.title;
          room.description = room.description;
          room.users = [...data.users];
        
          setRooms(clonedArr);
        }
      }
    }))

    return () => {
      console.log('useEffect-cleanup');
      subscriptions.unsubscribe();
    }
  }, [rooms]);

  const doRefresh = async () => {
    try {
      const allRooms: RoomModel[] = await api.getAllRooms();
      setRooms([...allRooms])
      setMessage('');
    } catch (err) {
      if (err instanceof Error) {
        setMessage(err.message);
      }
    }
  }

  const deleteRoom = async (roomId: string) => {
    try {
      await api.deleteRoom(roomId);
      setMessage('');
    } catch (err) {
      if (err instanceof Error) {
        setMessage(err.message);
      }
    }
  }

  const joinRoom = async (roomId: string) => {
    try {
      const room: RoomModel = await api.joinRoom(roomId);
      setMessage('');
    } catch (err) {
      if (err instanceof Error) {
        setMessage(err.message);
      }
    }
  }


  return (
    <div className='div-rooms-container'>
      <Box display='flex' padding={1} flexDirection='row' alignItems='center' columnGap={2}>
        <div>Rooms</div>
        <Button onClick={doRefresh} variant="outlined">Refresh</Button>
        <div>{message}</div>
      </Box>
      <div className='table-container'>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 300 }} stickyHeader size='small' aria-label='a dense table'>
            <TableHead>
              <TableRow>
                <TableCell align='left' style={{ width: 'auto' }}>Title</TableCell>
                <TableCell align='right' style={{ width: 'auto' }}>Description</TableCell>
                <TableCell align='right' style={{ width: 'auto' }}>Owner</TableCell>
                <TableCell align='right' style={{ width: 'auto' }}>nUsers</TableCell>
                <TableCell align='right' style={{ width: 'auto' }}></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rooms.map((row: RoomModel) => (
                <TableRow key={row.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                  <TableCell align='left'>{row.title}</TableCell>
                  <TableCell align='right'>{row.description}</TableCell>
                  <TableCell align='right'>{row.owner.username}</TableCell>
                  <TableCell align='right'>{row.users.length}</TableCell>
                  <TableCell align='right'>
                    <IconButton onClick={() => joinRoom(row.id)} size="large">
                      <Chat />
                    </IconButton>
                    <IconButton onClick={() => deleteRoom(row.id)} size='large'>
                      <DeleteForever />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </div>
  )
}
