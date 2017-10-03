require "dinosaurus"
require "discordrb"
require_relative "woolf_server"

class Woolf
  SPRINT_REGEX = /!sprint in (\d+) for (\d+)/ unless const_defined?(:SPRINT_REGEX)

  @@virginia = Discordrb::Bot.new token: ENV["WOOLF_BOT_TOKEN"],
  client_id: ENV["WOOLF_CLIENT_ID"], name: "woolf"

  def self.commands_list
    "Do not ask too much of me: \n
              - To set up a writing sprint for y minutes in x minutes' time, type \"!sprint in x for y\"\n
              - To opt-in to a sprint that's running, type \"!sprinting\" \n
              - To be notified of every sprint, type \"!stamina\" \n
              - To stop being notified of every sprint, type \"!tired\" \n"
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
      Woolf.woolf_server_creator(server)
    end
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

  @@virginia.message(contains: "!stamina") do |event|
    Woolf.server_finder(event.server).permasprinters(event.author)
    event.respond "Woof! Your stamina is impressive!"
  end

  @@virginia.message(contains: "!tired") do |event|
    Woolf.server_finder(event.server).tired_sprinters(event.author)
    event.respond "Woof! You seem tired"
  end

  if __FILE__ == $0
    @@virginia.run
  end
end
