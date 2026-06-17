import twilio from 'twilio';
import env from '../config/env.js';
import logger from '../utils/logger.js';

let client = null;

function getClient() {
    if (!client) {
        if (!env.twilioAccountSid || !env.twilioAuthToken) {
            logger.warn('Twilio', 'Missing Twilio credentials. Call features disabled.');
            return null;
        }
        client = twilio(env.twilioAccountSid, env.twilioAuthToken);
        logger.success('Twilio', 'Client initialized');
    }
    return client;
}

/**
 * Create an outbound call to the lead's phone number.
 * The TwiML URL tells Twilio to connect to our Media Stream WebSocket.
 */
export async function createOutboundCall(phoneNumber, leadId) {
    const twilioClient = getClient();
    if (!twilioClient) throw new Error('Twilio client not initialized');

    const call = await twilioClient.calls.create({
        to: phoneNumber,
        from: env.twilioPhoneNumber,
        url: `${env.serverBaseUrl}/api/twilio/voice?leadId=${leadId}`,
        statusCallback: `${env.serverBaseUrl}/api/twilio/status?leadId=${leadId}`,
        statusCallbackEvent: ['initiated', 'ringing', 'answered', 'completed'],
        statusCallbackMethod: 'POST',
    });

    logger.call('Twilio', `Outbound call created: ${call.sid} → ${phoneNumber}`);
    return call;
}

/**
 * Generate TwiML that connects the call to a Media Stream WebSocket.
 */
export function generateStreamTwiML(leadId) {
    const VoiceResponse = twilio.twiml.VoiceResponse;
    const response = new VoiceResponse();

    // Greeting before the stream connects (gives Deepgram/ElevenLabs time to initialize)
    response.say(
        { voice: 'Polly.Aditi', language: 'en-IN' },
        'Please hold for a moment while I connect you.'
    );
    response.pause({ length: 1 });

    const connect = response.connect();
    const stream = connect.stream({
        url: `wss://${new URL(env.serverBaseUrl).host}/media-stream`,
    });
    stream.parameter({ name: 'leadId', value: leadId });

    return response.toString();
}

export { getClient };
