# ProtoReady.ai RBAC System Design Specification

## Overview

This document outlines the Role-Based Access Control (RBAC) system for ProtoReady.ai, defining user roles, permissions, workflows, and implementation requirements.

## System Architecture

### Core User Roles

1. **Users (Clients)** - Primary customers seeking production readiness assessments
2. **Consultants** - Expert developers providing implementation services
3. **Admins** - Platform administrators managing the system

### Role Hierarchy & Permissions Matrix

| Feature/Resource | Users | Consultants | Admins |
|-----------------|-------|-------------|--------|
| View Landing Page | ✅ | ✅ | ✅ |
| Create Account | ✅ | ✅ | ✅ |
| Login Required for Assessment | ✅ | ✅ | ✅ |
| Submit Assessments | ✅ | ❌ | ✅ |
| View Own Assessment Reports | ✅ | ❌ | ✅ |
| Book Consultants | ✅ | ❌ | ✅ |
| View Consultant Profiles | ✅ | ✅ | ✅ |
| Create Consultant Profile | ❌ | ✅ | ✅ |
| Manage Own Profile | ✅ | ✅ | ✅ |
| Accept/Manage Bookings | ❌ | ✅ | ✅ |
| View Client Contact Info | ❌ | ✅ (booked only) | ✅ |
| Approve Consultant Applications | ❌ | ❌ | ✅ |
| View All User Data | ❌ | ❌ | ✅ |
| Manage Subscriptions | ✅ (own) | ✅ (own) | ✅ (all) |
| Platform Analytics | ❌ | ❌ | ✅ |

## Database Schema Extensions

### Enhanced User Management

```sql
-- Extend existing auth.users table with custom claims
ALTER TABLE auth.users ADD COLUMN IF NOT EXISTS role text DEFAULT 'user' CHECK (role IN ('user', 'consultant', 'admin'));
ALTER TABLE auth.users ADD COLUMN IF NOT EXISTS email_verified boolean DEFAULT false;
ALTER TABLE auth.users ADD COLUMN IF NOT EXISTS onboarding_completed boolean DEFAULT false;

-- User profiles table for additional data
CREATE TABLE IF NOT EXISTS user_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name text,
  company_name text,
  phone_number text,
  timezone text DEFAULT 'UTC',
  notification_preferences jsonb DEFAULT '{"email": true, "sms": false}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  
  UNIQUE(user_id)
);

-- Admin activity log
CREATE TABLE admin_activity_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  action text NOT NULL,
  target_user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  target_resource text,
  details jsonb DEFAULT '{}',
  ip_address inet,
  user_agent text,
  created_at timestamptz DEFAULT now()
);
```

### Enhanced RLS Policies

```sql
-- Update consultant profiles policies for role-based access
DROP POLICY IF EXISTS "Admins can manage all consultant profiles" ON consultant_profiles;
CREATE POLICY "Admins can manage all consultant profiles" ON consultant_profiles
  FOR ALL USING (
    EXISTS (SELECT 1 FROM auth.users WHERE id = auth.uid() AND role = 'admin')
  );

-- Assessment reports require login
DROP POLICY IF EXISTS "Users can create their own reports" ON assessment_reports;
CREATE POLICY "Users can create their own reports" ON assessment_reports
  FOR INSERT WITH CHECK (
    auth.uid() = user_id AND 
    EXISTS (SELECT 1 FROM auth.users WHERE id = auth.uid())
  );

-- Admin access to all assessment reports
CREATE POLICY "Admins can view all reports" ON assessment_reports
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM auth.users WHERE id = auth.uid() AND role = 'admin')
  );
```

## User Workflows

### 1. Regular Users (Clients) Workflow

#### Onboarding Flow
1. **Landing Page** → Clear value proposition with "Get Assessment" CTA
2. **Sign Up/Login** → OAuth with GitHub/Google (required for assessment)
3. **Profile Completion** → Company info, project details (optional)
4. **First Assessment** → Guided through assessment wizard
5. **Results & Next Steps** → View report, option to book consultant

#### Core User Journey
```
Landing Page → Auth Required → Profile Setup → Assessment Wizard → Results → Consultant Booking (Optional)
```

#### Key Features
- **Assessment History**: View all previous assessments
- **Consultant Booking**: Browse and book expert consultants
- **Subscription Management**: Upgrade to higher tiers
- **Project Dashboard**: Track multiple projects and their readiness scores

### 2. Consultants Workflow

#### Application & Onboarding
1. **Consultant Signup CTA** → Prominent link on landing page
2. **Application Form** → Expertise, portfolio, rates, experience
3. **Admin Review Process** → Background check and skill verification
4. **Profile Activation** → Approved consultants can accept bookings
5. **Onboarding Training** → Platform guidelines and best practices

#### Daily Operations
```
Dashboard → View Bookings → Accept/Decline → Project Communication → Delivery → Review Collection
```

#### Key Features
- **Consultant Dashboard**: View pending bookings, active projects, earnings
- **Client Communication**: Secure messaging within platform
- **Project Management**: Track deliverables, hours, milestones
- **Performance Analytics**: Ratings, reviews, earnings history

### 3. Admin Workflow

#### Platform Management
1. **Admin Dashboard** → System health, user metrics, revenue tracking
2. **Consultant Approval** → Review applications, verify credentials
3. **Content Moderation** → Monitor reviews, resolve disputes
4. **System Monitoring** → Performance metrics, error tracking
5. **Customer Support** → Handle escalated issues

#### Key Features
- **User Management**: View, edit, suspend user accounts
- **Consultant Oversight**: Approve/reject applications, monitor performance
- **Analytics Dashboard**: Platform metrics, revenue tracking
- **Content Management**: Update pricing, features, policies

## Authentication & Authorization Requirements

### Authentication Middleware

```typescript
// src/middleware.ts
import { withAuth } from "next-auth/middleware"

export default withAuth(
  function middleware(req) {
    // Add role-based route protection logic
    const { pathname } = req.nextUrl
    const token = req.nextauth.token
    
    // Require login for assessments
    if (pathname.startsWith('/assessment/submit') && !token) {
      return NextResponse.redirect(new URL('/auth/signin', req.url))
    }
    
    // Admin routes
    if (pathname.startsWith('/admin') && token?.role !== 'admin') {
      return NextResponse.redirect(new URL('/unauthorized', req.url))
    }
    
    // Consultant routes
    if (pathname.startsWith('/consultant') && token?.role !== 'consultant') {
      return NextResponse.redirect(new URL('/unauthorized', req.url))
    }
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token
    }
  }
)

export const config = {
  matcher: [
    '/assessment/submit/:path*',
    '/admin/:path*',
    '/consultant/:path*',
    '/dashboard/:path*'
  ]
}
```

### Enhanced NextAuth Configuration

```typescript
// Enhanced JWT callback for role management
callbacks: {
  async jwt({ token, user, account }) {
    if (account && user) {
      token.accessToken = account.access_token
      token.provider = account.provider
      
      // Fetch user role from database
      const userRecord = await supabase
        .from('auth.users')
        .select('role, onboarding_completed')
        .eq('id', user.id)
        .single()
      
      token.role = userRecord.data?.role || 'user'
      token.onboardingCompleted = userRecord.data?.onboarding_completed
    }
    return token
  },
  async session({ session, token }) {
    return {
      ...session,
      user: {
        ...session.user,
        role: token.role,
        onboardingCompleted: token.onboardingCompleted
      },
      accessToken: token.accessToken
    }
  }
}
```

## Updated Landing Page Requirements

### Service Description Enhancements

1. **Hero Section Updates**
   - Emphasize "Expert-Vetted Consultants" value proposition
   - Clear "Login Required" messaging for assessments
   - Dual CTAs: "Get Assessment" + "Become a Consultant"

2. **New Sections to Add**
   - **"How It Works"** - 3-step process visualization
   - **"Consultant Network"** - Showcase expert profiles
   - **"Success Stories"** - Client testimonials and case studies
   - **"Consultant Benefits"** - Why experts join our platform

3. **Navigation Updates**
   - Add "For Consultants" section
   - "Login/Sign Up" prominence
   - Role-specific dashboards after login

### Consultant Signup Flow

```
Landing Page "Become a Consultant" CTA → 
Consultant Application Form → 
Portfolio/Credential Upload → 
Rate Setting → 
Admin Review Queue → 
Approval Notification → 
Profile Activation
```

## API Endpoints Design

### Authentication Endpoints
- `GET /api/auth/me` - Current user profile with role
- `POST /api/auth/role/update` - Admin role management
- `GET /api/auth/permissions` - User permission checking

### User Management Endpoints
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `POST /api/users/onboarding` - Complete onboarding flow

### Consultant Management
- `POST /api/consultants/apply` - Submit consultant application
- `GET /api/consultants/dashboard` - Consultant dashboard data
- `PUT /api/consultants/availability` - Update availability status
- `GET /api/admin/consultants/pending` - Admin: pending applications

### Assessment Protection
- `POST /api/assessments` - Require authentication
- `GET /api/assessments/history` - User assessment history
- `GET /api/admin/assessments/analytics` - Admin: system analytics

## Frontend Components for Role-Based UI

### Role-Based Navigation
```typescript
// components/RoleBasedNav.tsx
export function RoleBasedNav({ user }: { user: SessionUser }) {
  const consultantNavItems = user.role === 'consultant' ? [
    { href: '/consultant/dashboard', label: 'Dashboard' },
    { href: '/consultant/bookings', label: 'Bookings' },
    { href: '/consultant/profile', label: 'Profile' }
  ] : []

  const adminNavItems = user.role === 'admin' ? [
    { href: '/admin/dashboard', label: 'Admin' },
    { href: '/admin/consultants', label: 'Consultants' },
    { href: '/admin/users', label: 'Users' }
  ] : []

  return (
    <nav>
      {/* Base navigation items */}
      {consultantNavItems.map(item => ...)}
      {adminNavItems.map(item => ...)}
    </nav>
  )
}
```

### Protected Assessment Component
```typescript
// components/ProtectedAssessment.tsx
export function ProtectedAssessment() {
  const { data: session, status } = useSession()
  
  if (status === 'loading') return <LoadingSpinner />
  
  if (!session) {
    return (
      <AuthRequired 
        message="Please sign in to access the assessment wizard"
        redirectTo="/assessment/submit"
      />
    )
  }
  
  return <AssessmentWizard />
}
```

## Implementation Priority

### Phase 1: Core RBAC (Week 1-2)
1. Database schema updates
2. Enhanced authentication middleware
3. Role-based API endpoints
4. Updated RLS policies

### Phase 2: User Workflows (Week 3-4)
1. Consultant application flow
2. Admin approval system
3. Protected assessment wizard
4. Role-based dashboards

### Phase 3: Landing Page & UX (Week 5-6)
1. Updated landing page design
2. Consultant signup CTA
3. Service description enhancements
4. Onboarding flows

### Phase 4: Advanced Features (Week 7-8)
1. Advanced admin analytics
2. Consultant performance tracking
3. Enhanced user messaging
4. Mobile responsive improvements

## Security Considerations

1. **JWT Token Management**: Secure token storage and rotation
2. **Role Verification**: Server-side role validation on all protected routes
3. **Data Privacy**: Ensure consultants only see relevant client data
4. **Audit Logging**: Track admin actions and sensitive operations
5. **Rate Limiting**: Prevent abuse of assessment and booking endpoints

## Testing Strategy

1. **Unit Tests**: Role-based permission functions
2. **Integration Tests**: Authentication flows and API endpoints
3. **E2E Tests**: Complete user journeys for each role
4. **Security Tests**: Role escalation and unauthorized access attempts
5. **Performance Tests**: Database query optimization with RLS policies

---

*This specification provides the foundation for implementing a comprehensive RBAC system that enhances security, improves user experience, and supports the platform's growth objectives.*