import React, { useEffect, useState } from 'react'
import { BoothApi } from '../../Services/Booth-Api'
import { Subscription } from 'rxjs';
import { RoomUpdatedModel } from '../../Models/ws-models';
import { RoomModel } from '../../Models/room-model';
import { Button, List, ListItem, ListItemText, Typography } from '@mui/material';
import Moment from 'moment';

import './RoomComponent.scss';
import { MessageModel } from '../../Models/message-model';

export const RoomComponent = () => {

  const api = BoothApi.instance;
  const [currentRoom, setCurrentRoom] = useState<RoomModel | undefined>(undefined);

  useEffect(() => {
    const subscriptions = new Subscription();

    subscriptions.add(api.wssInstance.newMessage.subscribe({
      next: (room: RoomUpdatedModel) => {
        if (!currentRoom) {
          setCurrentRoom(room);
          return;
        }
      }
    }));

    return (() => {
      subscriptions.unsubscribe();
    })
  }, [currentRoom]);

  return (
    <div className='div-room-container'>
      <div className='div-room-container__header'>
        {currentRoom ? currentRoom.title : 'none'}
        <Button variant="outlined">Exit</Button>
      </div>
      {currentRoom &&
        <div className='div-room-container__chat'>
          <List sx={{ width: '100%', overflow: 'auto', bgcolor: 'background.paper' }}>

            {currentRoom.messages.map((msg: MessageModel) => (
              <ListItem alignItems='flex-start'>
                <ListItemText
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
