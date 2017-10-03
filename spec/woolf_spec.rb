require "woolf"

describe Woolf do
  subject(:woolf) { described_class }

  describe "#self.commands_list" do
    it "returns the bot's commands as a string" do
      expect(woolf.commands_list).to be_a String
    end
  end
end
