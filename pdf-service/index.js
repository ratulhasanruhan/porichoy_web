const express = require('express');
const puppeteer = require('puppeteer');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Authentication middleware
const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token || token !== process.env.API_KEY) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  
  next();
};

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'Porichoy PDF Service' });
});

// PDF generation endpoint
app.post('/generate', authenticate, async (req, res) => {
  try {
    const { profileData, user } = req.body;
    
    if (!profileData || !user) {
      return res.status(400).json({ error: 'Missing required data' });
    }

    // Generate HTML content
    const html = generateResumeHTML(profileData, user);
    
    // Launch browser
    const browser = await puppeteer.launch({
      headless: 'new',
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu',
      ],
    });

    const page = await browser.newPage();
    
    // Set content with Bangla font support
    await page.setContent(html, { 
      waitUntil: 'networkidle0',
      timeout: 30000 
    });

    // Generate PDF
    const pdf = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: {
        top: '20mm',
        right: '15mm',
        bottom: '20mm',
        left: '15mm',
      },
    });

    await browser.close();

    // Send PDF
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="resume-${user.username}.pdf"`);
    res.send(pdf);

  } catch (error) {
    console.error('PDF generation error:', error);
    res.status(500).json({ error: 'Failed to generate PDF', message: error.message });
  }
});

// HTML template generator
function generateResumeHTML(data, user) {
  const isBangla = user.locale === 'bn';
  
  return `
<!DOCTYPE html>
<html lang="${isBangla ? 'bn' : 'en'}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${user.name} - Resume</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+Bengali:wght@400;500;600;700&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: ${isBangla ? "'Noto Sans Bengali', sans-serif" : "'Inter', sans-serif"};
      font-size: 11pt;
      line-height: 1.6;
      color: #333;
    }
    
    .container {
      max-width: 800px;
      margin: 0 auto;
      padding: 20px;
    }
    
    .header {
      text-align: center;
      margin-bottom: 30px;
      padding-bottom: 20px;
      border-bottom: 3px solid #2563eb;
    }
    
    .header h1 {
      font-size: 28pt;
      font-weight: 700;
      color: #1e40af;
      margin-bottom: 8px;
    }
    
    .header .title {
      font-size: 14pt;
      color: #2563eb;
      font-weight: 500;
      margin-bottom: 12px;
    }
    
    .contact-info {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      gap: 15px;
      font-size: 9pt;
      color: #666;
    }
    
    .contact-info span {
      display: flex;
      align-items: center;
      gap: 4px;
    }
    
    .section {
      margin-bottom: 25px;
    }
    
    .section-title {
      font-size: 14pt;
      font-weight: 700;
      color: #1e40af;
      margin-bottom: 12px;
      padding-bottom: 6px;
      border-bottom: 2px solid #dbeafe;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    
    .item {
      margin-bottom: 15px;
      padding-left: 10px;
      border-left: 3px solid #dbeafe;
    }
    
    .item-header {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      margin-bottom: 4px;
    }
    
    .item-title {
      font-weight: 600;
      font-size: 12pt;
      color: #1e3a8a;
    }
    
    .item-subtitle {
      color: #2563eb;
      font-weight: 500;
      font-size: 10pt;
    }
    
    .item-date {
      font-size: 9pt;
      color: #64748b;
      font-style: italic;
    }
    
    .item-description {
      color: #475569;
      font-size: 10pt;
      margin-top: 6px;
    }
    
    .skills-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 8px;
      margin-top: 10px;
    }
    
    .skill-item {
      background: #eff6ff;
      padding: 6px 12px;
      border-radius: 6px;
      font-size: 9pt;
      color: #1e40af;
      border: 1px solid #bfdbfe;
    }
    
    .languages-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 10px;
      margin-top: 10px;
    }
    
    .language-item {
      display: flex;
      justify-content: space-between;
      padding: 8px;
      background: #f8fafc;
      border-radius: 4px;
      border: 1px solid #e2e8f0;
    }
    
    .language-name {
      font-weight: 500;
    }
    
    .language-level {
      color: #64748b;
      font-size: 9pt;
      text-transform: capitalize;
    }
    
    @page {
      margin: 15mm;
    }
  </style>
</head>
<body>
  <div class="container">
    <!-- Header -->
    <div class="header">
      <h1>${escapeHtml(isBangla && data.personalInfo.fullNameBn ? data.personalInfo.fullNameBn : data.personalInfo.fullName || user.name)}</h1>
      ${data.personalInfo.profession || data.personalInfo.professionBn ? `
        <div class="title">${escapeHtml(isBangla && data.personalInfo.professionBn ? data.personalInfo.professionBn : data.personalInfo.profession)}</div>
      ` : ''}
      <div class="contact-info">
        ${data.contact.email ? `<span>✉ ${escapeHtml(data.contact.email)}</span>` : ''}
        ${data.contact.phone ? `<span>☎ ${escapeHtml(data.contact.phone)}</span>` : ''}
        ${data.personalInfo.location ? `<span>📍 ${escapeHtml(data.personalInfo.location)}</span>` : ''}
        ${data.contact.linkedin ? `<span>🔗 LinkedIn</span>` : ''}
        ${data.contact.github ? `<span>🐙 GitHub</span>` : ''}
      </div>
    </div>

    <!-- Experience Section -->
    ${data.experience && data.experience.length > 0 ? `
      <div class="section">
        <h2 class="section-title">${isBangla ? 'কাজের অভিজ্ঞতা' : 'Work Experience'}</h2>
        ${data.experience.map(exp => `
          <div class="item">
            <div class="item-header">
              <div>
                <div class="item-title">${escapeHtml(isBangla && exp.positionBn ? exp.positionBn : exp.position)}</div>
                <div class="item-subtitle">${escapeHtml(isBangla && exp.companyBn ? exp.companyBn : exp.company)}</div>
              </div>
              <div class="item-date">
                ${formatDateRange(exp.startDate, exp.endDate, exp.current, isBangla)}
              </div>
            </div>
            ${exp.description ? `
              <div class="item-description">${escapeHtml(isBangla && exp.descriptionBn ? exp.descriptionBn : exp.description)}</div>
            ` : ''}
          </div>
        `).join('')}
      </div>
    ` : ''}

    <!-- Education Section -->
    ${data.education && data.education.length > 0 ? `
      <div class="section">
        <h2 class="section-title">${isBangla ? 'শিক্ষাগত যোগ্যতা' : 'Education'}</h2>
        ${data.education.map(edu => `
          <div class="item">
            <div class="item-header">
              <div>
                <div class="item-title">${escapeHtml(isBangla && edu.degreeBn ? edu.degreeBn : edu.degree)}</div>
                <div class="item-subtitle">${escapeHtml(isBangla && edu.institutionBn ? edu.institutionBn : edu.institution)}</div>
              </div>
              <div class="item-date">
                ${formatDateRange(edu.startDate, edu.endDate, false, isBangla)}
              </div>
            </div>
            ${edu.gpa ? `<div class="item-description">GPA: ${escapeHtml(edu.gpa)}</div>` : ''}
          </div>
        `).join('')}
      </div>
    ` : ''}

    <!-- Skills Section -->
    ${data.skills && data.skills.length > 0 ? `
      <div class="section">
        <h2 class="section-title">${isBangla ? 'দক্ষতা' : 'Skills'}</h2>
        <div class="skills-grid">
          ${data.skills.map(skill => `
            <div class="skill-item">
              ${escapeHtml(isBangla && skill.nameBn ? skill.nameBn : skill.name)}
            </div>
          `).join('')}
        </div>
      </div>
    ` : ''}

    <!-- Projects Section -->
    ${data.projects && data.projects.length > 0 ? `
      <div class="section">
        <h2 class="section-title">${isBangla ? 'প্রজেক্ট' : 'Projects'}</h2>
        ${data.projects.map(project => `
          <div class="item">
            <div class="item-title">${escapeHtml(isBangla && project.nameBn ? project.nameBn : project.name)}</div>
            ${project.description ? `
              <div class="item-description">${escapeHtml(isBangla && project.descriptionBn ? project.descriptionBn : project.description)}</div>
            ` : ''}
            ${project.technologies && project.technologies.length > 0 ? `
              <div class="item-description" style="margin-top: 4px;">
                <strong>Technologies:</strong> ${project.technologies.join(', ')}
              </div>
            ` : ''}
          </div>
        `).join('')}
      </div>
    ` : ''}

    <!-- Languages Section -->
    ${data.languages && data.languages.length > 0 ? `
      <div class="section">
        <h2 class="section-title">${isBangla ? 'ভাষা' : 'Languages'}</h2>
        <div class="languages-grid">
          ${data.languages.map(lang => `
            <div class="language-item">
              <span class="language-name">${escapeHtml(isBangla && lang.nameBn ? lang.nameBn : lang.name)}</span>
              <span class="language-level">${lang.proficiency}</span>
            </div>
          `).join('')}
        </div>
      </div>
    ` : ''}
  </div>
</body>
</html>
  `;
}

// Helper functions
function escapeHtml(text) {
  if (!text) return '';
  return text
    .toString()
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function formatDateRange(startDate, endDate, current, isBangla) {
  const start = new Date(startDate).toLocaleDateString(isBangla ? 'bn-BD' : 'en-US', {
    year: 'numeric',
    month: 'short',
  });
  
  if (current) {
    return `${start} - ${isBangla ? 'বর্তমান' : 'Present'}`;
  }
  
  if (!endDate) {
    return start;
  }
  
  const end = new Date(endDate).toLocaleDateString(isBangla ? 'bn-BD' : 'en-US', {
    year: 'numeric',
    month: 'short',
  });
  
  return `${start} - ${end}`;
}

// Start server
app.listen(PORT, () => {
  console.log(`PDF Service running on port ${PORT}`);
});

