
function handleKeyPress(event) {
  if (event.key === 'Enter') {
    // ตรวจสอบว่าปุ่มที่ถูกกดเป็นปุ่ม Enter
    send();
  }
}
const startButton = document.getElementById('startButton');
const input = document.getElementById('input');
const recognition = new webkitSpeechRecognition(); // เรียกใช้ Web Speech 
recognition.lang = 'th-TH'; // กำหนดภาษาเป็นไทย
recognition.onresult = function (event) {
  const result = event.results[0][0].transcript;
  // เลือก element input โดยใช้ id
  var input = document.getElementById("input");
  // เพิ่มข้อมูลลงใน input
  input.value = result;
  send()
};
startButton.addEventListener('click', function () {
  recognition.start();
});
function send() {
  var audio = new Audio('/เสียง/เสียงส่ง2.mp3');
  audio.play();
  // ดึงองค์ประกอบ input จากเอกสาร HTML และเก็บค่าที่กรอกเข้ามาในตัวแปร input
  const input = document.getElementById("input").value.trim().toLowerCase();
  // ดึงองค์ประกอบ inputText จากเอกสาร HTML และเก็บค่าที่กรอกเข้ามาในตัวแปร inputText
  const inputText = document.getElementById("input").value.trim().toLowerCase();
  // กำหนดค่าให้ตัวแปร name1 เป็น "น้อยหน่า"
  /* console.log(input)*/
  const name1 = "น้อยหน่า";

  // ดึงองค์ประกอบ output จากเอกสาร HTML และเก็บค่าในตัวแปร output
  const output = document.getElementById("output");

  // เพิ่มเอกสาร HTML ในองค์ประกอบ output โดยใส่ค่าตัวแปร input ในแท็ก <p>
  output.innerHTML += `<p>${input}</p>`;

  function findMatchingQuestion(inputText, questions) {
    let bestMatch = null;
    let bestRatio = 0;

    // วนลูปผ่านรายการคำถาม
    for (let question of questions) {
      // คำนวณความคล้ายคลึงระหว่างข้อความ inputText และ question
      const ratio = similarity(inputText, question);

      // หาค่าความคล้ายคลึงที่สูงที่สุด
      if (ratio > bestRatio) {
        bestRatio = ratio;
        bestMatch = question;
      }
    }
    // คืนคำถามที่ใกล้เคียงที่สุด
    return bestMatch;
  }
  function similarity(s1, s2) {
    const len1 = s1.length;
    const len2 = s2.length;

    // สร้างเมตริกซ์สำหรับเก็บค่าความคล้ายคลึงระหว่างสตริง
    const matrix = Array(len1 + 1).fill(null).map(() => Array(len2 + 1).fill(0));
    /*console.log(matrix)*/
    // กำหนดค่าเริ่มต้นในเมตริกซ์
    for (let i = 0; i <= len1; i++) {
      matrix[i][0] = i;

    }
    for (let j = 0; j <= len2; j++) {
      matrix[0][j] = j;
    }

    // คำนวณค่าความคล้ายคลึงระหว่างสตริง s1 และ s2
    for (let i = 1; i <= len1; i++) {
      for (let j = 1; j <= len2; j++) {
        // คำนวณค่า cost หรือค่าในเมตริกซ์ที่ต้องการแก้ไข
        const cost = s1[i - 1] === s2[j - 1] ? 0 : 1;
        // คำนวณค่าในเมตริกซ์
        matrix[i][j] = Math.min(
          matrix[i - 1][j] + 1,         // การลบ
          matrix[i][j - 1] + 1,         // การเพิ่ม
          matrix[i - 1][j - 1] + cost   // การแทนที่
        );
      }
    }
    const maxLength = Math.max(len1, len2);
    const distance = matrix[len1][len2];
    /*console.log(distance)*/
    // คำนวณค่าความคล้ายคลึงระหว่างสตริงในรูปแบบระหว่าง 0 ถึง 1
    return 1 - distance / maxLength;
}
  function processQuestion(inputText, data, conversation) {
    const inputTextLowercase = inputText.toLowerCase();
    const inputTextWords = inputTextLowercase.split(" ");
    const matchingQuestion = findMatchingQuestion(inputTextLowercase, Object.keys(data));
    // ตรวจสอบว่าคำถามเกี่ยวกับชื่อหรือไม่
    if (inputTextLowercase.includes("ทำอะไร") || inputTextLowercase.includes("ทำไร")) {
      const randomResponse = getRandomResponse1(data1);
      return randomResponse;
    }
    if (inputTextLowercase.includes("เเนะนำเมนูอาหาร") || inputTextLowercase.includes("ขอเมนูอาหาร") ||
      inputTextLowercase.includes("เเนะนำอาหารให้ฉัน") ||
      inputTextLowercase.includes("เมนูอาหารที่ฉันควรทานในวันนี้") ||
      inputTextLowercase.includes("กินอะไรดีวันนี้") ||
      inputTextLowercase.includes("มีเมนูอื่นเเนะนำไหม")) {
      const randomResponse = getRandomResponse2(data2);
      return randomResponse;
    }
    if (inputTextLowercase.includes("เเนะนำสิ่งที่ทำเพื่อฆ่าเวลา") ||
      inputTextLowercase.includes("เเนะนำกิจกิจกรรมที่ช่วยเเก้เบื่อหน่อย") || inputTextLowercase.includes("กิจกรรมที่ฆ่าเวลา")) {
      const randomResponse = getRandomResponse3(data3);
      return randomResponse;
    }
    // เพิ่มส่วนเงื่อนไขสำหรับการสุ่มคำตอบ
    if (matchingQuestion === null) {
      const randomResponse = getRandomResponse(data2);
      return randomResponse;
    } else {
      const response = data[matchingQuestion];
      conversation[matchingQuestion] = true;
      return response;
    }
  }
  // ฟังก์ชัน `getRandomResponse` นี้ใช้สำหรับสุ่มคำตอบจากอ็อบเจ็กต์ `data2`
  function getRandomResponse1(data1) {
    // นำค่าของคำตอบทั้งหมดใน `data2` มาเก็บไว้ในอาเรย์ `responses`
    const responses = Object.values(data1);
    // สร้างตัวแปร `randomIndex` เพื่อเก็บค่าสุ่มจากความยาวของอาเรย์ `responses`
    const randomIndex = Math.floor(Math.random() * responses.length);
    // คืนคำตอบที่สุ่มได้จากอาเรย์ `responses`
    return responses[randomIndex];
  }
  // อ็อบเจ็กต์ `data2` เก็บคำตอบต่าง ๆ โดยใช้คีย์เป็นตัวเลข 1, 2, และ 3
  const data1 = {
    "1": "ตอบคำถามคุณไงคะ",
    "2": "ให้คำปรึกษากับคนขี้เหงาค่ะ",
    "3": "ทำหน้าที่ของแชทบอทค่ะ",
  };
  function getRandomResponse2(data2) {
    const responses = Object.values(data2);
    const randomIndex = Math.floor(Math.random() * responses.length);
    return responses[randomIndex];
  }
  const data2 = {
    "1": "ข้าวมันไก่ดีไหมคะ",
    "2": "ขอเเนะนำเป็นหมูปิ้งค่ะ",
    "3": "ไก่ย่างค่ะ",
    "4": "ข้าวผัดค่ะ",
    "5": "ปลาเผาค่ะ",
    "6": "สลัดผักค่ะ",
  };
  function getRandomResponse3(data3) {
    const responses = Object.values(data3);
    const randomIndex = Math.floor(Math.random() * responses.length);
    return responses[randomIndex];
  }
  const data3 = {
    "1": "เล่นเกมค่ะ  เกมเป็นสิ่งที่เล่นเพื่อฆ่าเวลาได้ดีเพราะสร้างความเพลิดเพลินให้เเก่ผู้เล่นได้ค่ะ",
    "2": "ดูการ์ตูนหรืออนิเมะ  ละครทีวีค่ะ  จะทำให้รู้สึกว่าเวลานั้นผ่านไปเร็วมากค่ะ",
    "3": "ออกไปเดินเล่นค่ะ การวางมือถือเเละออกไปเกินเล่นข้างนอกจะทำให้รู้สึกผ่อนคลายค่ะ",
    "4": "อ่านหนังสือค่ะ  การอ่านหนังสือนอกจากจะอ่านเพื่อฆ่าเวลาเเล้วยังทำให้ได้ความรู้ด้วยนะคะ",
  };
  
  const conversation = {};
  const response = processQuestion(inputText, data, conversation);
  setTimeout(() => {
    output.innerHTML += `<p>${response}</p>`;
    var msg = new SpeechSynthesisUtterance(response);
    msg.lang = "th-TH"; // ตั้งค่าให้เป็นภาษาไทย
    window.speechSynthesis.speak(msg);
    var audio = new Audio('/เสียง/เสียงรับ2.mp3');
    audio.play();
    output.scrollTop = output.scrollHeight;
  }, 2000);
  document.getElementById("input").value = "";
}

const json = 'data.json';
// โหลดไฟล์ JSON ด้วย fetch()
fetch(json)
  .then(response => {
    // ตรวจสอบสถานะของ response
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    // แปลง response เป็น JSON
    return response.json();
  })
  .then(data => {
    // ทำสิ่งที่คุณต้องการกับข้อมูลที่ได้
    console.log(data); // เพียงตัวอย่างเท่านั้น
  })
  .catch(error => {
    // จัดการข้อผิดพลาดในการโหลดหรือแปลง JSON
    console.error('Error fetching JSON:', error);
  });

