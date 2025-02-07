
# 🌐 Numberizer


![Challenge Presentation](/images/NullCon-Goa-HackIM-CTF-2025/Numberizer/challenge_presentation.png "Challenge Presentation")

## 📊 Challenge Overview
>
>| Category | Details | Additional Info |
>|----------|---------|-----------------|
>| 🏆 Event | Nullcon Goa HackIM 2025 CTF | [Event Link](https://ctf.nullcon.net/challenges#Numberizer-61) |
>| 🔰 Category | Web | 🌐 |
>| 💎 Points | 500 | Out of 500 total |
>| ⭐ Difficulty | 🟢 Easy | Personal Rating: 1/10 |
>| 👤 Author | @gehaxelt | [Profile]() |
>| 🎮 Solves (At the time of flag submission)| 194 | solve rate |
>| 📅 Date | 01-02-2025 | Nullcon Goa HackIM 2025 CTF |
>| 🦾 Solved By | mH4ck3r0n3 | Team: QnQSec |

## 📝 Challenge Information
>Are you good with numbers? 
>http://52.59.124.14:5004

## 🎯 Challenge Files & Infrastructure

### Provided Files
>```yaml
>Files: None
>```

# 🔍 Initial Analysis

## First Steps
> Initially, the website appears as follows:
> 
> ![Site Presentation](/images/NullCon-Goa-HackIM-CTF-2025/Numberizer/site_presentation.png "Site Presentation")
>
> Let's take a look at the source code by clicking on the link:
> 
> ![Source Code](/images/NullCon-Goa-HackIM-CTF-2025/Numberizer/source.png "Source Code")
> 
> As we can see, it is written in `php`, and we need to calculate a negative sum in order to access the flag. The numbers entered must be numeric and have a maximum of 4 digits, as we can see from the checks.

## 🔬 Vulnerability Analysis
### Potential Vulnerabilities
>- [x] Integer Overflow

# 🎯 Solution Path

## Exploitation Steps
### Initial setup
> Here, once we understand that we can exploit an Integer Overflow, by exceeding the maximum number we will cause the overflow, resulting in a negative number.
>
### Exploitation
> The exploit consists in sending numbers like `9e99`, which is equivalent to `9^99`. Since the maximum number of digits allowed is 4, by exploiting the exponential notation, we can trigger the integer overflow.
>
>  ![Exploit](/images/NullCon-Goa-HackIM-CTF-2025/Numberizer/exploit.png "Exploit")
> 
> And as a result, we obtain the flag.
>
### Flag capture
>  
>   ![Manual Flag](/images/NullCon-Goa-HackIM-CTF-2025/Numberizer/manual_flag.png "Manual Flag")

# 🛠️ Exploitation Process
## Approach
>The exploit follows the same procedure mentioned above and extracts the flag using a regex.
> 
> - [:(far fa-file-archive fa-fw): Exploit](/resources/NullCon-Goa-HackIM-CTF-2025/Numberizer/exploit.py)

# 🚩 Flag Capture
>{{< admonition danger "Flag" >}}
{{< typeit tag=h4 >}}
ENO{INTVAL_IS_NOT_ALW4S_P0S1TiV3!}
{{< /typeit >}}
>{{< /admonition >}}
>
## Proof of Execution
> ![Automated Flag](/images/NullCon-Goa-HackIM-CTF-2025/Numberizer/automated_flag.png "Automated Flag")
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
| Time to Solve | 00:01 | From start to flag |
| Global Ranking (At the time of flag submission)| 27/686 | Challenge ranking |
| Points Earned | 500 | Team contribution |

*Created: 01-02-2025 • Last Modified: 01-02-2025*
*Author: mH4ck3r0n3 • Team: QnQSec*
