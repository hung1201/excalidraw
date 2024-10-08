import { StaticCanvasAppState, AppState } from "../types";

import { StaticCanvasRenderConfig } from "../scene/types";

import { THEME, THEME_FILTER } from "../constants";

export const fillCircle = (
  context: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  radius: number,
  stroke = true,
) => {
  context.beginPath();
  context.arc(cx, cy, radius, 0, Math.PI * 2);
  context.fill();
  if (stroke) {
    context.stroke();
  }
};

export const getNormalizedCanvasDimensions = (
  canvas: HTMLCanvasElement,
  scale: number,
): [number, number] => {
  // When doing calculations based on canvas width we should used normalized one
  return [canvas.width / scale, canvas.height / scale];
};

export const bootstrapCanvas = ({
  canvas,
  scale,
  normalizedWidth,
  normalizedHeight,
  theme,
  isExporting,
  viewBackgroundColor,
  viewBackgroundImage,
  ratioBackgroundImage,
}: {
  canvas: HTMLCanvasElement;
  scale: number;
  normalizedWidth: number;
  normalizedHeight: number;
  theme?: AppState["theme"];
  isExporting?: StaticCanvasRenderConfig["isExporting"];
  viewBackgroundColor?: StaticCanvasAppState["viewBackgroundColor"];
  viewBackgroundImage?: StaticCanvasAppState["viewBackgroundImage"];
  ratioBackgroundImage?: StaticCanvasAppState["ratioBackgroundImage"];
}): CanvasRenderingContext2D => {
  const context = canvas.getContext("2d")!;

  context.setTransform(1, 0, 0, 1, 0, 0);
  context.scale(scale, scale);

  if (isExporting && theme === THEME.DARK) {
    context.filter = THEME_FILTER;
  }
  const ratio = ratioBackgroundImage;
  const canvasRatio = normalizedWidth / normalizedHeight;
  // if (!viewBackgroundColor || !viewBackgroundColor) {
  //   return context;
  // }
  // Paint background
  if (typeof viewBackgroundColor === "string") {
    const hasTransparence =
      viewBackgroundColor === "transparent" ||
      viewBackgroundColor.length === 5 || // #RGBA
      viewBackgroundColor.length === 9 || // #RRGGBBA
      /(hsla|rgba)\(/.test(viewBackgroundColor);
    if (hasTransparence) {
      context.clearRect(0, 0, normalizedWidth, normalizedHeight);
    }

    if (viewBackgroundImage) {
      const img = new Image();
      img.src = viewBackgroundImage;
      if (ratio) {
        if (ratio > canvasRatio) {
          context.drawImage(
            img,
            -((ratio * normalizedHeight - normalizedWidth) / 2),
            0,
            ratio * normalizedHeight,
            normalizedHeight,
          );
        } else {
          context.drawImage(
            img,
            0,
            -((normalizedWidth / ratio - normalizedHeight) / 2),
            normalizedWidth,
            normalizedWidth / ratio,
          );
        }
      } else {
        context.drawImage(img, 0, 0, normalizedWidth, normalizedHeight);
      }
      context.save();
    } else {
      context.fillStyle = viewBackgroundColor;
      context.fillRect(0, 0, normalizedWidth, normalizedHeight);
      context.restore();
    }
  } else {
    context.clearRect(0, 0, normalizedWidth, normalizedHeight);
    if (viewBackgroundImage) {
      const img = new Image();
      img.src = viewBackgroundImage;
      if (ratio) {
        if (ratio > canvasRatio) {
          context.drawImage(
            img,
            -((ratio * normalizedHeight - normalizedWidth) / 2),
            0,
            ratio * normalizedHeight,
            normalizedHeight,
          );
        } else {
          context.drawImage(
            img,
            0,
            -((normalizedWidth / ratio - normalizedHeight) / 2),
            normalizedWidth,
            normalizedWidth / ratio,
          );
        }
      } else {
        context.drawImage(img, 0, 0, normalizedWidth, normalizedHeight);
      }
      context.save();
    }
  }

  return context;
};
