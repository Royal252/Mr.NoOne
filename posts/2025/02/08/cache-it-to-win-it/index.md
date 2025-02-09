
# 🌐 Cache It to Win It!


![Challenge Presentation](/images/LaCTF-2025/Cache-It-To-Win-It/challenge_presentation.png "Challenge Presentation")

## 📊 Challenge Overview
>| Category | Details | Additional Info |
>|----------|---------|-----------------|
>| 🏆 Event | LaCTF - 2025 | [Event Link](https://platform.lac.tf/challs) |
>| 🔰 Category | Web | 🌐 |
>| 💎 Points | 500 | Out of 500 total |
>| ⭐ Difficulty | 🟢 Easy | Personal Rating: 3/10 |
>| 👤 Author | burturt | [Profile]() |
>| 🎮 Solves (At the time of flag submission)| 22 | solve rate |
>| 📅 Date | 08-02-2025 | LaCTF - 2025 |
>| 🦾 Solved By | mH4ck3r0n3 | Team: QnQSec |


## 📝 Challenge Information
>Are YOU today's unlucky contestant in Cache! It! To! Win! It???????  Find out below!  
>cache-it-to-win-it.chall.lac.tf  
>Note: do NOT perform any sort of denial-of-service attack against the web server or databases, directly or indirectly.

## 🎯 Challenge Files & Infrastructure

### Provided Files
>Files: 
>- [:(far fa-file-archive fa-fw): Attached Files](https://drive.google.com/file/d/18ggnHZ_-Lc4Ci5sRCzkaRKJzr1ua8yiv/view?usp=drive_link)

# 🔍 Initial Analysis

## First Steps
> Initially, the website appears as follows:
> 
> ![Site Presentation](/images/LaCTF-2025/Cache-It-To-Win-It/site_presentation.png "Site Presentation")
>
> By taking a look at the attached files, I understood that the Flask application has a mechanism to assign unique UUIDs to users and allows them to check their progress to earn a reward (a "flag"). However, some vulnerabilities allow attackers to manipulate the UUIDs and bypass the caching system and the database to speed up the process. The `normalize_uuid` function mishandles the UUIDs, introducing inconsistencies, especially with the use of invisible characters (like zero-width characters). Manipulated UUIDs can pass the normalization and create different variants for the same key:
> 
> ```python
> def normalize_uuid(uuid: str):
>    uuid_l = list(uuid)
>    for i in range(len(uuid)):
>        uuid_l[i] = uuid_l[i].upper()
>        if uuid_l[i] == "-":
>            uuid_l.pop(i)
>            uuid_l.append(" ")
>
>    return "".join(uuid_l)
>
> ```
> I noticed that simply adding a URL-encoded space character `%20` was enough to have a new valid `UUID`:
> 
> ![Crafted UUID](/images/LaCTF-2025/Cache-It-To-Win-It/new_uuid.png "Crafted UUID")
> 
> As we can see, this generates a valid `UUID`, and since it’s a different key, the cache check fails, allowing us to win. I continued adding `%20`, but I noticed that a maximum of `13` wins can be achieved with this technique, so I started looking for other ways to exploit this vulnerability. In fact, as we can see from the following lines of code:
> 
>  ```python
>  def make_cache_key():
>    return f"GET_check_uuids:{normalize_uuid(request.args.get('uuid'))}"[:64]
>   ```
> The check is done up to a maximum of `64` characters, which is why I was being blocked after `13` wins with this method. So, starting to look for other variants, I tried using zero-width characters, like `\u200`, and by doing so, I could construct enough variants of the UUID to reach a total of `100 wins`. In addition to UUID normalization, there's another issue that allowed me to exploit this vulnerability, which is that the caching system doesn’t account for changes made in the database, causing inconsistencies. The attacker can manipulate the cache to avoid proper updates and exploit the latency between the two systems.
> 
> ```python
> @cache.cached(timeout=604800, make_cache_key=make_cache_key)
>def check():
>    user_uuid = request.args.get("uuid")
>    run_query("UPDATE users SET value = value + 1 WHERE id = %s;", (user_uuid,))
>    res = run_query("SELECT * FROM users WHERE id = %s;", (user_uuid,))
> ```
> The attacker manipulates the cache key to achieve a "cache hit" with outdated data, thus avoiding the proper increment of the counter in the database. This allows the attacker to accumulate wins without respecting the imposed limits. The attacker sends a large number of requests while manipulating the cache to bypass the limits (e.g., using zero-width characters to avoid cache hits). This is possible because the victory counter is incremented without any temporal or logical checks.

## 🔬 Vulnerability Analysis
### Potential Vulnerabilities
>- [x] Cache Poisoning

# 🎯 Solution Path

## Exploitation Steps
### Initial setup
>Now that we understand the type of vulnerability and how to exploit it, we can move on to the exploitation phase.
>
>
### Exploitation
> Obviously, creating `100` UUID variants manually seemed like a bit of a hassle, so I wrote a Python exploit to automate the process.
>
### Flag capture
>  
>   ![Manual Flag](/images/LaCTF-2025/Cache-It-To-Win-It/manual_flag.png "Manual Flag")

# 🛠️ Exploitation Process
## Approach
> The exploit generates `99` valid UUID variants and sends them to claim the `win`. Once it reaches 0, it checks the response for the flag and extracts it using a regex, printing it.
> 
> - [:(far fa-file-archive fa-fw): Exploit](/resources/LaCTF-2025/Cache-It-To-Win-It/exploit.py)

# 🚩 Flag Capture
>{{< admonition danger "Flag" >}}
{{< typeit tag=h4 >}}
lactf{my_c4ch3_f41l3d!!!!!!!}
{{< /typeit >}}
>{{< /admonition >}}
>
## Proof of Execution
> ![Automated Flag](/images/LaCTF-2025/Cache-It-To-Win-It/automated_flag.png "Automated Flag")
>*Screenshot of successful exploitation*

# 🔧 Tools Used
>| Tool | Purpose |
>|------|---------|
>| Python | Exploit |

# 💡 Key Learnings
## New Knowledge
>I have learned how to exploit the cache poisoning vulnerability on unsanitized data.
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
>- https://portswigger.net/web-security/web-cache-poisoning

---
# 📊 Final Statistics
| Metric | Value | Notes |
|--------|--------|-------|
| Time to Solve | 00:15 | From start to flag |
| Global Ranking (At the time of flag submission)| 13/679 | Challenge ranking |
| Points Earned | 500 | Team contribution |

*Created: 08-02-2025 • Last Modified: 08-02-2025*
*Author: mH4ck3r0n3 • Team: QnQSec*
