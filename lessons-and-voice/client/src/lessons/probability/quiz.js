export default [
  { q: { en: 'An MCQ has 5 options and you guess blindly. What is your chance of being right?', ta: 'ஒரு MCQ-ல 5 options. Blind-ஆ guess பண்ணா, சரியா வர chance எவ்வளவு?' },
    o: ['1/4 = 25%', '1/5 = 20%', '1/2 = 50%', '5%'], a: 1,
    e: { en: 'One right answer out of 5: 1/5 = 20%.', ta: '5-ல 1 தான் சரி: 1/5 = 20%.' } },
  { q: { en: 'You roll two dice. Which sum is most likely?', ta: 'ரெண்டு dice உருட்டுறீங்க. எந்த sum அதிகமா வரும்?' },
    o: ['2', '7', '12', 'All sums are equally likely'], a: 1,
    e: { en: '7 can be made in 6 ways out of 36. 2 and 12 have only 1 way each.', ta: '7-ஐ 36-ல 6 வழிகள்ல உருவாக்கலாம். 2, 12-க்கு ஒரே ஒரு வழி தான்.' } },
  { q: { en: 'Which of these can never be a probability?', ta: 'இதுல எது probability-ஆ இருக்கவே முடியாது?' },
    o: ['0', '0.5', '1', '1.2'], a: 3,
    e: { en: 'Probability is always between 0 (impossible) and 1 (certain).', ta: 'Probability எப்பவும் 0 (நடக்காது) முதல் 1 (கண்டிப்பா நடக்கும்) வரைக்கும் தான்.' } },
  { q: { en: 'Why does a bank lock your account after 3 wrong OTP attempts?', ta: '3 தடவை தப்பான OTP போட்டா bank ஏன் account-ஐ lock பண்ணுது?' },
    o: ['To save electricity', 'To keep a thief\'s chance tiny: 3 in 10 lakh', 'Because OTPs expire anyway', 'Because 3 is lucky'], a: 1,
    e: { en: 'With 10 lakh possible OTPs, 3 guesses give only a 3 in 10 lakh chance. Unlimited guesses would eventually succeed.', ta: '10 லட்சம் OTP-ல 3 guess-க்கு chance 10 லட்சத்துல 3 தான். Limit இல்லன்னா கடைசியில கண்டுபிடிச்சிடுவாங்க.' } },
];
