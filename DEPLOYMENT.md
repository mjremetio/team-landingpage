# 🚀 Portfolio Deployment Guide

## Quick Setup Checklist

### 1. Environment Configuration

Copy `.env.example` to `.env.local` and configure:

```bash
cp .env.example .env.local
```

#### Required Environment Variables

| Variable | Description | How to Get |
|----------|-------------|------------|
| `NEXTAUTH_SECRET` | JWT secret key | Generate with `openssl rand -base64 32` |
| `GITHUB_CLIENT_ID` | GitHub OAuth Client ID | Create GitHub OAuth App |
| `GITHUB_CLIENT_SECRET` | GitHub OAuth Client Secret | From GitHub OAuth App |
| `KV_URL` | Vercel KV connection URL | Create Vercel KV database |
| `KV_REST_API_URL` | Vercel KV REST API URL | From Vercel KV dashboard |
| `KV_REST_API_TOKEN` | Vercel KV REST API token | From Vercel KV dashboard |
| `BLOB_READ_WRITE_TOKEN` | Vercel Blob storage token | Create Vercel Blob storage |
| `RESEND_API_KEY` | Email service API key | Sign up at resend.com |
| `ADMIN_EMAIL` | Your admin email address | Your GitHub email |

### 2. GitHub OAuth Setup

1. Go to GitHub Settings → Developer settings → OAuth Apps
2. Click "New OAuth App"
3. Fill in details:
   - **Application name**: `Portfolio Admin`
   - **Homepage URL**: `http://localhost:3000` (dev) or your domain (prod)
   - **Authorization callback URL**: `http://localhost:3000/api/auth/callback/github`
4. Copy Client ID and Secret to `.env.local`

### 3. Vercel Services Setup

Install Vercel CLI:
```bash
npm i -g vercel
vercel login
```

Create Vercel KV database:
```bash
vercel kv create portfolio-kv
```

Create Vercel Blob storage:
```bash
vercel blob create portfolio-blob
```

Copy the connection details to your `.env.local` file.

### 4. Email Service Setup

1. Sign up at [resend.com](https://resend.com) (100 emails/day free)
2. Verify your domain or use `resend.dev` for testing
3. Generate API key and add to `.env.local`

### 5. Development Setup

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Visit:
- **Portfolio**: http://localhost:3000
- **Admin Panel**: http://localhost:3000/admin

### 6. Production Deployment

#### Deploy to Vercel

1. Push your code to GitHub
2. Connect repository to Vercel
3. Add environment variables in Vercel dashboard
4. Update GitHub OAuth callback URL to production domain
5. Deploy!

#### Post-Deployment Setup

1. Visit `/admin` and sign in with GitHub
2. Update all content sections through the admin panel
3. Add your first projects with images
4. Test contact form functionality

## 🔧 Local Development

### Project Structure

```
src/
├── app/                    # Next.js pages
│   ├── (admin)/           # Admin panel
│   ├── api/               # API routes
│   └── page.tsx           # Homepage
├── components/
│   ├── admin/             # Admin components
│   ├── public/            # Public components
│   └── ui/                # UI components
├── lib/                   # Utilities
└── types/                 # TypeScript types
```

### Key Features

✅ **Authentication**: GitHub OAuth with admin-only access
✅ **Database**: Vercel KV (Redis) for all data storage
✅ **File Storage**: Vercel Blob for image uploads
✅ **Email**: Resend API for contact form
✅ **Admin Panel**: Complete content management system
✅ **Responsive**: Mobile-first design
✅ **Theme Support**: Dark/light mode with system detection
✅ **SEO Optimized**: Meta tags and sitemap ready

### Admin Panel Features

- **Dashboard**: Overview of projects and content
- **Project Management**: CRUD operations with image upload
- **Content Sections**: Edit hero, about, tools, contact, footer
- **File Upload**: Direct integration with Vercel Blob
- **Real-time Updates**: Changes appear immediately on live site

## 🚨 Troubleshooting

### Common Issues

**Environment Variables Not Working**
- Ensure all variables are set in Vercel dashboard
- Check for typos in variable names
- Restart development server after changes

**GitHub OAuth Errors**
- Verify callback URL matches exactly
- Check client ID and secret are correct
- Ensure admin email is set correctly

**Database Connection Issues**
- Confirm KV database is created and active
- Check connection URLs and tokens
- Verify network connectivity

**Email Not Sending**
- Verify Resend API key is valid
- Check domain verification status
- Test with resend.dev domain first

**Build Errors**
- Run `npm run build` locally first
- Check for TypeScript errors
- Verify all imports are correct

### Support

If you encounter issues:
1. Check the browser console for errors
2. Verify environment variables are set
3. Test API endpoints directly
4. Review Vercel deployment logs

## 🎯 Next Steps

After successful deployment:

1. **Customize Content**: Use admin panel to update all sections
2. **Add Projects**: Upload your portfolio projects with images
3. **Test Contact Form**: Verify email delivery works
4. **SEO Optimization**: Add your domain and update meta tags
5. **Analytics**: Consider adding Vercel Analytics
6. **Custom Domain**: Set up your custom domain in Vercel

## 📊 Performance

The application is optimized for:
- **Core Web Vitals**: Excellent scores on all metrics
- **Mobile Performance**: Responsive and fast on all devices
- **SEO**: Proper meta tags and semantic HTML
- **Accessibility**: WCAG 2.1 AA compliance
- **Loading Speed**: Optimized images and code splitting

---

🎉 **Congratulations!** Your modern portfolio with admin panel is ready to showcase your work professionally.