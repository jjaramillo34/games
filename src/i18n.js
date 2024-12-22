import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: {
          // Navigation
          gameMenu: "Game Menu",
          games: "Games",
          lightMode: "Light Mode",
          darkMode: "Dark Mode",

          // Game Names
          ticTacToe: "Tic-Tac-Toe",
          fizzBuzz: "FizzBuzz",
          hangman: "Hangman",
          highLowCardGame: "High-Low Card Game",
          memoryGame: "Memory Game",

          // Home Page
          welcome: "Welcome to the Game Collection",
          chooseGame: "Choose a game to play",

          // Common Actions
          play: "Play",
          start: "Start",
          restart: "Restart",
          back: "Back",
          playAgain: "Play Again",
          submit: "Submit",
          endGame: "End Game",

          // Game States
          win: "Win",
          lose: "Lose",
          draw: "Draw",
          yourTurn: "Your Turn",
          gameOver:
            "Game Over! Final Score: {{score}} | High Score: {{highScore}}",
          correct: "Correct!",
          incorrect: "Incorrect! The answer was: {{correct}}",

          // Difficulty Levels
          easy: "Easy",
          medium: "Medium",
          hard: "Hard",
          selectDifficulty: "Select Difficulty",

          // Game Modes
          selectGameMode: "Select Game Mode",
          practiceMode: "Practice Mode",
          challengeMode: "Challenge Mode",
          timeAttackMode: "Time Attack Mode",

          // FizzBuzz Specific
          enterNumber: "Enter a number",
          enterAnswer: "Enter your answer (Fizz, Buzz, or FizzBuzz)",
          enterValidNumber: "Please enter a valid number",
          score: "Score",
          streak: "Streak",
          time: "Time",
          history: "History",
          historyEntry:
            "Number {{number}}: You answered {{answer}}, correct answer was {{correct}}",
          showRules: "Show Rules",
          hideRules: "Hide Rules",
          rules: "Rules",
          rule1: "If a number is divisible by 3, answer 'Fizz'",
          rule2: "If a number is divisible by 5, answer 'Buzz'",
          rule3: "If a number is divisible by both 3 and 5, answer 'FizzBuzz'",
          rule4: "Otherwise, just say the number",

          // Footer
          createdBy: "Created by",
          allRightsReserved: "All rights reserved",

          // High-Low Card Game
          highLowGame: {
            title: "High-Low Card Game",
            rules: {
              title: "How to Play",
              show: "Show Rules",
              hide: "Hide Rules",
              list: {
                guess: "Guess if the next card will be higher or lower",
                faceCards: "Face cards: J=11, Q=12, K=13, A=14",
                streak: "Build the longest streak possible!",
              },
            },
            stats: {
              streak: "Streak",
              best: "Best",
              wins: "Wins",
              losses: "Losses",
            },
            cards: {
              previous: "Previous",
              current: "Current",
            },
            actions: {
              higher: "Higher ↑",
              lower: "Lower ↓",
              newRound: "New Round",
            },
            messages: {
              correct: "Correct! Keep going!",
              wrong: "Wrong guess! Try again!",
              gameOver: "Game Over!",
              youWon: "You won!",
            },
            modes: {
              title: "Game Mode",
              classic: "Classic",
              timeAttack: "Time Attack",
              targetScore: "Target Score",
            },
            difficulty: {
              title: "Difficulty",
              easy: "Easy",
              medium: "Medium",
              hard: "Hard",
            },
            leaderboard: {
              title: "Leaderboard",
              noRecords: "No records yet",
            },
          },

          // Memory Game
          memoryGame: {
            title: "Memory Game",
            stats: {
              turns: "Turns",
              pairs: "Pairs Found",
              timeElapsed: "Time",
              bestScore: "Best Score",
              level: "Level",
            },
            difficulty: {
              title: "Select Difficulty",
              easy: "Easy (4x4)",
              medium: "Medium (6x6)",
              hard: "Hard (8x8)",
            },
            actions: {
              reset: "Reset Game",
              newGame: "New Game",
              pause: "Pause",
              resume: "Resume",
            },
            messages: {
              start: "Click any card to start",
              paused: "Game Paused",
              complete: "Congratulations! You've completed the level!",
              newHighScore: "New High Score!",
              matchFound: "Match found!",
              tryAgain: "Try again!",
            },
            themes: {
              title: "Select Theme",
              emojis: "Emojis",
              animals: "Animals",
              fruits: "Fruits",
              space: "Space",
            },
          },
        },
      },
      es: {
        translation: {
          // Navegación
          gameMenu: "Menú de Juegos",
          games: "Juegos",
          lightMode: "Modo Claro",
          darkMode: "Modo Oscuro",

          // Nombres de Juegos
          ticTacToe: "Tres en Línea",
          fizzBuzz: "FizzBuzz",
          hangman: "Ahorcado",
          highLowCardGame: "Juego de Cartas Alto-Bajo",
          memoryGame: "Juego de Memoria",

          // Página de Inicio
          welcome: "Bienvenido a la Colección de Juegos",
          chooseGame: "Elige un juego para jugar",

          // Acciones Comunes
          play: "Jugar",
          start: "Comenzar",
          restart: "Reiniciar",
          back: "Volver",
          playAgain: "Jugar de Nuevo",
          submit: "Enviar",
          endGame: "Terminar Juego",

          // Estados del Juego
          win: "Victoria",
          lose: "Derrota",
          draw: "Empate",
          yourTurn: "Tu Turno",
          gameOver:
            "¡Juego Terminado! Puntuación Final: {{score}} | Mejor Puntuación: {{highScore}}",
          correct: "¡Correcto!",
          incorrect: "¡Incorrecto! La respuesta era: {{correct}}",

          // Niveles de Dificultad
          easy: "Fácil",
          medium: "Medio",
          hard: "Difícil",
          selectDifficulty: "Seleccionar Dificultad",

          // Modos de Juego
          selectGameMode: "Seleccionar Modo de Juego",
          practiceMode: "Modo Práctica",
          challengeMode: "Modo Desafío",
          timeAttackMode: "Modo Contrarreloj",

          // Específico de FizzBuzz
          enterNumber: "Ingresa un número",
          enterAnswer: "Ingresa tu respuesta (Fizz, Buzz, o FizzBuzz)",
          enterValidNumber: "Por favor ingresa un número válido",
          score: "Puntuación",
          streak: "Racha",
          time: "Tiempo",
          history: "Historial",
          historyEntry:
            "Número {{number}}: Respondiste {{answer}}, la respuesta correcta era {{correct}}",
          showRules: "Mostrar Reglas",
          hideRules: "Ocultar Reglas",
          rules: "Reglas",
          rule1: "Si un número es divisible por 3, responde 'Fizz'",
          rule2: "Si un número es divisible por 5, responde 'Buzz'",
          rule3: "Si un número es divisible por 3 y 5, responde 'FizzBuzz'",
          rule4: "De lo contrario, solo di el número",

          // Pie de Página
          createdBy: "Creado por",
          allRightsReserved: "Todos los derechos reservados",

          // Juego de Cartas Alto-Bajo
          highLowGame: {
            title: "Juego de Cartas Alto-Bajo",
            rules: {
              title: "Cómo Jugar",
              show: "Mostrar Reglas",
              hide: "Ocultar Reglas",
              list: {
                guess: "Adivina si la siguiente carta será más alta o más baja",
                faceCards: "Cartas de figura: J=11, Q=12, K=13, A=14",
                streak: "¡Construye la racha más larga posible!",
              },
            },
            stats: {
              streak: "Racha",
              best: "Mejor",
              wins: "Victorias",
              losses: "Derrotas",
            },
            cards: {
              previous: "Anterior",
              current: "Actual",
            },
            actions: {
              higher: "Más Alta ↑",
              lower: "Más Baja ↓",
              newRound: "Nueva Ronda",
            },
            messages: {
              correct: "¡Correcto! ¡Sigue así!",
              wrong: "¡Incorrecto! ¡Inténtalo de nuevo!",
              gameOver: "¡Juego Terminado!",
              youWon: "¡Has Ganado!",
            },
            modes: {
              title: "Modo de Juego",
              classic: "Cl��sico",
              timeAttack: "Contrarreloj",
              targetScore: "Puntuación Objetivo",
            },
            difficulty: {
              title: "Dificultad",
              easy: "Fácil",
              medium: "Medio",
              hard: "Difícil",
            },
            leaderboard: {
              title: "Tabla de Clasificación",
              noRecords: "Aún no hay registros",
            },
          },

          // Juego de Memoria
          memoryGame: {
            title: "Juego de Memoria",
            stats: {
              turns: "Turnos",
              pairs: "Pares Encontrados",
              timeElapsed: "Tiempo",
              bestScore: "Mejor Puntuación",
              level: "Nivel",
            },
            difficulty: {
              title: "Seleccionar Dificultad",
              easy: "Fácil (4x4)",
              medium: "Medio (6x6)",
              hard: "Difícil (8x8)",
            },
            actions: {
              reset: "Reiniciar Juego",
              newGame: "Nuevo Juego",
              pause: "Pausar",
              resume: "Continuar",
            },
            messages: {
              start: "Haz clic en cualquier carta para comenzar",
              paused: "Juego Pausado",
              complete: "¡Felicitaciones! ¡Has completado el nivel!",
              newHighScore: "¡Nueva Mejor Puntuación!",
              matchFound: "¡Par encontrado!",
              tryAgain: "¡Inténtalo de nuevo!",
            },
            themes: {
              title: "Seleccionar Tema",
              emojis: "Emojis",
              animals: "Animales",
              fruits: "Frutas",
              space: "Espacio",
            },
          },
        },
      },
    },
    fallbackLng: "en",
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
