import React, { FormEvent, useEffect, useState } from 'react'
import { authKey } from '../../firebase/FirebaseKey'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { signInWithPopup } from 'firebase/auth';
import { googleProvider } from '../../firebase/FirebaseKey';
import { FaGoogle } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import Header from '../../comps/Header';
import MetaDecorator from '../../comps/MetaHeader/MetaDecorator';
import Loader from '../../comps/Loader';
import IsLoggedIn from '../../firebase/IsLoggedIn';

const LogIn: React.FC = () => {
  const [user] = IsLoggedIn()
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isLoggedIn, setIsloggedIn] = useState<boolean>(false)
  const nav = useNavigate()

  useEffect(() => {
    if (user) {
      nav("/system")
    }
  }, [user])

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
  const notif = (textStag: string) => {
    toast.success(`${textStag}`, {
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


  function LoginAccount(e: FormEvent) {
    e.preventDefault()
    if (password.length === 0 && email.length === 0) {
      return errorModal("please type somethng")
    }
    setIsloggedIn(true)
    signInWithEmailAndPassword(authKey, email, password)
      .then((res) => {
        const user = res.user
        const isVerified = res.user.emailVerified

        if (!isVerified) {
          setIsloggedIn(false)
          return errorModal('Please verify your account first')
        } else {
          notif('User Signed in!')
          setIsloggedIn(false)
          nav('/system')
          localStorage.setItem('userPassword', password)
        }

      }).catch((err) => {
        console.log(err)
        setIsloggedIn(false)
        if (err.code === 'auth/user-not-found') {
          errorModal('User not found!')
          setEmail('')
          setPassword('')
        }
        if (err.code === 'auth/wrong-password, please try again.') {
          errorModal('Wrong password')
          setEmail('')
          setPassword('')
        }
        if (err.code === 'auth/too-many-requests') {
          errorModal('Too many requests!')
          setEmail('')
          setPassword('')
        }
        if (err.code === 'auth/invalid-credential') {
          errorModal('Invalid details!')
          setEmail('')
          setPassword('')
        }
      })
  }


  const handleGoogleLogin = async () => {
    try {
      await signInWithPopup(authKey, googleProvider);
    } catch (error) {
      console.error('Error during sign-in:', error);
    }
  };



  return (
    <div className='w-full h-[100dvh] bg-[#EDE3E9]  flex items-center justify-center p-3'>
      <ToastContainer />
      <Header />
      <MetaDecorator title="TradeTeach | Sign in" description='bla bla bla' />
      {
        !user &&
        <>
          <form
            className='flex flex-col gap-3 w-full max-w-[400px] p-3 rounded-lg book'
            action="submit" onSubmit={LoginAccount}>
            <ToastContainer />
            <h1 className='text-center pb-3'>
              Sign in with your TradeTeach account.
            </h1>
            <input
              placeholder='Email'
              className='border-[1px] border-[#292929] h-[40px] rounded-lg outline-none px-3'
              value={email}
              onChange={(e) => { setEmail(e.target.value) }}
              type="email" />

            <input
              placeholder='Password'
              className='border-[1px] border-[#292929] h-[40px] rounded-lg outline-none px-3'
              value={password}
              onChange={(e) => { setPassword(e.target.value) }}
              type="password" />
            <div>
              Forgot Password? <span
                onClick={() => { nav('/forgot-password') }}
                className='cursor-pointer text-blue-400'>click here!</span>
            </div>

            <button
              className='hover:bg-[#494949]  bg-[#292929] h-[40px] rounded-lg text-white flex items-center justify-center gap-2'
              type='submit'>{isLoggedIn ? <Loader color='#fff' /> : 'Sign in'}</button>

            <div className='flex items-center gap-3 justify-center'>
              <div className='w-full h-[1px] bg-[#888]'></div>
              <div>or</div>
              <div className='w-full h-[1px] bg-[#888]'></div>
            </div>

            <div
              onClick={() => { handleGoogleLogin() }}
              className='hover:bg-[#494949]  w-full flex h-[40px] bg-[#292929] items-center justify-center gap-3 rounded-lg text-white cursor-pointer'>
              <div className=''>
                <FaGoogle />
              </div>
              <div>
                Sign in with Google
              </div>
            </div>
            <div
              onClick={() => { nav('/sign-up') }}
              className='hover:bg-[#494949]  w-full flex h-[40px] bg-[#292929] items-center justify-center gap-3 rounded-lg text-white cursor-pointer'>
              Create Acount
            </div>
          </form>
        </>
      }
    </div>
  )
}

export default LogIn
