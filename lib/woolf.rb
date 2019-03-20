# frozen_string_literal: true
require 'logger'
require 'discordrb'
require 'yaml'
require_relative 'config'
require_relative 'regexes'
require_relative 'woolf_server'

# Core bot class
class Woolf
  MESSAGES = {
    Regexes::SPRINT => :writing_sprint,
    '!sprinting' => :get_sprinters,
    '!cancel sprint' => :cancel_sprint,
    '!sprint role' => :permasprinters,
    '!remove sprint role' => :tired_sprinters,
    '!synonym' => :get_synonym,
    '!antonym' => :get_antonym,
    '!rhyme' => :get_rhyme,
    '!wordsnear' => :get_triggers,
    '!inspiration' => :inspire,
    '!set sprint role' => :set_sprinting_role,
    '!woolf support' => :support,
  }.freeze
  LOGGER = Logger.new(STDOUT, 
    level: Logger::INFO,
    datetime_format: '%Y-%m-%d %H:%M:%S',
    formatter: proc {|severity, datetime, progname, msg|
      "#{datetime} #{severity}: #{msg}\n"
    })

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
                              name: 'woolf',
                              ignore_bots: true)
    set_events
  end

  def set_events
    on_ready
    on_create
    on_mention
    set_commands
  end

  def run
    virginia.run
  end

  def stop_gracefully
    LOGGER.info('Shutting down gracefully...')
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

  def woolf_catcher(method, event)
    server_finder(event.server).send(method, event)
  rescue StandardError => e
    LOGGER.error(e.message)
  end

  def set_commands
    MESSAGES.each_pair do |command, method|
      virginia.message(contains: command) do |event|
        LOGGER.info("#{event.message.content}, #{event.server.name}")
        woolf_catcher(method, event)
      end
    end
    LOGGER.info('Commands set')
  end

  def server_rescue(server)
    woolf_server_creator(server)
  rescue Discordrb::Errors::NoPermission => err
    LOGGER.error("#{err._rc_response} in #{server.name}")
  rescue StandardError => e
    LOGGER.error("#{e.message} in #{server.name}")
    puts e.backtrace
  end

  def on_ready
    virginia.ready do
      virginia.servers.each_value do |server|
        server_rescue(server)
      end
      LOGGER.info("#{connected_servers.length} servers connected")
    end
  end

  def on_create
    virginia.server_create do
      virginia.servers.each_value do |server|
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
