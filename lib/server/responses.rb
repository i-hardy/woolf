# frozen_string_literal: true

require 'yaml'
require 'httparty'
require 'flickr'

# Simple bot responses that do not rely on state
module Responses
  MAX_WORDS = 40
  CORE_RESPONSES = YAML.load_file('responses.yaml')
  NO_RESULT_RESPONSE = CORE_RESPONSES['no_result_response']
  DATAMUSE_API = 'https://api.datamuse.com/words'
  DATAMUSE_ARGS = {
    synonym: [Woolf::Regexes::SYN, 'rel_syn'],
    antonym: [Woolf::Regexes::ANT, 'rel_ant'],
    rhyme: [Woolf::Regexes::RHYME, 'rel_rhy'],
    meanslike: [Woolf::Regexes::MEANSLIKE, 'ml'],
    triggers: [Woolf::Regexes::TRIGGER, 'rel_trg'],
    describe: [Woolf::Regexes::DESCRIBE, 'rel_jjb']
  }.freeze
  FLICKR_CLIENT = Flickr.new(ENV['FLICKR_API_KEY'], ENV['FLICKR_SECRET'])

  def inspire(event)
    photo = FLICKR_CLIENT.interestingness.getList.to_a.sample
    event.respond "#{event.author.mention} #{Flickr.url(photo)}"
  rescue StandardError => exception
    Woolf::LOGGER.error(exception.message)
    event.respond "#{event.author.mention} #{NO_RESULT_RESPONSE}"
  end

  def support(event)
    event.respond CORE_RESPONSES['support_request']
  end

  def woolf_respond(event, type)
    event.respond "#{event.author.mention}#{CORE_RESPONSES[type]}"
  end

  def method_missing(name, *args)
    super unless name.to_s.start_with?('get_')
    event = args.first
    relation = name.to_s.split('_').last.to_sym
    event.respond "#{event.author.mention} #{datamuse_request(event, *DATAMUSE_ARGS[relation])}"
  end

  def respond_to_missing?(method_name, include_private = false)
    method_name.to_s.start_with?('get_') || super
  end

  private

  def array_response(array)
    array.empty? ? NO_RESULT_RESPONSE : array.map { |w| w['word'] }.slice(0, MAX_WORDS).join(', ')
  end

  def datamuse_request(event, regex, query)
    word = event.message.content.match(regex).captures.last
    res = HTTParty.get("#{DATAMUSE_API}?#{query}=#{word}")
    array_response(res)
  rescue HTTParty::ResponseError
    Woolf::LOGGER.error('Error accessing Datamuse API')
    NO_RESULT_RESPONSE
  rescue StandardError
    Woolf::LOGGER.error("Searchable word not found in #{event.message.content}")
    NO_RESULT_RESPONSE
  end
end
