# terra-nova-verse

```javascript
import React, { useState } from 'react';

const GaiaVerse = () => {
    const [concepts, setConcepts] = useState([
        {
            title: "Dynamische Bio-Narrative",
            description: "Die Geschichte und die Umwelt entwickeln sich dynamisch basierend auf den Entscheidungen der Spieler."
        },
        {
            title: "Emotionale Landwirtschaft",
            description: "Interaktion mit Pflanzen und Tieren auf emotionaler Ebene, die die Erträge beeinflusst."
        },
        {
            title: "Genetische Manipulation",
            description: "Experimentieren mit genetischer Manipulation, um neue Pflanzen und Tiere zu erschaffen."
        },
        {
            title: "Simulierte Ökosysteme",
            description: "Jede Farm bildet ein kleines, lebendiges Ökosystem, das in Echtzeit reagiert."
        },
        {
            title: "Augmented Reality mit realen Auswirkungen",
            description: "Virtuelle Aktionen fördern reale Umweltprojekte."
        },
        {
            title: "Virtuelle Klima-Tourismus",
            description: "Virtuelle Reisen zu klimatisch unterschiedlichen Farmen zur Wissensvermittlung."
        },
        {
            title: "Interaktive Handwerkskunst",
            description: "Spieler entwerfen Werkzeuge, die ihre Effizienz in der Landwirtschaft beeinflussen."
        },
        {
            title: "KI-gesteuerte Bio-Mentoren",
            description: "Individuelle Ratschläge zur Optimierung von Farmen durch KI-Technologie."
        },
        {
            title: "Kryptobotanik und Alchemie",
            description: "Erforschung mystischer Pflanzenkunde zur Schaffung einzigartiger Effekte."
        }
    ]);

    return (
        <div className="p-5 max-w-3xl mx-auto">
            <h1 className="text-3xl font-bold mb-4">Willkommen im GaiaVerse</h1>
            <p className="mb-6">Das interaktive Metaversum der regenerativen Landwirtschaft, wo Ihre Entscheidungen nachhaltige Auswirkungen haben.</p>

            <ul className="space-y-4">
                {concepts.map((concept, index) => (
                    <li key={index} className="border p-4 rounded-lg shadow">
                        <h2 className="text-xl font-semibold">{concept.title}</h2>
                        <p>{concept.description}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default GaiaVerse;
```

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://terra-nova-verse.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/5f7c8925-95f4-4575-87c7-9aad0be5e457).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
