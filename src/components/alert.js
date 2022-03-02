/* This example requires Tailwind CSS v2.0+ */
import { InformationCircleIcon } from "@heroicons/react/solid";

export default function Alert({ alertMessage }) {
	return (
		<div className="absolute max-w-md transform -translate-x-1/2 -translate-y-1/2 alert-container top-10 left-1/2">
			<div className="p-4 border-l-4 border-blue-400 rounded-md bg-blue-50">
				<div className="flex">
					<div className="flex-shrink-0">
						<InformationCircleIcon
							className="w-5 h-5 text-blue-400"
							aria-hidden="true"
						/>
					</div>
					<div className="ml-3">
						<p className="text-sm text-blue-700">{alertMessage}</p>
					</div>
				</div>
			</div>
		</div>
	);
}
