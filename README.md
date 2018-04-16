# Woolf

[![join the tech support server](https://camo.githubusercontent.com/138428d1ea98178db35e122de7f154c31db968a9/68747470733a2f2f696d672e736869656c64732e696f2f62616467652f646973636f72642d6a6f696e2d3732383944412e737667)](https://discord.gg/78R5nud) [![invite the bot to your server](https://camo.githubusercontent.com/812534660d6dee63e900fad9d956b8122159f8a8/68747470733a2f2f696d672e736869656c64732e696f2f62616467652f626f742d696e766974652d3333333339392e737667)](https://discordapp.com/oauth2/authorize?client_id=364771016523907072&scope=bot&permissions=268435456)

> *Five hundred a year and a bot of one's own...*

A Discord bot for writers, primarily intended for use during [NaNoWriMo](https://nanowrimo.org/).

### Features

* Custom-length timers for writing sprints
* Fetches synonyms and antonyms using [Dinosaurus](https://github.com/dtuite/dinosaurus)
* Fetches inspirational photos using [Flickraw](https://github.com/hanklords/flickraw)

### Usage

Click on the link at the top of the README to invite the bot to your server. Please note that the writing sprint functionality *will not work* unless the bot has permission to manage roles on your server. Please see Discord's [Role Management 101](https://support.discordapp.com/hc/en-us/articles/214836687-Role-Management-101).

To host the bot yourself, you will need the following environment variables:

```
WOOLF_BOT_TOKEN=[your Discord bot token]
WOOLF_CLIENT_ID=[your Discord bot client id]
BHTHESAURUS_API_KEY=[your Big Huge Thesaurus API key]
FLICKR_API_KEY=[your Flickr API key]
FLICKR_SECRET=[your Flickr shared secret]
```
then do

```
$ git clone git@github.com:i-hardy/woolf.git
$ cd woolf
$ bundle install
$ ruby lib/woolf.rb
```
