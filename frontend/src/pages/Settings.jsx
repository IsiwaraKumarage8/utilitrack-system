import { useNavigate } from 'react-router-dom';
import { Settings as SettingsIcon, Wrench, Database, Bell, Lock, Users, Palette } from 'lucide-react';
import Button from '../components/common/Button';
import './Settings.css';

/**
 * Settings Page
 */
const Settings = () => {
  const navigate = useNavigate();

  const settingsCategories = [
    {
      icon: Database,
      title: 'API Tests',
      description: 'Test all system APIs and verify connectivity',
      action: () => navigate('/api-tests'),
      buttonText: 'Open API Tests',
      variant: 'primary'
    },
    {
      icon: Users,
      title: 'User Management',
      description: 'Manage user accounts, roles, and permissions',
      action: null,
      buttonText: 'Coming Soon',
      variant: 'secondary'
    },
    {
      icon: Bell,
      title: 'Notifications',
      description: 'Configure email and SMS notification settings',
      action: null,
      buttonText: 'Coming Soon',
      variant: 'secondary'
    },
    {
      icon: Lock,
      title: 'Security',
      description: 'Password policies and authentication settings',
      action: null,
      buttonText: 'Coming Soon',
      variant: 'secondary'
    },
    {
      icon: Wrench,
      title: 'System Configuration',
      description: 'General system settings and preferences',
      action: null,
      buttonText: 'Coming Soon',
      variant: 'secondary'
    },
    {
      icon: Palette,
      title: 'Appearance',
      description: 'Theme and display customization options',
      action: null,
      buttonText: 'Coming Soon',
      variant: 'secondary'
    }
  ];

  return (
    <div className="settings-page">
      {/* Page Header */}
      <div className="settings-header">
        <SettingsIcon size={32} className="settings-header-icon" />
        <div>
          <h1 className="settings-title">System Settings</h1>
          <p className="settings-subtitle">Configure and manage system preferences</p>
        </div>
      </div>

      {/* Settings Categories */}
      <div className="settings-grid">
        {settingsCategories.map((category, index) => (
          <div key={index} className="settings-card">
            <div className="settings-card-icon">
              <category.icon size={28} />
            </div>
            <div className="settings-card-content">
              <h3 className="settings-card-title">{category.title}</h3>
              <p className="settings-card-description">{category.description}</p>
            </div>
            <Button
              variant={category.variant}
              size="md"
              onClick={category.action}
              disabled={!category.action}
            >
              {category.buttonText}
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Settings;
