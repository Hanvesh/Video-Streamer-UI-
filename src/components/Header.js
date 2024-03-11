// Welcome.js

import Navbar from "./Navbar";

export default function Header() {
	return (
		<div className="h-20 bg-blue-300 px-24">
			{/* <Navbar /> */}
			<h1
				className="pt-2 text-center text-slate-800 
						font-semibold text-3xl">
				mPokket's Video Streaming Service
			</h1>
		</div>
	);
}
