# Invoice Manager App

A modern, full-stack invoice management application built with Next.js, TypeScript, Tailwind CSS, and Prisma with PostgreSQL database.

## 🚀 Features (Fitur Lengkap)

<!-- Gabungan dari README.md dan FEATURES.md, tanpa duplikasi -->

### Core Functionality

- ✅ **Dashboard** - Overview of all invoices with statistics
- ✅ **Create Invoice** - Generate new invoices with client details and items
- ✅ **Edit Invoice** - Modify existing invoice details, items, and status
- ✅ **Delete Invoice** - Remove invoices with confirmation
- ✅ **View Invoice Details** - Complete invoice view with print options
- ✅ **Search & Filter** - Find invoices by client name or filter by status
- ✅ **Status Indicators** - Color-coded status badges (paid, unpaid, overdue)
- ✅ **Real-time Validation** - Form validation with instant feedback
- ✅ **Responsive Design** - Mobile-friendly interface
- ✅ **TypeScript** - Full type safety throughout the application

### Advanced Features

- ✅ **Print Invoice** - Direct browser printing
- ✅ **Send Email** - Real email functionality with SendGrid integration
- ✅ **Professional Layout** - Clean, print-ready design
- ✅ **Due Date Tracking** - Automatic status updates based on due dates
- ✅ **Success Notifications** - Toast messages with emojis and colors
- ✅ **Loading States** - Spinners and progress indicators
- ✅ **Accessibility** - ARIA labels & keyboard navigation

### Database Integration

- ✅ **Prisma ORM** - Type-safe database queries
- ✅ **PostgreSQL** - Robust database with Supabase integration
- ✅ **Relational Data** - Proper relationships between Invoice, Client, and Items
- ✅ **Auto-generated IDs** - Custom invoice numbers with client names
- ✅ **Migrations** - Version-controlled schema changes

### API Endpoints

- `GET /api/invoices` - Fetch all invoices
- `POST /api/invoices` - Create new invoice
- `PUT /api/invoices/[id]` - Update invoice
- `DELETE /api/invoices/[id]` - Delete invoice
- `POST /api/send-email` - Send invoice email

### Technical & UX

- **TypeScript**: Full type coverage
- **Interface Definitions**: Proper type definitions
- **Error Handling**: Type-safe error management
- **Animations**: Smooth transitions and hover effects
- **Toast Notifications**: User-friendly feedback

### Future Enhancements (Planned)

- [ ] Email templates & tracking
- [ ] Invoice reminders & payment tracking
- [ ] Analytics dashboard
- [ ] Multi-currency & tax support
- [ ] Bulk operations

---

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS 4
- **Database**: PostgreSQL with Prisma ORM
- **Deployment**: Supabase (Database)
- **Notifications**: react-hot-toast
- **Email Service**: SendGrid

---

## 📋 Prerequisites

- Node.js 18+ and npm
- PostgreSQL database (Supabase recommended)
- Git

---

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone <repository-url>
cd invoice_app
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Setup

Create a `.env` file in the root directory:

```env
# Database Configuration
DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres"
DIRECT_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres"

# SendGrid Configuration (Optional - for real email functionality)
SENDGRID_API_KEY="your_sendgrid_api_key_here"
SENDGRID_FROM_EMAIL="noreply@yourdomain.com"
SENDGRID_FROM_NAME="PT. Elektronik Indonesia"
```

---

## 🗄️ Database Setup

<!-- Gabungan dari README.md dan DATABASE_SETUP.md, tanpa duplikasi -->

### Prerequisites

- Node.js and npm installed
- Supabase account (or any PostgreSQL database)

### Setup Steps

#### 1. Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Get your database connection string from Settings > Database

#### 2. Configure Environment Variables

Create a `.env` file in the root directory:

```env
# Database Configuration
DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres"
DIRECT_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres"
```

Replace `[YOUR-PASSWORD]` and `[YOUR-PROJECT-REF]` with your actual Supabase credentials.

#### 3. Run Database Migration

```bash
npx prisma generate
npx prisma migrate dev --name init
npx prisma studio # (Optional) View your database in Prisma Studio
```

#### 4. Start Development Server

```bash
npm run dev
```

### Database Schema

```prisma
model Invoice {
  id        String      @id @default(uuid())
  status    String
  total     Int
  createdAt DateTime    @default(now())
  client    ClientInfo  @relation(fields: [clientId], references: [id])
  clientId  String
  items     InvoiceItem[]
}

model ClientInfo {
  id      String   @id @default(uuid())
  name    String
  email   String
  dueDate DateTime
  invoices Invoice[]
}

model InvoiceItem {
  id        String   @id @default(uuid())
  name      String
  quantity  Int
  price     Int
  invoice   Invoice  @relation(fields: [invoiceId], references: [id])
  invoiceId String
}
```

---

## 📧 Email/SendGrid Setup

<!-- Gabungan dari README.md dan SENDGRID_SETUP.md, tanpa duplikasi -->

### Overview

This app supports real email sending using SendGrid. You can run in simulation mode (no API key) or production mode (with real SendGrid credentials).

### Prerequisites

- SendGrid account ([sendgrid.com](https://sendgrid.com))
- Domain verification (for production)
- API Key from SendGrid dashboard

### Step-by-Step Setup

1. **Create SendGrid Account**: Sign up at [sendgrid.com](https://sendgrid.com)
2. **Verify Your Domain**: Go to Settings → Sender Authentication, follow the DNS instructions
3. **Create API Key**: Go to Settings → API Keys, create a key with "Mail Send" permission
4. **Configure Environment Variables**: Add to your `.env`:

```env
SENDGRID_API_KEY="SG.your_actual_api_key_here"
SENDGRID_FROM_EMAIL="noreply@yourdomain.com"
SENDGRID_FROM_NAME="PT. Elektronik Indonesia"
```

5. **Update Sender Email**: Use your verified domain email

### Testing the Integration

- **Development Mode**: If no SendGrid API key, app will simulate email sending
- **Production Mode**: With valid API key, real emails will be sent

### Email Features

- Professional HTML template with branding
- Invoice details, itemized list, total, payment info
- Plain text fallback
- Success/error notifications

### Troubleshooting

- **Unauthorized**: Check your `SENDGRID_API_KEY`
- **Forbidden**: Verify your domain and sender authentication
- **Email not delivered**: Check spam, DNS, SendGrid logs
- **Debug**: Add `DEBUG=true` to `.env` for verbose logs

### Security Best Practices

- Never commit API keys to version control
- Use environment variables for all secrets
- Rotate API keys regularly
- Use restricted access when possible

### SendGrid Pricing (Summary)

- Free: 100 emails/day (3,000/month)
- Paid: Essentials, Pro, Premier plans available

---

## 📁 Project Structure

```
invoice_app/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── api/               # API routes
│   │   │   └── invoices/      # Invoice CRUD endpoints
│   │   ├── create-invoice/    # Create invoice page
│   │   ├── invoice/[id]/      # Invoice detail page
│   │   └── page.tsx           # Dashboard page
│   ├── components/            # Reusable components
│   │   ├── Header.tsx
│   │   ├── Stats.tsx
│   │   ├── SearchBar.tsx
│   │   ├── InvoiceList.tsx
│   │   ├── ClientInfoForm.tsx
│   │   ├── InvoiceItemsForm.tsx
│   │   ├── InvoiceTotalBox.tsx
│   │   └── Spinner.tsx
│   ├── types/                # TypeScript type definitions
│   │   └── invoice.ts
│   └── lib/                  # Utility functions
│       └── prisma.ts         # Prisma client
├── prisma/
│   └── schema.prisma         # Database schema
└── public/                   # Static assets
```

## 🗄️ Database Schema

### Invoice

- `id`: String (Custom format: "INVOICE-CLIENTNAME-TIMESTAMP")
- `status`: String ("paid", "unpaid", "overdue")
- `total`: Int
- `createdAt`: DateTime
- `clientId`: String (Foreign key to ClientInfo)

### ClientInfo

- `id`: String (UUID)
- `name`: String
- `email`: String
- `dueDate`: DateTime
- `createdAt`: DateTime

### InvoiceItem

- `id`: String (UUID)
- `name`: String
- `quantity`: Int
- `price`: Int
- `invoiceId`: String (Foreign key to Invoice)

## 🔌 API Endpoints

### Invoices

- `GET /api/invoices` - Fetch all invoices
- `POST /api/invoices` - Create new invoice
- `PUT /api/invoices/[id]` - Update invoice
- `DELETE /api/invoices/[id]` - Delete invoice

### Email

- `POST /api/send-email` - Send invoice email via SendGrid

## 🎨 UI Components

### Dashboard

- Header with create button
- Statistics cards (Total Revenue, Total Invoices, Paid, Overdue)
- Search and filter functionality
- Invoice list with actions

### Create Invoice

- Client information form
- Dynamic invoice items form
- Real-time validation
- Total calculation

### Invoice Detail

- Complete invoice layout
- Edit functionality
- Print and PDF export
- Email simulation

## 🔧 Development

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```

### Database Commands

```bash
npx prisma generate  # Generate Prisma client
npx prisma migrate dev # Run migrations
npx prisma studio    # Open database GUI
npx prisma db push   # Push schema changes
```

## 🚀 Deployment

### Vercel (Recommended)

1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Environment Variables for Production

```env
DATABASE_URL="your-production-database-url"
DIRECT_URL="your-production-direct-url"

# SendGrid (Optional)
SENDGRID_API_KEY="your-production-sendgrid-api-key"
SENDGRID_FROM_EMAIL="noreply@yourdomain.com"
SENDGRID_FROM_NAME="PT. Elektronik Indonesia"
```

## 🐛 Troubleshooting

### Common Issues

1. **Database Connection Error**

   - Check your `.env` file has correct `DATABASE_URL`
   - Ensure database is accessible
   - Run `npx prisma db push` to sync schema

2. **Prisma Client Not Found**

   - Run `npx prisma generate`
   - Restart development server

3. **Migration Failed**

   - Run `npx prisma migrate reset` to reset database
   - Check for schema conflicts

4. **Create Invoice Fails**
   - Check browser console for detailed error
   - Ensure all required fields are filled
   - Verify database connection

### Debug Mode

Enable detailed logging by checking browser console and server logs for error messages.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- Prisma team for the excellent ORM
- Tailwind CSS for the utility-first styling
- Supabase for the database hosting solution

---

**Made with ❤️ using Next.js, TypeScript, and Tailwind CSS**
