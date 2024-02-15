"use client";
import { redirect } from "next/navigation";
import React, { useState } from "react";
// import { headers } from "next/headers";

function Lmao() {
	const [code, setCode] = useState("");
	if (typeof window !== "undefined") {
		console.log(window.location.href);
		const url = new URL(window.location.href).searchParams;
		const newCode = url.get("code");
		if (newCode != null && newCode.length > 0 && code.length == 0) {
			console.log("NEW CODE: " + newCode);
			setCode(newCode);
		}
	}

	if (code.length == 227) {
		window.localStorage.setItem("code", code);
		redirect("/spAuthCode");
	}

	// const headersList = headers();
	// const domain = headersList.get("host") || "";
	// const fullUrl = headersList.get("referer") || "";

	// console.log("fullUrl: " + fullUrl);

	return <div>{code}</div>;
}

export default Lmao;
