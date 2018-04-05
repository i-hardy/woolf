require "dinosaurus"
require "discordrb"
require "flickraw"
require_relative "woolf_server"

class Woolf
  SPRINT_REGEX = /!sprint in (\d+) for (\d+)/ unless const_defined?(:SPRINT_REGEX)
  SYN_REGEX = /!synonym\s([a-zA-Z]*\b+)/ unless const_defined?(:SYN_REGEX)
  ANT_REGEX = /!antonym\s([a-zA-Z]*\b+)/ unless const_defined?(:ANT_REGEX)

  FlickRaw.api_key = ENV["FLICKR_API_KEY"]
  FlickRaw.shared_secret = ENV["FLICKR_SECRET"]

  Dinosaurus.configure do |config|
    config.api_key = ENV["BHTHESAURUS_API_KEY"]
  end

  @@virginia = Discordrb::Bot.new token: ENV["WOOLF_BOT_TOKEN"],
  client_id: ENV["WOOLF_CLIENT_ID"], name: "woolf"

  $stdout.sync = true

  def self.commands_list
    "There is no gate, no lock, no bolt that you can set upon the freedom of my mind: \n
              - To set up a writing sprint for y minutes in x minutes' time, type \"!sprint in x for y\"\n
              - To opt-in to a sprint that's running, type \"!sprinting\" \n
              - To be notified of every sprint, type \"!sprint role\" \n
              - To stop being notified of every sprint, type \"!remove sprint role\" \n
              - To get synonyms for a word, type \"!synonym [word]\" \n
              - To get antonyms for a word, type \"!antonym [word]\" \n
              - To get an interesting photo for inspiration, type \"!inspiration\""
  end

  def self.server_finder(server)
    @connected_servers.find { |woolf_server| woolf_server.server == server }
  end

  def self.woolf_server_creator(server)
    @connected_servers ||= []
    unless @connected_servers.any? { |woolf_server| woolf_server.server == server }
      @connected_servers << WoolfServer.new(server)
    end
  end

  @@virginia.ready do |startup|
    @@virginia.servers.values.each do |server|
      begin
        Woolf.woolf_server_creator(server)
      rescue Exception => e 
        puts "#{e.message} in #{server.name}"
        next
      end
    end
    puts "#{@connected_servers.length} servers connected"
  end

  @@virginia.server_create do |event|
    @@virginia.servers.values.each do |server|
      Woolf.woolf_server_creator(server)
    end
  end

  @@virginia.mention do |event|
    event.respond Woolf.commands_list
  end

  @@virginia.message(contains: SPRINT_REGEX ) do |event|
    Woolf.server_finder(event.server).writing_sprint(event)
  end

  @@virginia.message(contains: "!sprinting") do |event|
    Woolf.server_finder(event.server).get_sprinters(event)
  end

  @@virginia.message(contains: "!sprint role") do |event|
    Woolf.server_finder(event.server).permasprinters(event.author)
    event.respond "#{event.author.mention}, we have the habit of freedom and the courage to write exactly what we think"
  end

  @@virginia.message(contains: "!remove sprint role") do |event|
    Woolf.server_finder(event.server).tired_sprinters(event.author)
    event.respond "#{event.author.mention} died young — alas, she never wrote a word..."
  end

  @@virginia.message(contains: "!synonym") do |event|
    Woolf.server_finder(event.server).get_synonym(event)
  end

  @@virginia.message(contains: "!antonym") do |event|
    Woolf.server_finder(event.server).get_antonym(event)
  end

  @@virginia.message(contains: "!inspiration") do |event|
    Woolf.server_finder(event.server).inspire(event)
  end

  if __FILE__ == $0
    @@virginia.run
  end
end
