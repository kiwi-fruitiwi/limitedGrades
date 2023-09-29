/**
 *  a basic clone of limitedGrades.com that uses 17Lands data and statistics to
 *  provide a visual layout of card win rates
 *
 *  Eventually we'll want to create a single p5 app that has views for several
 *  functions:
 *  🏭 compareDraftPicks with selectable metric, data views, autocomplete: OH
 *  or GD WR against archetype WR
 *  🏭 topArchetypeCards
 *  🏭 topCardsInEachColor and ColorPair
 *  🏭 secretGoldCards + topPlayerImprovementCards
 *  🏭 limitedGrades style rectangle card view for comparison using
 *  selectable metric
 *
 *  @author kiwi
 *  @date 2023.09.17
 */

let font
let fixedWidthFont
let variableWidthFont
let instructions
let debugCorner /* output debug text in the bottom left corner of the canvas */

const setName = 'ltr'

/**
 * all-players data master json file
 * @param {Object}
 * */
let allMaster

function preload() {
    font = loadFont('data/consola.ttf')
    fixedWidthFont = loadFont('data/consola.ttf')
    variableWidthFont = loadFont('data/meiryo.ttf')

    allMaster = loadJSON(`data/sets/${setName}/allMaster.json`)
}


function setup() {
    housekeeping()
    setWallpaper()

    const allMasterKeys = Object.keys(allMaster)
    for (let key of allMasterKeys) {
        console.log(`${key}`)
    }
}


/**
 * Calculates the sum of two numbers.
 * @param {number} a - The first number.
 * @param {number} b - The second number.
 * @returns {number} The sum of a and b.
 */
function addNumbers(a, b) {
    return a + b;
}


function draw() {
    clear()
    background(234, 34, 24, 50)

    /* debugCorner needs to be last so its z-index is highest */
    debugCorner.setText(`frameCount: ${frameCount}`, 2)
    debugCorner.setText(`fps: ${frameRate().toFixed(0)}`, 1)
    debugCorner.showTop()

    if (frameCount > 30000)
        noLoop()
}


function keyPressed() {
    /* stop sketch */
    if (keyCode === 97) { /* numpad 1 */
        noLoop()
        instructions.html(`<pre>
            sketch stopped</pre>`)
    }

    if (key === '`') { /* toggle debug corner visibility */
        debugCorner.visible = !debugCorner.visible
        console.log(`debugCorner visibility set to ${debugCorner.visible}`)
    }
}


function setWallpaper() {
    const wallpapers = {
        'ltr': [
            'birthdayescape.jpg',
            'theshire.jpg',
            'andurilflameofthewest.jpg',
            'gandalfthegrey.jpg',
            'samwisegamgee.jpg',
            'doorsofdurin.jpg',
            'lastmarchoftheents.jpg',
            'stingtheglintingdagger.jpg',
            'thegreyhavens.jpg'
        ]
    }

    const setImgArr = wallpapers[setName]

    /* use the array length as a scaling factor for random's [0,1) generator */
    const randomIndex = Math.floor(Math.random() * setImgArr.length)
    const wallpaperFileName = setImgArr[randomIndex];

    /* set the background permanently */
    const bgURL = `url("backgrounds/${setName}/${wallpaperFileName}")`
    select('body').style('background-image', 'linear-gradient(rgba(0,0,0,0.4),' +
        ` rgba(0,0,0,0.4)), ${bgURL}`)
}


/* set up canvas, debugCorner, instructions */
function housekeeping() {
    let cnv = createCanvas(1000, 500)
    cnv.parent('#canvas')
    colorMode(HSB, 360, 100, 100, 100)
    textFont(font, 14)

    /* initialize instruction div */
    instructions = select('#ins')
    instructions.html(`<pre>
        numpad 1 → freeze sketch</pre>`)

    debugCorner = new CanvasDebugCorner(5)
}



/** 🧹 shows debugging info using text() 🧹 */
class CanvasDebugCorner {
    constructor(lines) {
        this.visible = true
        this.size = lines
        this.debugMsgList = [] /* initialize all elements to empty string */
        for (let i in lines)
            this.debugMsgList[i] = ''
    }

    setText(text, index) {
        if (index >= this.size) {
            this.debugMsgList[0] = `${index} ← index>${this.size} not supported`
        } else this.debugMsgList[index] = text
    }

    showBottom() {
        if (this.visible) {
            noStroke()
            textFont(fixedWidthFont, 14)

            const LEFT_MARGIN = 10
            const DEBUG_Y_OFFSET = height - 10 /* floor of debug corner */
            const LINE_SPACING = 2
            const LINE_HEIGHT = textAscent() + textDescent() + LINE_SPACING

            /* semi-transparent background */
            fill(0, 0, 0, 10)
            rectMode(CORNERS)
            const TOP_PADDING = 3 /* extra padding on top of the 1st line */
            rect(
                0,
                height,
                width,
                DEBUG_Y_OFFSET - LINE_HEIGHT * this.debugMsgList.length - TOP_PADDING
            )

            fill(0, 0, 100, 100) /* white */
            strokeWeight(0)

            for (let index in this.debugMsgList) {
                const msg = this.debugMsgList[index]
                text(msg, LEFT_MARGIN, DEBUG_Y_OFFSET - LINE_HEIGHT * index)
            }
        }
    }

    showTop() {
        if (this.visible) {
            noStroke()
            textFont(fixedWidthFont, 14)

            const LEFT_MARGIN = 10
            const TOP_PADDING = 3 /* extra padding on top of the 1st line */

            /* offset from top of canvas */
            const DEBUG_Y_OFFSET = textAscent() + TOP_PADDING
            const LINE_SPACING = 2
            const LINE_HEIGHT = textAscent() + textDescent() + LINE_SPACING

            /* semi-transparent background, a console-like feel */
            fill(0, 0, 0, 10)
            rectMode(CORNERS)

            rect( /* x, y, w, h */
                0,
                0,
                width,
                DEBUG_Y_OFFSET + LINE_HEIGHT*this.debugMsgList.length/*-TOP_PADDING*/
            )

            fill(0, 0, 100, 100) /* white */
            strokeWeight(0)

            textAlign(LEFT)
            for (let i in this.debugMsgList) {
                const msg = this.debugMsgList[i]
                text(msg, LEFT_MARGIN, LINE_HEIGHT*i + DEBUG_Y_OFFSET)
            }
        }
    }
}