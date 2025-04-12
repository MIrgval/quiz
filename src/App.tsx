import { useState } from "react";
import { questions, Category } from "./data";
import "./App.css";

function App() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  const initialScores: Record<Category, number> = {
    "человек-природа": 0,
    "человек-техника": 0,
    "человек-человек": 0,
    "человек-знаковые системы": 0,
    "человек-художественный образ": 0,
  };
  const [scores, setScores] = useState<Record<Category, number>>(initialScores);
  const [showResult, setShowResult] = useState(false);

  // При выборе ответа
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
    }
  };

  // Сброс
  const handleRestart = () => {
    setCurrentQuestionIndex(0);
    setScores(initialScores);
    setShowResult(false);
  };

  // Категории с максимальным баллом
  const getTopCategories = (): Category[] => {
    const maxScore = Math.max(...Object.values(scores));
    return (Object.entries(scores) as [Category, number][])
      .filter(([_, value]) => value === maxScore)
      .map(([cat]) => cat);
  };

  if (showResult) {
    const topCategories = getTopCategories();
    return (
      <div className="container">
        <img src="/zzz.png" alt="logo" className="top-right-image" />

        {/* Два зафиксированных заголовка */}
        <h1 className="page-title">Тест: Профориентация</h1>
        <h2 className="subtitle">Что бы Вы предпочли?</h2>

        <div className="main-content">
          <h2>Результат теста</h2>
          {topCategories.length === 1 ? (
            <p>
              Ваша основная склонность: <strong>{topCategories[0]}</strong>
            </p>
          ) : (
            <p>
              У вас несколько одинаково выраженных склонностей:{" "}
              <strong>{topCategories.join(", ")}</strong>
            </p>
          )}
        </div>

        <button className="restart-button" onClick={handleRestart}>
          Пройти заново
        </button>

        <footer className="footer">
          <p>Вопросов в тесте: {questions.length}</p>
        </footer>
      </div>
    );
  }

  // Если тест ещё идёт
  const currentQuestion = questions[currentQuestionIndex];
  return (
    <div className="container">
      <img src="/zzz.png" alt="logo" className="top-right-image" />

      {/* Два зафиксированных заголовка */}
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
