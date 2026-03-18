
-- Clear existing seed data
DELETE FROM lesson_progress;
DELETE FROM enrollments;
DELETE FROM lessons;
DELETE FROM modules;
DELETE FROM courses;

-- Insert one course
INSERT INTO courses (id, title, slug, description, instructor_id, is_published, price, thumbnail_url)
VALUES (
  'c1c1c1c1-c1c1-41c1-81c1-c1c1c1c1c1c1',
  'Python Programming: From Zero to Hero',
  'python-zero-to-hero',
  'A hands-on introduction to Python programming. Learn variables, data structures, control flow, and functions — then practice with an interactive code editor right in your browser.',
  '00000000-0000-0000-0000-000000000001',
  true,
  0,
  'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=800&q=80'
);

-- Insert one module
INSERT INTO modules (id, course_id, title, description, order_index)
VALUES (
  'a1a1a1a1-a1a1-41a1-81a1-a1a1a1a1a1a1',
  'c1c1c1c1-c1c1-41c1-81c1-c1c1c1c1c1c1',
  'Python Fundamentals',
  'Core building blocks of Python programming',
  0
);

-- Lesson 1: Introduction
INSERT INTO lessons (id, module_id, title, type, duration, order_index, content)
VALUES (
  'b1b1b1b1-b1b1-41b1-81b1-b1b1b1b1b1b1',
  'a1a1a1a1-a1a1-41a1-81a1-a1a1a1a1a1a1',
  'Why Python?',
  'reading',
  '5 min',
  0,
  '{"body":"Python is one of the most popular programming languages in the world, and for good reason. It powers everything from web applications and data analysis to machine learning and automation.\n\nWhat makes Python special?\n\n• Readable syntax — Python reads almost like English, making it the perfect first language.\n• Huge ecosystem — Over 400,000 packages on PyPI for everything from web scraping to deep learning.\n• Versatile — Used at companies like Google, Netflix, Instagram, and NASA.\n• Interactive — You can experiment with code in real-time, which is exactly what we will do in this course.\n\nIn this course, you will learn the fundamentals step by step, with interactive code editors so you can practice as you go. No installations required — everything runs right here in your browser.\n\nLet us get started!","code_snippets":[{"title":"Your first Python program","description":"Try modifying the message and clicking Run!","code":"# Welcome to Python!\nprint(\"Hello, World!\")\nprint(\"I am learning Python\")"}]}'::jsonb
);

-- Lesson 2: Variables & Data Types
INSERT INTO lessons (id, module_id, title, type, duration, order_index, content)
VALUES (
  'b2b2b2b2-b2b2-41b2-81b2-b2b2b2b2b2b2',
  'a1a1a1a1-a1a1-41a1-81a1-a1a1a1a1a1a1',
  'Variables and Data Types',
  'reading',
  '10 min',
  1,
  '{"body":"Variables are containers for storing data. In Python, you do not need to declare a type — Python figures it out automatically.\n\nThe basic data types you will use most often are:\n\n• int — whole numbers like 42 or -7\n• float — decimal numbers like 3.14 or -0.5\n• str — text strings like hello or world\n• bool — True or False\n• list — ordered collections like [1, 2, 3]\n\nYou create a variable simply by assigning a value with the = operator. Python uses dynamic typing, so the same variable can hold different types of data (though it is best practice to keep types consistent).\n\nYou can check any variable type using the built-in type() function.","code_snippets":[{"title":"Working with variables","description":"Create variables and check their types","code":"# Creating variables\nname = \"Alice\"\nage = 28\nheight = 5.6\nis_student = True\n\nprint(f\"Name: {name}\")\nprint(f\"Age: {age}\")\nprint(f\"Height: {height}\")\nprint(f\"Student: {is_student}\")\n\n# Check types\nprint(f\"Type of name: {type(name)}\")\nprint(f\"Type of age: {type(age)}\")"},{"title":"String operations","description":"Try some common string methods","code":"message = \"hello, python world\"\n\nprint(message.upper())\nprint(message.title())\nprint(message.replace(\"world\", \"universe\"))\nprint(f\"Length: {len(message)}\")"}]}'::jsonb
);

-- Lesson 3: Lists, Loops & Functions
INSERT INTO lessons (id, module_id, title, type, duration, order_index, content)
VALUES (
  'b3b3b3b3-b3b3-41b3-81b3-b3b3b3b3b3b3',
  'a1a1a1a1-a1a1-41a1-81a1-a1a1a1a1a1a1',
  'Lists, Loops, and Functions',
  'reading',
  '12 min',
  2,
  '{"body":"Now that you know variables, let us explore three powerful tools that form the backbone of any Python program.\n\nLists are ordered collections that can hold any type of data. You can add, remove, sort, and slice them in many ways.\n\nLoops let you repeat actions. The for loop iterates over a sequence, while the while loop runs as long as a condition is true.\n\nFunctions let you package reusable blocks of code. You define them with the def keyword, and they can accept parameters and return values.\n\nCombining these three concepts, you can solve surprisingly complex problems with just a few lines of code.","code_snippets":[{"title":"Lists and loops","description":"Create a list and iterate over it","code":"scores = [85, 92, 78, 95, 88]\n\nfor i, score in enumerate(scores, 1):\n    status = \"Pass\" if score >= 80 else \"Needs work\"\n    print(f\"Test {i}: {score} - {status}\")\n\nprint(f\"\\nAverage: {sum(scores) / len(scores):.1f}\")\nprint(f\"Highest: {max(scores)}\")\nprint(f\"Lowest: {min(scores)}\")"},{"title":"Writing functions","description":"Define and call your own functions","code":"def greet(name, greeting=\"Hello\"):\n    return f\"{greeting}, {name}!\"\n\ndef calculate_bmi(weight_kg, height_m):\n    bmi = weight_kg / (height_m ** 2)\n    if bmi < 18.5:\n        category = \"underweight\"\n    elif bmi < 25:\n        category = \"normal\"\n    elif bmi < 30:\n        category = \"overweight\"\n    else:\n        category = \"obese\"\n    return bmi, category\n\nprint(greet(\"Alice\"))\nprint(greet(\"Bob\", \"Hey\"))\n\nbmi, cat = calculate_bmi(70, 1.75)\nprint(f\"BMI: {bmi:.1f} ({cat})\")"}]}'::jsonb
);

-- Lesson 4: Quiz
INSERT INTO lessons (id, module_id, title, type, duration, order_index, content)
VALUES (
  'b4b4b4b4-b4b4-41b4-81b4-b4b4b4b4b4b4',
  'a1a1a1a1-a1a1-41a1-81a1-a1a1a1a1a1a1',
  'Quiz: Python Basics',
  'quiz',
  '5 min',
  3,
  '{"questions":[{"id":"q1","question":"What will print(type(3.14)) output?","options":["<class ''int''>","<class ''float''>","<class ''str''>","<class ''number''>"],"correctAnswer":1,"explanation":"3.14 is a decimal number, which Python represents as a float."},{"id":"q2","question":"Which method converts a string to uppercase?","options":[".capitalize()",".upper()",".big()",".toUpperCase()"],"correctAnswer":1,"explanation":"The .upper() method returns a copy of the string with all characters in uppercase."},{"id":"q3","question":"What does len([1, 2, 3]) return?","options":["2","3","4","Error"],"correctAnswer":1,"explanation":"len() returns the number of items. [1, 2, 3] has 3 elements."},{"id":"q4","question":"How do you define a function in Python?","options":["function myFunc():","def my_func():","fun my_func():","define my_func():"],"correctAnswer":1,"explanation":"Python uses the def keyword to define functions."},{"id":"q5","question":"What is the output of: print(f\"{2 + 3}\")?","options":["2 + 3","5","{2 + 3}","Error"],"correctAnswer":1,"explanation":"f-strings evaluate expressions inside curly braces, so {2 + 3} becomes 5."}]}'::jsonb
);
