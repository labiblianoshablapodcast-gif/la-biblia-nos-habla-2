from __future__ import annotations

import json
import re
import urllib.parse
import urllib.request
import zipfile
from collections import defaultdict
from pathlib import Path

from bs4 import BeautifulSoup, NavigableString, Tag

SOURCE_PAGE = "https://scriptureearth.org/00spa.php?idx=264&iso_code=kek&language=Kekch%C3%AD"
EPUB_NAME = "KekchiBible_epub3.epub"
OUT_DIR = Path("data/qeqchi")
MODULE_PATH = Path("lib/qeqchi-data.ts")

# Códigos que usa nuestra aplicación, en el mismo orden de los 66 libros del EPUB.
CODES = [
    "GEN","EXO","LEV","NUM","DEU","JOS","JDG","RUT","1SA","2SA","1KI","2KI","1CH","2CH","EZR","NEH","EST","JOB","PSA","PRO","ECC","SNG","ISA","JER","LAM","EZK","DAN","HOS","JOL","AMO","OBA","JON","MIC","NAM","HAB","ZEP","HAG","ZEC","MAL",
    "MAT","MRK","LUK","JHN","ACT","ROM","1CO","2CO","GAL","EPH","PHP","COL","1TH","2TH","1TI","2TI","TIT","PHM","HEB","JAS","1PE","2PE","1JN","2JN","3JN","JUD","REV",
]
EXPECTED_CHAPTERS = [
    50,40,27,36,34,24,21,4,31,24,22,25,29,36,10,13,10,42,150,31,12,8,66,52,5,48,12,14,3,9,1,4,7,3,3,3,2,14,4,
    28,16,24,21,28,16,16,13,6,6,4,4,5,3,6,4,3,1,13,5,5,3,5,1,1,1,22,
]


def request_bytes(url: str) -> bytes:
    request = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0 LaBibliaNosHabla/1.0"})
    with urllib.request.urlopen(request, timeout=60) as response:
        return response.read()


def discover_epub_url() -> str:
    html = request_bytes(SOURCE_PAGE).decode("utf-8", "replace")
    candidates: list[str] = []

    # Enlace explícito en href/src.
    for match in re.findall(r'''(?:href|src)=["']([^"']+)["']''', html, flags=re.I):
        decoded = urllib.parse.unquote(match)
        if ".epub" in decoded.lower() or EPUB_NAME.lower() in decoded.lower():
            candidates.append(urllib.parse.urljoin(SOURCE_PAGE, match))

    # Si el nombre aparece en JavaScript, captura la ruta alrededor de él.
    for match in re.findall(r'''["']([^"']*KekchiBible_epub3\.epub[^"']*)["']''', html, flags=re.I):
        candidates.append(urllib.parse.urljoin(SOURCE_PAGE, match))

    # Rutas de respaldo usadas históricamente por Scripture Earth.
    candidates.extend([
        f"https://www.scriptureearth.org/data/kek/{EPUB_NAME}",
        f"https://www.scriptureearth.org/data/kek/epub/{EPUB_NAME}",
        f"https://scriptureearth.org/data/kek/{EPUB_NAME}",
        f"https://scriptureearth.org/data/kek/epub/{EPUB_NAME}",
    ])

    seen: set[str] = set()
    for url in candidates:
        if url in seen:
            continue
        seen.add(url)
        try:
            data = request_bytes(url)
            if data[:2] == b"PK" and len(data) > 100_000:
                Path("/tmp/qeqchi.epub").write_bytes(data)
                print(f"EPUB encontrado: {url} ({len(data)} bytes)")
                return url
        except Exception as exc:
            print(f"No funcionó {url}: {exc}")

    raise RuntimeError("No se pudo localizar el EPUB de Scripture Earth. Revise la página fuente o la ruta del archivo.")


def clean_text(value: str) -> str:
    # Solo compacta espacios de maquetación; no cambia palabras ni puntuación.
    return re.sub(r"\s+", " ", value).strip()


def parse_part(raw_html: str) -> dict[str, list[list[object]]]:
    soup = BeautifulSoup(raw_html, "html.parser")
    body = soup.select_one(".scrBook") or soup
    chapters: dict[int, dict[int, list[str]]] = defaultdict(lambda: defaultdict(list))
    chapter: int | None = None
    verse: int | None = None

    for node in body.descendants:
        if isinstance(node, Tag):
            classes = set(node.get("class", []))
            if "Chapter_Number" in classes:
                match = re.search(r"\d+", clean_text(node.get_text()))
                chapter = int(match.group()) if match else None
                verse = None
            elif chapter is not None and ({"Verse_Number", "Verse_Number1"} & classes):
                match = re.search(r"\d+", clean_text(node.get_text()))
                verse = int(match.group()) if match else None
            continue

        if not isinstance(node, NavigableString) or chapter is None or verse is None:
            continue

        parent = node.parent
        if parent:
            classes = set(parent.get("class", []))
            if classes & {"Verse_Number", "Verse_Number1", "Chapter_Number", "chapternumberlink", "scrBookName", "scrBookCode"}:
                continue
            if parent.name in {"script", "style"}:
                continue
            # Notas editoriales separadas no se mezclan con el texto del versículo.
            if any("footnote" in item.lower() or item.lower().endswith("note") for item in classes):
                continue

        text = str(node)
        if text.strip():
            chapters[chapter][verse].append(text)

    result: dict[str, list[list[object]]] = {}
    for chapter_number, verse_map in chapters.items():
        verses: list[list[object]] = []
        for verse_number, pieces in sorted(verse_map.items()):
            text = clean_text("".join(pieces))
            if text:
                verses.append([verse_number, text])
        if verses:
            result[str(chapter_number)] = verses
    return result


def build_data() -> None:
    discover_epub_url()
    epub_path = Path("/tmp/qeqchi.epub")
    books: dict[str, dict[str, list[list[object]]]] = {code: {} for code in CODES}

    with zipfile.ZipFile(epub_path) as archive:
        for name in archive.namelist():
            match = re.match(r"OEBPS/PartFile(\d{5})_(?:\d+)?\.html$", name)
            if not match:
                continue
            index = int(match.group(1))
            if not 1 <= index <= 66:
                continue
            code = CODES[index - 1]
            parsed = parse_part(archive.read(name).decode("utf-8-sig", "replace"))
            books[code].update(parsed)

    OUT_DIR.mkdir(parents=True, exist_ok=True)
    errors: list[str] = []
    for code, expected in zip(CODES, EXPECTED_CHAPTERS):
        data = books[code]
        actual = len(data)
        if actual != expected:
            errors.append(f"{code}: se esperaban {expected} capítulos y se obtuvieron {actual}")
        (OUT_DIR / f"{code}.json").write_text(
            json.dumps(data, ensure_ascii=False, separators=(",", ":")), encoding="utf-8"
        )
        print(f"{code}: {actual} capítulos, {sum(len(v) for v in data.values())} versículos")

    if errors:
        raise RuntimeError("Validación incompleta:\n" + "\n".join(errors))

    imports = []
    entries = []
    for i, code in enumerate(CODES, start=1):
        var = f"B{i:02d}"
        imports.append(f'import {var} from "@/data/qeqchi/{code}.json";')
        entries.append(f'  "{code}":{var}')

    module = "\n".join(imports) + "\n\n" + '''type RawVerse=(number|string)[];\ntype RawBook=Record<string,RawVerse[]>;\n\nconst QEQCHI_DATA:Record<string,RawBook>={\n''' + ",\n".join(entries) + "\n};\n\n" + '''export function getLocalQeqchiVerses(code:string,chapter:number){\n  return QEQCHI_DATA[code]?.[String(chapter)]??[];\n}\n\nexport function hasLocalQeqchiBook(code:string){\n  return Boolean(QEQCHI_DATA[code]);\n}\n'''
    MODULE_PATH.write_text(module, encoding="utf-8")

    print("Importación completa: 66 libros listos para la app.")


if __name__ == "__main__":
    build_data()
