# frozen_string_literal: true
require 'dotenv/load'
require 'flickraw'

$stdout.sync = true

FlickRaw.api_key = ENV['FLICKR_API_KEY']
FlickRaw.shared_secret = ENV['FLICKR_SECRET']
