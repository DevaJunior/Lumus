export const questions = [
  { id: 'main_reason', text: 'Qual o principal motivo que te trouxe à terapia?', type: 'textarea' },
  { id: 'mood_level', text: 'Numa escala de 1 a 10, como você avalia seu humor na última semana?', type: 'number', min: 1, max: 10 },
  { id: 'symptoms', text: 'Você tem experienciado ansiedade, estresse ou desânimo com frequência?', type: 'radio', options: ['Sim', 'Não', 'Às vezes'] },
  { id: 'previous_therapy', text: 'Você já fez terapia antes?', type: 'radio', options: ['Sim', 'Não'] },
  { id: 'expectations', text: 'O que você espera alcançar com a terapia?', type: 'textarea' },
];