import React, { useState, useEffect, useReducer } from 'react'
import { Button, TextField } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import Snackbar from '@material-ui/core/Snackbar'
import Switch from '@material-ui/core/Switch';
import { useHistory, useLocation } from 'react-router-dom'
import {useDispatch, useSelector} from 'react-redux'

import AutoCompleteTextField from '../../AutoCompleteTextField/AutoCompleteTextField'
import Alert from './Alert'
import styles from '../../../assets/styles/pages/Login.module.css'
import {signIn, signUp} from '../../../store/actions/user';

const useStyles = makeStyles({
    root: {
        borderRadius: 30,
        marginTop: 10,
        marginBottom: 10,
        color: '#fff',
    }
})

const Login = (props) => {

    useEffect(() => {
        if(window.innerWidth >600) {
            document.getElementsByClassName(styles.image__btn)[0].addEventListener('click', () => {
                document.getElementsByClassName(styles.container)[0].classList.toggle(styles.sSignUp)
            })
        }
        if(props.signUp) {
            document.getElementsByClassName(styles.mUp)[1].click()
        }
    }, [])

    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [address, setAddress] = useState('')
    const [isLogin, setIsLogin] = useState(true)
    const [checked, setChecked] = useState(false)
    const [vError, setVError] = useState(false)
    const [vErrorMessage, setVErrorMessage] = useState('')
    const [openError, setOpenError] = useState(false)
    const buttonClasses = useStyles()
    const error = useSelector(state => state.user.error)
    const isLoading = useSelector(state => state.user.isLoading)
    const user = useSelector(state => state.user.user)
    const history = useHistory()
    const dispatchRedux = useDispatch();

    const data = {
        name: name,
        email: email,
        password: password,
        confirmPassword: confirmPassword,
        address: address,
    }


    useEffect(() => {
        if(user != null){
            sessionStorage.setItem('isOwner', checked)
            const userRoute = sessionStorage.getItem('address') ? '/home' : '/'
            const ownerRoute = '/dashboard'
            const destination = checked ? ownerRoute : userRoute
            history.push(destination)
        }
    },[user])

    useEffect(() => {
        setOpenError(!!error)
    },[error])

    const [displayTexts, dispatch] = useReducer((displayTexts, action) => {
        switch (action.type) {
            case 'RESTAURANT':      
                return {
                    ...displayTexts,
                    h1First: 'Not yet part of the team??',
                    pFirst: 'Discover a world of customers now within your reach!',
                    h1Second: 'Already a world changer?',
                    pSecond: 'Hop back in to continue providing great customer value!',
                }
            case 'USER':      
                return {
                    ...displayTexts,
                    h1First: 'New here?',
                    pFirst: 'Sign Up and discover new Cuisine!',
                    h1Second: 'Already have an account?',
                    pSecond: 'Just Sign in and start your journey in discovering new cuisine!',
                }
            default: return displayTexts
        }
    }, {
        h1First: 'New here?',
        pFirst: 'Sign Up and discover new Cuisine!',
        h1Second: 'Already have an account?',
        pSecond: 'Just Sign in and start your journey in discovering new cuisine!',
    })

    const handleLoginSignup = async (e) => {

        e.preventDefault()
        if(validate()) {
            setVError(false)
            
            const user = {
                'name' : name,
                'email' : email,
                'password' : password,
                'address' : address
            }
            if(isLogin) {
                dispatchRedux(signIn(user))
            } else {
                dispatchRedux(signUp(user, checked))
            }
        }
    }

    const swicthMode = () => {
        setIsLogin(!isLogin)
    }

    const handleCheckedChange = () => {
        setChecked(!checked)
        dispatch({ type: checked ? 'USER' : 'RESTAURANT' })
        if(window.innerWidth > 600) {
            document.getElementById('container').classList.toggle(styles.expanded)
        }
    }

    const validate = () => {
        let errors = {};
        let result = true
        if(isLogin) {
            if (!email) {
                errors.email = 'Email Required'
                result = false
            }
            if (!password){
                errors.password = 'Password Required'
                result = false
            }
        } else {
            if (!email) {
                errors.email = 'Email Required'
                result = false
            }
            if(!name){
                errors.name = 'Name Required'
                result = false
            }
            if(!password || password.length <4){
                errors.password ='Password must Be at least 4 characters'
                result = false
            }
            if(confirmPassword !== password){
                errors.confirmPassword = 'Make sure passwords match'
                result = false
            }
        }
        if(errors) {
            setVErrorMessage(errors.name || errors.email || errors.password || errors.address || errors.confirmPassword || '')
            setVError(true)
        }
        setOpenError(!result)
        return result
    }
    return (
        <div className={styles.login__div}>
            {window.innerWidth > 600 ? <div id='container' className={styles.container}>
                <div className={styles.form + ' ' +styles.sign__in}>
                    <form autoComplete='off'  onSubmit={handleLoginSignup}>
                        <h2 className={styles.header__text}> Sign In</h2>
                        <br/>
                        <br/>
                        <label className={styles.label}>
                            <span>Email Address</span>.
                            <TextField id='enterEmail' className={styles.input} onChange={e => setEmail(e.target.value)} value={email} />
                        </label>
                        
                        <label className={styles.label}>
                            <span>Password</span>
                            <TextField id='enterPassword' className={styles.input} onChange={e => setPassword(e.target.value)} type="password" value={password} />
                        </label>
                        <Button id='SubmitSign' type="submit" className={styles.submit + " " + styles.buttonMarg  + " " + styles.Button} classes={buttonClasses}><span >Sign In</span></Button>
                        <br/>
                        { checked && <h4 className={styles.welcome__text}>Hey welcome back! Hop back in to continue providing great customer experience while increasing your revenue with Safeat</h4>}
                        { isLoading &&  <CircularProgress color='secondary' size={20}/> }
                    </form>
                </div>
                <div className={styles.sub__container}>
                    <div id='image-div' className={styles.image}>
                        <div className={styles.img__text + ' ' + styles.mUp}>
                            <h2 className={styles.header__text} id='signup-h1-first'>{displayTexts.h1First}</h2>
                            <p id='signup-p1-secondText'>{displayTexts.pSecond}</p>
                        </div>
                        <div className={styles.img__text + ' ' + styles.mIn}>
                            <h2 className={styles.header__text} id='login-h1-first' >{displayTexts.h1Second}</h2>
                            <p id='login-p1-secondText'>{displayTexts.pSecond}</p>
                        </div>
                        <div>
                            <div id='SignUp' className={styles.image__btn} onClick={swicthMode}>
                                <span className={styles.mUp}>Sign Up</span>
                                <span className={styles.mIn}>Sign In</span>
                            </div>
                        </div>
                    </div>
                    <div className={styles.form + ' ' + styles.sign__up}>
                        <form id='signupForm' autoComplete='false' onSubmit={handleLoginSignup}>
                            <h2 className={styles.header__text}>Sign Up</h2>
                            <label className={styles.label}>
                                <span>{checked ? 'Restaurant' : 'Full'} Name</span>
                                <TextField id='FullName' className={styles.input} onChange={e => setName(e.target.value)} value={name} />
                            </label>
                            <label className={styles.label}>
                                 <span>Email Address</span>
                                <TextField id='Email' className={styles.input} onChange={e => setEmail(e.target.value)} value={email} />
                            </label>
                            <label className={styles.label}>
                                <span>Password</span>
                                <TextField id='Password' className={styles.input} onChange={e => setPassword(e.target.value)} type='password' value={password} />
                            </label>
                            <label className={styles.label}>
                                <span>Confirm Password</span>
                                <TextField id='ConfirmPassword' className={styles.input} onChange={e => setConfirmPassword(e.target.value)} type='password' value={confirmPassword} />
                            </label>
                            { checked && <label className={styles.label}> <span> Restaurant Address </span></label> }
                            { checked && <AutoCompleteTextField callback={(e) => {setAddress(e)}} type='text' value={address} /> }
                            
                            <Button id='SubmitRegistration' type='submit'  className={styles.submit + ' ' + styles.button__marg + ' ' + styles.Button} classes={buttonClasses}><span>Sign Up</span></Button>
                            <br/>
                            { isLoading && <CircularProgress color='secondary' size={20}/> }
                        </form>
                    </div>
                </div>
            </div>: <div style={{backgroundColor:'white', padding: '60px 40px', borderRadius: '10px'}}>
                {isLogin ? <form autoComplete='off'  onSubmit={handleLoginSignup}>
                        <h2 className={styles.header__text}> Sign In</h2>
                        <br/>
                        <br/>
                        <label className={styles.label}>
                            <span>Email Address</span>.
                            <TextField id='enterEmail' className={styles.input} onChange={e => setEmail(e.target.value)} value={email} />
                        </label>

                        <label className={styles.label}>
                            <span>Password</span>
                            <TextField id='enterPassword' className={styles.input} onChange={e => setPassword(e.target.value)} type="password" value={password} />
                        </label>
                        <Button id='SubmitSign' type="submit" className={styles.submit + " " + styles.buttonMarg  + " " + styles.Button} classes={buttonClasses}><span >Sign In</span></Button>
                        <div id='SignUp' className={styles.image__btn} onClick={swicthMode}>
                            <span className={styles.mUp}>Sign Up</span>
                            <span className={styles.mIn}>Sign In</span>
                        </div>
                        { isLoading &&  <CircularProgress color='secondary' size={20}/> }
                    </form>:
                    <form id='signupForm' autoComplete='false' onSubmit={handleLoginSignup}>
                        <h2 className={styles.header__text}>Sign Up</h2>
                        <label className={styles.label}>
                            <span>{checked ? 'Restaurant' : 'Full'} Name</span>
                            <TextField id='FullName' className={styles.input} onChange={e => setName(e.target.value)} value={name} />
                        </label>
                        <label className={styles.label}>
                            <span>Email Address</span>
                            <TextField id='Email' className={styles.input} onChange={e => setEmail(e.target.value)} value={email} />
                        </label>
                        <label className={styles.label}>
                            <span>Password</span>
                            <TextField id='Password' className={styles.input} onChange={e => setPassword(e.target.value)} type='password' value={password} />
                        </label>
                        <label className={styles.label}>
                            <span>Confirm Password</span>
                            <TextField id='ConfirmPassword' className={styles.input} onChange={e => setConfirmPassword(e.target.value)} type='password' value={confirmPassword} />
                        </label>
                        { checked && <label className={styles.label}> <span> Restaurant Address </span></label> }
                        { checked && <AutoCompleteTextField callback={(e) => {setAddress(e)}} type='text' value={address} /> }

                        <Button id='SubmitRegistrationx' type='submit'  className={styles.submit + ' ' + styles.button__marg + ' ' + styles.Button} classes={buttonClasses}><span>Sign Up</span></Button>
                        <div id='SignUp' className={styles.button} onClick={swicthMode}>
                            <div className={styles.m2}>Sign In</div>
                        </div>
                        { isLoading && <CircularProgress color='secondary' size={20}/> }
                    </form>}
            </div>}
            <span className={styles.switch}>
                <Switch
                    id='LoginSwitch'
                    checked={checked}
                    onChange={handleCheckedChange}
                    color='secondary'
                    name='Restaurant?'
                    inputProps={{ 'aria-label': 'secondary checkbox' }}
                />
                <p style={{color: '#fff'}}>Restaurant?</p>
            </span>
            <Snackbar open={openError} autoHideDuration={6000} onClose={() => setOpenError(false)}>
                <Alert severity={'error'}>
                  {vError ? vErrorMessage : error}
                </Alert> 
            </Snackbar>
            </div>
    )
}

export default Login