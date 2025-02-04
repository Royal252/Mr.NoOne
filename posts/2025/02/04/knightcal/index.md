# KnightCal

<!--more-->
# 🌐 KnightCal

![Challenge Presentation](/images/KnightCTF-2025/KnightCal/challenge_presentation.png "Challenge Presentation")

>## 📊 Challenge Overview
>
>| Category | Details | Additional Info |
>|----------|---------|-----------------|
>| 🏆 Event | KnightCTF - 2025 | [Event Link](https://2025.knightctf.com/challenges#KnightCal-25) |
>| 🔰 Category | Web | 🌐 |
>| 💎 Points | 150 | Out of XXXX total |
>| ⭐ Difficulty | 🟢 Easy | Personal Rating: 1/10 |
>| 👤 Author | NomanProdhan | [Profile]() |
>| 🎮 Solves | 269 | XX% solve rate |
>| 📅 Date | 20-01-2025 | KnightCTF - 2025 Day X |
>| 🦾 Solved By | mH4ck3r0n3 | Team: QnQSec |

## 📝 Challenge Information

>In the realm of ancient codes, only those who enumerate correctly can unveil the hidden flag. Craft your mathematical expressions wisely and uncover the secrets that lie within.  
>
>Flag Format: KCTF{FLaG_HeRe}

## 🎯 Challenge Files & Infrastructure

>### Provided Files
>```yaml
>Files: None
>```

## 🔍 Initial Analysis

>### First Steps
> Initially, the website appears as follows:
> 
> ![Site Presentation](/images/KnightCTF-2025/KnightCal/site_presentation.png "Site Presentation")
> 
> by trying to enter something in the numeric input box and submitting, I get letters in the file name:
> 
> ![Submit Try](/images/KnightCTF-2025/KnightCal/step_1.png "Submit Try")
> 
> so, I assume it's about finding the correct combination to print the contents of the file `flag.txt`. 

## 🎯 Solution Path

>### Exploitation Steps
>>#### Initial setup
>   
> After understanding how it works, I moved on to the exploit, doing a bit of guessing on the letters to figure out which number corresponded to which letter.
>
>>#### Exploitation
>   
> After a couple of attempts, I came up with this:
>   
>   ![Second Attempt](/images/KnightCTF-2025/KnightCal/step_2.png "Second Attempt")
>   
> continuing to experiment, I found the correct combination, `7195`, which allowed me to read the `flag.txt` file.
>
>>#### Flag capture
>  
>   ![Manual Flag](/images/KnightCTF-2025/KnightCal/manual_flag.png "Manual Flag")

## 🛠️ Exploitation Process
>### Approach
> The exploit is very simple: it's a POST request to the page where I pass the parameter expression=7195, which is the correct combination. Then, I extract the flag from the response text using bs4:
> 
> - [exploit](/resources/KnightCTF-2025/KnightCal/exploit.py)

## 🚩 Flag Capture

>```
> KCTF{_c0ngR4t5_KNIGHT_f1naLLy_Y0U_g07_tH3_r1gh7_m4tH_}
>```
>
>### Proof of Execution
> ![Automated Flag](/images/KnightCTF-2025/KnightCal/automated_flag.png "Automated Flag")
>*Screenshot of successful exploitation*

## 🔧 Tools Used

>### Primary Tools
>| Tool | Purpose |
>|------|---------|
>| Python | Exploit |

## 💡 Key Learnings
>### Skills Improved
>- [ ] Binary Exploitation
>- [ ] Reverse Engineering
>- [x] Web Exploitation
>- [ ] Cryptography
>- [ ] Forensics
>- [ ] OSINT
>- [ ] Miscellaneous

---
## 📊 Final Statistics

| Metric | Value | Notes |
|--------|--------|-------|
| Time to Solve | 00:04 | From start to flag |
| Global Ranking | 9/445 | Challenge ranking |
| Points Earned | 150 | Team contribution |

*Created: 20-01-2025 • Last Modified: 20-01-2025*
*Author: mH4ck3r0n3 • Team: QnQSec*
