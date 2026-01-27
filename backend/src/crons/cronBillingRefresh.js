import { getDatabase } from '../db.js';

export async function runBillingCron(env) {
  console.log(`[${new Date().toISOString()}] Billing cron started`);
  const db = getDatabase(env);

  try {
    // 🔒 On fige UNIQUEMENT le mois précédent
    const { error } = await db.rpc('freeze_last_billing_month');

    if (error) throw error;

    console.log(`[${new Date().toISOString()}] Billing cron finished`);
  } catch (err) {
    console.error('Billing cron error:', err);
  }
}
