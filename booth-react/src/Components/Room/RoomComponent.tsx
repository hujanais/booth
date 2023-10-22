import React, { useEffect, useState } from 'react'
import { BoothApi } from '../../Services/Booth-Api'
import { Subscription } from 'rxjs';
import { RoomUpdatedModel } from '../../Models/ws-models';
import { RoomModel } from '../../Models/room-model';
import { Button, List, ListItem, ListItemText, Typography } from '@mui/material';
import Moment from 'moment';

import './RoomComponent.scss';
import { MessageModel } from '../../Models/message-model';
import { MessageInputComponent } from '../MessageInput/MessageInputComponent';

export const RoomComponent = () => {

  const api = BoothApi.instance;
  const [currentRoom, setCurrentRoom] = useState<RoomModel | undefined>(undefined);

  useEffect(() => {
    const subscriptions = new Subscription();

    subscriptions.add(api.wssInstance.newMessage.subscribe({
      next: (room: RoomUpdatedModel) => {
        if (!currentRoom) {
          // hydrate.
          setCurrentRoom(room);
          return;
        } else {
          // update.
          const clonedObj = {...currentRoom};
          clonedObj.title = room.title;
          clonedObj.description = room.description;
          clonedObj.messages = room.messages;
        
          setCurrentRoom(clonedObj);
        }
      }
    }));

    return (() => {
      subscriptions.unsubscribe();
    })
  }, [currentRoom]);

  const exitRoom = async () => {
    if (!currentRoom) return;
    try {
      const resp = await api.exitRoom(currentRoom.id)
      setCurrentRoom(undefined);
    } catch (err) {
      if (err instanceof Error) {
        console.log(err.message);
      }
    }
  }

  const handleNewMessage = async (msg: string) => {
    if (!currentRoom) return;

    try {
      api.sendMessage({
        roomId: currentRoom.id,
        message: msg
      });
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <div className='div-room-container'>
      <div className='div-room-container__header'>
        {currentRoom && <Button variant="outlined" onClick={exitRoom}>Exit</Button>}
        {currentRoom ? currentRoom.title : 'none'}
        {<MessageInputComponent onNewMessage={handleNewMessage}></MessageInputComponent>}
      </div>
      {currentRoom &&
        <div className='div-room-container__chat'>
          <List sx={{ width: '100%', overflow: 'auto', bgcolor: 'background.paper' }}>

            {currentRoom.messages.map((msg: MessageModel) => (
              <ListItem alignItems='flex-start'>
                <ListItemText key={msg.id}
                  primary={`${msg.owner.username} - ${Moment(msg.timestamp).format('lll')}`}
                  secondary={
                    <React.Fragment>
                      <Typography
                        sx={{ display: 'inline' }}
                        component="span"
                        variant='body2'
                        color="text.primary"
                      >
                      </Typography>
                      {`${msg.message}`}
                    </React.Fragment>
                  }
                />

              </ListItem>
            ))}
          </List>
        </div>
      }
    </div>
  )
}
