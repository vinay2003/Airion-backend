# Shared Authentication Module

Centralized authentication logic used across all frontend portals (vendor-dashboard, admin-panel, user-website).

## Structure

```
shared/auth/
├── index.ts              # Barrel exports
├── types.ts              # TypeScript interfaces and enums
├── constants.ts          # API endpoints, roles, error messages
├── utils.ts              # Token validation, role checking, validators
├── api.ts                # Centralized API calls with interceptors
├── hooks/
│   └── useAuth.ts        # Custom React hook for auth state
└── README.md             # This file
```

## Usage

### Import from any portal

```typescript
import { 
    UserRole, 
    AUTH_ENDPOINTS,
    userAuth,
    isValidEmail,
    useAuth 
} from '@shared/auth';
```

### Using the API

```typescript
// User login
const response = await userAuth.login({
    email: 'user@example.com',
    password: 'password123'
});

// Vendor OTP login
await vendorAuth.sendLoginOTP({ phone: '+919876543210' });
const auth = await vendorAuth.verifyLoginOTP({ 
    phone: '+919876543210', 
    otp: '123456' 
});

// Admin login with 2FA
const adminResponse = await adminAuth.login({
    email: 'admin@airion.com',
    password: 'securepass',
    twoFactorCode: '123456'
});
```

### Using the Hook

```typescript
function MyComponent() {
    const { user, loading, isAuthenticated, login, logout } = useAuth({
        requiredRole: UserRole.ADMIN,
        onUnauthorized: () => navigate('/login')
    });

    if (loading) return <Spinner />;
    if (!isAuthenticated) return <LoginForm />;

    return <div>Welcome, {user?.name}</div>;
}
```

### Using Utilities

```typescript
import { 
    isValidEmail, 
    isValidPhone, 
    validatePassword,
    isTokenExpired,
    hasRole 
} from '@shared/auth';

// Validate email
if (!isValidEmail(email)) {
    setError('Invalid email format');
}

// Check password strength
const { valid, message } = validatePassword(password);

// Check role
if (hasRole(user.role, UserRole.ADMIN)) {
    // Show admin features
}
```

## Key Features

- ✅ **Type Safety**: Full TypeScript support with shared interfaces
- ✅ **Token Management**: Automatic token refresh and expiry handling
- ✅ **Role-Based Access**: Easy role checking utilities
- ✅ **Validation**: Email, phone, password, OTP validators
- ✅ **Error Handling**: Centralized error messages and handling
- ✅ **Interceptors**: Automatic auth header injection and 401 handling
- ✅ **Multi-Portal**: Works across vendor, admin, and user portals

## Integration Guide

### 1. Install as shared module

Each portal should reference this as a shared dependency:

```json
// tsconfig.json
{
  "compilerOptions": {
    "paths": {
      "@shared/auth": ["../../shared/auth"]
    }
  }
}
```

### 2. Replace existing auth code

Gradually migrate existing AuthContext implementations to use shared utilities:

```typescript
// Before
const token = localStorage.getItem('token');

// After
import { getToken } from '@shared/auth';
const token = getToken();
```

### 3. Use shared API endpoints

```typescript
// Before
await api.post('/auth/login', credentials);

// After
import { userAuth } from '@shared/auth';
await userAuth.login(credentials);
```

## Benefits

1. **Consistency**: Same auth logic across all portals
2. **Maintainability**: Update once, apply everywhere
3. **Type Safety**: Shared types prevent mismatches
4. **DRY**: No code duplication
5. **Testing**: Test once, use everywhere

## Next Steps

- [ ] Add unit tests for utilities
- [ ] Add integration tests for API functions
- [ ] Implement token refresh logic
- [ ] Add social auth (Google, GitHub)
- [ ] Add password reset flow
- [ ] Add email verification
