import type { Topic, TopicId } from '../types'

export const topics: Record<TopicId, Topic> = {
  numbers: {
    id: 'numbers', name: 'Numbers, prices & time', rank: 1,
    why: 'Dates, prices and times appear throughout everyday listening and reading tasks.',
    action: 'Say 10 prices and clock times aloud each day. For 49, say the ones before the tens: neunundvierzig. For 14:30, say halb drei.',
    minutes: '5 min / day',
  },
  verbs: {
    id: 'verbs', name: 'Verb endings & modal verbs', rank: 2,
    why: 'You need the right verb form in almost every sentence you write or speak.',
    action: 'Conjugate sein, haben, wohnen, können and möchten aloud. Then make one short sentence with each verb.',
    minutes: '10 min / day',
  },
  articles: {
    id: 'articles', name: 'Articles, kein & accusative', rank: 3,
    why: 'Articles help you write and speak accurately about people and things.',
    action: 'Learn 10 nouns with der, die or das. Practise “Ich habe einen Bruder”, “Ich brauche einen Stift” and “Ich habe kein Auto”.',
    minutes: '10 min / day',
  },
  'word-order': {
    id: 'word-order', name: 'Word order', rank: 4,
    why: 'Verb position matters when you describe plans in writing and speaking.',
    action: 'Write 5 sentences starting with Heute, Morgen or Am Montag. Keep the conjugated verb second and separable prefixes at the end.',
    minutes: '10 min / day',
  },
  messages: {
    id: 'messages', name: 'Reading short messages', rank: 5,
    why: 'Short personal messages are a common A1 reading task.',
    action: 'Read one short German email each day. Read the question first, then find the day, time or object that answers it.',
    minutes: '5 min / day',
  },
  notices: {
    id: 'notices', name: 'Signs & notices', rank: 6,
    why: 'A1 reading tasks ask you to understand practical notices and opening hours.',
    action: 'Read 3 short signs. Circle geschlossen, geöffnet, nur, ab and bis; say exactly when the place is open.',
    minutes: '5 min / day',
  },
  ads: {
    id: 'ads', name: 'Matching ads', rank: 7,
    why: 'You need to match a person’s needs with the right advertisement.',
    action: 'Underline the need first: when, where or how much? Compare 2 German ads and explain which one meets that need.',
    minutes: '5 min / day',
  },
  everyday: {
    id: 'everyday', name: 'Everyday vocabulary', rank: 8,
    why: 'Words for family, home and food support all four exam skills.',
    action: 'Learn a themed set of 10 words with flashcards. Include the article and use each word in a sentence about your day.',
    minutes: '10 min / day',
  },
  phrases: {
    id: 'phrases', name: 'Set phrases', rank: 9,
    why: 'Familiar requests and replies help you handle everyday speaking tasks.',
    action: 'Practise 5 useful phrases aloud, including “Bitte schön”, “Entschuldigung” and “Können Sie mir bitte helfen?”. Build up to 20.',
    minutes: '5 min / day',
  },
}

export const coverageTopics: readonly Topic[] = [
  {
    id: 'listening-speaking', name: 'Listening & speaking', rank: 10,
    why: 'This check cannot assess understanding audio or having a conversation.',
    action: 'Use an official A1 practice test with audio. Then practise introducing yourself and asking for something with a partner.',
    minutes: '15 min / day',
  },
  {
    id: 'writing-mock', name: 'Writing & a full mock test', rank: 11,
    why: 'A strong short-check score still needs confirmation across the full exam.',
    action: 'Write a short A1 email, ask a teacher for feedback, and complete an official full mock test under timed conditions before booking.',
    minutes: 'Before booking',
  },
]

export const officialLinks = {
  goetheRules: 'https://www.goethe.de/en/spr/prf/pes/pas1.html',
  goethePractice: 'https://www.goethe.de/ins/de/en/prf/gzsd1/ueb.html',
  osd: 'https://www.osd.at/en/exams/oesd-exams/oesd-zertifikat-a1-za1/',
  osdScoring: 'https://www.osd.at/wp-content/uploads/2024/09/ZA1-Modellsatzbroschure_WEB.pdf',
}
