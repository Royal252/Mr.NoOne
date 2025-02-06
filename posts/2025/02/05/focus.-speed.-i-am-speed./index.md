
# 🌐 Focus. Speed. I Am Speed.


![Challenge Presentation](/images/SrdnlenCTF-2025/FocusSpeed/challenge_presentation.png "Challenge Presentation")

# 📊 Challenge Overview
>
>| Category | Details | Additional Info |
>|----------|---------|-----------------|
>| 🏆 Event | SrdlenCTF - 2025 | [Event Link](https://ctf.srdnlen.it/challenges#challenge-17) |
>| 🔰 Category | Web | 🌐 |
>| 💎 Points | 50 | Out of 500 total |
>| ⭐ Difficulty | 🟢 Easy | Personal Rating: 3/10 |
>| 👤 Author | Octaviusss | [Profile]() |
>| 🎮 Solves (At the time of flag submission)| 189 | XX% solve rate |
>| 📅 Date | 19-01-2025 | SrdlenCTF - 2025 Day X |
>| 🦾 Solved By | aquila2 | Team: Team Aetruria |

## 📝 Challenge Information
>Welcome to Radiator Springs' finest store, where every car enthusiast's dream comes true! But remember, in the world of racing, precision matters—so tread carefully as you navigate this high-octane experience. Ka-chow!  
>Website: http://speed.challs.srdnlen.it:8082

## 🎯 Challenge Files & Infrastructure

### Provided Files
> Files:
>- [:(far fa-file-archive fa-fw): Attached Files](https://drive.google.com/file/d/1DDzIdxO63csz7trMyCF5X6FAuYuSbkdG/view?usp=drive_link)

# 🔍 Initial Analysis

## First Steps
> Initially, the website appears as follows:
> 
> ![Site Presentation](/images/SrdnlenCTF-2025/FocusSpeed/site_presentation.png "Site Presentation")
>
> ![Home Page](/images/SrdnlenCTF-2025/FocusSpeed/site_1.png "Home Page")
> 
> we notice by going to the `Official Store` that it is an online store.
> 
> ![Official Store](/images/SrdnlenCTF-2025/FocusSpeed/store.png "Official Store") 
> 
> So, most likely, the intent of this challenge will be to purchase the flag. In fact, by opening the attached files, specifically `app.js`, we can notice these lines of code in the population of the database products:
> 
> ```js
> const products = [
>        { productId: 1, Name: "Lightning McQueen Toy", Description: "Ka-chow! This toy goes as fast as Lightning himself.", Cost: "Free" },
>        { productId: 2, Name: "Mater's Tow Hook", Description: "Need a tow? Mater's here to save the day (with a little dirt on the side).", Cost: "1 Point" },
>        { productId: 3, Name: "Doc Hudson's Racing Tires", Description: "They're not just any tires, they're Doc Hudson's tires. Vintage!", Cost: "2 Points" },
>        {
>            productId: 4,
>            Name: "Lightning McQueen's Secret Text",
>            Description: "Unlock Lightning's secret racing message! Only the fastest get to know the hidden code.",
>            Cost: "50 Points",
>            FLAG: process.env.FLAG || 'SRDNLEN{fake_flag}'
>        }
>    ];
> ```
> 
> As we can see, in `productId: 4` (the last and most expensive one, the flag is contained). Now we just need to figure out how to accumulate points. By continuing to analyze the attached files, we'll realize that `MongoDB` is being used, and in `app.py` we will find a function that generates discount codes.
> 
> ```js
> const createDiscountCodes = async () => {
>
>        const discountCodes = [
>            { discountCode: generateDiscountCode(), value: 20 }
>        ];
>
>        for (const code of discountCodes) {
>
>            const existingCode = await DiscountCodes.findOne({ discountCode: code.discountCode });
>            if (!existingCode) {
>                await DiscountCodes.create(code);
>                console.log(`Inserted discount code: ${code.discountCode}`);
>            } else {
>                console.log(`Discount code ${code.discountCode} already exists.`);
>            }
>        }
>    };
>```
>
> This function generates 10 random discount codes for the purchase, which will be used to acquire points that can then be spent on purchasing items, via the `/redeem` route specified in the `routes.py` file. Here, there is a vulnerable part of the code, as it accepts a parameter `discountCode`, which can be used to redeem a valid code and acquire points. The vulnerability is found exactly in this portion of the code:
> 
> ```js
> const { discountCode } = req.query;
>
>if (!discountCode) {
>    return res.render('error', { Authenticated: true, message: 'Discount code is required!' });
>}
>
>const discount = await DiscountCodes.findOne({ discountCode });
> ```
> 
> In fact, since `discountCode` is a parameter that can be manipulated by the user and is directly used in the query as it is entered by the user, we can send a malicious payload using a `NoSQL Injection` to find a valid discount code. The query, as it is set, takes the `discountCode` and checks whether it matches one of those 10 randomly generated discount codes seen earlier. By sending a malicious payload, we can create a condition that returns `True`, allowing us to redeem a discount code even without knowing it.
>Later, there is a check where only one discount code can be redeemed per day. So, even if we try to redeem it, we would only get `20` of the `50` points needed. Continuing to read the code, to bypass this check, we can exploit another vulnerability. Usually, when a `timeout` or `delay` is applied, it is related to a `Race Condition`. As we can see in the following lines of code:
> 
> ```js
>         // Apply the gift card value to the user's balance
>        const { Balance } = await User.findById(req.user.userId).select('Balance');
>        user.Balance = Balance + discount.value;
>        // Introduce a slight delay to ensure proper logging of the transaction
>        // and prevent potential database write collisions in high-load scenarios.
>        new Promise(resolve => setTimeout(resolve, delay * 1000));
>        user.lastVoucherRedemption = today;
>        await user.save();
> ```
> 
> The account balance is extracted, then increased by adding the discount code that we have redeemed. A timeout is applied based on the `delay` variable declared at the beginning of the file (`let delay = 1.5;`), which is then multiplied by `1000` (to convert it to `milliseconds`). This results in a total `timeout of 1.5 seconds` before the balance update is actually performed in the database. We can exploit this time delay by sending, for example, two more requests in `parallel` to accumulate `60 points` and purchase the flag. This is possible because the subsequent two requests will be sent in less than `1.5 seconds`, and therefore, they will pass the checks done previously. These checks are based on the values present in the database, and since those values have not been `updated` yet due to the `timeout`, we can `redeem` multiple codes without being blocked by the `restriction` that allows redeeming only `one code per day`. By sending the requests during this `window of time`, we are able to `bypass` the restriction and accumulate enough points to `purchase` the flag.

# 🎯 Solution Path
## Exploitation Steps
### Initial setup
> After understanding the vulnerabilities we are dealing with, I did a couple of searches on the internet to exploit the `NoSQL Injection`, as for the `Race Condition`, it's enough to create an exploit script in `Python` with `multithreading` to send multiple requests concurrently. Through `PayloadAllTheThings`, I searched for `NoSQL payloads` https://github.com/swisskyrepo/PayloadsAllTheThings/blob/master/NoSQL%20Injection/README.md. I tried the following payload: `http://speed.challs.srdnlen.it:8082/redeem?discountCode[$ne]=test`, where `$ne` stands for `not equal`. What could happen with this in the following portion of the code, which was also mentioned earlier?
> 
>```js
>   const existingCode = await DiscountCodes.findOne({ discountCode: code.discountCode });
>```
>
> As we mentioned, in this case, the above code will create a `valid condition`, so it's as if we've found the correct `discountCode`. If we were to express this in `natural language`, the action would be `find me a discountCode that is not equal to 'test'`. As we saw during the generation phase, the discountCodes are totally `random` and `alphanumeric`, so it's impossible for the database to have a discountCode equal to `test`. Therefore, the condition will return `True`, allowing us to redeem the code and add 20 points to our balance.
>
### Exploitation
> The exploitation phase doesn't stop here. Now that we've figured out how to `redeem points`, we need to understand how to `redeem more than 20 points per day`, as mentioned earlier. We can use `Python's multithreading` to take advantage of that one and a half seconds `timeout` set for making multiple requests. So, I’ll write a script that does this and retrieves the flag, because doing it manually would be impossible.
>
### Flag capture
> 
> ![Manual Flag](/images/SrdnlenCTF-2025/FocusSpeed/manual_flag.png "Manual Flag")

# 🛠️ Exploitation Process
## Approach
> The Python exploit utilizes `requests`, `bs4`, and finally, `multithreading` to leverage the `Race Condition`. I create a pool of `20 threads` that run concurrently after a registration phase and account creation using the `Faker` library, which generates random `fake credentials`. Once that's done, I take advantage of the `NoSQL Injection` for all the threads by visiting the `/redeem?discountCode[$ne]=test` route, which will redeem a code and add a total of 20 points to the account balance each time, taking advantage of the `one-and-a-half-second timeout`. Once all of that is done, I visit the root (`/`) of the site where the flag is displayed (as shown in the image above), and then I extract it using `BeautifulSoup` and print it out.
> 
> - [:(far fa-file-archive fa-fw): Exploit](/resources/SrdnlenCTF-2025/FocusSpeed/exploit.py)

# 🚩 Flag Capture
>{{< admonition danger "Flag" >}}
{{< typeit tag=h4 >}}
srdnlen{6peed_1s_My_0nly_Competition}
{{< /typeit >}}
>{{< /admonition >}}
>
## Proof of Execution
> ![Automated Flag](/images/SrdnlenCTF-2025/FocusSpeed/automated_flag.png "Automated Flag")
>*Screenshot of successful exploitation*

# 🔧 Tools Used
>| Tool | Purpose |
>|------|---------|
>| Python | Exploit |

# 💡 Key Learnings
## New Knowledge
> I have learned `NoSQL Injection` operators such as `$ne`, `$lt`, and how to `exploit` them in an `unsanitized query`. I also learned how to create a `race condition with multiple sessions` to exploit even the `milliseconds of delay`.
>
## Time Optimization
>
> Whenever a `delay` or any kind of `lag` is introduced in the code, always consider the possibility of a `Race Condition`. Additionally, where there are `comments` in the code, it's as if there are `hints` pointing to where the vulnerability might be located.
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
## Learning Resources
>- https://www.invicti.com/learn/nosql-injection/
>- https://github.com/swisskyrepo/PayloadsAllTheThings/blob/master/NoSQL%20Injection/README.md
>- https://www.guidepointsecurity.com/blog/race-conditions-in-modern-web-applications/#:~:text=RACE%20conditions%20occur%20when%20we,RACE%20condition%20may%20be%20present.

---
# 📊 Final Statistics

| Metric | Value | Notes |
|--------|--------|-------|
| Time to Solve | 00:15 | From start to flag |
| Global Ranking (At the time of flag submission)| 26/1577 | Challenge ranking |
| Points Earned | 500 | Team contribution |

*Created: 19-01-2025 • Last Modified: 19-01-2025*
*Author: mH4ck3r0n3 • Team: Team Aetruria*

