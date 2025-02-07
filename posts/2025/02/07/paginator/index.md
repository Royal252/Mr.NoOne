
# 🌐 Paginator


![Challenge Presentation](/images/NullCon-Goa-HackIM-CTF-2025/Paginator/challenge_presentation.png "Challenge Presentation")

## 📊 Challenge Overview
>
>| Category | Details | Additional Info |
>|----------|---------|-----------------|
>| 🏆 Event | Nullcon Goa HackIM 2025 CTF | [Event Link](https://ctf.nullcon.net/challenges#Paginator-90) |
>| 🔰 Category | Web | 🌐 |
>| 💎 Points | 500 | Out of 500 total |
>| ⭐ Difficulty | 🟢 Easy | Personal Rating: 1/10 |
>| 👤 Author | @gehaxelt | [Profile]() |
>| 🎮 Solves (At the time of flag submission)| 257 | solve rate |
>| 📅 Date | 01-02-2025 | Nullcon Goa HackIM 2025 CTF |
>| 🦾 Solved By | mH4ck3r0n3 | Team: QnQSec|

## 📝 Challenge Information
>There can't much go wrong with pagination, right? http://52.59.124.14:5012

## 🎯 Challenge Files & Infrastructure

### Provided Files
>```yaml
>Files: None
>```

# 🔍 Initial Analysis

## First Steps
> Initially, the website appears as follows:
> 
> ![Site Presentation](/images/NullCon-Goa-HackIM-CTF-2025/Paginator/site_presentation.png "Site Presentation")
>
> When I clicked on `show pages 2,10`, it showed me the rows from the database by setting the parameter `p=2,10`. Then, I decided to click the link to the source, which directed me to `/?source`:
> 
> ![Source Code](/images/NullCon-Goa-HackIM-CTF-2025/Paginator/source.png "Source Code")
> 
> I saved the source in the file `source.php`. As we can see, a QUERY is made that retrieves all the pages by setting a minimum and maximum ID based on the parameter `p` we pass. Let's move on to the exploitation.


## 🔬 Vulnerability Analysis
### Potential Vulnerabilities
>- [x] SQL Injection

# 🎯 Solution Path

## Exploitation Steps
### Initial setup
>As we can notice, there is a check on the minimum value, so when passing `/?p=1,10 OR 1=1`, I get `this post is not accessible`. Therefore, I need to bypass that check, perhaps by setting the minimum value to `2`, for example.
>
### Exploitation
> Indeed, the exploit payload is exactly as follows: `/?p=2,10 OR 1=1`. The query would then be: `SELECT * FROM pages WHERE id>= 2 AND id<= 10 OR 1=1` By setting the minimum value to 2, we bypass the check. Using `OR 1=1` ensures that the query returns all the pages, so the page with the flag will also be displayed.
>  
>  ![Flag Base64](/images/NullCon-Goa-HackIM-CTF-2025/Paginator/flag.png "Flag Base64")
>  
>  As we can see from the source, the flag is encoded in `base64`. So, using the terminal, I perform the decode and obtain the flag:
>  
>  ```bash
>  echo "RU5Pe1NRTDFfVzF0aF8wdVRfQzBtbTRfVzBya3NfU29tZUhvdyF9" | base64 -d
>  ```
>
### Flag capture
>  
>   ![Manual Flag](/images/NullCon-Goa-HackIM-CTF-2025/Paginator/manual_flag.png "Manual Flag")

# 🛠️ Exploitation Process
## Approach
>The exploit sends the request with the SQL Injection payload as the `p` parameter, and then it extracts the flag in `base64` format using a regex and decodes it.
> 
> - [:(far fa-file-archive fa-fw): Exploit](/resources/NullCon-Goa-HackIM-CTF-2025/Paginator/exploit.py)

# 🚩 Flag Capture
>{{< admonition danger "Flag" >}}
{{< typeit tag=h4 >}}
ENO{SQL1_W1th_0uT_C0mm4_W0rks_SomeHow!}
{{< /typeit >}}
>{{< /admonition >}}
>
## Proof of Execution
> ![Automated Flag](/images/NullCon-Goa-HackIM-CTF-2025/Paginator/automated_flag.png "Automated Flag")
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
| Metric         | Value  | Notes              |
| -------------- | ------ | ------------------ |
| Time to Solve  | 00:02  | From start to flag |
| Global Ranking | 23/595 | Challenge ranking  |
| Points Earned  | 500    | Team contribution  |

*Created: 01-02-2025 • Last Modified: 01-02-2025*
*Author: mH4ck3r0n3 • Team: QnQSec

