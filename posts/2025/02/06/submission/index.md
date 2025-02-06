
# 🌐 Submission


![Challenge Presentation](/images/x3CTF-2025/Submission/challenge_presentation.png "Challenge Presentation")

## 📊 Challenge Overview
>
>| Category | Details | Additional Info |
>|----------|---------|-----------------|
>| 🏆 Event | x3CTF - 2025 | [Event Link](https://x3c.tf/#challenges) |
>| 🔰 Category | Web | 🌐 |
>| 💎 Points | 500 | Out of 500 total |
>| ⭐ Difficulty | 🟢 Easy | Personal Rating: 4/10 |
>| 👤 Author | rebane2001 | [Profile]() |
>| 🎮 Solves (At the time of flag submission)| 16 | XX% solve rate |
>| 📅 Date | 24-01-2025 | x3CTF - 2025 Day X |
>| 🦾 Solved By | xtea418 | Team: QnQSec |

## 📝 Challenge Information
> Could you help us out?

## 🎯 Challenge Files & Infrastructure

### Provided Files
>Files: 
>- [:(far fa-file-archive fa-fw): Attached Files](https://drive.google.com/file/d/1aw7MNHPH6ZjCBtw2QnK85svjPfHpe6pF/view?usp=drive_link)

# 🔍 Initial Analysis

## First Steps
> Initially, the website appears as follows:
> 
> ![Site Presentation](/images/x3CTF-2025/Submission/site_presentation.png "Site Presentation")
>
> There is a file upload section where only `.txt` files can be uploaded. Reading the attached files, there was only a PHP file:
> 
> ```php
> 
> if (isset($_FILES['file'])) {
>	$uploadOk = 1;
>	$target_dir = "/var/www/html/uploads/";
>	$target_file = $target_dir . basename($_FILES["file"]["name"]);  
>
>if (file_exists($target_file)) {
>  echo "Sorry, file already exists.";
>  $uploadOk = 0;
>}
>
>if ($_FILES["file"]["size"] > 50000) {
>  echo "Sorry, your file is too large you need to buy Nitro.";
>  $uploadOk = 0;
>}
>if (!str_ends_with($target_file, '.txt')) {
>  echo "Due to exploit you can only upload files with .txt extensions sorry about this but we got hacked last time so we have to check this from now on.";
>  $uploadOk = 0;
>}
>// Check if $uploadOk is set to 0 by an error
>if ($uploadOk == 0) {
>  echo "Sorry, your file was not uploaded.";
>// if everything is ok, try to upload file
>} else {
>  if (move_uploaded_file($_FILES["file"]["tmp_name"], $target_file)) {
>    echo "The file ". htmlspecialchars( basename( $_FILES["file"]["name"])). " has been uploaded.";
>  } else {
>    echo "Sorry, there was an error uploading your file.";
>  }
>}
>
>$old_path = getcwd();
>chdir($target_dir);
>// make unreadable
>shell_exec('chmod 000 *');
>chdir($old_path);
>}
> ```
> 
> As we can see, the files are uploaded to the `/uploads` folder, followed by various checks, including one on the file size and another on the extension, which must always end with `.txt`. Initially, I thought of uploading a malicious PHP file to read `flag.txt`, which was located under the `uploads` folder, since trying to access `/uploads/flag.txt` returned `403 Forbidden`. I attempted to bypass the extension check with a null byte, using `exploit.php%00.txt`, but it didn’t work. Searching online, I found another type of attack that allowed command execution through the `.htaccess` file. Interestingly, when I tried uploading a file starting with `.`, I was able to read it using the `/uploads/filename` route (but I quickly realized why). As we can see, a `chmod 000 *` command is executed right after the upload, setting all permissions to null for every file in the `uploads` folder. This was why accessing files through the browser returned `403 Forbidden`. It is also the reason why I was able to read the files I uploaded with a `.` at the beginning of the name. The `chmod ... *` command affects all visible files but doesn’t include hidden files (those starting with `.` or special characters, such as `-`). Since their permissions weren’t nullified, I could still access them. From there, I did some research to better understand how `chmod` works and realized it was an issue of insecure file permissions. Now, let's move on to the exploit.

## 🔬 Vulnerability Analysis
### Potential Vulnerabilities
>- [x] Insecure File Permission

# 🎯 Solution Path

## Exploitation Steps
### Initial setup
> After doing some research, I discovered that there is a specific flag that can be used with the `chmod` command, `--reference=filename file`, which allows you to set the permissions of the target file (passed as an argument) to match those of the reference file (like a copy-and-paste of permissions). So, I decided to exploit this flag, given that `chmod` was being applied to `*` (a wildcard indicating "all"). By setting the permissions of all files in the folder, I thought of using this to my advantage.
>
### Exploitation
> The exploitation essentially relies on uploading a file named `--reference=foo.txt`, for example (since there is always an extension check):
>   
>   ![First Part](/images/x3CTF-2025/Submission/reference.png "First Part")
>   
> Once the upload is done, `chmod` is called, and all the permissions are set to null. However, the exploit doesn't stop there. In fact, for the reference flag, you need to specify a file, as we mentioned, `foo.txt`, so I uploaded that file as well:
>   
>   ![Second Part](/images/x3CTF-2025/Submission/foo_upload.png "Second Part")
>   
> Once the file is uploaded, `chmod` will be executed on all the files, and as soon as it reaches the file `--reference=foo.txt`, it will treat it as a flag in the execution of the command. This will set the permissions of all files in the folder to match those of the `foo.txt` file (which, being the last one uploaded, still has active read permissions because `chmod` hasn’t been executed on it yet). As a result, the read permission for the `flag.txt` file will also be set, and by accessing the `/uploads/flag.txt` route, I was able to read the flag.
>
### Flag capture
>  
>   ![Manual Flag](/images/x3CTF-2025/Submission/manual_flag.png "Manual Flag")

# 🛠️ Exploitation Process
## Approach
> The exploit does exactly as described manually: it uses the `--reference` flag of `chmod` to apply the permissions of the `foo.txt` file to all the files, including `flag.txt`, and then retrieves the flag by accessing the `/uploads/flag.txt` route.
> 
> - [:(far fa-file-archive fa-fw): Exploit](/resources/x3CTF-2025/Submission/exploit.py)

# 🚩 Flag Capture
>{{< admonition danger "Flag" >}}
{{< typeit tag=h4 >}}
x3c{4lw4y5_chm0d_y0ur3_f1l35_4_53cur17y}
{{< /typeit >}}
>{{< /admonition >}}
## Proof of Execution
> ![Automated Flag](/images/x3CTF-2025/Submission/automated_flag.png "Automated Flag")
>*Screenshot of successful exploitation*

# 🔧 Tools Used
>| Tool | Purpose |
>|------|---------|
>| Python | Exploit |

# 💡 Key Learnings
## New Knowledge
> I learned that `chmod` ignores hidden files (those named with `.something` or files starting with `-`). I also learned that when the `--reference=filename file` parameter is used, it sets the permissions of the target file to match those of the file specified as the reference.
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
>- https://www.tecmint.com/copy-file-permissions-and-ownership-to-another-file-in-linux/

---
# 📊 Final Statistics
| Metric | Value | Notes |
|--------|--------|-------|
| Time to Solve | 00:20 | From start to flag |
| Global Ranking (At the time of flag submission)| 2/975 | Challenge ranking |
| Points Earned | 500 | Team contribution |

*Created: 24-01-2025 • Last Modified: 24-01-2025*
*Author: mH4ck3r0n3 • Team: QnQSec*
