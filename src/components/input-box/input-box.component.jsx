import React, { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCopy, faVolumeUp, faArrowDown } from "@fortawesome/free-solid-svg-icons";

const InputBox = () => {
  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [inputLang, setInputLang] = useState("en");
  const [outputLang, setOutputLang] = useState("hi");
  const outputTextRef = useRef(null);
  const translateTimeoutRef = useRef(null);

  const languages = [
    { code: "en", name: "English" },
    { code: "hi", name: "Hindi" },
    { code: "es", name: "Spanish" },
    { code: "fr", name: "French" },
    { code: "de", name: "German" },
    { code: "zh", name: "Chinese" },
    { code: "ja", name: "Japanese" },
    { code: "ko", name: "Korean" },
    { code: "ru", name: "Russian" },
    { code: "it", name: "Italian" },
    { code: "pt", name: "Portuguese" },
    { code: "ar", name: "Arabic" },
    { code: "bn", name: "Bengali" },
    { code: "pa", name: "Punjabi" },
    { code: "vi", name: "Vietnamese" },
  ];

  useEffect(() => {
    if (translateTimeoutRef.current) {
      clearTimeout(translateTimeoutRef.current);
    }

    if (inputText) {
      translateTimeoutRef.current = setTimeout(() => {
        handleTranslate();
      }, 500);
    } else {
      setOutputText("");
    }

    return () => {
      if (translateTimeoutRef.current) {
        clearTimeout(translateTimeoutRef.current);
      }
    };
  }, [inputText, inputLang, outputLang]);

  const handleTranslate = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(inputText)}&langpair=${inputLang}|${outputLang}&mt=1`);

      if (!response.ok) {
        throw new Error('Translation failed');
      }

      const data = await response.json();
      if (data.responseStatus === 200) {
        setOutputText(data.responseData.translatedText);
      } else {
        throw new Error(data.responseDetails || 'Translation failed');
      }
    } catch (error) {
      console.error('Error:', error);
      setOutputText('Translation failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(outputText).then(() => {
      alert("Copied to clipboard!");
    }, (err) => {
      console.error('Could not copy text: ', err);
    });
  };

  const readAloud = () => {
    const utterance = new SpeechSynthesisUtterance(outputText);
    utterance.lang = outputLang;
    speechSynthesis.speak(utterance);
  };

  return (
    <div>
      <div>
        <textarea
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Enter text here..."
        />
        <select value={inputLang} onChange={(e) => setInputLang(e.target.value)}>
          {languages.map((lang) => (
            <option key={lang.code} value={lang.code}>
              {lang.name}
            </option>
          ))}
        </select>
      </div>
      <div style={{ textAlign: 'center', margin: '10px 0' }}>
        <span>Translation</span>
        <FontAwesomeIcon icon={faArrowDown} style={{ marginLeft: '5px' }} />
      </div>
      <div>
        <textarea
          ref={outputTextRef}
          value={isLoading ? "Translating..." : outputText}
          readOnly
          placeholder="Translated text will appear here..."
        />
        <select value={outputLang} onChange={(e) => setOutputLang(e.target.value)}>
          {languages.map((lang) => (
            <option key={lang.code} value={lang.code}>
              {lang.name}
            </option>
          ))}
        </select>
        <button onClick={copyToClipboard} title="Copy to clipboard">
          <FontAwesomeIcon icon={faCopy} />
        </button>
        <button onClick={readAloud} title="Read aloud">
          <FontAwesomeIcon icon={faVolumeUp} />
        </button>
      </div>
    </div>
  );
};

export default InputBox;