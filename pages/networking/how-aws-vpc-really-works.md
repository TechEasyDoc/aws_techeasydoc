---
title: 'How AWS VPC Really Works: Routing, NAT, and Traffic Flow Explained'
description: 'Learn how AWS VPC really works: routing, NAT, and traffic flow explained'
author: Demola Malomo
authorGithub: https://github.com/Mr-Malomz
tags: ['networking', 'aws', 'vpc']
category: 'Networking'
date: '2026-02-22'
---

## How AWS VPC Really Works: Routing, NAT, and Traffic Flow Explained

_Written by_ [Demola Malomo](https://github.com/Mr-Malomz)

When you spin up resources in AWS, they don't just float in the cloud. They live inside a **Virtual Private Cloud (VPC)**. Think of this as your own private network inside AWS.

To use AWS networking well, you need to understand how a VPC is structured and how traffic actually moves around inside it.

Let’s walk through it step by step, and to make everything stick, we'll use one analogy throughout: **your VPC is a private office building**.

### The VPC: Your Private Office Building

Imagine AWS as a massive **business park** with thousands of buildings and all sorts of companies. When you create a VPC, you're setting up **your own private office building** inside that park.

Other companies (AWS accounts) have their own buildings too, but they can't just walk into yours. Each building has its own rules and the isolation is absolute.

By itself, a VPC is just an empty building with an address range you define (like `10.0.0.0/16`). It is similar to saying, _"My building has room numbers 1 through 65,536."_

However, when the building is created, it is sealed off from the outside world. Nothing can talk to the outside world yet. All the components we will discuss next (subnets, route tables, gateways) are what you build inside to make it functional.

### Subnets: Floors and Departments

You wouldn't throw every employee onto the same floor, right? You'd organize them like this:

- Engineering on one floor
- HR on another
- The exec suite somewhere else

That's exactly what **subnets** do. A subnet is a segment of your VPC's IP range, placed in a specific **Availability Zone** (think of it like a wing of the building). You create subnets to group resources based on function and resilience.

A typical setup looks like this:

- **Public subnet** — The floor with windows and a front entrance facing the street. Resources here (like a load balancer) need direct inbound/outbound internet access.
- **Private subnet** — An internal floor with no outside entrance. Resources here (like app servers and databases) should not be directly reachable from the internet.

**Important:** A subnet's "public" or "private" designation is not a built-in property. It's determined solely by its route table. More on that next.

### Route Tables: The Directory Signs

Ever walk into a building and see those directory boards? _"Floor 3 → Turn left. Exit → Straight ahead."_

That's a **route table**. Every subnet must be associated with one. It's a simple set of rules that answer the question: _"For traffic going to destination X, send it to target Y."_

When you create a VPC, you get a default **main route table** with one local route:

```js
Destination: 10.0.0.0/16    Target: local
```

This route allows all resources within the building to talk to each other. It cannot be removed.

To make a subnet "public," you add a route that points to the front door:

```js
Destination: 0.0.0.0/0      Target: igw-xxxxxxxx
```

Here, `0.0.0.0/0` means "everywhere else" (all IPv4 addresses), and the target is an **Internet Gateway**. A subnet with this route is a **public subnet**. A subnet without it (or one that points elsewhere) is a **private subnet**.

The key insight is that:

- Subnet with a route to an Internet Gateway → **public subnet**
- Subnet without that route → **private subnet**

### Gateways: The Front Door and the Mail Slot

Your building needs ways to communicate with the outside world. There are two main options and they serve very different purposes.

#### Internet Gateway (IGW): The Front Door

The **Internet Gateway** is the front door of your building; the one that opens to the main street. It connects your VPC to the public internet. It allows:

1. Resources with public IPs on a **public floor** to be directly reachable from the internet.
2. Outbound traffic from those resources to reach the internet, performing 1:1 Network Address Translation (NAT) for them.

Without it, your building is completely sealed off. In other words, it enables full two-way communication.

#### NAT Gateway: The One-Way Mail Slot

A NAT Gateway is used when private resources need outbound internet access, but should not accept inbound connections.

A common scenario is when your database sits on a private floor (no public exposure). But it needs to download software updates or call an external API. How does it reach the internet without opening a door?

This is where the **NAT Gateway** comes in handy. Basically, it allows resources in private subnets to initiate outbound connections to the internet, but prevents unsolicited inbound connections from the internet.

Here's how it works:

1. The NAT Gateway sits in a public subnet.

2. Private subnets route internet traffic to the NAT Gateway.

3. The NAT Gateway sends the request to the internet through the Internet Gateway.

4. Responses come back through the NAT Gateway and are forwarded to the private resource.

From the internet’s perspective, only the NAT Gateway is visible. The private instances stay hidden.

> **Heads up:** NAT Gateways cost money. They're billed per hour and per GB of data processed.

### Security Layers: Guards and Checkpoints

Every good building has layered security. In a VPC, you get two layers and understanding how they differ is important.

#### Security Groups: The Guard at Each Office Door

Each office in your building has its own security guard. That's a **Security Group**. It's applied directly to a resource's network interface (ENI).

Security Groups are **stateful**. If the guard lets someone in, they automatically remember that person and let them leave.

This is your **primary firewall**. It's where you define application-level access, like _"allow TCP 443 from the load balancer's Security Group"_ or _"allow SSH from my IP."_

Example — allow HTTP traffic on port 80 from anywhere:

| Type | Protocol | Port | Source      |
| ---- | -------- | ---- | ----------- |
| HTTP | TCP      | 80   | `0.0.0.0/0` |

#### NACLs: The Checkpoint at Each Floor

While Security Groups guard individual offices, **Network ACLs (NACLs)** act as the security checkpoint at each floor's elevator lobby. They apply to the **entire subnet** and every resource on that floor goes through the same checkpoint.

NACLs are **stateless**. This means the checkpoint doesn't remember faces. If you allow traffic in, you must _also_ explicitly allow the response out. Every packet is checked independently, every single time.

Rules are **processed in numerical order** until a match is found, with an explicit default rule (`*`) that denies everything else.

Below is a full comparison between Security Groups and NACLs:

| Feature              | Security Group                   | NACL                                           |
| -------------------- | -------------------------------- | ---------------------------------------------- |
| **Scope**            | Instance (ENI) level             | Subnet level                                   |
| **Stateful?**        | Yes. Return traffic auto-allowed | No. Must explicitly allow return traffic       |
| **Rule evaluation**  | All rules evaluated, then decide | Processed in numerical order, first match wins |
| **Rule type**        | Allow only                       | Allow **and** Deny                             |
| **Default behavior** | Implicit deny all                | Explicit default rule to deny                  |
| **Use case**         | Primary app-level firewall       | Coarse-grained subnet-wide safety net          |

In practice, Security Groups are your main tool. NACLs are typically left at their default permissive setting (allow all in/out) unless you have a specific subnet-level requirement.

### VPC Peering: The Private Skybridge

What if you have two buildings; one for production and another for staging, and they need to connect to each other?

You could route traffic through the public street, but that's slow and insecure. Instead, you build a **VPC Peering Connection** (like a private skybridge) between the two buildings.

Traffic flows directly over AWS's private backbone. No internet exposure, low latency, and it works across AWS accounts and even regions.

> **One catch:** VPC peering is **not transitive**. If Building A has a skybridge to Building B, and Building B has one to Building C. A can't automatically reach C. You'd need a direct skybridge between A and C (or consider AWS Transit Gateway for hub-and-spoke setups).

### Putting It All Together: Following a Packet

Let's trace exactly what happens when a web server on a private floor needs to fetch a patch from the internet. This is where all the pieces connect.

1. **The web server** (`10.0.2.10`, private subnet) initiates a request to `download.example.com`.
2. **Route table check:** The private subnet's route table is consulted. The `0.0.0.0/0` route points to the NAT Gateway (`10.0.1.100`).
3. **Security Group check:** The web server's SG must allow outbound traffic to the destination.
4. **NACL check (outbound):** The private subnet's NACL outbound rules must allow traffic from `10.0.2.10` to the internet.
5. **NAT Gateway:** Receives the packet, translates the source IP from `10.0.2.10` to its own public IP, and forwards it.
6. **Public subnet routing:** The NAT Gateway lives on a public floor. Its route table sends `0.0.0.0/0` to the IGW (the front door).
7. **Internet Gateway:** Routes the packet to the public internet.
8. **Return traffic:** The response arrives at the NAT Gateway's public IP. The IGW passes it to the NAT Gateway, which remembers the original mapping, translates the destination IP back to `10.0.2.10`, and sends it into the private subnet.
9. **NACL check (inbound):** The private subnet's NACL must allow the return traffic in.
10. **Security Group (auto-allow):** The web server's SG, being stateful, automatically allows the response because it matched the initial outbound request.

That's the full journey that every packet runs through (route tables, NACLs, and SGs) before reaching its destination.

### Wrapping Up

A [VPC](https://aws.amazon.com/vpc/?utm_source=aws_techeasydoc&utm_medium=referral&utm_campaign=aws_techeasydoc) might seem intimidating at first, but once you map it to a private office building, the pieces fall into place:

- **VPC** = Your private building
- **Subnets** = Floors and departments
- **Route Tables** = Directory signs (and the true decider of "public" vs. "private")
- **Internet Gateway** = The front door
- **NAT Gateway** = A one-way mail slot
- **Security Groups** = Guards at each office door (stateful, your primary firewall)
- **NACLs** = Floor-level checkpoints (stateless, your safety net)
- **VPC Peering** = Private skybridges between buildings

The next time you're setting up a VPC, think about it like designing a building. Where do you want your front door? Which floors should be public? Where do the guards sit? Answer those questions, and your VPC architecture will make a lot more sense.
