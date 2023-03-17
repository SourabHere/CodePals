import React, { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import './chat/style.css'
import Message from './Message'

export const Chats = ({socketRef,roomId}) => {

    const [message,setmessage] = useState('');
    const [msgid, setmsgid] = useState(0);
    const [Allmessages, setAllmessages] = useState([]);

    // const chatMessage = document.querySelector('.chat-messages');
    
    // const scrollfunc = ()=>{
    //   chatMessage.scrollTop = chatMessage.scrollHeight;
    // }

    const chatMessagesRef = useRef(null);

    // const scrollfunc = () => {
    //   chatMessagesRef.current.scrollTop = chatMessagesRef.current.scrollHeight;
    // }
    const scrollfunc = () => {
      const chatMessages = chatMessagesRef.current;
      const scrollHeight = chatMessages.scrollHeight;
      const scrollTop = chatMessages.scrollTop;
      const clientHeight = chatMessages.clientHeight;
      const difference = scrollHeight - scrollTop - clientHeight;
    
      if (difference > 0) {
        const start = performance.now();
        const duration = 500;
    
        const step = (timestamp) => {
          const time = timestamp - start;
          const progress = Math.min(time / duration, 1);
          const distance = difference * progress;
          chatMessages.scrollBy(0, distance);
    
          if (progress < 1) {
            requestAnimationFrame(step);
          }
        };
    
        requestAnimationFrame(step);
      }
    };
    
    const handleInputChange = (event) => {
      event.preventDefault();
      setmessage(event.target.value);
    }

    const sndmsg = (e)=>{
      e.preventDefault();
      // console.log(message);
      // console.log("here ", roomId);
      if (message.trim() !== ''){
        socketRef.current.emit("chatMessage",{msg:message,roomId:roomId});
        setmessage('');
      }
      
      scrollfunc();
    }

    // useEffect(() => {
    //   if(socketRef.current){
    //     socketRef.current.on('message', messages => {
    //       // console.log(message);
    //       setAllmessages([...Allmessages,messages]);

    //       console.log(Allmessages);

    //       // OutputMessage(message);
    //     });

    //     return () => {
    //       socketRef.current.off('message') ;
    //     }
    //   }
    // }, [message]);


    useEffect(() => {
      if (socketRef.current) {
        socketRef.current.on('message', message => {
          setAllmessages(prevMessages => [...prevMessages, message]);
        });
        
        // console.log(Allmessages);
        return () => {
          socketRef.current.off('message');
        };
      }
    }, [socketRef.current]);

    
    
  return (
    <div>

        {/* <main className="chat-main">
            
            <div className="chat-messages">
            </div>
            {
                Allmessages.map((msg) => (
                <Message key={msg.id} username = {msg.username} time = {msg.time} mgs = {msg.text}/>
                
            ))}
        </main> */}

        <main className="chat-main">
          <div className="chat-messages" ref={chatMessagesRef}>
            {Allmessages.map((msg) => (
              <Message key={msg.id} username={msg.username} time={msg.time} text={msg.text}/>
            ))}
          </div>
        </main>

        <div className="chat-form-container">
            <form className="chat-form">
                <input className='msg' type="text" placeholder="Enter Message"
                required value={message} onChange={handleInputChange}/>
                <button className="btn snd" onClick={sndmsg}><i className="fas fa-paper-plane"></i> Send</button>
            </form>
        </div>

    </div>
  )
}

export default Chats