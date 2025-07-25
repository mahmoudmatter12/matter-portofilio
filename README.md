# 🚀 Matter Portfolio - Full-Stack SaaS Portfolio Platform

A comprehensive, production-ready portfolio SaaS platform built with Next.js 15, featuring a stunning frontend, powerful admin dashboard, and complete backend infrastructure. Perfect for developers, designers, and professionals to showcase their work and manage their online presence.

![Portfolio Preview](https://matter-portofilio.vercel.app/)
![Tech Stack](https://img.shields.io/badge/Next.js-15.3.0-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-38B2AC?style=for-the-badge&logo=tailwind-css)

## ✨ Features Overview

### 🎨 **Frontend Portfolio**

- **Dynamic Hero Section** with animated typewriter effects and profession cycling
- **Interactive About Section** with tabbed content and smooth animations
- **Professional Timeline** showcasing career journey and milestones
- **Skills Showcase** with categorized skills and proficiency levels
- **Certifications Gallery** with expiration tracking and status indicators
- **Projects Portfolio** with live demos, GitHub links, and technology tags
- **Services Section** highlighting offered services and expertise
- **Contact Form** with email integration and form validation
- **Responsive Design** optimized for all devices and screen sizes
- **Dark/Light Mode** support with smooth theme transitions
- **Scroll Progress Indicator** for enhanced user experience
- **Loading Animations** with space-themed loader
- **SEO Optimized** with proper meta tags and structured data

### 🛠️ **Admin Dashboard**

- **Modern Glassmorphism Design** with gradient backgrounds and animations
- **Comprehensive Content Management** for all portfolio sections
- **Real-time Data Updates** with React Query integration
- **File Upload System** for images, CVs, and documents with Cloudinary
- **Development Status Banner** with countdown timer and progress tracking
- **Message Management** with reply functionality and status tracking
- **Analytics Dashboard** with statistics and insights
- **Bulk Operations** for efficient content management
- **Search and Filtering** across all data tables
- **Responsive Admin Interface** optimized for desktop and mobile

### 🔐 **Authentication & Security**

- **Clerk Authentication** with multiple sign-in options (Google, GitHub, Email)
- **Protected Admin Routes** with middleware protection
- **Role-based Access Control** for admin functionality
- **Secure API Endpoints** with proper validation and error handling
- **CSRF Protection** and security headers

### 📊 **Database & Storage**

- **Prisma ORM** with PostgreSQL database for type-safe queries
- **Cloudinary Integration** for image storage and optimization
- **Efficient Data Caching** with React Query for optimal performance
- **Database Migrations** and seeding scripts
- **Optimized Queries** for better performance and scalability

## 🛠️ Tech Stack

### **Frontend**

- **Next.js 15** - React framework with App Router and Server Components
- **TypeScript** - Type-safe JavaScript for better development experience
- **React 19** - Latest React features with concurrent rendering
- **Tailwind CSS 4** - Utility-first CSS framework with modern features
- **Framer Motion** - Production-ready animation library
- **shadcn/ui** - Modern, accessible UI component library
- **Lucide React** - Beautiful, customizable icon library
- **React Hook Form** - Performant forms with easy validation
- **Zod** - TypeScript-first schema validation

### **Backend**

- **Next.js API Routes** - Serverless API endpoints with edge runtime
- **Prisma** - Modern database toolkit with type safety
- **PostgreSQL** - Robust relational database
- **Clerk** - Complete authentication and user management
- **Resend** - Reliable email delivery service
- **Cloudinary** - Advanced image and video management

### **State Management & Data Fetching**

- **TanStack Query (React Query)** - Powerful server state management
- **React Context** - Lightweight client state management
- **Custom Hooks** - Reusable logic abstraction and optimization

### **Development Tools**

- **ESLint** - Code linting and quality enforcement
- **Prettier** - Code formatting for consistent style
- **TypeScript** - Static type checking and IntelliSense
- **Prisma Studio** - Database GUI for data management
- **Vercel** - Zero-config deployment platform

### **Performance & Optimization**

- **Bundle Analyzer** - Monitor and optimize bundle size
- **Image Optimization** - Automatic WebP/AVIF conversion
- **Code Splitting** - Route-based and component-based splitting
- **Caching Strategy** - Multi-level caching for optimal performance
- **Lazy Loading** - On-demand component and image loading

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database
- Cloudinary account
- Clerk account
- Resend account

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/yourusername/matter-portfolio.git
cd matter-portfolio
```

2. **Install dependencies**

```bash
npm install
```

3. **Set up environment variables**

```bash
cp .env.example .env.local
```

Fill in your environment variables:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/portfolio_db"

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/admin
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/admin

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Resend
RESEND_API_KEY=re_...

# App URLs
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

4. **Set up the database**

```bash
npx prisma generate
npx prisma db push
npx prisma db seed
```

5. **Run the development server**

```bash
npm run dev
```

Visit `http://localhost:3000` to see your portfolio!

## 📁 Project Structure

```
├── app/                    # Next.js App Router
│   ├── (auth)/            # Authentication pages
│   ├── admin/             # Admin dashboard pages
│   ├── api/               # API routes
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   ├── admin/            # Admin-specific components
│   └── ...               # Feature components
├── context/              # React Context providers
├── hooks/                # Custom React hooks
├── lib/                  # Utility functions
├── prisma/               # Database schema and migrations
├── types/                # TypeScript type definitions
└── public/               # Static assets
```

## 🎯 Key Features Breakdown

### **Portfolio Sections**

- **Dynamic Hero** with animated text and profession cycling
- **Interactive Timeline** with smooth scroll animations
- **Skill Categories** with proficiency indicators
- **Project Gallery** with filtering and search
- **Certification Tracking** with expiration alerts
- **Contact Integration** with email notifications

### **Admin Capabilities**

- **Content Management** for all portfolio sections
- **File Upload** with drag-and-drop support
- **Real-time Preview** of changes
- **Bulk Operations** for efficient management
- **Analytics Dashboard** with insights
- **Message System** with reply functionality

### **Performance Optimizations**

- **Image Optimization** with Cloudinary
- **Code Splitting** with Next.js
- **Caching Strategy** with React Query
- **Lazy Loading** for better performance
- **SEO Optimization** with meta tags

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy automatically on every push

### Manual Deployment

```bash
npm run build
npm start
```

## 📊 Performance Metrics

- **Bundle Size**: 388 kB (optimized)
- **Build Time**: 8 seconds (fast)
- **Lighthouse Score**: 95+ (excellent)
- **Core Web Vitals**: Optimized
- **SEO Score**: 100/100

## 🎨 Design Features

- **Modern UI/UX** with glassmorphism effects
- **Smooth Animations** with Framer Motion
- **Responsive Design** for all devices
- **Accessibility** compliant (WCAG 2.1)
- **Dark/Light Mode** support
- **Custom Animations** and micro-interactions

## 🔧 Available Scripts

```bash
# Development
npm run dev              # Start development server
npm run build            # Build for production
npm run start            # Start production server

# Code Quality
npm run lint             # Run ESLint
npm run check-unused     # Check for unused packages
npm run remove-unused    # Remove unused packages

# Performance
npm run analyze          # Analyze bundle size
npm run cleanup          # Full cleanup

# Database
npx prisma studio        # Open database GUI
npx prisma generate      # Generate Prisma client
npx prisma db push       # Push schema changes
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [shadcn/ui](https://ui.shadcn.com/) for the beautiful UI components
- [Framer Motion](https://www.framer.com/motion/) for smooth animations
- [Clerk](https://clerk.com/) for authentication
- [Vercel](https://vercel.com/) for hosting and deployment
- [Tailwind CSS](https://tailwindcss.com/) for styling

## 📞 Contact

- **Email**: mahmoud.matter@gmail.com
- **LinkedIn**: [Mahmoud Matter](https://linkedin.com/in/mahmoud-gamal-92)
- **GitHub**: [mahmoudmatter12](https://github.com/mahmoudmatter12)
- **Portfolio**: [matter-portofilio.vercel.app](https://matter-portofilio.vercel.app/)

---

**Built with ❤️ by Mahmoud Matter**
