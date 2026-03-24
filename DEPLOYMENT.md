# BYD DM-i Cost Calculator - Deployment Guide

This document provides instructions for deploying the BYD DM-i vs Fuel Car Cost Calculator to various hosting platforms.

## Project Overview

The calculator is a static website with:
- HTML, CSS, and JavaScript files
- No server-side dependencies
- No database requirements
- All libraries hosted locally

## Deployment Options

### Option 1: GitHub Pages (Recommended for Free Hosting)

#### Steps:
1. **Create a GitHub repository**
   ```bash
   # Initialize git repository
   git init
   git add .
   git commit -m "Initial commit: BYD DM-i Cost Calculator"
   ```

2. **Create GitHub repository and push code**
   ```bash
   # Add remote origin (replace with your repository URL)
   git remote add origin https://github.com/yourusername/byd-dmi-calculator.git
   git branch -M main
   git push -u origin main
   ```

3. **Enable GitHub Pages**
   - Go to repository Settings → Pages
   - Select "Deploy from a branch"
   - Choose "main" branch and "/ (root)" folder
   - Click "Save"

4. **Access your site**
   - Your site will be available at: `https://yourusername.github.io/byd-dmi-calculator/`
   - Wait a few minutes for the first deployment

### Option 2: Netlify (Easy Drag & Drop)

#### Steps:
1. **Go to [Netlify](https://www.netlify.com/)**
2. **Drag and drop** the project folder to the Netlify dashboard
3. **Automatic deployment** - Netlify will:
   - Detect it's a static site
   - Configure build settings automatically
   - Deploy to a Netlify subdomain
4. **Custom domain** (optional):
   - Go to Site settings → Domain management
   - Add custom domain
   - Configure DNS settings with your domain provider

### Option 3: Vercel

#### Steps:
1. **Import repository** to Vercel
2. **Configure project**:
   - Framework preset: "Static"
   - Build command: (leave empty)
   - Output directory: `.` (root)
3. **Deploy** - Vercel will provide a `.vercel.app` domain

### Option 4: AWS S3 + CloudFront (Production Grade)

#### Steps:
1. **Create S3 bucket**
   ```bash
   # Using AWS CLI
   aws s3 mb s3://byd-dmi-calculator --region ap-southeast-1
   ```

2. **Enable static website hosting**
   ```bash
   aws s3 website s3://byd-dmi-calculator --index-document index.html --error-document error.html
   ```

3. **Upload files**
   ```bash
   aws s3 sync . s3://byd-dmi-calculator --exclude ".git/*" --exclude "*.md"
   ```

4. **Configure CloudFront** (for HTTPS and CDN)
   - Create CloudFront distribution
   - Origin: S3 bucket
   - Viewer protocol policy: "Redirect HTTP to HTTPS"
   - Default root object: `index.html`

5. **Set bucket policy** for public access
   ```json
   {
       "Version": "2012-10-17",
       "Statement": [{
           "Sid": "PublicReadGetObject",
           "Effect": "Allow",
           "Principal": "*",
           "Action": "s3:GetObject",
           "Resource": "arn:aws:s3:::byd-dmi-calculator/*"
       }]
   }
   ```

## Configuration for Production

### 1. Update Base URL for QR Codes
If deploying to a custom domain, update the QR code generation:

```javascript
// In script.js, update QRCodeGenerator class
generateQRCode() {
    const container = document.getElementById('qrcode');
    if (!container) return;

    // Use absolute URL for production
    const url = 'https://your-domain.com'; // Replace with actual domain
    // ... rest of the code
}
```

### 2. Enable HTTPS
- **Essential** for QR code scanning (many devices block HTTP URLs)
- All recommended platforms (GitHub Pages, Netlify, Vercel, CloudFront) provide HTTPS automatically

### 3. Configure Caching
Add cache headers for better performance:

```html
<!-- In .htaccess for Apache -->
<FilesMatch "\.(html|htm)$">
    Header set Cache-Control "max-age=3600, must-revalidate"
</FilesMatch>

<FilesMatch "\.(css|js)$">
    Header set Cache-Control "max-age=31536000, immutable"
</FilesMatch>

<FilesMatch "\.(png|jpg|jpeg|gif|ico|svg)$">
    Header set Cache-Control "max-age=31536000, public"
</FilesMatch>
```

### 4. Add Analytics (Optional)
Add Google Analytics or other tracking:

```html
<!-- In index.html, before closing </head> -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

## Performance Optimization

### 1. Minify Assets (For Production)
```bash
# Install minification tools
npm install -g uglify-js clean-css-cli

# Minify JavaScript
uglifyjs script.js -o script.min.js --compress --mangle

# Minify CSS
cleancss -o style.min.css style.css
```

### 2. Optimize Images
```bash
# Convert images to WebP format
cwebp image.png -o image.webp

# Optimize PNGs
optipng -o7 image.png

# Optimize JPEGs
jpegoptim --max=85 image.jpg
```

### 3. Enable Compression
- **Netlify/Vercel**: Automatic gzip/Brotli compression
- **Apache**: Enable mod_deflate
- **Nginx**: Enable gzip compression

## Monitoring and Maintenance

### 1. Uptime Monitoring
- Use [UptimeRobot](https://uptimerobot.com/) (free)
- Set up alerts for downtime

### 2. Error Tracking
- Use [Sentry](https://sentry.io/) for JavaScript errors
- Free tier available

### 3. Performance Monitoring
- [Google PageSpeed Insights](https://pagespeed.web.dev/)
- [WebPageTest](https://www.webpagetest.org/)

### 4. Regular Updates
- Update third-party libraries periodically
- Test on new browser versions
- Verify calculation formulas remain accurate

## Troubleshooting

### Common Issues:

#### 1. QR Code Not Scanning
- **Cause**: HTTP URL (many devices block non-HTTPS)
- **Solution**: Deploy with HTTPS enabled

#### 2. Charts Not Displaying
- **Cause**: Chart.js library not loading
- **Solution**: Check browser console for errors, verify library path

#### 3. Language Switching Not Working
- **Cause**: Translation files not found
- **Solution**: Check network tab for 404 errors on locale files

#### 4. Mobile Layout Issues
- **Cause**: Viewport meta tag missing or incorrect
- **Solution**: Ensure `<meta name="viewport">` is present

#### 5. Calculation Errors
- **Cause**: JavaScript errors or invalid input
- **Solution**: Check browser console, test with valid parameters

### Debugging Steps:
1. Open browser Developer Tools (F12)
2. Check Console tab for errors
3. Check Network tab for failed requests
4. Test with different browsers
5. Test on mobile devices

## Security Considerations

### 1. Input Validation
- The calculator validates all numeric inputs
- Prevents negative values where inappropriate
- Handles edge cases gracefully

### 2. XSS Protection
- No user-generated content stored
- All text is static or from trusted JSON files
- No eval() or dangerous JavaScript functions

### 3. Privacy
- No tracking by default
- No cookies set
- No personal data collected
- All calculations done client-side

### 4. HTTPS Enforcement
- Critical for QR code functionality
- Prevents man-in-the-middle attacks
- Required for modern browser features

## Backup Strategy

### 1. Code Backup
- Use Git repository (already implemented)
- Regular commits with descriptive messages
- Remote repository on GitHub/GitLab

### 2. Configuration Backup
- Keep deployment configuration files
- Document any manual setup steps
- Store credentials securely (use environment variables)

### 3. Data Backup
- No database to backup
- Translation files are in Git
- Keep copies of any custom images/assets

## Scaling Considerations

The application is inherently scalable because:
- Static files only
- No server-side processing
- CDN-friendly architecture
- No database queries

For high traffic:
1. Use CDN (CloudFront, Cloudflare)
2. Enable caching aggressively
3. Monitor bandwidth usage
4. Consider edge computing for dynamic features (if added later)

## Contact and Support

For issues with deployment:
1. Check this documentation
2. Review browser console errors
3. Test locally first
4. Contact development team if issues persist

## Changelog

### Version 1.0.0 (Initial Release)
- Basic cost calculation functionality
- Indonesian and English language support
- Responsive design for mobile/desktop
- QR code generation for sharing
- Chart visualization of results
- Input validation and error handling

### Future Enhancements Planned:
1. More language support
2. Additional vehicle models
3. Export functionality (PDF/Excel)
4. Offline PWA capabilities
5. API integration for real-time fuel/electricity prices

---

**Deployment Complete!** 🎉

Your BYD DM-i Cost Calculator is now ready for users in Indonesia to compare vehicle costs easily via QR code scanning.