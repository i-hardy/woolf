# frozen_string_literal: true

require 'simplecov'
SimpleCov.start

require 'discordrb'

# See http://rubydoc.info/gems/rspec-core/RSpec/Core/Configuration
RSpec.configure do |config|
  config.expect_with :rspec do |expectations|
    expectations.include_chain_clauses_in_custom_matcher_descriptions = true
  end

  config.mock_with :rspec do |mocks|
    mocks.verify_partial_doubles = true
  end

  config.shared_context_metadata_behavior = :apply_to_host_groups
end

def suppress_log_output
  allow(STDOUT).to receive(:puts) # this disables puts
end