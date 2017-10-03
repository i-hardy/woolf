require "woolf_server"
require "discordrb"

describe WoolfServer do
  let(:timer_class) { class_double("SprintTimer") }
  let(:server_object) { double(:server)}
  let(:woolf_server) { described_class.new(server_object, timer_class: timer_class) }
  let(:event) { double(:event) }
  let(:message) { double(:message) }
  let(:sprinters) { double(:role) }
  let(:vita) { double(:user) }
  let(:timer) { double(:sprinttimer) }

  before do
    allow(timer_class).to receive(:new) { timer }
    allow(server_object).to receive(:roles) { [sprinters] }
    allow(sprinters).to receive(:name) { "sprinters" }
    allow(timer).to receive(:add_sprinters)
    allow(timer).to receive(:end_sprint)
  end

  describe "initialization" do
    it "sets a server object as an instance variable" do
      expect(woolf_server.server).to equal(server_object)
    end
  end

  describe "#writing_sprint" do
    it "should only run one sprint at a time" do
      allow(woolf_server).to receive(:timer) { timer }
      allow(timer).to receive(:ended?) { false }
      expect { woolf_server.writing_sprint(event) }.to raise_error "One sprint at a time!"
    end

    it "should create a new sprint timer and run it" do
      allow(woolf_server).to receive(:timer) { timer }
      allow(timer).to receive(:ended?) { true }
      allow(timer).to receive(:set_start) { true }
      allow(woolf_server).to receive(:sprinting_role) { sprinters }
      allow(event).to receive_message_chain("message.content.match.captures") { [0, 0] }
      allow(event).to receive(:respond) { "Get ready to sprint in 5 minutes" }
      allow(sprinters).to receive(:mention) { "@sprinters" }
      expect(woolf_server.writing_sprint(event)).to eq true
    end
  end

  describe "#get_sprinters" do
    it "should return an error if no sprint is running" do
      allow(woolf_server).to receive(:timer) { timer }
      allow(timer).to receive(:ended?) { true }
      expect { woolf_server.get_sprinters(event) }.to raise_error "No sprint is running"
    end

    it "should pass opting-in sprinters into the timer" do
      allow(woolf_server).to receive(:timer) { timer }
      allow(event).to receive(:author) { vita }
      allow(timer).to receive(:ended?) { false }
      expect(timer).to receive(:add_sprinters)
      woolf_server.get_sprinters(event)
    end
  end

  describe "#permasprinters" do
    it "should assign the springing role to a user" do
      allow(vita).to receive(:add_role) { "sprinters" }
      expect(woolf_server.permasprinters(vita)).to eq "sprinters"
    end
  end

  describe "#tired_sprinters" do
    it "should remove the sprinting role" do
      allow(vita).to receive(:remove_role) { "sprinters" }
      expect(woolf_server.tired_sprinters(vita)).to eq "sprinters"
    end
  end
end
