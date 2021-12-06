const title = 'அவள் ஒரு விடுகதை';
const slug = title.replaceAll(' ', '-');
const date = new Date('2012-05-03').toLocaleDateString('en-gb');

const poem = `
அவள் பெயரோடு
அவன் பெயர் சேரும்போது
அவர்களுக்கு திருமண நாள் !
அவன் பெயரோடு
அவள் பெயர் சேரும்போது
அவனுக்கு பிறந்தநாள் !

'ஜெயம்' பாடும் - அவன்
வெற்றியின் களைப்பை
இளைப்பாற்றும் அவள் ஓர்
இளவெயில் 'அந்தி' !

அவன் அந்த அந்தியை
சந்தித்தான் !
அன்றொரு அந்தியில்
சந்தித்தான் !
அவளோ "அத்தான் !
வெல்க - உன்
பிரேமம்தான்" என
நறுமுகை
சிந்திப் போனாள் !
`;

export { title, slug, date, poem };
