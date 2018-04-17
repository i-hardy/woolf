# frozen_string_literal: true

require 'discordrb'
require_relative 'responses'
require_relative 'sprint_timer'

# This class wraps each server utilising the bot
class WoolfServer
  include Responses

  ROLE_NAME = 'sprinters'.freeze
  ROLE_BY_NAME = proc { |role| role.name == ROLE_NAME }

  attr_reader :server

  def initialize(server, timer_class: SprintTimer)
    @server = server
    @timer_class = timer_class
    @timer = timer_class.new(nil)
    timer.end_sprint
  end

  def set_sprinting_role
    # retries ||= 0
    role_getter
  rescue Discordrb::Errors::NoPermission => e
    # sleep 0.5
    # retries += 1
    # retry unless retries > 3
    puts e._rc_response
    # @server
    #   .default_channel
    #   .send_message Responses::CORE_RESPONSES['permissions_error']
  end

  def writing_sprint(event)
    raise 'One sprint at a time!' unless no_sprint?
    sprint_init(event)
    timer.set_start
  rescue StandardError => e
    puts "#{e.message} raised in #{@server.name}"
    event.respond 'A sprint is already running'
  end

  def get_sprinters(event)
    raise 'No sprint is running' if no_sprint?
    timer.add_sprinters(event.author)
    respond(event, 'join_sprint')
  rescue StandardError => e
    puts "#{e.message} raised in #{@server.name}"
    event.respond 'No sprint is running'
  end

  def permasprinters(event)
    event.author.add_role(sprinting_role)
    respond(event, 'add_role')
  end

  def tired_sprinters(event)
    event.author.remove_role(sprinting_role)
    respond(event, 'remove_role')
  end

  private

  attr_reader :timer, :timer_class, :sprinting_role, :role_by_name, :store

  def role_getter
    role_creator
    @sprinting_role = server.roles.find(&ROLE_BY_NAME)
  end

  def role_creator
    return if server.roles.any?(&ROLE_BY_NAME)
    server.create_role(name: ROLE_NAME, colour: 7_512_794, mentionable: true)
  end

  def no_sprint?
    timer.ended?
  end

  def sprint_init(event)
    @timer = timer_class.new(event)
    timer.add_sprinters(sprinting_role)
  end
end
