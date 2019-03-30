# Cosy home for the eight zillion command regexes
class Woolf
  module Regexes
    MATCH_ONE = '\s([a-zA-Z]*\b+)'.freeze
    MATCH_ALL = '\s(.*)'.freeze

    SPRINT = /!sprint in (\d+) for (\d+)/ unless const_defined?(:SPRINT)
    SYN = Regexp.new("!synonym#{MATCH_ONE}") unless const_defined?(:SYN)
    ANT = Regexp.new("!antonym#{MATCH_ONE}") unless const_defined?(:ANT)
    RHYME = Regexp.new("!rhyme#{MATCH_ONE}") unless const_defined?(:RHYME)
    MEANSLIKE = Regexp.new("!wordslike#{MATCH_ALL}") unless const_defined?(:MEANSLIKE)
    TRIGGER = Regexp.new("!related#{MATCH_ONE}") unless const_defined?(:TRIGGER)
    DESCRIBE = Regexp.new("!describe#{MATCH_ONE}") unless const_defined?(:DESCRIBE)
  end
end