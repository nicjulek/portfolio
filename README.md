# Trilha do Lume

    npm install
    npm run dev      # desenvolvimento
    npm run build    # gera a pasta dist para publicar
    npm run lint     # verifica o código

## Estrutura

    src/
    ├── main.jsx                  entrada
    ├── App.jsx                   junta interface + cena
    ├── data/                     CONTEÚDO
    │   ├── stops.js              paradas, textos PT/EN, projetos, links, artes
    │   └── i18n.js               textos da interface e falas
    ├── world/                    geografia da trilha
    │   ├── terrain.js            caminho, relevo, posição das paradas
    │   └── avoid.js              áreas sem grama/árvores
    ├── hooks/                    lógica da interface
    │   ├── useLanguage.js  useClock.js  useMusic.js  useTrailControls.js
    ├── audio/                    Lullaby.js (música), sfx.js (miado)
    ├── components/
    │   ├── ui/                   TopBar, TrailNav, Hint, Icons (+ .css)
    │   └── card/                 StopCard e suas partes: CardHeader, Facts,
    │                             Projects, Artworks, Lightbox, Gallery,
    │                             Contact, CopyEmail, Tags (+ .css)
    ├── styles/                   base.css, bubble.css
    ├── assets/                   imagens
    └── scene/                    tudo que é 3D
        ├── Scene.jsx             monta a cena
        ├── CameraWalker.jsx      câmera que anda pela trilha
        ├── Effects.jsx           bloom, vinheta
        ├── core/                 env (hora/céu/vento), materials, primitives, ground
        ├── sky/                  Sky, EnvDriver, SkyDome, Lights
        ├── nature/               Terrain, Stream, Grass, Trees, Plants, Flowers,
        │                         Rocks, Clouds, Rain, Fireflies, FallingLeaves
        ├── buildings/            BusStop, AntennaHouse, Hall, Shed, Atelie,
        │   │                     Bridge, Clothesline, GiantTree, PathLamps
        │   └── parts/            House, Window, Door, Lantern, Clock, Smoke…
        ├── creatures/            CatOnRock, Rabbits, Ducks, Birds, Butterflies
        │   └── cat/              a gata: RealCat, Eye, Ear, Tail, Whiskers, fur…
        └── lume/                 a fadinha: Lume, Trail, Burst, dialogue, shaders

Para trocar textos: `src/data/`. Para mexer num prédio: `src/scene/buildings/`.
