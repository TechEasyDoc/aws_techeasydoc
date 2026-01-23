---
title: 'Deploying an Apache Web Server on AWS EC2 Using the AWS CLI'
description: Learn how to deploy an Apache web server on AWS EC2 using the AWS CLI.
author: Demola Malomo
authorGithub: https://github.com/Mr-Malomz
tags: ['compute', 'ec2', 'aws-cli']
category: 'Compute'
date: '2026-01-23'
---

## Deploying an Apache Web Server on AWS EC2 Using the AWS CLI

_Written by_ [Demola Malomo](https://github.com/Mr-Malomz)

The AWS Command Line Interface (AWS CLI) lets you manage AWS services directly from your terminal. Instead of clicking through the AWS console, you can create and configure resources usin commands that are easy to repeat and automate.

In this guide, you will deploy an EC2 instance and install an Apache web server on it using only the AWS CLI. By the end, you will have a running web server you can access from your browser.

### What You Will Be Using

As we go through the steps, you will work with a few core AWS concepts:

- EC2: A virtual server in the cloud.

- Security Groups: Firewall rules that control who can access your server.

- Key Pairs: SSH keys used to securely connect to the instance.

- User Data: A script that runs automatically when the instance starts.

- IAM Roles: Permissions that allow your EC2 instance to access AWS services securely.

### Prerequisites

Before you start, make sure you have the following:

- AWS CLI [installed](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html?utm_source=aws_techeasydoc&utm_medium=referral&utm_campaign=aws_techeasydoc) and [configured](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-quickstart.html?utm_source=aws_techeasydoc&utm_medium=referral&utm_campaign=aws_techeasydoc) on your machine.
- An existing EC2 key pair. You need this to SSH into the instance later.
- A VPC and subnet. Most AWS accounts already have a default VPC and subnet you can use.

### Step 1: Create a Security Group

A security group acts like a firewall for your EC2 instance. It controls access to the instance based on rules you define. You'll create one that allows SSH (port 22) and HTTP (port 80) traffic.

```bash
aws ec2 create-security-group \
  --group-name apache-web-server-sg \
  --description "Security group for Apache web server" \
  --vpc-id vpc-xxxxxxxxxxxxxxxxx
```

After running the command, note the security group ID in the output. You'll need it later. You can also store it in a variable for easier use as shown below:

```bash
SG_ID=sg-xxxxxxxxxxxxxxxxx
```

Replace the VPC ID and security group ID with your own values.

### Step 2: Allow SSH and HTTP Access

Next, you'll add rules to the security group to allow SSH and HTTP traffic.

- SSH (Port 22): For remote access to the instance.
- HTTP (Port 80): For web traffic.

```bash
aws ec2 authorize-security-group-ingress \
  --group-id $SG_ID \
  --protocol tcp \
  --port 22 \
  --cidr 0.0.0.0/0

aws ec2 authorize-security-group-ingress \
  --group-id $SG_ID \
  --protocol tcp \
  --port 80 \
  --cidr 0.0.0.0/0
```

> For learning and testing, this is fine. In production, you should restrict SSH access to your own IP address.

### Step 3: Create an IAM Role for the Instance

Instead of storing AWS credentials on your server, EC2 can assume an IAM role.

First, create the role:

```bash
aws iam create-role \
  --role-name EC2ApacheRole \
  --assume-role-policy-document '{
    "Version": "2012-10-17",
    "Statement": [{
      "Effect": "Allow",
      "Principal": { "Service": "ec2.amazonaws.com" },
      "Action": "sts:AssumeRole"
    }]
  }'
```

Next, attach the Systems Manager policy so you can manage the instance securely later:

```bash
aws iam attach-role-policy \
  --role-name EC2ApacheRole \
  --policy-arn arn:aws:iam::aws:policy/AmazonSSMManagedInstanceCore
```

Finally, create the instance profile and attach the role to it:

```bash
aws iam create-instance-profile \
  --instance-profile-name EC2ApacheProfile

aws iam add-role-to-instance-profile \
  --instance-profile-name EC2ApacheProfile \
  --role-name EC2ApacheRole
```

### Step 4: Create a User Data Script

You need a user data script to install Apache and configure it to run on boot.

To get started, first, create a file named `user-data.sh`:

```bash
#!/bin/bash
yum update -y
yum install -y httpd

systemctl start httpd
systemctl enable httpd
```

Add a simple HTML page:

```bash
cat > /var/www/html/index.html << 'EOF'
<!DOCTYPE html>
<html>
<head>
  <title>Apache on EC2</title>
</head>
<body>
  <h1>Hello from EC2</h1>
  <p>This server was launched using the AWS CLI.</p>
</body>
</html>
EOF
```

### Step 5: Launch the EC2 Instance

First, fetch the latest Amazon Linux 2 AMI:

```bash
AMI_ID=$(aws ec2 describe-images \
  --owners amazon \
  --filters "Name=name,Values=amzn2-ami-hvm-*-x86_64-gp2" \
  --query "sort_by(Images, &CreationDate)[-1].ImageId" \
  --output text)
```

Now launch the instance:

```bash
aws ec2 run-instances \
  --image-id $AMI_ID \
  --count 1 \
  --instance-type t2.micro \
  --key-name your-key-name \
  --security-group-ids $SG_ID \
  --subnet-id subnet-xxxxxxxxxxxxxxxxx \
  --iam-instance-profile Name=EC2ApacheProfile \
  --user-data file://user-data.sh \
  --tag-specifications 'ResourceType=instance,Tags=[{Key=Name,Value=apache-web-server}]'
```

Replace the key name and subnet ID with your own values.

### Step 6: Get the Public IP Address

Once the instance is running, run the command below to get the public IP address:

```bash
INSTANCE_ID=$(aws ec2 describe-instances \
  --filters "Name=tag:Name,Values=apache-web-server" \
  --query "Reservations[0].Instances[0].InstanceId" \
  --output text)

PUBLIC_IP=$(aws ec2 describe-instances \
  --instance-ids $INSTANCE_ID \
  --query "Reservations[0].Instances[0].PublicIpAddress" \
  --output text)

echo "Your Apache web server is available at: http://$PUBLIC_IP"
```

Open your browser and visit:

```bash
http://<PUBLIC_IP>
```

You should see a page with the message "Hello from EC2" and a paragraph below it.

### Step 7: Connect via SSH (Optional)

You can connect to the instance via SSH to perform additional tasks or manage the server.

```bash
ssh -i ~/.ssh/your-key-pair.pem ec2-user@<PUBLIC_IP>
```

### Cleaning Up Resources

When you are done, terminate the instance and remove associated resources:

```bash
aws ec2 terminate-instances --instance-ids $INSTANCE_ID
aws ec2 wait instance-terminated --instance-ids $INSTANCE_ID
aws ec2 delete-security-group --group-id $SG_ID
```

As a best practice, keep the following points in mind when working with AWS resources:

- Use IAM roles instead of access keys on EC2.

- Restrict security group rules whenever possible.

- Automate setup with user data scripts.

- Tag your resources for easier management.

- Script repetitive workflows with the AWS CLI.

### Final Thoughts

Using the AWS CLI to deploy EC2 instances gives you speed, consistency, and automation. Once you are comfortable with this workflow, you can extend it to load balancers, auto scaling groups, and full CI/CD pipelines.

If you can deploy a web server from the terminal, you are already thinking like an infrastructure engineer.
