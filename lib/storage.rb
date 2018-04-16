# frozen_string_literal: true

require 'redis'

# This class handles the saving and loading of data from Redis
class Storage
  def initialize(server_name, storage_class: Redis)
    @store = storage_class.new
    @server_name = server_name
  end

  def check_store
    store.get(server_name)
  end

  def store_timer(json)
    store.set(server_name, json)
  end

  def clear
    store_timer('')
  end

  private

  attr_reader :store, :server_name
end
