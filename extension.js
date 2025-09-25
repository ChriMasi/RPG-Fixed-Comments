const vscode = require('vscode');

/**
 * Toggle a comment character '*' in column 7 (1-based) for selected lines or current line.
 */
function activate(context) {
    // Comando: trasforma la selezione in asterischi
    let selectionToStars = vscode.commands.registerCommand('commentirpg.selectionToStars', function () {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            return;
        }
        const allowedLangs = ['rpgle', 'rpg', 'lf', 'dspf'];
        const doc = editor.document;
        if (!allowedLangs.includes(doc.languageId)) {
            return;
        }
        editor.edit(editBuilder => {
            for (const sel of editor.selections) {
                // Se la selezione è vuota, salta
                if (sel.isEmpty) continue;
                const length = doc.getText(sel).length;
                editBuilder.replace(sel, '*'.repeat(length));
            }
        });
    });
    context.subscriptions.push(selectionToStars);
    // Comando per pulizia universale: rimuove fino a 9 asterischi da colonna 7, non aggiunge nulla
    let clearStars = vscode.commands.registerCommand('commentirpg.clearStars', function () {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            return;
        }
        const allowedLangs = ['rpgle', 'rpg', 'lf', 'dspf'];
        const doc = editor.document;
        if (!allowedLangs.includes(doc.languageId)) {
            return;
        }
        const config = vscode.workspace.getConfiguration();
        const fullClean = config.get('commentirpg.fullUniversalCleaner', false);
        const selections = editor.selections;
        editor.edit(editBuilder => {
            for (const sel of selections) {
                const startLine = sel.start.line;
                const endLine = sel.end.line;
                for (let lineNumber = startLine; lineNumber <= endLine; lineNumber++) {
                    const line = doc.lineAt(lineNumber);
                    let text = line.text;
                    if (text.length < 6) {
                        text = text + ' '.repeat(6 - text.length + 1);
                    }
                    const colIndex = 6;
                    let starsFound = 0;
                    const maxScan = fullClean ? text.length - colIndex : 9;
                    for (let i = 0; i < maxScan; i++) {
                        if ((text[colIndex + i] || ' ') === '*') starsFound++; else break;
                    }
                    if (starsFound > 0) {
                        const start = new vscode.Position(lineNumber, colIndex);
                        const end = new vscode.Position(lineNumber, colIndex + starsFound);
                        editBuilder.replace(new vscode.Range(start, end), ' '.repeat(starsFound));
                    }
                }
            }
        });
    });
    context.subscriptions.push(clearStars);
    // Funzione generica per inserire/toggle N asterischi
    function registerInsertStarsCommand(n) {
        let cmd = vscode.commands.registerCommand('commentirpg.insertStars' + n, function () {
            const editor = vscode.window.activeTextEditor;
            if (!editor) {
                return;
            }
            const allowedLangs = ['rpgle', 'rpg', 'lf', 'dspf'];
            const doc = editor.document;
            if (!allowedLangs.includes(doc.languageId)) {
                return;
            }

            const selections = editor.selections;
            const baseColIndex = 6; // column 7
            const starsToInsert = n;

            editor.edit(editBuilder => {
                for (const sel of selections) {
                    const startLine = sel.start.line;
                    const endLine = sel.end.line;
                    for (let lineNumber = startLine; lineNumber <= endLine; lineNumber++) {
                        const line = doc.lineAt(lineNumber);
                        let text = line.text;

                        // Ensure we have enough length to reach starting column
                        if (text.length <= baseColIndex) {
                            const padNeeded = baseColIndex - text.length;
                            if (padNeeded > 0) {
                                const padPos = new vscode.Position(lineNumber, text.length);
                                editBuilder.insert(padPos, ' '.repeat(padNeeded));
                            }
                        }

                        // Calcola range esistente dei prossimi n caratteri
                        let existing = '';
                        for (let i = 0; i < starsToInsert; i++) {
                            existing += (doc.lineAt(lineNumber).text[baseColIndex + i] || ' ');
                        }

                        // Se già tutti '*', allora li rimuove (toggle), altrimenti li scrive
                        const allStars = existing.split('').every(c => c === '*');
                        const start = new vscode.Position(lineNumber, baseColIndex);
                        const end = new vscode.Position(lineNumber, baseColIndex + starsToInsert);
                        if (allStars) {
                            editBuilder.replace(new vscode.Range(start, end), ' '.repeat(starsToInsert));
                        } else {
                            editBuilder.replace(new vscode.Range(start, end), '*'.repeat(starsToInsert));
                        }
                    }
                }
            });
        });
        context.subscriptions.push(cmd);
    }

    // Registra i comandi per 2-9 asterischi
    [2, 3, 4, 5, 6, 7, 8, 9].forEach(registerInsertStarsCommand);

    let disposable = vscode.commands.registerCommand('commentirpg.toggleColumn7Comment', function () {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            return;
        }

        // Limita ai linguaggi IBM i
        const allowedLangs = ['rpgle', 'rpg', 'lf', 'dspf'];
        const doc = editor.document;
        if (!allowedLangs.includes(doc.languageId)) {
            // Non fare nulla: lascia che il keybinding standard di VS Code agisca
            return;
        }
        const config = vscode.workspace.getConfiguration();
        const fullClean = config.get('commentirpg.fullUniversalCleaner', false);

        const selections = editor.selections;

        editor.edit(editBuilder => {
            for (const sel of selections) {
                // Determine range of lines to operate on
                const startLine = sel.start.line;
                const endLine = sel.end.line;

                for (let lineNumber = startLine; lineNumber <= endLine; lineNumber++) {
                    const line = doc.lineAt(lineNumber);
                    let text = line.text;

                    // Ensure we have at least 7 columns (1-based). Column 7 is index 6.
                    if (text.length < 6) {
                        // pad with spaces up to index 6
                        text = text + ' '.repeat(6 - text.length + 1);
                    }

                    const colIndex = 6; // zero-based index for column 7
                    // Conta asterischi consecutivi dalla colonna 7 (limite 9 o illimitato da setting)
                    let starsFound = 0;
                    const maxScan = fullClean ? text.length - colIndex : 9;
                    for (let i = 0; i < maxScan; i++) {
                        if ((text[colIndex + i] || ' ') === '*') starsFound++; else break;
                    }

                    if (starsFound > 0) {
                        // Rimuovi tutti gli asterischi trovati (max 9)
                        const start = new vscode.Position(lineNumber, colIndex);
                        const end = new vscode.Position(lineNumber, colIndex + starsFound);
                        editBuilder.replace(new vscode.Range(start, end), ' '.repeat(starsFound));
                    } else {
                        // Inserisci un solo asterisco
                        if (line.text.length <= colIndex) {
                            const padStart = new vscode.Position(lineNumber, line.text.length);
                            editBuilder.insert(padStart, ' '.repeat(colIndex - line.text.length) + '*');
                        } else {
                            const start = new vscode.Position(lineNumber, colIndex);
                            const end = new vscode.Position(lineNumber, colIndex + 1);
                            editBuilder.replace(new vscode.Range(start, end), '*');
                        }
                    }
                }
            }
        });
    });

    context.subscriptions.push(disposable);


}

function deactivate() {}

module.exports = {
    activate,
    deactivate
};
