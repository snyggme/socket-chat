import React from 'react';
import { FaVideo } from 'react-icons/fa';
import { FaUserPlus } from 'react-icons/fa';
import { FaEllipsisH } from 'react-icons/fa';

const ChatHeading = ({ name, users }) => {
	return (
		<div className='chat-header'>
			<div className='user-info'>
				<div className='chatroom-name'>{name}</div>
				<div className='chatroom-users'>
					<span>{users.length ? users.length: null} </span>
					{
						users.map(({ name }) => <span key={name}>{name} </span>)
					}
				</div>
			</div>
			<div className='options'>
				<FaVideo />
				<FaUserPlus />
				<FaEllipsisH />
			</div>
		</div>
	)
}

export default ChatHeading;