# Plan för strikt användning av avatarer

Jag ska rensa i koden för att säkerställa att endast designade avatarer används som profilbilder, helt i linje med dina önskemål. Inga "riktiga" uppladdade bilder ska tillåtas eller visas som profilbilder.

## Föreslagna ändringar

### 1. Förenkla Avatar-komponenten (`components/ui/UserAvatar.tsx`)
- Ta bort logiken som letar efter bilder i `avatars` storage-bucket.
- Behåll endast hämtning från `profiles`-tabellen (där avatar-URL:en sparas när man designar den) och den direkta `avatarUrl`-proppen.
- Detta säkerställer att om ingen designad avatar finns, så visas initialer istället för en gammal uppladdad bild.

### 2. Rensa oanvända filer
- Ta bort eller lämna `AvatarUpload.tsx` oanvänd (den används inte i dagsläget).

### 3. Kontrollera profilinställningar (`app/profil/installningar/page.tsx`)
- Säkerställ att spara-funktionen endast skickar med URL:en från avatar-studion till användarens metadata.

## Verifieringsplan

### Manuell verifiering
1. Gå till din profil. Om du har en tidigare uppladdad bild ("riktig" bild) i lagringen ska den inte längre synas, utan ersättas av din designade avatar eller initialer.
2. Gå till inställningar och spara en ny avatar-design. Verifiera att den uppdateras korrekt överallt (flöde, kommentarer, profil).
3. Kontrollera att det inte finns några dolda knappar för att ladda upp riktiga profilbilder.
