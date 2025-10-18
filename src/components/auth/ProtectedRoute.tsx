import { Navigate, useLocation } from 'react-router-dom';

// Very simple auth/role check using localStorage JWT
const decodeToken = (token: string) => {
	try {
		const base64Url = token.split('.')[1];
		const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
		const jsonPayload = decodeURIComponent(
			atob(base64)
				.split('')
				.map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
				.join('')
		);
		return JSON.parse(jsonPayload);
	} catch {
		return null;
	}
};

interface ProtectedRouteProps {
	children: React.ReactElement;
	requireCounsellor?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requireCounsellor = true }) => {
	const location = useLocation();
	const token = localStorage.getItem('auth_token');

	// Not logged in at all -> go to login
	if (!token) {
		return <Navigate to="/signin" replace state={{ from: location }} />;
	}

	// If we need to ensure the user is a counsellor, check a couple of common payload fields.
	if (requireCounsellor) {
		const payload = decodeToken(token);
		const role = payload?.role || payload?.userRole || payload?.type;
		const isCounsellorFlag = payload?.is_counsellor || payload?.isCounsellor;

		const isCounsellor =
			role?.toString().toLowerCase() === 'counsellor' ||
			role?.toString().toLowerCase() === 'counselor' ||
			Boolean(isCounsellorFlag);

		// If no role is present, allow as long as authenticated (simple fallback)
		// Otherwise enforce counsellor role
		if (role && !isCounsellor) {
			return <Navigate to="/forbidden" replace />;
		}
	}

	return children;
};

export default ProtectedRoute;

