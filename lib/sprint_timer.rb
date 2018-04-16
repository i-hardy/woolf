# frozen_string_literal: true

require 'discordrb'
require 'json'
require_relative 'user_list'
require_relative 'storage'

# This creates a timer object for a 'writing sprint', in which users attempt to
# write as much as possible in a given time.
class SprintTimer
  attr_reader :userlist

  def initialize(event, userlist_class: UserList, store_class: Storage)
    return unless event
    @store = store_class.new(event.server.name)
    @event = event
    @userlist = userlist_class.new
    start_and_duration
  end

  def add_sprinters(user)
    userlist.get_users_sprinting(user)
  end

  def set_start
    event.respond "Get ready to sprint in #{startin} #{minutes_plural}"
    sleep 60 * startin
    sprint_starter
  end

  def sprint_starter
    @start_point = Time.now
    event.respond "#{userlist.user_mentions} #{length} minute sprint starts now!"
    sprint
  end

  def sprint_ender
    event.respond "#{userlist.user_mentions} Stop sprinting!"
    end_sprint
  end

  def end_sprint
    @ended = true
  end

  def ended?
    !!ended
  end

  def to_json
    {
      users: userlist.user_names,
      start: start_point,
      duration: length
    }.to_json
  end

  private

  attr_reader :times, :event, :ended, :start_point

  def sprint
    sleep 60 * length
    sprint_ender
  end

  def minutes_plural
    startin == 1 ? 'minute' : 'minutes'
  end

  def start_and_duration
    @times = event.message.content.match(Woolf::SPRINT_REGEX).captures if event
  end

  def startin
    times[0].to_i
  end

  def length
    times[1].to_i
  end
end
