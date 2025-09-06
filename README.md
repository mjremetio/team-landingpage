# Portfolio Admin - Modern Portfolio with Content Management

A modern, responsive portfolio website with a complete admin panel for content management. Built with Next.js 14, TypeScript, Tailwind CSS, and deployed on Vercel.

## ✨ Features

### Public Portfolio
- **Modern Design**: Clean, professional design with dark/light theme support
- **Responsive Layout**: Mobile-first design that works on all devices
- **Dynamic Content**: All content is manageable through the admin panel
- **SEO Optimized**: Built-in SEO optimization with meta tags
- **Performance**: Optimized images, lazy loading, and efficient caching

### Admin Panel
- **Secure Authentication**: GitHub OAuth integration
- **Project Management**: Full CRUD operations for portfolio projects
- **Content Editor**: Rich content editor for all website sections
- **File Upload**: Image and document upload with Vercel Blob storage
- **Real-time Preview**: See changes immediately on the live site

### Technical Stack
- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS
- **UI Components**: Shadcn/ui component library
- **Database**: Vercel KV (Redis)
- **Authentication**: NextAuth.js with GitHub OAuth
- **File Storage**: Vercel Blob Storage
- **Email**: Resend API for contact forms
- **Deployment**: Vercel (completely free tier)

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- GitHub account (for OAuth)
- Vercel account (free tier)

### 1. Clone and Install
```bash
git clone <your-repo-url>
cd team-portfolio
npm install
```

### 2. Environment Setup
Copy the example environment file:
```bash
cp .env.example .env.local
```

Fill in your environment variables in `.env.local`:

#### NextAuth Configuration
```env
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here
```

#### GitHub OAuth Setup
1. Go to GitHub Settings > Developer settings > OAuth Apps
2. Create a new OAuth App:
   - Application name: `Portfolio Admin`
   - Homepage URL: `http://localhost:3000`
   - Authorization callback URL: `http://localhost:3000/api/auth/callback/github`
3. Copy the Client ID and Secret to your `.env.local`

#### Vercel Services
Install Vercel CLI and create services:
```bash
npm i -g vercel
vercel login
vercel kv create portfolio-kv
vercel blob create portfolio-blob
```

Add the provided URLs and tokens to your `.env.local`

#### Email Service (Resend)
1. Sign up at [resend.com](https://resend.com) (free tier: 100 emails/day)
2. Get your API key and add to `.env.local`

#### Admin Access
Set your GitHub email as the admin email in `.env.local`

### 3. Run Development Server
```bash
npm run dev
```

Visit `http://localhost:3000` to see your portfolio and `http://localhost:3000/admin` to access the admin panel.

## 📁 Project Structure

```
src/
├── app/                     # Next.js App Router
│   ├── (admin)/            # Admin panel routes
│   ├── api/                # API routes
│   └── page.tsx            # Homepage
├── components/
│   ├── ui/                 # Shadcn/ui components
│   ├── admin/              # Admin-specific components
│   └── public/             # Public-facing components
├── lib/                    # Utilities and database
├── types/                  # TypeScript definitions
└── middleware.ts           # Route protection
```

## 🎯 Usage

### Admin Panel Features

#### Dashboard
- Overview of projects and content sections
- Quick action buttons for common tasks
- Recent activity and statistics

#### Project Management
- Create, edit, and delete projects
- Upload project images and files
- Set featured projects for homepage
- Organize by categories and tags

#### Content Sections
- **Hero Section**: Main landing area with title, subtitle, and CTA
- **About Section**: Biography, skills, and experience
- **Tools Section**: Technologies and proficiency levels
- **Contact Section**: Contact information and form settings
- **Footer Section**: Links and copyright information

## 🚀 Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Update GitHub OAuth callback URL for production
5. Deploy!

### Post-Deployment Setup
1. Visit `/admin` and sign in with GitHub
2. Customize all content sections
3. Add your first projects
4. Test the contact form

## 🔧 Customization

### Theme Colors
Edit `src/app/globals.css` to customize colors and styling.

### Components
All components are modular and easily customizable in `src/components/`.

### Database Schema
Modify `src/lib/db.ts` to add new content types or fields.

## 🔒 Security Features

- Admin access restricted to specified GitHub email
- Protected API routes with middleware
- Input validation and file upload restrictions
- Secure authentication with NextAuth.js

## 📊 Performance

- Image optimization with Next.js
- Code splitting and lazy loading
- Edge caching with Vercel
- Optimized database queries

## 🆘 Troubleshooting

1. **Environment Variables**: Ensure all required variables are set
2. **OAuth Errors**: Verify GitHub OAuth app configuration
3. **Database Issues**: Check Vercel KV connection
4. **Email Problems**: Verify Resend API key

## 🗺️ Roadmap

- [ ] Analytics dashboard
- [ ] Blog system
- [ ] Multi-language support
- [ ] Advanced SEO features
- [ ] Comments system

---

Built with ❤️ using modern web technologies. Perfect for developers, designers, and professionals who want a beautiful portfolio with easy content management.
