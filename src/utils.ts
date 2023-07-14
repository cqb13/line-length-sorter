import * as vscode from "vscode";

interface Settings {
  [key: string]: any;
}

const getSettings = (group: string, keys: string[]) => {
  const settings = vscode.workspace.getConfiguration(group, undefined);
  const editor = vscode.window.activeTextEditor;
  const language = editor && editor.document && editor.document.languageId;
  const languageSettings =
    language && vscode.workspace.getConfiguration(group, editor.document.uri);
  const result: Settings = {};
  keys.forEach((key) => {
    const value = languageSettings && languageSettings.get(key);
    result[key] = value !== undefined ? value : settings.get(key);
  });
  return result;
};

export { getSettings };
