/**
 * Quiz Gate Component
 * Filters low-quality leads before showing CTA messenger buttons
 */

(function () {
  'use strict';

  const STORAGE_KEY = 'quiz_completed';
  const ANSWERS_KEY = 'quiz_answers';

  const QUESTIONS = [
    {
      id: 1,
      text: 'С чем вы хотели бы разобраться?',
      answers: {
        anxiety: 'Тревожность',
        panic: 'Панические атаки',
        stress: 'Стресс и выгорание',
        ocd: 'Навязчивые мысли (ОКР)',
        other: 'Другое'
      }
    },
    {
      id: 2,
      text: 'Как давно вас беспокоит эта проблема?',
      answers: {
        less_month: 'Менее месяца',
        '1_6_months': '1-6 месяцев',
        '6_12_months': '6-12 месяцев',
        more_year: 'Более года',
        several_years: 'Несколько лет'
      }
    },
    {
      id: 3,
      text: 'Обращались ли вы ранее к психологу или психотерапевту?',
      answers: {
        never: 'Нет, это будет первый раз',
        yes_no_help: 'Да, но не помогло',
        yes_positive: 'Да, был положительный опыт',
        working_now: 'Работаю сейчас с другим специалистом'
      }
    },
    {
      id: 4,
      text: 'Что для вас важнее всего в терапии?',
      answers: {
        quick_result: 'Быстрый результат',
        deep_understanding: 'Глубокое понимание проблемы',
        techniques: 'Конкретные техники и упражнения',
        support: 'Поддержка и принятие'
      }
    }
  ];

  let currentQuestion = 1;
  let answers = {};
  let startTime = null;

  // Check if quiz was already completed
  function isQuizCompleted() {
    try {
      return localStorage.getItem(STORAGE_KEY) === 'true';
    } catch (e) {
      return false;
    }
  }

  // Save quiz completion state
  function setQuizCompleted() {
    try {
      localStorage.setItem(STORAGE_KEY, 'true');
      localStorage.setItem(ANSWERS_KEY, JSON.stringify(answers));
    } catch (e) {
      console.warn('Could not save quiz state to localStorage');
    }
  }

  // Track analytics event
  function trackEvent(eventName, eventData) {
    // Google Analytics 4
    if (typeof gtag !== 'undefined') {
      gtag('event', eventName, eventData);
      console.log('GA4 event:', eventName, eventData);
    }

    // Yandex.Metrika
    if (typeof ym !== 'undefined') {
      // Try to get YM ID from page
      const ymId = window.YM_ID || document.body.dataset.ymId;
      if (ymId) {
        ym(ymId, 'reachGoal', eventName, eventData);
        console.log('YM event:', eventName, eventData);
      }
    }
  }

  // Track answer selection
  function trackAnswer(questionId, answerId, answerText) {
    const question = QUESTIONS.find(q => q.id === questionId);

    trackEvent('quiz_answer', {
      question_id: questionId,
      question_text: question ? question.text : '',
      answer_id: answerId,
      answer_text: answerText,
      step_number: questionId
    });
  }

  // Track quiz completion
  function trackCompletion() {
    const completionTime = startTime ? Math.round((Date.now() - startTime) / 1000) : 0;

    const eventData = {
      total_questions: QUESTIONS.length,
      completion_time_seconds: completionTime,
      ...answers
    };

    trackEvent('quiz_completed', eventData);
  }

  // Show specific question
  function showQuestion(questionNum) {
    const questions = document.querySelectorAll('.quiz__question');
    questions.forEach(q => {
      q.style.display = q.dataset.question === String(questionNum) ? 'block' : 'none';
    });

    // Update progress
    const progressText = document.getElementById('quiz-current');
    const progressFill = document.getElementById('quiz-progress-fill');
    const backBtn = document.getElementById('quiz-back-btn');

    if (progressText) progressText.textContent = questionNum;
    if (progressFill) progressFill.style.width = (questionNum / QUESTIONS.length * 100) + '%';
    if (backBtn) backBtn.style.display = questionNum > 1 ? 'flex' : 'none';

    currentQuestion = questionNum;
  }

  // Handle answer selection
  function handleAnswer(answerId, answerText) {
    const question = QUESTIONS.find(q => q.id === currentQuestion);
    if (!question) return;

    // Store answer
    answers['q' + currentQuestion] = answerId;

    // Track analytics
    trackAnswer(currentQuestion, answerId, answerText);

    // Move to next question or complete
    if (currentQuestion < QUESTIONS.length) {
      showQuestion(currentQuestion + 1);
    } else {
      completeQuiz();
    }
  }

  // Go back to previous question
  function goBack() {
    if (currentQuestion > 1) {
      showQuestion(currentQuestion - 1);
    }
  }

  // Complete quiz and show CTA buttons
  function completeQuiz() {
    setQuizCompleted();
    trackCompletion();
    showCTAButtons();
  }

  // Show all CTA buttons (hide quiz, show buttons)
  function showCTAButtons() {
    // Hide quiz section
    const quizSection = document.getElementById('quiz-section');
    if (quizSection) {
      quizSection.style.display = 'none';
    }

    // Show CTA buttons in cta-final section
    const ctaButtons = document.querySelector('.cta-final__buttons');
    if (ctaButtons) {
      ctaButtons.classList.remove('quiz-hidden');
      ctaButtons.classList.add('quiz-revealed');
    }

    // Show SLA text
    const slaBadge = document.querySelector('.cta-final__sla');
    if (slaBadge) {
      slaBadge.classList.remove('quiz-hidden');
      slaBadge.classList.add('quiz-revealed');
    }

    // Show guarantees
    const guarantees = document.querySelector('.cta-final__guarantees');
    if (guarantees) {
      guarantees.classList.remove('quiz-hidden');
      guarantees.classList.add('quiz-revealed');
    }

    // Show footer messenger buttons (TG/WA only)
    const footerButtons = document.querySelectorAll('.footer .social-btn--telegram, .footer .social-btn--whatsapp');
    footerButtons.forEach(btn => {
      btn.classList.remove('quiz-hidden');
      btn.classList.add('quiz-revealed');
    });
  }

  // Hide CTA buttons initially (show quiz)
  function hideCTAButtons() {
    // Show quiz section
    const quizSection = document.getElementById('quiz-section');
    if (quizSection) {
      quizSection.style.display = 'block';
    }

    // Hide CTA buttons in cta-final section
    const ctaButtons = document.querySelector('.cta-final__buttons');
    if (ctaButtons) {
      ctaButtons.classList.add('quiz-hidden');
    }

    // Hide SLA text
    const slaBadge = document.querySelector('.cta-final__sla');
    if (slaBadge) {
      slaBadge.classList.add('quiz-hidden');
    }

    // Hide guarantees
    const guarantees = document.querySelector('.cta-final__guarantees');
    if (guarantees) {
      guarantees.classList.add('quiz-hidden');
    }

    // Hide footer messenger buttons (TG/WA only, keep Instagram visible)
    const footerButtons = document.querySelectorAll('.footer .social-btn--telegram, .footer .social-btn--whatsapp');
    footerButtons.forEach(btn => {
      btn.classList.add('quiz-hidden');
    });
  }

  // Initialize quiz
  function initQuiz() {
    // If quiz already completed, show buttons immediately
    if (isQuizCompleted()) {
      const quizSection = document.getElementById('quiz-section');
      if (quizSection) {
        quizSection.style.display = 'none';
      }
      // Buttons are visible by default, no need to add classes
      console.log('Quiz already completed, showing CTA buttons');
      return;
    }

    // Start timing
    startTime = Date.now();

    // Hide CTA buttons, show quiz
    hideCTAButtons();

    // Attach click handlers to answer buttons
    const answerButtons = document.querySelectorAll('.quiz__answer');
    answerButtons.forEach(btn => {
      btn.addEventListener('click', function() {
        const answerId = this.dataset.answer;
        const answerText = this.textContent.trim();
        handleAnswer(answerId, answerText);
      });
    });

    // Attach back button handler
    const backBtn = document.getElementById('quiz-back-btn');
    if (backBtn) {
      backBtn.addEventListener('click', goBack);
    }

    console.log('Quiz initialized');
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initQuiz);
  } else {
    initQuiz();
  }

  // Expose for testing/debugging
  window.quizGate = {
    reset: function() {
      try {
        localStorage.removeItem(STORAGE_KEY);
        localStorage.removeItem(ANSWERS_KEY);
        location.reload();
      } catch (e) {
        console.warn('Could not reset quiz state');
      }
    },
    getAnswers: function() {
      try {
        return JSON.parse(localStorage.getItem(ANSWERS_KEY) || '{}');
      } catch (e) {
        return {};
      }
    }
  };
})();
