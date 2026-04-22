# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm install              # Install dependencies
npm run dev              # Start development server on http://localhost:3000
npm run build            # Build for production
npm start                # Start production server
npm run lint             # Run ESLint
```

## Architecture Overview

**Stack:** Next.js 16, React 19, TypeScript, Tailwind CSS v4, MongoDB with Mongoose

**Project Structure:**
- `src/app/` - Next.js 15+ App Router with file-based routing
- `src/components/` - Reusable UI components (Navbar, Footer, Hero, ProductCard, etc.)
- `src/context/` - React Context providers (Auth, Cart, Wishlist, Toast, Theme)
- `src/lib/` - Utility modules (database, authentication, validation, email, currency)
- `src/models/` - Mongoose schemas (User, Product, Order, Review, Testimonial, Subscriber, InstagramPost)

**Key Patterns:**
- API routes use Route Handlers in `src/app/api/`
- MongoDB connection is singleton-based via `src/lib/db.ts`
- JWT-based authentication with cookies (using `jose` for verification)
- Admin routes protected by middleware (`src/middleware.ts`)
- Dual payment integration: Stripe and Razorpay
- CSS Modules used for component-specific styling (`*.module.css`)
- Global theming via CSS custom properties in `globals.css`

**Environment Variables Required:**
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - Secret for JWT token verification
- Payment gateway keys (Stripe/Razorpay)
- Email service credentials (Resend/Nodemailer)
