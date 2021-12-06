const title = 'மாயம்';
const slug = title.replaceAll(' ', '-');
const date = new Date('2012-04-20').toLocaleDateString('en-gb');

const poem = `
கூடி கூடி
நாம் பேசும்
கொஞ்ச கொஞ்ச
நேரங்களிலும்
குட்டி குட்டி
இடைவெளிகள் !

அதையும்
நிரப்பி விடுகின்றன
விட்டு விட்டு
பேசித் துடிக்கும் - நம்
சின்ன சின்ன
இதயங்கள் ...!

      - பெரமு
`;

export { title, slug, date, poem };
