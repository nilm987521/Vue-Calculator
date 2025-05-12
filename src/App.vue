<template>
  <div class="container">
    <div class="row ms-3 mt-3">
      <!-- Result List -->
      <div class="col-none d-lg-block d-none col-lg-8 row">
        <div class="panel panel-primary" id="result_panel">
          <div class="panel-heading">
            <h1 class="panel-default">Result List</h1>
          </div>
          <div class="panel-body col-11">
            <ul ref="resultList" class="list-group">
              <li
                class="list-group-item"
                @click="SetStatement(result[0])"
                v-for="(result, index) in ResultArr"
                :key="index"
              >
                <a class="resultItem">{{ result[0] }} = {{ result[1] }}</a>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <!-- Calculator -->
      <div class="col-12 col-lg-4 cal shadow-lg justify-content-center">
        <div class="row p-2">
          <input class="col-12 shadow" id="statement" v-model="Statement" />
        </div>
        <div class="row p-0">
          <div class="col-9 p-0">
            <!-- "(", ")", "%" -->
            <BracketPad @click-function="FuncBtnClick" />

            <!-- [0 - 9] -->
            <NumberPad @click-number="NumBtnClick" />

            <!-- ".", "=" -->
            <EqualPad @click-function="FuncBtnClick" />
          </div>
          <!-- "AC", "/", "*", "-", "+" -->
          <div class="col-3 p-0">
            <OperatorPad @click-function="FuncBtnClick" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';
import { Decimal } from 'decimal.js';
import NumberPad from './components/NumberPad.vue';
import BracketPad from './components/BracketPad.vue';
import OperatorPad from './components/OperatorPad.vue';
import EqualPad from './components/EqualPad.vue';

export default {
  name: 'CalculatorApp',
  components: {
    NumberPad,
    BracketPad,
    OperatorPad,
    EqualPad,
  },
  setup() {
    // variables
    const Statement = ref('0');
    var HasGetResult = false;
    const ResultArr = ref([]);

    // Regex
    const PairReg = /\((-?\d+\.?\d*%?([×÷*/+-]?\d+\.?\d*%?)*)\)/;
    const MDReg = /(-?\d+\.?\d*%?)([×÷*/])(-?\d+\.?\d*%?)/;
    const PSReg = /(-?\d+\.?\d*%?)([+-])(-?\d+\.?\d*%?)/;
    const PercentReg = /(-?\d+\.?\d*)%/;
    const ChangeOperatReg = /[+\-*/×÷]$/;

    // functions
    // 數字按鍵觸發的 function
    const NumBtnClick = (num) => {
      if (HasGetResult === true) {
        Statement.value = '';
        HasGetResult = false;
      }
      if (num == 0) {
        if (Statement.value === '0') {
          return;
        }
      } else {
        if (Statement.value === '0') {
          Statement.value = '';
        }
      }
      Statement.value = Statement.value + num;
    };

    // 功能按鍵觸發的 function
    const FuncBtnClick = (func) => {
      switch (func) {
        case 'AC':
          Statement.value = '0';
          return;
        case '.':
          HasGetResult = false;
          var ErrReg = /\d+[.]+\d+[.]/g;
          if (isNaN(Statement.value.slice(-1))) {
            return;
          } else if (ErrReg.test(Statement.value + '.')) {
            return;
          }
          break;
        case ')':
          var LeftPairCount;
          var RightPairCount;
          if (Statement.value.match(/\(/g) !== null) {
            LeftPairCount = Statement.value.match(/\(/g).length;
          } else {
            LeftPairCount = 0;
          }
          if (Statement.value.match(/\)/g) !== null) {
            RightPairCount = Statement.value.match(/\)/g).length;
          } else {
            RightPairCount = 0;
          }
          if (LeftPairCount <= RightPairCount) {
            return;
          }
          break;
        case '(':
          if (Statement.value === '0') {
            Statement.value = '';
          }
          HasGetResult = false;
          break;
        case '=':
          var stmt = Statement.value;
          Statement.value = PairLoop(Statement.value);
          Statement.value = PercentLoop(Statement.value);
          Statement.value = MDLoop(Statement.value);
          Statement.value = PSLoop(Statement.value);
          var result = Statement.value;
          ResultListAdd(stmt, result);
          HasGetResult = true;
          return;
        default:
          HasGetResult = false;
          if (ChangeOperatReg.test(Statement.value)) {
            Statement.value = Statement.value.replace(ChangeOperatReg, '');
          }
          if (func === '-' && Statement.value === '0') {
            Statement.value = '';
          } else if (func !== '-' && Statement.value === '0') {
            return;
          }
          break;
      }

      Statement.value = Statement.value + func;
    };

    //  將結果加入結果清單
    function ResultListAdd(stmt, result) {
      // Array.unshift 將新的結果加入結果清單的第一個
      ResultArr.value.unshift([stmt, result]);
    }

    const SetStatement = (stmt) => {
      Statement.value = stmt;
    };

    // 括號處理的迴圈
    function PairLoop(stmt) {
      let thisStmt = stmt;
      while (PairReg.test(thisStmt)) {
        let stmtArr = thisStmt.match(PairReg);
        let inPair = stmtArr[1];
        inPair = PercentLoop(inPair);
        inPair = MDLoop(inPair);
        inPair = PSLoop(inPair);
        thisStmt = thisStmt.replace(stmtArr[0], inPair);
      }
      return thisStmt;
    }

    // 百分比處理的迴圈
    function PercentLoop(stmt) {
      let thisStmt = stmt;
      while (PercentReg.test(thisStmt)) {
        let stmtArr = thisStmt.match(PercentReg);
        thisStmt = thisStmt.replace(stmtArr[0], (parseFloat(stmtArr[1]) / 100).toString());
      }
      return thisStmt;
    }

    // 乘除處理的迴圈
    function MDLoop(stmt) {
      while (MDReg.test(stmt)) {
        let stmtArr = stmt.match(MDReg);
        stmt = stmt.replace(stmtArr[0], MultiplyAndDivided(stmtArr[1], stmtArr[2], stmtArr[3]));
      }
      return stmt;
    }

    // 加減處理的迴圈
    function PSLoop(stmt) {
      while (PSReg.test(stmt)) {
        let stmtArr = stmt.match(PSReg);
        stmt = stmt.replace(stmtArr[0], PlusAndSubtract(stmtArr[1], stmtArr[2], stmtArr[3]));
      }
      return stmt;
    }

    // 乘除處理
    function MultiplyAndDivided(a, x, b) {
      let result;
      switch (x) {
        case '×':
        case '*':
          result = new Decimal(a).times(new Decimal(b)).toNumber();
          break;
        case '÷':
        case '/':
          result = Decimal.div(a, b).toNumber();
          break;
      }
      return result;
    }

    // 加減處理
    function PlusAndSubtract(a, x, b) {
      let result;
      switch (x) {
        case '+':
          result = Decimal.add(a, b).toNumber();
          break;
        case '-':
          result = Decimal.sub(a, b).toNumber();
          break;
      }
      return result;
    }

    // Vue return
    return {
      Statement,
      NumBtnClick,
      FuncBtnClick,
      HasGetResult,
      SetStatement,
      ResultArr,
    };
  },
};
</script>

<style scoped>
#statement {
  padding: 20px;
  border-radius: 18px;
}
.list-group {
  max-height: 420px;
  overflow-y: scroll;
  margin-bottom: 10px;
  -webkit-overflow-scrolling: touch;
}
.panel-primary {
  margin-top: 5px;
  padding-top: 10px;
  text-align: left;
}
.panel-default {
  padding-left: 10px;
  padding-top: 10px;
  padding-bottom: 20px;
  border-radius: 10px;
}
.cal {
  border-radius: 10px;
  border: 1px solid #000;
  margin-top: 20px;
  padding: 30px;
  max-width: 320px;
}
.list-group-item:hover {
  font-weight: bold;
}
.resultItem {
  color: #000;
  text-decoration: none;
}
/* width */
::-webkit-scrollbar {
  width: 10px;
}

/* Track */
::-webkit-scrollbar-track {
  background: #f1f1f1;
}

/* Handle */
::-webkit-scrollbar-thumb {
  background: #888;
}

/* Handle on hover */
::-webkit-scrollbar-thumb:hover {
  background: #555;
}
</style>
