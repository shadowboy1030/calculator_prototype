// 디스플레이와 버튼 전체 가져오기
const display = document.getElementById('display');
const buttons = document.querySelectorAll('button');

// 계산에 필요한 변수 초기화
let currentInput = '';      // 현재 입력된 숫자 (두 번째 피연산자)
let operator = '';          // 선택된 연산자
let firstValue = '';        // 첫 번째 피연산자
let isNaNState = false;     // 결과가 NaN인지 여부
let justCalculated = false; // 직전에 '='을 눌렀는지 여부

// 모든 버튼에 클릭 이벤트 리스너 추가
buttons.forEach((button) => {
  button.addEventListener('click', () => {
    const value = button.textContent;

    // 만약 현재 상태가 NaN이고, 'C' 버튼이 아니라면 상태를 리셋
    if (isNaNState && !button.classList.contains('clear')) {
      currentInput = '';
      firstValue = '';
      operator = '';
      isNaNState = false;
      display.value = '';
    }

    // 'C' 버튼 클릭 시 모든 상태 초기화
    if (button.classList.contains('clear')) {
      currentInput = '';
      firstValue = '';
      operator = '';
      display.value = '';
      isNaNState = false;
      justCalculated = false;
      return;
    }

    // 연산자 버튼 클릭 시
    if (button.classList.contains('operator')) {
      // 연산자만 연속으로 누른 경우: 기존 연산자를 새 연산자로 대체
      if (firstValue && operator && currentInput === '') {
        operator = value;
        display.value = operator;
        return;
      }

      // '=' 직후 연산자가 눌리면 결과값을 첫 번째 피연산자로 이어서 계산 가능하도록 설정
      if (justCalculated) {
        firstValue = display.value;
        currentInput = '';
        justCalculated = false;
      }

      // currentInput이 비어있고 화면에 값이 있다면 그것을 currentInput으로 설정
      if (currentInput === '' && display.value !== '') {
        currentInput = display.value;
      }

      // currentInput이 여전히 비어 있다면 연산자 입력 무시
      if (currentInput === '') return;

      // 상태 업데이트: currentInput → firstValue로, 연산자 저장
      firstValue = currentInput;
      operator = value;
      currentInput = '';
      display.value = operator;
      return;
    }

    // '=' 버튼 클릭 시 계산 수행
    if (button.classList.contains('equal')) {
      // 피연산자와 연산자가 모두 존재할 경우 계산 수행
      if (firstValue && operator && currentInput) {
        const num1 = parseFloat(firstValue);
        const num2 = parseFloat(currentInput);
        let result = 0;

        // 연산자에 따라 계산
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
            result = num2 !== 0 ? num1 / num2 : 'NaN'; // 0으로 나누면 NaN 처리
            break;
        }

        // 결과 표시 및 상태 업데이트
        display.value = result;
        currentInput = result.toString();  // 연속 연산을 위해 결과를 currentInput에 저장
        firstValue = '';
        operator = '';
        justCalculated = true;             // "=" 직후 상태 표시
        isNaNState = isNaN(result);        // NaN 상태 여부 저장
      }
      return;
    }

    // 숫자 버튼 클릭 시
    if (justCalculated) {
      // "=" 이후 숫자가 입력되면 새로운 입력으로 간주하고 초기화
      currentInput = '';
      display.value = '';
      justCalculated = false;
    }

    // 숫자 누적 입력
    currentInput += value;
    display.value = currentInput;
  });
});
