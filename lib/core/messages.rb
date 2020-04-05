# frozen_string_literal: true

class Woolf
  # message config extracted from main class file
  MESSAGES = {
    Regexes::SPRINT => :writing_sprint,
    '!sprinting' => :get_sprinters,
    '!cancel sprint' => :cancel_sprint,
    '!sprint role' => :permasprinters,
    '!remove sprint role' => :tired_sprinters,
    '!synonym' => :get_synonym,
    '!antonym' => :get_antonym,
    '!rhyme' => :get_rhyme,
    '!related' => :get_triggers,
    '!describe' => :get_describe,
    '!inspiration' => :inspire,
    '!set sprint role' => :set_sprinting_role,
    '!woolf support' => :support
  }.freeze
end
