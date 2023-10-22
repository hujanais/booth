import { Box, TextField, Button } from '@mui/material'
import { SyntheticEvent, useState } from 'react';
import { BoothApi } from '../../Services/Booth-Api';

export const CreateRoomComponent = () => {

    const api = BoothApi.instance;

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [message, setMessage] = useState('');

    const titleChanged = (e: any) => { 
        setTitle(e.target.value);
    }

    const descriptionChanged = (e: any) => { 
        setDescription(e.target.value);
    }

    const createRoom = async () => {
        try {
            await api.createRoom({
                title,
                description
            });

            setMessage('');
        } catch (err) {
            if (err instanceof Error) {
                setMessage(err.message);
            }
        }
    }

    return (
        <Box component='form' m={2} display='flex' flexDirection='row' alignItems='center' columnGap={2}>
            <TextField id="outlined-basic" value={title} onChange={titleChanged} label="Title" variant="outlined" />
            <TextField id="outlined-basic" value={description} onChange={descriptionChanged} label="Description" variant="outlined" />
            <Button variant="outlined" onClick={createRoom}>Create Room</Button>
            <div>{message}</div>
        </Box>
    )
}
