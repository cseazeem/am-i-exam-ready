import type { Passage, Question } from '../types'

export const passages: Record<string, Passage> = {
  birthday: {
    kind: 'email', label: 'A birthday invitation', title: 'Einladung zum Geburtstag',
    sender: 'Jonas → Anna',
    text: 'Hallo Anna,\n\nam Samstag feiere ich meinen Geburtstag. Die Party beginnt um 19 Uhr bei mir zu Hause. Kannst du bitte einen Salat mitbringen?\n\nIch freue mich auf dich!\nJonas',
  },
  doctor: {
    kind: 'notice', label: 'Opening hours', title: 'Arztpraxis Dr. Weber',
    text: 'Öffnungszeiten\n\nMontag–Freitag: 8–12 Uhr\nDienstag und Donnerstag auch: 15–18 Uhr',
  },
  shop: {
    kind: 'notice', label: 'A shop notice', title: 'Wir machen Urlaub!',
    text: 'Unser Geschäft ist vom 3. bis 17. August geschlossen.\n\nAb dem 18. August sind wir wieder für Sie da!',
  },
  courses: {
    kind: 'ads', label: 'Two course advertisements', title: 'Deutsch lernen',
    ads: [
      { label: 'Anzeige A', title: 'Deutschkurs A1', text: 'Montag–Freitag · 9–12 Uhr\nLernen Sie jeden Vormittag Deutsch.' },
      { label: 'Anzeige B', title: 'A1-Intensivkurs', text: 'Samstags · 10–15 Uhr\nDeutsch lernen am Wochenende.' },
    ],
  },
}

export const questions: readonly Question[] = [
  {
    id: 'v1', skill: 'vocabulary', topic: 'numbers',
    instruction: 'Choose how to say the price.', prompt: 'Das Brot kostet 2,49 €. Wie sagt man das?',
    options: ['zwei Euro vierundneunzig', 'zwei Euro neunundvierzig', 'zwanzig Euro neunundvierzig', 'zwei Euro neunzehn'],
    answer: 1, explanation: '2,49 € is zwei Euro neunundvierzig. In German, the ones come before the tens: neun-und-vierzig = 49.',
  },
  {
    id: 'v2', skill: 'vocabulary', topic: 'numbers',
    instruction: 'Complete the everyday expression for the time.', prompt: 'Es ist 14:30 Uhr. Im Alltag: „Es ist ___ drei.“',
    options: ['Viertel nach', 'Viertel vor', 'kurz vor', 'halb'],
    answer: 3, explanation: 'Halb drei means halfway to three: 2:30. At 14:30, it is halb drei in everyday speech.',
  },
  {
    id: 'v3', skill: 'vocabulary', topic: 'everyday',
    instruction: 'Choose the word that does not belong.', prompt: 'Welches Wort passt nicht?',
    options: ['Mutter', 'Bruder', 'Küche', 'Tochter'],
    answer: 2, explanation: 'Mutter (mother), Bruder (brother) and Tochter (daughter) are family members. Küche means kitchen.',
  },
  {
    id: 'v4', skill: 'vocabulary', topic: 'everyday',
    instruction: 'Choose the word that completes the sentence.', prompt: 'Ich bin müde. Ich gehe ins ___.',
    options: ['Bett', 'Kino', 'Büro', 'Restaurant'],
    answer: 0, explanation: 'Müde means tired. “Ich gehe ins Bett” means “I’m going to bed”, the natural choice in this context.',
  },
  {
    id: 'v5', skill: 'vocabulary', topic: 'phrases',
    instruction: 'Choose the appropriate reply.', prompt: 'Jemand sagt: „Vielen Dank!“ Sie antworten:',
    options: ['Gute Besserung.', 'Guten Appetit.', 'Bitte schön.', 'Wie bitte?'],
    answer: 2, explanation: 'Bitte schön is a polite reply to thank you. Gute Besserung means get well soon; Guten Appetit is said before a meal.',
  },
  {
    id: 'g1', skill: 'grammar', topic: 'verbs',
    instruction: 'Choose the correct verb form.', prompt: 'Wo ___ du?',
    options: ['wohne', 'wohnst', 'wohnt', 'wohnen'],
    answer: 1, explanation: 'With du, wohnen becomes wohnst: “Wo wohnst du?” means “Where do you live?”.',
  },
  {
    id: 'g2', skill: 'grammar', topic: 'verbs',
    instruction: 'Choose the correct modal verb form.', prompt: 'Ich ___ heute nicht kommen. Ich bin krank.',
    options: ['kannst', 'könnt', 'können', 'kann'],
    answer: 3, explanation: 'The ich form of können is kann. “Ich kann heute nicht kommen” means “I cannot come today”.',
  },
  {
    id: 'g3', skill: 'grammar', topic: 'articles',
    instruction: 'Choose the correct article.', prompt: 'Ich habe ___ Bruder.',
    options: ['einen', 'ein', 'einem', 'eine'],
    answer: 0, explanation: 'Bruder is masculine (der Bruder). As the direct object of haben, it takes the accusative article einen.',
  },
  {
    id: 'g4', skill: 'grammar', topic: 'articles',
    instruction: 'Choose the correct word to say you do not have a car.', prompt: 'Ich habe ___ Auto.',
    options: ['nicht', 'keine', 'kein', 'keinen'],
    answer: 2, explanation: 'Auto is neuter (das Auto). Use kein to negate this noun: “Ich habe kein Auto”. The neuter accusative form stays kein.',
  },
  {
    id: 'g5', skill: 'grammar', topic: 'word-order',
    instruction: 'Choose the sentence with the correct word order.', prompt: 'Welcher Satz ist richtig?',
    options: ['Morgen ich stehe um 7 Uhr auf.', 'Morgen stehe ich um 7 Uhr auf.', 'Morgen stehe um 7 Uhr ich auf.', 'Morgen aufstehe ich um 7 Uhr.'],
    answer: 1, explanation: 'After Morgen, the conjugated verb stehe is in second position, followed by ich. The separable prefix auf goes at the end.',
  },
  {
    id: 'r1', skill: 'reading', topic: 'messages', passageId: 'birthday',
    instruction: 'Read the email and choose the correct answer.', prompt: 'Wann beginnt die Party?',
    options: ['Am Sonntag um 19 Uhr', 'Am Samstag um 9 Uhr', 'Am Freitag um 17 Uhr', 'Am Samstag um 19 Uhr'],
    answer: 3, explanation: 'The email says the birthday is on Saturday (am Samstag) and the party starts at 19 Uhr (7 pm).',
  },
  {
    id: 'r2', skill: 'reading', topic: 'messages', passageId: 'birthday',
    instruction: 'Use the same email to answer the next question.', prompt: 'Was soll Anna mitbringen?',
    options: ['Einen Salat', 'Getränke', 'Kuchen', 'Nichts'],
    answer: 0, explanation: 'Jonas asks “Kannst du bitte einen Salat mitbringen?”: “Can you please bring a salad?”.',
  },
  {
    id: 'r3', skill: 'reading', topic: 'notices', passageId: 'doctor',
    instruction: 'Read the sign. Is the statement true or false?', prompt: 'Sie können am Mittwoch um 16 Uhr zum Arzt gehen.',
    options: ['Richtig', 'Falsch'],
    answer: 1, explanation: 'Afternoon hours (15–18 Uhr) are only on Tuesday and Thursday. On Wednesday, the practice closes at noon.',
  },
  {
    id: 'r4', skill: 'reading', topic: 'notices', passageId: 'shop',
    instruction: 'Read the notice. Is the statement true or false?', prompt: 'Ab dem 18. August ist das Geschäft wieder offen.',
    options: ['Richtig', 'Falsch'],
    answer: 0, explanation: 'The shop is closed from 3 to 17 August, inclusive. “Ab dem 18. August” means it reopens from 18 August.',
  },
  {
    id: 'r5', skill: 'reading', topic: 'ads', passageId: 'courses',
    instruction: 'Choose the advertisement that meets your need.', prompt: 'Sie möchten am Wochenende Deutsch lernen. Welche Anzeige passt?',
    options: ['Anzeige A', 'Anzeige B'],
    answer: 1, explanation: 'Am Wochenende means at the weekend. Course B is on Saturdays; course A runs Monday to Friday.',
  },
]
