# Manual Actions Checklist

Complete these items before automation can run. Each item blocks specific automation.

---

## 1. DigitalOcean Account (Blocks: Terraform)

- [ ] Create DigitalOcean account at https://cloud.digitalocean.com
- [ ] Add payment method (credit card or PayPal)
- [ ] Create API token at https://cloud.digitalocean.com/account/api/tokens
  - Scopes: Read, Write
  - Name: `bhavya-foundation-deploy`

## 2. SSH Key (Blocks: Terraform, Server Setup)

Generate an SSH key pair for deployment:

```bash
ssh-keygen -t ed25519 -f ~/.ssh/bhavya-deploy -N ""
```

- [ ] SSH key generated
- [ ] Public key added to DigitalOcean account at https://cloud.digitalocean.com/account/security

## 3. Domain Name (Blocks: DNS)

- [ ] Purchase domain `bhavya.foundation` (or use existing)
- [ ] Update nameservers to DigitalOcean:
  ```
  ns1.digitalocean.com
  ns2.digitalocean.com
  ns3.digitalocean.com
  ```

## 4. GitHub Secrets (Blocks: CD Pipeline)

Add these secrets to your GitHub repository at Settings → Secrets → Actions:

| Secret | How to get |
|--------|-----------|
| `STAGING_SSH_KEY` | `cat ~/.ssh/bhavya-deploy` |
| `STAGING_HOST` | *(leave empty — filled after Terraform)* |
| `DO_API_TOKEN` | DigitalOcean API token |

## 5. Terraform Apply (Blocks: Everything)

```bash
cd terraform
terraform init
terraform apply \
  -var="do_token=YOUR_DO_API_TOKEN" \
  -var="pvt_key=~/.ssh/bhavya-deploy"
```

After apply, update GitHub secret `STAGING_HOST` with the output IP.

## 6. Environment Configuration (Blocks: App Startup)

SSH into the server and configure:

```bash
ssh deploy@<SERVER_IP>
cd /opt/bhavya
nano .env
```

Required values:

| Variable | Description |
|----------|-------------|
| `SECRET_KEY` | Generate: `openssl rand -hex 32` |
| `JWT_SECRET` | Generate: `openssl rand -hex 32` |
| `COOKIE_SECRET` | Generate: `openssl rand -hex 32` |

## 7. SSL Certificate (Blocks: HTTPS)

After DNS propagates (up to 48 hours):

```bash
ssh deploy@<SERVER_IP>
cd /opt/bhavya
bash scripts/setup-ssl.sh staging.bhavya.foundation admin@bhavya.foundation
```

## 8. First Deployment (Blocks: Validation)

Push to main to trigger CD:

```bash
git push origin main
```

Or deploy manually:

```bash
ssh deploy@<SERVER_IP>
cd /opt/bhavya
docker compose -f docker/compose.staging.yml up -d
```

## 9. Monitoring Setup (Blocks: Observability)

After first deployment:

1. Access monitoring at `http://<SERVER_IP>:3004`
2. Create admin account
3. Add monitors:
   - Website: `https://staging.bhavya.foundation`
   - API: `https://staging.bhavya.foundation/api/health`
   - Admin: `https://staging.bhavya.foundation/admin/`

---

## Summary

| # | Action | Blocks | Est. Time |
|---|--------|--------|-----------|
| 1 | DigitalOcean account | Terraform | 5 min |
| 2 | SSH key | Terraform | 2 min |
| 3 | Domain nameservers | DNS | 0-48 hours |
| 4 | GitHub secrets | CD Pipeline | 5 min |
| 5 | Terraform apply | Server | 5 min |
| 6 | Environment config | App startup | 5 min |
| 7 | SSL certificate | HTTPS | 5 min |
| 8 | First deployment | Validation | 10 min |
| 9 | Monitoring setup | Observability | 10 min |

**Total manual time:** ~45 minutes (plus DNS propagation wait)
