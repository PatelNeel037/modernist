# Modernist - Next.js Fashion Store

This is a modern version of the Modernist fashion store, built with Next.js 15, React 19, and Tailwind CSS v4.

## Prerequisites

- Node.js 18+ installed.

## Setup Instructions

1.  **Install Dependencies**
    Open your terminal in this directory and run:
    ```bash
    npm install
    npm install lucide-react framer-motion clsx tailwind-merge
    ```

    *If you encounter execution policy errors on Windows PowerShell, try running the command in Command Prompt (cmd) or run:*
    ```powershell
    Set-ExecutionPolicy RemoteSigned -Scope CurrentUser
    ```

2.  **Run the Development Server**
    ```bash
    npm run dev
    ```

3.  **Open the App**
    Visit [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

- `src/app/page.tsx`: The main Home page.
- `src/components/`: Reusable UI components (Navbar, Hero, Products, etc.).
- `src/app/globals.css`: Global styles and Tailwind configuration.

## Features Implemented

- **Responsive Navbar**: With scroll effects and mobile menu.
- **Hero Section**: With fade-up animations.
- **Product Grid**: With hover effects and mock data.
- **Dynamic Icons**: Using `lucide-react` instead of Font Awesome.
- **Modern Typography**: Using Playfair Display and Roboto via `next/font`.

## Next Steps

- Create `src/app/shop/page.tsx` for the Shop page.
- Create `src/app/product/[id]/page.tsx` for Product Details.
- Implement Authentication and Cart logic.
