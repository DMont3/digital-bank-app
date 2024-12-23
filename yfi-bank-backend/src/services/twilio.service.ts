import { Twilio } from 'twilio';
import { config } from '../config/env';
import { format } from 'libphonenumber-js';

export class TwilioService {
  private twilioClient: Twilio;

  constructor() {
    this.twilioClient = new Twilio(config.twilioAccountSid, config.twilioAuthToken);
  }

  async sendVerificationCode(phoneNumber: string) {
    try {
      const formattedPhoneNumber = format(phoneNumber, 'BR', 'E.164');
      const verification = await this.twilioClient.verify.v2
        .services(config.twilioVerifyServiceSid)
        .verifications.create({ to: formattedPhoneNumber, channel: 'sms' });

      return verification;
    } catch (error) {
      console.error('Error sending verification code:', error);
      throw error;
    }
  }

  async verifyCode(phoneNumber: string, code: string) {
    try {
      const formattedPhoneNumber = format(phoneNumber, 'BR', 'E.164');
      const verificationCheck = await this.twilioClient.verify.v2
        .services(config.twilioVerifyServiceSid)
        .verificationChecks.create({ to: formattedPhoneNumber, code });

      return verificationCheck;
    } catch (error) {
      console.error('Error verifying code:', error);
      throw error;
    }
  }
}
