const cp = require('child_process')
const path = require("path");

// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with  registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('extension.copyDiffPatch', function () {
		// The code you place here will be executed every time your command is executed
		const activeEditor = vscode.window.activeTextEditor;

		if(!activeEditor){
			vscode.window.showInformationMessage("No active editor");
			return;
		}

		const fullPathToFile = activeEditor.document.fileName;

		if(!fullPathToFile){
			vscode.window.showErrorMessage("Unable to resolve file path");
			return;
		}

		const dir = path.dirname(fullPathToFile),
			  fileName = path.basename(fullPathToFile);



		cp.exec(["git", "diff", fileName].join(" "), {cwd: dir}, (err, stdout, stderr) => {
			if (err) {
				vscode.window.showErrorMessage(err);
				return;
			}

			if(!stdout){
				vscode.window.showWarningMessage(fullPathToFile + " did not have any changes.");
				return;
			}
			vscode.env.clipboard.writeText(stdout)

			vscode.window.showInformationMessage("Diff copied to clipboard =)");
		});
		// Display a message box to the user
	});

	context.subscriptions.push(disposable);
}
exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() {}

module.exports = {
	activate,
	deactivate
}
