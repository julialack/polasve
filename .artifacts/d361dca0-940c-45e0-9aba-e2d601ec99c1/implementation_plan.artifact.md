# Plan för enhetlig flödes- och annonssida

Jag ska bygga om kategorisidorna så att de inte längre kräver att man växlar mellan flikar. Istället kommer annonserna (fokus på betalda/premium) att ligga högst upp, följt av community-flödet direkt under på samma sida.

## Föreslagna ändringar

### 1. Uppdatera layouten (`CategoryLanding.tsx`)
- **Ta bort flik-systemet:** Inget behov av att klicka för att byta vy.
- **Sektionsindelning:**
    1. **Toppsektion:** "Aktuella Annonser" - Visar alla annonser i kategorin (med de som betalat/premium tydligt markerade eller först).
    2. **Mellansektion:** En tydlig avskiljare för Community.
    3. **Bottensektion:** `PostBox` och `FeedList` för att låta diskussionen flöda fritt under annonserna.

### 2. Designförbättringar
- Se till att övergången mellan annonslistan och inläggsfältet är naturlig och snygg.
- Behåll sidomenyerna (Premium sidebar och navigering) på kanterna som vanligt.

## Verifieringsplan

### Manuell verifiering
1. Gå till `/jobb`.
2. Verifiera att annonserna syns direkt i toppen.
3. Scrolla ner och se att inläggsfältet och flödet finns där direkt utan klick.
4. Kontrollera att det fungerar likadant på andra kategorisidor som "Bostad".
