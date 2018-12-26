import React, { Component } from 'react';

class Messages extends Component {
	constructor(props) {
		super(props);

		this.allMessages = React.createRef();

		this.scrollDown = this.scrollDown.bind(this);
	}
	componentDidUpdate(prevProps, prevState) {
		this.scrollDown();
	}
	scrollDown() {
		const div = this.allMessages.current

		div.scrollTop = div.scrollHeight;
	}
	render() {
		const { messages, user, typingUsers } = this.props;

		return (
			<div
				ref={this.allMessages}
				className='thread-container'>
					{
						messages.map((mes, i) => {
							return (
								<div
									key={i}
									className={`message-container ${mes.sender === user.name && 'right'}`}
								>
									<div className={`data ${mes.sender === user.name && 'right-corner'}`}>
										<div className='name'>{mes.sender}</div>
										<div className='message'>{mes.message}</div>
										<div className='time'>{mes.time}</div>
									</div>
								</div>
							)
						})
					}
					{
						typingUsers.map((name) => {
							return <div key={name} className='typing-users'>
								{`${name} is typing...`}
							</div>
						})
					}
			</div>
		)
	}
}

export default Messages;