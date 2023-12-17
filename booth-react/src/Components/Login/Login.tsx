import { Box, Button, CircularProgress, TextField } from "@mui/material";
import './Login.scss';
import { useEffect, useState } from 'react';
import { BoothApi } from '../../Services/Booth-Api';
import { green } from "@mui/material/colors";

export default function LoginComponent() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('Not Logged In')
    const [isConnected, setIsConnected] = useState(false);
    const [loading, setLoading] = useState(false);

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
            setLoading(true);
            await api.login({
                username, password
            })
            setLoading(false);
            setMessage(`Welcome ${username}`)
        } catch (err) {
            setLoading(false);
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
                <div>
                    {loading && (
                        <CircularProgress
                            size={24}
                            sx={{
                                color: green[500]
                            }}
                        />
                    )}
                </div>
                <div>IsConnected: {isConnected}</div>
                <div>{message}</div>
            </Box>
        </div>
    );
}