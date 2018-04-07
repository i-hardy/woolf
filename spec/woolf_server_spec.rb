# frozen_string_literal: true

require 'woolf_server'
require 'discordrb'

describe WoolfServer do
  let(:timer_class) { class_double('SprintTimer') }
  let(:server_object) { double(:server) }
  let(:woolf_server) { described_class.new(server_object, timer_class: timer_class) }
  let(:event) { double(:event) }
  let(:message) { double(:message) }
  let(:sprinters) { double(:role) }
  let(:vita) { double(:user) }
  let(:timer) { double(:sprinttimer) }

  before do
    suppress_log_output
    allow(timer_class).to receive(:new) { timer }
    allow(server_object).to receive(:roles) { [sprinters] }
    allow(server_object).to receive(:name) { 'server' }
    allow(event).to receive(:respond)
    allow(vita).to receive(:mention)
    allow(sprinters).to receive(:name) { 'sprinters' }
    allow(timer).to receive(:add_sprinters)
    allow(timer).to receive(:end_sprint)
  end

  describe 'initialization' do
    it 'sets a server object as an instance variable' do
      expect(woolf_server.server).to equal(server_object)
    end
  end

  describe '#writing_sprint' do
    it 'should only run one sprint at a time' do
      allow(woolf_server).to receive(:timer) { timer }
      allow(timer).to receive(:ended?) { false }
      expect(event).to receive(:respond).with('A sprint is already running')
      woolf_server.writing_sprint(event)
    end

    it 'should create a new sprint timer and run it' do
      allow(woolf_server).to receive(:timer) { timer }
      allow(timer).to receive(:ended?) { true }
      allow(timer).to receive(:set_start) { true }
      allow(woolf_server).to receive(:sprinting_role) { sprinters }
      allow(event).to receive_message_chain('message.content.match.captures') { [0, 0] }
      allow(event).to receive(:respond) { 'Get ready to sprint in 5 minutes' }
      allow(sprinters).to receive(:mention) { '@sprinters' }
      expect(woolf_server.writing_sprint(event)).to eq true
    end
  end

  describe '#get_sprinters' do
    it 'should return an error message if no sprint is running' do
      allow(woolf_server).to receive(:timer) { timer }
      allow(timer).to receive(:ended?) { true }
      expect(event).to receive(:respond).with('No sprint is running')
      woolf_server.get_sprinters(event)
    end

    it 'should pass opting-in sprinters into the timer' do
      allow(woolf_server).to receive(:timer) { timer }
      allow(event).to receive(:author) { vita }
      allow(timer).to receive(:ended?) { false }
      expect(timer).to receive(:add_sprinters)
      woolf_server.get_sprinters(event)
    end
  end

  describe '#permasprinters' do
    it 'should assign the springing role to a user' do
      allow(event).to receive(:author) { vita }
      expect(vita).to receive(:add_role)
      woolf_server.permasprinters(event)
    end
  end

  describe '#tired_sprinters' do
    it 'should remove the sprinting role' do
      allow(event).to receive(:author) { vita }
      expect(vita).to receive(:remove_role)
      woolf_server.tired_sprinters(event)
    end
  end

  describe '#get_synonym' do
    it 'passes a word to a Dinosaurus API call' do
      allow(event).to receive_message_chain('message.content.match.captures') { ['lighthouse'] }
      allow(event).to receive(:respond)
      allow(event).to receive_message_chain('author.mention') { '@vita' }
      expect(Dinosaurus).to receive(:synonyms_of)
      woolf_server.get_synonym(event)
    end
  end

  describe '#get_antonym' do
    it 'passes a word to a Dinosaurus API call' do
      allow(event).to receive_message_chain('message.content.match.captures') { ['waves'] }
      allow(event).to receive(:respond)
      allow(event).to receive_message_chain('author.mention') { '@vita' }
      expect(Dinosaurus).to receive(:antonyms_of)
      woolf_server.get_antonym(event)
    end
  end

  describe '#inspire' do
    it 'makes a Flickr api call' do
      allow(event).to receive(:respond)
      allow(event).to receive_message_chain('author.mention') { '@vita' }
      allow(FlickRaw).to receive(:url)
      expect(flickr).to receive_message_chain('interestingness.getList.to_a.sample')
      woolf_server.inspire(event)
    end

    it "returns the randomly selected photo's url" do
      allow(event).to receive(:respond)
      allow(event).to receive_message_chain('author.mention') { '@vita' }
      allow(flickr).to receive_message_chain('interestingness.getList.to_a.sample')
      expect(FlickRaw).to receive(:url)
      woolf_server.inspire(event)
    end
  end
end
