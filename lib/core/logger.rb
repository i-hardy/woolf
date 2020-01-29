# frozen_string_literal: true

require 'logger'

class Woolf
  LOGGER = Logger.new(STDOUT,
                      level: Logger::INFO,
                      datetime_format: '%Y-%m-%d %H:%M:%S',
                      formatter: proc { |severity, datetime, _progname, msg|
                        "#{datetime} #{severity}: #{msg}\n"
                      })
end
