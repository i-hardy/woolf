class Woolf
  module Regexes
    SPRINT = /!sprint in (\d+) for (\d+)/ unless const_defined?(:SPRINT)
    SYN = /!synonym\s([a-zA-Z]*\b+)/ unless const_defined?(:SYN)
    ANT = /!antonym\s([a-zA-Z]*\b+)/ unless const_defined?(:ANT)
    RHYME = /!rhyme\s([a-zA-Z]*\b+)/ unless const_defined?(:RHYME)
    TRIGGER = /!wordsnear\s([a-zA-Z]*\b+)/ unless const_defined?(:TRIGGER)
  end
end