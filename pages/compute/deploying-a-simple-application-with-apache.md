---
title: 'Deploying a Simple Application with Apache'
description: 'Learn how to deploy a simple application with Apache on AWS EC2'
author: Demola Malomo
authorGithub: https://github.com/Mr-Malomz
tags: ['compute', 'fundamentals', 'aws']
category: 'Compute'
date: '2026-01-15'
---

## Deploying a Simple Web Application on AWS EC2 with Apache

_Written by_ [Demola Malomo](https://github.com/Mr-Malomz)

If you have ever needed a quick server to host a website, API, or internal tool, Amazon EC2 is usually the first place people start in AWS. It gives you a virtual machine in the cloud that behaves like a regular server, except you can create or delete it in minutes.

In this guide, we will deploy a basic web application on an EC2 instance using Apache. This setup is common for learning AWS, testing ideas, or running small production workloads.


### What You Are Setting Up

By the end of this tutorial, you will have:

* An EC2 instance running Amazon Linux 2
* Apache installed and running
* A web page accessible through a public IP address

All of this runs on the AWS Free Tier.


### A Quick Breakdown of EC2 Basics

You will see these terms repeatedly in AWS, so it helps to know what they mean upfront.

* **EC2 instance**:
  A virtual server running in AWS.

* **AMI**:
  A template that defines the operating system and base setup of the instance.

* **Security group**:
  A firewall that decides which traffic can reach your server.

* **Key pair**:
  A private key used to log in to the server over SSH.

* **Key pair**: A PEM file used to securely connect to the server.

The key pair is important. Without it, you cannot log in to the instance.

### Step 1: Launch an EC2 Instance

Start by creating the server.

1. Sign in to the [AWS Management Console](https://aws.amazon.com/console/?utm_source=aws_techeasydoc&utm_medium=aws_techeasydoc&utm_campaign=aws_techeasydoc).
2. Search for **EC2** and open the service.
3. Click **Launch Instance**.
4. Choose **Amazon Linux 2** as the AMI.
5. Select **t2.micro** as the instance type.
6. When you reach the Key pair (login) section:
    * Select Create new key pair
    * Give it a name, for example ec2-demo-key
    * Choose PEM as the key pair type
    * Download the file when prompted
7. Save the .pem file in a safe place on your computer. A common location is:
    ```bash
    ~/.ssh/ec2-demo-key.pem
    ```
    _**This file is only downloaded once. If it is lost, you cannot SSH into the instance.**_

8. Continue the setup and create a new security group with:
    * SSH (port 22)
    * HTTP (port 80)
    * HTTPS (port 443) if needed
9. Launch the instance.

At this point, AWS is creating your server. It usually takes less than a minute.

### Step 2: Prepare the PEM Key Locally

Before connecting, adjust the file permissions. SSH will refuse to use the key if it is publicly accessible.

Run this on your local machine:

```bash
chmod 400 ~/.ssh/ec2-demo-key.pem
```

This tells your system that only you can read the key file.

### Step 3: Connect to the EC2 Instance

Once the instance is running, connect to it using SSH.

1. In the EC2 dashboard, copy the instance’s public IP address.

2. Open a terminal and connect:

   ```bash
   ssh -i ~/.ssh/ec2-demo-key.pem ec2-user@your-public-ip
   ```

3. After logging in, update the system packages:

   ```bash
   sudo yum update -y
   ```

If the connection works, you will be logged into your EC2 server.

### Step 4: Install and Start Apache

1. Install Apache:

    ```bash
    sudo yum install httpd -y
    ```

2. Start the service:

    ```bash
    sudo systemctl start httpd
    ```

3. Configure Apache to start on reboot:

    ```bash
    sudo systemctl enable httpd
    ```

4. Adjust permissions for the web directory:

    ```bash
    sudo chmod 755 /var/www/html
    ```

5. Create a test page:

    ```bash
    echo "<h1>Hello from EC2</h1>" | sudo tee /var/www/html/index.html
    ```

### Step 5: Test the Application
Open a browser and visit the public IP address of your EC2 instance.

If you see “Hello from EC2,” the setup is working.
If not, check the security group and confirm Apache is running.

### Step 6: Deploy Your Own Application

Replace the test page with your own application files.

1. Upload your application files:

    ```bash
    scp -i ~/.ssh/ec2-demo-key.pem /local/path/to/app ec2-user@your-public-ip:/var/www/html/
    ```

2. Install any required runtime or dependencies based on your app, such as Node.js, Python, or PHP.

3. Restart Apache:

   ```bash
   sudo systemctl restart httpd
   ```

Your application is now live and accessible via the instance’s public IP.

### A Note on Security and Production Use

For real production workloads, you would typically add HTTPS, restrict SSH access, and place the instance behind a load balancer. EC2 works best when combined with other AWS services, rather than running as a standalone server long-term.

For learning and small projects, this setup is more than enough.
