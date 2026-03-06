/**
 * ================================================
 * SCHOLAR STYLES GENERATOR
 * ================================================
 * 
 * Generates different response styles based on Islamic scholar tradition
 * Used to provide answers from different madhabs and scholarly perspectives
 * 
 * Supported scholars:
 * - hanafi: Hanafi school of Islamic jurisprudence
 * - shafii: Shafi'i school of Islamic jurisprudence
 * - diyanet: Turkish Directorate of Religious Affairs perspective
 * - taberi: Classical Tafsir approach (Al-Taberi)
 * - ibn_kathir: Classical Tafsir approach (Ibn Kathir)
 * - academic: Modern academic Islamic studies perspective
 */

const scholarStyles = {
  hanafi: {
    name: 'Hanafi School',
    description: 'Hanafi school of Islamic jurisprudence - emphasizes analogy and scholarly reasoning',
    prefix: 'According to the Hanafi school of Islamic jurisprudence',
    methodology: 'logical_reasoning',
    characteristics: [
      'Emphasizes analogy (qiyas) in Islamic law',
      'Uses scholarly reasoning and opinion',
      'Considers practical implementation',
      'Flexible in application of principles'
    ]
  },

  shafii: {
    name: 'Shafi\'i School',
    description: 'Shafi\'i school of Islamic jurisprudence - balances hadith and qiyas',
    prefix: 'According to the Shafi\'i school of Islamic jurisprudence',
    methodology: 'hadith_focused',
    characteristics: [
      'Emphasizes hadith evidence',
      'Balanced approach between Quran and Sunnah',
      'Careful in accepting weak hadith',
      'Systematic methodological approach'
    ]
  },

  diyanet: {
    name: 'Turkish Islamic Authority (Diyanet)',
    description: 'Contemporary Islamic perspective from Turkish Directorate of Religious Affairs',
    prefix: 'From the perspective of the Turkish Directorate of Religious Affairs (Diyanet)',
    methodology: 'contemporary_islamic',
    characteristics: [
      'Modern Islamic interpretation',
      'Considers contemporary challenges',
      'Balanced traditional and modern approach',
      'Practical for modern times'
    ]
  },

  taberi: {
    name: 'Al-Taberi (Classical Tafsir)',
    description: 'Classical Quranic interpretation approach by Al-Taberi',
    prefix: 'According to the classical Tafsir tradition of Al-Taberi',
    methodology: 'quranic_tafsir',
    characteristics: [
      'Detailed Quranic interpretation',
      'Focuses on classical Arabic linguistics',
      'Analyzes verse context and revelation circumstances',
      'References classical Islamic sources'
    ]
  },

  ibn_kathir: {
    name: 'Ibn Kathir (Classical Tafsir)',
    description: 'Classical Quranic interpretation approach by Ibn Kathir',
    prefix: 'According to the classical Tafsir tradition of Ibn Kathir',
    methodology: 'quranic_tafsir',
    characteristics: [
      'Hadith-based Quranic interpretation',
      'Analyzes linguistic meaning of verses',
      'References classical Islamic sources',
      'Emphasizes Prophetic Sunnah'
    ]
  },

  academic: {
    name: 'Academic Islamic Studies',
    description: 'Modern academic approach to Islamic studies',
    prefix: 'From an academic Islamic studies perspective',
    methodology: 'academic_research',
    characteristics: [
      'Scholarly research-based approach',
      'Considers historical context',
      'Analyzes multiple perspectives',
      'Evidence-based reasoning'
    ]
  }
};

/**
 * Get scholar style configuration
 * @param {string} scholarName - Name of scholar/style
 * @returns {object} Scholar style configuration
 */
const getScholarStyle = (scholarName) => {
  const normalized = scholarName?.toLowerCase().trim();
  
  if (!scholarStyles[normalized]) {
    // Default to academic if scholar not found
    console.warn(`Scholar "${scholarName}" not found. Using academic approach.`);
    return scholarStyles.academic;
  }

  return scholarStyles[normalized];
};

/**
 * Generate a prompt prefix based on scholar style
 * Use this to prepend to your AI model prompts
 * @param {string} scholar - Scholar name
 * @param {string} question - User question
 * @returns {string} Formatted prompt for AI model
 */
const generateScholarPrompt = (scholar, question) => {
  const style = getScholarStyle(scholar);

  const characteristics = style.characteristics
    .map(char => `• ${char}`)
    .join('\n');

  return `
You are answering as an Islamic scholar following the ${style.name}.

Question: "${question}"

Please answer this question in the following style:
${characteristics}

Your approach: ${style.prefix}

Provide a comprehensive, respectful, and knowledgeable response based on Islamic principles and this scholarly tradition.
  `.trim();
};

/**
 * Get list of all available scholars
 * @returns {array} List of scholar names
 */
const getAvailableScholars = () => {
  return Object.keys(scholarStyles).map(key => ({
    id: key,
    name: scholarStyles[key].name,
    description: scholarStyles[key].description
  }));
};

/**
 * Format response with scholar attribution
 * @param {string} scholar - Scholar name
 * @param {string} answer - The answer text
 * @returns {object} Formatted response with metadata
 */
const formatScholarResponse = (scholar, answer) => {
  const style = getScholarStyle(scholar);

  return {
    scholar: scholar.toLowerCase(),
    scholarName: style.name,
    answer,
    methodology: style.methodology,
    timestamp: new Date().toISOString()
  };
};

module.exports = {
  scholarStyles,
  getScholarStyle,
  generateScholarPrompt,
  getAvailableScholars,
  formatScholarResponse
};
