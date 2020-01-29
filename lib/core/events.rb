# frozen_string_literal: true

class Woolf
  # Bot-level events module
  module Events
    def on_ready
      virginia.ready do
        virginia.servers.each_value do |server|
          server_rescue(server)
        end
        LOGGER.info("#{connected_servers.length} servers connected")
      end
    end

    def on_create
      virginia.server_create do
        virginia.servers.each_value do |server|
          woolf_server_creator(server)
        end
      end
    end

    def on_mention
      virginia.mention do |event|
        event.respond Responses::CORE_RESPONSES['command_list']
      end
    end
  end
end
