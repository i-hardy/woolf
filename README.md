# Woolf

[![CircleCI](https://circleci.com/gh/i-hardy/woolf.svg?style=shield)](https://circleci.com/gh/i-hardy/woolf) [![join the tech support server](https://camo.githubusercontent.com/138428d1ea98178db35e122de7f154c31db968a9/68747470733a2f2f696d672e736869656c64732e696f2f62616467652f646973636f72642d6a6f696e2d3732383944412e737667)](https://discord.gg/78R5nud) [![invite the bot to your server](https://camo.githubusercontent.com/812534660d6dee63e900fad9d956b8122159f8a8/68747470733a2f2f696d672e736869656c64732e696f2f62616467652f626f742d696e766974652d3333333339392e737667)](https://discordapp.com/oauth2/authorize?client_id=364771016523907072&scope=bot&permissions=268435456)

> _Five hundred a year and a bot of one's own..._

A Discord bot for writers, primarily intended for use during [NaNoWriMo](https://nanowrimo.org/).

## Features

- Custom-length timers for writing sprints
- Fetches synonyms and antonyms using the [DataMuse API](http://www.datamuse.com/api/)
- Fetches inspirational photos using [Flickraw](https://github.com/hanklords/flickraw)

## Usage

Click on the link at the top of the README to invite the bot to your server. Be aware that the writing sprint functionality _will not work_ unless the bot has permission to manage roles on your server. Please see Discord's [Role Management 101](https://support.discordapp.com/hc/en-us/articles/214836687-Role-Management-101).

To host the bot yourself, you will need environment variables as defined in the `.env.example` file. To run manually from the command line, do:

```bash
git clone https://github.com/i-hardy/woolf.git
cd woolf
bundle install
bundle exec ruby lib/woolf.rb
```

You can also use the provided Dockerfile, or pull the latest prebuilt image from `imogenhardy/woolf:latest`.
