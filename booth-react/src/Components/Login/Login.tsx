import { Box, Button, TextField } from "@mui/material";
import './Login.scss';
import { useState } from 'react';
import { BoothApi } from '../../Services/Booth-Api';

export default function LoginComponent() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('Not Logged In')

    const api = BoothApi.instance;

    const updateUsername = (e: any) => {
        setUsername(e.target.value);
    }

    const updatePassword = (e: any) => {
        setPassword(e.target.value);
    }

    const doLogin = async () => {
        try {
            const resp: Response = await api.login({
                username: username,
                password: password
            });
            const json = await resp.json();
            if (!resp.ok) {
                setMessage(`${resp.status}. ${json}`);
            } else {
                setMessage(`Welcome ${username}`);
                api.setJwtToken(JSON.stringify(resp.json));
            }
        } catch (err) {
            if (err instanceof Error) {
                setMessage(err.message);
            } else {
                console.log(err);
            }
        }
    }

    return (
        <div className="div-container">
            <Box component='form' m={2} display='flex' flexDirection='row' alignItems='center' columnGap={2}>
                <TextField id="outlined-basic" value={username} onChange={updateUsername} label="Username" variant="outlined" />
                <TextField id="outlined-basic" value={password} onChange={updatePassword} label="Password" variant="outlined" />
                <Button variant="outlined" onClick={doLogin}>Login</Button>
                <div>{message}</div>
            </Box>
        </div>
    );
}