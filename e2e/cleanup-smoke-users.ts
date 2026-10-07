// Ruimt smoke-testgebruikers (en hun wensen) op in de testomgeving. Vangnet voor
// runs die halverwege stopten, en voor data van voor de opruiming in de spec.
//
//   npm run e2e:cleanup
//
// Werkt via de API: de gebruikers hebben een bekend wachtwoord, dus het script logt
// in als elke gebruiker en verwijdert diens account. Het zoekt kandidaten op naam
// (Smoke + Eigenaar/Gever/Opruimer) en verwijdert alleen als ook het e-mailadres
// op smoke+<rol>-<run>@gimmi.be past. Echte gebruikers worden dus nooit geraakt.
import { apiUrl, deleteAccount, emailOf, listPeople, register, smokeEmail, smokeLastNames, smokePassword } from './helpers/api.ts';

async function main(): Promise<void> {
  console.log(`Opruimen tegen ${apiUrl}`);
  const kandidaten = (await listPeople()).filter(p => p.firstName === 'Smoke' && smokeLastNames.includes(p.lastName));
  if (kandidaten.length === 0) {
    console.log('Geen smoke-gebruikers gevonden.');
    return;
  }

  // Het e-mailadres opvragen vraagt een token; een wegwerpgebruiker levert dat.
  const email = `smoke+cleanup-${Date.now().toString(36)}@gimmi.be`;
  const opruimer = await register('Smoke', 'Opruimer', email, smokePassword);

  let verwijderd = 0, wensen = 0, overgeslagen = 0;
  for (const persoon of [...kandidaten, { _id: opruimer.id, firstName: 'Smoke', lastName: 'Opruimer' }]) {
    const adres = String(await emailOf(persoon._id, opruimer.token)).replace(/^"|"$/g, '').toLowerCase();
    if (!smokeEmail.test(adres)) {
      console.log(`Overgeslagen (e-mail past niet): ${persoon.firstName} ${persoon.lastName} ${persoon._id}`);
      overgeslagen++;
      continue;
    }
    try {
      const resultaat = await deleteAccount(persoon._id, adres, smokePassword);
      verwijderd++;
      wensen += resultaat.deletedWishes;
    } catch (err) {
      console.log(`Mislukt voor ${adres}: ${(err as Error).message}`);
      overgeslagen++;
    }
  }
  console.log(`Klaar: ${verwijderd} gebruikers en ${wensen} wensen verwijderd, ${overgeslagen} overgeslagen.`);
}

main().catch(err => { console.error(err); process.exit(1); });
