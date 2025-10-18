import { useNavigate } from 'react-router-dom';

const NotFoundPage: React.FC = () => {
	const navigate = useNavigate();
	return (
		<div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
			<div className="bg-white max-w-md w-full shadow-sm border border-gray-200 rounded-xl p-8 text-center">
				<div className="text-6xl font-bold text-gray-800 mb-2">404</div>
				<h1 className="text-xl font-semibold text-gray-900 mb-2">Page not found</h1>
				<p className="text-gray-600 mb-6">The page you are looking for might have been removed or is temporarily unavailable.</p>
				<div className="flex gap-3 justify-center">
					<button onClick={() => navigate(-1)} className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100">Go Back</button>
					<button onClick={() => navigate('/')} className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700">Go Home</button>
				</div>
			</div>
		</div>
	);
};

export default NotFoundPage;

