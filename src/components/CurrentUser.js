import React from 'react';
import { FaEject } from 'react-icons/fa';

const CurrentUser = ({ username, logout }) => {
	return (
		<div className="current-user">
			<span>{username}</span>
			<div onClick={()=>{logout()}} className="logout">
				<FaEject />	
			</div>
		</div>
	)
}

export default CurrentUser;