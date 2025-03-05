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
    tooltip.style.padding = "10px";
    tooltip.style.background = "rgba(0, 0, 0, 0.8)";
    tooltip.style.color = "white";
    tooltip.style.borderRadius = "5px";
    tooltip.style.zIndex = "9999";
    tooltip.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.3)";
    tooltip.style.transition = "opacity 0.3s ease-in-out";
    tooltip.style.opacity = "0";
    
    tooltip.style.top = `${element.getBoundingClientRect().top - 50}px`;
    tooltip.style.left = `${element.getBoundingClientRect().left}px`;
    
    document.body.appendChild(tooltip);

    setTimeout(() => {
        tooltip.style.opacity = "1";
    }, 100);

    let nextButton = document.createElement("button");
    nextButton.innerText = "Next";
    nextButton.style.marginLeft = "10px";
    nextButton.style.cursor = "pointer";
    nextButton.style.border = "none";
    nextButton.style.padding = "5px 10px";
    nextButton.style.background = "#007BFF";
    nextButton.style.color = "white";
    nextButton.style.borderRadius = "3px";
    nextButton.style.transition = "background 0.3s";
    nextButton.onmouseover = () => nextButton.style.background = "#0056b3";
    nextButton.onmouseout = () => nextButton.style.background = "#007BFF";

    nextButton.onclick = () => {
        document.body.removeChild(tooltip);
        onNext();
    };

    tooltip.appendChild(nextButton);
}

function cleanupOnboarding() {
    document.body.removeChild(cursor);
}

// Create a **professional-looking fake cursor**
const cursor = document.createElement("div");
cursor.style.position = "fixed";
cursor.style.width = "20px"; // Bigger cursor
cursor.style.height = "20px"; 
cursor.style.borderRadius = "50%";
cursor.style.background = "white";
cursor.style.border = "3px solid #007BFF"; // Blue outline
cursor.style.boxShadow = "0 0 10px rgba(0, 123, 255, 0.7)";
cursor.style.zIndex = "9999";
cursor.style.pointerEvents = "none";
cursor.style.transition = "transform 0.1s ease-out";
document.body.appendChild(cursor);
