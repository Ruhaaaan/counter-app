import React, { useState, useEffect, useRef,  useCallback } from 'react';
import Confetti from 'react-confetti';
import useSound from 'use-sound';
import { Particles } from "@tsparticles/react";
import { Engine } from "@tsparticles/engine";
import { loadSlim } from "@tsparticles/slim"; // lighter bundle than loadFull
import clickSound from './sounds/click.mp3';
import resetSound from './sounds/reset.mp3';
import celebrationSound from './sounds/celebration.mp3';

function App() {
  const [count, setCount] = useState(0);
  const [step, setStep] = useState(1);
  const [history, setHistory] = useState([]);
  const [isBouncing, setIsBouncing] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showParticles, setShowParticles] = useState(false);
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  const counterRef = useRef(null);

  // Sound effects
  const [playClick] = useSound(clickSound, { volume: 0.5 });
  const [playReset] = useSound(resetSound, { volume: 0.5 });
  const [playCelebration] = useSound(celebrationSound, { volume: 0.3 });

  // Dynamic color with better contrast
  const getColor = () => {
    if (count > 0) return darkMode ? '#81C784' : '#4CAF50';
    if (count < 0) return darkMode ? '#E57373' : '#F44336';
    return darkMode ? '#64B5F6' : '#2196F3';
  };

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Check for milestones and large changes
  useEffect(() => {
    if (history.length > 0) {
      const lastEntry = history[history.length - 1];
      const change = Math.abs(parseInt(lastEntry.split(':')[1]) - count);
      
      // Bounce effect for large changes (>50)
      if (change >= 50) {
        setIsBouncing(true);
        setTimeout(() => setIsBouncing(false), 1000);
      }

      // Special effects for milestones
      if (count !== 0 && count % 100 === 0) {
        setShowConfetti(true);
        setShowParticles(true);
        playCelebration();
        setTimeout(() => {
          setShowConfetti(false);
          setShowParticles(false);
        }, 5000);
      }
    }
  }, [count, history, playCelebration]);

  const increment = () => {
    const newCount = count + step;
    setCount(newCount);
    setHistory([...history, `Incremented by ${step}: ${newCount.toLocaleString()}`]);
    playClick();
  };

  const decrement = () => {
    const newCount = count - step;
    setCount(newCount);
    setHistory([...history, `Decremented by ${step}: ${newCount.toLocaleString()}`]);
    playClick();
  };

  const reset = () => {
    setCount(0);
    setHistory([...history, `Reset from ${count.toLocaleString()} to 0`]);
    playReset();
  };

    // Particles init function - ADD THIS
  const particlesInit = useCallback(async (engine: Engine) => {
    await loadSlim(engine); // or loadFull if you need more features
  }, []);

  // Theme styles
  const themeStyles = {
    backgroundColor: darkMode ? '#121212' : '#f5f5f5',
    color: darkMode ? '#ffffff' : '#333333',
    cardBackground: darkMode ? '#1E1E1E' : '#ffffff',
    cardShadow: darkMode ? '0 10px 20px rgba(0,0,0,0.3)' : '0 10px 20px rgba(0,0,0,0.1)',
    historyBorder: darkMode ? '#333' : '#eee',
    inputBackground: darkMode ? '#333' : '#fff',
    inputBorder: darkMode ? '#444' : '#ddd',
    historyText: darkMode ? '#aaa' : '#555',
  };

  // Particle configuration
  const particlesConfig = {
    particles: {
      number: {
        value: 80,
        density: {
          enable: true,
          value_area: 800
        }
      },
      color: {
        value: getColor()
      },
      shape: {
        type: 'circle',
        stroke: {
          width: 0,
          color: '#000000'
        },
      },
      opacity: {
        value: 0.5,
        random: true,
        anim: {
          enable: true,
          speed: 1,
          opacity_min: 0.1,
          sync: false
        }
      },
      size: {
        value: 5,
        random: true,
        anim: {
          enable: true,
          speed: 2,
          size_min: 0.1,
          sync: false
        }
      },
      line_linked: {
        enable: false
      },
      move: {
        enable: true,
        speed: 3,
        direction: 'none',
        random: true,
        straight: false,
        out_mode: 'out',
        bounce: false,
        attract: {
          enable: true,
          rotateX: 600,
          rotateY: 1200
        }
      }
    },
    interactivity: {
      detect_on: 'canvas',
      events: {
        onhover: {
          enable: true,
          mode: 'repulse'
        },
        onclick: {
          enable: true,
          mode: 'push'
        },
        resize: true
      },
      modes: {
        repulse: {
          distance: 100,
          duration: 0.4
        },
        push: {
          particles_nb: 4
        }
      }
    },
    retina_detect: true
  };

  return (
    <div style={{ 
      ...styles.appContainer, 
      backgroundColor: themeStyles.backgroundColor,
      position: 'relative',
      overflow: showParticles ? 'hidden' : 'visible'
    }}>
      {showConfetti && (
        <Confetti
          width={windowSize.width}
          height={windowSize.height}
          recycle={false}
          numberOfPieces={500}
          gravity={0.2}
        />
      )}
      
    {showParticles && (
      <Particles
        id="tsparticles"
        init={particlesInit}
        options={particlesConfig}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 1,
          pointerEvents: 'none'
        }}
      />
    )}
      
      <div style={{ 
        ...styles.card, 
        backgroundColor: themeStyles.cardBackground, 
        boxShadow: themeStyles.cardShadow,
        color: themeStyles.color,
        position: 'relative',
        zIndex: 2
      }}>
        <div style={styles.header}>
          <h1 style={styles.title}>Ultimate Counter</h1>
          <button 
            onClick={() => setDarkMode(!darkMode)} 
            style={{ 
              ...styles.themeToggle, 
              backgroundColor: darkMode ? '#333' : '#ddd',
              color: darkMode ? '#fff' : '#333'
            }}
          >
            {darkMode ? '☀️ Light' : '🌙 Dark'}
          </button>
        </div>
        
        {/* Counter Display with Bounce Effect */}
        <div 
          ref={counterRef}
          style={{
            ...styles.counter,
            color: getColor(),
            transform: isBouncing ? 'scale(1.5)' : 'scale(1)',
            transition: 'all 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
            textShadow: isBouncing ? `0 0 10px ${getColor()}` : 'none'
          }}
        >
          {count.toLocaleString()}
          {isBouncing && (
            <div style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '100%',
              height: '100%',
              borderRadius: '50%',
              boxShadow: `0 0 30px ${getColor()}`,
              opacity: isBouncing ? 1 : 0,
              transition: 'all 0.5s ease'
            }}></div>
          )}
        </div>

        {/* Step Control */}
        <div style={styles.stepContainer}>
          <label style={{ ...styles.stepLabel, color: themeStyles.color }}>
            Step Value:
            <input
              type="number"
              value={step}
              onChange={(e) => setStep(Math.abs(Number(e.target.value)) || 1)}
              min="1"
              style={{ 
                ...styles.stepInput,
                backgroundColor: themeStyles.inputBackground,
                borderColor: themeStyles.inputBorder,
                color: themeStyles.color
              }}
            />
          </label>
        </div>

        {/* Action Buttons */}
        <div style={windowSize.width < 500 ? styles.buttonGroupStacked : styles.buttonGroup}>
          <button 
            onClick={decrement} 
            style={{ 
              ...styles.button,
              backgroundColor: darkMode ? '#333' : '#2196F3',
              ':hover': {
                backgroundColor: darkMode ? '#444' : '#0b7dda',
              }
            }}
          >
            -{step}
          </button>
          <button 
            onClick={reset} 
            style={{ 
              ...styles.button, 
              ...styles.resetButton,
              backgroundColor: darkMode ? '#555' : '#ff9800',
              ':hover': {
                backgroundColor: darkMode ? '#666' : '#e68a00',
              }
            }}
          >
            Reset
          </button>
          <button 
            onClick={increment} 
            style={{ 
              ...styles.button,
              backgroundColor: darkMode ? '#333' : '#2196F3',
              ':hover': {
                backgroundColor: darkMode ? '#444' : '#0b7dda',
              }
            }}
          >
            +{step}
          </button>
        </div>

        {/* History Section */}
        <div style={{ 
          ...styles.historyContainer, 
          borderTopColor: themeStyles.historyBorder 
        }}>
          <h3 style={{ ...styles.historyTitle, color: themeStyles.color }}>History</h3>
          <ul style={styles.historyList}>
            {history.slice().reverse().map((entry, index) => (
              <li 
                key={index} 
                style={{ 
                  ...styles.historyItem, 
                  borderBottomColor: themeStyles.historyBorder,
                  color: themeStyles.historyText
                }}
              >
                {entry}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

const styles = {
  appContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    transition: 'all 0.3s ease',
    padding: '1rem',
  },
  card: {
    borderRadius: '16px',
    padding: '2.5rem',
    width: '100%',
    maxWidth: '600px',
    transition: 'all 0.3s ease',
    position: 'relative',
    overflow: 'hidden',
    '&:before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      height: '4px',
      background: 'linear-gradient(90deg, #FF5722, #E91E63, #9C27B0, #673AB7)',
    }
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '2rem',
  },
  title: {
    margin: 0,
    fontSize: '2rem',
    fontWeight: '700',
    background: 'linear-gradient(90deg, #2196F3, #4CAF50)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  themeToggle: {
    padding: '0.6rem 1.2rem',
    borderRadius: '25px',
    border: 'none',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    fontSize: '0.9rem',
    fontWeight: 'bold',
    boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
    '&:hover': {
      transform: 'translateY(-2px)',
      boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
    }
  },
  counter: {
    fontSize: '5rem',
    fontWeight: 'bold',
    textAlign: 'center',
    margin: '2rem 0',
    transition: 'all 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    position: 'relative',
    textShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  stepContainer: {
    margin: '2rem 0',
    textAlign: 'center',
  },
  stepLabel: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.8rem',
    fontSize: '1.1rem',
    fontWeight: '500',
  },
  stepInput: {
    padding: '0.6rem',
    width: '70px',
    borderRadius: '8px',
    border: '1px solid',
    textAlign: 'center',
    fontSize: '1rem',
    transition: 'all 0.3s ease',
    fontWeight: 'bold',
    '&:focus': {
      outline: 'none',
      boxShadow: '0 0 0 2px #2196F3',
    }
  },
  buttonGroup: {
    display: 'flex',
    justifyContent: 'center',
    gap: '1.5rem',
    margin: '2rem 0',
  },
  buttonGroupStacked: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    margin: '2rem 0',
    '& button': {
      width: '100%',
    }
  },
  button: {
    padding: '1rem 2rem',
    fontSize: '1.1rem',
    fontWeight: 'bold',
    borderRadius: '8px',
    border: 'none',
    color: 'white',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    minWidth: '100px',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
    '&:hover': {
      transform: 'translateY(-3px)',
      boxShadow: '0 6px 12px rgba(0,0,0,0.15)',
    },
    '&:active': {
      transform: 'translateY(1px)',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    },
  },
  resetButton: {},
  historyContainer: {
    marginTop: '3rem',
    borderTop: '1px solid',
    paddingTop: '1.5rem',
  },
  historyTitle: {
    textAlign: 'center',
    marginBottom: '1rem',
    fontSize: '1.2rem',
    fontWeight: '600',
  },
  historyList: {
    maxHeight: '250px',
    overflowY: 'auto',
    padding: '0 1rem',
    scrollbarWidth: 'thin',
    scrollbarColor: '#2196F3 transparent',
    '&::-webkit-scrollbar': {
      width: '6px',
    },
    '&::-webkit-scrollbar-track': {
      background: 'transparent',
    },
    '&::-webkit-scrollbar-thumb': {
      backgroundColor: '#2196F3',
      borderRadius: '3px',
    },
  },
  historyItem: {
    padding: '0.8rem 0',
    borderBottom: '1px solid',
    fontSize: '1rem',
    transition: 'all 0.2s ease',
    '&:hover': {
      transform: 'translateX(5px)',
    }
  },
};

export default App;