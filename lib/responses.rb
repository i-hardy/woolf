# frozen_string_literal: true

require 'yaml'

# Simple bot responses that do not rely on state
module Responses
  CORE_RESPONSES = YAML.load_file('responses.yaml')
  NO_RESULT_RESPONSE = CORE_RESPONSES['no_result_response']

  def get_synonym(event)
    begin
      word = event.message.content.match(Woolf::SYN_REGEX).captures.pop
      response = array_response(Dinosaurus.synonyms_of(word))
    rescue StandardError
      puts "Searchable word not found in #{event.message.content}, \
      in server #{@server.name}"
      response = NO_RESULT_RESPONSE
    end
    event.respond "#{event.author.mention} #{response}"
  end

  def get_antonym(event)
    begin
      word = event.message.content.match(Woolf::ANT_REGEX).captures.pop
      response = array_response(Dinosaurus.antonyms_of(word))
    rescue StandardError
      puts "Searchable word not found in #{event.message.content}, \
      in server #{@server.name}"
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

  def get_support(event)
    event.respond CORE_RESPONSES['support_request']
  end

  def woolf_respond(event, type)
    puts caller
    event.respond "#{event.author.mention}#{CORE_RESPONSES[type]}"
  end

  private

  def array_response(array)
    array.empty? ? NO_RESULT_RESPONSE : array.join(', ')
  end
end
