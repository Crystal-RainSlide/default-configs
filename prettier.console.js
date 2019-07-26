// https://prettier.io/docs/en/options.html
function my$(selector, context) { // original $() on prettier.io don't support context, sad
  return Array.from(
    (context || document).querySelectorAll(selector)
  );
}
function id$(id) {
  return document.getElementById(id);
}

function getParsers(AO) {
 // Round 1
  // AO = 'parser: "<string>"parser: require("./my-parser")'; // 2019/7/26
  AO = AO.replace(/^parser: (.*)parser:/, "parser: $1 ||");

 // Round 2 preparing
  try {
    if (!id$("parser")) {
      throw "Parser heading not found: %c$('#parser')";
    }

    let parser = id$("parser").parentElement; // <h2> // 2019/7/26

    const distance = 8;
    for (let i = 0; i < distance && parser.tagName !== "UL"; i++) {
      parser = parser.nextElementSibling;
    }

    if (parser.tagName !== "UL") {
      throw "Parsers not found in " + distance + " elements below: %c$('#parser').parentElement";
    }
  } catch(e) {
    console.warn(e, "font-style: italic; font-weight: bold;");
    return AO;
  }
 // Round 2
  return AO.replace(
    "string",
    my$('li', parser).map(
      li => { // f => first
        const fNode = li.firstChild; // it can be a #text ...
        // const fElem = li.firstElementChild;
        // const fCode = li.querySelector(':scope > code:first-of-type');
        // fElCo = firstElemANDfirstCode
        const fElCo = li.querySelector(':scope > code:first-child');

        const result = fElCo.textContent.replace(/^"|"$/g, "");

        return fElCo === null ? undefined
             : fElCo === fNode ? result
             // : (\/\s+/.test(fNode.textContent) && fNode.nextSibling === fElCo) : result
             : undefined
      }
    ).join("|")
  );
}

const N = "";

my$("article tbody > tr").map(
  tr => {
    let D = tr.firstElementChild.textContent; // Default
    if (D === "None") D = N;
    let AO = tr.lastElementChild.textContent; // API Override
    if (AO.startsWith("parser")) AO = getParsers(AO);
    return (D === N ? "// " : "") + AO.replace(":", ": " + D + ", //");
  }
).join("\n");
