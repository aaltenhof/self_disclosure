function getUrlParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

const sonaId = getUrlParam('sona_id'); 

let participant_id;

if (sonaId) {
    participant_id = sonaId;
    console.log('Using SONA ID:', participant_id);
} else {
    participant_id = `participant${Math.floor(Math.random() * 999) + 1}`;
    console.log('No SONA ID found, using random ID:', participant_id);
}

const jsPsych = initJsPsych({
    show_progress_bar: true,
    on_finish: function() {
    }
});


const consent = {
    type: jsPsychHtmlButtonResponse,  
    stimulus: `
        <div class="consent-text">
            <h3>Consent to Participate in Research</h3>
            
            <p>The task you are about to do is sponsored by University of Wisconsin-Madison. It is part of a protocol titled "What are we learning from language?"</p>

            <p>The task you are asked to do involves making simple responses to words and sentences. For example, you may be asked to rate a pair of words on their similarity or to indicate how true you think a given sentence is. More detailed instructions for this specific task will be provided on the next screen.</p>

            <p>This task has no direct benefits. We do not anticipate any psychosocial risks. There is a risk of a confidentiality breach. Participants may become fatigued or frustrated due to the length of the study.</p>

            <p>The responses you submit as part of this task will be stored on a secure server and accessible only to researchers who have been approved by UW-Madison. Processed data with all identifiers removed could be used for future research studies or distributed to another investigator for future research studies without additional informed consent from the subject or the legally authorized representative.</p>

            <p>You are free to decline to participate, to end participation at any time for any reason, or to refuse to answer any individual question without penalty or loss of earned compensation. We will not retain data from partial responses. If you would like to withdraw your data after participating, you may send an email lupyan@wisc.edu or complete this form which will allow you to make a request anonymously.</p>

            <p>If you have any questions or concerns about this task please contact the principal investigator: Prof. Gary Lupyan at lupyan@wisc.edu.</p>

            <p>If you are not satisfied with response of the research team, have more questions, or want to talk with someone about your rights as a research participant, you should contact University of Wisconsin's Education Research and Social & Behavioral Science IRB Office at 608-263-2320.</p>

            <p><strong>By clicking the box below, I consent to participate in this task and affirm that I am at least 18 years old.</strong></p>
        </div>
    `,
    choices: ['I Agree', 'I Do Not Agree'],
    data: {
        trial_type: 'consent'
    },
    on_finish: function(data) {
        if(data.response == 1) { // if 'I Do Not Agree'
            jsPsych.endExperiment('Thank you for your time. The experiment has been ended.');
        }
    }
};

var final_screen = {
    type: jsPsychHtmlButtonResponse,
    stimulus: function() {
        return `
            <div style="text-align: center; max-width: 600px; margin: 0 auto;">
                <h2>Thank you!</h2>
                <p>You have completed the experiment! Now you will complete a brief survey.</p>
            </div>
        `;
    },
    choices: ['Continue'],
    data: {
        trial_type: 'final'
    },  
    on_finish: function() {
        setTimeout(function() {
            // Pass sona_id to Qualtrics as a URL parameter
            let qualtricsUrl = `https://uwmadison.co1.qualtrics.com/jfe/form/SV_bCWCCMEZoDiiA3s`; //update
            
            if (sonaId) {
                qualtricsUrl += `?sona_id=${sonaId}`;
            }
            
            window.location.href = qualtricsUrl;
        }, 100);
    }
};

async function runExperiment() {
    try {
        console.log('Participant ID:', participant_id);
      
        timeline = [
            consent,
            //instructions,
            //save_data,
            final_screen
        ];
        
        jsPsych.run(timeline);
        
    } catch (error) {
        console.error('Error running experiment:', error);
        document.body.innerHTML = `
            <div style="max-width: 800px; margin: 50px auto; padding: 20px; background: #f8f8f8; border-radius: 5px; text-align: center;">
                <h2>Error Starting Experiment</h2>
                <p>There was a problem starting the experiment. Please try refreshing the page.</p>
                <p>If the problem persists, please contact the researcher.</p>
                <p>Technical details: ${error.message}</p>
            </div>
        `;
    }
}

document.addEventListener('DOMContentLoaded', runExperiment);