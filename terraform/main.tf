# ============================================================
# Bhavya Foundation — Terraform Configuration
# Provider: DigitalOcean
# Usage: terraform init && terraform plan && terraform apply
# ============================================================

terraform {
  required_version = ">= 1.0"

  required_providers {
    digitalocean = {
      source  = "digitalocean/digitalocean"
      version = "~> 2.0"
    }
  }

  backend "local" {
    path = "terraform.tfstate"
  }
}

# ----------------------------------------------------------
# Variables
# ----------------------------------------------------------

variable "do_token" {
  description = "DigitalOcean API token"
  type        = string
  sensitive   = true
}

variable "pvt_key" {
  description = "Path to SSH private key"
  type        = string
  default     = "~/.ssh/id_rsa"
}

variable "domain_name" {
  description = "Domain name for the platform"
  type        = string
  default     = "bhavya.foundation"
}

variable "staging_subdomain" {
  description = "Staging subdomain"
  type        = string
  default     = "staging"
}

variable "droplet_size" {
  description = "Droplet size"
  type        = string
  default     = "s-2vcpu-4gb"  # $24/mo — 2 vCPU, 4GB RAM, 80GB SSD
}

variable "region" {
  description = "DigitalOcean region"
  type        = string
  default     = "blr1"  # Bangalore — closest to India
}

variable "ubuntu_version" {
  description = "Ubuntu image version"
  type        = string
  default     = "22.04"
}

# ----------------------------------------------------------
# Provider
# ----------------------------------------------------------

provider "digitalocean" {
  token = var.do_token
}

# ----------------------------------------------------------
# SSH Key
# ----------------------------------------------------------

resource "digitalocean_ssh_key" "bhavya" {
  name       = "bhavya-foundation-deploy"
  public_key = file("${var.pvt_key}.pub")
}

# ----------------------------------------------------------
# Droplet (Server)
# ----------------------------------------------------------

resource "digitalocean_droplet" "bhavya" {
  name   = "bhavya-foundation-${var.staging_subdomain}"
  region = var.region
  size   = var.droplet_size
  image  = "ubuntu-${var.ubuntu_version}-x64"

  ssh_keys = [digitalocean_ssh_key.bhavya.fingerprint]

  user_data = templatefile("${path.module}/cloud-init.yaml", {
    domain     = var.domain_name
    subdomain  = var.staging_subdomain
  })

  tags = ["bhavya-foundation", "staging", "web"]

  lifecycle {
    create_before_destroy = true
  }
}

# ----------------------------------------------------------
# Floating IP (for zero-downtime swaps)
# ----------------------------------------------------------

resource "digitalocean_floating_ip" "bhavya" {
  region = var.region
}

resource "digitalocean_floating_ip_assignment" "bhavya" {
  ip_address = digitalocean_floating_ip.bhavya.ip_address
  droplet_id = digitalocean_droplet.bhavya.id
}

# ----------------------------------------------------------
# Firewall
# ----------------------------------------------------------

resource "digitalocean_firewall" "bhavya" {
  name = "bhavya-foundation-staging"

  droplet_ids = [digitalocean_droplet.bhavya.id]

  # SSH
  inbound_rule {
    protocol         = "tcp"
    port_range       = "22"
    source_addresses = ["0.0.0.0/0", "::/0"]
  }

  # HTTP
  inbound_rule {
    protocol         = "tcp"
    port_range       = "80"
    source_addresses = ["0.0.0.0/0", "::/0"]
  }

  # HTTPS
  inbound_rule {
    protocol         = "tcp"
    port_range       = "443"
    source_addresses = ["0.0.0.0/0", "::/0"]
  }

  # ICMP (ping)
  inbound_rule {
    protocol         = "icmp"
    source_addresses = ["0.0.0.0/0", "::/0"]
  }

  # Outbound — allow all
  outbound_rule {
    protocol              = "tcp"
    port_range            = "1-65535"
    destination_addresses = ["0.0.0.0/0", "::/0"]
  }

  outbound_rule {
    protocol              = "udp"
    port_range            = "1-65535"
    destination_addresses = ["0.0.0.0/0", "::/0"]
  }

  outbound_rule {
    protocol              = "icmp"
    destination_addresses = ["0.0.0.0/0", "::/0"]
  }
}

# ----------------------------------------------------------
# Domain DNS
# ----------------------------------------------------------

resource "digitalocean_domain" "bhavya" {
  name = var.domain_name
}

resource "digitalocean_record" "staging_a" {
  domain = digitalocean_domain.bhavya.name
  type   = "A"
  name   = var.staging_subdomain
  value  = digitalocean_floating_ip.bhavya.ip_address
  ttl    = 300
}

resource "digitalocean_record" "www" {
  domain = digitalocean_domain.bhavya.name
  type   = "A"
  name   = "www"
  value  = digitalocean_floating_ip.bhavya.ip_address
  ttl    = 300
}

# ----------------------------------------------------------
# Outputs
# ----------------------------------------------------------

output "droplet_id" {
  value = digitalocean_droplet.bhavya.id
}

output "droplet_ipv4" {
  value = digitalocean_droplet.bhavya.ipv4_address
}

output "floating_ip" {
  value = digitalocean_floating_ip.bhavya.ip_address
}

output "staging_url" {
  value = "https://${var.staging_subdomain}.${var.domain_name}"
}

output "ssh_command" {
  value = "ssh root@${digitalocean_floating_ip.bhavya.ip_address}"
}
