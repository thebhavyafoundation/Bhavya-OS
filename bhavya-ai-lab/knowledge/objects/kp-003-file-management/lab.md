# Lab: File Management

**Grade:** 9 | **Duration:** 45 minutes | **Type:** Hands-on exercises

---

## Lab Overview

This lab provides five hands-on exercises where students practice real file management skills on a computer. Each exercise builds on the previous one, culminating in a complete folder structure project.

**What You Need:**
- A computer with Windows, macOS, or Linux
- A text editor (Notepad, TextEdit, or any plain text editor)
- Access to the desktop and Documents folder
- Optional: a USB flash drive or cloud storage account (Google Drive, OneDrive)

**Before You Begin:**
Create a folder on your desktop called `FM-Lab-YourName` (replace YourName with your actual name). All your work for this lab will go inside this folder.

---

## Exercise 1: File System Exploration (8 minutes)

### Objective
Navigate the file system and understand folder hierarchies.

### Instructions

1. Open your file manager (File Explorer on Windows, Finder on macOS)
2. Navigate to your desktop and open the `FM-Lab-YourName` folder
3. Create the following folder structure inside it:

```
FM-Lab-YourName/
├── School
│   ├── Science
│   ├── English
│   └── Mathematics
├── Personal
│   ├── Photos
│   └── Projects
└── Downloads
```

4. Open each folder and confirm it exists
5. Use the address bar or path bar to write the full file path to the Science folder

### Questions to Answer

1. What is the full path from root to your Science folder? (Example: `C:\Users\YourName\Desktop\FM-Lab-YourName\School\Science`)
2. How many levels deep is the Science folder from the root?
3. Which folder is the parent of the English folder?
4. Which folders are siblings of the Mathematics folder?

### Expected Output
A completed folder tree with answers written in a text file named `exercise-1-answers.txt` saved inside the `Downloads` folder you created.

---

## Exercise 2: File Naming Practice (8 minutes)

### Objective
Apply proper file naming conventions to create and rename files.

### Instructions

1. Inside your `School\Science` folder, create five new text files
2. Name them using proper conventions (no spaces, use hyphens, include dates):
   - `2026-08-05_lab-report-draft.txt`
   - `2026-08-05_experiment-notes.txt`
   - `2026-08-05_research-sources.txt`
   - `2026-08-05_team-contact.txt`
   - `2026-08-05_final-checklist.txt`
3. Open each file and type one sentence describing its purpose
4. Now rename `team-contact.txt` to `team-contacts-updated.txt`
5. Take a screenshot of your Science folder showing all five files

### Bad Naming Examples to Avoid
- `doc1.txt` — Too vague
- `my science homework.txt` — Contains spaces
- `report!.txt` — Contains special characters
- `AUG 5 REPORT.txt` — Inconsistent date format

### Expected Output
Five properly named files in the Science folder, each with content, plus a screenshot saved as `exercise-2-screenshot.png` in the Downloads folder.

---

## Exercise 3: File Operations Drill (10 minutes)

### Objective
Practice copying, moving, renaming, and deleting files using both right-click menus and keyboard shortcuts.

### Instructions

**Part A: Copy Operations**
1. Copy `lab-report-draft.txt` from Science to English folder
2. Verify both copies exist (Science should still have the original)
3. Copy the entire Science folder contents to Personal\Projects

**Part B: Move Operations**
1. Move `experiment-notes.txt` from Science to Mathematics
2. Verify it no longer exists in Science
3. Move it back to Science

**Part C: Rename Operations**
1. Rename `research-sources.txt` to `research-sources-v2.txt`
2. Rename it back to the original name

**Part D: Delete Operations**
1. Delete `final-checklist.txt` from Science
2. Open the Recycle Bin (Windows) or Trash (Mac)
3. Restore the deleted file
4. Verify it is back in the Science folder

### Keyboard Shortcuts to Practice
| Action | Windows | macOS |
|--------|---------|-------|
| Copy | Ctrl+C | Cmd+C |
| Cut (for move) | Ctrl+X | Cmd+X |
| Paste | Ctrl+V | Cmd+V |
| Undo | Ctrl+Z | Cmd+Z |
| Delete | Delete key | Cmd+Delete |
| Rename | F2 | Enter |

### Expected Output
A text file named `exercise-3-log.txt` in your Downloads folder documenting each operation you performed, the shortcut you used, and whether it succeeded.

---

## Exercise 4: Storage and Backup Simulation (9 minutes)

### Objective
Understand storage management concepts through practical file organization.

### Instructions

**Part A: Storage Check**
1. Check how much free space is on your computer's main drive
   - Windows: Right-click the C: drive → Properties
   - Mac: Apple menu → About This Mac → Storage
2. Record the total space and free space

**Part B: Find Large Files**
1. Use the search function in your file manager to find files larger than 10 MB
2. Record three large files you found (name and size)

**Part C: Backup Practice**
1. Create a folder called `Backup-Test` on your desktop
2. Copy your entire `FM-Lab-YourName` folder into it
3. Verify the copy is complete
4. Delete one file from the original folder
5. Restore it from the Backup-Test copy
6. This simulates how backup and restore works

**Part D: Cloud Storage Exploration**
1. If available, upload one file to Google Drive, OneDrive, or another cloud service
2. Note the steps you took to upload
3. Consider: Could you access this file from a different computer?

### Expected Output
A text file named `exercise-4-storage-log.txt` in your Downloads folder with:
- Your drive's total and free space
- Three large files you found
- A description of your backup test
- Notes on cloud storage (or reasons why you could not test it)

---

## Exercise 5: Organization Challenge (10 minutes)

### Objective
Design and implement a complete organizational system for a simulated school year.

### Instructions

You are given these mixed-up files. Organize them into a proper folder structure:

**Files to Organize:**
- `essay-draft-3.docx`
- `periodic-table.png`
- `math-homework-ch1.pdf`
- `science-lab-photos.zip`
- `history-presentation.pptx`
- `english-vocabulary-list.txt`
- `certificate-2025.pdf`
- `project-ideas.md`
- `reading-list.txt`
- `geometry-notes.pdf`

**Step 1:** Design a folder structure on paper first. Include:
- At least 3 subject folders
- At least 2 folders for different purposes (homework, projects, resources, etc.)
- A system for handling non-school files

**Step 2:** Create the folder structure on your computer

**Step 3:** Move each file to its correct location

**Step 4:** Rename any files that need better names

**Step 5:** Create a `README.txt` in your root folder that explains your organizational system

### Expected Output
- Complete folder structure with all 10 files organized
- `README.txt` explaining your system
- `exercise-5-organization.txt` in Downloads with a screenshot or written description of your final structure

---

## Lab Summary

| Exercise | Skill Practiced | Time |
|----------|----------------|------|
| 1 | File System Navigation | 8 min |
| 2 | File Naming Conventions | 8 min |
| 3 | File Operations (Copy/Move/Rename/Delete) | 10 min |
| 4 | Storage Management and Backup | 9 min |
| 5 | Complete Organization Challenge | 10 min |

### Self-Assessment
Rate yourself 1-5 on each skill:
- [ ] I can navigate folders and understand file paths
- [ ] I can name files using proper conventions
- [ ] I can copy, move, rename, and delete files confidently
- [ ] I understand different storage types and backup strategies
- [ ] I can design and implement a folder organization system

### Extension Challenge
If you finish early, create a `Tips.txt` file in your Downloads folder with your top 5 file management tips for other students.
