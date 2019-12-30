import React, { useEffect, useRef, ReactElement } from "react";
import { makeStyles } from "@material-ui/styles";
import SceneManager from "./SceneManager";

interface Props {}

const useStyles = makeStyles(() => ({
  root: {
    position: "fixed",
    width: "100vw",
    height: "100vh",
    border: "5px solid red"
  }
}));

const stickItUpYourYeah = (threeJsElement: ReactElement) => {
  const canvas = createCanvas(document, threeJsElement);
  const sceneManager = SceneManager(canvas);

  let canvasHalfWidth;
  let canvasHalfHeight;

  bindEventListeners();
  render();

  function createCanvas(document, container) {
    const canvas = document.createElement("canvas");
    container.appendChild(canvas);
    return canvas;
  }

  function bindEventListeners() {
    window.onresize = resizeCanvas;
    window.onmousemove = mouseMove;
    resizeCanvas();
  }

  function resizeCanvas() {
    canvas.style.width = "100%";
    canvas.style.height = "100%";

    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    canvasHalfWidth = Math.round(canvas.offsetWidth / 2);
    canvasHalfHeight = Math.round(canvas.offsetHeight / 2);

    sceneManager.onWindowResize();
  }

  function mouseMove({ screenX, screenY }) {
    sceneManager.onMouseMove(
      screenX - canvasHalfWidth,
      screenY - canvasHalfHeight
    );
  }

  function render() {
    requestAnimationFrame(render);
    sceneManager.update();
  }
};

const Playground: React.FC<Props> = ({}) => {
  const classes = useStyles();
  const threeJsEl = useRef(null);

  useEffect(() => {
    if (threeJsEl && threeJsEl.current) {
      stickItUpYourYeah(threeJsEl.current as any);
    }
  }, [threeJsEl, threeJsEl.current]);

  return <div ref={threeJsEl} className={classes.root} />;
};

export default Playground;
