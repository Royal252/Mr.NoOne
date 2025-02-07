
# 🌐 Sess.io


![Challenge Presentation](/images/NullCon-Goa-HackIM-CTF-2025/Sess.io/challenge_presentation.png "Challenge Presentation")

## 📊 Challenge Overview
>
>| Category | Details | Additional Info |
>|----------|---------|-----------------|
>| 🏆 Event | Nullcon Goa HackIM 2025 CTF | [Event Link](https://ctf.nullcon.net/challenges#Sess.io-63) |
>| 🔰 Category | Web | 🌐 |
>| 💎 Points | 500 | Out of 500 total |
>| ⭐ Difficulty | 🟡 Medium | Personal Rating: 5/10 |
>| 👤 Author | @gehaxelt | [Profile]() |
>| 🎮 Solves (At the time of flag submission)| 75 | solve rate |
>| 📅 Date | 02-02-2025 | Nullcon Goa HackIM 2025 CTF |
>| 🦾 Solved By | mH4ck3r0n3 | Team: QnQSec |

## 📝 Challenge Information
>Long sessions must be secure, right? http://52.59.124.14:5008

## 🎯 Challenge Files & Infrastructure

### Provided Files
>```yaml
>Files: None
>```

# 🔍 Initial Analysis

## First Steps
> Initially, the website appears as follows:
> 
> ![Site Presentation](/images/NullCon-Goa-HackIM-CTF-2025/Sess.io/site_presentation.png "Site Presentation")
>
> Taking a look at the source:
> 
> ![Source Code](/images/NullCon-Goa-HackIM-CTF-2025/Sess.io/source.png "Source Code")
> 
> I understood that the presented PHP code has a vulnerability related to **predictable session IDs**:
> 
>  ```php
>  define("ALPHA", str_split("abcdefghijklmnopqrstuvwxyz0123456789_-"));
>ini_set("error_reporting", 0);
>  ```
>
>  - **ALPHA**: An array of possible characters used to build the session ID.
>  - **Disable errors** to prevent giving attackers any information.
>
> 
>  ```php
>  include "flag.php"; // $FLAG
> $SEEDS = str_split($FLAG, 4);
> ```
> 
> The file `flag.php` contains the flag (e.g., `$FLAG = "ENO{...}"`). *`$SEEDS` is an array of substrings of the flag, each 4 characters long:
> 
> ```php
> function session_id_secure($id) {
>    global $SEEDS;
>    mt_srand(intval(bin2hex($SEEDS[md5($id)[0] % (count($SEEDS))]), 16));
>    $id = "";
>    for($i = 0; $i < 1000; $i++) {
>        $id .= ALPHA[mt_rand(0, count(ALPHA) - 1)];
>    }
>    return $id;
>}
> ```
> 
> This function generates a **custom session ID**:
> 
> - **Calculates the seed** for the Mersenne Twister random number generator (MT) based on the first character of the MD5 hash of the combined input of `username` and `password`.
> - **Regenerates the session ID** of 1000 characters using the characters defined in `ALPHA`.
> 
> The main vulnerability lies in the fact that the session ID is **predictable** if we know the flag segments (seed) used to initialize `mt_rand`. Since the seed is derived from segments of the flag, it is possible to determine the flag itself by understanding the behavior of the Mersenne Twister generator.
> 
> ```php
> if (isset($_POST['username']) && isset($_POST['password'])) {
>    session_id(session_id_secure($_POST['username'] . $_POST['password']));
>    session_start();
>    echo "Thank you for signing up!";
>} else {
>    echo "Please provide the necessary data!";
>}
> ```
> 
> If the `username` and `password` are provided, a **PHPSESSID** is generated based on them. This allows an attacker to register multiple sessions and **observe the generated session ID** to deduce the seed. So, to summarize:
> 
> - **Using `mt_rand` to generate sessions:** Mersenne Twister is fast but **not secure** for cryptographic operations.
> - **Seed derived from flag segments:** This allows using `php_mt_seed` to predict the seed and, consequently, deduce the flag.
> - **Predictability of the seed:** Since the seed is calculated using a part of the flag (four characters at a time), it's possible to iteratively decode the entire flag (once we have the first 4 characters, we know the flag starts with `ENO{`, which gives us the format of the flag).
> 
> Searching online, I found a tool for cracking the seed: (https://www.openwall.com/php_mt_seed/). Now that we have all this information, we can move on to the exploitation.

## 🔬 Vulnerability Analysis
### Potential Vulnerabilities
>- [x] Predictable Session ID Vulnerability

# 🎯 Solution Path

## Exploitation Steps
### Initial setup
>The exploitation is divided into four phases:
>
> - **Multiple Registration:** Register usernames with random combinations of `username` and `password`.
> - **Session ID Retrieval:** Observe the `PHPSESSID` value assigned by the server.
> - **Using `php_mt_seed`:** Use `php_mt_seed` to find the seed used and trace back to the part of the flag that generated it.
> - **Iterate on the Flag:** Repeat the process to reconstruct the full flag.
>
### Exploitation
>To perform the above-described procedure, I wrote an exploit in Python, which uses:
> -  [php_mt_seed.c](https://github.com/openwall/php_mt_seed)
> 
> To crack the seed and extract parts of the flag one by one. Once the seed is deduced, we can proceed with reconstructing the flag.
>
### Flag capture
>  
>   ![Automated Flag](/images/NullCon-Goa-HackIM-CTF-2025/Sess.io/automated_flag.png "Automated Flag")

# 🛠️ Exploitation Process
## Approach
>The automated exploit literally follows the process described above:
>
> ```bash
> cd php_mt_seed-4.0
> make
> python exploit.py
> ```
>
> - [:(far fa-file-archive fa-fw): Exploit](/resources/NullCon-Goa-HackIM-CTF-2025/Sess.io/exploit.py)
> - [php_mt_seed](https://github.com/openwall/php_mt_seed)

# 🚩 Flag Capture
>{{< admonition danger "Flag" >}}
{{< typeit tag=h4 >}}
ENO{SOME_SUPER_SECURE_FLAG_1333337_HACK}
{{< /typeit >}}
>{{< /admonition >}}
>
## Proof of Execution
> ![Automated Flag](/images/NullCon-Goa-HackIM-CTF-2025/Sess.io/automated_flag.png "Automated Flag")
>*Screenshot of successful exploitation*

# 🔧 Tools Used
>| Tool | Purpose |
>|------|---------|
>| Python | Exploit |
>| [php_mt_seed](https://www.openwall.com/php_mt_seed/) | Seed Cracking |

# 💡 Key Learnings

## New Knowledge
> I have learned that the `mt_rand` function in PHP is vulnerable because the seed used for random generation can be extracted to gather information.
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
> -  https://www.openwall.com/php_mt_seed/

---
# 📊 Final Statistics
| Metric | Value | Notes |
|--------|--------|-------|
| Time to Solve | 00:45 | From start to flag |
| Global Ranking (At the time of flag submission)| 11/1115 | Challenge ranking |
| Points Earned | 500 | Team contribution |

*Created: 02-02-2025 • Last Modified: 02-02-2025*
*Author: mH4ck3r0n3 • Team: QnQSec*
