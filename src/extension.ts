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
    return lines.sort((a, b) => b.length - a.length);
  } else {
    return lines.sort((a, b) => a.length - b.length);
  }
}

export function deactivate() {}
