import { StudentSubmission, INITIAL_MOCK_SUBMISSIONS } from '../data/examData';

const SUBMISSIONS_KEY = 'tin_hoc_12_ktgk1_submissions_v1';

/**
 * Synchronous read from localStorage (used for instant render before server response)
 */
export function getStoredSubmissions(): StudentSubmission[] {
  try {
    const raw = localStorage.getItem(SUBMISSIONS_KEY);
    if (!raw) {
      return INITIAL_MOCK_SUBMISSIONS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : INITIAL_MOCK_SUBMISSIONS;
  } catch (e) {
    console.error('Error loading submissions from localStorage:', e);
    return INITIAL_MOCK_SUBMISSIONS;
  }
}

/**
 * Fetch all submissions from centralized server storage (/api/submissions).
 * This ensures submissions from all students, across all devices and times, are gathered.
 */
export async function fetchStoredSubmissions(): Promise<StudentSubmission[]> {
  try {
    const res = await fetch('/api/submissions');
    if (res.ok) {
      const json = await res.json();
      if (json && Array.isArray(json.data)) {
        // Cache to local storage as fallback
        try {
          localStorage.setItem(SUBMISSIONS_KEY, JSON.stringify(json.data));
        } catch {
          // ignore quota error
        }
        return json.data;
      }
    }
  } catch (err) {
    console.warn('Could not fetch submissions from server, falling back to local cache:', err);
  }

  // Fallback to local storage if server fetch fails
  return getStoredSubmissions();
}

/**
 * Save or update student submission to centralized server and local cache.
 */
export async function saveSubmission(sub: StudentSubmission): Promise<void> {
  // 1. Immediately update local cache for smooth UX
  try {
    const list = getStoredSubmissions();
    const updated = [sub, ...list.filter(item => item.id !== sub.id)];
    localStorage.setItem(SUBMISSIONS_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error('Error saving submission locally:', e);
  }

  // 2. Persist to server backend
  try {
    const res = await fetch('/api/submissions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(sub),
    });
    if (!res.ok) {
      console.error('Server failed to persist submission:', await res.text());
    }
  } catch (err) {
    console.error('Network error persisting submission to server:', err);
  }
}

/**
 * Delete all submissions (Admin action)
 */
export async function clearAllSubmissions(): Promise<void> {
  try {
    localStorage.setItem(SUBMISSIONS_KEY, JSON.stringify([]));
  } catch (e) {
    console.error('Error clearing local submissions:', e);
  }

  try {
    await fetch('/api/submissions', {
      method: 'DELETE',
    });
  } catch (err) {
    console.error('Error clearing submissions on server:', err);
  }
}

/**
 * Reset submissions to initial sample data
 */
export async function resetMockSubmissions(): Promise<StudentSubmission[]> {
  try {
    localStorage.setItem(SUBMISSIONS_KEY, JSON.stringify(INITIAL_MOCK_SUBMISSIONS));
  } catch (e) {
    console.error('Error resetting local submissions:', e);
  }

  try {
    const res = await fetch('/api/submissions/reset', {
      method: 'POST',
    });
    if (res.ok) {
      const json = await res.json();
      if (json && Array.isArray(json.data)) {
        return json.data;
      }
    }
  } catch (err) {
    console.error('Error resetting mock submissions on server:', err);
  }

  return INITIAL_MOCK_SUBMISSIONS;
}
