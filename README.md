# Woolf

[![CircleCI](https://circleci.com/gh/i-hardy/woolf.svg?style=shield)](https://circleci.com/gh/i-hardy/woolf) [![join the tech support server](https://camo.githubusercontent.com/138428d1ea98178db35e122de7f154c31db968a9/68747470733a2f2f696d672e736869656c64732e696f2f62616467652f646973636f72642d6a6f696e2d3732383944412e737667)](https://discord.gg/78R5nud) [![invite the bot to your server](https://camo.githubusercontent.com/812534660d6dee63e900fad9d956b8122159f8a8/68747470733a2f2f696d672e736869656c64732e696f2f62616467652f626f742d696e766974652d3333333339392e737667)](https://discord.com/oauth2/authorize?client_id=364771016523907072&scope=applications.commands+bot&permissions=268435456)

> _Five hundred a year and a bot of one's own..._

A Discord bot for writers.

## Features

- Custom-length timers for writing sprints
- Fetches various word relations using the [DataMuse API](http://www.datamuse.com/api/)
- Fetches inspirational photos using the [Flickr API](https://www.flickr.com/services/api/)

## Usage

Click on the link at the top of the README to invite the bot to your server. Be aware that the writing sprint functionality _will not work_ unless the bot has permission to manage roles on your server. Please see Discord's [Role Management 101](https://support.discordapp.com/hc/en-us/articles/214836687-Role-Management-101).

To host the bot yourself, clone the repository, install [nvm](https://github.com/nvm-sh/nvm), and create a .env file using the .env.sample file as a guide. Then run:

```sh
nvm install
npm install
npm start
```

You can also use the provided Dockerfile, or pull the latest prebuilt image from `imogenhardy/woolf:latest`. The bot is set up to output logs to Loggly, but will default to stdout if no Loggly client token is set.

### Woolf 1.0

This bot was originally written in Ruby, and rewritten in Typescript in Autumn 2020. To use the legacy Ruby version, switch to the branch `1.0`.
