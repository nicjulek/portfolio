import artMenu from '../assets/knockup/menu.webp'
import artCidade from '../assets/knockup/cidade.webp'
import artItem from '../assets/knockup/item.webp'
import artPersonagens from '../assets/knockup/personagens.webp'
import desVestido from '../assets/varal/vestido.png'
import desTerceiroOlho from '../assets/varal/terceiro-olho.png'
import desRetrato from '../assets/varal/retrato.png'
import desCoroa from '../assets/varal/coroa-de-flores.png'

export const DRAWINGS = [
  { src: desVestido, note: { pt: 'Caneta esferográfica', en: 'Ballpoint pen' } },
  { src: desCoroa, wide: true, note: { pt: 'Caneta esferográfica', en: 'Ballpoint pen' } },
  { src: desTerceiroOlho, note: { pt: 'Caneta esferográfica', en: 'Ballpoint pen' } },
  { src: desRetrato, wide: true, note: { pt: 'Caneta esferográfica', en: 'Ballpoint pen' } }
]

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
      pt: ['Desenvolvimento full-stack', 'Pesquisa em IA: detecção de deepfakes e violência digital de gênero', 'UI/UX com olhar de ilustradora', 'Concept art para jogos'],
      en: ['Full-stack development', 'AI research: deepfake detection and gender-based digital violence', 'UI/UX with an illustrator’s eye', 'Concept art for games']
    },
    tags: []
  },
  {
    id: 'antena',
    dist: 7.5,
    z: 16,
    side: -1,
    accent: '#3f7fa6',
    name: { pt: 'Central das antenas', en: 'Antenna station' },
    kicker: { pt: 'Estágio · mai. 2026 – atual', en: 'Internship · May 2026 – present' },
    title: { pt: 'Estagiária de TI', en: 'IT Intern' },
    org: 'Princesa dos Campos',
    body: {
      pt: 'Trabalho entre infraestrutura e desenvolvimento: configuro e monitoro as antenas Starlink da frota de ônibus e desenvolvo apps e integrações para a empresa.',
      en: 'I work between infrastructure and development: I configure and monitor the Starlink antennas on the bus fleet and build apps and integrations for the company.'
    },
    facts: {
      pt: ['Configuração e monitoramento das antenas Starlink dos ônibus', 'Apps mobile com Flutter', 'Integrações com o Protheus e bancos PostgreSQL'],
      en: ['Configuring and monitoring the buses’ Starlink antennas', 'Mobile apps with Flutter', 'Integrations with Protheus and PostgreSQL databases']
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
        name: { pt: 'Detecção de deepfakes · TCC', en: 'Deepfake detection · Thesis' },
        lang: 'Python',
        color: '#3572a5',
        desc: {
          pt: 'Detector de deepfakes em vídeo com EfficientNet-B0, unido a uma análise sociotécnica da violência digital contra mulheres. Dados divididos por identidade para evitar vazamento: F1 de 0,87 e recall de 0,84 em nível de vídeo na FaceForensics++ (c40).',
          en: 'Video deepfake detector built on EfficientNet-B0, paired with a sociotechnical analysis of digital violence against women. Identity-based data split to prevent leakage: 0.87 F1 and 0.84 recall at video level on FaceForensics++ (c40).'
        },
        stack: 'PyTorch · MTCNN · Grad-CAM++'
      },
      {
        name: 'Jardim do Foco',
        lang: 'Kotlin',
        color: '#a97bff',
        desc: {
          pt: 'App Android contra a procrastinação: uma planta virtual cresce em tempo real enquanto você se concentra, e cada sessão de foco traz uma frase motivacional buscada numa API externa. O estado da planta fica salvo no banco local com Room, então o progresso não se perde ao fechar o app.',
          en: 'Android app against procrastination: a virtual plant grows in real time while you focus, and each session brings a motivational quote fetched from an external API. The plant’s state is saved locally with Room, so progress survives closing the app.'
        },
        stack: { pt: 'Android · Room · SharedPreferences · API REST', en: 'Android · Room · SharedPreferences · REST API' },
        url: 'https://github.com/nicjulek/jardimdofoco'
      },
      {
        name: 'Terra',
        lang: 'JavaScript',
        color: '#e9c34a',
        desc: {
          pt: 'Estudo de computação gráfica no navegador: o planeta Terra em 3D com textura realista e iluminação, que dá para girar com o mouse, aproximar e afastar com zoom e explorar com controles de câmera.',
          en: 'A computer graphics study in the browser: planet Earth in 3D with realistic texture and lighting, which you can rotate with the mouse, zoom in and out of, and explore with camera controls.'
        },
        stack: 'Three.js · JavaScript · WebGL',
        url: 'https://github.com/nicjulek/Terra'
      },
      {
        name: { pt: 'Sistema de Hotel', en: 'Hotel System' },
        lang: 'PHP',
        color: '#7a86c2',
        desc: {
          pt: 'Sistema web de gestão hoteleira feito em equipe de quatro pessoas: cadastro de clientes, acompanhantes e quartos, reservas com edição e cancelamento, check-in e check-out e histórico das hospedagens. Organizado em MVC, com o banco versionado por migrations.',
          en: 'Hotel management web system built by a team of four: guest, companion and room records, bookings with editing and cancellation, check-in and check-out, and a stay history. Built with MVC, with the database versioned through migrations.'
        },
        stack: 'Laravel · Blade · Eloquent',
        url: 'https://github.com/guilhermegoebel/sistemahotel'
      },
      {
        name: { pt: 'Este portfólio', en: 'This portfolio' },
        lang: 'React',
        color: '#61b3d4',
        desc: {
          pt: 'A trilha que você está percorrendo: o céu segue a hora real, dá para ligar a chuva, a música é gerada no próprio navegador e cada parada conta um pedaço da minha história. Grama, riacho e a fadinha Lume usam shaders próprios, e a qualidade gráfica se ajusta sozinha ao aparelho.',
          en: 'The trail you’re walking: the sky follows the real time, you can turn on the rain, the music is generated in the browser and each stop tells part of my story. Grass, stream and Lume the fairy use custom shaders, and the graphics quality adapts to your device.'
        },
        stack: 'React Three Fiber · GLSL · Web Audio',
        url: 'https://github.com/nicjulek/portfolio'
      }
    ],
    tags: ['React', 'Angular', 'TypeScript', 'Node.js', 'Django', 'Laravel', 'Kotlin', 'Three.js', 'Python', 'PyTorch']
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
      { src: artCidade, title: { pt: 'Cidade neon', en: 'Neon city' }, note: { pt: 'Concept art de cenário · pintura digital', en: 'Environment concept art · digital painting' } },
      { src: artMenu, title: { pt: 'Tela inicial do jogo', en: 'Title screen' }, note: { pt: 'Ilustração do menu principal', en: 'Main menu illustration' } },
      { src: artPersonagens, title: { pt: 'Variações de mercadores', en: 'Merchant variations' }, note: { pt: 'Estudos de personagem', en: 'Character studies' } },
      { src: artItem, title: { pt: 'Braço do personagem com encaixe', en: 'Character arm with socket' }, note: { pt: 'Design de item', en: 'Item design' } }
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
    drawings: DRAWINGS,
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
