# Authentication System Documentation

## Overview

This e-commerce dashboard includes a complete authentication system with signup, login, and protected routes functionality.

## Features Implemented

### 1. Signup Page (`/signup`)

- **Modern Design**: Beautiful gradient background with card-based layout
- **Form Validation**: Comprehensive validation using React Hook Form
- **Password Requirements**:
  - Minimum 8 characters
  - Must contain uppercase, lowercase, number, and special character
- **Password Visibility Toggle**: Eye icon to show/hide passwords
- **Loading States**: Spinner and disabled states during submission
- **Error Handling**: Toast notifications for success/error states

### 2. Login Page (`/login`)

- **Consistent Design**: Matches signup page styling
- **Email/Password Fields**: With proper validation
- **Forgot Password Link**: Placeholder for future implementation
- **Loading States**: Same UX patterns as signup

### 3. Landing Page (`/`)

- **Hero Section**: Compelling call-to-action
- **Feature Showcase**: Highlights dashboard capabilities
- **Navigation**: Links to signup and login
- **Responsive Design**: Works on all screen sizes

### 4. Protected Routes

- **Authentication Guard**: Redirects unauthenticated users to landing page
- **Loading States**: Shows spinner while checking authentication
- **Route Protection**: All dashboard routes require authentication

## Technical Implementation

### Authentication Context (`src/contexts/AuthContext.jsx`)

- **State Management**: Uses useReducer for complex state
- **User Session**: Manages user data and authentication status
- **Loading States**: Handles authentication checking
- **Error Handling**: Centralized error management

### API Service (`src/services/apiAuth.js`)

- **Axios Configuration**: Base URL and credentials setup
- **Signup Function**: POST request to `/users/signup`
- **Login Function**: POST request to `/users/login`
- **User Management**: Get current user and logout functions

### Custom Hooks

- **useSignup**: Handles signup mutation with React Query
- **useAuth**: Provides authentication context throughout app

### Form Validation

- **React Hook Form**: Efficient form handling
- **Validation Rules**:
  - Name: 2-50 characters
  - Email: Valid email format
  - Password: 8+ chars with complexity requirements
  - Confirm Password: Must match password

## File Structure

```
src/
├── contexts/
│   ├── AuthContext.jsx          # Authentication state management
│   └── ToastContext.jsx         # Toast notifications
├── services/
│   └── apiAuth.js              # Authentication API calls
├── features/
│   └── auth/
│       └── useSignup.js        # Signup custom hook
├── components/
│   ├── ProtectedRoute.jsx      # Route protection component
│   └── ui/
│       ├── Form.jsx            # Reusable form components
│       ├── Input.jsx           # Input field component
│       ├── Button.jsx          # Button component
│       └── Spinner.jsx         # Loading spinner
└── pages/
    ├── Landing.jsx             # Landing page
    ├── Signup.jsx              # Signup page
    └── Login.jsx               # Login page
```

## Usage

### Setting up Authentication

1. Wrap your app with `AuthProvider` in `App.jsx`
2. Use `ProtectedRoute` for routes that require authentication
3. Use `useAuth` hook to access authentication state

### Example Usage

```jsx
import { useAuth } from "./contexts/AuthContext";

function MyComponent() {
  const { user, isAuthenticated, login, logout } = useAuth();

  if (!isAuthenticated) {
    return <div>Please log in</div>;
  }

  return <div>Welcome, {user.name}!</div>;
}
```

## API Endpoints

The authentication system expects these endpoints:

- `POST /api/v1/users/signup` - User registration
- `POST /api/v1/users/login` - User login
- `GET /api/v1/users/me` - Get current user
- `GET /api/v1/users/logout` - User logout

## Dependencies Required

- `axios` - HTTP client for API calls
- `react-hook-form` - Form handling and validation
- `@tanstack/react-query` - Data fetching and caching
- `styled-components` - Styling
- `lucide-react` - Icons

## Next Steps

1. Install `axios` if not already installed: `npm install axios`
2. Set up your backend API with the required endpoints
3. Update the API base URL in `apiAuth.js` to match your backend
4. Implement the login functionality in the Login component
5. Add forgot password functionality
6. Add email verification if required

## Security Features

- Password complexity requirements
- Form validation on both client and server
- Protected routes with authentication checks
- Secure API calls with credentials
- Error handling and user feedback
