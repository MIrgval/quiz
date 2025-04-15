import { useState } from "react";
import { questions, Category } from "./data";
import "./App.css";
import zzz from "./assets/zzz.png";

function App() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [started, setStarted] = useState(false);

  const [userData, setUserData] = useState({
    surname: "",
    name: "",
    email: "",
    role: "Школьник",
  });

  const initialScores: Record<Category, number> = {
    "человек-природа": 0,
    "человек-техника": 0,
    "человек-человек": 0,
    "человек-знаковые системы": 0,
    "человек-художественный образ": 0,
  };
  const [scores, setScores] = useState(initialScores);

  const handleStart = () => {
    if (userData.surname && userData.name && userData.email) {
      setStarted(true);
    } else {
      alert("Пожалуйста, заполните все поля.");
    }
  };

  const handleAnswer = (category: Category) => {
    setScores((prev) => ({
      ...prev,
      [category]: prev[category] + 1,
    }));

    const nextIndex = currentQuestionIndex + 1;
    if (nextIndex < questions.length) {
      setCurrentQuestionIndex(nextIndex);
    } else {
      setShowResult(true);
      sendResultToGoogleSheet();
    }
  };

  const handleRestart = () => {
    setStarted(false);
    setCurrentQuestionIndex(0);
    setScores(initialScores);
    setShowResult(false);
  };

  const getTopCategories = (): Category[] => {
    const maxScore = Math.max(...Object.values(scores));
    return (Object.entries(scores) as [Category, number][])
      .filter(([_, value]) => value === maxScore)
      .map(([cat]) => cat);
  };

  const sendResultToGoogleSheet = () => {
    const result = getTopCategories().join(", ");
    const payload = {
      ...userData,
      result,
    };

    fetch("https://script.google.com/macros/s/AKfycbzWls675Q1maJmuRsEarwp-ARmgcDeIAWxbTsuc-vcc-VEm6b2_uI9WYcmu0vqOsnun/exec", {
      method: "POST",
      body: JSON.stringify(payload),
      headers: {
        "Content-Type": "application/json",
      },
    }).catch((err) => console.error("Ошибка отправки:", err));
  };

  if (!started) {
    return (
      <div className="container">
        <img src={zzz} alt="logo" className="top-right-image" />
        <h1 className="form-title">Тест: Профориентация</h1>
        <h2 className="form-subtitle">Перед началом заполните данные</h2>

        <div className="main-content">
          <div className="form-group">
            <label>Фамилия:</label>
            <input
              placeholder="Фамилия"
              value={userData.surname}
              onChange={(e) => setUserData({ ...userData, surname: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label>Имя:</label>
            <input
              placeholder="Имя"
              value={userData.name}
              onChange={(e) => setUserData({ ...userData, name: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label>Email:</label>
            <input
              placeholder="Email"
              type="email"
              value={userData.email}
              onChange={(e) => setUserData({ ...userData, email: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label>Кто вы:</label>
            <select
              value={userData.role}
              onChange={(e) => setUserData({ ...userData, role: e.target.value })}
            >
              <option>Школьник</option>
              <option>Студент</option>
              <option>Абитуриент</option>
              <option>Выпускник</option>
              <option>Человек</option>
            </select>
          </div>

          <button onClick={handleStart}>Начать тест</button>
        </div>
      </div>
    );
  }

  if (showResult) {
    const topCategories = getTopCategories();
    return (
      <div className="container">
        <img src={zzz} alt="logo" className="top-right-image" />
        <h1 className="page-title">Тест: Профориентация</h1>
        <h2 className="subtitle">Результат теста</h2>

        <div className="main-content">
          <p>
            {topCategories.length === 1
              ? `Ваша основная склонность: ${topCategories[0]}`
              : `У вас несколько склонностей: ${topCategories.join(", ")}`}
          </p>
        </div>

        <button className="restart-button" onClick={handleRestart}>
          Пройти заново
        </button>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  return (
    <div className="container">
      <img src={zzz} alt="logo" className="top-right-image" />
      <h1 className="page-title">Тест: Профориентация</h1>
      <h2 className="subtitle">Что бы Вы предпочли?</h2>

      <div className="main-content">
        <div className="buttons-container">
          {currentQuestion.answers.map((answer, i) => (
            <button key={i} onClick={() => handleAnswer(answer.category)}>
              {answer.text}
            </button>
          ))}
        </div>
      </div>

      <footer className="footer">
        <p>
          Вопрос {currentQuestionIndex + 1} из {questions.length}
        </p>
      </footer>
    </div>
  );
}

export default App;
