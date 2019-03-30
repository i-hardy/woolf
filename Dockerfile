FROM ruby:2.6.0-alpine

RUN apk add --no-cache git alpine-sdk

ADD . /app
WORKDIR /app

RUN bundle install
CMD ["bundle", "exec", "ruby", "./lib/woolf.rb"]