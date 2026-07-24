import Sidebar from "@/components/Sidebar";
import {
  Home, Users, Shield, FileText, BarChart3, Settings, Search,
  Bell, Mail, Calendar, MapPin, Phone, Globe, Lock, Unlock,
  Eye, EyeOff, Edit, Trash2, Plus, Minus, Check, X, AlertTriangle,
  Info, HelpCircle, ChevronDown, ChevronRight, ArrowLeft, ArrowRight,
  Download, Upload, Share, Copy, RefreshCw, ExternalLink, Link,
  Image, Video, Music, File, Folder, Database, Server, Wifi,
  Cpu, HardDrive, Monitor, Smartphone, Tablet, Laptop,
} from "lucide-react";

const iconGroups = [
  {
    name: "Navigation",
    icons: [
      { Icon: Home, name: "Home" },
      { Icon: ChevronDown, name: "ChevronDown" },
      { Icon: ChevronRight, name: "ChevronRight" },
      { Icon: ArrowLeft, name: "ArrowLeft" },
      { Icon: ArrowRight, name: "ArrowRight" },
      { Icon: ExternalLink, name: "ExternalLink" },
      { Icon: Link, name: "Link" },
    ],
  },
  {
    name: "Actions",
    icons: [
      { Icon: Edit, name: "Edit" },
      { Icon: Trash2, name: "Trash2" },
      { Icon: Plus, name: "Plus" },
      { Icon: Minus, name: "Minus" },
      { Icon: Check, name: "Check" },
      { Icon: X, name: "X" },
      { Icon: Download, name: "Download" },
      { Icon: Upload, name: "Upload" },
      { Icon: Share, name: "Share" },
      { Icon: Copy, name: "Copy" },
      { Icon: RefreshCw, name: "RefreshCw" },
    ],
  },
  {
    name: "Status",
    icons: [
      { Icon: Check, name: "Check" },
      { Icon: AlertTriangle, name: "AlertTriangle" },
      { Icon: Info, name: "Info" },
      { Icon: HelpCircle, name: "HelpCircle" },
      { Icon: X, name: "X" },
    ],
  },
  {
    name: "Content",
    icons: [
      { Icon: FileText, name: "FileText" },
      { Icon: File, name: "File" },
      { Icon: Folder, name: "Folder" },
      { Icon: Image, name: "Image" },
      { Icon: Video, name: "Video" },
      { Icon: Music, name: "Music" },
    ],
  },
  {
    name: "Communication",
    icons: [
      { Icon: Mail, name: "Mail" },
      { Icon: Phone, name: "Phone" },
      { Icon: Bell, name: "Bell" },
      { Icon: Users, name: "Users" },
      { Icon: Globe, name: "Globe" },
      { Icon: Share, name: "Share" },
    ],
  },
  {
    name: "System",
    icons: [
      { Icon: Settings, name: "Settings" },
      { Icon: Search, name: "Search" },
      { Icon: Database, name: "Database" },
      { Icon: Server, name: "Server" },
      { Icon: Wifi, name: "Wifi" },
      { Icon: Cpu, name: "Cpu" },
      { Icon: HardDrive, name: "HardDrive" },
      { Icon: Lock, name: "Lock" },
      { Icon: Unlock, name: "Unlock" },
    ],
  },
  {
    name: "Devices",
    icons: [
      { Icon: Monitor, name: "Monitor" },
      { Icon: Smartphone, name: "Smartphone" },
      { Icon: Tablet, name: "Tablet" },
      { Icon: Laptop, name: "Laptop" },
    ],
  },
  {
    name: "Maps & Location",
    icons: [
      { Icon: MapPin, name: "MapPin" },
      { Icon: Calendar, name: "Calendar" },
      { Icon: Eye, name: "Eye" },
      { Icon: EyeOff, name: "EyeOff" },
    ],
  },
];

const sizes = [12, 16, 20, 24, 32, 48];

export default function IconsPage() {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 ml-64 p-8 lg:p-12">
        <div className="max-w-4xl">
          <h1 className="text-3xl font-bold tracking-tight mb-2">Icons</h1>
          <p className="text-lg text-[var(--text-muted)] mb-12">
            Lucide React icon library with size variants and usage guidelines.
          </p>

          <div className="mb-8 p-4 rounded-xl bg-[var(--bg-subtle)] border border-[var(--border)]">
            <h2 className="text-sm font-medium mb-2">Installation</h2>
            <code className="text-sm font-mono">pnpm add lucide-react</code>
          </div>

          <div className="mb-8">
            <h2 className="text-lg font-semibold mb-3">Size Variants</h2>
            <div className="flex items-end gap-4">
              {sizes.map((size) => (
                <div key={size} className="text-center">
                  <Home size={size} className="text-[var(--primary)]" />
                  <span className="text-xs text-[var(--text-muted)] mt-1 block">{size}px</span>
                </div>
              ))}
            </div>
          </div>

          {iconGroups.map((group) => (
            <section key={group.name} className="mb-12">
              <h2 className="text-lg font-semibold mb-4">{group.name}</h2>
              <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
                {group.icons.map(({ Icon, name }) => (
                  <div
                    key={name}
                    className="flex flex-col items-center gap-2 p-3 rounded-lg border border-[var(--border)] bg-[var(--surface)] hover:bg-[var(--surface-hover)] transition-colors"
                  >
                    <Icon size={20} className="text-[var(--text)]" />
                    <span className="text-xs text-[var(--text-muted)] text-center">{name}</span>
                  </div>
                ))}
              </div>
            </section>
          ))}

          <section className="mb-12">
            <h2 className="text-lg font-semibold mb-4">Usage</h2>
            <div className="code-block">
{`import { Home, Settings, Users } from "lucide-react";

// Basic usage
<Home size={24} />

// With custom className
<Settings size={20} className="text-[var(--primary)]" />

// In a button
<button>
  <Users size={16} />
  <span>Team</span>
</button>`}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
