# Contributing to AWS Tech Easy Blog

Thank you for your interest in contributing. We appreciate all forms of contributions, especially blog posts that help make AWS easier to understand.

There are two main ways to contribute:
- Writing or improving blog content
- Improving the codebase

---

## ✍️ Contributing Blog Content

### Step 1: Fork the Repository

Click the Fork button at the top right of the repository.

### Step 2: Create a Branch

```bash
git checkout -b post/add-my-article
```

### Step 3: Add Your Blog Post

- Navigate to the relevant category folder inside `pages/`
- Create a new .mdx file
- Follow the blog post template used in existing posts

#### File Naming
Use lowercase and kebab case. Example: `understanding-ec2-auto-scaling.mdx`

#### Frontmatter Example
```md
---
title: "Your AWS Guide Title"
date: "2024-03-20"
author: "Your Name"
description: "A clear summary of your post"
cover: "/images/your-image.jpg"
tags: ["EC2", "Serverless"]
---
```

### Step 4: Commit and Push
```bash
git add .
git commit -m "Add article on AWS IAM basics"
git push origin add-my-article
```

### Step 5: Open a Pull Request

Open a PR to the `main` branch and fill out the PR template.

---
## 🛠 Contributing Code

We also welcome improvements to:

- Site performance
- Styling and layout
- Accessibility
- SEO improvements
- Build and deployment workflows

Please make sure:

- The site builds successfully
- Changes are focused and well scoped
- Your PR description clearly explains what was changed and why
---

## 📌 Contribution Guidelines

- Keep PRs focused on one topic
- Avoid mixing content and code in the same PR when possible
- Be respectful and constructive in discussions
- All contributions must follow the project license

---

## 🙌 Need Help?

If you are unsure about anything:

- Open an issue to ask a question
- Or start by improving an existing post

We are happy to help first time contributors.