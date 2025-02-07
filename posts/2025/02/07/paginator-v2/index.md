
# 🌐 Paginator V2


![Challenge Presentation](/images/NullCon-Goa-HackIM-CTF-2025/Paginatorv2/challenge_presentation.png "Challenge Presentation")

## 📊 Challenge Overview
>
>| Category | Details | Additional Info |
>|----------|---------|-----------------|
>| 🏆 Event | Nullcon Goa HackIM 2025 CTF | [Event Link](https://ctf.nullcon.net/challenges#Paginator%20v2-91) |
>| 🔰 Category | Web | 🌐 |
>| 💎 Points | 500 | Out of 500 total |
>| ⭐ Difficulty | 🟢 Easy | Personal Rating: 1/10 |
>| 👤 Author | @gehaxelt | [Profile]() |
>| 🎮 Solves (At the time of flag submission)| 194 | solve rate |
>| 📅 Date | 02-02-2025 | Nullcon Goa HackIM 2025 CTF |
>| 🦾 Solved By | mH4ck3r0n3 | Team: QnQSec |

## 📝 Challenge Information
>Ok, we moved the critical information to a different table now... Can't go wrong this time, right?
>http://52.59.124.14:5015

## 🎯 Challenge Files & Infrastructure

### Provided Files
>```yaml
>Files: None
>```

# 🔍 Initial Analysis

## First Steps
> This is version 2 of the challenge [Paginator](https://mh4ck3r0n3.github.io/posts/2025/02/07/paginator/). The website appears as follows:
> 
> ![Site Presentation](/images/NullCon-Goa-HackIM-CTF-2025/Paginatorv2/site_presentation.png "Site Presentation")
>
> Looking at the source of the page:
> 
> ![Source Code](/images/NullCon-Goa-HackIM-CTF-2025/Paginatorv2/source.png "Source Code")
> 
> I noticed that the flag is no longer present in the `pages` table, unlike the previous challenge `Paginator`, so it is no longer possible to view it using `OR 1=1` since the query retrieves records from the `pages` table. Therefore, I thought of using a `UNION` to perform the injection.

## 🔬 Vulnerability Analysis
### Potential Vulnerabilities
>- [x] SQL Injection

# 🎯 Solution Path

## Exploitation Steps
### Initial setup
> The first step is to figure out which table contains the flag since it is no longer in the `pages` table. The first thing that comes to mind is that a table named `flag` might have been created specifically.
>
### Exploitation
>Indeed, by proceeding with the exploitation and sending `/p?=2,10 UNION SELECT * FROM flag`, I obtain the row containing the flag in base64 format.
>
>  ![Flag Base64](/images/NullCon-Goa-HackIM-CTF-2025/Paginatorv2/flag_base64.png "Flag Base64")
>  
> By decoding it:
>  
>  ```bash
>   echo RU5Pe1NRTDFfVzF0aF8wdVRfQzBtbTRfVzBya3NfU29tZUhvd19BZ0Exbl9BbmRfQWc0MW4hfQ== | base64 -d
>  ```
>  
> I obtain the flag.
>
### Flag capture
>  
>   ![Manual Flag](/images/NullCon-Goa-HackIM-CTF-2025/Paginatorv2/manual_flag.png "Manual Flag")

# 🛠️ Exploitation Process
## Approach
> The exploit sends a request leveraging SQL Injection and extracts the flag from the response text using a regex.
> 
> - [:(far fa-file-archive fa-fw): Exploit](/resources/NullCon-Goa-HackIM-CTF-2025/Paginatorv2/exploit.py)

# 🚩 Flag Capture
>{{< admonition danger "Flag" >}}
{{< typeit tag=h4 >}}
ENO{SQL1_W1th_0uT_C0mm4_W0rks_SomeHow_AgA1n_And_Ag41n!}
{{< /typeit >}}
>{{< /admonition >}}
>
## Proof of Execution
> ![Automated Flag](/images/NullCon-Goa-HackIM-CTF-2025/Paginatorv2/automated_flag.png "Automated Flag")
>*Screenshot of successful exploitation*

# 🔧 Tools Used
>| Tool | Purpose |
>|------|---------|
>| Python | Exploit |

# 💡 Key Learnings
## Skills Improved
>- [ ] Binary Exploitation
>- [ ] Reverse Engineering
>- [x] Web Exploitation
>- [ ] Cryptography
>- [ ] Forensics
>- [ ] OSINT
>- [ ] Miscellaneous

---
# 📊 Final Statistics
| Metric | Value | Notes |
|--------|--------|-------|
| Time to Solve | 00:20 | From start to flag |
| Global Ranking (At the time of flag submission)| 11/1115 | Challenge ranking |
| Points Earned | 500 | Team contribution |

*Created: 02-02-2025 • Last Modified: 02-02-2025*
*Author: mH4ck3r0n3 • Team: QnQSec*

