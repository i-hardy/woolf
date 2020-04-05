# frozen_string_literal: true

class Woolf
  # Cosy home for the eight zillion command regexes
  module Regexes
    MATCH_ONE = '\s([a-zA-Z]*\b+)'
    MATCH_ALL = '\s(.*)'

    SPRINT = /!sprint in (\d+) for (\d+)/ unless const_defined?(:SPRINT)
    SYN = Regexp.new("!synonym#{MATCH_ONE}") unless const_defined?(:SYN)
    ANT = Regexp.new("!antonym#{MATCH_ONE}") unless const_defined?(:ANT)
    RHYME = Regexp.new("!rhyme#{MATCH_ONE}") unless const_defined?(:RHYME)
    TRIGGER = Regexp.new("!related#{MATCH_ONE}") unless const_defined?(:TRIGGER)
    DESCRIBE = Regexp.new("!describe#{MATCH_ONE}") unless const_defined?(:DESCRIBE)
  end
end
