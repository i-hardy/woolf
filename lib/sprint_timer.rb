# frozen_string_literal: true

require 'discordrb'
require 'json'
require_relative 'user_list'
# require_relative 'storage'

# This creates a timer object for a 'writing sprint', in which users attempt to
# write as much as possible in a given time.
class SprintTimer
  attr_reader :userlist

  def initialize(event, userlist_class: UserList)
    # @store = store_class.new(event.server.name)
    @event = event
    @owner = event&.message&.author
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
  rescue StandardError
    end_sprint
  end

  def sprint_starter
    return if ended?
    @start_point = Time.now
    event.respond "#{userlist.user_mentions} #{length} minute sprint starts now!"
    sprint
  end

  def sprint_ender
    return if ended?
    event.respond "#{userlist.user_mentions} Stop sprinting!"
    end_sprint
  end

  def end_sprint
    @ended = true
  end

  def cancel(canceller)
    raise 'User cannot cancel this sprint' unless can_cancel?(canceller)
    end_sprint
    event.respond Responses::CORE_RESPONSES['cancel_sprint']
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

  attr_reader :owner, :times, :event, :ended, :start_point

  def sprint
    return if ended?
    sleep 60 * length
    sprint_ender
  end

  def minutes_plural
    startin == 1 ? 'minute' : 'minutes'
  end

  def start_and_duration
    @times = event.message.content.match(Woolf::Regexes::SPRINT).captures if event
  end

  def can_cancel?(canceller)
    canceller == owner || canceller.permission?(:manage_messages)
  end

  def startin
    times[0].to_i
  end

  def length
    times[1].to_i
  end
end
