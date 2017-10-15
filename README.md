# Woolf

> *Five hundred a year and a bot of one's own...*

A Discord bot for writers, primarily intended for use during [NaNoWriMo](https://nanowrimo.org/).

### Features

* Custom-length timers for writing sprints
* Fetches synonyms and antonyms using [Dinosaurus](https://github.com/dtuite/dinosaurus)
* Fetches inspirational photos using [Flickraw](https://github.com/hanklords/flickraw)

### Usage

The bot will be hosted and publicly available very soon!

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
$ ruby lib/woolf.rb
```
