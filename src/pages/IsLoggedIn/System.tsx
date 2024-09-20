import { useEffect, useState } from 'react'
import Header from '../../comps/Header'
import MetaDecorator from '../../comps/MetaHeader/MetaDecorator'
import IsLoggedIn from '../../firebase/IsLoggedIn'
import { useNavigate } from 'react-router-dom'
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import NewUserModal from '../../comps/NewUserModal'
import { supabase } from '../../supabase/supabaseClient'


interface dataType {
  userid: string | null;
  username: string | null
  password: string | null;
  email: string | null;
  id: number | null;
  fullname: string | null;
  interests: string[] | null
}


const System = () => {
    const [user] = IsLoggedIn()
    const [fetchedData, setFetchedData] = useState<dataType[] | null>(null);
    const [closeUserModal, setCloseUserModal] = useState<boolean>(false)


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
  }, [user, closeUserModal]);

    return (
        <div className='bg-[#ededed] h-[100dvh]'>
            <Header />
            <MetaDecorator title='TradeTeach | System' description='' />
            {fetchedData?.length === 0 &&  fetchedData && !fetchedData[0]?.interests 
             &&  !closeUserModal &&
                <div className='w-full h-full glassmorphism centerModal flex items-center justify-center px-5'>
                    <NewUserModal bools={closeUserModal} closer={setCloseUserModal} />
                </div>
            }
            <div className='pt-[80px] px-7'>
                hellosssssssssss
            </div>
        </div>
    )
}

export default System
