import Phaser from "../lib/phaser.js";

export class InputScore extends Phaser.Scene {
  constructor() {
    super({
      key: "InputScore",
    });

    this.chars = [
      ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"],
      ["K", "L", "M", "N", "O", "P", "Q", "R", "S", "T"],
      ["U", "V", "W", "X", "Y", "Z", ".", "-", "<", ">"],
    ];

    /*this.chars = [
      ["A", "B", "C", "D", "E"],
      ["F", "G", "H", "I", "J"],
      ["K", "L", "M", "N", "O"],
      ["P", "Q", "R", "S", "T"],
      ["U", "V", "W", "X", "Y"],
      ["Z", ".", "-", "<", ">"]
    ];*/

    this.rows = this.chars.length;
    this.columns = this.chars[0].length;

    this.cursor = new Phaser.Math.Vector2();

    this.text;
    this.block;

    this.name = "";
    this.charLimit = 4;
  }

  create() {
    this.padding = 0;
    this.letterSpacing = 20;
    var charWidth = 16;
    var charHeight = 16;
    var lineHeight = 2;
    this.xSpacing = charWidth + this.letterSpacing;
    this.ySpacing = charHeight * lineHeight;

    var characters = "";
    for (let i = 0; i < this.chars.length; i++) {
      characters += this.chars[i].join("");
      if (i !== this.chars.length - 1) {
        characters += "\n".repeat(lineHeight);
      }
    }

    let text = this.add.bitmapText(
      30 + this.padding,
      50,
      "retroFont",
      characters
    );

    text.setLetterSpacing(this.letterSpacing);
    text.setInteractive();

    this.add.image(
      text.x +
        charWidth * (this.columns - 1) -
        20 +
        this.letterSpacing * (this.columns - 2),
      text.y + charWidth * (lineHeight * (this.chars.length - 1)) + 20,
      "rub"
    );
    this.add.image(
      text.x +
        charWidth * this.columns -
        20 +
        this.letterSpacing * (this.columns - 1),
      text.y + charWidth * (lineHeight * (this.chars.length - 1)) + 20,
      "end"
    );

    this.block = this.add.image(text.x - 2, text.y - 2, "block").setOrigin(0);

    this.text = text;

    this.input.keyboard.on("keyup-LEFT", this.moveLeft, this);
    this.input.keyboard.on("keyup-RIGHT", this.moveRight, this);
    this.input.keyboard.on("keyup-UP", this.moveUp, this);
    this.input.keyboard.on("keyup-DOWN", this.moveDown, this);
    this.input.keyboard.on("keyup-ENTER", this.pressKey, this);
    this.input.keyboard.on("keyup-SPACE", this.pressKey, this);
    this.input.keyboard.on("keyup", this.anyKey, this);

    text.on("pointermove", this.moveBlock, this);
    text.on("pointerup", this.pressKey, this);

    this.tweens.add({
      targets: this.block,
      alpha: 0.2,
      yoyo: true,
      repeat: -1,
      ease: "Sine.easeInOut",
      duration: 350,
    });
  }

  moveBlock(pointer, x, y) {
    let cx = Phaser.Math.Snap.Floor(x, this.xSpacing, 0, true);
    let cy = Phaser.Math.Snap.Floor(y, this.ySpacing, 0, true);

    if (cy <= this.rows - 1 && cx <= this.columns - 1) {
      this.cursor.set(cx, cy);

      this.block.x = this.text.x - 2 + cx * this.xSpacing;
      this.block.y = this.text.y - 2 + cy * this.ySpacing;
    }
  }

  moveLeft() {
    if (this.cursor.x > 0) {
      this.cursor.x--;
      this.block.x -= this.xSpacing;
    } else {
      this.cursor.x = 9;
      this.block.x += this.xSpacing * 9;
    }
  }

  moveRight() {
    if (this.cursor.x < 9) {
      this.cursor.x++;
      this.block.x += this.xSpacing;
    } else {
      this.cursor.x = 0;
      this.block.x -= this.xSpacing * 9;
    }
  }

  moveUp() {
    if (this.cursor.y > 0) {
      this.cursor.y--;
      this.block.y -= this.ySpacing;
    } else {
      this.cursor.y = 2;
      this.block.y += this.ySpacing * 2;
    }
  }

  moveDown() {
    if (this.cursor.y < 2) {
      this.cursor.y++;
      this.block.y += this.ySpacing;
    } else {
      this.cursor.y = 0;
      this.block.y -= this.ySpacing * 2;
    }
  }

  anyKey(event) {
    //  Only allow A-Z . and -

    let code = event.keyCode;

    if (code === Phaser.Input.Keyboard.KeyCodes.PERIOD) {
      this.cursor.set(6, 2);
      this.pressKey();
    } else if (code === Phaser.Input.Keyboard.KeyCodes.MINUS) {
      this.cursor.set(7, 2);
      this.pressKey();
    } else if (
      code === Phaser.Input.Keyboard.KeyCodes.BACKSPACE ||
      code === Phaser.Input.Keyboard.KeyCodes.DELETE
    ) {
      this.cursor.set(8, 2);
      this.pressKey();
    } else if (
      code >= Phaser.Input.Keyboard.KeyCodes.A &&
      code <= Phaser.Input.Keyboard.KeyCodes.Z
    ) {
      code -= 65;

      let y = Math.floor(code / 10);
      let x = code - y * 10;

      this.cursor.set(x, y);
      this.pressKey();
    }
  }

  pressKey() {
    let x = this.cursor.x;
    let y = this.cursor.y;
    let nameLength = this.name.length;

    this.block.x = this.text.x - 2 + x * this.xSpacing;
    this.block.y = this.text.y - 2 + y * this.ySpacing;

    if (x === this.columns - 1 && y === this.rows - 1 && nameLength > 0) {
      //  Submit
      this.events.emit("submitName", this.name);
    } else if (
      x === this.columns - 2 &&
      y === this.rows - 1 &&
      nameLength > 0
    ) {
      //  Rub
      this.name = this.name.substr(0, nameLength - 1);

      this.events.emit("updateName", this.name);
    } else if (this.name.length < this.charLimit) {
      //  Add
      this.name = this.name.concat(this.chars[y][x]);

      this.events.emit("updateName", this.name);
    }
  }

  update(time, delta) {}
}
