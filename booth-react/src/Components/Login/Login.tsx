import { Box, Button, TextField } from "@mui/material";
import './Login.scss';
import { useEffect, useState } from 'react';
import { BoothApi } from '../../Services/Booth-Api';

export default function LoginComponent() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('Not Logged In')
    const [isConnected, setIsConnected] = useState(false);

    const api = BoothApi.instance;

    useEffect(() => {
        api.wssInstance.isConnected.subscribe(isAlive => {
            setIsConnected(isAlive);
        });
    });

    const updateUsername = (e: any) => {
        setUsername(e.target.value);
    }

    const updatePassword = (e: any) => {
        setPassword(e.target.value);
    }

    const doLogin = async () => {
        try {
            await api.login({
                username, password
            })
            setMessage(`Welcome ${username}`)
        } catch (err) {
            if (err instanceof Error) {
                setMessage(err.message);
            }
        }
    }

    return (
        <div className="div-container">
            <Box component='form' m={2} display='flex' flexDirection='row' alignItems='center' columnGap={2}>
                <TextField id="outlined-basic" value={username} onChange={updateUsername} label="Username" variant="outlined" />
                <TextField id="outlined-basic" value={password} onChange={updatePassword} label="Password" variant="outlined" />
                <Button variant="outlined" onClick={doLogin}>Login</Button>
                <div>IsConnected: {isConnected}</div>
                <div>{message}</div>
            </Box>
        </div>
    );
}