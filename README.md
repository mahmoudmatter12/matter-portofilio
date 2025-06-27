# 🚀 Modern Portfolio Website

A comprehensive, full-stack portfolio website built with Next.js 14, featuring a stunning frontend and a powerful admin dashboard for content management.

![Portfolio Preview](https://via.placeholder.com/1200x600/6366f1/ffffff?text=Modern+Portfolio+Website)

## ✨ Features

### 🎨 Frontend Portfolio
- **Hero Section** with animated typewriter effects and dynamic profession display
- **About Section** with interactive elements and smooth animations
- **Timeline** showcasing career journey and milestones
- **Skills Section** with categorized skill display and proficiency levels
- **Certifications** with expiration tracking and status indicators
- **Projects Showcase** with live demos, GitHub links, and technology tags
- **Services** section highlighting offered services
- **Contact Form** with email integration and form validation
- **Responsive Design** optimized for all devices
- **Dark/Light Mode** support with smooth transitions
- **Floating Social Dock** for easy social media access
- **Scroll Progress Indicator** for better user experience
- **Loading Animations** with space-themed loader
- **SEO Optimized** with proper meta tags and structured data

### 🛠️ Admin Dashboard
- **Modern Glassmorphism Design** with gradient backgrounds
- **Comprehensive Content Management** for all portfolio sections
- **Real-time Data Updates** with React Query integration
- **File Upload System** for images, CVs, and documents
- **Development Status Banner** with countdown timer and progress tracking
- **Message Management** with reply functionality and status tracking
- **Analytics Dashboard** with statistics and insights
- **Bulk Operations** for efficient content management
- **Search and Filtering** across all data tables
- **Responsive Admin Interface** optimized for desktop and mobile

### 🔐 Authentication & Security
- **Clerk Authentication** with multiple sign-in options
- **Protected Admin Routes** with middleware protection
- **Role-based Access Control** for admin functionality
- **Secure API Endpoints** with proper validation
- **CSRF Protection** and security headers

### 📊 Database & Storage
- **Prisma ORM** with PostgreSQL database
- **Cloudinary Integration** for image storage and optimization
- **Efficient Data Caching** with React Query
- **Database Migrations** and seeding scripts
- **Optimized Queries** for better performance

## 🛠️ Tech Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe JavaScript
- **React 18** - UI library with latest features
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Animation library
- **shadcn/ui** - Modern UI component library
- **Lucide React** - Beautiful icon library
- **React Hook Form** - Form handling and validation
- **Zod** - Schema validation

### Backend
- **Next.js API Routes** - Serverless API endpoints
- **Prisma** - Modern database toolkit
- **PostgreSQL** - Relational database
- **Clerk** - Authentication and user management
- **Resend** - Email delivery service
- **Cloudinary** - Image and video management

### State Management & Data Fetching
- **TanStack Query (React Query)** - Server state management
- **React Context** - Client state management
- **Custom Hooks** - Reusable logic abstraction

### Development Tools
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **TypeScript** - Static type checking
- **Prisma Studio** - Database GUI
- **Vercel** - Deployment platform

### UI/UX Libraries
- **Framer Motion** - Advanced animations
- **React Intersection Observer** - Scroll-based animations
- **Sonner** - Toast notifications
- **React Dropzone** - File upload handling
- **Date-fns** - Date manipulation
- **Clsx** - Conditional class names

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- PostgreSQL database
- Cloudinary account
- Clerk account
- Resend account

### Installation

1. **Clone the repository**
\`\`\`bash
git clone https://github.com/yourusername/portfolio-website.git
cd portfolio-website
\`\`\`

2. **Install dependencies**
\`\`\`bash
npm install
\`\`\`

3. **Set up environment variables**
\`\`\`bash
cp .env.example .env.local
\`\`\`

Fill in your environment variables:
\`\`\`env
# Database
DATABASE_URL="postgresql://..."

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
\`\`\`

4. **Set up the database**
\`\`\`bash
npx prisma generate
npx prisma db push
npx prisma db seed
\`\`\`

5. **Run the development server**
\`\`\`bash
npm run dev
\`\`\`

Visit `http://localhost:3000` to see your portfolio!

## 📁 Project Structure

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


## 🎯 Key Features Breakdown

### Portfolio Sections
- **Dynamic Hero** with animated text and profession cycling
- **Interactive Timeline** with smooth scroll animations
- **Skill Categories** with proficiency indicators
- **Project Gallery** with filtering and search
- **Certification Tracking** with expiration alerts
- **Contact Integration** with email notifications

### Admin Capabilities
- **Content Management** for all portfolio sections
- **File Upload** with drag-and-drop support
- **Real-time Preview** of changes
- **Bulk Operations** for efficient management
- **Analytics Dashboard** with insights
- **Message System** with reply functionality

### Performance Optimizations
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
\`\`\`bash
npm run build
npm start
\`\`\`

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

- **Email**: your.email@example.com
- **LinkedIn**: [Your LinkedIn Profile](https://linkedin.com/in/yourprofile)
- **GitHub**: [Your GitHub Profile](https://github.com/yourusername)
- **Portfolio**: [Your Portfolio Website](https://yourportfolio.com)

---

⭐ **Star this repository if you found it helpful!**
