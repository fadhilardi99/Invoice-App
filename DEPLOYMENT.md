# Deployment Guide

## 🚀 Vercel Deployment

### Prerequisites

- GitHub repository with your code
- Vercel account
- Supabase database setup
- SendGrid account (optional)

### Step 1: Prepare Your Repository

1. **Push to GitHub**

   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Verify Build Locally**
   ```bash
   npm run build
   ```

### Step 2: Deploy to Vercel

1. **Connect Repository**

   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Vercel will auto-detect Next.js

2. **Configure Environment Variables**
   Add these in Vercel dashboard → Settings → Environment Variables:

   **Required:**

   ```
   DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres
   DIRECT_URL=postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres
   ```

   **Optional (for email functionality):**

   ```
   SENDGRID_API_KEY=SG.your_actual_api_key_here
   SENDGRID_FROM_EMAIL=noreply@yourdomain.com
   SENDGRID_FROM_NAME=PT. Elektronik Indonesia
   ```

3. **Deploy**
   - Click "Deploy"
   - Vercel will use the build configuration from `vercel.json`

### Step 3: Verify Deployment

1. **Check Build Logs**

   - Should see: "✔ Generated Prisma Client"
   - Should see: "✓ Compiled successfully"

2. **Test Functionality**
   - Visit your deployed URL
   - Test creating an invoice
   - Test API endpoints

## 🔧 Troubleshooting

### Prisma Client Error

**Error:** `PrismaClientInitializationError`

**Solutions:**

- ✅ **Fixed**: Build script includes `prisma generate`
- ✅ **Fixed**: `vercel.json` configured correctly
- ✅ **Fixed**: Using shared Prisma instance

**If still occurs:**

1. Check environment variables in Vercel
2. Verify database connection
3. Check build logs for Prisma generation

### Database Connection Error

**Error:** `P1001: Can't reach database server`

**Solutions:**

1. Check `DATABASE_URL` in Vercel environment variables
2. Ensure Supabase database is not paused
3. Verify IP allowlist in Supabase (if configured)

### Build Failures

**Common Issues:**

1. **Missing Environment Variables**: Add all required vars
2. **TypeScript Errors**: Check console for type issues
3. **Dependency Issues**: Ensure all packages installed

## 📊 Monitoring

### Vercel Dashboard

- **Functions**: Monitor API route performance
- **Analytics**: Track page views and performance
- **Logs**: Check for errors and issues

### Database Monitoring

- **Supabase Dashboard**: Monitor database performance
- **Connection Pool**: Check connection limits
- **Query Performance**: Monitor slow queries

## 🔒 Security

### Environment Variables

- ✅ Never commit secrets to repository
- ✅ Use Vercel environment variables
- ✅ Rotate API keys regularly

### Database Security

- ✅ Use connection pooling
- ✅ Enable SSL connections
- ✅ Monitor access logs

## 🚀 Performance Optimization

### Build Optimization

- ✅ Prisma Client generation during build
- ✅ Dynamic imports for heavy components
- ✅ Image optimization with Next.js

### Runtime Optimization

- ✅ API route caching strategies
- ✅ Database query optimization
- ✅ CDN for static assets

## 📈 Scaling

### Vercel Pro Features

- **Edge Functions**: For global performance
- **Analytics**: Detailed performance metrics
- **Team Collaboration**: Multiple developers

### Database Scaling

- **Supabase Pro**: Higher connection limits
- **Read Replicas**: For read-heavy workloads
- **Connection Pooling**: For better performance

## 🔄 Updates

### Automatic Deployments

- ✅ Push to main branch triggers deployment
- ✅ Preview deployments for pull requests
- ✅ Rollback to previous versions

### Database Migrations

```bash
# Local development
npx prisma migrate dev

# Production (via Vercel)
# Migrations run automatically during build
```

## 📞 Support

### Vercel Support

- [Vercel Documentation](https://vercel.com/docs)
- [Vercel Community](https://github.com/vercel/vercel/discussions)

### Prisma Support

- [Prisma Documentation](https://www.prisma.io/docs)
- [Prisma Community](https://community.prisma.io)

### Application Issues

- Check build logs in Vercel dashboard
- Monitor function logs for API errors
- Verify environment variables
