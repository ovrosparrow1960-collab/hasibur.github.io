# My Portfolio Website

A fast, single-page personal portfolio. **No coding tools to install** — it's just HTML/CSS/JS
that runs in any browser and hosts for free on GitHub Pages.

## ✏️ How to edit your site

**You only edit ONE file: [`content.js`](content.js).**

Everything on the page — your name, bio, skills, projects, certifications, contact info —
comes from that file. Open it in any text editor (Notepad works), change the text between the
quotes, save, and refresh your browser.

You do **not** need to touch `index.html`, `render.js`, `script.js`, or `styles.css`.

### Common edits

| I want to…                     | Do this in `content.js`                                            |
|--------------------------------|--------------------------------------------------------------------|
| Change my name / title / bio   | Edit the `hero` and `about` sections                               |
| Add a skill / project / cert   | Copy an existing `{ ... }` block, paste it below, add a comma      |
| Remove something               | Delete its `{ ... }` block                                         |
| Reorder the menu               | Reorder the lines in the `nav` list                                |
| Hide the resume button         | Set `resumeFile: ""`                                               |

## 🖼️ Adding your photos, certificates & project images

1. Put your image files into the **`images`** folder (drag and drop).
2. In `content.js`, point to them by name, e.g. `photo: "images/my-photo.jpg"`.

Supported: `.jpg`, `.png`, `.gif`, `.webp`, `.svg`. For a project you can use:
- `image: "images/shot.png"` — a single picture
- `images: ["images/a.png", "images/b.png"]` — an auto-rotating slideshow
- `icon: "fas fa-robot"` — a plain icon tile if you have no picture yet
- `video: "images/demo.mp4"` — adds a play button that opens the video

> If an image is missing, the site shows a soft "Add your image" placeholder instead of breaking.

## 📄 Adding your resume

Drop your PDF into this folder (e.g. `resume.pdf`), then in `content.js` set
`resumeFile: "resume.pdf"`.

## 🎨 Icons

Icons (the little symbols) use [Font Awesome](https://fontawesome.com/icons). Search for one,
copy its class name, and paste it — e.g. `"fas fa-rocket"` or `"fab fa-github"`.

## 👀 Preview it locally

Just double-click `index.html` to open it in your browser. (For the contact form and videos to
behave exactly like the live site, you can instead run a tiny local server:
`python -m http.server` in this folder, then visit http://localhost:8000.)

## 🚀 Publish it free with GitHub Pages

1. Create a GitHub repository named **`your-username.github.io`**.
2. Upload all these files to it (or push with git).
3. In the repo: **Settings → Pages → Branch: `main` → Save**.
4. Your site goes live at `https://your-username.github.io` within a minute or two.

## 🗂️ What each file does

| File            | Purpose                                                        |
|-----------------|----------------------------------------------------------------|
| `content.js`    | **Your content — the only file you edit.**                     |
| `images/`       | Your photos, certificates, and project images.                 |
| `index.html`    | Page shell (mount points). Rarely touched.                     |
| `render.js`     | Builds the page from `content.js`. Don't edit.                 |
| `script.js`     | Animations, menu, slideshows, contact form. Don't edit.        |
| `styles.css`    | The visual design/colors. Edit only to restyle.                |

---

Built on a clean HTML/CSS/JS template — content-driven so you never have to read the code.
