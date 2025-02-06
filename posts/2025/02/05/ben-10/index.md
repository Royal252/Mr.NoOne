
# 🌐 Ben 10


![Challenge Presentation](/images/SrdnlenCTF-2025/Ben-10/challenge_presentation.png "Challenge Presentation")

# 📊 Challenge Overview
>
>| Category | Details | Additional Info |
>|----------|---------|-----------------|
>| 🏆 Event | SrdlenCTF - 2025 | [Event Link](https://ctf.srdnlen.it/challenges#challenge-20) |
>| 🔰 Category | Web | 🌐 |
>| 💎 Points | 50 | Out of 500 total |
>| ⭐ Difficulty | 🟢 Easy | Personal Rating: 3/10 |
>| 👤 Author | gheddus | [Profile]() |
>| 🎮 Solves (At the time of flag submission)| 354 | XX% solve rate |
>| 📅 Date | 19-01-2025 | SrdlenCTF - 2025 Day X |
>| 🦾 Solved By | mH4ck3r0n3 | Team: Team Aetruria |



## 📝 Challenge Information
>
>Ben Tennyson's Omnitrix holds a mysterious and powerful form called Materia Grigia — a creature that only those with the sharpest minds can access. It's hidden deep within the system, waiting for someone clever enough to unlock it. Only the smartest can access what’s truly hidden.  Can you outsmart the system and reveal the flag?  
>Website: http://ben10.challs.srdnlen.it:8080


## 🎯 Challenge Files & Infrastructure

### Provided Files
>Files: 
>- [:(far fa-file-archive fa-fw): Attached Files](https://drive.google.com/file/d/1Qa963GMnMr-MlkyG1gIQfWY6SL2wemYm/view?usp=drive_link)

# 🔍 Initial Analysis

## First Steps
> Initially, the website appears as follows:
> 
> ![Site Presentation](/images/SrdnlenCTF-2025/Ben-10/site_presentation.png "Site Presentation")
>
> Creating an account and logging into the site, it appears as follows:
> 
> ![Home Page](/images/SrdnlenCTF-2025/Ben-10/site_2.png "Home Page")
> 
> Trying to access the last image of the site, I receive the following error message:
> 
> ![Ben 10](/images/SrdnlenCTF-2025/Ben-10/site_3.png "Ben 10")
> 
> Consequently, I believe privileged access to the page is required. By examining the attached files, I noticed that every time a user was registered, another account was created in the database with admin privileges. The username of this account was formatted as "admin^username^token". This can be observed in the following function in the `app.py` file:
> 
> ```python
> @app.route('/register', methods=['GET', 'POST'])
> def register():
>
>    """Handle user registration."""
>
>    if request.method == 'POST':
>
>        username = request.form['username']
>        password = request.form['password']
>
>        if username.startswith('admin') or '^' in username:
>
>            flash("I don't like admins", "error")
>            return render_template('register.html')
>
>        if not username or not password:
>        
>            flash("Both fields are required.", "error")
>            return render_template('register.html')
>
>
>        admin_username = f"admin^{username}^{secrets.token_hex(5)}"
>        admin_password = secrets.token_hex(8)
>
>        try:
>
>            conn = sqlite3.connect(DATABASE)
>            cursor = conn.cursor()
>            cursor.execute("INSERT INTO users (username, password, admin_username) VALUES (?, ?, ?)",
>                           (username, password, admin_username))
>            cursor.execute("INSERT INTO users (username, password, admin_username) VALUES (?, ?, ?)",
>                           (admin_username, admin_password, None))
>
>            conn.commit()
>        except sqlite3.IntegrityError:
>
>            flash("Username already exists!", "error")
>            return render_template('register.html')
>
>        finally:
>
>            conn.close()
>
>        flash("Registration successful!", "success")
>        return redirect(url_for('login'))
>
>    return render_template('register.html')
> ```
> 
> Now, all we need is to find the user and exploit the password reset function for the admin user to gain access and extract the flag. I noticed that the admin username is exposed on the homepage after logging in, inside an HTML tag with CSS `display:none`, making it visible through the page source using `ChromeDevTools`:
> 
> ```html
> <div style="display:none;" id="admin_data">{{ admin_username }}</div>
> ```
> 
> In fact, by viewing the page source, we can retrieve the admin username:
> 
> ![Admin Username](/images/SrdnlenCTF-2025/Ben-10/admin_user.png "Admin Username")
> 
> now we can proceed to the exploit.

# 🎯 Solution Path

## Exploitation Steps
### Initial setup
>  The initial phase involves registering a user account. Afterward, we need to log in and retrieve the username of the admin account that was created alongside the user account. This admin username is displayed on the homepage, as mentioned earlier. Once we have obtained the username, we can move on to the actual exploit.
>
### Exploitation
> The exploit involves resetting the password of the admin account to gain access. However, on the reset screen, we can only reset the password of the user account because a check is implemented in the reset function to block any user whose username starts with `admin`. Therefore, we begin the reset process with the normal user account created earlier to generate a valid reset token:
>   
>   ![Reset Token](/images/SrdnlenCTF-2025/Ben-10/reset.png "Reset Token")
>   
> Once the token is generated, we gain access to the reset page. Here, no checks are applied on the type of account we want to reset; we only need to know the account name we obtained in the initial phase. Therefore, we proceed to reset the password of the admin account associated with our user account:
>   
>   ![Admin Password Reset](/images/SrdnlenCTF-2025/Ben-10/reset_admin.png "Admin Password Reset")
>   
>   Once the reset is completed, we simply need to log in with the admin account whose password we just reset, and visit the route `/ben/10`, which is the last photo in the list, to obtain the flag.
>
### Flag capture
>  
>   ![Manual Flag](/images/SrdnlenCTF-2025/Ben-10/manual_flag.png "Manual Flag")

# 🛠️ Exploitation Process
## Approach
> The exploit uses `requests` and `BeautifulSoup` for extracting the user, the token, and the flag. It literally performs the step-by-step actions described previously: first, it creates an account using the `Faker` library to generate fake credentials. Then, it logs in and extracts the `admin username` associated with the user created earlier. After that, it resets the password for the admin user. Finally, after logging in again and visiting the `/ben/10` route, it extracts the flag using BeautifulSoup (`bs4`) and prints it.
> 
> - [:(far fa-file-archive fa-fw): Exploit](/resources/SrdnlenCTF-2025/Ben-10/exploit.py)

# 🚩 Flag Capture
>{{< admonition danger "Flag" >}}
{{< typeit tag=h4 >}}
srdnlen{b3n_l0v3s_br0k3n_4cc355_c0ntr0l_vulns}
{{< /typeit >}}
>{{< /admonition >}}
>
## Proof of Execution
> ![Automated Flag](/images/SrdnlenCTF-2025/Ben-10/automated_flag.png "Automated Flag")
>*Screenshot of successful exploitation*

# 🔧 Tools Used
>| Tool | Purpose |
>|------|---------|
>| Python | Exploit |
>| ChromeDevTools | Web Testing |

# 💡 Key Learnings
>
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
| Time to Solve | 00:10 | From start to flag |
| Global Ranking (At the time of flag submission)| 20/1566 | Challenge ranking |
| Points Earned | 500 | Team contribution |

*Created: 19-01-2025 • Last Modified: 19-01-2025*
*Author: mH4ck3r0n3 • Team: Team Aetruria*
