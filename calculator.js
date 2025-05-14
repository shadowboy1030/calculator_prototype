const display = document.getElementById('display');
const buttons = document.querySelectorAll('button');

let currentInput = '';
let operator = '';
let firstValue = '';
let isNaNState = false;
let justCalculated = false; // ✅ "=" 직후 상태

buttons.forEach((button) => {
  button.addEventListener('click', () => {
    const value = button.textContent;

    // 숫자 누를 때 NaN 상태면 리셋
    if (isNaNState && !button.classList.contains('clear')) {
      currentInput = '';
      firstValue = '';
      operator = '';
      isNaNState = false;
      display.value = '';
    }

    // Clear
    if (button.classList.contains('clear')) {
      currentInput = '';
      firstValue = '';
      operator = '';
      display.value = '';
      isNaNState = false;
      justCalculated = false;
      return;
    }

    // Operator
    if (button.classList.contains('operator')) {
      // 연산자만 연속으로 눌렀을 때 마지막 연산자로 대체
      if (firstValue && operator && currentInput === '') {
        operator = value;
        display.value = operator;
        return;
      }

      // "=" 후 바로 연산자 → result를 이어받아 사용
      if (justCalculated) {
        firstValue = display.value;
        currentInput = '';
        justCalculated = false;
      }

      if (currentInput === '' && display.value !== '') {
        currentInput = display.value;
      }
      if (currentInput === '') return;

      firstValue = currentInput;
      operator = value;
      currentInput = '';
      display.value = operator;
      return;
    }

    // Equal
    if (button.classList.contains('equal')) {
      if (firstValue && operator && currentInput) {
        const num1 = parseFloat(firstValue);
        const num2 = parseFloat(currentInput);
        let result = 0;

        switch (operator) {
          case '+':
            result = num1 + num2;
            break;
          case '-':
            result = num1 - num2;
            break;
          case '*':
            result = num1 * num2;
            break;
          case '/':
            result = num2 !== 0 ? num1 / num2 : 'NaN';
            break;
        }

        display.value = result;
        currentInput = result.toString();
        firstValue = '';
        operator = '';
        justCalculated = true; // ✅ 다음 동작이 숫자/연산자 눌림인지 판단
        isNaNState = isNaN(result);
      }
      return;
    }

    // Number 버튼 눌렀을 때
    if (justCalculated) {
      currentInput = '';
      display.value = '';
      justCalculated = false;
    }

    currentInput += value;
    display.value = currentInput;
  });
});
