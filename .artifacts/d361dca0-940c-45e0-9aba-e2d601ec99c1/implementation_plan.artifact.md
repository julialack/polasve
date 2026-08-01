# Plan för extra bilder i specifika kategorier

Jag ska implementera möjligheten att ladda upp 2 extra bilder för kategorierna Säljes (Marketplace), Bytes, Hyra och Sökes.

## Föreslagna ändringar

### 1. Databas och Typer
- [x] SQL-kommando för `extra_images TEXT[]` förberett.
- [MODIFY] [types/database.ts](file:///C:/Users/admin/Desktop/polasve/types/database.ts): Lägg till `extra_images: string[] | null` i `Ad`.

### 2. Annonsskapande
#### [MODIFY] [app/skapa-annons/page.tsx](file:///C:/Users/admin/Desktop/polasve/app/skapa-annons/page.tsx)
- Lägg till "Bytes" i kategorivalet.
- Skapa state för `extraImageFiles` och `extraImagePreviews`.
- Visa två mindre uppladdningsrutor om kategorin är Marketplace, Bytes, Hyra eller Sökes.
- Uppdatera `handleSubmit` för att ladda upp och spara dessa bilder.

### 3. Redigering
#### [MODIFY] [app/annonser/[id]/redigera/page.tsx](file:///C:/Users/admin/Desktop/polasve/app/annonser/[id]/redigera/page.tsx)
- Implementera samma UI för extra bilder som på "skapa"-sidan.
- Möjliggör uppdatering av befintliga extra bilder.

### 4. Visning
#### [MODIFY] [app/annonser/[id]/page.tsx](file:///C:/Users/admin/Desktop/polasve/app/annonser/[id]/page.tsx)
- Lägg till ett bildgalleri under huvudbilden som visar de extra bilderna om de finns.

## Verifieringsplan
1. Skapa en annons i kategorin "Marketplace" och ladda upp 3 bilder totalt.
2. Verifiera att alla 3 bilder syns på annonssidan.
3. Testa att redigera och byta ut en av de mindre bilderna.
4. Kontrollera att de extra rutorna *inte* syns för t.ex. kategorin "Jobb".
