// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { CssFormater } from "./libs/CssFormater";
import jsbeautify = require('js-beautify');
let timer: NodeJS.Timer | undefined;

let configs = vscode.workspace.getConfiguration("cssFormatSt3");

export function format(content: string, action: string, document: vscode.TextDocument) {
	const languageId = document.languageId;

	if (languageId === 'html' || languageId === 'php') {
		vscode.window.showInformationMessage('Please select content before choosing non-style file.');
		return content;
	}

	let beutifyOptions: jsbeautify.CSSBeautifyOptions = {
		// eslint-disable-next-line @typescript-eslint/naming-convention
		selector_separator_newline: true,
		// eslint-disable-next-line @typescript-eslint/naming-convention
		newline_between_rules: true,
		// eslint-disable-next-line @typescript-eslint/naming-convention
		space_around_selector_separator: true,
		// eslint-disable-next-line @typescript-eslint/naming-convention
		space_around_combinator: true
	};
	let beautify: string = jsbeautify.css_beautify(content, beutifyOptions);
	let formatter = new CssFormater(
		configs.get<string>("indentation"),
		configs.get<string>("expandBlockBreak")
	);

	return formatter.run(beautify, action);
}
export function regActionFunc(action: string) {
	let command = 'css-format-st3.' + action;
	return vscode.commands.registerCommand(command, () => {
		const editor = vscode.window.activeTextEditor;
		if (editor) {
			const document = editor.document;
			let text = document.getText(editor.selection);
			let range: vscode.Range;

			if (text.length > 0) {
				range = editor.selection;
			} else {
				text = document.getText();
				range = new vscode.Range(0, 0, document.lineCount, 0);
			}
			let formatted = format(text, action, document);

			editor.edit((editBuilder) => {
				editBuilder.replace(range, formatted + "\n");
			});
			// let we = new vscode.WorkspaceEdit();
			// we.replace(document.uri, range, formatted + "\n");
			// vscode.workspace.applyEdit(we);
		}
		vscode.window.showInformationMessage(command);
	});
}
export function activate(context: vscode.ExtensionContext) {

	let expand = regActionFunc('expand');
	let expandBs = regActionFunc('expand-bs');
	let compact = regActionFunc('compact');
	let compactBs = regActionFunc('compact-bs');
	let compactNs = regActionFunc('compact-ns');
	let compactBsNs = regActionFunc('compact-bs-ns');
	let compress = regActionFunc('compress');

	let formatting = vscode.languages.registerDocumentFormattingEditProvider('css', {
		provideDocumentFormattingEdits: (document, options, token) => {
			let result: vscode.TextEdit[] = [];
			let range = new vscode.Range(0, 0, document.lineCount, 0);
			let text = document.getText();
			let action: string = configs.get<string>("formattingAction") || 'expand';
			let formatted = format(text, action, document);
			result.push(new vscode.TextEdit(range, formatted));
			return result;
		}
	});
	let rangeFormatting = vscode.languages.registerDocumentRangeFormattingEditProvider('css', {
		provideDocumentRangeFormattingEdits: (document, range, options, token) => {
			let result: vscode.TextEdit[] = [];
			let text = document.getText(range);
			let action: string = configs.get<string>("formattingAction") || 'expand';
			let formatted = format(text, action, document);
			result.push(new vscode.TextEdit(range, formatted));
			return result;
		}
	});
	// let formatOnSave = vscode.workspace.onDidSaveTextDocument((document: vscode.TextDocument) => {
	let formatOnSave = vscode.workspace.onWillSaveTextDocument(() => {
		const document = vscode.window.activeTextEditor?.document;
		if (typeof document === 'undefined') {
			return;
		}
		let flag: boolean = configs.get<boolean>("formatOnSave") || false;
		let action: string = configs.get<string>("formatOnSaveAction") || 'expand';
		let filters: string = configs.get<string>("formatOnSaveFilter") || '';
		const languageId = document.languageId;
		let filterArr = filters.split('|');

		// console.log('formatOnSave=', flag);
		// console.log('action=', action);
		// console.log('languageId=', languageId);
		// console.log('document.isDirty', document.isDirty);
		// console.log('document.formatOnSaveFilter', filterArr, filterArr.indexOf(languageId));

		if (!flag || filterArr.indexOf(languageId) === -1 || !document.isDirty) {
			// console.log('onWillSaveTextDocument', false);
			return;
		}
		
		vscode.window.showInformationMessage('css-format-st3.formatOnSave');

		let text = document.getText();
		let formatted = format(text, action, document);
		let range = new vscode.Range(0, 0, document.lineCount, 0);
		const editor = vscode.window.activeTextEditor;
		if (editor) {
			editor.edit((editBuilder) => {
				editBuilder.replace(range, formatted + "\n");
			});
		}
		// let we = new vscode.WorkspaceEdit();
		// we.replace(document.uri, range, formatted + "\n");
		// vscode.workspace.applyEdit(we);
		// document.save();

	});

	context.subscriptions.push(
		expand, expandBs, compact, compactBs, compactNs, compactBsNs, compress,
		formatting, rangeFormatting, formatOnSave
	);
}

// This method is called when your extension is deactivated
export function deactivate() { }
