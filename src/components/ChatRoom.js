import React from 'react';
import CopyLink from './CopyLink';

const ChatRoom = ({ classNames, lastMessage, setActiveChat, chat }) => {
	const { id, name } = chat;
	let message;

	if(lastMessage) {
			if (lastMessage.message.length > 10) {
			message = lastMessage.message.slice(0, 10) + '...'
		} else {
			message = lastMessage.message
		}
	}
	
	return (
		<div
			className={`room ${classNames}`}
		>
			<div 
				className="room-info" 
				onClick={ ()=>{ setActiveChat(chat) } }
			>
				<div className="room-name">{name}</div>
				{ lastMessage && 
					<div className="room-last-message">
						{message}
					</div>
				}
			</div>
			<CopyLink id={id} />
		</div>
	)
}

export default ChatRoom;