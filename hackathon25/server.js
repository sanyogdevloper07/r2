const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

const scores = {};

// Flags securely stored on server by challenge index
const FLAGS = {
  0: "flag{win_win_win}",
  1: "flag{soooo_hard}",
  2: "flag{tr1ck_1s_0ve4}",
  3: "flag{brisk_4ey}",
  4: "flag{so_thats_what_those_files_are_for__adec60bd}"
};

// Hints securely stored on server by challenge index
const HINTS = [
  "The script is searching for a silent partner; scrutinize every file access and dependency. A keen eye on the filesystem will reveal the missing piece.",
  "I heard the browser allows you configure the website's code???, AND HEY look for what's behind the image retrieved",
  "The container has more than it shows. The lock expects a key that's already in your hands - just not in the right shape.",
  "the audio reveals a key to decode a cipher text, have a through around 'ciphertext with key'. ",
  "here's some direct info- some files lead you to a wrong flag, so don't get excited so early<br>a source told me the message you seek lies in a bunch of images somewhere."
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
