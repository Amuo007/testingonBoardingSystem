window.onload = () => {
    console.log("Enhanced onboarding script loaded!");
    initializeCursor();
    setTimeout(startOnboarding, 800); // Slight delay before starting
};

const onboardingSteps = [
    { 
        selector: ".btn-outline-secondary", 
        message: "Click here to refresh.", 
        delay: 1000,
        animation: "pulse" 
    },
    { 
        selector: "table tbody tr:first-child", 
        message: "This is a pending approval.", 
        delay: 1500,
        animation: "highlight" 
    },
    { 
        selector: "a[href='/admin/logout/']", 
        message: "Click here to log out.", 
        delay: 2000,
        animation: "bounce" 
    }
];

let cursor;

function initializeCursor() {
    // Create a professional animated cursor
    cursor = document.createElement("div");
    
    // Main cursor dot
    cursor.innerHTML = `
        <div class="cursor-dot"></div>
        <div class="cursor-ring"></div>
        <div class="cursor-click-effect"></div>
    `;
    
    // Add styles
    const style = document.createElement('style');
    style.textContent = `
        .cursor-dot {
            position: absolute;
            width: 8px;
            height: 8px;
            background: white;
            border-radius: 50%;
            top: -4px;
            left: -4px;
            box-shadow: 0 0 5px rgba(255, 255, 255, 0.8);
        }
        
        .cursor-ring {
            position: absolute;
            width: 24px;
            height: 24px;
            border: 2px solid rgba(77, 156, 255, 0.8);
            border-radius: 50%;
            top: -12px;
            left: -12px;
            box-shadow: 0 0 10px rgba(77, 156, 255, 0.5);
            transition: all 0.15s ease-out;
        }
        
        .cursor-click-effect {
            position: absolute;
            width: 30px;
            height: 30px;
            border-radius: 50%;
            background: radial-gradient(circle, rgba(77, 156, 255, 0.6) 0%, rgba(77, 156, 255, 0) 70%);
            transform: scale(0);
            opacity: 0;
            top: -15px;
            left: -15px;
            pointer-events: none;
        }
        
        @keyframes click-animation {
            0% { transform: scale(0.5); opacity: 1; }
            100% { transform: scale(1.5); opacity: 0; }
        }
        
        @keyframes pulse-element {
            0% { box-shadow: 0 0 0 0 rgba(77, 156, 255, 0.7); }
            70% { box-shadow: 0 0 0 10px rgba(77, 156, 255, 0); }
            100% { box-shadow: 0 0 0 0 rgba(77, 156, 255, 0); }
        }
        
        @keyframes highlight-element {
            0% { background-color: transparent; }
            50% { background-color: rgba(77, 156, 255, 0.2); }
            100% { background-color: transparent; }
        }
        
        @keyframes bounce-element {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-5px); }
        }
        
        .tooltip {
            position: absolute;
            padding: 12px 16px;
            background: rgba(30, 35, 45, 0.95);
            color: white;
            border-radius: 8px;
            font-family: Arial, sans-serif;
            font-size: 14px;
            box-shadow: 0 6px 16px rgba(0, 0, 0, 0.3);
            transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
            z-index: 9999;
            max-width: 300px;
            backdrop-filter: blur(5px);
            border: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        .tooltip:after {
            content: '';
            position: absolute;
            width: 10px;
            height: 10px;
            background: rgba(30, 35, 45, 0.95);
            transform: rotate(45deg);
            z-index: -1;
        }
        
        .tooltip-top:after {
            bottom: -5px;
            left: 50%;
            margin-left: -5px;
        }
        
        .tooltip-bottom:after {
            top: -5px;
            left: 50%;
            margin-left: -5px;
        }
        
        .tooltip-left:after {
            right: -5px;
            top: 50%;
            margin-top: -5px;
        }
        
        .tooltip-right:after {
            left: -5px;
            top: 50%;
            margin-top: -5px;
        }
        
        .btn-next {
            display: inline-block;
            margin-top: 10px;
            padding: 6px 12px;
            background: linear-gradient(to right, #4d9cff, #2c7be5);
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-weight: bold;
            transition: all 0.2s ease;
            outline: none;
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
        }
        
        .btn-next:hover {
            background: linear-gradient(to right, #2c7be5, #1a68d1);
            transform: translateY(-1px);
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
        }
        
        .btn-next:active {
            transform: translateY(1px);
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
        }
    `;
    document.head.appendChild(style);
    
    cursor.style.position = "fixed";
    cursor.style.left = "50%";
    cursor.style.top = "50%";
    cursor.style.zIndex = "9999";
    cursor.style.pointerEvents = "none";
    document.body.appendChild(cursor);
}

function startOnboarding() {
    let stepIndex = 0;

    function nextStep() {
        if (stepIndex >= onboardingSteps.length) {
            console.log("Onboarding completed!");
            
            // Show completion message
            const completionMessage = document.createElement("div");
            completionMessage.className = "tooltip";
            completionMessage.innerHTML = `
                <div style="text-align: center">
                    <div style="font-size: 18px; margin-bottom: 8px;">✨ Onboarding Complete! ✨</div>
                    <div>You're all set to use the admin panel.</div>
                    <button class="btn-next" id="finish-onboarding">Finish</button>
                </div>
            `;
            completionMessage.style.left = "50%";
            completionMessage.style.top = "50%";
            completionMessage.style.transform = "translate(-50%, -50%)";
            document.body.appendChild(completionMessage);
            
            document.getElementById("finish-onboarding").addEventListener("click", () => {
                document.body.removeChild(completionMessage);
                cleanupOnboarding();
            });
            
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
            // Simulate click
            simulateClick();
            
            // Apply specific animation to the element
            if (step.animation) {
                element.style.animation = `${step.animation}-element 1.5s ease infinite`;
            }
            
            // Show tooltip
            showTooltip(element, step.message, () => {
                // Remove animation when moving to next step
                if (step.animation) {
                    element.style.animation = "";
                }
                stepIndex++;
                nextStep();
            });
        });
    }

    nextStep();
}

function moveCursorToElement(targetElement, callback) {
    const rect = targetElement.getBoundingClientRect();
    let currentX = parseInt(cursor.style.left) || window.innerWidth / 2;
    let currentY = parseInt(cursor.style.top) || window.innerHeight / 2;
    const targetX = rect.left + rect.width / 2;
    const targetY = rect.top + rect.height / 2;
    
    // Add subtle mouse movement effect
    const controlPoints = generateControlPoints(currentX, currentY, targetX, targetY);
    animateAlongPath(controlPoints, 0, callback);
}

function generateControlPoints(startX, startY, endX, endY) {
    // Create a slightly curved path for more natural movement
    const distance = Math.sqrt(Math.pow(endX - startX, 2) + Math.pow(endY - startY, 2));
    const midX = (startX + endX) / 2;
    const midY = (startY + endY) / 2;
    
    // Add some randomness to the control point for natural movement
    const controlX = midX + (Math.random() * 2 - 1) * (distance * 0.2);
    const controlY = midY + (Math.random() * 2 - 1) * (distance * 0.2);
    
    // Return points for quadratic bezier curve
    return {
        start: { x: startX, y: startY },
        control: { x: controlX, y: controlY },
        end: { x: endX, y: endY }
    };
}

function animateAlongPath(points, progress, callback) {
    // Bezier curve calculation
    if (progress >= 1) {
        cursor.style.left = `${points.end.x}px`;
        cursor.style.top = `${points.end.y}px`;
        setTimeout(callback, 300);
        return;
    }
    
    // Quadratic bezier formula: B(t) = (1-t)²P₀ + 2(1-t)tP₁ + t²P₂
    const t = progress;
    const invT = 1 - t;
    
    // Calculate position on curve
    const x = invT * invT * points.start.x + 2 * invT * t * points.control.x + t * t * points.end.x;
    const y = invT * invT * points.start.y + 2 * invT * t * points.control.y + t * t * points.end.y;
    
    // Add small random movement for more realism
    const jitterX = Math.random() * 2 - 1;
    const jitterY = Math.random() * 2 - 1;
    
    cursor.style.left = `${x + jitterX}px`;
    cursor.style.top = `${y + jitterY}px`;
    
    // Speed up as we get closer to target, for more natural movement
    const speedFactor = 0.5 + 0.5 * t;
    const nextProgress = progress + 0.02 * speedFactor;
    
    requestAnimationFrame(() => {
        animateAlongPath(points, nextProgress, callback);
    });
}

function simulateClick() {
    // Get the click effect element
    const clickEffect = cursor.querySelector('.cursor-click-effect');
    
    // Animate the cursor slightly on click
    cursor.querySelector('.cursor-ring').style.transform = 'scale(0.8)';
    setTimeout(() => {
        cursor.querySelector('.cursor-ring').style.transform = 'scale(1)';
    }, 150);
    
    // Play the click effect animation
    clickEffect.style.animation = 'click-animation 0.5s forwards';
    setTimeout(() => {
        clickEffect.style.animation = '';
    }, 500);
}

function showTooltip(element, message, onNext) {
    const rect = element.getBoundingClientRect();
    const tooltipWidth = 280;
    
    let tooltip = document.createElement("div");
    tooltip.className = "tooltip";
    
    // Determine best position for tooltip
    let position = 'top';
    if (rect.top < 100) position = 'bottom';
    else if (rect.left < tooltipWidth/2) position = 'right';
    else if (rect.right > window.innerWidth - tooltipWidth/2) position = 'left';
    
    tooltip.classList.add(`tooltip-${position}`);
    
    // Set position based on calculated best position
    switch(position) {
        case 'top':
            tooltip.style.bottom = `${window.innerHeight - rect.top + 15}px`;
            tooltip.style.left = `${rect.left + rect.width/2 - tooltipWidth/2}px`;
            break;
        case 'bottom':
            tooltip.style.top = `${rect.bottom + 15}px`;
            tooltip.style.left = `${rect.left + rect.width/2 - tooltipWidth/2}px`;
            break;
        case 'left':
            tooltip.style.right = `${window.innerWidth - rect.left + 15}px`;
            tooltip.style.top = `${rect.top + rect.height/2 - 40}px`;
            break;
        case 'right':
            tooltip.style.left = `${rect.right + 15}px`;
            tooltip.style.top = `${rect.top + rect.height/2 - 40}px`;
            break;
    }
    
    // Set content with message and next button
    tooltip.innerHTML = `
        <div>${message}</div>
        <button class="btn-next">Continue</button>
    `;
    
    document.body.appendChild(tooltip);
    
    // Add entrance animation
    tooltip.style.opacity = "0";
    tooltip.style.transform = position === 'top' || position === 'bottom' 
        ? `translateY(${position === 'top' ? '10px' : '-10px'})` 
        : `translateX(${position === 'left' ? '10px' : '-10px'})`;
    
    setTimeout(() => {
        tooltip.style.opacity = "1";
        tooltip.style.transform = "translate(0, 0)";
    }, 50);
    
    // Setup next button
    tooltip.querySelector('.btn-next').addEventListener('click', () => {
        // Add exit animation
        tooltip.style.opacity = "0";
        tooltip.style.transform = position === 'top' || position === 'bottom' 
            ? `translateY(${position === 'top' ? '-10px' : '10px'})` 
            : `translateX(${position === 'left' ? '-10px' : '10px'})`;
        
        setTimeout(() => {
            document.body.removeChild(tooltip);
            onNext();
        }, 300);
    });
}

function cleanupOnboarding() {
    document.body.removeChild(cursor);
    console.log("Onboarding resources cleaned up.");
}
