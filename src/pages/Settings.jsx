import React, { useState } from 'react';
import styled from 'styled-components';
import { 
  User, 
  Bell, 
  Shield, 
  Palette, 
  Globe, 
  CreditCard,
  Database,
  Mail,
  Save,
  ToggleLeft,
  ToggleRight,
  Camera,
  X
} from 'lucide-react';
import Spinner from '../components/ui/Spinner';
import ToastDemo from '../components/ToastDemo';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { useUpdateUser } from '../features/auth/useUpdateUser';
import { useUpdatePassword } from '../features/auth/useUpdatePassword';
import FileInput from '../components/ui/FileInput';

const SettingsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  
  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
`;

const PageTitle = styled.h1`
  font-size: 28px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.textPrimary};
  margin: 0 0 8px 0;
`;

const PageSubtitle = styled.p`
  font-size: 16px;
  color: ${({ theme }) => theme.colors.textSecondary};
  margin: 0;
`;

const SettingsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 24px;
`;

const SettingsSidebar = styled.div`
  background: ${({ theme }) => theme.colors.backgroundCard};
  border-radius: 12px;
  padding: 24px;
  box-shadow: ${({ theme }) => theme.colors.shadow};
  border: 1px solid ${({ theme }) => theme.colors.border};
  height: fit-content;
`;

const SettingsNav = styled.nav`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const SettingsNavItem = styled.button`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  border: none;
  background: ${props => props.active ? props.theme.colors.backgroundSecondary : 'transparent'};
  color: ${props => props.active ? props.theme.colors.textPrimary : props.theme.colors.textSecondary};
  border-radius: 8px;
  font-weight: ${props => props.active ? '600' : '500'};
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: ${({ theme }) => theme.colors.backgroundSecondary};
    color: ${({ theme }) => theme.colors.textPrimary};
  }
`;

const SettingsContent = styled.div`
  background: ${({ theme }) => theme.colors.backgroundCard};
  border-radius: 12px;
  padding: 32px;
  box-shadow: ${({ theme }) => theme.colors.shadow};
  border: 1px solid ${({ theme }) => theme.colors.border};
`;

const SectionTitle = styled.h2`
  font-size: 24px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textPrimary};
  margin: 0 0 24px 0;
`;

const ProfileHeader = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 32px;
  padding-bottom: 24px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

const AvatarContainer = styled.div`
  position: relative;
  margin-bottom: 16px;
`;

const AvatarUploadButton = styled.button`
  position: absolute;
  bottom: 0;
  right: 0;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  border: 3px solid white;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
  
  &:hover {
    transform: scale(1.1);
    box-shadow: 0 6px 16px rgba(59, 130, 246, 0.4);
  }
`;

const AvatarRemoveButton = styled.button`
  position: absolute;
  top: 0;
  right: 0;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: #ef4444;
  border: 2px solid white;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 2px 8px rgba(239, 68, 68, 0.3);
  
  &:hover {
    transform: scale(1.1);
    background: #dc2626;
  }
`;

const Avatar = styled.div`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: ${props => props.hasImage ? 'transparent' : 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)'};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 48px;
  font-weight: 700;
  overflow: hidden;
  border: 4px solid ${({ theme }) => theme.colors.border};
  box-shadow: ${({ theme }) => theme.colors.shadowLg};
`;

const AvatarImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
`;

const AvatarPlaceholder = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
  color: white;
  font-size: 48px;
  font-weight: 700;
`;

const UserInfo = styled.div`
  text-align: center;
`;

const UserName = styled.h3`
  font-size: 24px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.textPrimary};
  margin: 0 0 8px 0;
`;

const UserRole = styled.p`
  font-size: 16px;
  color: ${({ theme }) => theme.colors.textSecondary};
  margin: 0 0 4px 0;
  text-transform: capitalize;
`;

const UserEmail = styled.p`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.textSecondary};
  margin: 0;
`;

const MemberSince = styled.p`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.textTertiary};
  margin: 8px 0 0 0;
`;

const FormGroup = styled.div`
  margin-bottom: 24px;
`;

const Label = styled.label`
  display: block;
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textPrimary};
  margin-bottom: 8px;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px 16px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 8px;
  font-size: 14px;
  background-color: ${({ theme }) => theme.colors.backgroundCard};
  color: ${({ theme }) => theme.colors.textPrimary};
  transition: all 0.2s ease;
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primary}20;
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 12px 16px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 8px;
  font-size: 14px;
  background-color: ${({ theme }) => theme.colors.backgroundCard};
  color: ${({ theme }) => theme.colors.textPrimary};
  cursor: pointer;
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const Textarea = styled.textarea`
  width: 100%;
  padding: 12px 16px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 8px;
  font-size: 14px;
  background-color: ${({ theme }) => theme.colors.backgroundCard};
  color: ${({ theme }) => theme.colors.textPrimary};
  resize: vertical;
  min-height: 100px;
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primary}20;
  }
`;

const ToggleContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 0;
  border-bottom: 1px solid ${({ theme }) => theme.colors.borderLight};
  
  &:last-child {
    border-bottom: none;
  }
`;

const ToggleLabel = styled.div`
  flex: 1;
`;

const ToggleTitle = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textPrimary};
  margin-bottom: 4px;
`;

const ToggleDescription = styled.div`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const ToggleButton = styled.button`
  background: ${props => props.active ? props.theme.colors.primary : props.theme.colors.border};
  border: none;
  border-radius: 20px;
  width: 48px;
  height: 24px;
  position: relative;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &::after {
    content: '';
    position: absolute;
    top: 2px;
    left: ${props => props.active ? '26px' : '2px'};
    width: 20px;
    height: 20px;
    background: white;
    border-radius: 50%;
    transition: all 0.2s ease;
  }
`;

const SaveButton = styled.button`
  background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
  }
`;

const FormActions = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 24px;
  padding-top: 24px;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
`;

const CancelButton = styled.button`
  background: ${({ theme }) => theme.colors.backgroundSecondary};
  color: ${({ theme }) => theme.colors.textPrimary};
  border: 1px solid ${({ theme }) => theme.colors.border};
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: ${({ theme }) => theme.colors.backgroundTertiary};
    border-color: ${({ theme }) => theme.colors.borderDark};
  }
`;

const UpdateButton = styled.button`
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

const settingsSections = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'security', label: 'Security', icon: Shield },
  { id: 'appearance', label: 'Appearance', icon: Palette },
  { id: 'billing', label: 'Billing', icon: CreditCard },
  { id: 'integrations', label: 'Integrations', icon: Database },
  { id: 'toast-demo', label: 'Toast Demo', icon: Bell },
];

// Helper function to get user initials
const getUserInitials = (name) => {
  if (!name) return 'U';
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
};

// Helper function to format date
const formatDate = (dateString) => {
  if (!dateString) return '';
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

// Helper function to get image URL
const getImageUrl = (imagePath, type = 'users') => {
  if (!imagePath) return null;
  if (imagePath.startsWith('http')) return imagePath;
  return `https://shopdirect-api.onrender.com/api/v4/images/${type}/${imagePath}`;
};

const Settings = () => {
  const [activeSection, setActiveSection] = useState('profile');
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    sms: true,
    marketing: false
  });
  
  // Profile update state
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [avatar, setAvatar] = useState(null);
  const [showAvatarUpload, setShowAvatarUpload] = useState(false);
  
  // Security update state
  const [passwordCurrent, setPasswordCurrent] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  
  const { user } = useAuth();
  const { themeMode, setTheme } = useTheme();
  const { updateUser, isUpdating } = useUpdateUser();
  const { changePassword, isLoading: isUpdatingPassword } = useUpdatePassword();
  
  // Initialize form values when user data loads
  React.useEffect(() => {
    if (user) {
      setEmail(user.email || '');
      setFullName(user.name || '');
    }
  }, [user]);
  
  console.log("User data:", user);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!fullName && !email && !avatar) return;

    updateUser(
      { email, fullName, avatar },
      {
        onSuccess: () => {
          setAvatar(null);
          setShowAvatarUpload(false);
        },
      }
    );
  };

  const handleCancel = () => {
    setEmail(user?.email || '');
    setFullName(user?.name || '');
    setAvatar(null);
    setShowAvatarUpload(false);
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatar(file);
    }
  };

  const handleRemoveAvatar = () => {
    setAvatar(null);
    setShowAvatarUpload(false);
  };

  // Password form handlers
  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (!passwordCurrent || !password || !passwordConfirm) return;
    if (password !== passwordConfirm) return;

    changePassword(
      { passwordCurrent, password, passwordConfirm },
      {
        onSuccess: () => {
          setPasswordCurrent('');
          setPassword('');
          setPasswordConfirm('');
          setShowPasswordForm(false);
        },
      }
    );
  };

  const handlePasswordCancel = () => {
    setPasswordCurrent('');
    setPassword('');
    setPasswordConfirm('');
    setShowPasswordForm(false);
  };

  const renderProfileSection = () => (
    <>
      <ProfileHeader>
        <AvatarContainer>
          <Avatar hasImage={!!user?.photo}>
            {user?.photo ? (
              <AvatarImage 
                src={getImageUrl(user.photo)} 
                alt={user?.name || 'User Avatar'}
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
            ) : null}
            <AvatarPlaceholder style={{ display: user?.photo ? 'none' : 'flex' }}>
              {getUserInitials(user?.name)}
            </AvatarPlaceholder>
          </Avatar>
          
          {/* Avatar upload button */}
          <AvatarUploadButton 
            onClick={() => setShowAvatarUpload(!showAvatarUpload)}
            type="button"
          >
            <Camera size={16} />
          </AvatarUploadButton>
          
          {/* Avatar remove button (only show if user has photo) */}
          {user?.photo && (
            <AvatarRemoveButton 
              onClick={() => {
                // Here you could add logic to remove the avatar
                console.log('Remove avatar clicked');
              }}
              type="button"
            >
              <X size={12} />
            </AvatarRemoveButton>
          )}
        </AvatarContainer>
        <UserInfo>
          <UserName>{user?.name || 'User Name'}</UserName>
          <UserRole>{user?.role || 'user'}</UserRole>
          <UserEmail>{user?.email || 'user@example.com'}</UserEmail>
          {user?.createdAt && (
            <MemberSince>Member since {formatDate(user.createdAt)}</MemberSince>
          )}
        </UserInfo>
      </ProfileHeader>
      
      <form onSubmit={handleSubmit}>
        <SectionTitle>Profile Settings</SectionTitle>
        
        <FormGroup>
          <Label>Full Name</Label>
          <Input 
            type="text" 
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            disabled={isUpdating}
          />
        </FormGroup>
        
        <FormGroup>
          <Label>Email Address</Label>
          <Input 
            type="email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isUpdating}
          />
        </FormGroup>
        
        <FormGroup>
          <Label>Avatar Image</Label>
          {showAvatarUpload && (
            <FileInput
              id="avatar"
              accept="image/*"
              onChange={handleAvatarChange}
              disabled={isUpdating}
              value={avatar}
              onRemove={handleRemoveAvatar}
            />
          )}
        </FormGroup>
        
        <FormGroup>
          <Label>Phone Number</Label>
          <Input type="tel" placeholder="Enter your phone number" disabled={isUpdating} />
        </FormGroup>
        
        <FormGroup>
          <Label>Company</Label>
          <Input type="text" placeholder="Enter your company name" disabled={isUpdating} />
        </FormGroup>
        
        <FormGroup>
          <Label>Bio</Label>
          <Textarea placeholder="Tell us about yourself..." disabled={isUpdating} />
        </FormGroup>
        
        <FormActions>
          <CancelButton type="button" onClick={handleCancel} disabled={isUpdating}>
            Cancel
          </CancelButton>
          <UpdateButton type="submit" disabled={isUpdating || (!fullName && !email && !avatar)}>
            {isUpdating ? (
              <>
                <Spinner size="16px" />
                Updating...
              </>
            ) : (
              <>
                <Save size={16} />
                Update Profile
              </>
            )}
          </UpdateButton>
        </FormActions>
      </form>
    </>
  );

  const renderNotificationsSection = () => (
    <>
      <SectionTitle>Notification Preferences</SectionTitle>
      <ToggleContainer>
        <ToggleLabel>
          <ToggleTitle>Email Notifications</ToggleTitle>
          <ToggleDescription>Receive order updates and reports via email</ToggleDescription>
        </ToggleLabel>
        <ToggleButton 
          active={notifications.email}
          onClick={() => setNotifications(prev => ({ ...prev, email: !prev.email }))}
        />
      </ToggleContainer>
      <ToggleContainer>
        <ToggleLabel>
          <ToggleTitle>Push Notifications</ToggleTitle>
          <ToggleDescription>Get real-time alerts in your browser</ToggleDescription>
        </ToggleLabel>
        <ToggleButton 
          active={notifications.push}
          onClick={() => setNotifications(prev => ({ ...prev, push: !prev.push }))}
        />
      </ToggleContainer>
      <ToggleContainer>
        <ToggleLabel>
          <ToggleTitle>SMS Notifications</ToggleTitle>
          <ToggleDescription>Receive critical alerts via SMS</ToggleDescription>
        </ToggleLabel>
        <ToggleButton 
          active={notifications.sms}
          onClick={() => setNotifications(prev => ({ ...prev, sms: !prev.sms }))}
        />
      </ToggleContainer>
      <ToggleContainer>
        <ToggleLabel>
          <ToggleTitle>Marketing Emails</ToggleTitle>
          <ToggleDescription>Receive promotional content and updates</ToggleDescription>
        </ToggleLabel>
        <ToggleButton 
          active={notifications.marketing}
          onClick={() => setNotifications(prev => ({ ...prev, marketing: !prev.marketing }))}
        />
      </ToggleContainer>
    </>
  );

  const renderSecuritySection = () => (
    <>
      <SectionTitle>Security Settings</SectionTitle>
      
      {/* Password Change Section */}
      <div style={{ marginBottom: '32px', paddingBottom: '24px', borderBottom: '1px solid #e2e8f0' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div>
            <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#1e293b', margin: '0 0 4px 0' }}>
              Change Password
            </h3>
            <p style={{ fontSize: '14px', color: '#64748b', margin: 0 }}>
              Update your password to keep your account secure
            </p>
          </div>
          <button
            onClick={() => setShowPasswordForm(!showPasswordForm)}
            style={{
              background: showPasswordForm ? '#ef4444' : '#3b82f6',
              color: 'white',
              border: 'none',
              padding: '8px 16px',
              borderRadius: '6px',
              fontSize: '14px',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            {showPasswordForm ? 'Cancel' : 'Change Password'}
          </button>
        </div>
        
        {showPasswordForm && (
          <form onSubmit={handlePasswordSubmit}>
            <FormGroup>
              <Label>Current Password</Label>
              <Input 
                type="password" 
                placeholder="Enter current password"
                value={passwordCurrent}
                onChange={(e) => setPasswordCurrent(e.target.value)}
                disabled={isUpdatingPassword}
                required
              />
            </FormGroup>
            
            <FormGroup>
              <Label>New Password</Label>
              <Input 
                type="password" 
                placeholder="Enter new password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isUpdatingPassword}
                required
                minLength={8}
              />
            </FormGroup>
            
            <FormGroup>
              <Label>Confirm New Password</Label>
              <Input 
                type="password" 
                placeholder="Confirm new password"
                value={passwordConfirm}
                onChange={(e) => setPasswordConfirm(e.target.value)}
                disabled={isUpdatingPassword}
                required
                minLength={8}
              />
            </FormGroup>
            
            {password && passwordConfirm && password !== passwordConfirm && (
              <div style={{ 
                color: '#ef4444', 
                fontSize: '14px', 
                marginTop: '8px',
                padding: '8px 12px',
                backgroundColor: '#fef2f2',
                borderRadius: '6px',
                border: '1px solid #fecaca'
              }}>
                Passwords do not match
              </div>
            )}
            
            <FormActions>
              <CancelButton type="button" onClick={handlePasswordCancel} disabled={isUpdatingPassword}>
                Cancel
              </CancelButton>
              <UpdateButton 
                type="submit" 
                disabled={isUpdatingPassword || !passwordCurrent || !password || !passwordConfirm || password !== passwordConfirm}
              >
                {isUpdatingPassword ? (
                  <>
                    <Spinner size="16px" />
                    Updating Password...
                  </>
                ) : (
                  <>
                    <Shield size={16} />
                    Update Password
                  </>
                )}
              </UpdateButton>
            </FormActions>
          </form>
        )}
      </div>
      
      {/* Security Features */}
      <ToggleContainer>
        <ToggleLabel>
          <ToggleTitle>Two-Factor Authentication</ToggleTitle>
          <ToggleDescription>Add an extra layer of security to your account</ToggleDescription>
        </ToggleLabel>
        <ToggleButton active={false} />
      </ToggleContainer>
      
      <ToggleContainer>
        <ToggleLabel>
          <ToggleTitle>Login Notifications</ToggleTitle>
          <ToggleDescription>Get notified of new login attempts</ToggleDescription>
        </ToggleLabel>
        <ToggleButton active={true} />
      </ToggleContainer>
      
      <ToggleContainer>
        <ToggleLabel>
          <ToggleTitle>Session Management</ToggleTitle>
          <ToggleDescription>View and manage active sessions</ToggleDescription>
        </ToggleLabel>
        <ToggleButton active={false} />
      </ToggleContainer>
    </>
  );

  const renderAppearanceSection = () => (
    <>
      <SectionTitle>Appearance Settings</SectionTitle>
      <FormGroup>
        <Label>Theme</Label>
        <Select 
          value={themeMode} 
          onChange={(e) => setTheme(e.target.value)}
        >
          <option value="light">Light</option>
          <option value="dark">Dark</option>
          <option value="auto">Auto (System)</option>
        </Select>
      </FormGroup>
      <FormGroup>
        <Label>Language</Label>
        <Select defaultValue="en">
          <option value="en">English</option>
          <option value="es">Spanish</option>
          <option value="fr">French</option>
          <option value="de">German</option>
        </Select>
      </FormGroup>
      <FormGroup>
        <Label>Time Zone</Label>
        <Select defaultValue="utc-5">
          <option value="utc-8">Pacific Time (UTC-8)</option>
          <option value="utc-7">Mountain Time (UTC-7)</option>
          <option value="utc-6">Central Time (UTC-6)</option>
          <option value="utc-5">Eastern Time (UTC-5)</option>
          <option value="utc+0">UTC</option>
          <option value="utc+1">Central European Time (UTC+1)</option>
        </Select>
      </FormGroup>
      <ToggleContainer>
        <ToggleLabel>
          <ToggleTitle>Compact Mode</ToggleTitle>
          <ToggleDescription>Reduce spacing for a more compact layout</ToggleDescription>
        </ToggleLabel>
        <ToggleButton active={false} />
      </ToggleContainer>
    </>
  );

  const renderBillingSection = () => (
    <>
      <SectionTitle>Billing Information</SectionTitle>
      <FormGroup>
        <Label>Plan</Label>
        <Select defaultValue="pro">
          <option value="basic">Basic - $29/month</option>
          <option value="pro">Pro - $79/month</option>
          <option value="enterprise">Enterprise - $199/month</option>
        </Select>
      </FormGroup>
      <FormGroup>
        <Label>Card Number</Label>
        <Input type="text" defaultValue="**** **** **** 1234" />
      </FormGroup>
      <FormGroup>
        <Label>Expiry Date</Label>
        <Input type="text" defaultValue="12/25" />
      </FormGroup>
      <FormGroup>
        <Label>Billing Address</Label>
        <Textarea defaultValue="123 Business St, Suite 100, New York, NY 10001" />
      </FormGroup>
    </>
  );

  const renderIntegrationsSection = () => (
    <>
      <SectionTitle>Integrations</SectionTitle>
      <ToggleContainer>
        <ToggleLabel>
          <ToggleTitle>Google Analytics</ToggleTitle>
          <ToggleDescription>Track website traffic and user behavior</ToggleDescription>
        </ToggleLabel>
        <ToggleButton active={true} />
      </ToggleContainer>
      <ToggleContainer>
        <ToggleLabel>
          <ToggleTitle>Mailchimp</ToggleTitle>
          <ToggleDescription>Send email campaigns and newsletters</ToggleDescription>
        </ToggleLabel>
        <ToggleButton active={true} />
      </ToggleContainer>
      <ToggleContainer>
        <ToggleLabel>
          <ToggleTitle>Stripe</ToggleTitle>
          <ToggleDescription>Process payments and manage subscriptions</ToggleDescription>
        </ToggleLabel>
        <ToggleButton active={true} />
      </ToggleContainer>
      <ToggleContainer>
        <ToggleLabel>
          <ToggleTitle>Slack</ToggleTitle>
          <ToggleDescription>Receive notifications in Slack channels</ToggleDescription>
        </ToggleLabel>
        <ToggleButton active={false} />
      </ToggleContainer>
    </>
  );

  const renderSection = () => {
    switch (activeSection) {
      case 'profile':
        return renderProfileSection();
      case 'notifications':
        return renderNotificationsSection();
      case 'security':
        return renderSecuritySection();
      case 'appearance':
        return renderAppearanceSection();
      case 'billing':
        return renderBillingSection();
      case 'integrations':
        return renderIntegrationsSection();
      case 'toast-demo':
        return <ToastDemo />;
      default:
        return renderProfileSection();
    }
  };

  return (
    <SettingsContainer>
      <div>
        <PageTitle>Settings</PageTitle>
        <PageSubtitle>Manage your account preferences and configurations</PageSubtitle>
      </div>

      <SettingsGrid>
        <SettingsSidebar>
          <SettingsNav>
            {settingsSections.map((section) => (
              <SettingsNavItem
                key={section.id}
                active={activeSection === section.id}
                onClick={() => setActiveSection(section.id)}
              >
                <section.icon size={20} />
                {section.label}
              </SettingsNavItem>
            ))}
          </SettingsNav>
        </SettingsSidebar>

        <SettingsContent>
          {renderSection()}
          <SaveButton>
            <Save size={18} />
            Save Changes
          </SaveButton>
        </SettingsContent>
      </SettingsGrid>
    </SettingsContainer>
  );
};

export default Settings; 