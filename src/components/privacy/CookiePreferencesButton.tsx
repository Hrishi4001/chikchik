'use client';

import { openCookiePreferences } from '@/lib/consent';
import styles from './privacy.module.css';

export default function CookiePreferencesButton() {
  return (
    <button type="button" className={styles.btnPrimary} style={{ flex: 'none' }} onClick={openCookiePreferences}>
      Change cookie preferences
    </button>
  );
}
