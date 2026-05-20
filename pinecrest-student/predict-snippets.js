const PREDICT_SNIPPETS = [
  {
    title: 'Snippet 1: The Starting Grade',
    code: `# What will Python print?\n# A. 6\n# B. 7\n# C. 67\n\nstudent_name = "Mia"\ncurrent_grade = 6\n\ndef get_grade(grade):\n    final_answer = grade\n    return final_answer\n\nanswer = get_grade(current_grade)\n\nprint(answer)`,
    answer: '6',
    note: '',
    trace: [
      { lines: [6], title: 'Create a variable', body: 'student_name stores the text "Mia".', vars: 'student_name = "Mia"' },
      { lines: [7], title: 'Store the grade number', body: 'current_grade is the number 6 (not text).', vars: 'current_grade = 6' },
      { lines: [9], title: 'Define the function', body: 'get_grade is a reusable mini-machine. It will receive one value called grade.', vars: '' },
      { lines: [10, 11], title: 'Inside the function', body: 'final_answer gets whatever was passed in. Then return sends that value back.', vars: 'final_answer = grade → return final_answer' },
      { lines: [13], title: 'Call the function', body: 'Python runs get_grade(6). The function returns 6, so answer becomes 6.', vars: 'answer = 6' },
      { lines: [15], title: 'Print the result', body: 'print shows the value of answer on the screen.', vars: 'Output: 6' }
    ]
  },
  {
    title: 'Snippet 2: Moving Up One Grade',
    code: `# What will Python print?\n# A. 6\n# B. 7\n# C. 67\n\nstudent_name = "Leo"\ncurrent_grade = 6\nyears_later = 1\n\ndef next_grade(grade, years):\n    new_grade = grade + years\n    return new_grade\n\nanswer = next_grade(current_grade, years_later)\n\nprint(answer)`,
    answer: '7',
    note: '',
    trace: [
      { lines: [7], title: 'Starting grade', body: 'current_grade is 6.', vars: 'current_grade = 6' },
      { lines: [8], title: 'Years to add', body: 'years_later is 1.', vars: 'years_later = 1' },
      { lines: [10], title: 'Define next_grade', body: 'This function adds two numbers.', vars: '' },
      { lines: [11], title: 'Add inside the function', body: '6 + 1 = 7. Numbers add with +.', vars: 'new_grade = 7' },
      { lines: [12], title: 'Return the sum', body: 'The function gives back 7.', vars: 'return 7' },
      { lines: [14], title: 'Call the function', body: 'next_grade(6, 1) returns 7.', vars: 'answer = 7' },
      { lines: [16], title: 'Print', body: 'Screen shows 7.', vars: 'Output: 7' }
    ]
  },
  {
    title: 'Snippet 3: Numbers Joined as Text',
    code: `# What will Python print?\n# A. 6\n# B. 7\n# C. 67\n\nfirst_number = 6\nsecond_number = 7\n\ndef combine_numbers(number_one, number_two):\n    text_one = str(number_one)\n    text_two = str(number_two)\n    combined = text_one + text_two\n    return combined\n\nanswer = combine_numbers(first_number, second_number)\n\nprint(answer)`,
    answer: '67',
    note: 'This prints 67, not 13, because the numbers are turned into strings before being added.',
    trace: [
      { lines: [6, 7], title: 'Two numbers', body: 'first_number is 6 and second_number is 7.', vars: '6 and 7 (numbers)' },
      { lines: [10], title: 'Function starts', body: 'combine_numbers will join text, not add math.', vars: '' },
      { lines: [11], title: 'Convert to text', body: 'str(6) becomes "6" (text).', vars: 'text_one = "6"' },
      { lines: [12], title: 'Convert second number', body: 'str(7) becomes "7".', vars: 'text_two = "7"' },
      { lines: [13], title: 'Join text with +', body: '"6" + "7" glues them together → "67". Not 13!', vars: 'combined = "67"' },
      { lines: [14], title: 'Return', body: 'Function returns "67".', vars: 'return "67"' },
      { lines: [16], title: 'Print', body: 'print shows 67.', vars: 'Output: 67' }
    ]
  },
  {
    title: 'Snippet 4: The If Statement',
    code: `# What will Python print?\n# A. 6\n# B. 7\n# C. 67\n\nstudent_name = "Ava"\nquiz_score = 75\npassing_score = 80\n\ndef choose_number(score, goal):\n    if score > goal:\n        result = 7\n    else:\n        result = 6\n\n    return result\n\nanswer = choose_number(quiz_score, passing_score)\n\nprint(answer)`,
    answer: '6',
    note: '',
    trace: [
      { lines: [7, 8], title: 'Scores', body: 'quiz_score is 75. passing_score is 80.', vars: '75 and 80' },
      { lines: [11], title: 'Check the if', body: 'Is 75 > 80? No.', vars: 'False' },
      { lines: [14], title: 'Run the else', body: 'Because the if was false, Python runs else: result = 6.', vars: 'result = 6' },
      { lines: [16], title: 'Return', body: 'Function returns 6.', vars: 'return 6' },
      { lines: [18], title: 'Print', body: 'Output is 6.', vars: 'Output: 6' }
    ]
  },
  {
    title: 'Snippet 5: Greater Than or Equal To',
    code: `# What will Python print?\n# A. 6\n# B. 7\n# C. 67\n\nstudent_name = "Noah"\nquiz_score = 90\nhonor_score = 90\n\ndef choose_number(score, goal):\n    if score >= goal:\n        result = 7\n    else:\n        result = 6\n\n    return result\n\nanswer = choose_number(quiz_score, honor_score)\n\nprint(answer)`,
    answer: '7',
    note: '',
    trace: [
      { lines: [7, 8], title: 'Both scores are 90', body: 'quiz_score and honor_score are equal.', vars: '90 and 90' },
      { lines: [11], title: 'Check >=', body: 'Is 90 >= 90? Yes! (equal counts too.)', vars: 'True' },
      { lines: [12], title: 'If branch runs', body: 'result becomes 7.', vars: 'result = 7' },
      { lines: [16], title: 'Return and print', body: 'Function returns 7. print shows 7.', vars: 'Output: 7' }
    ]
  },
  {
    title: 'Snippet 6: Text Variables',
    code: `# What will Python print?\n# A. 6\n# B. 7\n# C. 67\n\ngrade_six = "6"\ngrade_seven = "7"\n\ndef make_grade_code(first_grade, second_grade):\n    code = first_grade + second_grade\n    return code\n\nanswer = make_grade_code(grade_six, grade_seven)\n\nprint(answer)`,
    answer: '67',
    note: '"6" and "7" are text, so Python joins them together.',
    trace: [
      { lines: [6, 7], title: 'Text in quotes', body: '"6" and "7" are strings, not numbers.', vars: 'grade_six = "6", grade_seven = "7"' },
      { lines: [10], title: 'Function', body: 'make_grade_code joins two strings.', vars: '' },
      { lines: [11], title: 'Join with +', body: '"6" + "7" → "67".', vars: 'code = "67"' },
      { lines: [14], title: 'Call and print', body: 'answer is "67". print shows 67.', vars: 'Output: 67' }
    ]
  },
  {
    title: 'Snippet 7: Changing a Variable Inside a Function',
    code: `# What will Python print?\n# A. 6\n# B. 7\n# C. 67\n\nstarting_number = 6\nbonus_point = 1\n\ndef add_bonus(number, bonus):\n    number = number + bonus\n    return number\n\nanswer = add_bonus(starting_number, bonus_point)\n\nprint(answer)`,
    answer: '7',
    note: '',
    trace: [
      { lines: [6, 7], title: 'Start values', body: 'starting_number is 6. bonus_point is 1.', vars: '6 and 1' },
      { lines: [10], title: 'Inside add_bonus', body: 'number starts as 6 (copied from the call).', vars: 'number = 6' },
      { lines: [11], title: 'Add bonus', body: 'number = 6 + 1 → 7 inside the function.', vars: 'number = 7' },
      { lines: [12], title: 'Return', body: 'Returns 7 to the caller.', vars: 'return 7' },
      { lines: [14], title: 'Print', body: 'answer is 7.', vars: 'Output: 7' }
    ]
  },
  {
    title: 'Snippet 8: Function Uses Two Steps',
    code: `# What will Python print?\n# A. 6\n# B. 7\n# C. 67\n\nfirst_digit = 6\nsecond_digit = 7\n\ndef build_code(digit_one, digit_two):\n    digit_one_text = str(digit_one)\n    digit_two_text = str(digit_two)\n\n    secret_code = digit_one_text + digit_two_text\n\n    return secret_code\n\nanswer = build_code(first_digit, second_digit)\n\nprint(answer)`,
    answer: '67',
    note: '',
    trace: [
      { lines: [6, 7], title: 'Digits as numbers', body: '6 and 7 are stored as numbers first.', vars: 'first_digit = 6, second_digit = 7' },
      { lines: [11], title: 'Step 1: to text', body: 'Convert first digit to "6".', vars: 'digit_one_text = "6"' },
      { lines: [12], title: 'Step 2: to text', body: 'Convert second digit to "7".', vars: 'digit_two_text = "7"' },
      { lines: [14], title: 'Join', body: 'secret_code = "6" + "7" → "67".', vars: 'secret_code = "67"' },
      { lines: [17], title: 'Print', body: 'Output: 67.', vars: 'Output: 67' }
    ]
  },
  {
    title: 'Snippet 9: Careful With the Function Call',
    code: `# What will Python print?\n# A. 6\n# B. 7\n# C. 67\n\ngrade_today = 6\ngrade_next_year = 7\n\ndef pick_grade(first_choice, second_choice):\n    chosen_grade = second_choice\n    return chosen_grade\n\nanswer = pick_grade(grade_today, grade_next_year)\n\nprint(answer)`,
    answer: '7',
    note: '',
    trace: [
      { lines: [6, 7], title: 'Two grades passed in', body: 'first argument is 6, second is 7.', vars: '6 and 7' },
      { lines: [10], title: 'Function picks second', body: 'chosen_grade = second_choice → 7.', vars: 'chosen_grade = 7' },
      { lines: [11], title: 'Return', body: 'Returns 7 (ignores the 6).', vars: 'return 7' },
      { lines: [13], title: 'Print', body: 'Output: 7.', vars: 'Output: 7' }
    ]
  }
];