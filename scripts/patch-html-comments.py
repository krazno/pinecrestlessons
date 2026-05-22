#!/usr/bin/env python3
from pathlib import Path

INDEX = Path(__file__).resolve().parents[1] / "pinecrest-student" / "index.html"
T = "div"


def ide_line(n: int, html: str) -> str:
    return (
        f'            <{T} class="ide-line">'
        f'<span class="ide-ln">{n}</span>'
        f'<span class="ide-txt">{html}</span>'
        f"</{T}>\n"
    )


def replace_ide_body(text: str, fname: str, rows: list[str]) -> str:
    marker = (
        f'<span class="ide-fname">{fname}</span>\n'
        f"          </{T}>\n"
        f'          <{T} class="ide-body">\n'
    )
    start = text.index(marker) + len(marker)
    end = text.index(f"\n          </{T}>", start)
    return text[:start] + "".join(ide_line(i, r) for i, r in enumerate(rows, 1)) + text[end:]


def swap(text: str, old: str, new: str) -> str:
    if old not in text:
        raise KeyError("block not found")
    return text.replace(old, new, 1)


def main() -> None:
    text = INDEX.read_text()

    text = replace_ide_body(text, "parameter_and_argument.py", [
        '<span class="hl-com"># Define a function — name inside () is a parameter</span>',
        '<span class="hl-kw">def</span> <span class="hl-fn">my_function</span>(<span class="hl-name">name</span>): <span class="hl-com"># name is a parameter</span>',
        '  <span class="hl-kw">print</span>(<span class="hl-str">"Hello"</span>, <span class="hl-name">name</span>)',
        "",
        '<span class="hl-com"># Call the function — "Emil" is an argument</span>',
        '<span class="hl-fn">my_function</span>(<span class="hl-str">"Emil"</span>)',
    ])

    text = replace_ide_body(text, "pokemon_attack.py", [
        '<span class="hl-com"># Define the attack function (three parameters)</span>',
        '<span class="hl-kw">def</span> <span class="hl-fn">pokemon_attack</span>(<span class="hl-name">pokemon</span>, <span class="hl-name">move</span>, <span class="hl-name">power</span>):',
        '  <span class="hl-kw">print</span>(<span class="hl-name">pokemon</span>, <span class="hl-str">"used"</span>, <span class="hl-name">move</span> + <span class="hl-str">"!"</span>)',
        '  <span class="hl-name">damage</span> = <span class="hl-name">power</span> * <span class="hl-num">2</span> <span class="hl-com"># math: double the power</span>',
        '  <span class="hl-kw">print</span>(<span class="hl-str">"Damage ="</span>, <span class="hl-name">damage</span>)',
        "",
        '<span class="hl-com"># Call with three positional arguments (order matters)</span>',
        '<span class="hl-fn">pokemon_attack</span>(<span class="hl-str">"Pikachu"</span>, <span class="hl-str">"Thunder Shock"</span>, <span class="hl-num">40</span>)',
    ])

    text = replace_ide_body(text, "pinecrest_numbers.py", [
        '<span class="hl-com"># Function receives one list argument</span>',
        '<span class="hl-kw">def</span> <span class="hl-fn">show_numbers</span>(<span class="hl-name">numbers</span>): <span class="hl-com"># one list argument</span>',
        '  <span class="hl-name">spot</span> = <span class="hl-num">1</span> <span class="hl-com"># position counter starts at 1</span>',
        '  <span class="hl-kw">for</span> <span class="hl-name">n</span> <span class="hl-kw">in</span> <span class="hl-name">numbers</span>: <span class="hl-com"># loop through the list</span>',
        '    <span class="hl-kw">print</span>(<span class="hl-str">"Position"</span>, <span class="hl-name">spot</span>, <span class="hl-str">":"</span>, <span class="hl-name">n</span>)',
        '    <span class="hl-name">spot</span> = <span class="hl-name">spot</span> + <span class="hl-num">1</span> <span class="hl-com"># move to next position</span>',
        "",
        '<span class="hl-com"># Our list of 10 numbers (67 is the passcode)</span>',
        '<span class="hl-name">number_set</span> = [<span class="hl-num">12</span>, <span class="hl-num">67</span>, <span class="hl-num">34</span>, <span class="hl-num">8</span>, <span class="hl-num">91</span>, <span class="hl-num">23</span>, <span class="hl-num">5</span>, <span class="hl-num">44</span>, <span class="hl-num">19</span>, <span class="hl-num">72</span>]',
        '<span class="hl-fn">show_numbers</span>(<span class="hl-name">number_set</span>) <span class="hl-com"># 67 is at position 2</span>',
    ])

    text = swap(
        text,
        f"""              <{T} class="ide-line"><span class="ide-ln">1</span><span class="ide-txt"><span class="hl-kw">import</span> turtle</span></{T}>
              <{T} class="ide-line"><span class="ide-ln">2</span><span class="ide-txt"><span class="hl-name">t</span> = turtle.Turtle()</span></{T}>
              <{T} class="ide-line"><span class="ide-ln">3</span><span class="ide-txt"><span class="hl-name">t</span>.forward(<span class="hl-num">100</span>)</span></{T}>
              <{T} class="ide-line"><span class="ide-ln">4</span><span class="ide-txt">turtle.done()</span></{T}>""",
        f"""              <{T} class="ide-line"><span class="ide-ln">1</span><span class="ide-txt"><span class="hl-com"># Load the turtle drawing library</span></span></{T}>
              <{T} class="ide-line"><span class="ide-ln">2</span><span class="ide-txt"><span class="hl-kw">import</span> turtle</span></{T}>
              <{T} class="ide-line"><span class="ide-ln">3</span><span class="ide-txt"><span class="hl-com"># Create a turtle named t</span></span></{T}>
              <{T} class="ide-line"><span class="ide-ln">4</span><span class="ide-txt"><span class="hl-name">t</span> = turtle.Turtle()</span></{T}>
              <{T} class="ide-line"><span class="ide-ln">5</span><span class="ide-txt"><span class="hl-com"># Draw a line 100 steps forward</span></span></{T}>
              <{T} class="ide-line"><span class="ide-ln">6</span><span class="ide-txt"><span class="hl-name">t</span>.forward(<span class="hl-num">100</span>)</span></{T}>
              <{T} class="ide-line"><span class="ide-ln">7</span><span class="ide-txt"><span class="hl-com"># Keep the window open</span></span></{T}>
              <{T} class="ide-line"><span class="ide-ln">8</span><span class="ide-txt">turtle.done()</span></{T}>""",
    )

    text = swap(
        text,
        f"""              <{T} class="ide-line"><span class="ide-ln">1</span><span class="ide-txt"><span class="hl-name">first</span> = <span class="hl-num">6</span></span></{T}>
              <{T} class="ide-line"><span class="ide-ln">2</span><span class="ide-txt"><span class="hl-name">second</span> = <span class="hl-num">7</span></span></{T}>
              <{T} class="ide-line"><span class="ide-ln">3</span><span class="ide-txt"><span class="hl-kw">print</span>(<span class="hl-name">first</span> + <span class="hl-name">second</span>)  <span class="hl-com"># 13</span></span></{T}>""",
        f"""              <{T} class="ide-line"><span class="ide-ln">1</span><span class="ide-txt"><span class="hl-com"># Numbers — + adds them (math)</span></span></{T}>
              <{T} class="ide-line"><span class="ide-ln">2</span><span class="ide-txt"><span class="hl-name">first</span> = <span class="hl-num">6</span></span></{T}>
              <{T} class="ide-line"><span class="ide-ln">3</span><span class="ide-txt"><span class="hl-name">second</span> = <span class="hl-num">7</span></span></{T}>
              <{T} class="ide-line"><span class="ide-ln">4</span><span class="ide-txt"><span class="hl-kw">print</span>(<span class="hl-name">first</span> + <span class="hl-name">second</span>)  <span class="hl-com"># 13</span></span></{T}>""",
    )

    text = swap(
        text,
        f"""              <{T} class="ide-line"><span class="ide-ln">1</span><span class="ide-txt"><span class="hl-name">first</span> = <span class="hl-str">"6"</span></span></{T}>
              <{T} class="ide-line"><span class="ide-ln">2</span><span class="ide-txt"><span class="hl-name">second</span> = <span class="hl-str">"7"</span></span></{T}>
              <{T} class="ide-line"><span class="ide-ln">3</span><span class="ide-txt"><span class="hl-kw">print</span>(<span class="hl-name">first</span> + <span class="hl-name">second</span>)  <span class="hl-com"># "67"</span></span></{T}>""",
        f"""              <{T} class="ide-line"><span class="ide-ln">1</span><span class="ide-txt"><span class="hl-com"># Strings (text) — + joins them</span></span></{T}>
              <{T} class="ide-line"><span class="ide-ln">2</span><span class="ide-txt"><span class="hl-name">first</span> = <span class="hl-str">"6"</span></span></{T}>
              <{T} class="ide-line"><span class="ide-ln">3</span><span class="ide-txt"><span class="hl-name">second</span> = <span class="hl-str">"7"</span></span></{T}>
              <{T} class="ide-line"><span class="ide-ln">4</span><span class="ide-txt"><span class="hl-kw">print</span>(<span class="hl-name">first</span> + <span class="hl-name">second</span>)  <span class="hl-com"># "67"</span></span></{T}>""",
    )

    INDEX.write_text(text)
    print("ok")


if __name__ == "__main__":
    main()
