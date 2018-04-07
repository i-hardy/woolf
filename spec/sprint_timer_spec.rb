# frozen_string_literal: true

require 'sprint_timer'
require 'discordrb'

describe SprintTimer do
  let(:userlist_class) { class_double(UserList) }
  let(:userlist) { double(:userlist) }
  let(:event) { double(:event) }

  before do
    suppress_log_output
    allow(event).to receive_message_chain('message.content') { '!sprint in 1 for 1' }
  end

  subject(:timer) { described_class.new(event, userlist_class: userlist_class) }

  before do
    allow(userlist_class).to receive(:new) { userlist }
    allow(timer).to receive(:sleep)
    allow(userlist).to receive(:user_mentions) { '@sprinters @vita' }
  end

  describe '#set_start' do
    it 'should create a respond event' do
      expect(event).to receive(:respond).exactly(3).times
      timer.set_start
    end

    it 'should call the sprint_starter method' do
      allow(event).to receive(:respond)
      expect(timer).to receive(:sprint_starter)
      timer.set_start
    end
  end

  describe '#sprint_starter' do
    it 'should announce the start of the sprint' do
      expect(event).to receive(:respond).twice
      timer.sprint_starter
    end

    it 'should start the actual sprint' do
      allow(event).to receive(:respond)
      expect(timer).to receive(:sprint)
      timer.sprint_starter
    end
  end

  describe '#sprint_ender' do
    it 'should announce the end of the spring' do
      expect(event).to receive(:respond).with('@sprinters @vita Stop sprinting!')
      timer.sprint_ender
    end

    it 'should end the sprint' do
      allow(event).to receive(:respond)
      timer.sprint_ender
      expect(timer).to be_ended
    end
  end

  describe '#add_sprinters' do
    let(:vita) { double(:user) }

    it 'passes users into the userlist' do
      expect(userlist).to receive(:get_users_sprinting)
      timer.add_sprinters(vita)
    end
  end

  describe '#ended?' do
    it 'returns false if the timer is running' do
      expect(timer).not_to be_ended
    end
  end
end
