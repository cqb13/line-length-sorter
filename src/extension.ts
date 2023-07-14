import { getSettings } from "./utils";
import * as vscode from "vscode";

export function activate(context: vscode.ExtensionContext) {
  let lts = vscode.commands.registerCommand(
    "line-length-sorter.sortLinesLongestToShortest",
    () => {
      const editor = vscode.window.activeTextEditor;
      if (!editor) {
        return;
      }

      const { selection, lines } = getSelectedLines(editor);
      const sortedLines = sortLines(lines, "lts");
      const sortedText = sortedLines.join("\n");
      editor.edit((editBuilder) => {
        editBuilder.replace(selection, sortedText);
      });
    }
  );

  let stl = vscode.commands.registerCommand(
    "line-length-sorter.sortLinesShortestToLongest",
    () => {
      const editor = vscode.window.activeTextEditor;
      if (!editor) {
        return;
      }

      const { selection, lines } = getSelectedLines(editor);
      const sortedLines = sortLines(lines, "stl");
      const sortedText = sortedLines.join("\n");
      editor.edit((editBuilder) => {
        editBuilder.replace(selection, sortedText);
      });
    }
  );

  context.subscriptions.push(lts, stl);
}

function getConfig() {
  const extensionSettings = getSettings("line-length-sorter", [
    "removeBlank",
  ]);

  return { extensionSettings };
}

function getSelectedLines(editor: vscode.TextEditor): {
  selection: vscode.Selection;
  lines: string[];
} {
  const selection = editor.selection;
  const text = editor.document.getText(selection);
  const lines = text.split(/\r?\n/);
  return { selection, lines };
}

function sortLines(lines: string[], type: "lts" | "stl"): string[] {
  if (type === "lts") {
    lines.sort((a, b) => b.length - a.length);
  } else {
    lines.sort((a, b) => a.length - b.length);
  }

  const { extensionSettings } = getConfig();

  if (extensionSettings.removeBlank) {
    return lines.filter((line) => line.length > 0);
  } else {
    return lines;
  }
}

export function deactivate() {}
