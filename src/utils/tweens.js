export const blinkingTween = (targets, duration, loop) => {
  return {
    targets,
    duration,
    alpha: { getStart: () => 1, getEnd: () => 0 },
    loop,
    yoyo: true,
  };
};

export const flashingTween = (target, duration, loop) => {
  const fx = target.postFX.addGradient(0xffffff, 0xffffff, 1);
  return {
    targets: fx,
    alpha: 0,
    duration,
    loop,
    yoyo: true,
  };
};

export const bounceTween = (target, duration) => {
  return {
    targets: target,
    scaleX: 1.25,
    scaleY: 0.75,
    x: { value: "+=50", yoyo: false },
    angle: "+=10",
    yoyo: true,
    duration,
    ease: "Sine.easeInOut",
  };
};

/*
    onUpdate: (tween) => {
      const value = Math.floor(tween.getValue());

      target.setTintFill(Phaser.Display.Color.GetColor(value, value, value));
    },
    onComplete: () => {
      target.clearTint();
    }
*/
