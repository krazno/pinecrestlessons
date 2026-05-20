const PREDICT_SNIPPETS = [
  {
    level: 'easy',
    title: 'Problem 1 · Pass the number through',
    code: `# What will Python print?
# A. 6    B. 7    C. 67

grade = 6

def show_grade(number):
    return number

answer = show_grade(grade)

print(answer)`,
    answer: '6',
    note: 'The function gives back the same number you sent in.',
    trace: [
      { lines: [4], title: 'Store the grade', body: 'grade is the number 6 (not text in quotes).', vars: 'grade = 6' },
      { lines: [6], title: 'Define the function', body: 'show_grade is a mini-recipe. It receives one value called number.', vars: '' },
      { lines: [7], title: 'Return it', body: 'return sends the number back to whoever called the function.', vars: 'return 6' },
      { lines: [9], title: 'Call the function', body: 'show_grade(6) runs the function. answer becomes 6.', vars: 'answer = 6' },
      { lines: [11], title: 'Print', body: 'print shows 6 on the screen.', vars: 'Output: 6' }
    ]
  },
  {
    level: 'easy',
    title: 'Problem 2 · Add one more',
    code: `# What will Python print?
# A. 6    B. 7    C. 67

grade = 6
extra = 1

def add_one(start, more):
    total = start + more
    return total

answer = add_one(grade, extra)

print(answer)`,
    answer: '7',
    note: 'Numbers use + for math: 6 + 1 = 7.',
    trace: [
      { lines: [4, 5], title: 'Two numbers', body: 'grade is 6. extra is 1.', vars: '6 and 1' },
      { lines: [7], title: 'Define add_one', body: 'This function adds two numbers.', vars: '' },
      { lines: [8], title: 'Add inside', body: '6 + 1 = 7. This is math, not text.', vars: 'total = 7' },
      { lines: [9], title: 'Return', body: 'The function gives back 7.', vars: 'return 7' },
      { lines: [11, 13], title: 'Call and print', body: 'add_one(6, 1) → 7. print shows 7.', vars: 'Output: 7' }
    ]
  },
  {
    level: 'medium',
    title: 'Problem 3 · Glue digits as text',
    code: `# What will Python print?
# A. 6    B. 7    C. 67

a = 6
b = 7

def glue_digits(left, right):
    left_text = str(left)
    right_text = str(right)
    glued = left_text + right_text
    return glued

answer = glue_digits(a, b)

print(answer)`,
    answer: '67',
    note: 'str() turns numbers into text. Then + joins text: "6" + "7" → 67 (not 13!).',
    trace: [
      { lines: [4, 5], title: 'Start with numbers', body: 'a is 6 and b is 7 — real numbers.', vars: '6 and 7' },
      { lines: [8], title: 'Turn into text', body: 'str(6) becomes "6" in quotes.', vars: 'left_text = "6"' },
      { lines: [9], title: 'Second digit', body: 'str(7) becomes "7".', vars: 'right_text = "7"' },
      { lines: [10], title: 'Join with +', body: 'Text + text glues side by side → "67".', vars: 'glued = "67"' },
      { lines: [15], title: 'Print', body: 'Screen shows 67.', vars: 'Output: 67' }
    ]
  },
  {
    level: 'medium',
    title: 'Problem 4 · if picks 6 or 7',
    code: `# What will Python print?
# A. 6    B. 7    C. 67

score = 75
goal = 80

def pick(score, goal):
    if score > goal:
        answer = 7
    else:
        answer = 6
    return answer

result = pick(score, goal)

print(result)`,
    answer: '6',
    note: '75 is not greater than 80, so Python uses the else branch.',
    trace: [
      { lines: [4, 5], title: 'The scores', body: 'score is 75. goal is 80.', vars: '75 and 80' },
      { lines: [8], title: 'Check if', body: 'Is 75 > 80? No — that is False.', vars: 'False → go to else' },
      { lines: [11], title: 'else runs', body: 'answer becomes 6.', vars: 'answer = 6' },
      { lines: [12], title: 'Return', body: 'Function returns 6.', vars: 'return 6' },
      { lines: [16], title: 'Print', body: 'Output: 6', vars: 'Output: 6' }
    ]
  },
  {
    level: 'medium',
    title: 'Problem 5 · >= counts as yes',
    code: `# What will Python print?
# A. 6    B. 7    C. 67

score = 90
goal = 90

def pick(score, goal):
    if score >= goal:
        answer = 7
    else:
        answer = 6
    return answer

result = pick(score, goal)

print(result)`,
    answer: '7',
    note: '>= means “greater than OR equal.” 90 equals 90, so the if branch runs.',
    trace: [
      { lines: [4, 5], title: 'Both are 90', body: 'score and goal match.', vars: '90 and 90' },
      { lines: [8], title: 'Check >=', body: 'Is 90 >= 90? Yes!', vars: 'True → use if' },
      { lines: [9], title: 'if branch', body: 'answer = 7.', vars: 'answer = 7' },
      { lines: [12, 16], title: 'Return and print', body: 'Returns 7. print shows 7.', vars: 'Output: 7' }
    ]
  },
  {
    level: 'medium',
    title: 'Problem 6 · Text in quotes',
    code: `# What will Python print?
# A. 6    B. 7    C. 67

six = "6"
seven = "7"

def join_text(first, second):
    code = first + second
    return code

answer = join_text(six, seven)

print(answer)`,
    answer: '67',
    note: '"6" and "7" are already text, so + joins them into "67".',
    trace: [
      { lines: [4, 5], title: 'Strings', body: 'Quotes mean text, not math numbers.', vars: 'six = "6", seven = "7"' },
      { lines: [8], title: 'Join', body: '"6" + "7" → "67".', vars: 'code = "67"' },
      { lines: [13], title: 'Print', body: 'Output: 67', vars: 'Output: 67' }
    ]
  },
  {
    level: 'medium',
    title: 'Problem 7 · Add inside the function',
    code: `# What will Python print?
# A. 6    B. 7    C. 67

start = 6
bonus = 1

def add_bonus(num, extra):
    num = num + extra
    return num

answer = add_bonus(start, bonus)

print(answer)`,
    answer: '7',
    note: 'Inside the function, num becomes 7 before it is returned.',
    trace: [
      { lines: [4, 5], title: 'Start values', body: 'start is 6. bonus is 1.', vars: '6 and 1' },
      { lines: [8], title: 'Add inside', body: 'num = 6 + 1 → 7 (only inside the function).', vars: 'num = 7' },
      { lines: [9], title: 'Return', body: 'Returns 7.', vars: 'return 7' },
      { lines: [13], title: 'Print', body: 'Output: 7', vars: 'Output: 7' }
    ]
  },
  {
    level: 'hard',
    title: 'Problem 8 · Two steps to make 67',
    code: `# What will Python print?
# A. 6    B. 7    C. 67

d1 = 6
d2 = 7

def make_code(one, two):
    t1 = str(one)
    t2 = str(two)
    code = t1 + t2
    return code

answer = make_code(d1, d2)

print(answer)`,
    answer: '67',
    note: 'Same idea as Problem 3, but split into more lines.',
    trace: [
      { lines: [4, 5], title: 'Digits', body: 'd1 and d2 are numbers first.', vars: '6 and 7' },
      { lines: [8, 9], title: 'Convert', body: 'str() makes "6" and "7".', vars: 't1 = "6", t2 = "7"' },
      { lines: [10], title: 'Glue', body: 'code = "67".', vars: 'code = "67"' },
      { lines: [15], title: 'Print', body: 'Output: 67', vars: 'Output: 67' }
    ]
  },
  {
    level: 'hard',
    title: 'Problem 9 · Watch the order',
    code: `# What will Python print?
# A. 6    B. 7    C. 67

today = 6
next_year = 7

def pick_number(first, second):
    answer = second
    return answer

result = pick_number(today, next_year)

print(result)`,
    answer: '7',
    note: 'The function uses the second value (7), not the first (6).',
    trace: [
      { lines: [4, 5], title: 'Two arguments', body: 'first gets 6, second gets 7 when you call the function.', vars: 'first = 6, second = 7' },
      { lines: [8], title: 'Pick second', body: 'answer = second → 7. The 6 is ignored.', vars: 'answer = 7' },
      { lines: [9], title: 'Return', body: 'Returns 7.', vars: 'return 7' },
      { lines: [13], title: 'Print', body: 'Output: 7', vars: 'Output: 7' }
    ]
  }
];
