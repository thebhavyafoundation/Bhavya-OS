# Lesson: Software Installation

**Duration:** 2 hours (2 x 45-minute sessions + 30-minute lab)
**Grade:** 9 | **Subject:** Digital Literacy
**Prerequisites:** KP-003: File Management

---

## Section 1: What Is Software? (20 minutes)

### Learning Goal
Understand the fundamental difference between hardware and software, and identify the two main categories of software.

### DO: The Paperweight Experiment

Pick up your phone or look at a desktop computer. Touch the screen, the keyboard, the case. These are **hardware** — physical things you can touch. Now ask yourself: what makes it actually do something? That is **software** — invisible instructions that tell the hardware what to do.

Without software, the most powerful computer in the world is an expensive paperweight. Without hardware, software has nowhere to run. They need each other.

### DO: Sort the Software

Open the list of programs on your computer right now. On Windows: Settings > Apps > Installed apps. On Linux: open Software Center. On a Mac: open the Applications folder.

Your task: sort every program into two columns.

| System Software (keeps the computer running) | Application Software (helps you do something) |
|---|---|
| | |
| | |

**Try This:** Count how many are in each column. Which category has more? Why do you think that is?

### Think About It

Your operating system (Windows, Linux, macOS) is system software. Google Chrome is application software. But what about an antivirus program? Is that system software or application software? What about a file manager? Discuss with a partner.

### Teach Someone

Explain to a partner the difference between system software and application software using a cooking analogy. The operating system is the kitchen. Application software is the specific tools you use to cook. What are the utensils? The recipes? The ingredients?

---

## Section 2: Where Does Software Come From? (25 minutes)

### Learning Goal
Identify safe and unsafe sources of software, and understand why source verification matters.

### DO: The Source Investigation

You are going to investigate whether a download source is safe. Follow these steps exactly:

1. Open your web browser
2. Search for "download VLC media player"
3. Look at the first five results. Do NOT click yet
4. For each result, write down: the URL, whether it has an ad label, whether it says "official"

Now answer: which result is actually the official source? How do you know?

**Key fact:** The official VLC site is videolan.org. Every other URL is a third-party portal. Some are safe. Some are not. The only URL you can trust without investigation is the developer's own domain.

### TRY THIS: The Fake Site Challenge

Search for "download free Photoshop." Look at the results. Many sites offer "free" versions of Photoshop, which costs Rs. 16,000+ per year. Ask yourself: why would someone give away software worth that much money? The answer is usually malware.

**The Golden Rule:** If you did not pay for it, and it is not open source, ask yourself who did pay for it and why they are giving it away.

### DO: Source Verification Checklist

For any software you want to install, run through this checklist before downloading:

1. **URL check** — Is this the developer's exact domain? (not a variation)
2. **HTTPS check** — Is there a lock icon in the address bar?
3. **Cross-reference** — Can you find the same software in an app store?
4. **Search check** — Search for "[software name] official site" and compare the URL
5. **Gut check** — Does anything about this page feel off?

### Think About It

Your school IT department blocks certain download sites. Your friend says, "Just use a VPN and download it anyway." What would you say to your friend? Why do schools restrict software installation?

### Real-World Scenario

Your classmate found a website offering Microsoft Office for free. They are about to download it. Write a 3-sentence message to them explaining why this might be dangerous and what they should do instead.

---

## Section 3: How Installation Works (25 minutes)

### Learning Goal
Understand the step-by-step process that happens when software is installed on a computer.

### DO: The Anatomy of an Installer

You are going to install Notepad++ (a safe, free text editor) and document every single thing the installer does.

Before you start, prediction time: What do you think happens when you double-click an installer file? Write down your guess.

Now install Notepad++ from notepad-plus-plus.org. At every screen, stop and write down:
- What the installer is asking you
- What the default option is
- What you chose and why

Map each screen to one of these six steps:

| Step | What Happens | Installer Screen Number |
|------|-------------|----------------------|
| 1. Extraction | Unpacks compressed files | |
| 2. File Placement | Puts files in the right directories | |
| 3. Configuration | Writes settings to the system | |
| 4. Dependencies | Downloads other programs yours needs | |
| 5. Shortcut Creation | Creates desktop/Start Menu links | |
| 6. Registration | Registers with the operating system | |

### TRY THIS: What Happens If...

What happens if you change the installation directory from the default? What happens if you uncheck "Create Desktop Shortcut"? What happens if you deny a permission the installer requests? Experiment and find out.

### Think About It

If a program fails to install and shows an error message, which of the six steps do you think failed? How would you figure out which step it was?

### Teach Someone

Explain to a partner why installers use specific directories like `C:\Program Files` on Windows or `/usr/bin` on Linux instead of just putting files anywhere. What would happen if every program put files wherever it wanted?

---

## Section 4: Setting It Up Right (15 minutes)

### Learning Goal
Configure installed software for safe and efficient use through preferences, accounts, and permissions.

### DO: The Permission Audit

Open the application you just installed. Go to its Settings or Preferences. Your job is to find and document:

1. **Privacy settings** — What data does the app collect? Can you limit it?
2. **Notification settings** — How often will this app interrupt you?
3. **Permission requests** — What parts of your computer can it access?

For each permission, ask: **"Does this app need this to do its job?"**

| Permission | Does it need this? | Your decision |
|-----------|-------------------|---------------|
| File access | | |
| Network access | | |
| Camera | | |
| Microphone | | |
| Location | | |

### TRY THIS: The Red Flag Test

Imagine you just installed a simple calculator app. It asks for permission to access your camera, microphone, and contacts. This is a **red flag**. A calculator has no reason to access any of those. Deny all three.

Now imagine you installed a video calling app. It asks for camera and microphone access. This makes sense. Grant those permissions.

The principle is called **least privilege**: software should only have access to what it needs to function.

### Think About It

Some apps require you to create an account before you can use them. Why do they do this? Is it always in your interest? What data are they collecting when you sign up?

### Real-World Scenario

Your school is installing new software on the computer lab. The software needs to track which students use it and for how long. What permissions would this software reasonably need? What permissions would be excessive?

---

## Section 5: Staying Updated (15 minutes)

### Learning Goal
Understand why software updates matter and how to manage them effectively.

### DO: The Update Investigation

Right now, check for updates on your computer:

- **Windows:** Settings > Update & Security > Windows Update > Check for updates
- **Linux:** Open terminal, run `sudo apt update && sudo apt list --upgradable`
- **Mac:** System Settings > General > Software Update

Write down:
1. How many updates are available?
2. What do they fix? (Read the descriptions)
3. How long has it been since your system was last updated?

### TRY THIS: The WannaCry Experiment

In May 2017, the WannaCry ransomware attacked 200,000 computers across 150 countries. It encrypted files and demanded Bitcoin payment. Hospitals, businesses, and government agencies were locked out of their own data.

Here is the shocking part: Microsoft released a patch for the vulnerability two months earlier. The victims had simply not updated.

Search for "WannaCry ransomware" and find one specific detail about the attack that surprises you. Write it down.

### Think About It

Some people delay updates because they worry updates will break something or slow down their computer. Is this a valid concern? What is the bigger risk: installing an update or skipping it?

### DO: Enable Automatic Updates

Go to your system settings right now and turn on automatic updates. Do it for your operating system. Do it for your web browser. Do it for every application that offers the option. This is the single most important security habit you can develop.

---

## Section 6: Cleaning Up (10 minutes)

### Learning Goal
Learn the proper procedure for removing software you no longer need.

### DO: The Cleanup Audit

Open your list of installed programs right now. Count how many are installed. Then answer:

1. How many of these programs have you used in the last month?
2. How many have you not used in the last six months?
3. What would happen if you removed the unused ones?

### TRY THIS: Proper Uninstallation

Choose one program you do not need. Remove it the RIGHT way:

1. Close the application completely (check the system tray too)
2. Use the operating system's uninstaller:
   - **Windows:** Settings > Apps > Installed apps > [program] > Uninstall
   - **Linux:** Software Center or `sudo apt remove [package-name]`
   - **Mac:** Drag from Applications to Trash, or use the app's uninstaller
3. Restart your computer
4. Check: does the program still appear in your installed apps list?
5. Check for leftover files in Documents, Desktop, or Downloads

Document what you found:

| Item | What You Expected | What Actually Happened |
|------|------------------|----------------------|
| Programs in list | | |
| Programs used recently | | |
| Residual files after uninstall | | |

### Think About It

Why is it not enough to just delete a program's shortcut from your desktop? What is still left behind? Why does that matter?

### Teach Someone

Explain to a partner why keeping unused software on your computer is a security risk, even if you never open the program. Use the analogy of an unlocked door in your house that you never walk through.

---

## Summary

Software installation is a core digital literacy skill. You now understand:

- The difference between system software and application software
- How to identify safe download sources
- What happens during the installation process
- How to configure software properly after installation
- Why updates are critical and how to manage them
- How to remove software cleanly

**Key habit to remember:** Before you install any software, verify the source. Before you click Next, read the screen. After you install, configure and update. When you stop using it, remove it.

**Next Steps:** Complete the lab exercises to practice real installation, then work on the Software Installation Guide project to build your own reference document.
