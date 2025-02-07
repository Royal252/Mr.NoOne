
# 🌐 Bfail


![Challenge Presentation](/images/NullCon-Goa-HackIM-CTF-2025/Bfail/challenge_presentation.png "Challenge Presentation")

## 📊 Challenge Overview
>
>| Category | Details | Additional Info |
>|----------|---------|-----------------|
>| 🏆 Event | Nullcon Goa HackIM 2025 CTF | [Event Link](https://ctf.nullcon.net/challenges#Bfail-58) |
>| 🔰 Category | Web | 🌐 |
>| 💎 Points | 500 | Out of 500 total |
>| ⭐ Difficulty | 🟢 Easy | Personal Rating: 3/10 |
>| 👤 Author | @gehaxelt | [Profile]() |
>| 🎮 Solves (At the time of flag submission)| 21 | XX% solve rate |
>| 📅 Date | 01-02-2025 | Nullcon Goa HackIM 2025 CTF Day X |
>| 🦾 Solved By | mH4ck3r0n3 | Team: QnQSec |

## 📝 Challenge Information
>To 'B' secure or to 'b' fail? Strong passwords for admins are always great, right? 
>http://52.59.124.14:5013

## 🎯 Challenge Files & Infrastructure

### Provided Files
>```yaml
>Files: None
>```

# 🔍 Initial Analysis

## First Steps
> Initially, the website appears as follows:
> 
> ![Site Presentation](/images/NullCon-Goa-HackIM-CTF-2025/Bfail/site_presentation.png "Site Presentation")
>
> While inspecting the code with `ChromeDevTools`, I found this:
> 
> ![Page Source](/images/NullCon-Goa-HackIM-CTF-2025/Bfail/source.png "Page Source")
> 
> Interesting, so by visiting `/source`, we will have the source code of the page:
> 
> ![Source Code](/images/NullCon-Goa-HackIM-CTF-2025/Bfail/source_code.png "Source Code")
> 
> As we can see, it leaks the password in bytes:
>- `\xec\x9f\xe0a\x978\xfc\xb6:T\xe2\xa0\xc9<\x9e\x1a\xa5\xfao\xb2\x15\x86\xe5$\x86Z\x1a\xd4\xca#\x15\xd2x\xa0\x0e0\xca\xbc\x89T\xc5V6\xf1\xa4\xa8S\x8a%I\xd8gI\x15\xe9\xe7$M\x15\xdc@\xa9\xa1@\x9c\xeee\xe0\xe0\xf76`
> 
>and the full password in hash:
>- `$2b$12$8bMrI6D9TMYXeMv8pq8RjemsZg.HekhkQUqLymBic/cRhiKRa3YPK`
>
> and honestly, this comment is also very interesting:
> 
> ```python
> # This is super strong! The password was generated quite securely. Here are the first 70 bytes, since you won't be able to brute-force the rest anyway...  
> 
> strongpw = bcrypt.hashpw(os.urandom(128),bcrypt.gensalt()) # >>> strongpw[:71]
> ```
> 
> As we can see, the leak is of the first 70 bytes of the password, while a total of 71 bytes are used. Let's proceed with the exploit.


## 🔬 Vulnerability Analysis
### Potential Vulnerabilities
>- [x] Partial Hash Exposure (bcrypt)

# 🎯 Solution Path

## Exploitation Steps
### Initial setup
>  The exploit was based on brute-forcing that remaining byte since `71-70=1`. That’s a total of `256` combinations (nothing too challenging for a brute force). Once completed, we have the full password, which we will obviously verify by converting it into a hash and comparing it with the previously obtained hash.
>
### Exploitation
> I wrote a Python script to do all of this, and then I executed it:
>
>```bash
> python exploit.py
> ```  
> I also sent the request directly to the server using `Http`, since a simple `GET` or `POST` returned `Method Not Allowed`. I then took the server's response, extracted the flag using a regex, and subsequently printed it.
>   
### Flag capture
>  
>   ![Manual Flag](/images/NullCon-Goa-HackIM-CTF-2025/Bfail/automated_flag.png "Manual Flag")

# 🛠️ Exploitation Process
## Approach
>The exploit literally follows the procedure described above:
> 
> - [:(far fa-file-archive fa-fw): Exploit](/resources/NullCon-Goa-HackIM-CTF-2025/Bfail/exploit.py)

# 🚩 Flag Capture
>{{< admonition danger "Flag" >}}
{{< typeit tag=h4 >}}
ENO{BCRYPT_FAILS_TO_B_COOL_IF_THE_PW_IS_TOO_LONG}
{{< /typeit >}}
>{{< /admonition >}}
>
## Proof of Execution
> ![Automated Flag](/images/NullCon-Goa-HackIM-CTF-2025/Bfail/automated_flag.png "Automated Flag")
>*Screenshot of successful exploitation*

# 🔧 Tools Used
>| Tool | Purpose |
>|------|---------|
>| Python | Exploit |

# 💡 Key Learnings
>### New Knowledge
> I discovered that if you know part of the hash with bcrypt, you can perform a brute force.
>### Skills Improved
>- [ ] Binary Exploitation
>- [ ] Reverse Engineering
>- [x] Web Exploitation
>- [x] Cryptography
>- [ ] Forensics
>- [ ] OSINT
>- [ ] Miscellaneous

---
# 📊 Final Statistics
| Metric | Value | Notes |
|--------|--------|-------|
| Time to Solve | 00:08 | From start to flag |
| Global Ranking (At the time of flag submission) | 9/535 | Challenge ranking |
| Points Earned | 500 | Team contribution |

*Created: 01-02-2025 • Last Modified: 01-02-2025*
*Author: mH4ck3r0n3 • Team: QnQSec*
