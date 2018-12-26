import React from 'react';

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
		</div>
	)
}

export default ChatHeading;