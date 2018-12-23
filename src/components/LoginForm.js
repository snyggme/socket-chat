import React, { Component} from 'react';

class LoginForm extends Component {
	constructor(props) {
		super(props);

		this.state = {
			nickname: '',
			error: null
		}

		this.handleSubmit = this.handleSubmit.bind(this);
		this.handleChange = this.handleChange.bind(this);
		this.setUser = this.setUser.bind(this);
		this.setError = this.setError.bind(this);
	}
	setUser({ user, isUser }) {
		if (isUser) {
			this.setError('Username taken');
		} else {
			this.props.setUser(user);
			this.setError('');
		}
	}
	handleChange(e) {
		this.setState({
			nickname: e.target.value
		})
	}
	handleSubmit(e) {
		e.preventDefault();

		const { socket } = this.props;
		const { nickname } = this.state;

		socket.emit('VERIFY_USER', nickname, this.setUser)
	}
	setError(error) {
		this.setState({ error })
	}
	render() {
		const { nickname, error } = this.state;
		return (
			<div className='login'>
				<form onSubmit={this.handleSubmit} className='login-form'>
					<label htmlFor='nickname'>
						<h2>Got a nickname?</h2>
					</label>
					<input
						ref={(input) => { this.textInput = input}}
						type='text'
						id='nickname'
						value={nickname}
						onChange={this.handleChange}
						placeholder='my cool username'
					/>
					<div className='error'>{error}</div>
				</form>
			</div>
		)
	}
}

export default LoginForm;