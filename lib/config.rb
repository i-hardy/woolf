# frozen_string_literal: true

require 'dinosaurus'
require 'flickraw'

$stdout.sync = true

FlickRaw.api_key = ENV['FLICKR_API_KEY']
FlickRaw.shared_secret = ENV['FLICKR_SECRET']

Dinosaurus.configure do |config|
  config.api_key = ENV['BHTHESAURUS_API_KEY']
end
