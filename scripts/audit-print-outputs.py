#!/usr/bin/env python3
"""Verify static lesson examples: code stdout matches displayed answers."""

from __future__ import annotations

import io
import contextlib
import sys

CASES: list[tuple[str, str, str]] = [
    (
        "send_out_pokemon",
        """
def send_out_pokemon(pokemon):
    print("Go " + pokemon + " !")

send_out_pokemon("Pikachu")
""",
        "Go Pikachu !",
    ),
    (
        "pokemon_attack",
        """
def pokemon_attack(pokemon, move, power):
    print(pokemon + " used " + move + "!")
    damage = power * 2
    print("Damage = " + str(damage))

pokemon_attack("Pikachu", "Thunder Shock", 40)
""",
        "Pikachu used Thunder Shock!\nDamage = 80",
    ),
    (
        "show_numbers",
        """
def show_numbers(numbers):
    spot = 1
    for n in numbers:
        if spot == 2:
            print("Position 2 : " + str(n))
        spot = spot + 1

show_numbers([12, 67, 34, 8, 91, 23, 5, 44, 19, 72])
""",
        "Position 2 : 67",
    ),
    (
        "predict_grade",
        "grade = 6\nprint(grade)",
        "6",
    ),
    (
        "predict_numbers",
        "six = 6\nseven = 7\nprint(six + seven)",
        "13",
    ),
    (
        "predict_strings",
        (
            'grade_six = "6"\ngrade_seven = "7"\n'
            "def make_grade_code(first_grade, second_grade):\n"
            "    code = first_grade + second_grade\n"
            "    return code\n"
            "answer = make_grade_code(grade_six, grade_seven)\n"
            "print(answer)"
        ),
        "67",
    ),
    (
        "predict_str_join",
        'print(str(6) + str(7))',
        "67",
    ),
]


def run_code(code: str) -> str:
    buf = io.StringIO()
    with contextlib.redirect_stdout(buf):
        exec(code, {"__name__": "__main__"})
    return buf.getvalue().rstrip("\n")


def main() -> int:
    failed = 0
    for name, code, expected in CASES:
        got = run_code(code.strip())
        if got != expected:
            failed += 1
            print(f"FAIL {name}")
            print(f"  expected: {expected!r}")
            print(f"  got:      {got!r}")
        else:
            print(f"ok   {name}")
    return 1 if failed else 0


if __name__ == "__main__":
    sys.exit(main())
