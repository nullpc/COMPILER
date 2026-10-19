import { SampleProgram } from '../types/compiler';

export const SAMPLE_PROGRAMS: SampleProgram[] = [
  {
    id: 'hello-world',
    title: '01. Hello World in C',
    filename: 'main.c',
    category: 'Basics',
    description: 'Standard Hello World program in C to compile and run online.',
    code: `// Online C compiler to run C program online
#include <stdio.h>

int main() {
    // Write C code here
    printf("Hello, World!\\n");

    return 0;
}
`
  },
  {
    id: 'turbo-c-hello',
    title: '02. Turbo C++ Hello World (conio.h & clrscr)',
    filename: 'HELLO.C',
    category: 'Basics',
    description: 'Classic Turbo C++ foundation program with clrscr() and getch() from <conio.h>.',
    code: `#include <stdio.h>
#include <conio.h>

void main() {
    clrscr();
    printf("Hello, World! Turbo C++ runs right in your browser.\\n");
    printf("Press any key to exit...");
    getch();
}
`
  },
  {
    id: 'sum-two-numbers',
    title: '02. Sum of Two Numbers (scanf)',
    filename: 'SUM.C',
    category: 'Basics',
    description: 'Interactive input using scanf() with formatted console output.',
    code: `#include <stdio.h>
#include <conio.h>

void main() {
    int num1, num2, result;
    clrscr();
    
    printf("--- ADD TWO NUMBERS ---\\n");
    printf("Enter first integer: ");
    scanf("%d", &num1);
    
    printf("Enter second integer: ");
    scanf("%d", &num2);
    
    result = num1 + num2;
    printf("\\nSum of %d and %d is: %d\\n", num1, num2, result);
    
    printf("\\nPress any key to finish.");
    getch();
}
`
  },
  {
    id: 'even-odd',
    title: '03. Even or Odd Checker',
    filename: 'EVENODD.C',
    category: 'Control Flow',
    description: 'Basic conditional logic using if-else and modulus operator.',
    code: `#include <stdio.h>
#include <conio.h>

void main() {
    int n;
    clrscr();
    
    printf("Enter an integer: ");
    scanf("%d", &n);
    
    if (n % 2 == 0) {
        printf("%d is an EVEN number.\\n", n);
    } else {
        printf("%d is an ODD number.\\n", n);
    }
    
    getch();
}
`
  },
  {
    id: 'palindrome',
    title: '04. Palindrome Number Checker',
    filename: 'PALIN.C',
    category: 'Control Flow',
    description: 'Reverses digits to check if a number reads the same forwards and backwards.',
    code: `#include <stdio.h>
#include <conio.h>

void main() {
    int n, reversed = 0, remainder, original;
    clrscr();
    
    printf("Enter an integer: ");
    scanf("%d", &n);
    
    original = n;
    while (n != 0) {
        remainder = n % 10;
        reversed = reversed * 10 + remainder;
        n /= 10;
    }
    
    printf("Original: %d | Reversed: %d\\n", original, reversed);
    if (original == reversed) {
        printf("Result: %d is a PALINDROME!\\n", original);
    } else {
        printf("Result: %d is NOT a palindrome.\\n", original);
    }
    
    getch();
}
`
  },
  {
    id: 'armstrong',
    title: '05. Armstrong Number Checker',
    filename: 'ARMSTR.C',
    category: 'Control Flow',
    description: 'Determines whether the sum of cubes of digits equals the number itself (e.g., 153, 370).',
    code: `#include <stdio.h>
#include <conio.h>

void main() {
    int num, originalNum, remainder, result = 0;
    clrscr();
    
    printf("Enter a three-digit integer: ");
    scanf("%d", &num);
    originalNum = num;
    
    while (originalNum != 0) {
        remainder = originalNum % 10;
        result += remainder * remainder * remainder;
        originalNum /= 10;
    }
    
    if (result == num)
        printf("%d is an ARMSTRONG number.\\n", num);
    else
        printf("%d is NOT an Armstrong number.\\n", num);
        
    getch();
}
`
  },
  {
    id: 'fibonacci',
    title: '06. Fibonacci Series Generator',
    filename: 'FIBO.C',
    category: 'Control Flow',
    description: 'Generates the Fibonacci sequence up to N terms.',
    code: `#include <stdio.h>
#include <conio.h>

void main() {
    int n, t1 = 0, t2 = 1, nextTerm, i;
    clrscr();
    
    printf("Enter number of terms: ");
    scanf("%d", &n);
    
    printf("Fibonacci Series: ");
    for (i = 1; i <= n; ++i) {
        printf("%d, ", t1);
        nextTerm = t1 + t2;
        t1 = t2;
        t2 = nextTerm;
    }
    printf("\\n\\nFinished! Press any key...");
    getch();
}
`
  },
  {
    id: 'factorial-recursion',
    title: '07. Factorial using Recursion',
    filename: 'FACTREC.C',
    category: 'Functions & Pointers',
    description: 'Recursive function demonstrating stack frames and base conditions.',
    code: `#include <stdio.h>
#include <conio.h>

long int multiplyNumbers(int n) {
    if (n >= 1)
        return n * multiplyNumbers(n - 1);
    else
        return 1;
}

void main() {
    int n;
    clrscr();
    printf("Enter a positive integer: ");
    scanf("%d", &n);
    
    printf("Factorial of %d = %ld\\n", n, multiplyNumbers(n));
    getch();
}
`
  },
  {
    id: 'bubble-sort',
    title: '08. Bubble Sort on 1D Array',
    filename: 'SORT.C',
    category: 'Arrays & Strings',
    description: 'Sorts an array of elements in ascending order with step-by-step display.',
    code: `#include <stdio.h>
#include <conio.h>

void main() {
    int a[5] = {64, 34, 25, 12, 22};
    int n = 5, i, j, temp;
    clrscr();
    
    printf("Original array: ");
    for (i = 0; i < n; i++) printf("%d ", a[i]);
    printf("\\n");
    
    for (i = 0; i < n - 1; i++) {
        for (j = 0; j < n - i - 1; j++) {
            if (a[j] > a[j + 1]) {
                temp = a[j];
                a[j] = a[j + 1];
                a[j + 1] = temp;
            }
        }
    }
    
    printf("Sorted array in Ascending Order: ");
    for (i = 0; i < n; i++) printf("%d ", a[i]);
    printf("\\n\\nSorting complete. Press key...");
    getch();
}
`
  },
  {
    id: 'matrix-multiplication',
    title: '09. 2D Matrix Multiplication',
    filename: 'MATRIX.C',
    category: 'Arrays & Strings',
    description: 'Standard 2x2 matrix product using nested for-loops.',
    code: `#include <stdio.h>
#include <conio.h>

void main() {
    int a[2][2] = {{1, 2}, {3, 4}};
    int b[2][2] = {{5, 6}, {7, 8}};
    int c[2][2] = {{0, 0}, {0, 0}};
    int i, j, k;
    clrscr();
    
    printf("Multiplying Matrix A and Matrix B...\\n\\n");
    
    for (i = 0; i < 2; i++) {
        for (j = 0; j < 2; j++) {
            for (k = 0; k < 2; k++) {
                c[i][j] += a[i][k] * b[k][j];
            }
        }
    }
    
    printf("Result Matrix C (2x2):\\n");
    for (i = 0; i < 2; i++) {
        for (j = 0; j < 2; j++) {
            printf("%d\\t", c[i][j]);
        }
        printf("\\n");
    }
    
    getch();
}
`
  },
  {
    id: 'graphics-concentric',
    title: '10. Concentric Circles (graphics.h)',
    filename: 'CIRCLES.C',
    category: 'Graphics.h',
    description: 'Borland Graphics Interface (BGI) rendering concentric circles with custom color palette.',
    code: `#include <graphics.h>
#include <conio.h>

void main() {
    int gd = DETECT, gm;
    int x, y, r;
    
    initgraph(&gd, &gm, "C:\\\\TURBOC3\\\\BGI");
    
    outtextxy(180, 25, "DYPCET - COMPUTER GRAPHICS LAB");
    
    x = 320;
    y = 220;
    
    for (r = 20; r <= 160; r += 20) {
        setcolor(r / 15);
        circle(x, y, r);
    }
    
    rectangle(100, 60, 540, 380);
    outtextxy(200, 410, "Press any key to close graphics...");
    
    getch();
    closegraph();
}
`
  },
  {
    id: 'graphics-shapes',
    title: '11. Geometric Shapes & Fill (graphics.h)',
    filename: 'SHAPES.C',
    category: 'Graphics.h',
    description: 'Demonstrates line(), rectangle(), bar(), ellipse(), and outtextxy() in EGA/VGA mode.',
    code: `#include <graphics.h>
#include <conio.h>

void main() {
    int gd = DETECT, gm;
    initgraph(&gd, &gm, "C:\\\\TURBOC3\\\\BGI");
    
    setcolor(14); /* Yellow */
    outtextxy(160, 20, "TURBO C++ BGI GEOMETRY SHOWCASE");
    
    /* Draw house and shapes */
    setcolor(11); /* Cyan */
    rectangle(200, 180, 440, 360);
    
    setcolor(12); /* Light Red */
    line(200, 180, 320, 90);
    line(320, 90, 440, 180);
    
    setcolor(10); /* Light Green */
    circle(320, 140, 25);
    
    setcolor(9); /* Light Blue */
    bar(280, 270, 360, 360);
    
    outtextxy(180, 410, "BGI Graphics Rendered Successfully!");
    
    getch();
    closegraph();
}
`
  },
  {
    id: 'cpp-student-class',
    title: '12. C++ Student Class & OOP',
    filename: 'STUDENT.CPP',
    category: 'C++ OOP',
    description: 'Demonstrates Object Oriented Programming with classes, data encapsulation, and member functions.',
    code: `#include <iostream.h>
#include <conio.h>

class Student {
private:
    char name[30];
    int rollNo;
    float marks;

public:
    void getDetails() {
        cout << "Enter student name: ";
        cin >> name;
        cout << "Enter roll number: ";
        cin >> rollNo;
        cout << "Enter marks percentage: ";
        cin >> marks;
    }

    void display() {
        cout << "\\n--- STUDENT REPORT CARD ---\\n";
        cout << "Name       : " << name << "\\n";
        cout << "Roll No    : " << rollNo << "\\n";
        cout << "Percentage : " << marks << "%\\n";
        if (marks >= 60.0) {
            cout << "Division   : First Division Honours\\n";
        } else {
            cout << "Division   : Second Division\\n";
        }
    }
};

void main() {
    clrscr();
    Student s1;
    cout << "=== DYPCET STUDENT PORTAL ===\\n\\n";
    s1.getDetails();
    s1.display();
    
    cout << "\\nPress any key to exit...";
    getch();
}
`
  }
];
