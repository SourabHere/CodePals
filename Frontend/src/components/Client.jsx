import React from 'react'
import Avatar from 'react-avatar'

const Client = ({username}) => {

  let formattedUsername = username.length > 5 ? username.substring(0,5) + '..' : username;

  return (
    <div className='client'> 
        <Avatar name={username} size = {50} round = "15px" />
        <span className='userName'> {formattedUsername}</span>
    </div>
  )
}

export default Client