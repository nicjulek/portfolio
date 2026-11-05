import artMenu from '../assets/knockup/menu.webp'
import artCidade from '../assets/knockup/cidade.webp'
import artItem from '../assets/knockup/item.webp'
import artPersonagens from '../assets/knockup/personagens.webp'

export const tr = (v, lang) => (v && typeof v === 'object' && !Array.isArray(v) && ('pt' in v || 'en' in v) ? v[lang] ?? v.pt : v)

export const localize = (v, lang) => {
  if (Array.isArray(v)) return v.map((x) => localize(x, lang))
  if (v && typeof v === 'object') {
    if ('pt' in v || 'en' in v) return localize(v[lang] ?? v.pt, lang)
    const o = {}
    for (const k in v) o[k] = localize(v[k], lang)
    return o
  }
  return v
}

export const PROFILE = {
  name: 'Nicole Julek Klazura',
  role: { pt: 'Desenvolvedora & Ilustradora', en: 'Developer & Illustrator' },
  city: 'Ponta Grossa, PR'
}

export const LINKS = {
  linkedin: 'https://www.linkedin.com/in/nicole-julek-klazura-592880149',
  email: 'nicolejklazura@gmail.com',
  github: 'https://github.com/nicjulek'
}

export const STOPS = [
  {
    id: 'ponto',
    dist: 4.4,
    z: 30,
    side: 1,
    accent: '#d9693b',
    name: { pt: 'Ponto de ônibus', en: 'Bus stop' },
    kicker: { pt: 'Início da trilha', en: 'Start of the trail' },
    title: { pt: 'Oi, eu sou a Nicole', en: "Hi, I'm Nicole" },
    org: { pt: 'Engenharia de Software · UEPG', en: 'Software Engineering · UEPG' },
    body: {
      pt: 'Trabalho nos dois lados da tela: escrevo o código e desenho o que aparece nele. Gosto de back-ends bem organizados e de interfaces que dão vontade de explorar, como esta trilha.',
      en: 'I work on both sides of the screen: I write the code and draw what shows up on it. I like well-organized back-ends and interfaces that make you want to explore, like this trail.'
    },
    facts: {
      pt: ['Desenvolvimento full-stack', 'UI/UX com olhar de ilustradora', 'Concept art para jogos'],
      en: ['Full-stack development', 'UI/UX with an illustrator’s eye', 'Concept art for games']
    },
    tags: []
  },
  {
    id: 'antena',
    dist: 7.5,
    z: 16,
    side: -1,
    accent: '#3f7fa6',
    name: { pt: 'Casa da antena', en: 'Antenna house' },
    kicker: { pt: 'Estágio · mai. 2026 – atual', en: 'Internship · May 2026 – present' },
    title: { pt: 'Estagiária de TI', en: 'IT Intern' },
    org: 'Princesa dos Campos',
    body: {
      pt: 'Cuido de infraestrutura e desenvolvimento ao mesmo tempo: num dia estou no telhado configurando uma antena, no outro estou no código de um app.',
      en: 'I handle infrastructure and development at the same time: one day I’m on a roof setting up an antenna, the next I’m in the code of an app.'
    },
    facts: {
      pt: ['Instalação e monitoramento de antenas Starlink', 'Apps mobile com Flutter', 'Integrações com o Protheus e bancos PostgreSQL'],
      en: ['Installing and monitoring Starlink antennas', 'Mobile apps with Flutter', 'Integrations with Protheus and PostgreSQL databases']
    },
    tags: ['Flutter', 'Flask', 'PostgreSQL', 'Protheus', 'Starlink', 'Web design']
  },
  {
    id: 'prefeitura',
    dist: 8.5,
    z: 2,
    side: 1,
    accent: '#b5763a',
    name: { pt: 'Prefeitura da vila', en: 'Village hall' },
    kicker: { pt: 'Estágio · fev. 2025 – dez. 2025', en: 'Internship · Feb 2025 – Dec 2025' },
    title: { pt: 'Estagiária em Desenvolvimento de Sistemas', en: 'Systems Development Intern' },
    org: { pt: 'Prefeitura Municipal de Ponta Grossa', en: 'Ponta Grossa City Hall' },
    body: {
      pt: 'Onze meses desenvolvendo e mantendo sistemas web usados pela prefeitura, do back-end em PHP até a interface.',
      en: 'Eleven months building and maintaining web systems used by the city hall, from the PHP back-end to the interface.'
    },
    facts: {
      pt: ['Sistemas web internos em PHP', 'Interfaces responsivas com Bootstrap', 'Manutenção e evolução de sistemas em produção'],
      en: ['Internal web systems in PHP', 'Responsive interfaces with Bootstrap', 'Maintaining and evolving systems in production']
    },
    tags: ['PHP', 'Bootstrap', 'MySQL', 'JavaScript']
  },
  {
    id: 'galpao',
    dist: 6.5,
    z: -12,
    side: -1,
    accent: '#4f7a5a',
    name: { pt: 'Galpão de ferramentas', en: 'Tool shed' },
    kicker: { pt: 'Projetos', en: 'Projects' },
    title: { pt: 'Coisas que eu construí', en: 'Things I’ve built' },
    org: 'github.com/nicjulek',
    body: { pt: 'Projetos para estudar, testar ideias ou resolver um problema meu.', en: 'Projects to learn, test ideas or solve a problem of my own.' },
    projects: [
      {
        name: 'Jardim do Foco',
        lang: 'Kotlin',
        color: '#a97bff',
        desc: {
          pt: 'App Android que transforma tempo de foco em jardinagem: uma planta cresce enquanto você se concentra.',
          en: 'Android app that turns focus time into gardening: a plant grows while you concentrate.'
        },
        stack: { pt: 'Android · Room · API de frases', en: 'Android · Room · quotes API' },
        url: 'https://github.com/nicjulek/jardimdofoco'
      },
      {
        name: 'Terra',
        lang: 'JavaScript',
        color: '#e9c34a',
        desc: { pt: 'O planeta Terra em 3D com textura, iluminação e controles de câmera.', en: 'Planet Earth in 3D with textures, lighting and camera controls.' },
        stack: 'Three.js',
        url: 'https://github.com/nicjulek/Terra'
      },
      {
        name: { pt: 'Sistema de Hotel', en: 'Hotel System' },
        lang: 'PHP',
        color: '#7a86c2',
        desc: { pt: 'Sistema de gestão hoteleira feito em equipe.', en: 'Hotel management system built as a team.' },
        stack: 'Laravel · Vite',
        url: 'https://github.com/guilhermegoebel/sistemahotel'
      },
      {
        name: { pt: 'Este portfólio', en: 'This portfolio' },
        lang: 'React',
        color: '#61b3d4',
        desc: {
          pt: 'A trilha que você está percorrendo, com céu na hora real e trilha sonora gerada no navegador.',
          en: 'The trail you’re walking, with a real-time sky and a soundtrack generated in the browser.'
        },
        stack: 'React Three Fiber · shaders',
        url: 'https://github.com/nicjulek'
      }
    ],
    tags: ['React', 'Angular', 'TypeScript', 'Node.js', 'Django', 'Laravel', 'Kotlin', 'Three.js']
  },
  {
    id: 'atelie',
    dist: 5,
    z: -26,
    side: 1,
    accent: '#c9563b',
    name: { pt: 'Ateliê do riacho', en: 'Creek studio' },
    kicker: { pt: 'Freelance · abr. 2026 – atual', en: 'Freelance · Apr 2026 – present' },
    title: { pt: 'Ilustradora', en: 'Illustrator' },
    org: 'KnockUp Game Studio',
    body: {
      pt: 'Concept art para um jogo em desenvolvimento. Traduzo ideias de narrativa e gameplay em referências visuais que guiam a produção do jogo inteiro.',
      en: 'Concept art for a game in development. I turn narrative and gameplay ideas into visual references that guide the whole production.'
    },
    art: [
      { src: artCidade, title: { pt: 'A cidade vertical', en: 'The vertical city' }, note: { pt: 'Cenário · pintura digital', en: 'Environment · digital painting' } },
      { src: artMenu, title: { pt: 'Tela inicial do jogo', en: 'Title screen' }, note: { pt: 'Ilustração do menu principal', en: 'Main menu illustration' } },
      { src: artPersonagens, title: { pt: 'Viajantes', en: 'Travelers' }, note: { pt: 'Estudos de personagem', en: 'Character studies' } },
      { src: artItem, title: { pt: 'Peça recuperada', en: 'Salvaged part' }, note: { pt: 'Design de item', en: 'Item design' } }
    ],
    tags: { pt: ['Concept art', 'Personagens', 'Cenários', 'Itens', 'Pintura digital'], en: ['Concept art', 'Characters', 'Environments', 'Items', 'Digital painting'] }
  },
  {
    id: 'varal',
    dist: 5.5,
    z: -40,
    side: -1,
    accent: '#c9708a',
    name: { pt: 'Varal de desenhos', en: 'Drawing line' },
    kicker: { pt: 'Ilustração autoral', en: 'Personal illustration' },
    title: { pt: 'Desenhos secando ao vento', en: 'Drawings drying in the wind' },
    org: { pt: 'Trabalhos pessoais', en: 'Personal work' },
    body: { pt: 'Personagens, paisagens e estudos que desenho fora do trabalho.', en: 'Characters, landscapes and studies I draw outside of work.' },
    gallery: 4,
    tags: { pt: ['Ilustração digital', 'Personagens', 'Paisagens'], en: ['Digital illustration', 'Characters', 'Landscapes'] }
  },
  {
    id: 'arvore',
    dist: 12,
    z: -56,
    side: 1,
    accent: '#2f6a3c',
    name: { pt: 'A árvore grande', en: 'The great tree' },
    kicker: { pt: 'Fim da trilha', en: 'End of the trail' },
    title: { pt: 'Vamos criar algo juntos?', en: 'Shall we make something together?' },
    org: { pt: 'Contato', en: 'Contact' },
    body: {
      pt: 'Estou aberta a oportunidades em desenvolvimento, freelas de ilustração e projetos que juntem código e arte.',
      en: 'I’m open to development opportunities, illustration freelance work and projects that mix code and art.'
    },
    contact: true,
    tags: []
  }
]
