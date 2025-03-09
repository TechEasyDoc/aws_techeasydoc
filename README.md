<p align="center">
  <a href="https://">
    <img alt="TechEasyDoc" src="https://res.cloudinary.com/dtgbzmpca/image/upload/v1741473305/tech_easy_doc_logo_jjpkkh.svg" width="300" />
  </a>
</p>

  <p align="center">AWS Stuffs made easy and enjoyable<p>

<p align="center">
   <a href="https://">View Blog</a>
</p>

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://makeapullrequest.com)

# AWS Tech Easy Blog
Welcome to the **AWS Tech Simplified Blog** – an open-source platform dedicated to demystifying complex AWS technologies. This Next.js project uses [Nextra](https://nextra.vercel.app) to render and manage blog content, making it easy for anyone to run it locally and contribute their insights.

---

## Table of Contents

- [Features](#features)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Running Locally](#running-locally)
  - [Project Structure](#project-structure)
- [Contributing](#contributing)
- [Buy Me a Coffee](#buy-me-a-coffee)
- [License](#license)
- [Additional Resources](#additional-resources)

---

## Features

- **Easy-to-read AWS Tutorials:** Break down complex AWS topics into simple, digestible blog posts.
- **Next.js Powered:** Fast, server-side rendered React application for optimal performance.
- **Nextra for Blog Rendering:** Enjoy a seamless markdown experience for blog content.
- **Open-Source & Community-Driven:** Free for everyone and open for contributions.

---

## Getting Started

Follow these steps to set up the project on your local machine.

### Prerequisites

- **Node.js** (v18 or above)
- **npm** or **yarn**
- **Git**

### Installation

1. **Clone the Repository:**

   ```bash
   git clone https://github.com/TechEasyDoc/aws_techeasydoc.git
2. Navigate to the Project Directory:

    ```bash
    cd aws_techeasydoc
3. Install Dependencies:

    ```bash
    npm install
    # or
    yarn install
Running Locally
Start the development server with the following command:
    
    npm run dev
    # or
    yarn dev


Your blog should now be running at http://localhost:3000.

### Project Structure
    
    aws-made-simple/
    ├── pages/
    │   ├── EC2/                # Blog posts category
    │   │   └── sample.mdx      # Blog post
    │   └── EKS/          
    

#### Adding a Blog Post
1. Create a new `.mdx` file inside a matching category.
2. Use frontmatter:
    ```
    ---
    title: 'Your AWS Guide Title'
    date: '2024-03-20'
    author: 'Your Name'
    description: 'A clear summary of your post'
    cover: '/images/your-image.jpg'
    tags: ['EC2', 'Serverless']
    ---
## Contributing
We welcome contributions to make AWS technology even more accessible! Here’s how you can help:

1. **Fork the Repository**: Click the "Fork" button at the top right of the repository page.

2. **Create a Feature Branch**:

    ```bash
    git checkout -b feature/your-feature-name
3. **Make Your Changes**: Follow the existing code style and update documentation as needed.

4. **Commit Your Changes**: 
    ```bash
    git commit -am "Add: [brief description of your changes]"
5. Push to Your Fork:
    ```bash
    git push origin feature/your-feature-name
6. **Submit a Pull Request**: Open a pull request explaining your changes and referencing any related issues.

If you’re new to contributing, check out our CONTRIBUTING.md file for detailed guidelines and best practices.

## ☕ Buy Me a Coffee

If you find this project helpful, consider supporting my caffeine addiction:  

[![Buy Me A Coffee](https://img.shields.io/badge/Buy_Me_A_Coffee-FFDD00?style=for-the-badge&logo=buy-me-a-coffee&logoColor=black)](https://buymeacoffee.com/techeasydoc)

---