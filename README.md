# Inventory Management System

A comprehensive inventory management system built with Next.js, TypeScript, and Tailwind CSS.

## Features

- **Dashboard**: Overview of inventory statistics and recent activities
- **Products**: Manage product catalog with detailed product information
- **Categories**: Organize products into categories
- **Purchases**: Track purchase transactions and supplier information
- **Sales**: Monitor sales transactions and revenue
- **Stock Ledger**: Detailed stock movement tracking
- **Suppliers**: Manage supplier information and relationships
- **Customers**: Customer database and relationship management
- **Feedback**: Customer feedback and reviews system
- **Images**: Image management for products

## Architecture

### Routing Structure

The application uses Next.js App Router with the following structure:

```
app/
├── layout.tsx          # Root layout with sidebar and header
├── page.tsx           # Home page (redirects to dashboard)
├── dashboard/         # Dashboard page
├── products/          # Products listing
│   └── details/[id]/  # Product details (dynamic routing)
├── categories/        # Categories management
├── purchase/          # Purchase transactions
├── sales/            # Sales transactions
├── ledgers/          # Stock ledger
├── suppliers/        # Supplier management
├── customers/        # Customer management
├── feedbacks/        # Feedback system
└── images/           # Image management
```

### Components

- **AppWrapper**: Client-side wrapper that manages dark mode state and provides sidebar/header layout
- **Sidebar**: Navigation component with routing using Next.js navigation
- **Header**: Top navigation bar with search and user menu
- **Modal Components**: Various modals for adding/editing data

### State Management

- **Dark Mode**: Managed at the AppWrapper level and passed down to components
- **Navigation**: Uses Next.js routing instead of state-based navigation
- **Local State**: Each page manages its own local state for data and UI interactions

## Key Changes Made

1. **Converted to Next.js Routing**:

   - Removed state-based navigation
   - Implemented proper Next.js pages with dynamic routing
   - Added redirect from home to dashboard

2. **Layout Structure**:

   - Created server-side root layout with metadata
   - Added client-side AppWrapper for state management
   - Sidebar and header are now present on all pages

3. **Navigation Updates**:

   - Sidebar uses `useRouter` and `usePathname` for navigation
   - Active state is determined by current pathname
   - Product details use dynamic routing with `[id]` parameter

4. **Component Updates**:
   - Removed props that were used for state-based navigation
   - Updated components to use Next.js navigation hooks
   - Maintained all existing functionality while improving architecture

## Getting Started

1. Install dependencies:

   ```bash
   npm install
   ```

2. Run the development server:

   ```bash
   npm run dev
   ```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Technology Stack

- **Next.js 14**: React framework with App Router
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first CSS framework
- **Lucide React**: Icon library
- **Shadcn/ui**: Component library

## File Structure

```
components/
├── app-wrapper.tsx           # Client-side layout wrapper
├── inventory-sidebar.tsx     # Navigation sidebar
├── header.tsx               # Top navigation header
├── add-*-modal.tsx          # Modal components for data entry
└── ui/                      # Shadcn/ui components

app/
├── layout.tsx               # Root layout
├── page.tsx                 # Home page (redirect)
├── dashboard/page.tsx       # Dashboard
├── products/
│   ├── page.tsx            # Products listing
│   └── details/[id]/page.tsx # Product details
└── [other pages]/page.tsx   # Other feature pages
```
