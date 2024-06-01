import React , {useState} from 'react'

import {v4 as uuidv4} from "uuid";
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom';

const Home = () => {

  const navigate = useNavigate();

  const [roomId, setRoomId] = useState('');
  const [username, setUsername] = useState('');

  const createNewRoom = (e) =>{
    e.preventDefault();

    const id = uuidv4();
    // console.log(id);

    setRoomId(id);

    toast.success('Created a new room');
    
  };

  const joinRoom = () =>{
    if(!roomId || !username){
      toast.error("Please enter a valid ROOMID and USERNAME ");
    }
    else{
    navigate(`/editor/${roomId}`,{
      state: {
        username,
        
      }
    })

    }
  }

  const handleInputEnter = (e) =>{
    // console.log(e.code);

    if(e.code === "Enter"){
      joinRoom();
    }
  }
  return (
    <div className='homePageWrapper'>
       <div className='formWrapper'>

        <img className='homePageLogo' src="/CodePalsSloBLess.png" alt="code-sync" />
        {/* <img className='homePageLogo' src="/CodePals.png" alt="code-sync" /> */}
        

        <h4 className='mainLabel'>Enter Username and ROOMID</h4>

        <div className="inputGroup">


          <input type="text"  
          className='inputBox' 
          placeholder='USERNAME'
          onChange={(e) =>{
            setUsername(e.target.value);
          }} 
          value={username}
          onKeyUp={handleInputEnter}

          />

          <input type="text"  
          className='inputBox' 
          placeholder='ROOMID' 
          onChange={(e) =>{
            setRoomId(e.target.value);
          }} 
          value={roomId}
          onKeyUp={handleInputEnter}
          />


          <button className='btn joinBtn' onClick={joinRoom}>Connect</button>

          <span className='createInfo'>
            If you don't have an invite then you can create your &nbsp;
            <a onClick={createNewRoom} href="" className='CreateNewBtn'>new room </a>
          </span>

        </div>
       </div>

        <footer> Built with the help of lazy coders </footer>

      </div>
  )
}

export default Home