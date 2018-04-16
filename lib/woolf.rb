# frozen_string_literal: true

require 'discordrb'
require 'yaml'
require_relative 'config'
require_relative 'woolf_server'

# Core bot class
class Woolf
  SPRINT_REGEX = /!sprint in (\d+) for (\d+)/ unless const_defined?(:SPRINT_REGEX)
  SYN_REGEX = /!synonym\s([a-zA-Z]*\b+)/ unless const_defined?(:SYN_REGEX)
  ANT_REGEX = /!antonym\s([a-zA-Z]*\b+)/ unless const_defined?(:ANT_REGEX)
  MESSAGES = {
    SPRINT_REGEX => :writing_sprint,
    '!sprinting' => :get_sprinters,
    '!sprint role' => :permasprinters,
    '!remove sprint role' => :tired_sprinters,
    '!synonym' => :get_synonym,
    '!antonym' => :get_antonym,
    '!inspiration' => :inspire,
    '!set sprint role' => :set_sprinting_role,
    '!woolf support' => :get_support,
  }.freeze

  def self.startup
    woolf = new
    trap('TERM') do
      woolf.stop_gracefully
      exit
    end
    woolf.run
  end

  def initialize(bot_class: Discordrb::Bot)
    @connected_servers = []
    @virginia = bot_class.new(token: ENV['WOOLF_BOT_TOKEN'],
                              client_id: ENV['WOOLF_CLIENT_ID'],
                              name: 'woolf')
    set_events
  end

  def set_events
    on_ready
    on_create
    on_mention
  end

  def run
    virginia.run
  end

  def stop_gracefully
    virginia.stop(true)
  end

  def server_finder(server)
    connected_servers.find { |wserver| wserver.server == server }
  end

  def woolf_server_creator(server)
    return if connected_servers.any? { |wserver| wserver.server == server }
    connected_servers << WoolfServer.new(server)
    connected_servers.last.set_sprinting_role
  end

  def error_response(event)
    event.respond Responses::CORE_RESPONSES['error_response']
  end

  def woolf_catcher(method, event)
    server_finder(event.server).method(method).call(event)
  rescue StandardError => e
    puts e.message
    error_response(event)
  end

  def set_commands
    MESSAGES.each_pair do |command, method|
      virginia.message(contains: command) do |event|
        woolf_catcher(method, event)
      end
    end
  end

  def server_rescue(server)
    woolf_server_creator(server)
  rescue Discordrb::Errors::NoPermission => err
    puts err.response
  rescue StandardError => e
    puts e
    puts "#{e.message} in #{server.name}"
  end

  def on_ready
    virginia.ready do
      virginia.servers.each_value do |server|
        server_rescue(server)
      end
      set_commands
      puts "#{connected_servers.length} servers connected"
    end
  end

  def on_create
    virginia.server_create do
      virginia.servers.values.each do |server|
        woolf_server_creator(server)
      end
    end
  end

  def on_mention
    virginia.mention do |event|
      event.respond Responses::CORE_RESPONSES['command_list']
    end
  end

  private

  attr_reader :virginia, :connected_servers

  Woolf.startup if $PROGRAM_NAME == __FILE__
end
