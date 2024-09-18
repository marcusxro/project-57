import React, { FormEvent, useEffect, useState } from 'react'
import { createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import { authKey } from '../../firebase/FirebaseKey';
import { useNavigate } from 'react-router-dom';
import Header from '../../comps/Header';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import MetaDecorator from '../../comps/MetaHeader/MetaDecorator';
import Loader from '../../comps/Loader';
import { supabase } from '../../supabase/supabaseClient';
import IsLoggedIn from '../../firebase/IsLoggedIn';


const Signup: React.FC = () => {
    const [user] = IsLoggedIn()
    const [fullname, setFullname] = useState<string>('');
    const [username, setUsername] = useState<string>('');
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [repeatPass, setRepeatPassword] = useState<string>("");
    const [isComplete, setIsComplete] = useState<boolean>(false)
    const [isAbleToClick, setIsAbleToClick] = useState<boolean>(true)
    const navigate = useNavigate()

    useEffect(() => {
        if (user) {
            navigate('/system')
        }
    }, [user])


    const clearInputs = () => {
        setEmail('');
        setFullname('');
        setUsername('');
        setPassword('');
        setRepeatPassword('');
    };

    async function createUser(paramsID: string) {
        try {
            const { error } = await supabase.from('accounts').insert({
                userid: paramsID,
                username: username,
                password: password,
                email: email,
                fullname: fullname,
            });


            if (error) {
                console.error('Error inserting data:', error);
            } else {
                setIsComplete(false)
            }
        } catch (err) {
            console.log(err);
        }
    }


    const errorModal = (textStag: string) => {
        toast.error(`${textStag}`, {
            position: "bottom-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
        });
    }

    const notif = () => {
        toast.success('Account successfully created, please verify your account.', {
            position: "bottom-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
        });

    }

    async function CreateAccount(e: FormEvent) {
        e.preventDefault()
        setIsAbleToClick(false)
        if (!isAbleToClick) {
            return
        }
        if (!password || !repeatPass || !email || !username || !fullname) {
            setIsAbleToClick(true)
            return errorModal("Please fill up all inputs.")
        }
        if (repeatPass != password) {
            setIsAbleToClick(true)
            return errorModal("Please make sure the passwords are matched!")
        }
        setIsComplete(true)
        try {
            const userCred = await createUserWithEmailAndPassword(authKey, email, password)
            if (userCred) {
                await sendEmailVerification(userCred.user);
                const user = authKey.currentUser;
                if (user && !user.emailVerified) {
                    console.log('Please verify your email');
                    notif()
                    clearInputs()
                    createUser(user?.uid)
                    setIsAbleToClick(true)
                } else {
                    navigate('/');
                }
            }
        } catch (err: any) {
            setIsComplete(false)
            setIsAbleToClick(true)
            if (err === 'Email already in use') {
                errorModal('Email already in use')
            }
            if (err.code === 'auth/email-already-in-use') {
                errorModal('Email already in use')
                clearInputs()
            } else {
                console.error('Error:', err);
                errorModal("There's some error, try again later")
            }
        }

    }


    return (
        <div className='w-full h-[100dvh] bg-[#EDE3E9]  flex items-center justify-center p-3'>
            <ToastContainer />
            <Header />
            <MetaDecorator title="TradeTeach | Sign Up" description='bla bla bla' />
            {
                !user &&
                    <>
                        <form
                            className='flex flex-col gap-3 w-full max-w-[400px]  p-3 rounded-lg book'
                            onSubmit={CreateAccount}>
                            <h1 className='text-center'>Create your TradeTeach account</h1>
                            <input
                                className='border-[1px] border-[#292929] h-[40px] rounded-lg outline-none px-3'
                                type="email"
                                placeholder="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            <input
                                className='border-[1px] border-[#292929] h-[40px] rounded-lg outline-none px-3'
                                type="text"
                                placeholder="Full Name"
                                value={fullname}
                                onChange={(e) => setFullname(e.target.value)}
                            />
                            <input
                                className='border-[1px] border-[#292929] h-[40px] rounded-lg outline-none px-3'
                                type="text"
                                placeholder="Username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                            <input
                                className='border-[1px] border-[#292929] h-[40px] rounded-lg outline-none px-3'
                                type="password"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <input
                                className='border-[1px] border-[#292929] h-[40px] rounded-lg outline-none px-3'
                                type="password"
                                placeholder="Repeat Password"
                                value={repeatPass}
                                onChange={(e) => setRepeatPassword(e.target.value)}
                            />
                            <button
                                className={`bg-[#292929] h-[40px] rounded-lg text-white hover:bg-[#494949] flex items-center justify-center gap-2 ${!isAbleToClick && 'bg-[#494949]'}`}
                                type="submit">{isComplete ? <Loader color='#fff' /> : 'Create Account'}</button>
                            <div className='flex items-center gap-3 justify-center'>
                                <div className='w-full h-[1px] bg-[#888]'></div>
                                <div>or</div>
                                <div className='w-full h-[1px] bg-[#888]'></div>
                            </div>
                            <div
                                onClick={() => { navigate('/sign-in') }}
                                className='w-full flex h-[40px] bg-[#292929] items-center justify-center gap-3 rounded-lg text-white cursor-pointer hover:bg-[#494949]'>
                                Sign in
                            </div>
                        </form>
                    </>
            }
        </div>
    )
}

export default Signup
