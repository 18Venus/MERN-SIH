import React, { useEffect, useState } from 'react';

const DetailedResult = ({ scores }) => {
  const [percentage, setPercentage] = useState([]);
  const meters = ['Depresso-Meter', 'PSTD-meter', 'Anxiety-meter', 'Bipolar-meter', 'OCD-meter', 'Schizophrenia-meter'];
  const [colors, setColors] = useState([]);
  const [tipsIndex, setTipsIndex] = useState([]);

  useEffect(() => {
    if (scores) {
      const { score1, score2, score3, score4, score5, score6 } = scores;
      const finalScore = score1 + score2 + score3 + score4 + score5 + score6;

      document.querySelector('.score').innerHTML = `Your Final Score is ${finalScore}`;

      const totalscoresEach = [50, 50, 30, 40, 40, 30];
      const safeScores = [22, 22, 15, 18, 18, 15];

      const newTipsIndex = [];
      newTipsIndex[0] = score1 < safeScores[0] ? 0 : 6;
      newTipsIndex[1] = score2 < safeScores[1] ? 1 : 6;
      newTipsIndex[2] = score3 < safeScores[2] ? 2 : 6;
      newTipsIndex[3] = score4 < safeScores[3] ? 3 : 6;
      newTipsIndex[4] = score5 < safeScores[4] ? 4 : 6;
      newTipsIndex[5] = score6 < safeScores[5] ? 5 : 6;

      setTipsIndex(newTipsIndex);

      const newPercentage = [];
      const newColors = [];
      const calculatePercentage = (score, total) => 100 - ((score / total) * 100);

      [score1, score2, score3, score4, score5, score6].forEach((score, i) => {
        newPercentage[i] = calculatePercentage(score, totalscoresEach[i]);
        newColors[i] = newPercentage[i] < 40 ? '#FEF08A' : newPercentage[i] < 65 ? '#4ADE80' : '#EF4444';
      });

      setColors(newColors);
      setPercentage(newPercentage);

      console.log("colors:", colors[1])

      const finalSafeScore = 90;
      const tipf = '.tipf';

      if (finalScore < finalSafeScore) {
        document.querySelector(tipf).innerHTML = '<h3>We highly recommend you to visit a nearby healthcare centre.</h3>';
      } else if (finalScore < 150) {
        document.querySelector(tipf).innerHTML = '<h3>You may visit a nearby healthcare centre if you don\'t see improvement with other tips.</h3>';
      } else {
        document.querySelector(tipf).innerHTML = '<h3>You can have a look, but don\'t worry, you don\'t need to.</h3>';
      }
    }
  }, [scores]);

  const getTipText = (index) => {
    switch (index) {
      case 0:
        return "Spend time in nature. Research shows that being in nature can make us feel happier, feel our lives are more worthwhile, and reduce our levels of depression.";
      case 1:
        return "Considering the challenges you are facing, it might be helpful to speak with a professional, like a doctor or therapist, who specializes in dealing with trauma and PTSD.";
      case 2:
        return "Try to learn more about your fear or anxiety. Keep an anxiety diary to note down how you're feeling, what causes you to feel anxious, and what happens.";
      case 3:
        return "Keep a record of your moods to help you understand your mood swings. Cognitive Behavioural Therapy (CBT) can help you recognize how your feelings, thoughts, and behavior influence each other and build strategies to change these patterns.";
      case 4:
        return "We all have worries and anxieties at times and may have mild compulsions. However, if your thoughts or compulsions seem excessive, cause you distress, or affect your ability to carry out your daily life, it's important to ask for help.";
      case 5:
        return "It's advisable to reach out to a professional while dealing with schizophrenia. Schizophrenia is often treated with a combination of talking therapy and medication.";
      case 6:
        return "You are doing great here! Keep Up the good work!!";
      default:
        return "";
    }
  };

  return (
    <div className="mt-8">
      <div className="mt-8 text-3xl font-bold mb-2">
        Your Results!
      </div>

      <div className="score mt-8 font-bold mb-5">Your Final Score is </div>

      <h2 className="mt-8 text-3xl font-bold mb-10">Your Current Meters</h2>
      <div className="mt-5 main grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[0, 1, 2, 3, 4, 5].map((index) => (
          <div className="flex flex-col items-center" key={index}>
            <p className="font-bold mb-3">{meters[index]}</p>
            <div className="relative h-12 w-64 bg-gray-200 rounded-lg overflow-hidden">
              <div
                className={`absolute left-0 h-full ${colors[index] === '#FEF08A' ? 'bg-yellow-200' : colors[index] === '#4ADE80' ? 'bg-green-400' : 'bg-red-500'}`}
                style={{ width: `${percentage[index]}%` }}
              ></div>

            </div>
            <p className="mt-2">{getTipText(tipsIndex[index])}</p>
          </div>
        ))}
      </div>

      <div className="special">
        <h2 className="mt-8 text-xl font-bold"> <span className="tipf"></span></h2>
      </div>

      <h2 className="mt-8 text-3xl font-bold">Start Here - Ways you can look after yourself</h2>
      <div className="mt-5 main grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="border-2 border-black bg-gradient-to-b from-yellow-200 to-yellow-300 rounded-lg p-4">
          <p>Talk about how you're feeling and what's making you anxious. Just being heard and understood may make you feel better. You can open up to a friend or you can...</p>
          <div className="mt-4">
            <p className="font-bold">Write What's In Your Mind</p>
            <a href="journal.html">
              <button type="button" className="bg-white border-2 border-gray-400 px-4 py-2 rounded-lg">
                Journal
              </button>
            </a>
            <p className="mt-2 font-bold">Letting it all out is the best therapy</p>
          </div>
        </div>
        <div className="border-2 border-black bg-gradient-to-b from-yellow-200 to-yellow-300 rounded-lg p-4">
          <p>Look after your physical health. Eating well, staying physically active, avoiding cigarettes and alcohol and getting enough sleep can also help you manage anxiety better.</p>
          <div className="mt-4">
            <p className="font-bold">Manage your day better with this</p>
            <a href="todo.html">
              <button type="button" className="bg-white border-2 border-gray-400 px-4 py-2 rounded-lg">
                To-Do
              </button>
            </a>
            <p className="mt-2 font-bold">Having a well-managed day is the first step to good mental health</p>
          </div>
        </div>
        <div className="border-2 border-black bg-gradient-to-b from-yellow-200 to-yellow-300 rounded-lg p-4">
          <div className="mt-4">
            <p>Think of your sleep cycle as a caring guardian for your mind. Just like a friend who helps you stay emotionally resilient and focused.</p>
            <a href="https://www.sleepfoundation.org/insomnia">
              <button type="button" className="bg-white border-2 border-gray-400 px-4 py-2 rounded-lg">
                Get Help
              </button>
            </a>
            <p className="mt-2 font-bold">Get Tips On Your Sleep Cycle</p>
          </div>
        </div>
        <div className="border-2 border-black bg-gradient-to-b from-yellow-200 to-yellow-300 rounded-lg p-4">
          <div className="mt-4">
            <p>Manage Your Time</p>
            <a href="calender.html">
              <button type="button" className="bg-white border-2 border-gray-400 px-4 py-2 rounded-lg">
                Calender
              </button>
            </a>
            <p className="mt-2 font-bold">Anxiety is often linked to feeling out of control or overwhelmed</p>
          </div>
        </div>
        <div className="border-2 border-black bg-gradient-to-b from-yellow-200 to-yellow-300 rounded-lg p-4">
          <div className="mt-4">
            <p>Support from family and friends can be a lifeline in tough times, helping to lift your spirits and provide a sense of belonging.</p>
            <a href="https://www.supportgroupscentral.com/">
              <button type="button" className="bg-white border-2 border-gray-400 px-4 py-2 rounded-lg">
                Get Help
              </button>
            </a>
            <p className="mt-2 font-bold">Seek support from a professional to gain new perspectives.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailedResult;
