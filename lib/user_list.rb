# frozen_string_literal: true

require 'discordrb'

# This stores the sprinting role and any users opting in to a sprint,
# and allows them to be mentioned individually
class UserList
  attr_reader :list

  def initialize
    @list = []
  end

  def get_users_sprinting(user)
    list << user
  end

  def user_mentions
    list.map(&:mention).join(' ')
  end
end
