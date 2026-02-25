source "https://rubygems.org"
git_source(:github) { |repo| "https://github.com/#{repo}.git" }

ruby "~> 3.2"

gem "rails", "~> 7.1"
gem "pg", "~> 1.5"
gem "puma", "~> 5.0"
gem "sprockets-rails"
gem "jbuilder"
gem "bcrypt", "~> 3.1.7"
gem "tzinfo-data"
gem "bootsnap", require: false
gem "nokogiri"
gem "vite_rails", "~> 3.0"
gem "devise", "~> 4.9"
gem "sidekiq", "~> 7.0"
gem "redis", "~> 5.0"
gem "rack-cors"

group :development, :test do
  gem "debug", platforms: %i[ mri mingw x64_mingw ]
  gem "rspec-rails", "~> 6.0"
  gem "factory_bot_rails", "~> 6.0"
end

group :development do
  gem "web-console"
end

group :test do
  gem "capybara"
  gem "selenium-webdriver"
  gem "webdrivers"
  gem "timecop"
  gem "webmock"
end
