// Application data
const stepsData = [
  {
    id: "account",
    title: "GitHub Account erstellen",
    description: "Registrieren Sie sich kostenlos auf GitHub.com",
    details: [
      "Besuchen Sie github.com",
      "Klicken Sie auf 'Sign up'",
      "Wählen Sie einen Benutzernamen (wird Teil Ihrer URL)",
      "Geben Sie Ihre E-Mail-Adresse ein",
      "Wählen Sie ein sicheres Passwort"
    ]
  },
  {
    id: "repository",
    title: "Repository anlegen",
    description: "Erstellen Sie einen Ordner für Ihre Webseiten",
    details: [
      "Klicken Sie auf das + Symbol oben rechts",
      "Wählen Sie 'New repository'",
      "Benennen Sie es korrekt (siehe Repository-Generator)",
      "Wählen Sie 'Public'",
      "Aktivieren Sie 'Add a README file'",
      "Klicken Sie auf 'Create repository'"
    ]
  },
  {
    id: "upload",
    title: "HTML-Dateien hochladen",
    description: "Laden Sie Ihre theologischen HTML-Dateien hoch",
    details: [
      "Klicken Sie auf 'Add file' → 'Upload files'",
      "Ziehen Sie Ihre HTML-Dateien in den Upload-Bereich",
      "Stellen Sie sicher, dass eine index.html vorhanden ist",
      "Klicken Sie auf 'Commit changes'"
    ]
  },
  {
    id: "activate",
    title: "GitHub Pages aktivieren",
    description: "Schalten Sie das Hosting ein",
    details: [
      "Gehen Sie zu Settings",
      "Klicken Sie auf 'Pages' in der Seitenleiste",
      "Unter 'Source' wählen Sie 'Deploy from a branch'",
      "Wählen Sie 'main' branch",
      "Klicken Sie auf 'Save'"
    ]
  },
  {
    id: "test",
    title: "Website testen",
    description: "Überprüfen Sie, ob alles funktioniert",
    details: [
      "Warten Sie 2-10 Minuten",
      "Besuchen Sie Ihre URL",
      "Testen Sie alle Links",
      "Leeren Sie ggf. den Browser-Cache (Strg+F5)"
    ]
  }
];

const faqData = [
  {
    question: "Meine Website erscheint nicht",
    answer: "Warten Sie bis zu 10 Minuten nach der Aktivierung. Prüfen Sie, ob GitHub Pages in den Settings aktiviert ist und ob eine index.html vorhanden ist."
  },
  {
    question: "CSS wird nicht geladen",
    answer: "Überprüfen Sie die Pfade in Ihren HTML-Dateien. Verwenden Sie relative Pfade wie './css/style.css' statt absolute Pfade."
  },
  {
    question: "Kann ich die Dateien später ändern?",
    answer: "Ja! Klicken Sie einfach auf eine Datei im Repository und dann auf das Stift-Symbol zum Bearbeiten."
  },
  {
    question: "Wie viele Seiten kann ich hosten?",
    answer: "Sie können unbegrenzt viele HTML-Dateien in einem Repository hosten. Jede Datei ist über ihre eigene URL erreichbar."
  }
];

const exampleFiles = [
  "index.html",
  "offenbarung-20-erklaerung.html",
  "truebsalszeit-erklaerung.html",
  "daniel-7-interpretation.html",
  "endzeit-vergleich.html"
];

// State
let completedSteps = new Set();
let currentUsername = '';
let currentSiteType = 'user';
let currentProjectName = '';

// DOM elements
const usernameInput = document.getElementById('username');
const siteTypeInputs = document.querySelectorAll('input[name="siteType"]');
const projectNameGroup = document.getElementById('project-name-group');
const projectNameInput = document.getElementById('projectName');
const urlPreview = document.getElementById('urlPreview');
const exampleList = document.getElementById('exampleList');
const checklist = document.getElementById('checklist');
const progressFill = document.querySelector('.progress-fill');
const progressText = document.getElementById('progressText');
const repoLink = document.getElementById('repoLink');
const faqSection = document.getElementById('faq');

// Initialize application
function init() {
  setupEventListeners();
  renderChecklist();
  renderFAQ();
  updatePreview();
  updateProgress();
}

// Event listeners
function setupEventListeners() {
  usernameInput.addEventListener('input', handleUsernameChange);
  siteTypeInputs.forEach(input => {
    input.addEventListener('change', handleSiteTypeChange);
  });
  projectNameInput.addEventListener('input', handleProjectNameChange);
  
  // Add click handler for repository link to ensure it works
  repoLink.addEventListener('click', function(e) {
    if (this.getAttribute('aria-disabled') === 'true') {
      e.preventDefault();
      return false;
    }
  });
}

function handleUsernameChange(e) {
  currentUsername = e.target.value.trim();
  updatePreview();
  updateRepoLink();
}

function handleSiteTypeChange(e) {
  currentSiteType = e.target.value;
  
  if (currentSiteType === 'project') {
    projectNameGroup.classList.remove('hidden');
  } else {
    projectNameGroup.classList.add('hidden');
    currentProjectName = '';
    projectNameInput.value = '';
  }
  
  updatePreview();
  updateRepoLink();
}

function handleProjectNameChange(e) {
  currentProjectName = e.target.value.trim();
  updatePreview();
  updateRepoLink();
}

// Update URL preview
function updatePreview() {
  if (!currentUsername) {
    urlPreview.textContent = 'Geben Sie zuerst Ihren GitHub-Benutzernamen ein';
    exampleList.innerHTML = '';
    return;
  }
  
  let baseUrl;
  
  if (currentSiteType === 'user') {
    baseUrl = `https://${currentUsername}.github.io/`;
  } else {
    const projectName = currentProjectName || 'mein-projekt';
    baseUrl = `https://${currentUsername}.github.io/${projectName}/`;
  }
  
  urlPreview.textContent = baseUrl;
  
  // Update example files
  exampleList.innerHTML = exampleFiles.map(file => 
    `<li><a href="${baseUrl}${file}" target="_blank">${baseUrl}${file}</a></li>`
  ).join('');
}

// Update repository link
function updateRepoLink() {
  if (!currentUsername) {
    repoLink.href = '#';
    repoLink.setAttribute('aria-disabled', 'true');
    repoLink.textContent = 'Ihr Repository';
    repoLink.style.pointerEvents = 'none';
    return;
  }
  
  let repoName;
  if (currentSiteType === 'user') {
    repoName = `${currentUsername}.github.io`;
  } else {
    repoName = currentProjectName || 'mein-projekt';
  }
  
  repoLink.href = `https://github.com/${currentUsername}/${repoName}`;
  repoLink.removeAttribute('aria-disabled');
  repoLink.textContent = `${currentUsername}/${repoName}`;
  repoLink.style.pointerEvents = 'auto';
}

// Render checklist
function renderChecklist() {
  checklist.innerHTML = stepsData.map(step => `
    <div class="checklist-item" data-step="${step.id}">
      <div class="checklist-header" onclick="toggleChecklistItem('${step.id}')">
        <input type="checkbox" class="checklist-checkbox" onchange="toggleStepCompletion('${step.id}')" />
        <div class="flex-1">
          <div class="checklist-title">${step.title}</div>
          <div class="checklist-description">${step.description}</div>
        </div>
        <span class="checklist-expand">▼</span>
      </div>
      <div class="checklist-details">
        <ol>
          ${step.details.map(detail => `<li>${detail}</li>`).join('')}
        </ol>
      </div>
    </div>
  `).join('');
}

// Toggle checklist item expansion
function toggleChecklistItem(stepId) {
  const item = document.querySelector(`[data-step="${stepId}"]`);
  item.classList.toggle('expanded');
}

// Toggle step completion
function toggleStepCompletion(stepId) {
  const item = document.querySelector(`[data-step="${stepId}"]`);
  const checkbox = item.querySelector('.checklist-checkbox');
  
  if (checkbox.checked) {
    completedSteps.add(stepId);
    item.classList.add('completed');
  } else {
    completedSteps.delete(stepId);
    item.classList.remove('completed');
  }
  
  updateProgress();
}

// Update progress bar
function updateProgress() {
  const totalSteps = stepsData.length;
  const completedCount = completedSteps.size;
  const percentage = (completedCount / totalSteps) * 100;
  
  progressFill.style.width = `${percentage}%`;
  progressText.textContent = `${completedCount} / ${totalSteps} abgeschlossen`;
}

// Render FAQ
function renderFAQ() {
  faqSection.innerHTML = faqData.map((faq, index) => `
    <div class="faq-item" data-faq="${index}">
      <div class="faq-question" onclick="toggleFAQItem(${index})">
        ${faq.question}
      </div>
      <div class="faq-answer">
        ${faq.answer}
      </div>
    </div>
  `).join('');
}

// Toggle FAQ item
function toggleFAQItem(index) {
  const item = document.querySelector(`[data-faq="${index}"]`);
  item.classList.toggle('open');
}

// Make functions available globally
window.toggleChecklistItem = toggleChecklistItem;
window.toggleStepCompletion = toggleStepCompletion;
window.toggleFAQItem = toggleFAQItem;

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', init);