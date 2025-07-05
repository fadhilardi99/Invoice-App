# Database Setup Guide

## Prerequisites

- Node.js and npm installed
- Supabase account (or any PostgreSQL database)

## Setup Steps

### 1. Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Get your database connection string from Settings > Database

### 2. Configure Environment Variables

Create a `.env` file in the root directory:

```env
# Database Configuration
DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres"
DIRECT_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres"
```

Replace `[YOUR-PASSWORD]` and `[YOUR-PROJECT-REF]` with your actual Supabase credentials.

### 3. Run Database Migration

```bash
# Generate Prisma client
npx prisma generate

# Run database migration
npx prisma migrate dev --name init

# (Optional) View your database in Prisma Studio
npx prisma studio
```

### 4. Start Development Server

```bash
npm run dev
```

## Database Schema

The application uses the following Prisma schema:

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

## API Endpoints

- `GET /api/invoices` - Fetch all invoices
- `POST /api/invoices` - Create new invoice
- `PUT /api/invoices/[id]` - Update invoice
- `DELETE /api/invoices/[id]` - Delete invoice

## Features

✅ Dashboard with invoice list  
✅ Create new invoice  
✅ Edit invoice details  
✅ Delete invoice  
✅ View invoice details  
✅ Print invoice  
✅ Download PDF  
✅ Send email (simulation)  
✅ Responsive design  
✅ TypeScript support  
✅ Database integration with Prisma  
✅ Real-time form validation

## Troubleshooting

1. **Database connection error**: Check your DATABASE_URL in `.env`
2. **Migration failed**: Run `npx prisma migrate reset` to reset database
3. **Prisma client not found**: Run `npx prisma generate`
