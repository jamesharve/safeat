import { useState, useEffect } from "react";
import { Paper, makeStyles, Button, Snackbar } from "@material-ui/core"

import AutoCompleteTextField from "../AutoCompleteTextField/AutoCompleteTextField";
import styles from './Address.module.css'
import Alert from "@material-ui/lab/Alert";


const useStyles = makeStyles({
    root: {
        borderRadius: 20,
        margin: '30px',
    }
})

const Address = () => {

    const user = JSON.parse(sessionStorage.getItem('user'))
    const [openAlert, setOpenAlert] = useState(true)
    const [newAddress, setNewAddress] = useState(user.address)
    const classes = useStyles()

    useEffect(() => {
        setNewAddress(user.address)
    }, [alert])

    const handleUpdate = () => {
        const data = JSON.parse(sessionStorage.getItem('user'))

        user.address = newAddress
        sessionStorage.setItem('user', JSON.stringify(user)) //Using session storage for now
        //Call address updater here
        setOpenAlert(true)
    }

    return (
        <div className={styles.profileDiv}>
            <Paper elevation={3} variant="elevation" className={styles.container}>
                <h1>Change Your Address</h1>
                <p>Enter your new address to confirm the change</p>

                <div>
                    <label>Addess</label>
                    <AutoCompleteTextField fulwidth={true} value={newAddress} variant='outlined' callback={setNewAddress} />
                </div>

                <Button color="primary" variant="contained" classes={classes} onClick={handleUpdate}>Update Addess</Button>
                <Snackbar open={openAlert} autoHideDuration={6000} onClose={() => setOpenAlert(false)}>
                    <Alert severity={"success"}>
                    Address successfully updated!
                    </Alert> 
            </Snackbar>
            </Paper>
            
        </div>
    )
}

export default Address