require "active_support/core_ext/integer/time"

Rails.application.configure do
  config.cache_classes = true
  config.eager_load = true
  config.consider_all_requests_local       = false
  config.action_controller.perform_caching = true

  config.public_file_server.enabled = true

  config.assets.compile = true

  config.active_storage.service = :local

  config.log_level = :info
  config.log_tags = [ :request_id ]

  config.action_mailer.perform_caching = false

  config.i18n.fallbacks = true
  config.active_support.report_deprecations = false

  config.log_formatter = ::Logger::Formatter.new

  logger           = ActiveSupport::Logger.new(STDOUT)
  logger.formatter = config.log_formatter
  config.logger    = ActiveSupport::TaggedLogging.new(logger)

  config.active_record.dump_schema_after_migration = false

  config.secret_key_base = ENV["SECRET_KEY_BASE"]
end
