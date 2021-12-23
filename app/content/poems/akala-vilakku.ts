const title = 'அகலா விளக்கு';
const slug = 'akala-vilakku';
const date = new Date('2021-04-04').toLocaleDateString('en-gb');

const poem = `
நெஞ்சம்
சுடர்விட ஏங்கும்
நெய் இழையிட்ட
அகல் விளக்கு!

‘பொறி’யென
கண்கள்
உரசி பற்றிக்
கொண்டதும்
இணை நெஞ்சங்கள்
வேண்டுவது
அன்பெனும்
அகலா விளக்கு!
    - பெரமு
`;

const audioURL = `/audios/${slug}.webm`;
const mp3AudioURL = `/audios/mp3/${slug}.mp3`;

export { title, slug, date, poem, audioURL, mp3AudioURL };
