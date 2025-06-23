import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Dropdown, Card, Checkbox, CardContent, Container, Modal, Table, Input } from '../components/ui';
import { NavBar, Sidebar } from '../components/layout';

const ExampleUse = () => {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState<string>('');

  const roleOptions = [
    { label: 'Counselor', value: 'counselor' },
    { label: 'Student', value: 'student' },
    { label: 'Administrator', value: 'admin' },
  ];

  const handleSignIn = () => {
    if (selectedRole) {
      navigate('/signin');
    }
  };

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <div className="flex flex-col h-screen">
      {/* Top Navbar */}
      <NavBar onMenuClick={toggleSidebar} />

      {/* Bottom section: Sidebar + Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div className="w-64 bg-white border-r">
          <Sidebar isOpen={sidebarOpen} onClose={closeSidebar}/>
        </div>

        {/* Main Content */}
        <div className="flex-grow overflow-auto p-6">
          <Container>
            <h1 className="text-2xl font-bold mb-6">Counseling Portal</h1>

            <Dropdown
              options={roleOptions}
              selected={selectedRole}
              onSelect={setSelectedRole}
              placeholder="Select your role"
              label="User Role"
            />

            <div className="mt-6">
              <Button
                variant="rounded"
                onClick={handleSignIn}
                disabled={!selectedRole}
                className="w-full"
              >
                Sign In
              </Button>
            </div>

            <Card title="Basic Card" className="mb-6">
              <CardContent>
                <p>This is a simple card with a title and content.</p>
              </CardContent>
            </Card>

            <Checkbox label="Remember me" />

            <Table
              columns={[
                { header: 'Name', accessor: 'name' },
                { header: 'Role', accessor: 'role' },
                { header: 'Status', accessor: 'status' },
              ]}
              data={[
                { name: 'John Doe', role: 'Counselor', status: 'Active' },
                { name: 'Jane Smith', role: 'Student', status: 'Inactive' },
                { name: 'Alice Johnson', role: 'Administrator', status: 'Active' },
              ]}
            />

            <Modal isOpen={false} onClose={() => {}} title="Example Modal">
              <p>This is an example modal. You can put any content here.</p>
            </Modal>

            <Input
              type="text"
              placeholder="Enter your name"
              label="Name"
              className="mt-6"
            />

            <Input
              type="email"
              placeholder="Enter your email"
              label="Email"
              className="mt-4"
            />

            <Button
              variant="secondary"
              onClick={() => alert('Button clicked!')}
              className="mt-6"
            >
              Click Me
            </Button>
          </Container>
        </div>
      </div>
    </div>
  );
};

export default ExampleUse;