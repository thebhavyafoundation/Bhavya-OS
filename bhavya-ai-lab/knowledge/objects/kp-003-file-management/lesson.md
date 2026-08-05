# Lesson: File Management

**Grade:** 9 | **Subject:** Digital Literacy | **Duration:** 60 minutes | **Sections:** 6

---

## Section 1: What is a File System? (10 minutes)

### Learning Objective
Understand the hierarchical structure of files and folders on a computer.

### Opening Challenge
Before we learn anything, try this: Open your file explorer right now. Can you find a file you saved more than two weeks ago in under 30 seconds? Start a timer. Go.

If you could not do it, you are not alone. Most students cannot. By the end of this lesson, you will be able to find any file in under 10 seconds.

### DO: Map Your Computer's Brain

Forget reading about file systems for a moment. Open your file explorer and answer these questions by exploring:

1. **What is at the very top?** Click to the highest level you can see. What do you see? That is the **root** — the starting point of everything.
2. **How many main folders exist?** Count them. Write the number down.
3. **Pick any main folder and go two levels deep.** Draw what you see — the folder, its subfolders, and anything inside them.

You just mapped a file system. The structure you drew is called a **tree** — it starts at the root and branches downward.

```
Root (C:\)
├── Documents
│   ├── School
│   │   ├── Science
│   │   ├── English
│   │   └── Mathematics
│   └── Personal
│       ├── Photos
│       └── Resume
├── Downloads
└── Pictures
    ├── Vacation 2026
    └── Screenshots
```

### Think About It
Why does the root folder not have a parent folder? What would happen if folders could have folders above them forever? Where would the chain end?

### Try This Experiment
Create a folder on your desktop. Inside it, create a subfolder. Inside that, create another subfolder. Now try to move the deepest subfolder to the desktop. What happens to the files inside it? Why?

### Key Terms
- **Root** — The top level of the file system (usually C:\ on Windows)
- **Directory** — Another word for folder
- **Path** — The route from root to a specific file (like an address)

### Teach Someone
Turn to a partner. Without using any computer terms, explain how files are organized on a computer. Use an analogy — a library, a house, a kitchen. If your partner understands, you understand.

---

## Section 2: File Naming Conventions (10 minutes)

### Learning Objective
Apply consistent rules for naming files clearly and professionally.

### Opening Experiment
Your teacher will show you two lists of files on the board. One list has poorly named files, the other has well-named files. You have 60 seconds to find "the biology homework" in each list. Which list was faster? Why?

List A (bad names):
```
untitled.docx
doc1.pdf
notes.txt
homework (3).docx
IMG_4521.jpg
```

List B (good names):
```
2026-08-05_biology-homework_ch5.pdf
2026-08-03_english-essay_draft2.docx
2026-08-01_science-lab_report.pdf
2026-07-28_math-assignment_ch3.pdf
2026-07-25_history-presentation_final.pptx
```

If List B was faster, you already understand why naming matters. Now let us learn the rules.

### DO: The Name Game

Here is a file name. Your job: make it better.

**Original:** `doc1.docx`

Before you read the rules, write down three better names for this file. Then check your answers against the rules below.

**The 5 Rules of File Naming:**

1. **Be descriptive** — The name should describe what is inside
2. **Use dates in ISO format** — Start with YYYY-MM-DD so files sort chronologically
3. **Use hyphens or underscores, not spaces** — Some systems handle spaces poorly
4. **Avoid special characters** — Characters like / \ : * ? " < > | can cause errors
5. **Keep it short but clear** — Aim for 3-8 words that describe the content

### Try This: Transform These Names

Take these badly named files and rewrite them using all 5 rules. Write your answers, then compare with a partner.

| Original | Your Improved Name |
|----------|-------------------|
| `my homework.docx` | |
| `notes.txt` | |
| `presentation FINAL FINAL v2.pptx` | |
| `screenshot 2026-01-20.png` | |
| `science fair project.docx` | |

### Experiment: What Happens If...

Try these on your computer and record what happens:

1. **Create a file with a space in the name.** Can you open it? Does anything break?
2. **Create a file with a special character (like `!` or `#`).** What happens?
3. **Create two files: `report.docx` and `Report.docx`.** Are they the same file or different files on your system? Why does this matter?

### Think About It
Why should you put the date at the beginning of a file name instead of the end? What happens to your files when you sort them alphabetically?

### Real-World Scenario
Your teacher asks you to submit a science report. The file name on your USB drive is `homework.docx`. There are 12 files with that exact name from different students. Your teacher cannot tell which one is yours. What do you do? Write the steps you would take to fix this.

---

## Section 3: Folder Organization (10 minutes)

### Learning Objective
Design logical folder structures that make files easy to find and manage.

### Opening Scenario
You just started at a new school. Your teacher says, "Please save your essay in the English folder." You open your file explorer and see:

```
Desktop/
├── New Folder
├── New Folder (2)
├── New Folder (3)
├── stuff
├── things
├── school
└── backup
```

Where would you look? What if there is no "English folder"? This is what happens when organization breaks down.

### DO: Design Before You Build

Before touching your computer, grab a piece of paper. You are going to design a folder system for a student who:

- Takes 5 subjects (Science, English, Math, History, Art)
- Works on 2 ongoing projects (Science Fair, English Essay)
- Has photos from school events
- Downloads files from the internet

**Task 1:** Draw your folder tree on paper. Include at least 8 folders and at least 3 levels of hierarchy in one branch.

**Task 2:** Label each folder with a one-sentence explanation of what goes inside it.

**Task 3:** Show your design to a partner. Ask them: "Can you figure out where to save a new Science homework file?" If they cannot, redesign.

### The Three Methods

| Method | Best For | Example |
|--------|----------|---------|
| **By Subject** | Daily schoolwork across classes | `School/Science/Lab-Reports/` |
| **By Project** | Multi-part assignments | `Projects/Science-Fair/Research/` |
| **By Date** | Time-sensitive or chronological work | `2026/August/Week-2/` |

### Try This: Mix and Match

Pure subject-only or project-only organization often fails in the real world. Try designing a **hybrid system** that uses two methods together. For example:

```
School/
├── Science/
│   ├── Homework/
│   ├── Labs/
│   └── Science-Fair-2026/
├── English/
│   ├── Essays/
│   └── Reading/
└── Projects/
    ├── English-Essay/
    └── History-Presentation/
```

Why does this hybrid work better than either method alone?

### The Golden Rule
**Create folders before you need them.** A moment of organization now saves hours of searching later.

### Think About It
Which organization method would work best for a student who submits different types of work (essays, lab reports, presentations) for each subject? Why? What would fail if they only used the by-date method?

### Peer Teaching
Explain to a partner why "saving everything to the desktop" is a bad strategy. Give at least three specific problems it causes. Your partner should be able to repeat your explanation to someone else.

---

## Section 4: File Operations (10 minutes)

### Learning Objective
Perform copy, move, rename, and delete operations on files correctly and safely.

### Opening Challenge
Open a text editor. Create a file and save it to your desktop. Now answer these questions by trying:

1. Can you have two files with the exact same name in the same folder?
2. What happens when you drag a file from one folder to another on the same drive? What about to a different drive (like a USB)?
3. What is the difference between pressing Delete and pressing Shift+Delete?

If you got any of these wrong, this section will clarify why.

### DO: The Operations Lab

Create a test folder on your desktop called `File-Ops-Lab`. Inside it, create 3 text files. Then complete these tasks:

**Task 1: Copy vs. Move**
- Copy `file1.txt` to a new folder called `Copy-Destination`
- Move `file2.txt` to a new folder called `Move-Destination`
- Check: How many copies of `file1.txt` exist now? How many copies of `file2.txt`?

**Task 2: Rename**
- Rename `file1.txt` to `2026-08-05_renamed-file.txt`
- What happens to the file's contents when you rename it? (Open it and check)

**Task 3: Delete and Recover**
- Delete `file3.txt`
- Find it in the Recycle Bin / Trash
- Restore it
- What did you learn about the safety net?

**Task 4: The Keyboard Speed Round**
Practice these shortcuts until you can do them without looking:
- `Ctrl+C` / `Cmd+C` — Copy
- `Ctrl+X` / `Cmd+X` — Cut (Move)
- `Ctrl+V` / `Cmd+V` — Paste
- `F2` / `Enter` — Rename
- `Delete` / `Cmd+Delete` — Delete
- `Ctrl+Z` / `Cmd+Z` — Undo (your best friend)

Time yourself. How fast can you copy a file, rename the copy, and move the original?

### Critical Distinction: Copy vs. Move
- **Copy** = The original stays, and a duplicate appears at the new location
- **Move** = The original is removed from its current location and placed at the new location

### Think About It
You want to move a file from your Downloads folder to your Documents folder, but you also want to keep a copy in Downloads. Should you use Copy or Move? What if you only wanted ONE copy total — which operation would you use?

### Real-World Scenario
Your friend asks you to share a document with them. You have the only copy on your computer. What operation should you use? Why is it different from just sending them the file? What happens if you accidentally Move instead of Copy?

---

## Section 5: Storage Management (10 minutes)

### Learning Objective
Understand different storage types and implement basic backup strategies.

### Opening Question
If your computer stopped working right now, would you lose any important files? Think about it honestly. How many irreplaceable files — photos, documents, projects — exist only on your computer's hard drive?

### DO: The Storage Audit

Open your computer's storage settings right now. Find:
1. How much total storage does your computer have?
2. How much is used? How much is free?
3. What is taking up the most space?

Now answer: If your hard drive failed tomorrow, what files would you lose forever?

### Experiment: Speed Test

If possible, try this:
1. Copy a large file (like a video) from your computer to a USB drive. Time it.
2. Copy the same file from your computer to a cloud service (like Google Drive). Time it.
3. Compare. Which was faster? What are the tradeoffs?

### The Storage Comparison

| Storage Type | Speed | Capacity | Portability | Survives Computer Failure? |
|-------------|-------|----------|-------------|---------------------------|
| **HDD** | Moderate | Large (1-10 TB) | No | No |
| **SSD** | Fast | Moderate (256 GB-4 TB) | No | No |
| **USB Flash Drive** | Moderate | Small (8 GB-1 TB) | Yes | Yes |
| **External Hard Drive** | Moderate | Large (1-5 TB) | Yes | Yes |
| **Cloud Storage** | Depends on internet | Varies | Yes (online) | Yes |

### The 3-2-1 Backup Rule
Keep **3** copies of important files, on **2** different types of storage, with **1** copy offsite (such as cloud storage).

**Why this works:**
- If your computer fails, you have 2 other copies
- If your USB drive fails, you have a cloud copy
- If your cloud account is compromised, you have local copies
- No single point of failure can destroy all your work

### Think About It
Why is cloud storage alone not enough for a complete backup strategy? What could go wrong if you only used Google Drive?

### Real-World Scenario
A company stores all its financial records on a single hard drive. The hard drive fails. They lose 10 years of data. Using the 3-2-1 rule, design a backup system that would have prevented this disaster. Explain each copy and where it lives.

---

## Section 6: Putting It All Together (10 minutes)

### Learning Objective
Apply all file management skills in a realistic scenario.

### DO: The Full Challenge

You have 10 minutes. Complete this scenario from start to finish:

**Scenario:** Your teacher just emailed the class a zip file containing 15 disorganized files for a group project. The files include documents, images, spreadsheets, and presentations. Your job:

1. **Extract the files** to a new folder on your desktop
2. **Create a folder structure** for the project (you decide the organization)
3. **Rename every file** using proper naming conventions
4. **Move each file** to the correct folder
5. **Back up the entire project** to a cloud service or USB drive

When you finish, your partner should be able to find any file in under 10 seconds.

### Quick Review — Answer These Without Looking at Notes

1. What is the difference between a file path and a file extension?
2. Name two rules for good file naming.
3. What does the 3-2-1 backup rule mean?
4. What happens when you press Ctrl+X instead of Ctrl+C?
5. Why should you organize files into folders instead of keeping everything on the desktop?

### Closing Reflection
Write answers to these three questions:

1. **Three things I learned today** (specific, not "file management")
2. **Two things I want to practice** (what will you actually do?)
3. **One thing I will do differently starting tomorrow** (concrete action)

### Teach Someone
Explain the 3-2-1 backup rule to a partner using only words a younger student would understand. If they can repeat it back accurately, you understand it deeply.

---

## Lesson Summary

| Section | Topic | Key Takeaway |
|---------|-------|-------------|
| 1 | File Systems | Files are organized in a tree hierarchy from root to folders to files |
| 2 | File Naming | Use dates, hyphens, and descriptive names — never spaces or special characters |
| 3 | Folder Organization | Choose a method (by project, subject, or date) and create folders before you need them |
| 4 | File Operations | Copy duplicates, Move transfers, Rename changes name, Delete removes (safely) |
| 5 | Storage Management | Know your storage types and follow the 3-2-1 backup rule |
| 6 | Integration | All five skills work together for efficient digital work |
