# Knight Connect

<!--more-->
# 🌐 Knight Connect

![Challenge Presentation](/images/KnightCTF-2025/Knight-Connect/challenge_presentation.png "Challenge Presentation")

>## 📊 Challenge Overview
>
>| Category | Details | Additional Info |
>|----------|---------|-----------------|
>| 🏆 Event | KnightCTF - 2025 | [Event Link](https://2025.knightctf.com/challenges#Knight%20Connect-7) |
>| 🔰 Category | Web | 🌐 |
>| 💎 Points | 260 | Out of 500 total |
>| ⭐ Difficulty | 🟢 Easy | Personal Rating: 3/10 |
>| 👤 Author | NomanProdhan | [Profile]() |
>| 🎮 Solves | 49 | XX% solve rate |
>| 📅 Date | 20-01-2025 | KnightCTF - 2025 Day X |
>| 🦾 Solved By | Bebo07 | Team: QnQSec |

## 📝 Challenge Information

>In a realm where ancient knights and modern technology collide, a mysterious portal emerges—known as "Knight Connect." Only the wisest and most cunning warriors can decipher its secrets. Legends whisper of a forgotten system, guarded by layers of encryption and vulnerabilities, waiting for a brave soul to breach its defenses.  Do you possess the skills to uncover the truth? Enter the domain of Knight Connect and etch your name into the annals of digital knighthood. The challenge awaits.

## 🎯 Challenge Files & Infrastructure

>### Provided Files
>Files: 
>- [attached files](/resources/KnightCTF-2025/Knight-Connect/KnightConnect_Source.zip)


## 🔍 Initial Analysis

>### First Steps
> The site initially appeared as follows:
> 
> ![Site Presentation](/images/KnightCTF-2025/Knight-Connect/site_presentation.png "Site Presentation")
> 
> with a login screen. After completing the registration and login, I was redirected to the following page:
> 
> ![Home Page](/images/KnightCTF-2025/Knight-Connect/site_presentation2.png "Home Page")
> 
> I couldn't find anything else on the site, so I started reading the attached files. At first, I was overwhelmed and didn't know where to look due to the number of files present. The first thing that came to mind was to forge some session cookies since the `APP_KEY` of Laravel was in the `.env` file. Also, because it required the session to be set to `is_admin` in order to display the flag. We can see this from the following lines of code in the `index.blade.php` file under the `resources/views/users` folder:
> 
> ```php
>         @if (isset($flag) && session()->has('is_admin') && session('is_admin'))
>            <div class="flag">Flag: {{ $flag->flag }}</div>
>        @endif
> ```
> 
> but then I discovered that it wasn't the right path. However, I realized that I needed to get an administrator account to be able to read the flag. In the `web.php` file under the `resources/routes` folder, I found all the routes of the site, including one that seemed a bit suspicious: `/contact`. Visiting it redirected me to the following page:
> 
> ![Contact](/images/KnightCTF-2025/Knight-Connect/contact.png "Contact")
> 
> where the administrator accounts and their respective emails were displayed. Spoiler: only one of these was valid, which was `nomanprodhan@knightconnect.com` (the username of the challenge creator). I then continued looking at other files, but I was interested in how authentication was being handled, so I searched for the authentication file, which was named `AuthController.php` under the `Http/Controllers` folder. Here I found the vulnerability—there were two functions that allowed you to request a login link for an account, which created a token formed by combining the email and a timestamp at that moment, all encrypted using the bcrypt function. The other function allowed you to log in using that generated link by passing the token as a parameter:
> 
> ```php
> public function requestLoginUrl(Request $request) {
>        $request->validate([
>            'email' => 'required|email',
>        ]);  
>
>        $user = User::where('email', $request->email)->first();
>
>        if (!$user) {
>            return back()->withErrors(['email' => 'Email not found']);
>        }
>
>        $time = time();
>        $data = $user->email . '|' . $time;
>        $token = bcrypt($data);
>  
>        $loginUrl = url('/login-link?token=' . urlencode($token) . '&time=' . $time . '&email=' . urlencode($user->email));  
>
>        return back()->with('success', 'Login link generated, but email sending is disabled.');
>    }
>
>  
>    public function loginUsingLink(Request $request) {
>
>        $token = $request->query('token');
>        $time = $request->query('time');
>        $email = $request->query('email');  
>
>        if (!$token || !$time || !$email) {
>            return response('Invalid token or missing parameters', 400);
>        }  
>
>        if (time() - $time > 3600) {
>            return response('Token expired', 401);
>        }
>  
>        $data = $email . '|' . $time;
>        if (!Hash::check($data, $token)) {
>            return response('Token validation failed', 401);
>        }
>
>        $user = User::where('email', $email)->first();
>  
>        if (!$user) {
>            return response('User not found', 404);
>        }
>        
>        session(['user_id' => $user->id]);
>        session(['is_admin' => $user->is_admin]);  
>
>        return redirect()->route('users');
>    }
> ```
> the first function doesn't really have any vulnerabilities, since it only shows how the token is created to request the "instant" login URL. In contrast, the second function has a significant vulnerability, as the only check it does is ensure the timestamp of the generated token is at most one hour old (3600 seconds), otherwise, it becomes invalid. However, we can manipulate the timestamp ourselves by passing a fake value as a parameter. In fact, to make it secure, the generated token with the timestamp should have been saved in the database, and if it wasn't the exact timestamp, it wouldn't allow access (although a brute-force attack could be used to try all possible timestamps). So, I realized that it's possible to forge a token—one just needs to know the email of the account they want to access, and as we saw earlier in the `/contact` route, there were quite a few admin emails... Now that we've figured it all out, let's proceed with the exploit.

## 🔬 Vulnerability Analysis
>### Potential Vulnerabilities
>- [x] Insecure Authentication

## 🎯 Solution Path

>### Exploitation Steps
>>#### Initial setup
> Initially, to generate the URL, I used https://onlinephp.io/. I also found this website useful for generating "passwords" with Laravel's bcrypt (https://fbutube.com/laravel-password-generator). However, in the end, I decided to write it in PHP and run it locally, as this way I could fully automate the process.
>
>>#### Exploitation
>  
> After obtaining the admin's email `nomanprodhan@knightconnect.com`, it was quite simple to forge a token, since it was made up of "email|timestamp". I then wrote a PHP script that did exactly what the first function did, using bcrypt on the string formed by the admin's email + timestamp, and then generating a link similar to the one in the function with the parameters `token`, `time`, and `email`. This way, I created a valid login link, since the user associated with the email actually existed. I gained access to their account, and by visiting the homepage as seen earlier, with the `is_admin` flag on the account, I was able to retrieve the flag.
>
>>#### Flag capture
>   
>   ![Manual Flag](/images/KnightCTF-2025/Knight-Connect/manual_flag.png "Manual Flag")

## 🛠️ Exploitation Process
>### Approach
> I wrote the exploit in PHP because I had issues with token composition using bcrypt in Python. This exploit takes the admin's email, which has the flag in their profile, and then creates a valid token with a timestamp less than one hour old. It then generates a URL with a valid token to access the admin profile, and through a cURL function in PHP, it makes a request to the page, extracting the flag via a regex. I used the following commands for the requirements and the run:
> 
> ```bash
>   sudo apt install php
>   sudo apt-get install php-curl
>   php exploit.php
>   ```
> 
> - [exploit](/resources/KnightCTF-2025/Knight-Connect/exploit.php)

## 🚩 Flag Capture
>{{< admonition danger "Flag" >}}
>KCTF{_congrat5_KNIGHT_y0U_hack3d_mY_Acc0Un7_}
>{{< /admonition >}}
>
>### Proof of Execution
>![Automated Flag](/images/KnightCTF-2025/Knight-Connect/automated_flag.png "Automated Flag")
>*Screenshot of successful exploitation*

## 🔧 Tools Used
>### Primary Tools
>| Tool | Purpose |
>|------|---------|
>| PHP | Exploit |

## 💡 Key Learnings
>### Skills Improved
>- [ ] Binary Exploitation
>- [ ] Reverse Engineering
>- [x] Web Exploitation
>- [ ] Cryptography
>- [ ] Forensics
>- [ ] OSINT
>- [ ] Miscellaneous

## 📚 References & Resources
>### Learning Resources
>- https://laravel.com/docs/11.x/hashing

---
## 📊 Final Statistics

| Metric | Value | Notes |
|--------|--------|-------|
| Time to Solve | 00:30 | From start to flag |
| Global Ranking | 10/451 | Challenge ranking |
| Points Earned | 260 | Team contribution |

*Created: 20-01-2025 • Last Modified: 20-01-2025*
*Author: mH4ck3r0n3 • Team: QnQSec*
