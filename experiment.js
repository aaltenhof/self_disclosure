function getUrlParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

const sonaId = getUrlParam('sona_id'); 

let globalTrialNumber = 0; 

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

const instructions = {
    type: jsPsychHtmlKeyboardResponse,  
    stimulus: `
        <div style="max-width: 800px; margin: 0 auto; text-align: center;">
            <h2>Instructions</h2>
            <p>In this experiment, you will see four words and a category description that someone created to group those words together.</p>
            <p>Your task is to determine how good that description is for the given words. Specifcally, you'll rate: </p>
            <ol style="text-align: left; display: inline-block;">
                <li><strong>Applicability:</strong> How well does this description apply to all four words?
                    <p style="font-weight: normal; margin: 5px 0 15px 0;">A category description might be better for some words than others. A more applicable description will describe all the words in the set. </p>
                    <div style="display: flex; gap: 20px; margin: 15px 0 25px 0;">
                        <div style="flex: 1; border: 1px solid #ddd; border-radius: 5px; overflow: hidden;">
                            <div style="background-color: #e74c3c; color: white; padding: 8px; font-weight: bold;">Less Applicable Example</div>
                            <div style="padding: 12px; font-weight: normal;">
                                <p><strong>Words:</strong> shoe, trowel, rope, lantern</p>
                                <p><strong>Category:</strong> "Things you can burn your hand on"</p>
                                <p><strong>Why it's less applicable:</strong> This description doesn't work well for all four words. You could burn your hand on a lantern or using a rope, but not on a shoe or a trowel.</p>
                            </div>
                        </div>
                        <div style="flex: 1; border: 1px solid #ddd; border-radius: 5px; overflow: hidden;">
                            <div style="background-color: #27ae60; color: white; padding: 8px; font-weight: bold;">More Applicable Example</div>
                            <div style="padding: 12px; font-weight: normal;">
                                <p><strong>Words:</strong> shoe, trowel, rope, lantern</p>
                                <p><strong>Category:</strong> "Things that might get lost during a camping trip"</p>
                                <p><strong>Why it's more applicable:</strong> This description applies well to all four words. Each item could plausibly be lost while camping.</p>
                            </div>
                        </div>
                    </div>
                </li>
                <li><strong>Specificity:</strong> How specific is this description to the words?
                    <p style="font-weight: normal; margin: 5px 0 15px 0;">Category descriptions can be broad or narrow. A more specific description only includes the items listed, and not any others.</p>
                    <div style="display: flex; gap: 20px; margin: 15px 0 25px 0;">
                        <div style="flex: 1; border: 1px solid #ddd; border-radius: 5px; overflow: hidden;">
                            <div style="background-color: #e74c3c; color: white; padding: 8px; font-weight: bold;">Less Specific Example</div>
                            <div style="padding: 12px; font-weight: normal;">
                                <p><strong>Words:</strong> apple, orange, cheese, yogurt</p>
                                <p><strong>Category:</strong> "Things you can eat"</p>
                                <p><strong>Why it's less specific:</strong> While true, this description is too general. It could apply to lots of other words.</p>
                            </div>
                        </div>
                        <div style="flex: 1; border: 1px solid #ddd; border-radius: 5px; overflow: hidden;">
                            <div style="background-color: #27ae60; color: white; padding: 8px; font-weight: bold;">More Specific Example</div>
                            <div style="padding: 12px; font-weight: normal;">
                                <p><strong>Words:</strong> apple, orange, cheese, yogurt</p>
                                <p><strong>Category:</strong> "Snacks you might find in a child's lunch box"</p>
                                <p><strong>Why it's more specific:</strong> This description has a more specific context that excludes lots of similar words.</p>
                            </div>
                        </div>
                    </div>
                </li>
            </ol>
            <p><strong>Press any key when you're ready to begin.</strong></p>
        </div>
    `,
    data: {
        trial_type: 'instructions'
    }
};

function createTrials(trialsData) {
    const experimentTrials = [];
    

    trialsData.forEach((item) => {
        globalTrialNumber++;

        const questionBox = `
            <div style="font-size: 22px; margin: 20px 0; padding: 20px; background-color: #f0f0f0; border-radius: 10px;">
                ${item.question}
            </div>`;

        const displayTrial = {
            type: jsPsychHtmlKeyboardResponse,
            stimulus: function() {
                return `
                    <div style="text-align: center; max-width: 800px; margin: 0 auto;">
                        <h3>Question:</h3>
                        ${questionBox}
                        <p style="margin-top: 30px; color: #666;">Press any key to continue.</p>
                    </div>
                `;
            },
            data: {
                custom_trial_type: 'display_trial',
            }
        };

        // personal rating
        const personalTrial = {
            type: jsPsychHtmlSliderResponse,
                stimulus: `
                <div style="text-align: center; max-width: 800px; margin: 0 auto;">
                    ${questionBox}
                    <p style="font-size: 20px; margin: 20px 0;"><strong>How personal is this question?</strong></p>
                </div>`,
                labels: [
                '0<br>Not <br>personal at all', 
                '25<br>Not really <br>personal', 
                '50<br>Neither <br>personal nor impersonal<br>', 
                '75<br>Moderately<br>personal', 
                '100<br>Very<br>personal'
            ],
            min: 0,
            max: 100,
            step: 1,
            slider_start: 50,
            require_movement: true,
            slider_width: 600,
            button_label: 'Continue',
            data: {
                custom_trial_type: 'personal_rating',
                trial_number: globalTrialNumber,
                participant_id: participant_id,
                q_id: item.q_id,
                group: item.group
            }
        };

        // difficulty rating
        const difficultyTrial = {
            type: jsPsychHtmlSliderResponse,
            stimulus: `
              <div style="text-align: center; max-width: 800px; margin: 0 auto;">
                  ${questionBox}
                  <p style="font-size: 20px; margin: 20px 0;"><strong>How personal is this question?</strong></p>
              </div>`,
            labels: [
                '0<br>Very<br>easy', 
                '25<br>Moderately<br>easy', 
                '50<br>Neutral<br>', 
                '75<br>Moderately<br>difficult', 
                '100<br>Very<br>difficult'
            ],
            min: 0,
            max: 100,
            step: 1,
            slider_start: 50,
            require_movement: true,
            slider_width: 600,
            button_label: 'Continue',
            data: {
                custom_trial_type: 'difficulty_rating',
                trial_number: globalTrialNumber,
                participant_id: participant_id,
                q_id: item.q_id,
                group: item.group

            }
        };

        experimentTrials.push(displayTrial, personalTrial, difficultyTrial);
    });
    
    return experimentTrials;
}

function loadQuestions(path) {
    return new Promise((resolve, reject) => {
        Papa.parse(path, {
            download: true,
            header: true,
            skipEmptyLines: true,
            transformHeader: h => h.replace(/^\uFEFF/, '').trim(),
            transform: v => v.trim(),
            complete: results => resolve(results.data),
            error: reject
        });
    });
}



let timeline = [];

async function runExperiment() {
    try {
        console.log('Participant ID:', participant_id);

        const trialsData = await loadQuestions('questions.csv');
        const ratingTrials = createTrials(trialsData);

        console.log(`Created ${ratingTrials.length} trial screens`);
      
        timeline = [
            consent,
            instructions,
            ...ratingTrials,
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