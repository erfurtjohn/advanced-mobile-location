import { useState } from "react";

const SearchField = ({ onClick }) => {
	const [phone, setPhone] = useState();

	return (
		<>
			<div className="absolute shadow-md search-container top-3 right-3">
				<div className="flex items-center max-w-md mx-auto bg-white rounded-md">
					<div className="w-full">
						<input
							type="text"
							className="w-full px-4 py-1 text-gray-800 rounded-full focus:outline-none"
							placeholder="+4912345678"
							onChange={(e) => setPhone(e.target.value)}
						/>
					</div>
					<div>
						<button
							type="submit"
							onClick={() => onClick(phone)}
							className="flex items-center justify-center w-12 h-10 text-white bg-blue-500 rounded-r-lg"
						>
							<svg
								className="w-5 h-5"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
								xmlns="http://www.w3.org/2000/svg"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth="2"
									d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
								></path>
							</svg>
						</button>
					</div>
				</div>
			</div>
		</>
	);
};

export default SearchField;
