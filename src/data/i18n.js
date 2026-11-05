import { createContext, useContext } from 'react'

export const UI = {
  pt: {
    presets: ['Agora (seu relógio)', 'Amanhecer', 'Meio-dia', 'Pôr do sol', 'Noite'],
    preview: 'Prévia',
    hour: 'Hora do dia',
    walk: 'Role ou arraste para caminhar',
    talk: 'Clique na Lume e na gatinha',
    musicOn: 'Ligar música',
    musicOff: 'Desligar música',
    rainOn: 'Chamar a chuva',
    rainOff: 'Parar a chuva',
    lang: 'Switch to English',
    prev: 'Parada anterior',
    next: 'Próxima parada',
    stops: 'Paradas da trilha',
    copy: 'Copiar',
    copied: 'Copiado',
    copyEmail: 'Copiar e-mail',
    soon: 'Em breve',
    enlarge: 'Ampliar',
    close: 'Fechar',
    prevArt: 'Arte anterior',
    nextArt: 'Próxima arte',
    email: 'E-mail',
    phases: ['Madrugada', 'Amanhecer', 'Manhã', 'Tarde', 'Pôr do sol', 'Anoitecer', 'Noite']
  },
  en: {
    presets: ['Now (your clock)', 'Dawn', 'Noon', 'Sunset', 'Night'],
    preview: 'Preview',
    hour: 'Time of day',
    walk: 'Scroll or drag to walk',
    talk: 'Click Lume and the kitty',
    musicOn: 'Turn music on',
    musicOff: 'Turn music off',
    rainOn: 'Make it rain',
    rainOff: 'Stop the rain',
    lang: 'Mudar para português',
    prev: 'Previous stop',
    next: 'Next stop',
    stops: 'Trail stops',
    copy: 'Copy',
    copied: 'Copied',
    copyEmail: 'Copy email',
    soon: 'Coming soon',
    enlarge: 'Enlarge',
    close: 'Close',
    prevArt: 'Previous artwork',
    nextArt: 'Next artwork',
    email: 'Email',
    phases: ['Late night', 'Dawn', 'Morning', 'Afternoon', 'Sunset', 'Dusk', 'Night']
  }
}

export const LUME = {
  pt: {
    stops: {
      ponto: 'Olha quem está esperando o ônibus com a gente! Faz carinho nela.',
      antena: 'Aquela antena no telhado conversa com satélites!',
      prefeitura: 'O relógio da prefeitura marca a sua hora de verdade.',
      galpao: 'O notebook ficou ligado. Alguém deixou um bug aberto…',
      atelie: 'Cheiro de tinta fresca! E tem patinhos no riacho, viu?',
      varal: 'Cada folha no varal é um desenho secando ao vento.',
      arvore: 'Chegamos! Senta no balanço um pouquinho.'
    },
    greet: ['Acordada a essa hora? Eu também!', 'Bom dia! O orvalho ainda está na grama.', 'Boa tarde! Que luz bonita hoje.', 'Boa noite! Agora eu brilho mais forte.'],
    intro: 'Eu sou a Lume. Vou com você pela trilha!',
    hover: 'Me passa o mouse em cima que eu fico feliz.',
    rain: 'Psiu… experimente chamar a chuva.',
    nightTip: 'Repara nos vaga-lumes perto da árvore grande.',
    dayTip: 'Volte depois das 18h: a trilha inteira acende.',
    spin: 'Mais um clique e eu dou outra pirueta!'
  },
  en: {
    stops: {
      ponto: 'Look who’s waiting for the bus with us! Give her some pets.',
      antena: 'That antenna on the roof talks to satellites!',
      prefeitura: 'The hall’s clock shows your real time.',
      galpao: 'The laptop was left on. Someone left a bug open…',
      atelie: 'Smell that fresh paint! And there are ducklings in the creek, see?',
      varal: 'Every sheet on the line is a drawing drying in the wind.',
      arvore: 'We made it! Sit on the swing for a bit.'
    },
    greet: ['Up at this hour? Me too!', 'Good morning! The dew is still on the grass.', 'Good afternoon! Lovely light today.', 'Good evening! Now I glow brighter.'],
    intro: 'I’m Lume. I’ll walk the trail with you!',
    hover: 'Hover over me and I get happy.',
    rain: 'Psst… try making it rain.',
    nightTip: 'Look at the fireflies near the great tree.',
    dayTip: 'Come back after 6pm: the whole trail lights up.',
    spin: 'One more click and I’ll do another twirl!'
  }
}

export const CREATURES = {
  pt: {
    cat: ['miau!', 'mrrrp?', 'prrrr…', 'miau miau', '*pisca devagar*'],
    spirit: ['Hmm…? Ah, uma visita.', 'Eu cuido desta árvore há muito tempo.', 'Shhh… os vaga-lumes já vão acordar.', 'Volte sempre. Eu vou estar aqui, cochilando.']
  },
  en: {
    cat: ['meow!', 'mrrrp?', 'purrrr…', 'meow meow', '*slow blink*'],
    spirit: ['Hmm…? Oh, a visitor.', 'I’ve looked after this tree for a long time.', 'Shhh… the fireflies will wake up soon.', 'Come back anytime. I’ll be here, napping.']
  }
}

export const LangContext = createContext('pt')

export const useLang = () => useContext(LangContext)

export const useUI = () => UI[useContext(LangContext)]

export function initialLang() {
  try {
    const v = localStorage.getItem('trilha-lang')
    if (v === 'pt' || v === 'en') return v
  } catch {}
  return typeof navigator !== 'undefined' && !/^pt/i.test(navigator.language || '') ? 'en' : 'pt'
}
