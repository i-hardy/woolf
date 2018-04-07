# frozen_string_literal: true

require 'discordrb'
require_relative 'sprint_timer'

# This class wraps each server utilising the bot
class WoolfServer
  ROLE_NAME = 'sprinters'
  ROLE_BY_NAME = proc { |role| role.name == ROLE_NAME }
  NO_RESULT_RESPONSE = 'Little words that broke up the thought \
  and dismembered it said nothing...'
  attr_reader :server

  def initialize(server, timer_class: SprintTimer)
    @server = server
    @timer_class = timer_class
    @timer = timer_class.new(nil)
    timer.end_sprint
  end

  def set_sprinting_role
    role_getter
  rescue StandardError
    @server
      .default_channel
      .send_message "I can't find or create the role 'sprinters'. \
Please give me permission to manage roles, or create the role yourself, \
then tell me !set sprint role and I'll try again"
    raise
  end

  def writing_sprint(event)
    raise 'One sprint at a time!' unless no_sprint?
    sprint_init(event)
    timer.set_start
  rescue StandardError
    puts "Attempt to run two sprints at once in #{@server.name}"
    event.respond 'A sprint is already running'
  end

  def get_sprinters(event)
    raise 'No sprint is running' if no_sprint?
    timer.add_sprinters(event.author)
    event.respond "#{event.author.mention} so to work, even in poverty and obscurity, is worth while"
  rescue StandardError
    puts "Attempt to opt-in to a nonexistent sprint in #{@server.name}"
    event.respond 'No sprint is running'
  end

  def permasprinters(event)
    event.author.add_role(sprinting_role)
    event.respond "#{event.author.mention}, we have the habit of freedom and the courage to write exactly what we think"
  end

  def tired_sprinters(event)
    event.author.remove_role(sprinting_role)
    event.respond "#{event.author.mention} died young — alas, she never wrote a word..."
  end

  def get_synonym(event)
    begin
      word = event.message.content.match(Woolf::SYN_REGEX).captures.pop
      response = array_response(Dinosaurus.synonyms_of(word))
    rescue StandardError
      puts "Searchable word not found in #{event.message.content}, in server #{@server.name}"
      response = NO_RESULT_RESPONSE
    end
    event.respond "#{event.author.mention} #{response}"
  end

  def get_antonym(event)
    begin
      word = event.message.content.match(Woolf::ANT_REGEX).captures.pop
      response = array_response(Dinosaurus.antonyms_of(word))
    rescue StandardError
      puts "Searchable word not found in #{event.message.content}, in server #{@server.name}"
      response = NO_RESULT_RESPONSE
    end
    event.respond "#{event.author.mention} #{response}"
  end

  def inspire(event)
    photo = flickr.interestingness.getList.to_a.sample
    event.respond "#{event.author.mention} #{FlickRaw.url(photo)}"
  rescue StandardError => exception
    puts exception.message
    event.respond "#{event.author.mention} #{NO_RESULT_RESPONSE}"
  end

  private

  attr_reader :timer, :timer_class, :sprinting_role, :role_by_name

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

  def array_response(array)
    array.empty? ? NO_RESULT_RESPONSE : array.join(', ')
  end

  def sprint_init(event)
    @timer = timer_class.new(event)
    timer.add_sprinters(sprinting_role)
  end
end
