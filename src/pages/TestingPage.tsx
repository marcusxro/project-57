import React, { useEffect, useState } from 'react';
import { supabase } from '../supabase/supabaseClient';

interface dataType {
  userid: string;
  username: string;
  password: string;
  email: string;
  id: number;
  fullname: string;
}

const TestingPage = () => {
  const [fetchedData, setFetchedData] = useState<dataType[] | null>(null);

  useEffect(() => {
    getAccounts();
    const subscription = supabase
      .channel('public:accounts')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'accounts' }, (payload) => {
        console.log('Realtime event:', payload);
        handleRealtimeEvent(payload);
      })
      .subscribe();
    return () => {
      subscription.unsubscribe();
    };
  }, []);
  const handleRealtimeEvent = (payload: any) => {
    switch (payload.eventType) {
      case 'INSERT':
        setFetchedData((prevData) =>
          prevData ? [...prevData, payload.new] : [payload.new]
        );
        break;
      case 'UPDATE':
        setFetchedData((prevData) =>
          prevData
            ? prevData.map((item) =>
                item.id === payload.new.id ? payload.new : item
              )
            : [payload.new]
        );
        break;
      case 'DELETE':
        console.log("DELETED")
        setFetchedData((prevData) =>
          prevData ? prevData.filter((item) => item.id !== payload.old.id) : null
        );
        break;
      default:
        break;
    }
  };

  
  async function getAccounts() {
    try {
      const { data, error } = await supabase.from('accounts').select('*');

      if (error) {
        console.error('Error fetching data:', error);
      } else {
        setFetchedData(data);
      }
    } catch (err) {
      console.log(err);
    }
  }

  async function createUser() {
    try {
      const { error } = await supabase.from('accounts').insert({
        userid: 'AHAHAHsssdsdsadasdasdasdasdAHHH',
        username: 'Marcusxro',
        password: 'wertyuil',
        email: 'whawshahha@gnmail.com',
        fullname: 'Marcuspogi',
      });

      if (error) {
        console.error('Error inserting data:', error);
      } else {
        await getAccounts();
      }
    } catch (err) {
      console.log(err);
    }
  }


  

  const deleteUser = async (id: string) => {
    try {
      const { error } = await supabase.from('accounts').delete().match({ id });

      if (error) {
        console.error('Error deleting data:', error);
      } else {
        // Optionally fetch the updated data to ensure `fetchedData` is current
        await getAccounts();
        
      }
    } catch (err) {
      console.error('Error:', err);
    }
  };


  return (
    <div className='p-3'>
      {fetchedData?.map((itm: any, idx: number) => (
        <div key={idx}>
          <div>{itm.email}</div>
          <div>{itm.password}</div>
          <div>{itm.userid}</div>
          <button onClick={() => deleteUser(itm.id)} className='bg-red-500 text-white px-5 py-2 mt-2'>
            Delete
          </button>
        </div>
      ))}

      <div className='mt-5 flex'>
        <div
          onClick={() => createUser()}
          className='bg-black text-white px-5 py-2 cursor-pointer'>
          Insert New Data
        </div>
      </div>
    </div>
  );
};

export default TestingPage;
