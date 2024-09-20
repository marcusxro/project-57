import React, { useEffect, useRef, useState } from 'react'
import IsLoggedIn from '../firebase/IsLoggedIn'
import { supabase } from '../supabase/supabaseClient'
import Loader from './Loader';
import Switch from "react-switch";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Interests from './Interests';
import gsap from 'gsap'



interface dataType {
    userid: string | null;
    username: string | null
    password: string | null;
    email: string | null;
    id: number | null;
    fullname: string | null;
    interests: string[] | null
}


interface propsType{
    bools: boolean;
    closer: React.Dispatch<React.SetStateAction<boolean>>;
}
const NewUserModal: React.FC<propsType> = ({bools, closer}) => {

    const interestArr = Interests

    const [user] = IsLoggedIn()
    const [fetchedData, setFetchedData] = useState<dataType[] | null>(null);
    const [userName, setUserName] = useState<string>("")
    const [fullName, setfullName] = useState<string>("")
    const providerData: string | undefined = user?.providerData[0]?.providerId
    const [loading, setLoading] = useState<boolean>(false)
    const [userExists, setUserExists] = useState<boolean | null>(null);

    async function getAccounts() {
        try {
            const { data, error } = await supabase
                .from('accounts')
                .select('*')
                .eq('userid', user?.uid);

            if (error) {
                console.error('Error fetching data:', error);
            } else {
                setFetchedData(data);
                console.log(data);
            }
        } catch (err) {
            console.log('Error:', err);
        }
    }


    useEffect(() => {
        if (user) {
            getAccounts();
        }
    }, [user, loading]);

    // Check if the user exists after data has been fetched
    useEffect(() => {
        if (fetchedData && user) {
            const exists = fetchedData.length > 0 && fetchedData[0]?.userid === user?.uid;
            setUserExists(exists);
            console.log('User exists:', exists);
        }
    }, [fetchedData, user]);


    const errorModal = (textStag: string) => {
        toast.error(`${textStag}`, {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
        });

    }

    const notif = ({ params }: any) => {
        toast.success(params, {
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


    const [checked, setChecked] = useState<boolean>(false);

    const handleSwitchChange = (checked: boolean): void => {
        setChecked(checked);
        console.log("Switch is now", checked ? "ON" : "OFF");
    };


    async function createUser() {
        //validation
        if (!user || !userName || !fullName) {
            return errorModal("Please complete the inputs");
        }

        setLoading(true);

        if (loading || userExists) {
            //prevent multiple clicks
            return
        }

        try {
            const { data: existingUser, error: selectError } = await supabase
                .from('accounts')
                .select('*')
                .eq('userid', user?.uid);

            if (selectError) {
                console.error('Error fetching user data:', selectError);
                setLoading(false);
                return errorModal('Error fetching user data');
            }
            if (existingUser && existingUser.length > 0) {
                console.log('User already exists in the database.');
                setLoading(false);
                return errorModal('User already exists');
            }
            const { error: insertError } = await supabase.from('accounts').insert({
                userid: user?.uid,
                username: userName,
                password: 'google.com',
                email: user?.email,
                fullname: fullName,
                isPrivate: checked
            });

            if (insertError) {
                console.error('Error inserting data:', insertError);
                return errorModal('Error occured');
            } else {
                console.log('User successfully inserted into the database.');
                notif('Account successfully edited!')
            }

        } catch (err) {
            console.log('Error:', err);
            return errorModal('Error occured, please try again later.');
        } finally {
            setLoading(false);
        }
    }

    const [interests, setInterests] = useState<string[]>([])

    function pushToInterest(params: string) {
        if (interests && interests.includes(params)) {
            setInterests((prevInterests) =>
                prevInterests.filter((interest) => interest !== params)
            );
        } else {
            setInterests((prevInterests) => [...prevInterests, params]);
        }

    }

    function returnIfFound(params: string) {
        if (interests.includes(params)) {
            return true
        }
    }

    useEffect(() => {
        console.log(interests)
    }, [interests])

    async function sendInterests() {
        setLoading(true)
        if (!interests && fetchedData && fetchedData[0]?.interests != null) {
            setLoading(false)
            return
        }
        if (interests.length <= 2) {
            setLoading(false)
            return errorModal("Please pick at least 3 interests.")
        }
        if (loading) {
            setLoading(false)
            return
        }
        try {
            const { error } = await supabase
                .from('accounts')
                .update({ interests: interests })
                .eq('userid', user?.uid)

            if (error) {
                errorModal("Error occured, please try again later.")
                setLoading(false)
            } else {
                notif("Interests saved successfully!")
                setLoading(false)
            }
        }
        catch {

        }


    }

    //handle different save functions
    function handleDifferentFunction() {
        if (user && !userExists) {
            createUser()
        }
        if (fetchedData && fetchedData[0]?.interests === null) {
            sendInterests()
            console.log('clkicked')
        }
    }


    const modalRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if(userExists && fetchedData && fetchedData[0]?.interests !== null) {
            gsap.to(modalRef.current, {
                height: 'auto',
                delay: .3,
                ease: 'bounce',
                minHeight: 'auto',
                duration: 0.5
            })
        }
    }, [user, fetchedData, loading, userExists])

    return (
        <div
         className='bg-[#fff] z-50 border-[1px] border-[#b9b8b8] overflow-hidden flex flex-col text-black centerModal  rounded-xl w-full max-w-[650px] max-h-[800px]'>
            <ToastContainer />

            {/* if the user doesnt exist in the DB, in instace of google provider */}
            {
                fetchedData && !userExists ?
                    <div className='p-5'>
                        <div className='boldFontSize text-2xl text-black'>
                            WELCOME  {fetchedData && fetchedData[0]?.username} 👋
                        </div>
                        <p className='text-[#a7a6a6]'>We’re excited to have you here. Let’s get started!</p>
                        <div className='border-t-[1px] border-[#b9b9b9] my-3'>

                        </div>

                        <div>
                            <div className='regularFontSize'>
                                Create your profile
                            </div>

                            <div className='w-full bg-[#b9b8b8] min-h-[100px] mt-5 rounded-md'>
                                {/* seperator */}
                            </div>


                            <div className='mt-3 relative px-3'>
                                <div className='flex items-start justify-between '>
                                    <div>
                                        <div className='absolute top-[-50px] w-[85px] h-[85px] bg-slate-500 rounded-full'>
                                        </div>
                                        <div className='mt-[40px] font-bold text-lg'>
                                            {providerData === 'google.com' ? userName : fetchedData && fetchedData[0]?.username}
                                        </div>
                                        <div className='font-bold text-sm text-[#696969]'>
                                            {providerData === 'google.com' ? user?.email : fetchedData && fetchedData[0]?.email}
                                        </div>
                                    </div>

                                    <div className='border-[1px] cursor-pointer border-[#b9b8b8] px-5 py-2 rounded-md text-black'>Set Profile</div>
                                </div>
                                <div className='flex items-center gap-3 border-y-[.5px] border-[#b9b9b9] mt-3 py-4'>
                                    <div className='w-full max-w-[50px]'>
                                        Name
                                    </div>
                                    <div className='flex justify-between items-center gap-3 w-full'>
                                        <input
                                            value={fullName}
                                            onChange={(e) => { setfullName(e.target.value) }}
                                            type="text" placeholder='Full name'
                                            maxLength={30}
                                            className='w-[100%] border-[1px] cursor-pointer border-[#b9b8b8] px-2 py-2 rounded-md' />
                                        <input
                                            value={userName}
                                            onChange={(e) => { setUserName(e.target.value) }}
                                            type="text"
                                            placeholder='Username'
                                            maxLength={30}
                                            className='w-[100%] border-[1px] cursor-pointer border-[#b9b8b8] px-2 py-2 rounded-md' />

                                    </div>
                                </div>
                                <div className='flex items-center  gap-3 border-b-[.5px] border-[#b9b9b9] mt-3 py-4'>
                                    <div className='w-full max-w-[50px]'>
                                        Email
                                    </div>
                                    <div className='flex justify-between items-center gap-3 w-full'>
                                        <div className='w-[100%] cursor-not-allowed border-[1px] text-[#b9b8b8]  border-[#b9b8b8] px-2 py-2 rounded-md'>
                                            {providerData === 'google.com' ? user?.email : fetchedData && fetchedData[0]?.email}
                                        </div>
                                    </div>
                                </div>
                                <div className='flex items-center  gap-3 border-b-[.5px] border-[#b9b9b9] mt-3 py-4'>
                                    <div className='w-full max-w-[55px]'>
                                        User ID
                                    </div>
                                    <div className='flex justify-between items-center gap-3 w-[100%]'>
                                        <div className='w-[100%]  text-[#b9b8b8]  border-[1px] cursor-not-allowed border-[#b9b8b8] px-2 py-2 rounded-md'>
                                            {providerData === 'google.com' ? user?.uid : fetchedData && fetchedData[0]?.userid}
                                        </div>
                                    </div>
                                </div>
                                <div className='flex gap-3 items-center mt-7'>
                                    Private
                                    <Switch onChange={handleSwitchChange} checked={checked} />
                                </div>
                            </div>
                        </div>
                    </div>
                    :
                    <>
                        <Loader color='#fff' />
                    </>
            }


            {/* if the user doesnt have any interest, this will pop up */}
            {
                fetchedData && fetchedData[0]?.interests === null &&
                <div className='px-6 overflow-auto w-full h-full'>
                    <div className='boldFontSize text-2xl text-[#4d4d4d]'>
                        PICK YOUR INTERESTS 🧐
                    </div>
                    <p className='text-[#a7a6a6]'>
                        Explore a variety of interests and start diving into what excites you. Select your favorite topics to get started!
                    </p>
                    <div className='border-t-[1px] border-[#b9b9b9] my-3'>
                        {/* seperator */}
                    </div>
                    <div className='overflow-y-scroll w-full h-full max-h-[550px] flex flex-wrap gap-3'>
                        {interestArr.map((itm: string) => (
                            <div
                                onClick={() => { pushToInterest(itm) }}
                                className={`px-5 py-1.5 border-[.5px] border-[#b9b9b9] 
                                rounded-lg cursor-pointer ${returnIfFound(itm) === true && 'bg-green-500'}`}
                                key={itm}>
                                {itm}
                            </div>
                        ))}
                    </div>
                </div>
            }


            {/* greetings after completing the series of setup */}
            {

                userExists && fetchedData && fetchedData[0]?.interests !== null &&
                <div className='px-5 mb-5'>
                    <div className='boldFontSize text-2xl text-[#4d4d4d]'>
                        You're all set! ✔️
                    </div>
                    <p className='text-[#a7a6a6]'>
                        You're ready to go. Explore a wide range of interests and pick the ones that excite you the most. Start connecting and trading skills now!
                    </p>
                    <div         ref={modalRef} className='h-[500px]'></div>
                </div>
            }

            {/* Controllers */}
            <div className='w-full h-[100px] flex gap-3 items-center justify-end border-t-[1px] border-[#b9b8b8] mt-auto p-5'>
                {
                    !userExists || fetchedData && fetchedData[0]?.interests === null ?
                        <>
                            {/* <div className='hover:bg-[#b9b9b9] px-5 py-1.5 border-[.5px] border-[#b9b9b9] 
                                rounded-lg cursor-pointer'>Skip</div> */}
                            <div
                                onClick={() => { handleDifferentFunction() }}
                                className='hover:bg-[#b9b9b9] bg-[#b9b9b9] px-5 py-1.5 border-[.5px]
                  border-[#b9b9b9] rounded-lg cursor-pointer'>
                                {loading ? <Loader color='#fff' /> : 'Save'}
                            </div>
                        </>
                        :
                        <div 
                        onClick={() => {
                            closer(true)
                        }}
                        className='hover:bg-[#b9b9b9]  px-5 py-1.5 border-[.5px]
                  border-[#b9b9b9] rounded-lg cursor-pointer'>
                            Close
                        </div>
                }






            </div>
        </div >
    )
}

export default NewUserModal
