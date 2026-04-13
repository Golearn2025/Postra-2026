# Deploy Checklist

## Pre-Deployment Setup

### Environment Variables
- [ ] `.env.local` has all required variables
- [ ] `.env.production` has production values
- [ ] Supabase URL and keys are correct
- [ ] Next.js environment variables are set

### Local Quality Checks
- [ ] `npm install` - Install dependencies
- [ ] `npm run lint` - ESLint passes (no errors)
- [ ] `npm run typecheck` - TypeScript compiles
- [ ] `npm run build` - Production build succeeds

### Manual Smoke Test
Run locally and test these flows:

#### Authentication & Organization
- [ ] Login works correctly
- [ ] Organization switching works
- [ ] User context loads properly

#### Core Features
- [ ] Dashboard loads and shows data
- [ ] Campaigns list loads
- [ ] Campaign creation/editing works
- [ ] Media library loads and displays assets
- [ ] Media upload works
- [ ] Posts/Calendar view loads
- [ ] Campaign planner works

#### Navigation
- [ ] All main navigation links work
- [ ] Sidebar navigation functional
- [ ] Breadcrumbs work correctly

## Deployment to Render

### Render Configuration
- [ ] Build command: `npm run build`
- [ ] Start command: `npm start`
- [ ] Environment variables set in Render
- [ ] Build passes on Render

### Post-Deployment Verification
- [ ] Site loads in production
- [ ] Authentication works
- [ ] Database connectivity works
- [ ] All core features functional

## Troubleshooting

### Common Issues
- **Build fails**: Check for TypeScript/ESLint errors locally
- **Env vars missing**: Verify Render environment variables
- **Database issues**: Check Supabase connection
- **Static assets**: Verify file paths and imports

### Quick Commands
```bash
# Full quality check
npm run check

# Individual checks
npm run lint
npm run typecheck
npm run build

# Test specific features
npm run dev
```

## Notes
- Always run `npm run check` before pushing
- Husky pre-push hook will automatically run quality checks
- If pre-push fails, fix issues locally before pushing again
