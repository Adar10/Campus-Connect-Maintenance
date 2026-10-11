// Draws the control flow graphs (CFG) of the functions we test and saves them as
// PNG images in this folder (cfg-<function>.png).
//
// Run:  node graphs/make-cfg.js
//
// The graphs are written below as text in Mermaid (https://mermaid.js.org), a text format
// for diagrams. They were drawn from the source code with these rules:
//   1. Statements that always run one after another are one node.
//   2. Every decision is its own node: an if, the condition of a loop, and a call inside
//      try that can fail.
//   3. There is one arrow for every way the code can continue.
//   4. Every graph has one Start node and one End node.
// The number in a node is only a name for the node, so a path can be written as a row of
// numbers, for example 1-3-4-6. Independent paths = edges - nodes + 2.
//
// To make the images, the script opens a page with the graphs in Microsoft Edge without
// showing a window. On that page Mermaid draws every graph, and the script saves the
// drawings as PNG files. An internet connection is needed, because Mermaid is loaded
// from the internet.

const fs = require("fs");
const os = require("os");
const path = require("path");
const { execFileSync } = require("child_process");

const graphs = [
    {
        // 20 nodes, 28 edges, 10 independent paths. selectedValue: 1 = Lectures, 2 = Videos, 3 = Exams.
        // Paths to test: 1-2-3-5-6-2-8, 1-2-3-4-2-3-5-6-2-8, 1-2-3-5-7, 1-9-10,
        // 1-9-11-12-13-15-16-12-18, 1-9-11-12-13-14-12-13-15-16-12-18, 1-9-11-12-13-15-17, 1-9-11.
        // Two of the 10 paths cannot happen: the loops in node 2 and 12 always run at least once.
        name: "submitFile",
        file: "src/frontend.js",
        graph: `flowchart TD
            S([Start]) --> n1{"1: selectedValue == 1 ?"}
            n1 -- yes --> n2{"2: while exists ?"}
            n2 -- yes --> n3{"3: getDownloadURL succeeds ?"}
            n3 -- "no (error)" --> n5{"5: error is 'object-not-found' ?"}
            n3 -- yes --> n4["4: add (count) to the name"]
            n4 --> n2
            n5 -- no --> n7["7: log the error, throw it"]
            n5 -- yes --> n6["6: exists = false"]
            n6 --> n2
            n2 -- no --> n8["8: uploadFile to Lectures, save in the user's list"]
            n1 -- no --> n9{"9: selectedValue == 2 ?"}
            n9 -- yes --> n10["10: uploadVideos, save in the user's list"]
            n9 -- no --> n11{"11: selectedValue == 3 ?"}
            n11 -- yes --> n12{"12: while exists ?"}
            n12 -- yes --> n13{"13: getDownloadURL succeeds ?"}
            n13 -- "no (error)" --> n15{"15: error is 'object-not-found' ?"}
            n13 -- yes --> n14["14: add (count) to the name"]
            n14 --> n12
            n15 -- no --> n17["17: log the error, throw it"]
            n15 -- yes --> n16["16: exists = false"]
            n16 --> n12
            n12 -- no --> n18["18: uploadFile to Exams, save in the user's list"]
            n11 -- no --> E([End])
            n7 --> E
            n8 --> E
            n10 --> E
            n17 --> E
            n18 --> E`,
    },
    {
        // 8 nodes, 9 edges, 3 independent paths.
        // Paths to test: 1-2-6 (quiz), 1-3-4-6 (video), 1-3-5-6 (lecture or exam).
        name: "deleteContent",
        file: "src/frontend.js",
        graph: `flowchart TD
            S([Start]) --> n1{"1: category === 'Quizzes' ?"}
            n1 -- yes --> n2["2: deleteQuiz"]
            n1 -- no --> n3{"3: category === 'Videos' ?"}
            n3 -- yes --> n4["4: deleteVideo"]
            n3 -- no --> n5["5: deleteExamOrLecture"]
            n2 --> n6["6: deleteFromReferences"]
            n4 --> n6
            n5 --> n6
            n6 --> E([End])`,
    },
    {
        // 6 nodes, 7 edges, 3 independent paths.
        // Paths to test: 1-2-3 (first in the list), 1-2-4-1-2-3 (second in the list),
        // 1-2-4-1 (not in the list).
        name: "deleteVideo",
        file: "src/frontend.js",
        graph: `flowchart TD
            S([Start]) --> n1{"1: more videos in the list ?"}
            n1 -- yes --> n2{"2: is this the video to delete ?"}
            n2 -- yes --> n3["3: remove the link from the list"]
            n2 -- no --> n4["4: go to the next video"]
            n4 --> n1
            n1 -- no --> E([End])
            n3 --> E`,
    },
    {
        // 8 nodes, 10 edges, 4 independent paths. The forEach over the quizzes is drawn as a loop.
        // Paths to test: 1-4-6 (no quizzes yet), 1-2-3-1-4-5 (name is taken),
        // 1-2-1-4-6 (only other names exist).
        name: "createQuiz",
        file: "src/quiz.js",
        graph: `flowchart TD
            S([Start]) --> n1{"1: more quizzes in the course ?"}
            n1 -- yes --> n2{"2: doc.id === quizName ?"}
            n2 -- yes --> n3["3: quizExists = true"]
            n3 --> n1
            n2 -- no --> n1
            n1 -- no --> n4{"4: quizExists ?"}
            n4 -- yes --> n5["5: show 'name already exists'"]
            n4 -- no --> n6["6: create the quiz, save in the user's list"]
            n5 --> E([End])
            n6 --> E`,
    },
    {
        // 6 nodes, 7 edges, 3 independent paths.
        // Paths to test: 1-4 (no list of questions), 1-2-4 (empty list), 1-2-3-2-4 (has questions).
        name: "fetchQuiz",
        file: "src/quiz.js",
        graph: `flowchart TD
            S([Start]) --> n1{"1: questionsData ?"}
            n1 -- yes --> n2{"2: more questions ?"}
            n2 -- yes --> n3["3: mix the answers, add the question"]
            n3 --> n2
            n2 -- no --> n4["4: return the questions"]
            n1 -- no --> n4
            n4 --> E([End])`,
    },
    {
        // 5 nodes, 5 edges, 2 independent paths.
        // Paths to test: 1-3 (no questions), 1-2-1-3 (has questions).
        name: "startQuiz",
        file: "src/quiz.js",
        graph: `flowchart TD
            S([Start]) --> n1{"1: more questions ?"}
            n1 -- yes --> n2["2: showQuestion, wait for 'Next'"]
            n2 --> n1
            n1 -- no --> n3["3: showScore"]
            n3 --> E([End])`,
    },
    {
        // 10 nodes, 12 edges, 4 independent paths.
        // Paths to test: 1-2-4-...-8 (right answer clicked), 1-3-4-...-8 (wrong answer clicked).
        // The loop 4-5-6-7 / 4-5-7 runs once for every answer button.
        name: "selectAnswer",
        file: "src/quiz.js",
        graph: `flowchart TD
            S([Start]) --> n1{"1: isCorrect ?"}
            n1 -- yes --> n2["2: mark as correct, score++"]
            n1 -- no --> n3["3: mark as incorrect"]
            n2 --> n4{"4: more answer buttons ?"}
            n3 --> n4
            n4 -- yes --> n5{"5: button has the right answer ?"}
            n5 -- yes --> n6["6: mark as correct"]
            n6 --> n7["7: switch the button off"]
            n5 -- no --> n7
            n7 --> n4
            n4 -- no --> n8["8: show 'Next'"]
            n8 --> E([End])`,
    },
    {
        // The function that Firebase calls when somebody signs in or out.
        // 5 nodes, 5 edges, 2 independent paths.
        // Paths to test: 1-2 (signs in), 1-3 (signs out).
        name: "onAuthStateChanged",
        file: "src/backend.js",
        graph: `flowchart TD
            S([Start]) --> n1{"1: user ?"}
            n1 -- yes --> n2["2: remember the user, save the email, show the name"]
            n1 -- no --> n3["3: forget the user"]
            n2 --> E([End])
            n3 --> E`,
    },
];

// The page that Edge opens. It draws every graph with Mermaid, with the name of the
// function as a title above it, and turns each drawing into PNG data.
const page = `<!doctype html>
<meta charset="utf-8">
<body style="margin:0;background:white">
<script src="https://cdn.jsdelivr.net/npm/mermaid@10.9.1/dist/mermaid.min.js"></script>
<script>
    const graphs = ${JSON.stringify(graphs)};
    const scale = 2; // twice the size on screen, so the images are sharp in the report

    async function drawAll() {
        mermaid.initialize({ startOnLoad: false, theme: "neutral", flowchart: { htmlLabels: false, useMaxWidth: false } });
        for (const graph of graphs) {
            const title = "---\\ntitle: " + graph.name + " (" + graph.file + ")\\n---\\n";
            const { svg } = await mermaid.render("cfg" + graph.name, title + graph.graph);

            const box = document.createElement("div");
            box.innerHTML = svg;
            document.body.appendChild(box);
            const size = box.firstElementChild.getBoundingClientRect();

            const image = new Image();
            image.src = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg);
            await image.decode();

            const canvas = document.createElement("canvas");
            canvas.width = size.width * scale;
            canvas.height = size.height * scale;
            const context = canvas.getContext("2d");
            context.fillStyle = "white";
            context.fillRect(0, 0, canvas.width, canvas.height);
            context.drawImage(image, 0, 0, canvas.width, canvas.height);

            const result = document.createElement("pre");
            result.id = "png-" + graph.name;
            result.textContent = canvas.toDataURL("image/png");
            document.body.appendChild(result);
        }
    }
    drawAll().catch((error) => { document.title = "ERROR " + error.message; });
</script>
`;

const edgePaths = [
    "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
    "C:/Program Files/Microsoft/Edge/Application/msedge.exe",
];
const edge = edgePaths.find((edgePath) => fs.existsSync(edgePath));
if (!edge) {
    console.error("Microsoft Edge was not found. Add its path to edgePaths in this file.");
    process.exit(1);
}

const pageFile = path.join(os.tmpdir(), "make-cfg.html");
fs.writeFileSync(pageFile, page);

// Edge opens the page, waits until it is finished and prints the finished page as text.
const finishedPage = execFileSync(
    edge,
    ["--headless=new", "--disable-gpu", "--virtual-time-budget=30000", "--dump-dom", "file:///" + pageFile.replace(/\\/g, "/")],
    { encoding: "utf8", maxBuffer: 200 * 1024 * 1024, stdio: ["ignore", "pipe", "ignore"] },
);
fs.unlinkSync(pageFile);

for (const graph of graphs) {
    const found = new RegExp('<pre id="png-' + graph.name + '">data:image/png;base64,([^<]+)</pre>').exec(finishedPage);
    if (!found) {
        console.error("Could not draw " + graph.name);
        continue;
    }
    const pngFile = path.join(__dirname, "cfg-" + graph.name + ".png");
    fs.writeFileSync(pngFile, Buffer.from(found[1], "base64"));
    console.log("wrote " + pngFile);
}
