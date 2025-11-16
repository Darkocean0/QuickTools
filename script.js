document.addEventListener('DOMContentLoaded', () => {
  const toolsSection = document.getElementById('toolsSection');
  const toolArea = document.getElementById('toolArea');
  const openToolsBtn = document.getElementById('openTools');
  const startBtn = document.getElementById('startBtn');
  const toolsGrid = document.getElementById('toolsGrid');
  const footer = document.querySelector('footer'); // Get the footer for legal links

  // Smooth scroll to tools section
  function scrollToTools() {
    toolsSection.scrollIntoView({ behavior: 'smooth' });
  }

  // Event listeners for hero and header buttons
  openToolsBtn.addEventListener('click', scrollToTools);
  startBtn.addEventListener('click', scrollToTools);

  // Delegate clicks for opening specific tools
  toolsGrid.addEventListener('click', (event) => {
    const openToolButton = event.target.closest('.open-tool');
    if (openToolButton) {
      const card = openToolButton.closest('.card');
      const toolType = card.dataset.tool;
      loadContent(toolType);
    }
  });

  // Delegate clicks for legal pages in the footer
  footer.addEventListener('click', (event) => {
    const legalLink = event.target.closest('a[data-page]');
    if (legalLink) {
      event.preventDefault(); // Prevent default link behavior
      const pageType = legalLink.dataset.page;
      loadContent(pageType);
    }
  });


  // Function to load a specific tool or legal page into the toolArea
  function loadContent(contentType) {
    toolArea.innerHTML = ''; // Clear previous content

    let templateId;
    switch (contentType) {
      case 'calculator':
        templateId = 'calculatorTpl';
        break;
      case 'bmi':
        templateId = 'bmiTpl';
        break;
      case 'age':
        templateId = 'ageTpl';
        break;
      case 'worldclock':
        templateId = 'clockTpl';
        break;
      case 'image-to-pdf':
        templateId = 'imageToPdfTpl';
        break;
      case 'favicon-generator':
        templateId = 'faviconGeneratorTpl';
        break;
      case 'dummy-image-generator':
        templateId = 'dummyImageGeneratorTpl';
        break;
      case 'qr-code-generator':
        templateId = 'qrCodeGeneratorTpl';
        break;
      case 'screen-resolution':
        templateId = 'screenResolutionTpl';
        break;
      case 'lorem-ipsum-generator':
        templateId = 'loremIpsumGeneratorTpl';
        break;
      case 'js-css-minifier':
        templateId = 'jsCssMinifierTpl';
        break;
      case 'js-css-unminifier':
        templateId = 'jsCssUnminifierTpl';
        break;
      case 'about':
        templateId = 'aboutTpl';
        break;
      case 'privacy':
        templateId = 'privacyTpl';
        break;
      case 'terms':
        templateId = 'termsTpl';
        break;
      default:
        toolArea.innerHTML = '<p class="result">Error: Content not found.</p>';
        return;
    }

    const template = document.getElementById(templateId);
    if (template) {
      const content = template.content.cloneNode(true);
      toolArea.appendChild(content);
      toolArea.scrollIntoView({ behavior: 'smooth', block: 'start' }); // Scroll to loaded content

      // Initialize tool-specific logic only if it's a tool
      if (!['about', 'privacy', 'terms'].includes(contentType)) {
        switch (contentType) {
          case 'calculator':
            initCalculator();
            break;
          case 'bmi':
            initBMICalculator();
            break;
          case 'age':
            initAgeCalculator();
            break;
          case 'worldclock':
            initWorldClock();
            break;
          case 'image-to-pdf':
            initImageToPdf();
            break;
          case 'favicon-generator':
            initFaviconGenerator();
            break;
          case 'dummy-image-generator':
            initDummyImageGenerator();
            break;
          case 'qr-code-generator':
            initQrCodeGenerator();
            break;
          case 'screen-resolution':
            initScreenResolution();
            break;
          case 'lorem-ipsum-generator':
            initLoremIpsumGenerator();
            break;
          case 'js-css-minifier':
            initJsCssMinifier();
            break;
          case 'js-css-unminifier':
            initJsCssUnminifier();
            break;
        }
      }
    } else {
      toolArea.innerHTML = `<p class="result">Error: Template for ${contentType} not found.</p>`;
    }
  }

  // --- Calculator Logic ---
  function initCalculator() {
    const display = toolArea.querySelector('#calcDisplay');
    const buttons = toolArea.querySelectorAll('.calc-btn');
    let currentInput = '0';
    let operator = null;
    let prevValue = null;
    let waitForOperand = false;

    display.value = currentInput;

    buttons.forEach(button => {
      button.addEventListener('click', () => {
        const val = button.dataset.val;

        if (val === 'C') {
          currentInput = '0';
          operator = null;
          prevValue = null;
          waitForOperand = false;
        } else if (val === '=') {
          if (operator && prevValue !== null) {
            currentInput = String(calculate(prevValue, currentInput, operator));
            operator = null;
            prevValue = null;
            waitForOperand = true; // Allow chaining results
          }
        } else if (['+', '-', '*', '/'].includes(val)) {
          if (prevValue === null) {
            prevValue = parseFloat(currentInput);
          } else if (operator) {
            prevValue = calculate(prevValue, currentInput, operator);
          }
          operator = val;
          waitForOperand = true;
        } else if (val === '.') {
          if (waitForOperand) {
            currentInput = '0.';
            waitForOperand = false;
          } else if (!currentInput.includes('.')) {
            currentInput += '.';
          }
        } else { // Number input
          if (currentInput === '0' || waitForOperand) {
            currentInput = val;
            waitForOperand = false;
          } else {
            currentInput += val;
          }
        }
        // Ensure display always shows a valid number, not "undefined" or NaN
        display.value = isNaN(currentInput) ? 'Error' : currentInput;
      });
    });

    function calculate(num1, num2, op) {
      const a = parseFloat(num1);
      const b = parseFloat(num2);
      if (isNaN(a) || isNaN(b)) return NaN; // Handle invalid numbers

      switch (op) {
        case '+': return a + b;
        case '-': return a - b;
        case '*': return a * b;
        case '/': return b === 0 ? 'Error' : a / b; // Handle division by zero
        default: return b;
      }
    }
  }

  // --- BMI Calculator Logic ---
  function initBMICalculator() {
    const weightInput = toolArea.querySelector('#bmiWeight');
    const heightInput = toolArea.querySelector('#bmiHeight');
    const calcButton = toolArea.querySelector('#bmiCalc');
    const resultDiv = toolArea.querySelector('#bmiResult');

    calcButton.addEventListener('click', () => {
      const weight = parseFloat(weightInput.value);
      const height = parseFloat(heightInput.value); // in cm

      if (isNaN(weight) || isNaN(height) || weight <= 0 || height <= 0) {
        resultDiv.innerHTML = 'Please enter valid positive numbers for weight and height.';
        resultDiv.style.color = 'salmon';
        return;
      }

      const heightMeters = height / 100;
      const bmi = weight / (heightMeters * heightMeters);
      let category = '';

      if (bmi < 18.5) {
        category = 'Underweight';
      } else if (bmi >= 18.5 && bmi < 24.9) {
        category = 'Normal weight';
      } else if (bmi >= 25 && bmi < 29.9) {
        category = 'Overweight';
      } else {
        category = 'Obesity';
      }

      resultDiv.innerHTML = `Your BMI is: <strong>${bmi.toFixed(2)}</strong> (${category})`;
      resultDiv.style.color = ''; // Reset color
    });
  }

  // --- Age Calculator Logic ---
  function initAgeCalculator() {
    const birthDateInput = toolArea.querySelector('#birthDate');
    const calcButton = toolArea.querySelector('#ageCalc');
    const resultDiv = toolArea.querySelector('#ageResult');

    calcButton.addEventListener('click', () => {
      const birthDateStr = birthDateInput.value;
      if (!birthDateStr) {
        resultDiv.innerHTML = 'Please enter your birthdate.';
        resultDiv.style.color = 'salmon';
        return;
      }

      const birthDate = new Date(birthDateStr);
      const today = new Date();

      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      const dayDiff = today.getDate() - birthDate.getDate();

      // Adjust age if birthday hasn't occurred yet this year
      if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
        age--;
      }

      if (age < 0) {
          resultDiv.innerHTML = 'Birthdate cannot be in the future.';
          resultDiv.style.color = 'salmon';
          return;
      }

      resultDiv.innerHTML = `Your age is: <strong>${age} years</strong>`;
      resultDiv.style.color = ''; // Reset color
    });
  }

  // --- World Clock Logic (Local Time) ---
  function initWorldClock() {
    const localTimeDiv = toolArea.querySelector('#localTime');

    function updateLocalTime() {
      const now = new Date();
      const options = {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false // Use 24-hour format
      };
      localTimeDiv.textContent = now.toLocaleTimeString(navigator.language, options);
    }

    updateLocalTime(); // Initial display
    setInterval(updateLocalTime, 1000); // Update every second
  }

  // --- Image to PDF Converter Logic ---
  function initImageToPdf() {
    const imageInput = toolArea.querySelector('#imageInput');
    const imagePreview = toolArea.querySelector('#imagePreview');
    const convertPdfBtn = toolArea.querySelector('#convertPdfBtn');
    const pdfResult = toolArea.querySelector('#pdfResult');
    let selectedImages = []; // Stores File objects

    imageInput.addEventListener('change', (event) => {
      pdfResult.innerHTML = ''; // Clear previous results
      const files = event.target.files;

      if (files.length === 0) {
          selectedImages = [];
          imagePreview.innerHTML = '';
          convertPdfBtn.disabled = true;
          return;
      }

      // Add new files to existing selection or replace if desired
      // Here, we'll replace for simplicity. For appending, loop and push to `selectedImages`
      selectedImages = [];
      imagePreview.innerHTML = '';


      Array.from(files).forEach(file => {
        if (file.type.startsWith('image/')) {
          selectedImages.push(file);
          const reader = new FileReader();
          reader.onload = (e) => {
            const previewItem = document.createElement('div');
            previewItem.classList.add('image-preview');
            previewItem.innerHTML = `
              <img src="${e.target.result}" alt="${file.name}" title="${file.name}">
              <button class="remove-image" data-filename="${file.name}" aria-label="Remove image">&times;</button>
            `;
            imagePreview.appendChild(previewItem);
          };
          reader.readAsDataURL(file);
        } else {
          pdfResult.innerHTML = 'Only image files (JPG, PNG) are supported. Skipping non-image files.';
          pdfResult.style.color = 'salmon';
        }
      });
      convertPdfBtn.disabled = selectedImages.length === 0;
    });

    imagePreview.addEventListener('click', (event) => {
        if (event.target.classList.contains('remove-image')) {
            const fileNameToRemove = event.target.dataset.filename;
            selectedImages = selectedImages.filter(file => file.name !== fileNameToRemove);
            event.target.closest('.image-preview').remove();
            if (selectedImages.length === 0) {
                convertPdfBtn.disabled = true;
                imageInput.value = ''; // Clear file input as well
            }
        }
    });


    convertPdfBtn.addEventListener('click', async () => {
      if (selectedImages.length === 0) {
        pdfResult.innerHTML = 'Please select at least one image to convert.';
        pdfResult.style.color = 'salmon';
        return;
      }

      convertPdfBtn.disabled = true;
      pdfResult.innerHTML = 'Converting images to PDF... This might take a moment.';
      pdfResult.style.color = '';

      try {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF({
          orientation: "portrait",
          unit: "mm",
          format: "a4"
        });

        for (let i = 0; i < selectedImages.length; i++) {
          const file = selectedImages[i];
          const imageData = await readFileAsDataURL(file);

          if (i > 0) {
            doc.addPage();
          }

          const img = new Image();
          img.src = imageData;

          await new Promise((resolve, reject) => { // Added reject for error handling
            img.onload = () => {
              const pageWidth = doc.internal.pageSize.getWidth();
              const pageHeight = doc.internal.pageSize.getHeight();

              const imgWidth = img.width;
              const imgHeight = img.height;

              // Calculate aspect ratio to fit image on page
              const ratio = Math.min(pageWidth / imgWidth, pageHeight / imgHeight);

              const finalWidth = imgWidth * ratio;
              const finalHeight = imgHeight * ratio;

              const x = (pageWidth - finalWidth) / 2;
              const y = (pageHeight - finalHeight) / 2;

              doc.addImage(imageData, img.naturalWidth > img.naturalHeight ? 'JPEG' : 'PNG', x, y, finalWidth, finalHeight); // Use 'PNG' for better quality if needed
              resolve();
            };
            img.onerror = reject; // Reject promise on image load error
          });
        }

        const pdfName = `QuickTools_Images_${new Date().getTime()}.pdf`;
        doc.save(pdfName);
        pdfResult.innerHTML = `<strong>${selectedImages.length} image(s) converted successfully!</strong> Your PDF '${pdfName}' should be downloading.`;
        pdfResult.style.color = 'lightgreen';
      } catch (error) {
        console.error("Error converting images to PDF:", error);
        pdfResult.innerHTML = `Error converting images to PDF: ${error.message}. Please try again.`;
        pdfResult.style.color = 'salmon';
      } finally {
        convertPdfBtn.disabled = false;
      }
    });

    function readFileAsDataURL(file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (event) => resolve(event.target.result);
        reader.onerror = (error) => reject(error);
        reader.readAsDataURL(file);
      });
    }
  }

  // --- Favicon Generator Logic ---
  function initFaviconGenerator() {
    const imageInput = toolArea.querySelector('#faviconImageInput');
    const sizeInput = toolArea.querySelector('#faviconSize');
    const generateBtn = toolArea.querySelector('#generateFaviconBtn');
    const resultDiv = toolArea.querySelector('#faviconResult');
    const previewDiv = toolArea.querySelector('#faviconPreview');

    imageInput.addEventListener('change', () => {
      if (imageInput.files.length > 0) {
        generateBtn.disabled = false;
        resultDiv.innerHTML = '';
        previewDiv.innerHTML = '';
      } else {
        generateBtn.disabled = true;
      }
    });

    generateBtn.addEventListener('click', async () => {
      const file = imageInput.files[0];
      const size = parseInt(sizeInput.value);

      if (!file) {
        resultDiv.innerHTML = 'Please upload an image.';
        resultDiv.style.color = 'salmon';
        return;
      }
      if (isNaN(size) || size < 16 || size > 256) {
        resultDiv.innerHTML = 'Please enter a valid size between 16 and 256.';
        resultDiv.style.color = 'salmon';
        return;
      }

      resultDiv.innerHTML = 'Generating favicon...';
      resultDiv.style.color = '';
      generateBtn.disabled = true;

      try {
        const reader = new FileReader();
        reader.onload = async (e) => {
          const img = new Image();
          img.src = e.target.result;
          img.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = size;
            canvas.height = size;
            const ctx = canvas.getContext('2d');
            ctx.imageSmoothingEnabled = true; // For smoother scaling
            ctx.imageSmoothingQuality = 'high'; // High quality smoothing
            ctx.drawImage(img, 0, 0, size, size);

            canvas.toBlob((blob) => {
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = `favicon_${size}x${size}.png`;
              a.textContent = `Download Favicon (${size}x${size}px)`;
              a.classList.add('btn');
              a.style.marginTop = '15px';
              a.style.display = 'block'; // Make button a block element

              previewDiv.innerHTML = `
                <div class="image-preview" style="background-color: #fff; width: ${size}px; height: ${size}px;">
                  <img src="${url}" alt="Favicon Preview">
                </div>
              `;
              resultDiv.innerHTML = `Favicon generated! <br/>`;
              resultDiv.appendChild(a);
              resultDiv.style.color = 'lightgreen';
              generateBtn.disabled = false;
            }, 'image/png'); // Can't directly generate .ico client-side without complex libraries
          };
          img.onerror = () => {
            resultDiv.innerHTML = 'Could not load image. Please try a different file.';
            resultDiv.style.color = 'salmon';
            generateBtn.disabled = false;
          };
        };
        reader.readAsDataURL(file);
      } catch (error) {
        console.error("Favicon generation error:", error);
        resultDiv.innerHTML = `Error generating favicon: ${error.message}`;
        resultDiv.style.color = 'salmon';
        generateBtn.disabled = false;
      }
    });
  }

  // --- Dummy Image Generator Logic ---
  function initDummyImageGenerator() {
    const widthInput = toolArea.querySelector('#dummyImageWidth');
    const heightInput = toolArea.querySelector('#dummyImageHeight');
    const textInput = toolArea.querySelector('#dummyImageText');
    const bgColorInput = toolArea.querySelector('#dummyImageBgColor');
    const textColorInput = toolArea.querySelector('#dummyImageTextColor');
    const generateBtn = toolArea.querySelector('#generateDummyImageBtn');
    const resultDiv = toolArea.querySelector('#dummyImageResult');
    const outputDiv = toolArea.querySelector('#dummyImageOutput');

    const generateImage = () => { // Encapsulate generation for initial load and button click
      const width = parseInt(widthInput.value);
      const height = parseInt(heightInput.value);
      const text = textInput.value || `${width}x${height}`;
      const bgColor = bgColorInput.value || '#cccccc';
      const textColor = textColorInput.value || '#333333';

      if (isNaN(width) || isNaN(height) || width < 1 || height < 1) {
        resultDiv.innerHTML = 'Please enter valid positive numbers for width and height.';
        resultDiv.style.color = 'salmon';
        return;
      }
      if (width > 2000 || height > 2000) {
        resultDiv.innerHTML = 'Max dimension for dummy image is 2000px.';
        resultDiv.style.color = 'salmon';
        return;
      }


      resultDiv.innerHTML = 'Generating dummy image...';
      resultDiv.style.color = '';
      outputDiv.innerHTML = '';

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');

      // Background
      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, width, height);

      // Text
      ctx.fillStyle = textColor;
      const fontSize = Math.min(width / (text.length * 0.5), height / 2); // Dynamic font size
      ctx.font = `bold ${fontSize}px Arial`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(text, width / 2, height / 2);

      const imageUrl = canvas.toDataURL('image/png');
      const imgElement = document.createElement('img');
      imgElement.src = imageUrl;
      imgElement.alt = "Generated Dummy Image";
      imgElement.style.maxWidth = '100%';
      imgElement.style.height = 'auto';
      imgElement.style.display = 'block';
      imgElement.style.margin = '20px auto';
      imgElement.style.border = '1px solid var(--border-light)';
      imgElement.style.borderRadius = '8px';
      imgElement.style.boxShadow = '0 4px 12px var(--shadow-dark)';

      outputDiv.appendChild(imgElement);

      resultDiv.innerHTML = 'Image generated! Right-click or long-press to save.';
      resultDiv.style.color = 'lightgreen';
    };

    generateBtn.addEventListener('click', generateImage);
    // Optional: Generate on initial load with default values
    generateImage();
  }

  // --- QR Code Generator Logic ---
  function initQrCodeGenerator() {
    const inputField = toolArea.querySelector('#qrCodeInput');
    const generateBtn = toolArea.querySelector('#generateQrCodeBtn');
    const resultDiv = toolArea.querySelector('#qrCodeResult');
    const outputDiv = toolArea.querySelector('#qrCodeOutput');

    // Enable/disable button based on input
    inputField.addEventListener('input', () => {
      generateBtn.disabled = inputField.value.trim().length === 0;
      resultDiv.innerHTML = '';
      outputDiv.innerHTML = '';
    });

    generateBtn.addEventListener('click', () => {
      const text = inputField.value.trim();

      if (text.length === 0) {
        resultDiv.innerHTML = 'Please enter some text or a URL.';
        resultDiv.style.color = 'salmon';
        return;
      }
      if (text.length > 500) { // Limit QR code data length
        resultDiv.innerHTML = 'Text/URL too long for a reliable QR code. Max 500 characters.';
        resultDiv.style.color = 'salmon';
        return;
      }

      resultDiv.innerHTML = 'Generating QR code...';
      resultDiv.style.color = '';
      outputDiv.innerHTML = ''; // Clear previous QR

      try {
        const qr = new QRious({
          value: text,
          size: 200,
          background: 'white',
          foreground: '#010e21', // Dark blue from your background
          level: 'H' // High error correction
        });

        const img = document.createElement('img');
        img.src = qr.toDataURL();
        img.alt = 'QR Code';
        img.style.maxWidth = '100%';
        img.style.height = 'auto';
        img.style.display = 'block';
        img.style.margin = '0 auto';
        img.style.padding = '10px';
        img.style.background = 'white'; // QRious background seems to be for canvas itself, not padding

        outputDiv.appendChild(img);

        resultDiv.innerHTML = 'QR code generated! Right-click or long-press to save.';
        resultDiv.style.color = 'lightgreen';
      } catch (error) {
        console.error("QR Code generation error:", error);
        resultDiv.innerHTML = `Error generating QR code: ${error.message}`;
        resultDiv.style.color = 'salmon';
      }
    });
  }

  // --- Screen Resolution Logic ---
  function initScreenResolution() {
    const screenWidthSpan = toolArea.querySelector('#screenWidth');
    const screenHeightSpan = toolArea.querySelector('#screenHeight');
    const viewportWidthSpan = toolArea.querySelector('#viewportWidth');
    const viewportHeightSpan = toolArea.querySelector('#viewportHeight');

    const updateResolution = () => {
        screenWidthSpan.textContent = window.screen.width;
        screenHeightSpan.textContent = window.screen.height;
        viewportWidthSpan.textContent = window.innerWidth;
        viewportHeightSpan.textContent = window.innerHeight;
    }

    updateResolution(); // Initial display
    window.addEventListener('resize', updateResolution); // Update on resize
  }

  // --- Lorem Ipsum Generator Logic ---
  function initLoremIpsumGenerator() {
    const paragraphsInput = toolArea.querySelector('#loremIpsumParagraphs');
    const generateBtn = toolArea.querySelector('#generateLoremIpsumBtn');
    const resultDiv = toolArea.querySelector('#loremIpsumResult');
    const copyBtn = toolArea.querySelector('#copyLoremIpsumBtn');

    const loremIpsumSentences = [
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
      "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
      "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
      "Curabitur pretium, libero et tempor egestas, nunc mi pulvinar mi, id sagittis magna felis sit amet nunc.",
      "Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas.",
      "Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Donec velit neque, auctor sit amet aliquam vel, ullamcorper sit amet ligula.",
      "Mauris blandit aliquet elit, eget tincidunt nibh pulvinar a.",
      "Donec sollicitudin molestie malesuada. Quisque velit nisi, pretium ut lacinia in, elementum id enim.",
      "Proin eget tortor risus. Praesent sapien massa, convallis a pellentesque nec, egestas non nisi.",
      "Vivamus suscipit tortor eget felis porttitor volutpat. Curabitur aliquet quam id dui posuere blandit.",
      "Nulla porttitor accumsan tincidunt. Donec rutrum congue leo eget malesuada."
    ];

    function generateLoremIpsumText(numParagraphs) {
      let fullText = [];
      for (let i = 0; i < numParagraphs; i++) {
        let paragraph = [];
        const numSentences = Math.floor(Math.random() * 5) + 3; // 3-7 sentences per paragraph
        for (let j = 0; j < numSentences; j++) {
          const randomIndex = Math.floor(Math.random() * loremIpsumSentences.length);
          paragraph.push(loremIpsumSentences[randomIndex]);
        }
        fullText.push(paragraph.join(' '));
      }
      return fullText.map(p => `<p>${p}</p>`).join('\n');
    }

    generateBtn.addEventListener('click', () => {
      const numParagraphs = parseInt(paragraphsInput.value);

      if (isNaN(numParagraphs) || numParagraphs < 1 || numParagraphs > 50) {
        resultDiv.innerHTML = 'Please enter a number between 1 and 50 for paragraphs.';
        resultDiv.style.color = 'salmon';
        copyBtn.style.display = 'none';
        return;
      }

      resultDiv.innerHTML = generateLoremIpsumText(numParagraphs);
      resultDiv.style.color = '';
      copyBtn.style.display = 'block';
    });

    copyBtn.addEventListener('click', () => {
        const textToCopy = resultDiv.innerText; // Get raw text without HTML tags
        navigator.clipboard.writeText(textToCopy)
            .then(() => {
                const originalText = copyBtn.textContent;
                copyBtn.textContent = 'Copied!';
                setTimeout(() => {
                    copyBtn.textContent = originalText;
                }, 2000);
            })
            .catch(err => {
                console.error('Failed to copy text: ', err);
                copyBtn.textContent = 'Copy Failed!';
            });
    });

    // Initial generation on load
    generateBtn.click();
  }

  // --- JS & CSS Minifier Logic ---
  function initJsCssMinifier() {
    const inputField = toolArea.querySelector('#minifierInput');
    const minifyBtn = toolArea.querySelector('#minifyBtn');
    const resultDiv = toolArea.querySelector('#minifierResult');
    const copyBtn = toolArea.querySelector('#copyMinifiedBtn');

    inputField.addEventListener('input', () => {
      minifyBtn.disabled = inputField.value.trim().length === 0;
      resultDiv.innerHTML = '';
      copyBtn.style.display = 'none';
    });

    minifyBtn.addEventListener('click', () => {
      const code = inputField.value.trim();
      if (!code) {
        resultDiv.innerHTML = 'Please paste some code to minify.';
        resultDiv.style.color = 'salmon';
        return;
      }

      let minifiedCode = '';
      try {
        // Simple minification for demonstration.
        // For robust minification, typically a build tool (like Terser for JS, css-minimizer for CSS) is used.
        // This client-side approach simply removes whitespace and comments.
        minifiedCode = code
          .replace(/\/\*[\s\S]*?\*\/|(?<=[^:])\/\/.*|\s+/g, '') // Remove multi-line and single-line comments, and extra whitespace
          .replace(/;}/g, '}'); // Remove semicolons before closing braces
        
        // Add a newline for CSS to ensure it's on a single line
        if (code.includes('{') && code.includes(';')) { // Heuristic to guess if it's CSS
            minifiedCode = minifiedCode.replace(/}/g, '}\n').trim();
        } else { // Assume JS or just text
            minifiedCode = minifiedCode.replace(/\n/g, '');
        }

        resultDiv.innerHTML = `<pre>${minifiedCode}</pre>`;
        resultDiv.style.color = '';
        copyBtn.style.display = 'block';

      } catch (error) {
        console.error("Minification error:", error);
        resultDiv.innerHTML = `Error minifying code: ${error.message}`;
        resultDiv.style.color = 'salmon';
      }
    });

    copyBtn.addEventListener('click', () => {
        const textToCopy = toolArea.querySelector('#minifierResult pre').textContent;
        navigator.clipboard.writeText(textToCopy)
            .then(() => {
                const originalText = copyBtn.textContent;
                copyBtn.textContent = 'Copied!';
                setTimeout(() => {
                    copyBtn.textContent = originalText;
                }, 2000);
            })
            .catch(err => {
                console.error('Failed to copy text: ', err);
                copyBtn.textContent = 'Copy Failed!';
            });
    });
  }

  // --- JS & CSS Unminifier / Beautifier Logic ---
  function initJsCssUnminifier() {
    const inputField = toolArea.querySelector('#unminifierInput');
    const unminifyBtn = toolArea.querySelector('#unminifyBtn');
    const resultDiv = toolArea.querySelector('#unminifierResult');
    const copyBtn = toolArea.querySelector('#copyUnminifiedBtn');

    inputField.addEventListener('input', () => {
      unminifyBtn.disabled = inputField.value.trim().length === 0;
      resultDiv.innerHTML = '';
      copyBtn.style.display = 'none';
    });

    unminifyBtn.addEventListener('click', () => {
      const code = inputField.value.trim();
      if (!code) {
        resultDiv.innerHTML = 'Please paste some code to unminify/beautify.';
        resultDiv.style.color = 'salmon';
        return;
      }

      let beautifiedCode = '';
      try {
        // Attempt to beautify as JavaScript first
        beautifiedCode = js_beautify(code, {
          indent_size: 2,
          space_in_empty_paren: true
        });

        // If it still looks minified, try CSS beautifier
        // This is a simple heuristic; a more advanced tool might try to detect language
        if (beautifiedCode.length < code.length * 0.8 && code.includes('{') && code.includes(';')) {
            beautifiedCode = css_beautify(code, {
                indent_size: 2
            });
        }
        
        resultDiv.innerHTML = `<pre>${beautifiedCode}</pre>`;
        resultDiv.style.color = '';
        copyBtn.style.display = 'block';

      } catch (error) {
        console.error("Unminification error:", error);
        resultDiv.innerHTML = `Error unminifying code: ${error.message}. Make sure it's valid JS/CSS.`;
        resultDiv.style.color = 'salmon';
      }
    });

    copyBtn.addEventListener('click', () => {
        const textToCopy = toolArea.querySelector('#unminifierResult pre').textContent;
        navigator.clipboard.writeText(textToCopy)
            .then(() => {
                const originalText = copyBtn.textContent;
                copyBtn.textContent = 'Copied!';
                setTimeout(() => {
                    copyBtn.textContent = originalText;
                }, 2000);
            })
            .catch(err => {
                console.error('Failed to copy text: ', err);
                copyBtn.textContent = 'Copy Failed!';
            });
    });
  }

});