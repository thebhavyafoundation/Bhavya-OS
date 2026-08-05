# Lesson: Software Installation

**Duration:** 2 hours (2 × 45-minute sessions + 30-minute lab)
**Grade:** 9 | **Subject:** Digital Literacy
**Prerequisites:** KP-003: File Management

---

## Section 1: What Is Software? (20 minutes)

### Learning Goal
Understand the fundamental difference between hardware and software, and identify the two main categories of software.

### Content

A computer is made of two parts: **hardware** (the physical components you can touch) and **software** (the instructions that tell the hardware what to do). Without software, even the most powerful computer is just an expensive paperweight.

Software falls into two major categories:

**System Software** — This is the software that makes the computer work. It includes:
- **Operating Systems** (Windows, macOS, Linux) that manage all hardware resources
- **Utilities** like antivirus programs, disk cleanup tools, and file managers
- **Device Drivers** that let the operating system communicate with printers, keyboards, and other hardware

**Application Software** — This is the software you use to accomplish tasks. It includes:
- **Productivity Tools** like Microsoft Word, Google Sheets, and PowerPoint
- **Creative Software** like Adobe Photoshop, Audacity, and Blender
- **Communication Apps** like WhatsApp, Zoom, and Gmail
- **Entertainment** like games, music players, and video players

### Key Insight
Every program on your computer is either keeping the system running (system software) or helping you do something specific (application software). Understanding this distinction helps you know what is safe to remove and what you should never touch.

### Activity
Look at the programs installed on your computer. Classify each one as system software or application software. Create a table with two columns and sort at least 10 programs.

---

## Section 2: Where Does Software Come From? (25 minutes)

### Learning Goal
Identify safe and unsafe sources of software, and understand why source verification matters.

### Content

Not all software sources are equal. The source from which you download software determines whether you get the real program or something harmful.

**Official Websites** — The safest source. Companies host their own installers at their domain. For example, Google Chrome is available at google.com/chrome, and Visual Studio Code is at code.visualstudio.com. Always verify the URL before downloading.

**App Stores** — Centralized, curated platforms that verify software before listing it. Examples include:
- **Microsoft Store** (Windows) — Built into Windows 10 and 11
- **Ubuntu Software Center** (Linux) — Open-source packages verified by Canonical
- **Mac App Store** (macOS) — Apple's curated marketplace

**Package Managers** — Command-line tools that download, install, and update software automatically. Examples include APT (Ubuntu), Chocolatey (Windows), and Homebrew (macOS). They resolve dependencies and verify package integrity.

**Dangerous Sources** — Random download sites, torrent trackers, and ads promising "free" versions of paid software often bundle malware, adware, or modified installers. Even experienced users can be tricked by professional-looking fake sites.

### Key Insight
The golden rule: **only download software from the developer's official website or a verified app store.** If you did not pay for it and it is not open source, ask yourself who did and why they are giving it away.

### Activity
Research three software applications you use regularly. For each one, identify the official download source and write down the exact URL. Compare with a partner to verify accuracy.

---

## Section 3: How Installation Works (25 minutes)

### Learning Goal
Understand the step-by-step process that happens when software is installed on a computer.

### Content

When you install software, the installer program performs several critical steps behind the scenes:

**Step 1: Extraction** — The installer unpacks compressed files (like a zip file) and places them in the correct locations on your hard drive.

**Step 2: File Placement** — Program files go to a specific directory (usually `C:\Program Files` on Windows or `/usr/bin` on Linux), while data files may go to your user folder.

**Step 3: Configuration** — The installer writes settings to the system registry or configuration files. This tells the operating system how to run the program.

**Step 4: Dependencies** — Some software requires other programs to work. The installer downloads and sets up these dependencies automatically (like a Python installer setting up the PATH environment variable).

**Step 5: Shortcut Creation** — Desktop and Start Menu shortcuts are created so you can launch the program easily.

**Step 6: Registration** — The program is registered with the operating system so it appears in the list of installed applications.

### Key Insight
Understanding installation helps you troubleshoot problems. If a program fails to install, you can identify which step failed: was it a permissions issue, a missing dependency, or a disk space problem?

### Activity
Install a simple application (like Notepad++ on Windows or GIMP on Linux). Write down each prompt or dialog box you see during the installation. Map these prompts to the six steps described above.

---

## Section 4: Setting It Up Right (15 minutes)

### Learning Goal
Configure installed software for safe and efficient use through preferences, accounts, and permissions.

### Content

Installation is only the first step. After installing software, you should configure it properly:

**Preferences and Settings** — Most applications have a Settings or Preferences menu where you can customize behavior. Common settings include:
- Default save location for files
- Notification preferences
- Privacy and data sharing options
- Display and accessibility options

**User Accounts** — Many applications require you to create an account. This may involve:
- Setting a username and strong password
- Verifying your email address
- Enabling two-factor authentication when available

**Permissions** — Operating systems control what software can access. You may need to grant:
- File access permissions (so a photo editor can open images)
- Network access (so a browser can connect to the internet)
- Camera and microphone access (for video calls)

### Key Insight
Security-conscious configuration means saying "no" by default. Only grant permissions that the application actually needs. If a calculator app asks for camera access, that is a red flag.

### Activity
Open a recently installed application and explore its Settings menu. List five settings you can change and explain which one you would adjust for better privacy.

---

## Section 5: Staying Updated (15 minutes)

### Learning Goal
Understand why software updates matter and how to manage them effectively.

### Content

Software updates are not optional — they are essential for security and functionality.

**Security Patches** — When researchers discover vulnerabilities in software, developers release patches to close those holes. Hackers actively search for systems running outdated software. A single unpatched vulnerability can lead to data theft, ransomware, or identity fraud.

**Bug Fixes** — Updates fix problems that cause crashes, freezes, or incorrect behavior. If you have experienced a program crashing unexpectedly, an update likely fixes that exact issue.

**Feature Updates** — Some updates add new capabilities, improve performance, or refresh the interface. These are the updates that make your software more useful over time.

**How Updates Work:**
- **Automatic Updates** — Most modern software checks for updates regularly. Enable this whenever possible.
- **Manual Updates** — Some software requires you to check for updates yourself (usually through a Help menu).
- **System Updates** — Your operating system (Windows Update, Ubuntu Software Updater) patches the entire system and all bundled software at once.

### Key Insight
The best security practice for any computer is simple: **turn on automatic updates.** You do not need to think about it — the software protects itself.

### Activity
Check for updates on your computer right now. On Windows, go to Settings > Update & Security > Windows Update. On Linux, run `sudo apt update && sudo apt upgrade` in the terminal. Write down how many updates are available and what they fix.

---

## Section 6: Cleaning Up (10 minutes)

### Learning Goal
Learn the proper procedure for removing software you no longer need.

### Content

Uninstallation is the reverse of installation, but it is often done incorrectly:

**The Right Way:**
1. Use the operating system's built-in uninstaller (Windows: Settings > Apps > Uninstall; Linux: package manager or Software Center)
2. Follow the program's uninstall wizard if one appears
3. Restart your computer to clear any files that were in use

**Why It Matters:**
- **Disk Space** — Old software you never use wastes valuable storage
- **Security** — Unused software with outdated versions creates attack surfaces
- **Performance** — Too many background processes slow your computer down
- **Clutter** — Keeping programs you do not need makes finding the right tools harder

**Cleaning Residual Files:** Some uninstallers leave behind configuration files, cache, or temporary data. You can use dedicated tools (like Revo Uninstaller on Windows or BleachBit on Linux) to remove these leftovers.

### Key Insight
If you have not used a program in six months, you probably do not need it. Regular cleanup keeps your computer fast, secure, and organized.

### Activity
Open your list of installed programs. Identify three applications you have never used or no longer need. Research how to uninstall each one and document the steps.

---

## Summary

Software installation is a core digital literacy skill. You now understand:
- The difference between system software and application software
- How to identify safe download sources
- What happens during the installation process
- How to configure software properly after installation
- Why updates are critical and how to manage them
- How to remove software cleanly

**Next Steps:** Complete the lab exercises to practice real installation, then work on the Software Installation Guide project to build your own reference document.
