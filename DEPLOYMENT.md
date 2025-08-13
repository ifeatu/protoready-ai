# ProtoReady.ai Deployment Guide

This guide covers the complete deployment process for ProtoReady.ai from development to production.

## 🚀 Quick Start

```bash
# Clone and setup
git clone <repository-url>
cd nextjs-protoready
npm install

# Copy environment variables
cp .env.example .env.local
# Edit .env.local with your values

# Deploy to preview
./scripts/deploy.sh preview

# Deploy to production
./scripts/deploy.sh production
```

## 📋 Prerequisites

### Required Tools
- Node.js 18+ 
- npm or yarn
- Git
- Vercel CLI (installed automatically)

### Required Services
- **Vercel Account** - For hosting and deployment
- **Supabase Project** - For database and authentication
- **Stripe Account** - For payment processing
- **Sentry Account** - For error tracking (optional)

## 🔧 Environment Setup

### 1. Supabase Configuration

1. Create a new Supabase project at [supabase.com](https://supabase.com)
2. Get your project URL and anon key from Settings > API
3. Run the database migration:
   ```sql
   -- Execute the contents of supabase/migrations/001_enhanced_schema.sql
   ```

### 2. Stripe Configuration

1. Create a Stripe account at [stripe.com](https://stripe.com)
2. Get your API keys from the Stripe dashboard
3. Create subscription products and get their price IDs
4. Set up webhook endpoints (see Webhook Setup section)

### 3. Environment Variables

Copy `.env.example` to `.env.local` and fill in all values:

```bash
# Database
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_BASIC_PRICE_ID=price_...
STRIPE_PROFESSIONAL_PRICE_ID=price_...

# Application
NEXT_PUBLIC_APP_URL=https://your-domain.com
NODE_ENV=production

# Optional: Monitoring
SENTRY_DSN=https://your-sentry-dsn
```

## 🚢 Deployment Process

### Automated Deployment (Recommended)

The project includes automated deployment via GitHub Actions:

1. **Push to `main` branch** - Automatically deploys to production
2. **Create pull request** - Automatically creates preview deployment
3. **Health checks** - Validates deployment success

### Manual Deployment

```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy to preview
vercel

# Deploy to production
vercel --prod
```

### Using Deployment Script

```bash
# Deploy to preview environment
./scripts/deploy.sh preview

# Deploy to production environment
./scripts/deploy.sh production
```

The script automatically:
- ✅ Checks dependencies
- ✅ Validates environment variables
- ✅ Runs type checking and linting
- ✅ Performs build test
- ✅ Deploys to Vercel
- ✅ Runs health checks

## 🔒 Security Configuration

### Vercel Environment Variables

Set these in your Vercel dashboard under Settings > Environment Variables:

**Production Variables:**
```
NODE_ENV=production
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_BASIC_PRICE_ID=price_...
STRIPE_PROFESSIONAL_PRICE_ID=price_...
NEXT_PUBLIC_APP_URL=https://protoready.ai
SENTRY_DSN=https://...
```

**Preview Variables:**
```
NODE_ENV=preview
# Use test/staging credentials
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
```

### Webhook Setup

#### Stripe Webhooks

1. Go to Stripe Dashboard > Developers > Webhooks
2. Add endpoint: `https://your-domain.com/api/stripe/webhook`
3. Select events:
   - `checkout.session.completed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
4. Copy webhook secret to environment variables

#### Supabase Row Level Security

Ensure RLS is enabled on all tables:
```sql
-- Enable RLS on all tables
ALTER TABLE user_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessment_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE consultants ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Add policies (see migration file for complete policies)
```

## 📊 Monitoring & Observability

### Health Checks

The application includes a health check endpoint at `/healthz` that monitors:
- Database connectivity
- Environment variable configuration
- Service status
- Performance metrics

### Error Tracking

Sentry is configured for error tracking:
- Client-side errors
- Server-side errors
- Performance monitoring
- Session replays

### Logging

Structured logging with different levels:
- **Development**: All logs including debug
- **Production**: Error and warning logs only

## 🔄 CI/CD Pipeline

### GitHub Actions Workflow

The `.github/workflows/deploy.yml` handles:

1. **Code Quality Checks**
   - TypeScript compilation
   - ESLint validation
   - Build verification
   - Security audit

2. **Preview Deployments**
   - Automatic preview for pull requests
   - Environment validation
   - Integration testing

3. **Production Deployments**
   - Deploy on merge to main
   - Health check validation
   - Slack notifications

### Required GitHub Secrets

Add these secrets to your GitHub repository:

```
VERCEL_TOKEN=your-vercel-token
VERCEL_ORG_ID=your-org-id
VERCEL_PROJECT_ID=your-project-id
SLACK_WEBHOOK=your-slack-webhook (optional)
```

## 🚨 Troubleshooting

### Common Issues

**Build Failures:**
```bash
# Clear cache and reinstall
rm -rf .next node_modules package-lock.json
npm install
npm run build
```

**Environment Variable Issues:**
```bash
# Check Vercel environment variables
vercel env ls

# Pull environment variables locally
vercel env pull .env.local
```

**Database Connection Issues:**
```bash
# Test Supabase connection
curl -H "apikey: YOUR_ANON_KEY" \
     -H "Authorization: Bearer YOUR_ANON_KEY" \
     "https://YOUR_PROJECT.supabase.co/rest/v1/user_subscriptions?select=count"
```

**Stripe Webhook Issues:**
```bash
# Test webhook endpoint
curl -X POST https://your-domain.com/api/stripe/webhook \
     -H "Content-Type: application/json" \
     -d '{"type": "test"}'
```

### Debug Mode

Enable debug logging:
```bash
# Set environment variable
DEBUG=true npm run dev

# Or in production
VERCEL_ENV=preview vercel dev
```

### Performance Issues

Monitor performance with:
- Vercel Analytics
- Sentry Performance Monitoring
- Lighthouse CI
- Core Web Vitals

## 📈 Scaling Considerations

### Database Scaling
- Supabase handles automatic scaling
- Monitor connection limits
- Use connection pooling for high traffic

### Application Scaling
- Vercel automatically scales serverless functions
- Monitor cold start times
- Optimize bundle size

### CDN & Caching
- Static assets cached at edge
- API responses cached appropriately
- Database query optimization

## 🔐 Security Checklist

- [ ] All environment variables secured
- [ ] HTTPS enforced
- [ ] Security headers configured
- [ ] Row Level Security enabled
- [ ] Webhook signatures verified
- [ ] Input validation implemented
- [ ] Rate limiting configured
- [ ] CORS properly configured
- [ ] Content Security Policy set
- [ ] Regular security audits

## 📞 Support

For deployment issues:
1. Check the health endpoint: `/healthz`
2. Review Vercel deployment logs
3. Check Sentry for error reports
4. Verify environment variable configuration
5. Test individual API endpoints

---

**Next Steps After Deployment:**
1. Configure custom domain
2. Set up monitoring alerts
3. Implement backup strategy
4. Create incident response plan
5. Set up staging environment