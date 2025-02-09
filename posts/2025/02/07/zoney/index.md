
# 🌐 ZONEy


![Challenge Presentation](/images/NullCon-Goa-HackIM-CTF-2025/ZONEy/challenge_presentation.png "Challenge Presentation")

## 📊 Challenge Overview
>
>| Category | Details | Additional Info |
>|----------|---------|-----------------|
>| 🏆 Event | Nullcon Goa HackIM 2025 CTF | [Event Link](https://ctf.nullcon.net/challenges#ZONEy-66) |
>| 🔰 Category | Web | 🌐 |
>| 💎 Points | 500 | Out of 500 total |
>| ⭐ Difficulty | 🟢 Easy | Personal Rating: 3/10 |
>| 👤 Author | @gehaxelt | [Profile]() |
>| 🎮 Solves (At the time of flag submission)| 39 | solve rate |
>| 📅 Date | 02-02-2025 | Nullcon Goa HackIM 2025 CTF |
>| 🦾 Solved By | jsnv | Team: QnQSec |

## 📝 Challenge Information
>Are you ZONEy.eno out or can you find the flag? 52.59.124.14:5007 (UDP)

## 🎯 Challenge Files & Infrastructure

### Provided Files
>```yaml
>Files: None
>```

# 🔍 Initial Analysis

## First Steps
> The challenge provides:
> 
> `52.59.124.14:5007 (UDP)`
>
> Doing an nmap scan, I discovered that there is a DNS (Domain Name System) server on port 5007, so I used dig (a DNS lookup tool) on the specified IP and port. Since the name of the challenge itself, ZONEy, is somewhat reminiscent of zone (zone transfer in DNS), I thought it could be related to that:
>
> ```bash
> dig @52.59.124.14 -p 5007 MX zoney.eno +short
> ```
>
> This command looks for the **Mail Exchange (MX) record** for `zoney.eno`. The result:
>
> `10 challenge.zoney.eno.`
>
> The result suggests that `challenge.zoney.eno` is a domain to explore further. So, searching online, I found the DNSSEC NSEC Walking vulnerability, which is used to enumerate subdomains of a network by making requests to the DNS server. **DNSSEC (Domain Name System Security Extensions)** is an extension of DNS that provides **authenticity and integrity** to DNS records, preventing attacks like **DNS Spoofing**. DNSSEC introduces new records such as **RRSIG, NSEC, and DS** to ensure the validity of DNS responses. **NSEC (Next Secure Record)** is used to demonstrate that a certain domain **does not exist**. An **NSEC record** lists the **next domain** in the DNS database, creating an ordered chain of records. If an attacker queries a non-existent domain, the DNS server responds with an **NSEC record**, revealing the next valid domain in the zone. Continuing in this way, I might be able to trace the domain where the flag is located.

## 🔬 Vulnerability Analysis
### Potential Vulnerabilities
>- [x] DNSSEC NSEC Walking

# 🎯 Solution Path

## Exploitation Steps
### Initial setup
> The next step was to query the new domain obtained from the previous `dig` command (`10 challenge.zoney.eno.`). Once I did that, I continued iterating until I reached the final domain, thus enumerating all the domains.
>
>
### Exploitation
> The exploitation is literally the process described above. As we can see from the image, I was able to find `hereisthe1377flag.zoney.eno`, where the flag was contained in the `TXT` (Text) field of the domain. Another way to achieve all of this is by using **dnsrecon**, a tool used for reconnaissance and subdomain enumeration.
>
### Flag capture
>  
> ![Manual Flag](/images/NullCon-Goa-HackIM-CTF-2025/ZONEy/manual_flag.png "Manual Flag")


# 🚩 Flag Capture
>{{< admonition danger "Flag" >}}
>{{< typeit tag=h4 >}}
>ENO{1337_FL4G_NSeC_W4LK3R}
>{{< /typeit >}}
>{{< /admonition >}}
>
## Proof of Execution
> ![Manual Flag](/images/NullCon-Goa-HackIM-CTF-2025/ZONEy/manual_flag.png "Manual Flag")
>*Screenshot of successful exploitation*

# 🔧 Tools Used
>| Tool | Purpose |
>|------|---------|
>| dig | DNS Enumeration |

# 💡 Key Learnings
## New Knowledge
>I learned what DNSSEC NSEC Walking is and how to enumerate subdomains of a DNS.
## Skills Improved
>- [ ] Binary Exploitation
>- [ ] Reverse Engineering
>- [x] Web Exploitation
>- [ ] Cryptography
>- [ ] Forensics
>- [ ] OSINT
>- [ ] Miscellaneous

# 📚 References & Resources
## Learning Resources
>- https://www.domaintools.com/resources/blog/zone-walking-zone-enumeration-via-dnssec-nsec-records/ 
>- https://hackerone.com/reports/228471

---
# 📊 Final Statistics
| Metric | Value | Notes |
|--------|--------|-------|
| Time to Solve | 00:30 | From start to flag |
| Global Ranking (At the time of flag submission)| 11/1115 | Challenge ranking |
| Points Earned | 500 | Team contribution |

*Created: 02-02-2025 • Last Modified: 02-02-2025*
*Author: mH4ck3r0n3 • Team: QnQSec*
