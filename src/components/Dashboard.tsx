import React from 'react';
import { Card, CardHeader, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <header className="relative h-16 border-b flex items-center px-4">
        <button
          onClick={() => navigate('/')}
          className="p-2 hover:bg-accent rounded-full transition-colors"
          aria-label="Back to home page"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>
        <h1 className="text-lg font-semibold ml-4">Dashboard</h1>
      </header>
      
      <div className="container mx-auto p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Medical History Card */}
          <Card>
            <CardHeader>
              <h2 className="text-xl font-semibold">Medical History</h2>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">View and update your medical history</p>
              <Button 
                variant="outline"
                onClick={() => navigate('/medical-history')}
              >
                View History
              </Button>
            </CardContent>
          </Card>

          {/* Personal Information Card */}
          <Card>
            <CardHeader>
              <h2 className="text-xl font-semibold">Personal Information</h2>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">Manage your personal details</p>
              <Button 
                variant="outline"
                onClick={() => navigate('/personal-info')}
              >
                Update Info
              </Button>
            </CardContent>
          </Card>

          {/* Health Resources Card */}
          <Card>
            <CardHeader>
              <h2 className="text-xl font-semibold">Health Resources</h2>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">Access health information and resources</p>
              <Button 
                variant="outline"
                onClick={() => navigate('/resources')}
              >
                Browse Resources
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 