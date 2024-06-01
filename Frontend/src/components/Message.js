import React from 'react'
import "./chat/style.css"

const Message = ({id,username,time,text}) => {
  return (
    <div className='message'>
      {/* <div>
        {text}
      </div>
      <div>
        {username}
      </div>
      <div>
        {time}
      </div> */}

      <p className="meta">{username} <span>{time}</span></p>
      <p className="text">{text}</p>

      </div>
  )
}


export default Message
