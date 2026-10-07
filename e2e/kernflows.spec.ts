import { test, expect, Browser, BrowserContext, Page } from '@playwright/test';
import { deleteAccount, smokePassword } from './helpers/api';

// Smoketests voor de zes kernflows. De tests bouwen op elkaar (de wens die in
// test 3 wordt aangemaakt, wordt in test 4 gereserveerd), dus ze draaien serieel
// en delen de gebruikers hieronder. Na afloop verwijdert afterAll de gebruikers en hun
// wensen weer via de API. Blijft er toch iets staan (run afgebroken): npm run e2e:cleanup.

interface Account { firstName: string; lastName: string; email: string; password: string; id?: string; }

const runId = Date.now().toString(36);
const password = smokePassword;
const owner: Account = { firstName: 'Smoke', lastName: 'Eigenaar', email: `smoke+owner-${runId}@gimmi.be`, password };
const giver: Account = { firstName: 'Smoke', lastName: 'Gever', email: `smoke+giver-${runId}@gimmi.be`, password };
const wishTitle = `Smoke wens ${runId}`;

// De placeholder staat ook op het host-element van gimmi-password-input; kies dus de <input>.
function input(page: Page, placeholder: string) {
  return page.locator(`input[placeholder="${placeholder}"]`);
}

function wishCard(page: Page, title: string) {
  return page.locator('gimmi-wish-card').filter({ hasText: title });
}

async function newUserPage(browser: Browser): Promise<{ context: BrowserContext; page: Page }> {
  const context = await browser.newContext();
  // De iubenda-cookiebanner ligt over de pagina en onderschept klikken; hij hoort niet bij deze flows.
  await context.route(/iubenda\.com/, route => route.abort());
  return { context, page: await context.newPage() };
}

async function register(page: Page, account: Account): Promise<void> {
  await page.goto('/users/register');
  await page.locator('input[formcontrolname="firstName"]').fill(account.firstName);
  await page.locator('input[formcontrolname="lastName"]').fill(account.lastName);
  await page.locator('input[formcontrolname="birthday"]').fill('1990-05-17');
  await input(page, 'Email (login)').fill(account.email);
  await input(page, 'Wachtwoord').fill(account.password);
  await input(page, 'Geef wachtwoord nogmaals in').fill(account.password);
  await page.getByRole('button', { name: 'Registreer' }).click();
  await expect(page).toHaveURL(/\/people\/[0-9a-f]{24}$/);
  account.id = page.url().split('/').pop();
}

async function login(page: Page, account: Account): Promise<void> {
  await page.goto('/users/login');
  await input(page, 'Email (login)').fill(account.email);
  await input(page, 'Wachtwoord').fill(account.password);
  // De loginknop wordt pas actief als het formulier "touched" is.
  await input(page, 'Wachtwoord').blur();
  await page.getByRole('button', { name: 'Login', exact: true }).click();
  await expect(page).toHaveURL(`/people/${account.id}`);
}

test.describe.configure({ mode: 'serial' });

test.describe('kernflows', () => {
  test.afterAll(async () => {
    // Ook opruimen als een test halverwege faalde. Wie nooit geregistreerd werd (geen id), slaan we over.
    const fouten: string[] = [];
    for (const account of [giver, owner]) {
      if (!account.id) continue;
      try {
        await deleteAccount(account.id, account.email, account.password);
      } catch (err) {
        fouten.push(`${account.email}: ${(err as Error).message}`);
      }
    }
    if (fouten.length) throw new Error(['Opruimen mislukt, draai npm run e2e:cleanup:', ...fouten].join('\n'));
  });

  test('1. registreren', async ({ browser }) => {
    const { context, page } = await newUserPage(browser);
    await register(page, owner);
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(`${owner.firstName} ${owner.lastName}`);
    await context.close();
  });

  test('2. inloggen', async ({ browser }) => {
    const { context, page } = await newUserPage(browser);
    await login(page, owner);
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(`${owner.firstName} ${owner.lastName}`);
    await context.close();
  });

  test('3. wens aanmaken', async ({ browser }) => {
    const { context, page } = await newUserPage(browser);
    await login(page, owner);
    await page.getByText('Voeg wens toe').click();
    const dialog = page.getByRole('dialog');
    await dialog.locator('#wishTitle').fill(wishTitle);
    await dialog.locator('#WishPrice').fill('25');
    await dialog.locator('button[type="submit"]').click();
    await expect(dialog).toBeHidden();
    await expect(wishCard(page, wishTitle)).toBeVisible();
    await context.close();
  });

  test('4. reserveren', async ({ browser }) => {
    const { context, page } = await newUserPage(browser);
    await register(page, giver);
    await page.goto(`/people/${owner.id}`);
    const card = wishCard(page, wishTitle);
    await card.getByRole('button', { name: 'Reserveer' }).click();
    const dialog = page.getByRole('dialog');
    await dialog.locator('#reservationReason').selectOption({ label: 'Verjaardag' });
    await dialog.getByRole('button', { name: 'Reserveer', exact: true }).click();
    await expect(dialog).toBeHidden();
    // De overhandigingsdatum staat standaard op vandaag, dus de wens geldt meteen als ontvangen
    // (en de eigenaar kan in test 5 feedback geven).
    await expect(card).toContainText('Gegeven door jou');
    await context.close();
  });

  test('5. feedback geven', async ({ browser }) => {
    const { context, page } = await newUserPage(browser);
    await login(page, owner);
    const card = wishCard(page, wishTitle);
    await card.getByRole('button', { name: 'Geef feedback' }).click();
    const dialog = page.getByRole('dialog');
    await dialog.locator('ngb-rating fa-icon').nth(3).click();
    await dialog.locator('input[formcontrolname="receivedOn"]').fill(new Date().toISOString().substring(0, 10));
    await dialog.locator('#message').fill('Bedankt voor het cadeau!');
    await dialog.getByRole('button', { name: 'Feedback opslaan' }).click();
    await expect(dialog).toBeHidden();
    await page.getByText('Ontvangen cadeaus', { exact: true }).click();
    await expect(wishCard(page, wishTitle)).toBeVisible();
    await context.close();
  });

  test('6. wenslijst delen', async ({ browser }) => {
    const { context, page } = await newUserPage(browser);
    await login(page, owner);
    await page.locator('gimmi-share fa-icon').click();
    const dialog = page.getByRole('dialog');
    await expect(dialog.getByRole('heading', { name: 'Deel deze pagina' })).toBeVisible();
    await expect(dialog.locator('input[aria-label="wishlist link"]')).toHaveValue(new RegExp(`/people/${owner.id}$`));
    await context.close();
  });
});
