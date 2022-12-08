// Listen for the "load" event on the window object
window.addEventListener("load", (_event: Event) => {
  // Inject the "Listen" button into the page using the Chrome Extension API
  // Create the "Listen" button
  // TypeScript

  const button = document.createElement("button") as HTMLButtonElement;
  button.id = "listen-button";
  button.textContent = "Listen";

  // Set the width and height of the button to 100 pixels
  button.style.width = "80px";
  button.style.height = "20px";

  // Set the background color of the button to blue
  button.style.backgroundColor = "blue";
  button.style.opacity = "0.5";

  // Position the button in the center of the page using the left and top properties
  button.style.position = "fixed";
  button.style.left = "50%";
  button.style.top = "50%";
  button.style.display = "none";

  // Add an animation to the button when it is clicked
  button.style.animation = "fade 0.5s";

  // Add the button to the page using the document.add method
  document.body.appendChild(button);

  // Create a Map to save the text from each element
  const textMap = new Map<number, string>();
  // Create a counter variable to keep track of the position of the currently playing text
  let currentIndex = 0;

  // Function to play the next text in the Map
  function playNext() {
    // Get the text at the current position in the Map
    const text = textMap.get(currentIndex);

    if (text == null || text.length < 3) {
      console.log("no text, skip..");
      return;
    }

    // If the end of the Map has been reached, return
    if (currentIndex >= textMap.size) {
      console.log("already spoke...");
      return;
    }

    // Create a new SpeechSynthesisUtterance with the text
    speakLang(text);

    // Increment the counter variable to move to the next position in the Map
    currentIndex++;

    console.log(text, currentIndex);
  }

  // Listen for clicks on the "Listen" button
  document.querySelector("#listen-button")!.addEventListener("click", () => {
    // Select all elements that you want to play
    const elements = document.querySelectorAll(
      ".bg-gray-50 > .text-base"
    ) as NodeListOf<HTMLElement>;
    console.log("find elements =>", elements.length);
    // Add the text from each element to the Map
    elements.forEach((element, index) => {
      if (
        index >= currentIndex &&
        element.innerText != null &&
        element.innerText.length > 3
      ) {
        // only add the newer element into the map
        // only read text inside P elements, to exclude reading code
        const pElements = element.querySelectorAll(
          ":scope p"
        ) as NodeListOf<HTMLElement>;
        let text = "";
        for (let i = 0; i < pElements.length; i++) {
          text += pElements[i].innerText;
        }
        console.log("add new text => ", text);
        textMap.set(index, text);
      }
    });
    playNext();
  });

  // click this button every 5 seconds
  function clickButton() {
    // Use the dispatchEvent() method to trigger a click event on the button
    button.dispatchEvent(new Event("click"));
  }

  // Use the setInterval() method to execute the clickButton() function every 5 seconds
  setInterval(clickButton, 5000);
});

// utils functions
// below is all wrote by chatGPT
enum Language {
  Chinese = "chinese",
  English = "english",
  Unknown = "unknown",
}

function isEnglishOrChinese(texts: string): Language {
  // Use a regular expression to match Chinese characters
  const chineseRegex = /[\u4e00-\u9fff]/;

  // Use a regular expression to match English letters
  const englishRegex = /^[A-Za-z]+$/;

  // Count the number of Chinese characters and English letters
  // in the text
  let chineseCount = 0;
  let englishCount = 0;
  for (let i = 0; i < texts.length; i++) {
    if (chineseRegex.test(texts[i])) {
      chineseCount++;
    } else if (englishRegex.test(texts[i])) {
      englishCount++;
    }
  }

  // Check if the text contains more Chinese characters or
  // English letters
  if (chineseCount > englishCount) {
    // The text is written in Chinese
    return Language.Chinese;
  } else if (englishCount > chineseCount) {
    // The text is written in English
    return Language.English;
  } else {
    // The text contains an equal number of Chinese
    // characters and English letters
    return Language.Unknown;
  }
}

function speakLang(texts: string) {
  // Use the isEnglishOrChinese() function to determine the
  // dominant language of the text
  const language = isEnglishOrChinese(texts);

  // Create a new SpeechSynthesisUtterance object
  let utterance = new SpeechSynthesisUtterance();
  const speechSynthesis = window.speechSynthesis;

  // Set the text and language of the utterance based on the
  // dominant language of the text
  if (language === Language.Chinese) {
    utterance.text = texts;
    utterance.lang = "zh-CN";
    // Speak the text using the SpeechSynthesisUtterance API
    speechSynthesis.speak(utterance);
  } else if (language === Language.English) {
    utterance.text = texts;
    utterance.lang = "en-US";
    // Speak the text using the SpeechSynthesisUtterance API
    speechSynthesis.speak(utterance);
  } else {
    // The text is written in a mix of Chinese and English,
    // so we can't determine the dominant language
    console.log(
      "Unable to determine the dominant language of the text, can't speak"
    );
  }
}