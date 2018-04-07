# frozen_string_literal: true

require 'user_list'

describe UserList do
  let(:role) { double(:role) }
  let(:vita) { double(:user) }
  subject(:userlist) { described_class.new }

  describe '#get_users_sprinting' do
    it 'should receive users opting in to a sprint' do
      expect(userlist.get_users_sprinting(vita)).to eq [vita]
    end
  end

  describe '#list' do
    it 'should enclose a list of users opting in to sprint' do
      expect(subject.list).to be_a Array
    end
  end

  describe '#user_mentions' do
    it 'should join the list into a string of mentions' do
      allow(vita).to receive(:mention) { '@vita' }
      userlist.get_users_sprinting(vita)
      expect(userlist.user_mentions).to eq '@vita'
    end
  end
end
