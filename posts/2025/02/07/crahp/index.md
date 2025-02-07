
# 🌐 Crahp


![Challenge Presentation](/images/NullCon-Goa-HackIM-CTF-2025/Crahp/challenge_presentation.png "Challenge Presentation")

## 📊 Challenge Overview
> 
>| Category | Details | Additional Info |
>|----------|---------|-----------------|
>| 🏆 Event | Nullcon Goa HackIM 2025 CTF | [Event Link](https://ctf.nullcon.net/challenges#Crahp-60) |
>| 🔰 Category | Web | 🌐 |
>| 💎 Points | 500 | Out of 500 total |
>| ⭐ Difficulty | 🟢 Easy | Personal Rating: 3/10 |
>| 👤 Author | @gehaxelt | [Profile]() |
>| 🎮 Solves (At the time of flag submission)| 221 | solve rate |
>| 📅 Date | 01-02-2025 | Nullcon Goa HackIM 2025 CTF |
>| 🦾 Solved By | jsnv | Team: QnQSec |

## 📝 Challenge Information
> Oh Crahp, I forgot my credentials! Can you login nontheless? http://52.59.124.14:5006

## 🎯 Challenge Files & Infrastructure

### Provided Files
>```yaml
>Files: None
>```

# 🔍 Initial Analysis

## First Steps
> Initially, the website appears as follows:
> 
> ![Site Presentation](/images/NullCon-Goa-HackIM-CTF-2025/Crahp/site_presentation.png "Site Presentation")
>
> By taking a look at the source code of the page by clicking on the `/?source` link:
> 
> ![Source Code 1](/images/NullCon-Goa-HackIM-CTF-2025/Crahp/source1.png "Source Code 2")
> ![Source Code 2](/images/NullCon-Goa-HackIM-CTF-2025/Crahp/source2.png "Source Code 2")
> 
> I noticed that a CRC (Cyclic Redundancy Check) function is used, so I researched how it works. It is an algorithm that calculates a checksum (a control value) to verify that the data hasn't been altered during transmission or storage. It works by performing mathematical operations on a string of data, generating a short code that represents the data itself. I then discovered that CRC is not cryptographically secure. The CRC16 and CRC8 functions are designed to **detect accidental errors**, not to ensure the integrity or security of the data. CRC is linear, predictable, and easily reversible: an attacker can manipulate the data to obtain the same CRC signature. The attack involves finding an alternative password with the same CRC.
> 
> - The code compares two **CRC hashes**: one of the stored password and one of the password entered by the user.
> - If both the CRC16 and CRC8 values match those of the original password, access is granted.
> - **An attacker can generate a different password with the same CRC16 and CRC8** and bypass the check.
> 
> Having understood this, let's proceed to the exploitation.

## 🔬 Vulnerability Analysis
### Potential Vulnerabilities
>- [x] CRC (Cyclic Redundancy Check) collision

# 🎯 Solution Path

## Exploitation Steps
### Initial setup
> The exploitation involves generating a password that has the same checksum as the password `AdM1nP@assW0rd!`. To do this, we simply need to calculate the CRC16 and CRC8 of the real password ("AdM1nP@assW0rd!"), then generate an alternative string with the same CRC16 and CRC8. Since CRC is linear, there are known techniques (such as manipulating the final bytes) to find collisions. The attacker could use tools like `hashclash`, brute force, or create a string of the same length as the original password but producing the same checksums. By entering the alternative string, the attacker gains access because the code only verifies the hashes and not the original password → **bypass successful!**
>
### Exploitation
> I wrote a script that does all of this, and I ran it to obtain the password with the same checksum. Afterward, I entered it in the input box and submitted it, which granted me access and, consequently, the flag.
>
### Flag capture
>  
>   ![Manual Flag](/images/NullCon-Goa-HackIM-CTF-2025/Crahp/manual_flag.png "Manual Flag")

# 🛠️ Exploitation Process
## Approach
> The exploit follows exactly the procedure described above, and then it sends the request, extracting the flag using a regex and printing it.
> 
> - [:(far fa-file-archive fa-fw): Exploit](/resources/NullCon-Goa-HackIM-CTF-2025/Crahp/exploit.py)

# 🚩 Flag Capture
>{{< admonition danger "Flag" >}}
{{< typeit tag=h4 >}}
ENO{Cr4hP_CRC_Collison_1N_P@ssw0rds!}
{{< /typeit >}}
>{{< /admonition >}}
>
## Proof of Execution
> ![Automated Flag](/images/NullCon-Goa-HackIM-CTF-2025/Crahp/automated_flag.png "Automated Flag")
>*Screenshot of successful exploitation*

# 🔧 Tools Used
>| Tool | Purpose |
>|------|---------|
>| Python | Exploit |

# 💡 Key Learnings
## New Knowledge
> I have learned what a CRC function is and how it can be exploited to find a similar string that has the same checksum to pass the checks.
## Skills Improved
>- [ ] Binary Exploitation
>- [ ] Reverse Engineering
>- [x] Web Exploitation
>- [x] Cryptography
>- [ ] Forensics
>- [ ] OSINT
>- [ ] Miscellaneous

# 📚 References & Resources
## Learning Resources
>- https://stackoverflow.com/questions/18569984/crc16-collision-2-crc-values-of-blocks-of-different-size
>- https://fastercapital.com/content/Understanding-CRC-Collision--Preventing-Data-Corruption.html

---
# 📊 Final Statistics
| Metric | Value | Notes |
|--------|--------|-------|
| Time to Solve | 00:33 | From start to flag |
| Global Ranking (At the time of flag submission)| 28/1017 | Challenge ranking |
| Points Earned | 500 | Team contribution |

*Created: 01-02-2025 • Last Modified: 01-02-2025*
*Author: mH4ck3r0n3 • Team: QnQSec*
