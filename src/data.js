// Data constants for the Family Emergency Fund Tracker
export const SIBLINGS = [
  'Mercy', 'Cecile', 'Meann', 'Macky', 'Melany', 'Karen', 'Mich', 'Jesh', 'France'
];

export const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export const AMOUNT_PER_MONTH = 500; // ₱500 per sibling per month
export const DEFAULT_PASSWORD = 'admin123';
export const HEALTH_CARD_COST = 22500; // ₱2,500 × 9 siblings
export const HEALTH_CARD_PER_SIBLING = 2500;

// Storage key prefixes
const DATA_PREFIX = 'family-fund-data-';
const LOG_KEY = 'family-fund-log';
const HEALTH_CARD_PREFIX = 'family-fund-healthcard-';
const OLD_STORAGE_KEY = 'family-fund-tracker-data';

// ============================================================
//  Payment Data — year-keyed
// ============================================================

/**
 * Initialize an empty payment data object.
 * Structure: { "January": { "Mercy": false, "Cecile": false, ... }, ... }
 */
export function createEmptyData() {
  const data = {};
  MONTHS.forEach(month => {
    data[month] = {};
    SIBLINGS.forEach(sibling => {
      data[month][sibling] = false;
    });
  });
  return data;
}

/**
 * Migrate old single-key data to the new year-keyed format.
 * Runs once on first load — moves `family-fund-tracker-data` → `family-fund-data-2025`.
 */
export function migrateOldData() {
  try {
    const raw = localStorage.getItem(OLD_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      // Save under 2025 (the original year the app was used)
      const migrated = createEmptyData();
      MONTHS.forEach(month => {
        SIBLINGS.forEach(sibling => {
          if (parsed[month] && typeof parsed[month][sibling] === 'boolean') {
            migrated[month][sibling] = parsed[month][sibling];
          }
        });
      });
      localStorage.setItem(`${DATA_PREFIX}2025`, JSON.stringify(migrated));
      localStorage.removeItem(OLD_STORAGE_KEY);
      console.log('Migrated old data to family-fund-data-2025');
    }
  } catch (e) {
    console.error('Migration error:', e);
  }
}

/**
 * Load payment data for a specific year from localStorage.
 */
export function loadData(year) {
  try {
    const raw = localStorage.getItem(`${DATA_PREFIX}${year}`);
    if (raw) {
      const parsed = JSON.parse(raw);
      const empty = createEmptyData();
      MONTHS.forEach(month => {
        SIBLINGS.forEach(sibling => {
          if (parsed[month] && typeof parsed[month][sibling] === 'boolean') {
            empty[month][sibling] = parsed[month][sibling];
          }
        });
      });
      return empty;
    }
  } catch (e) {
    console.error('Error loading data:', e);
  }
  return createEmptyData();
}

/**
 * Save payment data for a specific year to localStorage.
 */
export function saveData(year, data) {
  try {
    localStorage.setItem(`${DATA_PREFIX}${year}`, JSON.stringify(data));
  } catch (e) {
    console.error('Error saving data:', e);
  }
}

/**
 * Get all years that have stored payment data, sorted ascending.
 */
export function getStoredYears() {
  const years = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith(DATA_PREFIX)) {
      const year = parseInt(key.replace(DATA_PREFIX, ''), 10);
      if (!isNaN(year)) years.push(year);
    }
  }
  return years.sort((a, b) => a - b);
}

// ============================================================
//  Stats calculation
// ============================================================

/**
 * Format a number as Philippine Peso.
 */
export function formatPeso(amount) {
  return `₱${amount.toLocaleString()}`;
}

/**
 * Calculate summary statistics from payment data for a single year.
 */
export function calculateStats(data) {
  let totalPaid = 0;
  let totalUnpaid = 0;
  const totalExpected = SIBLINGS.length * MONTHS.length * AMOUNT_PER_MONTH;

  MONTHS.forEach(month => {
    SIBLINGS.forEach(sibling => {
      if (data[month][sibling]) {
        totalPaid++;
      } else {
        totalUnpaid++;
      }
    });
  });

  const totalCollected = totalPaid * AMOUNT_PER_MONTH;
  const balance = totalExpected - totalCollected;

  return { totalCollected, totalExpected, balance, unpaidCount: totalUnpaid };
}

/**
 * Calculate aggregated stats across ALL stored years.
 */
export function calculateAllYearsStats() {
  const years = getStoredYears();
  let totalCollected = 0;
  let totalExpected = 0;
  let unpaidCount = 0;

  years.forEach(year => {
    const data = loadData(year);
    const stats = calculateStats(data);
    totalCollected += stats.totalCollected;
    totalExpected += stats.totalExpected;
    unpaidCount += stats.unpaidCount;
  });

  // If no years exist yet, show a single year's expected
  if (years.length === 0) {
    totalExpected = SIBLINGS.length * MONTHS.length * AMOUNT_PER_MONTH;
    unpaidCount = SIBLINGS.length * MONTHS.length;
  }

  const balance = totalExpected - totalCollected;
  return { totalCollected, totalExpected, balance, unpaidCount };
}

/**
 * Calculate total contributions collected across ALL years (for fund balance).
 */
export function calculateAllTimeContributions() {
  const years = getStoredYears();
  let total = 0;
  years.forEach(year => {
    const data = loadData(year);
    MONTHS.forEach(month => {
      SIBLINGS.forEach(sibling => {
        if (data[month][sibling]) {
          total += AMOUNT_PER_MONTH;
        }
      });
    });
  });
  return total;
}

/**
 * Calculate contributions collected up to and including a specific month in a year.
 * Used for health card logic (Jan–June pool balance).
 */
export function calculatePoolBalanceUpToMonth(data, monthIndex) {
  let total = 0;
  for (let i = 0; i <= monthIndex && i < MONTHS.length; i++) {
    SIBLINGS.forEach(sibling => {
      if (data[MONTHS[i]][sibling]) {
        total += AMOUNT_PER_MONTH;
      }
    });
  }
  return total;
}

// ============================================================
//  Fund Usage Log
// ============================================================

/**
 * Load fund usage log entries from localStorage.
 * Returns an array of entry objects.
 */
export function loadFundLog() {
  try {
    const raw = localStorage.getItem(LOG_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Error loading fund log:', e);
  }
  return [];
}

/**
 * Save fund usage log entries to localStorage.
 */
export function saveFundLog(entries) {
  try {
    localStorage.setItem(LOG_KEY, JSON.stringify(entries));
  } catch (e) {
    console.error('Error saving fund log:', e);
  }
}

/**
 * Calculate total fund usage (sum of all log entry amounts).
 */
export function calculateTotalUsage() {
  const entries = loadFundLog();
  return entries.reduce((sum, entry) => sum + (parseFloat(entry.amount) || 0), 0);
}

/**
 * Calculate the running fund balance.
 * Formula: all-time contributions - all fund log usage entries
 */
export function calculateFundBalance() {
  const totalContributed = calculateAllTimeContributions();
  const totalUsed = calculateTotalUsage();
  return { totalContributed, totalUsed, currentBalance: totalContributed - totalUsed };
}

// ============================================================
//  Health Card Status
// ============================================================

/**
 * Load health card payment status for a specific year.
 * Returns { paid: boolean, date: string|null }
 */
export function loadHealthCardStatus(year) {
  try {
    const raw = localStorage.getItem(`${HEALTH_CARD_PREFIX}${year}`);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Error loading health card status:', e);
  }
  return { paid: false, date: null };
}

/**
 * Save health card payment status for a specific year.
 */
export function saveHealthCardStatus(year, status) {
  try {
    localStorage.setItem(`${HEALTH_CARD_PREFIX}${year}`, JSON.stringify(status));
  } catch (e) {
    console.error('Error saving health card status:', e);
  }
}
