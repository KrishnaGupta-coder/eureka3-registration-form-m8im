/* ==========================================================================
   EUREKA! 2026 REGISTRATION WEBSITE - JAVASCRIPT
   Organized by Arya College of Engineering & I.T. & Arya Incubation Centre
   Features: Multi-step wizard, dynamic member cards, real-time validation, Google Apps Script API client
   ========================================================================== */

// --------------------------------------------------------------------------
// 1. Google Apps Script Web App Deployment URL
// Replace YOUR_SCRIPT_ID after deploying Code.gs as a Web App
// --------------------------------------------------------------------------
const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycby8y1es_e1x9ToCa3atujCSXqXH7OHfE0uVm7fXjizIbghkiMAXCOF-AV1wXD6TP0k/exec';

// Form Wizard State
let currentStep = 1;
const totalSteps = 4;

// Validation Regex Patterns
const PHONE_REGEX = /^[6-9]\d{9}$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// DOM Content Loaded Handler
document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initTeamSizeHandler();
    initCharCounter();
    initFormValidation();
    updateProgressBar();
});

/* --------------------------------------------------------------------------
   2. Sticky Navbar & Responsive Menu Toggle
   -------------------------------------------------------------------------- */
function initNavigation() {
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');

    if (navToggle) {
        navToggle.addEventListener('click', () => {
            navMenu.classList.toggle('show');
        });
    }

    // Close mobile menu on nav link click
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navMenu.classList.contains('show')) {
                navMenu.classList.remove('show');
            }
        });
    });

    // Update active nav link on scroll
    window.addEventListener('scroll', () => {
        let fromTop = window.scrollY + 120;
        navLinks.forEach(link => {
            let section = document.querySelector(link.hash);
            if (section) {
                if (
                    section.offsetTop <= fromTop &&
                    section.offsetTop + section.offsetHeight > fromTop
                ) {
                    link.classList.add('active');
                } else {
                    link.classList.remove('active');
                }
            }
        });
    });
}

/* --------------------------------------------------------------------------
   3. Wizard Navigation & Progress Bar
   -------------------------------------------------------------------------- */
function updateProgressBar() {
    const progressBar = document.getElementById('progressBar');
    const stepIndicators = document.querySelectorAll('.step-indicator');

    // Progress percentage
    const progressPercent = ((currentStep - 1) / (totalSteps - 1)) * 100;
    if (progressBar) {
        progressBar.style.width = `${progressPercent}%`;
    }

    stepIndicators.forEach((indicator, index) => {
        const stepNum = index + 1;
        indicator.classList.remove('active', 'completed');

        if (stepNum === currentStep) {
            indicator.classList.add('active');
        } else if (stepNum < currentStep) {
            indicator.classList.add('completed');
        }
    });
}

function showStep(stepNum) {
    const stepPanels = document.querySelectorAll('.step-panel');
    stepPanels.forEach(panel => panel.classList.remove('active'));

    const targetPanel = document.getElementById(`step${stepNum}`);
    if (targetPanel) {
        targetPanel.classList.add('active');
    }

    currentStep = stepNum;
    updateProgressBar();

    // Generate summary preview if entering Step 4
    if (currentStep === 4) {
        generateSummary();
    }

    // Scroll to registration top
    const regSection = document.getElementById('registration');
    if (regSection) {
        regSection.scrollIntoView({ behavior: 'smooth' });
    }
}

function nextStep(fromStep) {
    if (validateStep(fromStep)) {
        if (fromStep < totalSteps) {
            showStep(fromStep + 1);
        }
    }
}

function prevStep(fromStep) {
    if (fromStep > 1) {
        showStep(fromStep - 1);
    }
}

function goToStep(stepNum) {
    if (stepNum < currentStep) {
        showStep(stepNum);
    } else if (stepNum > currentStep) {
        // Validate preceding steps before allowing jump ahead
        let valid = true;
        for (let s = 1; s < stepNum; s++) {
            if (!validateStep(s)) {
                valid = false;
                showStep(s);
                break;
            }
        }
        if (valid) {
            showStep(stepNum);
        }
    }
}

/* --------------------------------------------------------------------------
   4. Dynamic Team Member Fields Handler (Step 2)
   -------------------------------------------------------------------------- */
function initTeamSizeHandler() {
    const teamSizeSelect = document.getElementById('teamSize');
    if (!teamSizeSelect) return;

    teamSizeSelect.addEventListener('change', () => {
        handleTeamSizeChange(parseInt(teamSizeSelect.value));
    });

    // Initialize state
    handleTeamSizeChange(parseInt(teamSizeSelect.value || 1));
}

function handleTeamSizeChange(size) {
    const soloNotice = document.getElementById('soloNotice');
    const card2 = document.getElementById('memberCard2');
    const card3 = document.getElementById('memberCard3');
    const card4 = document.getElementById('memberCard4');
    const card5 = document.getElementById('memberCard5');
    const card6 = document.getElementById('memberCard6');
    const card7 = document.getElementById('memberCard7');

    // Reset member cards visibility
    if (soloNotice) soloNotice.style.display = (size === 1) ? 'flex' : 'none';

    toggleMemberCard(card2, size >= 2, ['m2Name', 'm2Roll', 'm2Branch', 'm2Section', 'm2Mobile']);
    toggleMemberCard(card3, size >= 3, ['m3Name', 'm3Roll', 'm3Branch', 'm3Section', 'm3Mobile']);
    toggleMemberCard(card4, size >= 4, ['m4Name', 'm4Roll', 'm4Branch', 'm4Section', 'm4Mobile']);
    toggleMemberCard(card5, size >= 5, ['m5Name', 'm5Roll', 'm5Branch', 'm5Section', 'm5Mobile']);
    toggleMemberCard(card6, size >= 6, ['m6Name', 'm6Roll', 'm6Branch', 'm6Section', 'm6Mobile']);
    toggleMemberCard(card7, size >= 7, ['m7Name', 'm7Roll', 'm7Branch', 'm7Section', 'm7Mobile']);
}

function toggleMemberCard(cardElement, show, fieldIds) {
    if (!cardElement) return;

    if (show) {
        cardElement.classList.remove('hidden');
        fieldIds.forEach(id => {
            const input = document.getElementById(id);
            if (input) input.setAttribute('required', 'true');
        });
    } else {
        cardElement.classList.add('hidden');
        fieldIds.forEach(id => {
            const input = document.getElementById(id);
            if (input) {
                input.removeAttribute('required');
                input.value = '';
                clearFieldError(input);
            }
        });
    }
}

/* --------------------------------------------------------------------------
   5. Step 3 Character Counter
   -------------------------------------------------------------------------- */
function initCharCounter() {
    const textarea = document.getElementById('projectDescription');
    const charCountBadge = document.getElementById('charCount');
    const charWarning = document.getElementById('charWarning');

    if (!textarea || !charCountBadge) return;

    textarea.addEventListener('input', () => {
        const len = textarea.value.length;
        charCountBadge.textContent = len;

        if (len < 50) {
            charWarning.textContent = `Minimum 50 characters required (${50 - len} more needed)`;
            charWarning.style.color = 'var(--error)';
            charCountBadge.parentElement.classList.add('limit-warning');
        } else if (len > 550) {
            charWarning.textContent = `${600 - len} characters remaining`;
            charWarning.style.color = 'var(--warning)';
            charCountBadge.parentElement.classList.add('limit-warning');
        } else {
            charWarning.textContent = `Character count requirement met ✓`;
            charWarning.style.color = 'var(--success)';
            charCountBadge.parentElement.classList.remove('limit-warning');
        }
    });
}

/* --------------------------------------------------------------------------
   6. Form Validation Logic
   -------------------------------------------------------------------------- */
function initFormValidation() {
    const form = document.getElementById('eurekaForm');
    if (!form) return;

    // Attach real-time input error clearing
    const inputs = form.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
        input.addEventListener('input', () => clearFieldError(input));
        input.addEventListener('change', () => clearFieldError(input));
    });

    // Form submission event
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        if (validateStep(1) && validateStep(2) && validateStep(3) && validateStep(4)) {
            submitForm();
        }
    });
}

function showFieldError(input, message) {
    if (!input) return;
    input.classList.add('is-invalid');
    const errorSpan = document.getElementById(`error-${input.id}`);
    if (errorSpan) {
        if (message) errorSpan.textContent = message;
        errorSpan.style.display = 'block';
    }
}

function clearFieldError(input) {
    if (!input) return;
    input.classList.remove('is-invalid');
    const errorSpan = document.getElementById(`error-${input.id}`);
    if (errorSpan) {
        errorSpan.style.display = 'none';
    }
}

function validateStep(stepNum) {
    let isValid = true;

    if (stepNum === 1) {
        const leaderName = document.getElementById('leaderName');
        const leaderRollNo = document.getElementById('leaderRollNo');
        const branch = document.getElementById('branch');
        const section = document.getElementById('section');
        const year = document.getElementById('year');
        const mobile = document.getElementById('mobile');
        const email = document.getElementById('email');
        const teamName = document.getElementById('teamName');

        if (!leaderName.value.trim()) { showFieldError(leaderName); isValid = false; }
        if (!leaderRollNo.value.trim()) { showFieldError(leaderRollNo); isValid = false; }
        if (!branch.value) { showFieldError(branch); isValid = false; }
        if (!section.value) { showFieldError(section); isValid = false; }
        if (!year.value) { showFieldError(year); isValid = false; }

        if (!PHONE_REGEX.test(mobile.value.trim())) {
            showFieldError(mobile, 'Enter a valid 10-digit mobile number starting with 6-9');
            isValid = false;
        }

        if (!EMAIL_REGEX.test(email.value.trim())) {
            showFieldError(email, 'Enter a valid Email ID (e.g. name@domain.com)');
            isValid = false;
        }

        if (!teamName.value.trim()) { showFieldError(teamName); isValid = false; }

    } else if (stepNum === 2) {
        const teamSize = parseInt(document.getElementById('teamSize').value || 1);

        if (teamSize >= 2) isValid = validateMemberFields(['m2Name', 'm2Roll', 'm2Branch', 'm2Section', 'm2Mobile']) && isValid;
        if (teamSize >= 3) isValid = validateMemberFields(['m3Name', 'm3Roll', 'm3Branch', 'm3Section', 'm3Mobile']) && isValid;
        if (teamSize >= 4) isValid = validateMemberFields(['m4Name', 'm4Roll', 'm4Branch', 'm4Section', 'm4Mobile']) && isValid;
        if (teamSize >= 5) isValid = validateMemberFields(['m5Name', 'm5Roll', 'm5Branch', 'm5Section', 'm5Mobile']) && isValid;
        if (teamSize >= 6) isValid = validateMemberFields(['m6Name', 'm6Roll', 'm6Branch', 'm6Section', 'm6Mobile']) && isValid;
        if (teamSize >= 7) isValid = validateMemberFields(['m7Name', 'm7Roll', 'm7Branch', 'm7Section', 'm7Mobile']) && isValid;

    } else if (stepNum === 3) {
        const projectDesc = document.getElementById('projectDescription');
        const len = projectDesc.value.trim().length;

        if (len < 50 || len > 600) {
            showFieldError(projectDesc, 'Project description must be between 50 and 600 characters');
            isValid = false;
        }

    } else if (stepNum === 4) {
        const decStudent = document.getElementById('decStudent');
        const decAccuracy = document.getElementById('decAccuracy');
        const decUpdates = document.getElementById('decUpdates');

        if (!decStudent.checked) { showFieldError(decStudent); isValid = false; }
        if (!decAccuracy.checked) { showFieldError(decAccuracy); isValid = false; }
        if (!decUpdates.checked) { showFieldError(decUpdates); isValid = false; }
    }

    return isValid;
}

function validateMemberFields(ids) {
    let valid = true;
    const name = document.getElementById(ids[0]);
    const roll = document.getElementById(ids[1]);
    const branch = document.getElementById(ids[2]);
    const section = document.getElementById(ids[3]);
    const mobile = document.getElementById(ids[4]);

    if (!name.value.trim()) { showFieldError(name); valid = false; }
    if (!roll.value.trim()) { showFieldError(roll); valid = false; }
    if (!branch.value) { showFieldError(branch); valid = false; }
    if (!section.value) { showFieldError(section); valid = false; }
    if (!PHONE_REGEX.test(mobile.value.trim())) {
        showFieldError(mobile, 'Enter valid 10-digit mobile number');
        valid = false;
    }

    return valid;
}

/* --------------------------------------------------------------------------
   7. Generate Step 4 Summary Overview
   -------------------------------------------------------------------------- */
function generateSummary() {
    const summaryGrid = document.getElementById('summaryGrid');
    if (!summaryGrid) return;

    const leaderName = document.getElementById('leaderName').value.trim();
    const leaderRollNo = document.getElementById('leaderRollNo').value.trim();
    const branch = document.getElementById('branch').value;
    const section = document.getElementById('section').value;
    const year = document.getElementById('year').value;
    const mobile = document.getElementById('mobile').value.trim();
    const email = document.getElementById('email').value.trim();
    const teamName = document.getElementById('teamName').value.trim();
    const projectName = document.getElementById('projectName').value.trim() || 'N/A';
    const teamSize = parseInt(document.getElementById('teamSize').value);
    const projectDesc = document.getElementById('projectDescription').value.trim();

    let membersSummaryHtml = '';
    for (let i = 2; i <= teamSize; i++) {
        const mName = document.getElementById(`m${i}Name`).value.trim();
        const mRoll = document.getElementById(`m${i}Roll`).value.trim();
        const mBranch = document.getElementById(`m${i}Branch`).value;
        membersSummaryHtml += `<div class="summary-item"><span class="label">Member ${i}:</span> <span class="value">${mName} (${mRoll} - ${mBranch})</span></div>`;
    }

    summaryGrid.innerHTML = `
        <div class="summary-item"><span class="label">Team Name:</span> <span class="value">${teamName}</span></div>
        <div class="summary-item"><span class="label">Team Size:</span> <span class="value">${teamSize} Member(s)</span></div>
        <div class="summary-item"><span class="label">Project Title:</span> <span class="value">${projectName}</span></div>
        <div class="summary-item"><span class="label">Team Leader:</span> <span class="value">${leaderName}</span></div>
        <div class="summary-item"><span class="label">Leader Roll No:</span> <span class="value">${leaderRollNo}</span></div>
        <div class="summary-item"><span class="label">Branch & Sec:</span> <span class="value">${branch} - Sec ${section} (${year})</span></div>
        <div class="summary-item"><span class="label">Leader Mobile:</span> <span class="value">${mobile}</span></div>
        <div class="summary-item"><span class="label">Leader Email:</span> <span class="value">${email}</span></div>
        ${membersSummaryHtml}
        <div class="summary-item" style="grid-column: span 2;">
            <span class="label">Project Summary Preview:</span>
            <span class="value" style="font-size: 0.85rem; font-weight: normal; max-height: 80px; overflow-y: auto; display: block; margin-top: 4px; color: var(--text-muted);">
                "${projectDesc.substring(0, 180)}${projectDesc.length > 180 ? '...' : ''}"
            </span>
        </div>
    `;
}

/* --------------------------------------------------------------------------
   8. Form Submission to Google Apps Script
   -------------------------------------------------------------------------- */
async function submitForm() {
    const submitBtn = document.getElementById('submitBtn');
    const btnText = submitBtn.querySelector('.btn-text');
    const spinner = submitBtn.querySelector('.spinner');

    // Disable button & show spinner loading state
    submitBtn.disabled = true;
    if (btnText) btnText.textContent = 'Submitting Registration...';
    if (spinner) spinner.classList.remove('hidden');

    const teamSize = parseInt(document.getElementById('teamSize').value);

    // Generate dynamic Registration ID
    const randomCode = Math.floor(1000 + Math.random() * 9000);
    const regId = `EUR-2026-${randomCode}`;

    // Build Payload JSON
    const payload = {
        registrationId: regId,
        timestamp: new Date().toISOString(),
        teamLeader: document.getElementById('leaderName').value.trim(),
        leaderRollNo: document.getElementById('leaderRollNo').value.trim(),
        branch: document.getElementById('branch').value,
        section: document.getElementById('section').value,
        year: document.getElementById('year').value,
        mobile: document.getElementById('mobile').value.trim(),
        email: document.getElementById('email').value.trim(),
        teamName: document.getElementById('teamName').value.trim(),
        projectName: document.getElementById('projectName').value.trim() || 'N/A',
        teamSize: teamSize,
        member2: teamSize >= 2 ? {
            name: document.getElementById('m2Name').value.trim(),
            rollNumber: document.getElementById('m2Roll').value.trim(),
            branch: document.getElementById('m2Branch').value,
            section: document.getElementById('m2Section').value,
            mobile: document.getElementById('m2Mobile').value.trim()
        } : null,
        member3: teamSize >= 3 ? {
            name: document.getElementById('m3Name').value.trim(),
            rollNumber: document.getElementById('m3Roll').value.trim(),
            branch: document.getElementById('m3Branch').value,
            section: document.getElementById('m3Section').value,
            mobile: document.getElementById('m3Mobile').value.trim()
        } : null,
        member4: teamSize >= 4 ? {
            name: document.getElementById('m4Name').value.trim(),
            rollNumber: document.getElementById('m4Roll').value.trim(),
            branch: document.getElementById('m4Branch').value,
            section: document.getElementById('m4Section').value,
            mobile: document.getElementById('m4Mobile').value.trim()
        } : null,
        member5: teamSize >= 5 ? {
            name: document.getElementById('m5Name').value.trim(),
            rollNumber: document.getElementById('m5Roll').value.trim(),
            branch: document.getElementById('m5Branch').value,
            section: document.getElementById('m5Section').value,
            mobile: document.getElementById('m5Mobile').value.trim()
        } : null,
        member6: teamSize >= 6 ? {
            name: document.getElementById('m6Name').value.trim(),
            rollNumber: document.getElementById('m6Roll').value.trim(),
            branch: document.getElementById('m6Branch').value,
            section: document.getElementById('m6Section').value,
            mobile: document.getElementById('m6Mobile').value.trim()
        } : null,
        member7: teamSize >= 7 ? {
            name: document.getElementById('m7Name').value.trim(),
            rollNumber: document.getElementById('m7Roll').value.trim(),
            branch: document.getElementById('m7Branch').value,
            section: document.getElementById('m7Section').value,
            mobile: document.getElementById('m7Mobile').value.trim()
        } : null,
        projectDescription: document.getElementById('projectDescription').value.trim()
    };

    try {
        // Send fetch request to Google Apps Script
        const response = await fetch(APPS_SCRIPT_URL, {
            method: 'POST',
            mode: 'cors',
            headers: {
                'Content-Type': 'text/plain;charset=utf-8' // Text/plain avoids CORS preflight triggers in Apps Script
            },
            body: JSON.stringify(payload)
        });

        document.getElementById('resRegId').textContent = regId;

        // Show Success Overlay
        showSuccessModal();

    } catch (error) {
        console.error('Submission error:', error);

        document.getElementById('resRegId').textContent = regId;

        // If APPS_SCRIPT_URL is still placeholder, notify user or fallback
        if (APPS_SCRIPT_URL.includes('YOUR_SCRIPT_ID')) {
            showSuccessModal(); // Demo mode success
        } else {
            showErrorModal('Network error during submission. Please check your deployment URL or try again.');
        }
    } finally {
        // Reset submit button state
        submitBtn.disabled = false;
        if (btnText) btnText.textContent = 'Submit Registration 🚀';
        if (spinner) spinner.classList.add('hidden');
    }
}

/* --------------------------------------------------------------------------
   9. Modal Dialog Controller
   -------------------------------------------------------------------------- */
function showSuccessModal() {
    const modal = document.getElementById('successModal');
    if (modal) modal.classList.remove('hidden');
}

function closeSuccessModal() {
    const modal = document.getElementById('successModal');
    if (modal) modal.classList.add('hidden');
}

function showErrorModal(message) {
    const modal = document.getElementById('errorModal');
    const msgText = document.getElementById('errorMessageText');
    if (msgText && message) msgText.textContent = message;
    if (modal) modal.classList.remove('hidden');
}

function closeErrorModal() {
    const modal = document.getElementById('errorModal');
    if (modal) modal.classList.add('hidden');
}

function resetRegistrationForm() {
    closeSuccessModal();
    const form = document.getElementById('eurekaForm');
    if (form) form.reset();

    // Reset Team Size handler
    handleTeamSizeChange(1);

    // Reset character counter
    const charCount = document.getElementById('charCount');
    if (charCount) charCount.textContent = '0';

    // Show Step 1
    showStep(1);
}
