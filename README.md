# Invoice Manager App

A modern, full-stack invoice management application built with Next.js, TypeScript, Tailwind CSS, and Prisma with PostgreSQL database.

## 🚀 Features

### Core Functionality

- ✅ **Dashboard** - Overview of all invoices with statistics
- ✅ **Create Invoice** - Generate new invoices with client details and items
- ✅ **Edit Invoice** - Modify existing invoice details, items, and status
- ✅ **Delete Invoice** - Remove invoices with confirmation
- ✅ **View Invoice Details** - Complete invoice view with print/PDF options
- ✅ **Search & Filter** - Find invoices by client name or filter by status

### Advanced Features

- ✅ **Print Invoice** - Direct browser printing
- ✅ **Download PDF** - Export invoice as PDF using html2pdf.js
- ✅ **Send Email** - Simulated email functionality with notifications
- ✅ **Real-time Validation** - Form validation with instant feedback
- ✅ **Responsive Design** - Mobile-friendly interface
- ✅ **TypeScript** - Full type safety throughout the application

### Database Integration

- ✅ **Prisma ORM** - Type-safe database queries
- ✅ **PostgreSQL** - Robust database with Supabase integration
- ✅ **Relational Data** - Proper relationships between Invoice, Client, and Items
- ✅ **Auto-generated IDs** - Custom invoice numbers with client names

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS 4
- **Database**: PostgreSQL with Prisma ORM
- **Deployment**: Supabase (Database)
- **Notifications**: react-hot-toast
- **PDF Generation**: html2pdf.js

## 📋 Prerequisites

- Node.js 18+ and npm
- PostgreSQL database (Supabase recommended)
- Git

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
```

### 4. Database Setup

```bash
# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma migrate dev --name init

# (Optional) View database in Prisma Studio
npx prisma studio
```

### 5. Start Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

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
