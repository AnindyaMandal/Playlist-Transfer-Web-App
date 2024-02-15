import React from "react";

function SpAuthCode() {
	let code = window.localStorage.getItem("code");
	return <div>{code}</div>;
}

export default SpAuthCode;
