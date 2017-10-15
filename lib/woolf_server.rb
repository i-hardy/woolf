require "discordrb"
require_relative "sprint_timer"

# This class manages all the servers utilising the bot, in order to avoid overlap of sprint timers
class WoolfServer
  ROLE_NAME = "sprinters"
  ROLE_BY_NAME = Proc.new { |role| role.name == ROLE_NAME }
  NO_RESULT_RESPONSE = "Little words that broke up the thought and dismembered it said nothing..."
  attr_reader :server

  def initialize(server, timer_class: SprintTimer)
    @server = server
    @timer_class = timer_class
    @timer = timer_class.new(nil)
    timer.end_sprint
    role_getter
  end

  def writing_sprint(event)
    raise "One sprint at a time!" unless no_sprint?
    sprint_init(event)
    timer.set_start
  end

  def get_sprinters(event)
    raise "No sprint is running" if no_sprint?
    timer.add_sprinters(event.author)
  end

  def permasprinters(sprinter)
    sprinter.add_role(sprinting_role)
  end

  def tired_sprinters(sprinter)
    sprinter.remove_role(sprinting_role)
  end

  def get_synonym(event)
    word = event.message.content.match(Woolf::SYN_REGEX).captures.pop
    synonyms = Dinosaurus.synonyms_of(word)
    synonyms.empty? ? response = NO_RESULT_RESPONSE : response = synonyms.join(", ")
    event.respond "#{event.author.mention} #{response}"
  end

  def get_antonym(event)
    word = event.message.content.match(Woolf::ANT_REGEX).captures.pop
    antonyms = Dinosaurus.antonyms_of(word)
    antonyms.empty? ? response = NO_RESULT_RESPONSE : response = antonyms.join(", ")
    event.respond "#{event.author.mention} #{response}"
  end

  def inspire(event)
    photo = flickr.interestingness.getList.to_a.sample
    event.respond "#{event.author.mention} #{FlickRaw.url(photo)}"
  end

  private
  attr_reader :timer, :timer_class, :sprinting_role, :role_by_name

  def role_getter
    role_creator
    @sprinting_role = server.roles.find(&ROLE_BY_NAME)
  end

  def role_creator
    unless server.roles.any?(&ROLE_BY_NAME)
      server.create_role(name: ROLE_NAME, colour: 7512794, mentionable: true)
    end
  end

  def no_sprint?
    timer.ended?
  end

  def sprint_init(event)
    @timer = timer_class.new(event)
    timer.add_sprinters(sprinting_role)
  end
end
