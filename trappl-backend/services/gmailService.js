const { google } = require('googleapis');
const axios = require('axios');
const Job = require('../models/jobModel');

// The Hugging Face Inference API endpoint for the selected NER model
const HF_API_URL = "https://api-inference.huggingface.co/models/dslim/bert-base-NER";

/**
 * Parses text using the Hugging Face NER model to extract entities.
 * @param {string} text The text to parse (e.g., email subject and snippet).
 * @returns {Promise<object>} An object containing the extracted company and position.
 */
async function parseTextWithHF(text) {
    try {
        const response = await axios.post(
            HF_API_URL,
            { inputs: text },
            { headers: { Authorization: `Bearer ${process.env.HF_API_TOKEN}` } }
        );

        if (!response.data || !Array.isArray(response.data)) {
            console.warn("Received invalid response from Hugging Face API:", response.data);
            return {};
        }

        const entities = {};
        let currentEntity = null;

        response.data.forEach(item => {
            if (item.entity_group.startsWith('B-')) { // Beginning of a new entity
                currentEntity = {
                    type: item.entity_group.substring(2), // e.g., 'ORG', 'MISC'
                    text: item.word,
                    score: item.score,
                };
                if (!entities[currentEntity.type]) {
                    entities[currentEntity.type] = [];
                }
                entities[currentEntity.type].push(currentEntity);
            } else if (item.entity_group.startsWith('I-') && currentEntity) { // Inside an existing entity
                const entityType = item.entity_group.substring(2);
                const lastEntity = entities[entityType]?.[entities[entityType].length - 1];
                if (lastEntity && item.word.startsWith('##')) {
                    lastEntity.text += item.word.substring(2); // Append sub-word
                } else if (lastEntity) {
                    lastEntity.text += ` ${item.word}`; // Append whole word
                }
            }
        });

        const company = entities.ORG?.sort((a, b) => b.score - a.score)[0]?.text || null;
        const position = entities.MISC?.sort((a, b) => b.score - a.score)[0]?.text || null;

        return { company, position };

    } catch (error) {
        console.error("Error calling Hugging Face API:", error.response ? error.response.data : error.message);
        return {};
    }
}


const syncGmail = async (user) => {
    if (!user.googleRefreshToken) {
        throw new Error('User has no refresh token. Please re-authenticate.');
    }

    const oauth2Client = new google.auth.OAuth2(
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_CLIENT_SECRET,
        `${process.env.SERVER_URL}/api/auth/google/callback`
    );

    oauth2Client.setCredentials({
        refresh_token: user.googleRefreshToken,
    });

    const gmail = google.gmail({ version: 'v1', auth: oauth2Client });

    // --- THIS IS THE KEY CHANGE ---
    // Calculate the date 7 days ago
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const formattedDate = sevenDaysAgo.toISOString().split('T')[0].replace(/-/g, '/'); // Format as YYYY/MM/DD

    // UPDATED: Broader search query that also filters by date
    const query = `subject:("application" OR "applied" OR "resume" OR "thank you for applying" OR "application received" OR "confirmation") after:${formattedDate}`;
    
    const res = await gmail.users.messages.list({
        userId: 'me',
        q: query,
        maxResults: 50, // Check a reasonable number of recent emails
    });

    const messages = res.data.messages;
    if (!messages || messages.length === 0) {
        return { newJobsCount: 0 };
    }

    let newJobsCount = 0;

    for (const message of messages) {
        const email = await gmail.users.messages.get({ userId: 'me', id: message.id, format: 'full' });
        const headers = email.data.payload.headers;
        const subject = headers.find(h => h.name === 'Subject')?.value || '';
        const dateHeader = headers.find(h => h.name === 'Date')?.value;
        const appliedDate = dateHeader ? new Date(dateHeader) : new Date();

        const textToParse = `${subject}. ${email.data.snippet}`;
        const jobDetails = await parseTextWithHF(textToParse);

        if (jobDetails.company && jobDetails.position) {
            const result = await Job.updateOne(
                { userId: user._id, company: jobDetails.company, position: jobDetails.position },
                {
                    $setOnInsert: {
                        appliedDate: appliedDate,
                        userId: user._id,
                        source: 'Gmail',
                        status: 'Applied',
                    }
                },
                { upsert: true }
            );

            if (result.upsertedId) {
                newJobsCount++;
            }
        }
    }
    
    console.log(`Added ${newJobsCount} new jobs for ${user.email} from the last 7 days.`);
    return { newJobsCount };
};

module.exports = { syncGmail };
