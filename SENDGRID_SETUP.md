# SendGrid Integration Setup Guide

## 🚀 Overview

This guide will help you set up SendGrid for real email functionality in your invoice app. SendGrid is a popular email service that provides reliable email delivery and analytics.

## 📋 Prerequisites

1. **SendGrid Account**: Sign up at [sendgrid.com](https://sendgrid.com)
2. **Domain Verification**: You'll need to verify your domain with SendGrid
3. **API Key**: Generate an API key from your SendGrid dashboard

## 🔧 Step-by-Step Setup

### 1. Create SendGrid Account

1. Go to [sendgrid.com](https://sendgrid.com)
2. Click "Start for Free" or "Sign Up"
3. Complete the registration process
4. Verify your email address

### 2. Verify Your Domain

1. **Login to SendGrid Dashboard**
2. **Navigate to Settings → Sender Authentication**
3. **Click "Authenticate Your Domain"**
4. **Enter your domain** (e.g., `yourdomain.com`)
5. **Add DNS records** as instructed:
   - CNAME records for authentication
   - SPF record for email authentication
   - DKIM record for email signing

### 3. Create API Key

1. **Go to Settings → API Keys**
2. **Click "Create API Key"**
3. **Choose "Full Access"** (or "Restricted Access" with Mail Send permissions)
4. **Name your key** (e.g., "Invoice App API Key")
5. **Copy the API key** (you won't see it again!)

### 4. Configure Environment Variables

Create a `.env.local` file in your project root:

```bash
# Database
DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres"

# SendGrid Configuration
SENDGRID_API_KEY="SG.your_actual_api_key_here"
SENDGRID_FROM_EMAIL="noreply@yourdomain.com"
SENDGRID_FROM_NAME="PT. Elektronik Indonesia"

# Next.js
NEXTAUTH_SECRET="your-nextauth-secret"
NEXTAUTH_URL="http://localhost:3000"
```

### 5. Update Sender Email

Replace `noreply@yourdomain.com` with your verified domain email.

## 🧪 Testing the Integration

### Development Mode (No SendGrid Key)

If you don't have a SendGrid API key configured, the app will run in simulation mode:

```bash
# Start the development server
npm run dev
```

The email functionality will work with simulated sending and show appropriate messages.

### Production Mode (With SendGrid Key)

1. **Add your SendGrid API key** to `.env.local`
2. **Restart the development server**
3. **Test email sending** from the invoice detail page

## 📧 Email Features

### HTML Email Template

The app includes a professional HTML email template with:

- **Company branding** with gradient header
- **Invoice details** in a clean table format
- **Payment information** with bank details
- **Professional styling** with responsive design
- **Plain text fallback** for email clients that don't support HTML

### Email Content

Each email includes:

- **Invoice number** and date
- **Client information** (name, email)
- **Itemized list** with quantities and prices
- **Total amount** in Indonesian Rupiah
- **Payment instructions** with bank details
- **Due date** information
- **Company contact** information

## 🔍 Troubleshooting

### Common Issues

#### 1. "Unauthorized" Error

```
Error: SendGrid API key is invalid or not configured
```

**Solution**: Check your `SENDGRID_API_KEY` environment variable

#### 2. "Forbidden" Error

```
Error: SendGrid account not authorized to send emails
```

**Solution**:

- Verify your domain in SendGrid
- Check sender authentication
- Ensure your account is active

#### 3. Email Not Delivered

**Solutions**:

- Check spam folder
- Verify sender email domain
- Review SendGrid activity logs
- Check DNS records

#### 4. Development vs Production

- **Development**: Uses simulation mode if no API key
- **Production**: Requires valid SendGrid configuration

### Debug Mode

Enable detailed logging by adding to your `.env.local`:

```bash
DEBUG=true
```

## 📊 SendGrid Dashboard Features

Once configured, you can access:

1. **Activity Feed**: See all sent emails
2. **Delivery Stats**: Track delivery rates
3. **Bounce Reports**: Monitor failed deliveries
4. **Spam Reports**: Track spam complaints
5. **Email Analytics**: Open rates, click rates, etc.

## 🔒 Security Best Practices

### API Key Security

1. **Never commit API keys** to version control
2. **Use environment variables** for all secrets
3. **Rotate API keys** regularly
4. **Use restricted access** when possible

### Domain Security

1. **Verify your domain** with SendGrid
2. **Set up SPF records** for email authentication
3. **Configure DKIM** for email signing
4. **Monitor reputation** in SendGrid dashboard

## 💰 SendGrid Pricing

### Free Tier

- **100 emails/day** (3,000/month)
- **Basic features** included
- **Perfect for development** and small projects

### Paid Plans

- **Essentials**: $14.95/month for 50k emails
- **Pro**: $89.95/month for 100k emails
- **Premier**: Custom pricing for enterprise

## 🚀 Production Deployment

### Environment Variables

For production deployment, set these environment variables:

```bash
# Vercel
SENDGRID_API_KEY=your_production_api_key
SENDGRID_FROM_EMAIL=noreply@yourdomain.com
SENDGRID_FROM_NAME="PT. Elektronik Indonesia"
```

### Domain Configuration

1. **Verify your production domain** in SendGrid
2. **Update DNS records** for your domain
3. **Test email sending** in production environment
4. **Monitor delivery rates** and adjust as needed

## 📈 Monitoring & Analytics

### SendGrid Metrics

Track these key metrics:

- **Delivery Rate**: Percentage of emails delivered
- **Bounce Rate**: Percentage of failed deliveries
- **Open Rate**: Percentage of opened emails
- **Click Rate**: Percentage of clicked links
- **Spam Complaints**: Number of spam reports

### Application Logs

Monitor your application logs for:

- **Email sending errors**
- **API response times**
- **User feedback**
- **System performance**

## 🔄 Future Enhancements

### Planned Features

- [ ] **Email Templates**: Multiple template options
- [ ] **Scheduled Emails**: Send invoices at specific times
- [ ] **Email Tracking**: Track opens and clicks
- [ ] **Bounce Handling**: Automatic bounce processing
- [ ] **Email Analytics**: Detailed reporting dashboard

### Advanced Features

- [ ] **Dynamic Templates**: Personalized content
- [ ] **A/B Testing**: Test different email formats
- [ ] **Automated Workflows**: Trigger emails based on events
- [ ] **Integration APIs**: Connect with other services

## 📞 Support

### SendGrid Support

- **Documentation**: [sendgrid.com/docs](https://sendgrid.com/docs)
- **API Reference**: [sendgrid.com/docs/api-reference](https://sendgrid.com/docs/api-reference)
- **Support Portal**: [support.sendgrid.com](https://support.sendgrid.com)

### Application Support

- **GitHub Issues**: Report bugs and feature requests
- **Documentation**: Check the main README.md
- **Community**: Join our developer community

---

**Note**: This setup guide assumes you have basic knowledge of DNS management and email configuration. If you need help with domain verification or DNS setup, consult your domain registrar's documentation or contact their support team.
