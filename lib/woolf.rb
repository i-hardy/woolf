# frozen_string_literal: true

require 'discordrb'

require_relative 'config'
require_relative 'core/regexes'
require_relative 'core/messages'
require_relative 'core/logger'
require_relative 'core/events'
require_relative 'server/woolf_server'

# Core bot class
class Woolf
  # stop the bot responding to re-pastes of the command list
  IS_INFO = proc { |message| message.content.match(/\s-\s.+\n/) }

  include Woolf::Events

  def self.startup
    woolf = new
    trap('TERM') do
      woolf.stop_gracefully
      exit
    end
    trap('INT') do
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
                              ignore_bots: true,
                              compress_mode: :large)
    set_events
  end

  def run
    virginia.run
  end

  def stop_gracefully
    virginia.stop(true)
  end

  private

  attr_reader :virginia, :connected_servers

  def set_events
    on_ready
    on_create
    on_mention
    set_commands
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
        handle_message(method, event)
      end
    end
    LOGGER.info('Commands set')
  end

  def handle_message(method, event)
    return if IS_INFO.call(event.message)
    LOGGER.info("#{event.message.content}, #{event.server.name}")
    woolf_catcher(method, event)
  end

  def server_rescue(server)
    woolf_server_creator(server)
  rescue Discordrb::Errors::NoPermission => err
    LOGGER.error("#{err._rc_response} in #{server.name}")
  rescue StandardError => e
    LOGGER.error("#{e.message} in #{server.name}")
    puts e.backtrace
  end

  Woolf.startup if $PROGRAM_NAME == __FILE__
end
