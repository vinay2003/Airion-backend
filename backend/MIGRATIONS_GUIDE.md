# Database Migration Guide

## Security Enhancement Migrations

### Overview
Three new migrations have been created to support enhanced security features:

1. **AddSecurityFieldsToUsers** - Adds MFA, account locking, and OAuth fields
2. **CreateSessionsTable** - Session management and device tracking
3. **CreateAuditLogTable** - Comprehensive audit logging

---

## Migration Files

### 1. AddSecurityFieldsToUsers (1706708258000)

**File:** `1706708258000-AddSecurityFieldsToUsers.ts`

**New Columns:**
| Column | Type | Purpose |
|--------|------|---------|
| `last_login_at` | timestamp | Track last successful login |
| `login_attempts` | int | Failed login counter (reset on success) |
| `locked_until` | timestamp | Account lock expiration |
| `mfa_enabled` | boolean | MFA/2FA enabled flag |
| `mfa_secret` | varchar(255) | Encrypted TOTP secret |
| `social_id` | varchar(255) | OAuth provider user ID |
| `social_provider` | varchar(50) | OAuth provider name |

**Indexes:**
- `idx_users_social_id` - Fast OAuth lookups
- `idx_users_locked_until` - Efficient locked account queries

---

### 2. CreateSessionsTable (1706708259000)

**File:** `1706708259000-CreateSessionsTable.ts`

**Columns:**
| Column | Type | Purpose |
|--------|------|---------|
| `id` | uuid | Primary key |
| `user_id` | uuid | Foreign key to users |
| `token_hash` | varchar(255) | Hashed refresh token |
| `ip_address` | varchar(45) | Client IP (IPv4/IPv6) |
| `user_agent` | text | Browser/device info |
| `device_name` | varchar(255) | Parsed device name |
| `created_at` | timestamp | Session creation time |
| `expires_at` | timestamp | Session expiration |
| `last_used_at` | timestamp | Last activity time |
| `revoked_at` | timestamp | Manual revocation time |

**Indexes:**
- `idx_sessions_user_id` - User's sessions
- `idx_sessions_token_hash` - Token validation
- `idx_sessions_expires_at` - Cleanup expired sessions
- `idx_sessions_last_used_at` - Inactive session detection

**Foreign Keys:**
- `fk_sessions_user` - CASCADE delete on user deletion

---

### 3. CreateAuditLogTable (1706708260000)

**File:** `1706708260000-CreateAuditLogTable.ts`

**Columns:**
| Column | Type | Purpose |
|--------|------|---------|
| `id` | uuid | Primary key |
| `user_id` | uuid | User who acted (nullable) |
| `action` | varchar(100) | Action type |
| `resource_type` | varchar(50) | Affected resource type |
| `resource_id` | varchar(255) | Affected resource ID |
| `ip_address` | varchar(45) | Client IP |
| `user_agent` | text | Browser/device info |
| `success` | boolean | Success flag |
| `failure_reason` | varchar(255) | Failure description |
| `metadata` | jsonb | Additional context |
| `created_at` | timestamp | Event timestamp |

**Indexes:**
- `idx_audit_logs_user_id` - User's activities
- `idx_audit_logs_action` - Action type queries
- `idx_audit_logs_created_at` - Time-based queries
- `idx_audit_logs_success` - Failed attempts
- `idx_audit_logs_ip_address` - IP-based tracking
- `idx_audit_logs_user_created` - Composite for user history

**Foreign Keys:**
- `fk_audit_logs_user` - SET NULL on user deletion (preserve log)

---

## Running Migrations

### Development
```bash
# Generate migration (if needed)
npm run migration:generate -- -n MigrationName

# Run all pending migrations
npm run migration:run

# Revert last migration
npm run migration:revert
```

### Production
```bash
# Check pending migrations
npm run migration:show

# Run migrations
NODE_ENV=production npm run migration:run
```

---

## Usage Examples

### 1. Track Login Attempts
```typescript
// Increment failed attempts
await userRepo.increment({ id: userId }, 'login_attempts', 1);

// Lock account after 5 attempts
if (user.login_attempts >= 5) {
  user.locked_until = new Date(Date.now() + 15 * 60 * 1000); // 15 min
  await userRepo.save(user);
}

// Reset on successful login
user.login_attempts = 0;
user.last_login_at = new Date();
await userRepo.save(user);
```

### 2. Create Session
```typescript
const session = await sessionRepo.save({
  user_id: user.id,
  token_hash: await hashToken(refreshToken),
  ip_address: req.ip,
  user_agent: req.headers['user-agent'],
  device_name: parseUserAgent(req.headers['user-agent']),
  expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
});
```

### 3. Log Audit Event
```typescript
await auditLogRepo.save({
  user_id: user?.id,
  action: 'LOGIN_ATTEMPT',
  ip_address: req.ip,
  user_agent: req.headers['user-agent'],
  success: true,
  metadata: {
    email: user.email,
    mfa_used: user.mfa_enabled
  }
});
```

---

## Security Considerations

1. **MFA Secret Encryption**
   - Always encrypt `mfa_secret` before storing
   - Use `crypto.createCipheriv()` with AES-256-GCM
   - Store encryption key in environment variable

2. **Token Hashing**
   - Hash refresh tokens before storing in sessions
   - Use bcrypt or argon2 for hashing
   - Never store plain tokens

3. **PII in Audit Logs**
   - Avoid logging passwords or sensitive data
   - Use `metadata` field for context
   - Implement log retention policy

4. **Index Performance**
   - Monitor query performance with indexes
   - Use partial indexes (WHERE clause) when appropriate
   - Consider partitioning audit logs by date

---

## Cleanup Scripts

### Remove Expired Sessions (Cron Job)
```typescript
@Cron('0 * * * *') // Every hour
async cleanupExpiredSessions() {
  await sessionRepo.delete({
    expires_at: LessThan(new Date())
  });
}
```

### Remove Old Audit Logs (Cron Job)
```typescript
@Cron('0 0 * * 0') // Weekly
async cleanupOldAuditLogs() {
  const threshold = new Date();
  threshold.setMonth(threshold.getMonth() - 6); // 6 months
  
  await auditLogRepo.delete({
    created_at: LessThan(threshold)
  });
}
```

---

## Rollback Plan

If issues occur, migrations can be reverted:

```bash
# Revert all three migrations
npm run migration:revert  # Audit logs
npm run migration:revert  # Sessions
npm run migration:revert  # User fields
```

**Note:** Reverting will delete all data in sessions and audit_logs tables!
