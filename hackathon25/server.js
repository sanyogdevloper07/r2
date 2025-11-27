const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

const scores = {};

// Flags securely stored on server by challenge index
const FLAGS = {
  0: "flag{d3crypt1ng1sfUn}",
  1: "flag{xxxx}",
  2: "flag{john_your_buddy}",
  3: "flag{delightful_victory}",
  4: "flag{onethis_is_on_imma_make_a_to_obfuscate}",
  5: "flag{flags_are_adorable222}",
  6: "ctf{heyo}",
  7: "flag{safqdehnbrco}",
  8: "ctf{client_side_authentication_is_always_a_bad_idea}",
  9: "flag{yes_the_dino_swims}",
  10: "flag{7g8h9i}",
  11: "byuctf{yes_yes_it_is_a_qr_code_q56rtikb}",
  12: "ctf{He's beginning to believe!}",
  13: "ctf{me160879ro}",
  14: "flag{vigenere_donendusted}"
};

// Hints securely stored on server by challenge index
const HINTS = [
  "Ever thought how ships used to share signals in earlier times.",
  "You may wanna focus on the question.",
  "Did you pay attention on the file name and the question?",
  "Have u ever seen the source code??",
  "Its all in the name of the file",
  "Is it encrypted TWICE maybe THRICEEEEEE?!!?!",
  "JACKTHERIPPER",
  "Consider how each letter might be used to spell out something in a specific order.",
  "The JavaScript code may be tampered, look closely!",
  "Images are known for hiding valuable piece of information. This can be done through various techniques.",
  "CHECKSOME",
  "all u need is a text editor(notnotepad) and ctrl+f",
  "Read the code and check line 104 PROPERLY (#)",
  "USE ROCKYOU.txt",
  'What could be the "KEY" you need to decode this message?'
];

// Serve main.html by default
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'main.html'));
});

// Register Team Name
app.post('/register-team', (req, res) => {
  const { teamName } = req.body;
  if (!teamName) return res.status(400).json({ message: "Team name required" });

  if (!scores[teamName]) scores[teamName] = 0;
  res.json({ message: "Team registered", score: scores[teamName] });
});

// Fetch Scores for Scorecard
app.get('/scorecard/data', (req, res) => {
  res.json(scores);
});

// Manually Update Score (Add/Deduct Points)
app.post('/scorecard/update', (req, res) => {
  const { teamName, points } = req.body;
  if (!scores[teamName]) scores[teamName] = 0;

  scores[teamName] += points;
  res.status(200).send('Score updated');
});

// Submit flag for validation
app.post('/submit-flag', (req, res) => {
  const { teamName, challengeIndex, flag } = req.body;

  if (!teamName || challengeIndex === undefined || !flag) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  const correctFlag = FLAGS[challengeIndex];
  if (!correctFlag) {
    return res.status(400).json({ message: "Invalid challenge" });
  }

  if (flag === correctFlag) {
    if (!scores[teamName]) scores[teamName] = 0;
    scores[teamName] += 30; // Add fixed points for challenge
    return res.json({ message: "Correct flag!", score: scores[teamName] });
  } else {
    return res.json({ message: "Wrong flag, try again." });
  }
});

// Serve hints for given challenge index
app.get('/hints/:challengeIndex', (req, res) => {
  const idx = parseInt(req.params.challengeIndex);
  if (isNaN(idx) || idx < 0 || idx >= HINTS.length) {
    return res.status(400).json({ error: 'Invalid challenge index' });
  }
  res.json({ hint: HINTS[idx] });
});

app.listen(port, '0.0.0.0', () => {
  console.log(`Server running on http://localhost:${port}`);
});
