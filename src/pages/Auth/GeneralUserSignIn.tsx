import { useNavigate } from 'react-router-dom';
import Button from '../../components/ui/Button';

function GeneralUserSignIn() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        <div className="text-center">
          <img 
            src="/assets/images/Sona-logo.png" 
            alt="Sona Logo" 
            className="h-12 w-auto mx-auto mb-6"
          />
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            General User Portal
          </h1>
          <p className="text-gray-600 mb-8">
            Welcome to the General User section. This page is currently under development.
          </p>
          
          <div className="space-y-4">
            <Button 
              variant="primary"
              className="w-full"
              onClick={() => {
                // Placeholder for future functionality
                alert('General User functionality coming soon!');
              }}
            >
              Continue as General User
            </Button>
            
            <Button 
              variant="border"
              className="w-full"
              onClick={() => navigate('/')}
            >
              Back to Home
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default GeneralUserSignIn;
