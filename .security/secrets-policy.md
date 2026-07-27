# Security: Secrets Policy

## Allowed Secrets

- `VERCEL_TOKEN`: Deployment token
- `NEXTAUTH_SECRET`: Authentication secret
- `DATABASE_URL`: Database connection string
- `SUPABASE_SERVICE_ROLE_KEY`: Supabase service role
- `RESEND_API_KEY`: Email service API key

## Prohibited Secrets

- API keys in source code
- Passwords in documentation
- Tokens in chat history
- Private keys in repository

## Secret Management

1. Use Vercel Environment Variables
2. Never commit secrets to git
3. Rotate secrets quarterly
4. Audit access monthly

## Emergency Response

1. Detect unauthorized access
2. Revoke compromised secrets
3. Generate new secrets
4. Update all systems
5. Document incident
