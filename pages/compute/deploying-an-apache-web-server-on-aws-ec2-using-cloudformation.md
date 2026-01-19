---
title: 'Deploy an Apache Web Server on AWS EC2 Using CloudFormation'
description: Learn how to deploy an Apache web server on AWS EC2 using CloudFormation.
author: Demola Malomo
authorGithub: https://github.com/Mr-Malomz
tags: ['compute', 'ec2', 'cloudformation']
category: 'Compute'
date: '2026-01-19'
---

## Deploy an Apache Web Server on AWS EC2 Using CloudFormation

_Written by_ [Demola Malomo](https://github.com/Mr-Malomz)

AWS CloudFormation allows you to define and provision AWS infrastructure using code. Instead of clicking around the AWS console every time you want a server, you describe what you need in a template, and AWS handles the rest.

In this guide, we will deploy a single EC2 instance running an Apache web server using CloudFormation. By the end, you will understand how the template works and how the EC2 instance is configured automatically during launch.

### What CloudFormation Actually Does

Normally, creating a server on AWS involves many manual steps:

- Create a security group
- Launch an EC2 instance
- Install Apache
- Open port 80
- Configure files

CloudFormation lets you describe all of this in one **text file**. AWS reads that file and creates everything for you in the correct order.

That text file is called a **CloudFormation template**. Before creating this template, there are few concepts you should understand. Let's explore them next.

### Core CloudFormation Concepts You Should Know

Before jumping into the template, it helps to understand a few basic terms. You do not need to master them yet. Just enough to follow along.

- **Template**: A YAML or JSON file that describes the AWS resources you want to create.

- **Stack**: A running instance of a template. When you deploy a template, CloudFormation creates a stack.

- **Resources**: The actual AWS services being created, such as EC2 instances, security groups, or IAM roles.

- **Parameters**: Values you pass into the template to customize it, such as instance type or VPC ID.

- **Outputs**: Values CloudFormation returns after the stack is created, like the instance ID or public URL.

- **AWS::CloudFormation::Init**: A special metadata section used to install software and configure EC2 instances.

- **Helper scripts**: Tools like `cfn-init` and `cfn-signal` that apply configurations and report success back to CloudFormation.

### What We Are Building

This template will:

- Launch an EC2 instance inside a VPC and subnet you choose
- Open ports 22 and 80 using a security group
- Install Apache automatically during boot
- Create a simple HTML page
- Output a public URL you can open in your browser

#### Step 1: Create the CloudFormation Template File.

CloudFormation does not generate the template for you. You create it yourself. You can create the template using any text editor, such as Notepad, Sublime Text, or Visual Studio Code.

To get started, create a file named `ec2-apache-stack.yaml`.

> Note that CloudFormation supports YAML and JSON. YAML is easier to read, so we will use that.

#### Step 2: Paste This Full, Correct Template

Paste everything below into the file you just created.

This template already includes all fixes and best practices needed for a first deployment.

```yaml
AWSTemplateFormatVersion: '2010-09-09'
Description: Deploy an EC2 instance with Apache using AWS CloudFormation

Parameters:
    InstanceType:
        Type: String
        Default: t3.micro
        AllowedValues:
            - t2.micro
            - t3.micro
        Description: EC2 instance type

    KeyName:
        Type: AWS::EC2::KeyPair::KeyName
        Description: Existing EC2 KeyPair for SSH access

    SSHLocation:
        Type: String
        Default: 0.0.0.0/0
        Description: IP range allowed to SSH to the instance

    VpcId:
        Type: AWS::EC2::VPC::Id
        Description: VPC where the instance will be deployed

    SubnetId:
        Type: AWS::EC2::Subnet::Id
        Description: Subnet where the instance will be deployed

Resources:
    WebServerSecurityGroup:
        Type: AWS::EC2::SecurityGroup
        Properties:
            GroupDescription: Allow HTTP and SSH access
            VpcId: !Ref VpcId
            SecurityGroupIngress:
                - IpProtocol: tcp
                  FromPort: 22
                  ToPort: 22
                  CidrIp: !Ref SSHLocation
                - IpProtocol: tcp
                  FromPort: 80
                  ToPort: 80
                  CidrIp: 0.0.0.0/0

    WebServerRole:
        Type: AWS::IAM::Role
        Properties:
            AssumeRolePolicyDocument:
                Version: '2012-10-17'
                Statement:
                    - Effect: Allow
                      Principal:
                          Service: ec2.amazonaws.com
                      Action: sts:AssumeRole
            ManagedPolicyArns:
                - arn:aws:iam::aws:policy/AmazonSSMManagedInstanceCore
            Path: /

    WebServerInstanceProfile:
        Type: AWS::IAM::InstanceProfile
        Properties:
            Path: /
            Roles:
                - !Ref WebServerRole

    WebServerInstance:
        Type: AWS::EC2::Instance
        DependsOn: WebServerInstanceProfile
        Metadata:
            AWS::CloudFormation::Init:
                config:
                    packages:
                        yum:
                            httpd: []
                    files:
                        /var/www/html/index.html:
                            content: |
                                <html>
                                  <head>
                                    <title>Apache on EC2</title>
                                  </head>
                                  <body>
                                    <h1>Apache is running</h1>
                                    <p>This server was deployed using AWS CloudFormation.</p>
                                  </body>
                                </html>
                            mode: '000644'
                            owner: root
                            group: root
                    services:
                        sysvinit:
                            httpd:
                                enabled: true
                                ensureRunning: true
        Properties:
            InstanceType: !Ref InstanceType
            KeyName: !Ref KeyName
            SubnetId: !Ref SubnetId
            SecurityGroupIds:
                - !Ref WebServerSecurityGroup
            IamInstanceProfile: !Ref WebServerInstanceProfile
            ImageId: !Sub '{{resolve:ssm:/aws/service/ami-amazon-linux-latest/amzn2-ami-hvm-x86_64-gp2}}'
            UserData:
                Fn::Base64: !Sub |
                    #!/bin/bash
                    yum update -y
                    yum install -y aws-cfn-bootstrap
                    /opt/aws/bin/cfn-init -v --stack ${AWS::StackName} --resource WebServerInstance --region ${AWS::Region}
                    systemctl restart httpd

Outputs:
    WebsiteURL:
        Description: Public URL of the Apache web server
        Value: !Sub http://${WebServerInstance.PublicDnsName}

    InstanceId:
        Description: EC2 Instance ID
        Value: !Ref WebServerInstance
```

I know this is a lot to take in, but don't worry. We will break it down step by step. At a high level, the template is divided into:

- Parameters for customization
- Resources such as the EC2 instance and security group
- Metadata used to install Apache
- Outputs that show useful information after deployment

**Parameters Section**

This is where CloudFormation asks you for values during deployment.

You will be prompted to:

- Choose an EC2 instance type
- Select an existing key pair
- Choose a VPC and subnet
- Specify which IP can SSH into the server

You do not hardcode these values.

**Security Group**

The security group:

- Allows SSH on port 22
- Allows web traffic on port 80

Without this, the server would exist but be unreachable.

**IAM Role and Instance Profile**

These allow the EC2 instance to:

- Use AWS helper scripts
- Be managed via Systems Manager

No passwords or keys are stored on the server.

**EC2 Instance and Apache Setup**

This is where you might get confused, so here is the flow in plain language:

1. EC2 starts
2. UserData runs first
3. UserData installs CloudFormation helper tools
4. `cfn-init` reads the `AWS::CloudFormation::Init` section
5. Apache is installed
6. A web page is created
7. Apache is started

Remember that nothing is manual.

**AMI Selection**

Instead of hardcoding AMI IDs, this template pulls the latest Amazon Linux 2 AMI automatically using SSM.
This avoids broken templates when AWS updates AMIs.

**Outputs**

After deployment, CloudFormation shows:

- A clickable website URL
- The EC2 instance ID

#### Step 3: Deploy the Stack

You can deploy the stack using either the AWS Console or the AWS CLI. If you are new to CloudFormation, the console is usually easier the first time.

##### Deploying via the AWS Management Console

1. Open the AWS Console and go to [CloudFormation](https://console.aws.amazon.com/cloudformation/?utm_source=techeasydoc&utm_medium=referral&utm_campaign=aws_techeasydoc).
2. Click **Create stack**, then choose **With new resources**.
3. Upload your `ec2-apache-stack.yaml` file.
4. Give the stack a name, for example `apache-web-server`.
5. Fill in the required parameters:
    - Choose an instance type
    - Select an existing EC2 key pair
    - Choose a VPC and subnet
    - Restrict SSH access to your IP if possible

6. Review the settings and create the stack.

CloudFormation will begin creating resources immediately.

##### Deploying via the AWS CLI

Before running the command below, make sure you have the AWS CLI installed and configured:

1.  **Install the AWS CLI**: Follow the [official instructions](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html?utm_source=techeasydoc&utm_medium=referral&utm_campaign=aws_techeasydoc) for your operating system.
2.  **[Configure Credentials](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-quickstart.html?utm_source=techeasydoc&utm_medium=referral&utm_campaign=aws_techeasydoc)**: Run `aws configure` and enter your Access Key, Secret Key, and default Region.
3.  **Verify**: Run `aws sts get-caller-identity` to confirm you are authenticated.

Once ready, run the following command to create the stack:

```bash
aws cloudformation create-stack \
  --stack-name apache-web-server \
  --template-body file://ec2-apache-stack.yaml \
  --parameters \
    ParameterKey=InstanceType,ParameterValue=t2.micro \
    ParameterKey=KeyName,ParameterValue=your-key-name \
    ParameterKey=SSHLocation,ParameterValue=your-ip-address/32 \
    ParameterKey=VpcId,ParameterValue=your-vpc-id \
    ParameterKey=SubnetId,ParameterValue=your-subnet-id \
  --capabilities CAPABILITY_IAM
```

---

#### Step 4: Monitor Stack Creation

While the stack is being created:

1. Open the stack in the CloudFormation console
2. Check the **Events** tab to see progress
3. Wait until the status changes to `CREATE_COMPLETE`

If something fails, the Events tab will usually explain why.

#### Step 5: Access the Web Server

Once the stack completes:

- Go to the **Outputs** tab
- Copy the `WebsiteURL`
- Paste it into your browser

You should see the Apache welcome page generated by the template.

#### Step 6: Deploy Your Own Application (Optional)

You can extend this template depending on what you want to host.

- **Static websites**: Add more files to the `configure_apache` section.

- **PHP applications**: Install PHP using `AWS::CloudFormation::Init` and place PHP files under `/var/www/html`.

- **Node.js applications**: Install Node.js in `UserData` and run your application as a service.

- **Clone from Git**: Install Git and clone your repository during boot.


#### Step 7: Clean Up

When you no longer need the server, delete the stack. Deleting the stack removes all resources created by it, including the EC2 instance and security group.


### CloudFormation Best Practices

Below are some best practices to follow when using CloudFormation:

- Use `AWS::CloudFormation::Init` for software setup instead of large UserData scripts
- Avoid hardcoding credentials, always use IAM roles
- Restrict SSH access to trusted IPs
- Use change sets before updating production stacks
- Separate long-lived resources and short-lived resources into different stacks

### Conclusion

Using CloudFormation to deploy EC2 with Apache removes guesswork from infrastructure setup. Once the template works, you can reuse it, version it, and extend it without repeating manual steps.

This approach is especially useful as your infrastructure grows or when you want consistent environments across teams and projects.
