# frozen_string_literal: true

require 'yaml'
require 'httparty'

# Simple bot responses that do not rely on state
module Responses
  CORE_RESPONSES = YAML.load_file('responses.yaml')
  NO_RESULT_RESPONSE = CORE_RESPONSES['no_result_response']
  DATAMUSE_API = "https://api.datamuse.com/words".freeze

  ARRAY_RESPONSE = proc { |array| array.empty? ? NO_RESULT_RESPONSE : array.map {|w| w["word"]}.join(', ') }

  DATAMUSE_REQUEST = proc do |regex, query, event|
    word = event.message.content.match(regex).captures.last
    res = HTTParty.get("#{DATAMUSE_API}?#{query}=#{word}")
    ARRAY_RESPONSE.call(res)
  rescue HTTParty::ResponseError
    Woolf::LOGGER.error("Error accessing Datamuse API")
    NO_RESULT_RESPONSE
  rescue StandardError
    Woolf::LOGGER.error("Searchable word not found in #{event.message.content}")
    NO_RESULT_RESPONSE
  end

  def get_synonym(event)
    event.respond "#{event.author.mention} #{DATAMUSE_REQUEST.call(Woolf::Regexes::SYN, 'rel_syn', event)}"
  end

  def get_antonym(event)
    event.respond "#{event.author.mention} #{DATAMUSE_REQUEST.call(Woolf::Regexes::ANT, 'rel_ant', event)}"
  end

  def get_rhyme(event)
    event.respond "#{event.author.mention} #{DATAMUSE_REQUEST.call(Woolf::Regexes::RHYME, 'rel_rhy', event)}"
  end

  def get_triggers(event)
    event.respond "#{event.author.mention} #{DATAMUSE_REQUEST.call(Woolf::Regexes::TRIGGER, 'rel_trg', event)}"
  end

  def inspire(event)
    photo = flickr.interestingness.getList.to_a.sample
    event.respond "#{event.author.mention} #{FlickRaw.url(photo)}"
  rescue StandardError => exception
    Woolf::LOGGER.error(exception.message)
    event.respond "#{event.author.mention} #{NO_RESULT_RESPONSE}"
  end

  def get_support(event)
    event.respond CORE_RESPONSES['support_request']
  end

  def woolf_respond(event, type)
    event.respond "#{event.author.mention}#{CORE_RESPONSES[type]}"
  end

  private

  def array_response(array)
    array.empty? ? NO_RESULT_RESPONSE : array.map {|w| w["word"]}.join(', ')
  end
end
