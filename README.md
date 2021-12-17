# Trading Bot 
Requirement : 
1. The program should have a buy option where the user can put how much I want to spend / or how many shares that I will like to buy of my token.
2. The program should have a sell option where I can choose how many shares I will like sell, as long as there are tokens in the wallet of course with enough bnb to cover the fees, etc.
3. The prorgam should efficiently be able to use the bot with a minimum of 500 wallets being done at one time. Total wallet count could reach to 3000.
4. The program will have control panel to also read how much BNB is in each wallet and how much token shares are in that same wallet for my own crypto token

Trading bot is a bot which can do Buy and Sell operations automatically.

## IMPORTANT NOTES BEFORE RUNNING THE BOT !!!

1) The bot uses a wallet address and private key
    - if this is **NOT** configured correctly you will get an error that says "(node:45320) UnhandledPromiseRejectionWarning: Error: insufficient funds for intrinsic transaction cost"

2) Make **sure** you have the following assets in your MetaMask wallet **FOR THE ACCOUNT ADDRESS WITH WHICH YOU ARE USING THE BOT**
    - **BNB** (this is needed for gas)
    - **WBNB** (this is used to purchase the desired token)


# BOT SETUP & CONFIGURATION INSTRUCTIONS

1) Download & Install Node.js - https://nodejs.org/en/

2) Extract the bot zip / download contents to a folder, example 
C:\users\username\Downloads\trading-bot

3) open the command prompt to install the necessary modules for the bot (it should be in the same directory it was earlier when you copy the bot)

```
$ npm install
```

4) After installing modules, type 'npm start' and hit ENTER to run the bot.

```
$ npm start

```
# Usage



# Test

1) IF you want to TEST the bot using BNB / BUSD, then ADD the BUSD custom token to your MetaMask 
2) Run the bot using the to_Purchase value of the BUSD token contract. This works because liquidity is frequently added to this pool.
