window.onload = () => {
    console.log("Onboarding script loaded!");
    startOnboarding();
};

const onboardingSteps = [
    { selector: ".btn-outline-secondary", message: "Click here to refresh.", delay: 1000 },
    { selector: "table tbody tr:first-child", message: "This is a pending approval.", delay: 1500 },
    { selector: "a[href='/admin/logout/']", message: "Click here to log out.", delay: 2000 }
];

function startOnboarding() {
    let stepIndex = 0;

    function nextStep() {
        if (stepIndex >= onboardingSteps.length) {
            console.log("Onboarding completed.");
            cleanupOnboarding();
            return;
        }

        const step = onboardingSteps[stepIndex];
        const element = document.querySelector(step.selector);

        if (!element) {
            console.warn(`Element not found: ${step.selector}`);
            stepIndex++;
            nextStep();
            return;
        }

        moveCursorToElement(element, () => {
            showTooltip(element, step.message, () => {
                stepIndex++;
                nextStep();
            });
        });
    }

    nextStep();
}

function moveCursorToElement(targetElement, callback) {
    const rect = targetElement.getBoundingClientRect();
    let currentX = window.innerWidth / 2;
    let currentY = window.innerHeight / 2;
    const targetX = rect.left + rect.width / 2;
    const targetY = rect.top + rect.height / 2;

    function animate() {
        if (Math.abs(currentX - targetX) < 5 && Math.abs(currentY - targetY) < 5) {
            cursor.style.left = `${targetX}px`;
            cursor.style.top = `${targetY}px`;
            setTimeout(callback, 500);
            return;
        }

        currentX += (targetX - currentX) / 10;
        currentY += (targetY - currentY) / 10;

        cursor.style.left = `${currentX}px`;
        cursor.style.top = `${currentY}px`;
        requestAnimationFrame(animate);
    }

    animate();
}

function showTooltip(element, message, onNext) {
    let tooltip = document.createElement("div");
    tooltip.innerText = message;
    tooltip.style.position = "absolute";
    tooltip.style.padding = "8px";
    tooltip.style.background = "black";
    tooltip.style.color = "white";
    tooltip.style.borderRadius = "5px";
    tooltip.style.zIndex = "9999";
    tooltip.style.top = `${element.getBoundingClientRect().top - 40}px`;
    tooltip.style.left = `${element.getBoundingClientRect().left}px`;
    document.body.appendChild(tooltip);

    let nextButton = document.createElement("button");
    nextButton.innerText = "Next";
    nextButton.style.marginLeft = "10px";
    nextButton.style.cursor = "pointer";
    nextButton.onclick = () => {
        document.body.removeChild(tooltip);
        onNext();
    };
    tooltip.appendChild(nextButton);
}

function cleanupOnboarding() {
    document.body.removeChild(cursor);
}

const cursor = document.createElement("div");
cursor.style.position = "fixed";
cursor.style.width = "10px";
cursor.style.height = "10px";
cursor.style.borderRadius = "50%";
cursor.style.background = "red";
cursor.style.zIndex = "9999";
cursor.style.pointerEvents = "none";
document.body.appendChild(cursor);