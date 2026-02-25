class RecaptchaVerifier
  VERIFY_URL = "https://www.google.com/recaptcha/api/siteverify"
  SECRET_KEY = ENV.fetch("RECAPTCHA_SECRET_KEY", "6LeIxAcTAAAAAGG-vFI1TnRWxMZNFuojJ4WifJWe")

  def self.verify(token)
    return true if Rails.env.test?
    return false if token.blank?

    uri = URI(VERIFY_URL)
    response = Net::HTTP.post_form(uri, {
      secret: SECRET_KEY,
      response: token
    })

    result = JSON.parse(response.body)
    result["success"] == true && result.fetch("score", 1.0) >= 0.5
  rescue StandardError
    false
  end
end
